import React, { useState, useEffect, useRef } from 'react';
import { Play, MessageSquare, Share2, Heart, Send, Smile, ArrowUpRight, Trash2 } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import { liveStreamService } from '../services/LiveStreamService';
import { streamChatService } from '../services/StreamChatService';
import { voiceService } from '../services/VoiceService'; // For user name

const Watch = () => {
    const { addPoints } = usePoints();
    const [channels] = useState(liveStreamService.getChannels());
    const [currentChannel, setCurrentChannel] = useState(channels[0]);
    const [isLoading, setIsLoading] = useState(true);

    // Chat State
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [reactions, setReactions] = useState([]); // Array of { id, type, x, y } for animation
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const handleNextStream = () => {
        setIsLoading(true);
        // Algorithm: Auto-select next based on 70/30 ratio
        const next = liveStreamService.getWeightedStream(currentChannel.id);
        setCurrentChannel(next);

        // Re-init chat
        streamChatService.init(next.id);
        setMessages([]); // Clear chat for new room

        setTimeout(() => setIsLoading(false), 1500);
    };

    const handleChannelChange = (channel) => {
        setIsLoading(true);
        setCurrentChannel(channel);

        // Init Chat for this specific channel
        streamChatService.init(channel.id);

        setTimeout(() => setIsLoading(false), 1500);
    };

    // Initial Load & Channel Change (for cleanup)
    useEffect(() => {
        // Initialize chat for the initially loaded channel
        streamChatService.init(currentChannel.id);
        setTimeout(() => setIsLoading(false), 1500);

        // Cleanup on unmount
        return () => streamChatService.leave();
    }, [currentChannel.id]); // Re-run if initial channel changes


    // Chat Subscription
    useEffect(() => {
        const unsubscribe = streamChatService.subscribe((type, payload) => {
            if (type === 'messages') {
                setMessages(payload || []);
                scrollToBottom();
            }
            if (type === 'reaction') {
                triggerReaction(payload);
            }
        });
        return unsubscribe;
    }, []);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Animation Logic
    const triggerReaction = (type) => {
        const id = Date.now() + Math.random();
        // Random X start position (10% to 90%)
        const startX = Math.random() * 80 + 10;

        setReactions(prev => [...prev, { id, type, x: startX }]);

        // Remove after animation (2s)
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== id));
        }, 2000);
    };

    const handleSendReaction = (type) => {
        streamChatService.sendReaction(type);
        triggerReaction(type); // Show local instantly
        addPoints(1, 'Reaction Sent');
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const username = localStorage.getItem('samefield_username') || 'You';
        streamChatService.sendMessage(newMessage, username);
        setNewMessage('');
        addPoints(2, 'Chat Message');
    };

    const handleDeleteMessage = async (messageId) => {
        await streamChatService.deleteMessage(messageId);
    };

    // Points Loop
    useEffect(() => {
        const interval = setInterval(() => addPoints(10, 'Watching Sports Bonus'), 30000);
        return () => clearInterval(interval);
    }, [addPoints]);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden gap-4 p-4">

            {/* LEFT: Video Player (Flexible Width) */}
            <div className="flex-1 bg-black rounded-2xl border border-surfaceHighlight overflow-hidden relative shadow-2xl flex flex-col min-h-[300px] lg:min-h-0">

                {/* FLOATING REACTIONS OVERLAY */}
                <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                    {reactions.map(r => (
                        <div
                            key={r.id}
                            className="absolute bottom-0 text-4xl animate-float-up opacity-0"
                            style={{ left: `${r.x}%`, animationDuration: '2s' }}
                        >
                            {r.type === 'heart' ? '❤️' : r.type === 'fire' ? '🔥' : '💯'}
                        </div>
                    ))}
                </div>

                {/* Video Player Container */}
                <div className="relative flex-1 bg-black group">
                    {/* Overlay Info */}
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded flex items-center gap-2 animate-pulse shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full" /> Live
                            </span>
                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase rounded border border-white/10 shadow-lg">
                                {currentChannel.type}
                            </span>
                        </div>
                    </div>

                    {/* Smart Controls: Next Stream / Auto-Fix */}
                    <div className="absolute top-4 right-4 z-30 flex gap-2">
                        <button
                            onClick={handleNextStream}
                            className="px-3 py-1.5 bg-surfaceHighlight/80 backdrop-blur-md text-white text-xs font-bold uppercase rounded border border-white/10 hover:bg-white hover:text-black transition-all flex items-center gap-2"
                        >
                            <span>Next Stream</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs font-bold text-textMuted uppercase tracking-widest">Loading Stream...</span>
                            </div>
                        </div>
                    )}

                    <iframe
                        className="w-full h-full object-cover"
                        src={`${currentChannel.url}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                        title="Live Stream"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* REACTION BAR (Bottom Center) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => handleSendReaction('heart')} className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500/20 hover:scale-110 transition-all border border-white/10">❤️</button>
                        <button onClick={() => handleSendReaction('fire')} className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-orange-500/20 hover:scale-110 transition-all border border-white/10">🔥</button>
                        <button onClick={() => handleSendReaction('100')} className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-green-500/20 hover:scale-110 transition-all border border-white/10">💯</button>
                    </div>
                </div>

                {/* Channel Info */}
                <div className="h-16 bg-surface border-t border-surfaceHighlight flex items-center justify-between px-6 shrink-0">
                    <div>
                        <h2 className="text-white font-black text-lg uppercase tracking-wide truncate max-w-[200px] md:max-w-md">{currentChannel.name}</h2>
                        <p className="text-xs text-textMuted font-medium truncate">{currentChannel.description}</p>
                    </div>
                </div>
            </div>

            {/* RIGHT: Chat & Channel List (Width 350px) */}
            <div className="w-full lg:w-[350px] flex flex-col gap-4 h-[400px] lg:h-auto shrink-0">

                {/* Tab Switcher (Chat vs Channels) - For simplicity, stacked for now */}

                {/* LIVE CHAT AREA */}
                <div className="flex-1 bg-surface rounded-xl border border-surfaceHighlight overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-surfaceHighlight flex justify-between items-center bg-black/20">
                        <span className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-3 h-3" /> Live Chat
                        </span>
                        <span className="text-[10px] text-textMuted">{messages.length} msgs</span>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 font-medium" ref={chatContainerRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-baseline gap-2 max-w-[90%] ${msg.isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className={`text-[10px] font-bold ${msg.isSelf ? 'text-primary' : 'text-blue-400'}`}>
                                        {msg.user}
                                    </span>
                                    <div className={`px-3 py-1.5 rounded-lg text-xs leading-5 break-words relative group ${msg.type === 'system' ? 'bg-yellow-500/10 text-yellow-500 text-center w-full' :
                                        msg.isSelf ? 'bg-primary/10 text-white' : 'bg-surfaceHighlight text-gray-200'
                                        }`}>
                                        {msg.text}
                                        {msg.isSelf && (
                                            <button
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="absolute -left-6 top-1/2 -translate-y-1/2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete Message"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-black/20 border-t border-surfaceHighlight flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Say something..."
                            className="flex-1 bg-black/40 border border-surfaceHighlight rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-colors"
                        />
                        <button type="submit" className="p-2 bg-primary text-black rounded-lg hover:bg-white transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* CHANNEL LIST (Compact) */}
                <div className="h-[150px] lg:h-[200px] bg-surface rounded-xl border border-surfaceHighlight overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-surfaceHighlight bg-black/20">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Up Next</span>
                    </div>
                    <div className="overflow-y-auto p-2 space-y-2">
                        {channels.filter(c => c.id !== currentChannel.id).map(channel => (
                            <div
                                key={channel.id}
                                onClick={() => handleChannelChange(channel)}
                                className="flex gap-2 items-center p-2 rounded-lg hover:bg-surfaceHighlight/50 cursor-pointer transition-colors group"
                            >
                                <div className="w-16 h-10 rounded-md overflow-hidden relative shrink-0">
                                    <img src={channel.thumbnail} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-gray-300 group-hover:text-white truncate">{channel.name}</h4>
                                    <p className="text-[10px] text-textMuted bg-surfaceHighlight/50 inline-block px-1 rounded">{channel.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Watch;
