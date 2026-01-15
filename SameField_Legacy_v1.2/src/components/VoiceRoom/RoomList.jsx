import React, { useEffect, useRef } from 'react';
import { useVoice } from '../../context/VoiceContext';
import { Mic, MicOff, Video, VideoOff, Volume2, LogOut, User } from 'lucide-react';

const VideoFeed = ({ stream, isLocal, name }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.warn("Video Play Error", e));
        }
    }, [stream]);

    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group">
            {stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-surfaceHighlight">
                    <User size={32} className="text-white/20" />
                </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase border border-white/10">
                {name} {isLocal && '(You)'}
            </div>
        </div>
    );
};

const RoomList = () => {
    const {
        rooms,
        currentRoom,
        joinRoom,
        leaveRoom,
        localUser,
        toggleMute,
        toggleVideo,
        remoteStreams,
        localStream
    } = useVoice();

    // Check if any peer has video enabled
    const activeVideoPeers = Object.entries(remoteStreams || {}).filter(([peerId, stream]) =>
        stream && typeof stream.getVideoTracks === 'function' && stream.getVideoTracks().length > 0
    );

    return (
        <div className="w-80 bg-[#0a0a0a] border-l border-white/10 flex flex-col hidden lg:flex shrink-0">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-black uppercase text-sm flex items-center gap-2">
                    <Volume2 size={16} className="text-primary" /> Voice & Video
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* VIDEO GRID IF IN ROOM */}
                {currentRoom && (
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Feeds</span>
                        <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
                            {localUser.isVideoEnabled && <VideoFeed stream={localStream} isLocal={true} name={localUser.name} />}
                            {activeVideoPeers.map(([peerId, stream]) => {
                                // Find user in ANY room by peerId (stable ID)
                                const user = (rooms || []).flatMap(r => r.users || []).find(u => u.id === peerId);
                                return (
                                    <VideoFeed
                                        key={peerId}
                                        stream={stream}
                                        isLocal={false}
                                        name={user ? user.name : 'Connecting...'}
                                    />
                                );
                            })}
                            {!localUser.isVideoEnabled && activeVideoPeers.length === 0 && (
                                <div className="p-4 border border-white/5 bg-white/5 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">No cameras active</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ROOM LIST */}
                <div className="space-y-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available Rooms</span>
                    {(rooms || []).map(room => (
                        <div key={room.id} className="space-y-2">
                            <div
                                onClick={() => joinRoom(room.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-colors ${currentRoom?.id === room.id ? 'bg-[#1a1a1a] border-primary' : 'bg-[#111] border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-white text-sm">{room.name}</h4>
                                    <span className="text-[10px] text-gray-500 font-bold">{room.users.length} Users</span>
                                </div>
                                {currentRoom?.id === room.id && <span className="text-[10px] text-green-500 font-bold uppercase flex items-center gap-1 mt-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Connected</span>}
                            </div>

                            {/* User Presence Tree */}
                            <div className="pl-4 space-y-2">
                                {(room.users || []).map((u) => (
                                    <div key={u.id} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full border border-white/10 overflow-hidden relative">
                                            <img src={u.avatar} className="w-full h-full object-cover" alt="" />
                                            {u.isSpeaking && <div className="absolute inset-0 border-2 border-green-500 animate-pulse rounded-full" />}
                                        </div>
                                        <span className={`text-xs font-bold ${u.isLocal ? 'text-primary' : 'text-gray-400'}`}>{u.name}</span>
                                        {u.isVideoEnabled && <Video size={10} className="text-primary" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CONTROLS FOOTER */}
            {currentRoom && (
                <div className="p-4 border-t border-white/10 bg-[#111] space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={toggleMute}
                            className={`flex-1 p-3 rounded-lg flex items-center justify-center transition-all ${localUser.isMuted ? 'bg-red-500/10 text-red-500' : 'bg-primary text-black font-bold'}`}
                            title={localUser.isMuted ? "Unmute" : "Mute"}
                        >
                            {localUser.isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`flex-1 p-3 rounded-lg flex items-center justify-center transition-all ${!localUser.isVideoEnabled ? 'bg-white/5 text-gray-500' : 'bg-primary text-black font-bold'}`}
                            title={localUser.isVideoEnabled ? "Disable Camera" : "Enable Camera"}
                        >
                            {localUser.isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                        </button>
                    </div>
                    <button onClick={leaveRoom} className="w-full py-2 bg-red-500/10 text-red-500 text-xs font-black uppercase rounded hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <LogOut size={16} /> Disconnect
                    </button>
                </div>
            )}
        </div>
    );
};

export default RoomList;

