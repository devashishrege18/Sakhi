import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, Zap, Radio, AlertTriangle } from 'lucide-react';
import { forumService } from '../services/ForumService';
import '../styles/components/Forum.css';

const Forum = () => {
    const [threads, setThreads] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    // Filters from mockData Categories
    const filters = ['All', 'Live Match Reactions', 'Player Performance Talk', 'Tactical Analysis', 'Fan Predictions'];

    useEffect(() => {
        // Initial Load
        loadThreads();

        // Simulate Real-time Updates
        const interval = setInterval(() => {
            // Force refresh threads to show vote increment
            setThreads([...forumService.getThreads(filter)]);
        }, 3000);

        // Backend simulation of activity
        forumService.simulateLiveActivity((id) => {
            // Optional: Add toast or visual indicator logic here
        });

        return () => clearInterval(interval);
    }, [filter]);

    const loadThreads = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setThreads(forumService.getThreads(filter));
            setLoading(false);
        }, 500);
    };

    const handleCreateMockThread = () => {
        // Simulate user creating a thread
        forumService.createThread({
            title: "New AI Analysis: Rohit's Captaincy",
            author: "You (Demo)",
            category: "Tactical Analysis",
            aiTags: ["User Generated", "Pending Review"],
            content: "Just creating a test thread to show dynamic updates...",
            votes: 1
        });
        loadThreads();
    };

    return (
        <div className="forum-container">
            <div className="forum-header">
                <h2 className="section-title">Community Forum</h2>
                <button className="btn-create" onClick={handleCreateMockThread}>
                    + New Discussion
                </button>
            </div>

            <div className="forum-layout">
                {/* Main Feed */}
                <div className="forum-main">

                    {/* Filters */}
                    <div className="forum-filters">
                        {filters.map(f => (
                            <button
                                key={f}
                                className={`filter-pill ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading discussions...</div>
                    ) : (
                        <div className="thread-list">
                            {threads.map(thread => (
                                <div key={thread.id} className={`thread-card ${thread.isLive ? 'live-thread' : ''}`}>
                                    <div className="vote-column">
                                        <button className="btn-vote"><ArrowUp size={18} /></button>
                                        <span className="vote-count">{thread.votes}</span>
                                    </div>

                                    <div className="thread-content">
                                        <div className="thread-meta">
                                            <span className="thread-category">{thread.category}</span>
                                            <span className="dot">•</span>
                                            <span className="thread-author">Posted by {thread.author}</span>
                                            <span className="dot">•</span>
                                            <span className="thread-time">2m ago</span>
                                        </div>

                                        <h3 className="thread-title">
                                            {thread.isLive && <span className="badge-live"><Radio size={12} /> LIVE</span>}
                                            {thread.title}
                                        </h3>

                                        <p className="thread-snippet">{thread.content.substring(0, 100)}...</p>

                                        {thread.aiSummary && (
                                            <div className="ai-summary-box">
                                                <Zap size={12} className="ai-icon" />
                                                <span className="ai-label">AI Summary:</span>
                                                <span className="ai-text">{thread.aiSummary}</span>
                                            </div>
                                        )}

                                        <div className="thread-tags">
                                            {thread.aiTags?.map(tag => (
                                                <span key={tag} className="ai-tag">#{tag}</span>
                                            ))}
                                            {thread.isToxic && <span className="warning-tag"><AlertTriangle size={12} /> Flagged</span>}
                                        </div>

                                        <div className="thread-actions">
                                            <div className="action-pill"><MessageSquare size={14} /> {thread.comments} Comments</div>
                                            <div className="action-pill">Share</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="forum-sidebar">
                    <div className="sidebar-card live-now">
                        <h3><Radio size={16} className="icon-pulse" /> Live Events</h3>
                        <ul className="live-list">
                            <li>India vs Australia <span className="live-tag">LIVE</span></li>
                            <li>Mumbai vs Chennai <span className="live-tag">LIVE</span></li>
                        </ul>
                        <button className="btn-join-live">Join Live Chat</button>
                    </div>

                    <div className="sidebar-card">
                        <h3>Trending Topics</h3>
                        <ul>
                            <li>#WPL2025</li>
                            <li>#ViratKohli</li>
                            <li>#MixedCricket</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
