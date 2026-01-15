import React from 'react';
import { Video, Calendar, Star } from 'lucide-react';
import '../styles/components/PlayerMeet.css';

const PlayerMeet = () => {
    const players = [
        { id: 1, name: 'Zara Williams', sport: 'Football', role: 'Striker', status: 'Available', rating: 4.9 },
        { id: 2, name: 'Elena Rodriguez', sport: 'Tennis', role: 'Pro', status: 'Booked', rating: 5.0 },
        { id: 3, name: 'Sam Chen', sport: 'Basketball', role: 'Point Guard', status: 'Available', rating: 4.8 },
    ];

    return (
        <div className="meet-container">
            <h2 className="section-title">Meet Your Heroes</h2>

            <div className="players-grid">
                {players.map(player => (
                    <div key={player.id} className="player-meet-card">
                        <div className="player-cover">
                            <div className="player-badge">{player.sport}</div>
                        </div>

                        <div className="player-details">
                            <div className="player-header">
                                <h3>{player.name}</h3>
                                <div className="rating">
                                    <Star size={14} fill="var(--color-gold-primary)" color="var(--color-gold-primary)" />
                                    <span>{player.rating}</span>
                                </div>
                            </div>
                            <p className="player-role">{player.role}</p>

                            <div className="player-actions">
                                <button className="btn-meet primary">
                                    <Calendar size={18} /> Book Session
                                </button>
                                <button className="btn-meet secondary">
                                    <Video size={18} /> Watch Clips
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerMeet;
