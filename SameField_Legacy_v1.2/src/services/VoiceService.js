import { joinRoom } from 'trystero/nostr';

const SOUNDS = {
    JOIN: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA',
    LEAVE: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA'
};

const playSound = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'JOIN') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        } else {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
        }
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) { console.error("Sound Error", e); }
};

class VoiceService {
    constructor() {
        this.currentRoom = null;
        this.roomInstance = null;
        this.presenceInstance = null;

        this.participants = [];
        this.listeners = [];
        this.isTransiting = false;

        // Unified Stable ID
        let stableId = localStorage.getItem('samefield_p2p_id');
        if (!stableId) {
            stableId = 'p2p_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('samefield_p2p_id', stableId);
        }
        this.stableId = stableId;

        const savedName = localStorage.getItem('samefield_username');
        this.localUser = {
            id: stableId, // Use stable ID as the local user ID
            name: savedName || 'Guest',
            isMuted: true,
            isVideoEnabled: false,
            isSpeaking: false,
            isDeafened: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedName || 'Guest'}`
        };

        this.rooms = [
            { id: 'samefield_v1', name: 'General Chat', type: 'voice', users: [] },
            { id: 'samefield_v2', name: 'Match Watch Party', type: 'voice', users: [] }
        ];

        this.onlineUsers = {};
        this.lastHeartbeat = {};
        this.simulationInterval = null;
        this.heartbeatInterval = null;
        this.roomMetaInterval = null; // New interval for room metadata
        this.remoteStreams = {}; // peerId -> stream
        this.speakAction = null;
        this.presenceAction = null;
        this.metaAction = null; // New action for room metadata

        setTimeout(() => this.initGlobalPresence(), 1000);

        window.addEventListener('usernameUpdated', () => {
            const newName = localStorage.getItem('samefield_username');
            if (newName) {
                this.localUser.name = newName;
                this.localUser.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`;
                this.broadcastPresence();
                this.notify();
            }
        });

        window.addEventListener('beforeunload', () => {
            this.leaveRoom();
            if (this.presenceInstance) this.presenceInstance.leave();
        });

        window.voiceService = this;
        setInterval(() => this.cleanupStaleUsers(), 10000);
    }

    getRooms() {
        return this.rooms.map(room => {
            const usersInRoom = Object.values(this.onlineUsers)
                .filter(u => u.currentRoomId === room.id && u.id !== this.localUser.id)
                .map(u => ({ ...u, isLocal: false }));

            if (this.currentRoom && this.currentRoom.id === room.id) {
                usersInRoom.push({ ...this.localUser, isLocal: true });
            }

            return { ...room, users: usersInRoom };
        });
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notify() {
        this.listeners.forEach(cb => cb({
            currentRoom: this.currentRoom,
            rooms: this.getRooms(),
            localUser: { ...this.localUser },
            remoteStreams: { ...this.remoteStreams },
            localStream: this.localStream
        }));
    }

    initGlobalPresence() {
        if (this.presenceInstance) return;
        const RELAYS = [
            'wss://relay.damus.io',
            'wss://nos.lol',
            'wss://relay.snort.social',
            'wss://relay.current.fyi'
        ];
        // Use stableId as the peer ID for global presence
        const config = { appId: 'samefield_sports_v5', relayUrls: RELAYS };

        try {
            this.presenceInstance = joinRoom(config, 'lobby');
            const [sendPresence, getPresence] = this.presenceInstance.makeAction('presence');
            this.presenceAction = sendPresence;

            getPresence((data, peerId) => {
                // Incoming peerId is our stableId from 'getSync' scope
                this.onlineUsers[peerId] = {
                    id: peerId,
                    name: data.name,
                    currentRoomId: data.currentRoomId,
                    isVideoEnabled: data.isVideoEnabled || false,
                    isSpeaking: data.isSpeaking || false,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
                };
                this.lastHeartbeat[peerId] = Date.now();
                this.notify();
            });

            this.presenceInstance.onPeerJoin(peerId => {
                this.broadcastPresence();
            });

            this.presenceInstance.onPeerLeave(peerId => {
                delete this.onlineUsers[peerId];
                delete this.lastHeartbeat[peerId];
                this.notify();
            });

            this.heartbeatInterval = setInterval(() => this.broadcastPresence(), 4000);
            this.broadcastPresence();
        } catch (e) {
            console.error("Global Presence Failed", e);
        }
    }

    cleanupStaleUsers() {
        const now = Date.now();
        Object.keys(this.lastHeartbeat).forEach(peerId => {
            // Aggressive purge for "tester" or "Guest" ghosts
            const user = this.onlineUsers[peerId];
            const isTester = user && (user.name === 'Guest' || user.name === 'Fan' || user.name.includes('Tester'));

            if (now - this.lastHeartbeat[peerId] > (isTester ? 8000 : 15000)) {
                delete this.onlineUsers[peerId];
                delete this.lastHeartbeat[peerId];
            }
        });
        this.notify();
    }

    broadcastPresence() {
        if (this.presenceAction) {
            this.presenceAction({
                name: this.localUser.name,
                currentRoomId: this.currentRoom ? this.currentRoom.id : null,
                isVideoEnabled: this.localUser.isVideoEnabled,
                isSpeaking: this.localUser.isSpeaking
            });
        }
    }

    async joinRoom(roomId) {
        if (this.isTransiting) return;
        this.isTransiting = true;

        try {
            if (this.currentRoom?.id === roomId) return;
            if (this.currentRoom) await this.leaveRoom();

            const room = this.rooms.find(r => r.id === roomId);
            if (!room) return;

            this.currentRoom = room;
            this.broadcastPresence();
            this.notify();
            playSound('JOIN');

            const RELAYS = [
                'wss://relay.damus.io',
                'wss://nos.lol',
                'wss://relay.snort.social',
                'wss://relay.current.fyi'
            ];
            // Use stableId for room-specific connections too
            const config = { appId: 'samefield_sports_v5_rooms', relayUrls: RELAYS };
            this.roomInstance = joinRoom(config, roomId);

            // Action for real-time metadata (name mapping)
            const [sendMeta, getMeta] = this.roomInstance.makeAction('meta');
            this.metaAction = sendMeta;
            getMeta((data, peerId) => {
                if (this.onlineUsers[peerId]) {
                    this.onlineUsers[peerId] = { ...this.onlineUsers[peerId], ...data };
                    this.notify();
                }
            });

            const [sendSpeaking, getSpeaking] = this.roomInstance.makeAction('speak');
            this.speakAction = sendSpeaking;
            getSpeaking((data, peerId) => {
                if (this.onlineUsers[peerId]) {
                    this.onlineUsers[peerId].isSpeaking = data.isSpeaking;
                    this.notify();
                }
            });

            this.roomInstance.onPeerJoin(peerId => {
                playSound('JOIN');
                this.broadcastRoomMeta();
                if (this.localStream) {
                    // Slight delay to ensure PeerConnection is ready
                    setTimeout(() => this.roomInstance.addStream(this.localStream, peerId), 500);
                }
            });

            this.roomInstance.onPeerLeave(peerId => {
                playSound('LEAVE');
                delete this.remoteStreams[peerId];
                this.notify();
            });

            this.roomInstance.onPeerStream((stream, peerId) => {
                console.log("[Voice] Received stream from", peerId);
                this.remoteStreams[peerId] = stream;
                this.notify();
                this.broadcastRoomMeta(); // Sync meta again when stream arrives
            });

            // Start room-specific metadata heartbeat
            this.roomMetaInterval = setInterval(() => this.broadcastRoomMeta(), 2000);

            if (!this.localUser.isMuted || this.localUser.isVideoEnabled) {
                await this.updateMediaStream();
            }

        } catch (error) {
            console.error("[Voice] Join Error:", error);
            await this.leaveRoom();
        } finally {
            this.isTransiting = false;
        }
    }

    broadcastRoomMeta() {
        if (this.metaAction) {
            this.metaAction({
                name: this.localUser.name,
                isVideoEnabled: this.localUser.isVideoEnabled,
                avatar: this.localUser.avatar
            });
        }
    }

    async leaveRoom() {
        if (!this.currentRoom) return;
        playSound('LEAVE');

        if (this.roomMetaInterval) clearInterval(this.roomMetaInterval);
        if (this.roomInstance) {
            this.roomInstance.leave();
            this.roomInstance = null;
        }

        this.remoteStreams = {};
        this.speakAction = null;
        this.metaAction = null;
        this.stopLocalStream();
        this.currentRoom = null;
        this.broadcastPresence();
        this.notify();
    }

    async toggleMute() {
        this.localUser.isMuted = !this.localUser.isMuted;
        await this.updateMediaStream();
        this.notify();
    }

    async toggleVideo() {
        this.localUser.isVideoEnabled = !this.localUser.isVideoEnabled;
        await this.updateMediaStream();
        this.notify();
    }

    async updateMediaStream() {
        const constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            },
            video: {
                width: { ideal: 640 },
                height: { ideal: 360 },
                frameRate: { ideal: 15 }
            }
        };

        try {
            if (!this.localStream) {
                console.log("[Voice] Initializing new MediaStream");
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.localStream = stream;
                if (this.roomInstance) {
                    this.roomInstance.addStream(stream);
                }
                this.startMicMonitoring(stream);
            }

            // Sync track states WITHOUT stopping the stream
            const audioTrack = this.localStream.getAudioTracks()[0];
            const videoTrack = this.localStream.getVideoTracks()[0];

            if (audioTrack) {
                audioTrack.enabled = !this.localUser.isMuted;
                console.log(`[Voice] Audio track ${audioTrack.enabled ? 'ENABLED' : 'DISABLED'}`);
            }

            if (videoTrack) {
                videoTrack.enabled = this.localUser.isVideoEnabled;
                console.log(`[Voice] Video track ${videoTrack.enabled ? 'ENABLED' : 'DISABLED'}`);
            }

            this.broadcastPresence();
            this.broadcastRoomMeta();
            this.notify();

        } catch (err) {
            console.error("Media Access Denied:", err);
            this.localUser.isMuted = true;
            this.localUser.isVideoEnabled = false;
            this.notify();
        }
    }

    stopLocalStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                track.stop();
                if (this.roomInstance) this.roomInstance.removeStream(this.localStream);
            });
            this.localStream = null;
        }
        this.stopMicMonitoring();
        this.notify();
    }

    startMicMonitoring(stream) {
        if (!stream || stream.getAudioTracks().length === 0) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (this.audioContext) this.audioContext.close();

            this.audioContext = new AudioContext();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.analyser.fftSize = 128;
            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            this.simulationInterval = setInterval(() => {
                if (!this.currentRoom || this.localUser.isMuted) return;
                this.analyser.getByteFrequencyData(dataArray);
                const sum = dataArray.reduce((a, b) => a + b, 0);
                const avg = sum / dataArray.length;
                const isSpeakingNow = avg > 20;

                if (this.localUser.isSpeaking !== isSpeakingNow) {
                    this.localUser.isSpeaking = isSpeakingNow;
                    if (this.speakAction) this.speakAction({ isSpeaking: isSpeakingNow });
                    this.notify();
                }
            }, 150);
        } catch (e) { console.error("Mic Monitor Error", e); }
    }

    stopMicMonitoring() {
        if (this.simulationInterval) clearInterval(this.simulationInterval);
        this.localUser.isSpeaking = false;
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

export const voiceService = new VoiceService();
