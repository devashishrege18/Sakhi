import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceService } from '../services/VoiceService';

const VoiceContext = createContext();

export const useVoice = () => useContext(VoiceContext);

export const VoiceProvider = ({ children }) => {
    const [voiceState, setVoiceState] = useState({
        rooms: [],
        currentRoom: null,
        localUser: { isMuted: true, isVideoEnabled: false, isDeafened: false },
        remoteStreams: {},
        localStream: null
    });

    useEffect(() => {
        const updateState = (state) => {
            if (state) {
                setVoiceState({
                    rooms: state.rooms || [],
                    currentRoom: state.currentRoom || null,
                    localUser: state.localUser || { isMuted: true, isVideoEnabled: false, isDeafened: false },
                    remoteStreams: state.remoteStreams || {},
                    localStream: state.localStream || null
                });
            }
        };

        const unsubscribe = voiceService.subscribe(updateState);
        return unsubscribe;
    }, []);

    const joinRoom = (roomId) => voiceService.joinRoom(roomId);
    const leaveRoom = () => voiceService.leaveRoom();
    const toggleMute = () => voiceService.toggleMute();
    const toggleVideo = () => voiceService.toggleVideo();
    const createRoom = (name) => voiceService.createRoom(name);

    return (
        <VoiceContext.Provider value={{
            ...voiceState,
            joinRoom,
            leaveRoom,
            createRoom,
            toggleMute,
            toggleVideo
        }}>
            {children}
        </VoiceContext.Provider>
    );
};
