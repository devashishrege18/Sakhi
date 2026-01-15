import React, { useState, useEffect } from 'react';
import '../styles/components/LiveMatches.css';

const LiveMatches = () => {
    // Mock data for local matches
    const matches = [
        { id: 1, teamA: 'City Strikers', teamB: 'Valley Vipers', scoreA: 2, scoreB: 1, time: '65:00', status: 'LIVE', possession: 60 },
        { id: 2, teamA: 'North High', teamB: 'South Uni', scoreA: 0, scoreB: 0, time: '12:00', status: 'LIVE', possession: 45 },
        { id: 3, teamA: 'Golden Eagles', teamB: 'Black Panthers', scoreA: 3, scoreB: 2, time: 'FT', status: 'FINISHED', possession: 50 },
    ];

    return (
        <div className="matches-container">
            <h2 className="section-title">Local Matches Live</h2>
            <div className="matches-grid">
                {matches.map(match => (
                    <div key={match.id} className="match-card">
                        <div className="match-status">
                            <span className={`status-badge ${match.status.toLowerCase()}`}>
                                {match.status === 'LIVE' && <span className="blink-dot"></span>}
                                {match.time}
                            </span>
                        </div>

                        <div className="teams-score">
                            <div className="team">
                                <div className="team-logo">{match.teamA.charAt(0)}</div>
                                <span className="team-name">{match.teamA}</span>
                                <span className="score">{match.scoreA}</span>
                            </div>
                            <div className="divider">-</div>
                            <div className="team">
                                <span className="score">{match.scoreB}</span>
                                <span className="team-name">{match.teamB}</span>
                                <div className="team-logo">{match.teamB.charAt(0)}</div>
                            </div>
                        </div>

                        {match.status === 'LIVE' && (
                            <div className="live-stats">
                                <div className="stat-bar">
                                    <div className="stat-label">Possession</div>
                                    <div className="progress-bg">
                                        <div className="progress-fill" style={{ width: `${match.possession}%` }}></div>
                                    </div>
                                    <div className="stat-value">{match.possession}%</div>
                                </div>
                            </div>
                        )}

                        <button className="btn-detail">View Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveMatches;
