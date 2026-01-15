import React from 'react';
import { Trophy, TrendingUp, Activity, Star } from 'lucide-react';
import '../styles/components/KID.css';

const KID = () => {
    const userStats = {
        name: 'Alex "The Flash" Morgan',
        id: 'KID-8821-99',
        points: 2450,
        rank: 12,
        attributes: {
            speed: 92,
            stamina: 88,
            technique: 85,
            power: 78
        }
    };

    const leaderboard = [
        { rank: 1, name: 'Priya Sharma', points: 3100, trend: 'up' },
        { rank: 2, name: 'Jordan Lee', points: 3050, trend: 'same' },
        { rank: 3, name: 'Casey Smith', points: 2980, trend: 'down' },
        { rank: 4, name: 'Aisha Khan', points: 2900, trend: 'up' },
        { rank: 5, name: 'Maria Gonzalez', points: 2850, trend: 'up' },
    ];

    return (
        <div className="kid-container">
            <h2 className="section-title">KID (Khelo Id Card)</h2>

            <div className="kid-dashboard">
                {/* Player ID Card */}
                <div className="kid-card">
                    <div className="card-top">
                        <div className="card-chip"></div>
                        <div className="card-logo">SF</div>
                    </div>
                    <div className="player-image-box">
                        <div className="player-avatar-large">AM</div>
                    </div>
                    <div className="player-info">
                        <h3>{userStats.name}</h3>
                        <p className="kid-id">{userStats.id}</p>
                    </div>
                    <div className="player-stats-grid">
                        {Object.entries(userStats.attributes).map(([key, val]) => (
                            <div key={key} className="stat-item">
                                <span className="stat-label">{key}</span>
                                <span className="stat-val">{val}</span>
                            </div>
                        ))}
                    </div>
                    <div className="total-points">
                        <span>total points</span>
                        <span className="points-val">{userStats.points}</span>
                    </div>
                </div>

                {/* Analytics & Leaderboard */}
                <div className="kid-analytics">
                    <div className="analytics-header">
                        <h3>Talent Identification & Ranking</h3>
                        <button className="btn-secondary small">View Full Report</button>
                    </div>

                    <div className="leaderboard-table">
                        <div className="table-header">
                            <span>Rank</span>
                            <span>Player</span>
                            <span>Points</span>
                            <span>Trend</span>
                        </div>
                        {leaderboard.map((item) => (
                            <div key={item.rank} className="table-row">
                                <span className={`rank rank-${item.rank}`}>{item.rank}</span>
                                <span className="player-name-row">{item.name}</span>
                                <span className="points-row">{item.points}</span>
                                <span className={`trend ${item.trend}`}>
                                    {item.trend === 'up' ? <TrendingUp size={16} /> :
                                        item.trend === 'down' ? <TrendingUp size={16} style={{ transform: 'scaleY(-1)' }} /> :
                                            <Activity size={16} />}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KID;
