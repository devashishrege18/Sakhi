import React, { useState } from 'react';
import { Mic, Cpu, Radio } from 'lucide-react';
import '../styles/components/Commentary.css';

const Commentary = () => {
    const [activeMode, setActiveMode] = useState('both'); // both, ai, human

    const humanComments = [
        { id: 1, time: '67:23', text: 'What a strike! The technique on that volley was absolute class.', author: 'John M. (Comm)' },
        { id: 2, time: '65:00', text: 'Substitution for City Strikers. Looks like they want more pace.', author: 'Sarah K. (Analyst)' },
    ];

    const aiAnalysis = [
        { id: 1, time: '67:24', text: 'Shot Probability: 8% | xG: 0.04 | Speed: 102 km/h', type: 'stat' },
        { id: 2, time: '66:10', text: 'Pattern Detected: High press intensity increased by 15% in last 5 mins.', type: 'insight' },
    ];

    return (
        <div className="commentary-container">
            <h2 className="section-title">Live Commentary</h2>

            <div className="comm-controls">
                <button className={`comm-btn ${activeMode === 'both' ? 'active' : ''}`} onClick={() => setActiveMode('both')}>
                    Split View
                </button>
                <button className={`comm-btn ${activeMode === 'ai' ? 'active' : ''}`} onClick={() => setActiveMode('ai')}>
                    <Cpu size={16} /> AI Only
                </button>
                <button className={`comm-btn ${activeMode === 'human' ? 'active' : ''}`} onClick={() => setActiveMode('human')}>
                    <Mic size={16} /> Human Only
                </button>
            </div>

            <div className={`comm-grid ${activeMode}`}>
                {(activeMode === 'both' || activeMode === 'human') && (
                    <div className="comm-column human">
                        <div className="col-header">
                            <Mic className="icon-pulse" /> Human Commentary
                        </div>
                        <div className="comm-feed">
                            {humanComments.map(c => (
                                <div key={c.id} className="comm-item human-item">
                                    <div className="comm-time">{c.time}</div>
                                    <div className="comm-text">{c.text}</div>
                                    <div className="comm-author">{c.author}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(activeMode === 'both' || activeMode === 'ai') && (
                    <div className="comm-column ai">
                        <div className="col-header">
                            <Cpu className="icon-spin" /> AI Analysis
                        </div>
                        <div className="comm-feed">
                            {aiAnalysis.map(c => (
                                <div key={c.id} className="comm-item ai-item">
                                    <div className="comm-time">{c.time}</div>
                                    <div className="comm-text">{c.text}</div>
                                    <div className="comm-type">{c.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Commentary;
