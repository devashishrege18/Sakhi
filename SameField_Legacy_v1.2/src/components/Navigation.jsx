import React, { useState } from 'react';
import { Menu, Home, Video, Users, Trophy, MessageSquare, Calendar, User, Activity } from 'lucide-react';
import '../styles/components/Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'matches', icon: Activity, label: 'Live Matches' },
        { id: 'highlights', icon: Video, label: 'Highlights' },
        { id: 'fandom', icon: Users, label: 'Fandom' },
        { id: 'kid', icon: Trophy, label: 'KID Leaderboard' },
        { id: 'meet', icon: User, label: 'Meet Players' },
        { id: 'forum', icon: MessageSquare, label: 'Forum' },
        { id: 'news', icon: Calendar, label: 'News & Events' },
    ];

    return (
        <nav
            className={`navigation ${isExpanded ? 'expanded' : ''}`}
        >
            <div
                className="nav-header"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer' }}
            >
                <Menu className="menu-icon" />
                <span className="logo-text">SF Sports</span>
            </div>

            <div className="nav-items">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <item.icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;
