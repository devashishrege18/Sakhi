import React from 'react';
import { Play } from 'lucide-react';
import '../styles/components/Highlights.css';

const Highlights = () => {
    const highlights = [
        { id: 1, title: 'Top 10 Goals - Week 5', duration: '5:20', views: '12K' },
        { id: 2, title: 'Your Custom Reel: Speed Plays', duration: '3:10', views: 'Personal', personalized: true },
        { id: 3, title: 'Defensive Masterclass', duration: '4:45', views: '8.5K' },
        { id: 4, title: 'Funny Moments', duration: '2:30', views: '50K' },
    ];

    return (
        <div className="highlights-container">
            <h2 className="section-title">Highlights For You</h2>

            <div className="highlights-scroll">
                {highlights.map(item => (
                    <div key={item.id} className="highlight-card">
                        <div className={`thumbnail ${item.personalized ? 'personalized' : ''}`}>
                            <div className="play-icon"><Play fill="currentColor" /></div>
                            {item.personalized && <div className="ai-badge">AI Pick</div>}
                            <div className="duration">{item.duration}</div>
                        </div>
                        <div className="highlight-info">
                            <h3>{item.title}</h3>
                            <span>{item.views} views</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Highlights;
