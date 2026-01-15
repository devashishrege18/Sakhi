import React from 'react';
import mixedBanner from '../assets/mixed_banner.png';
import '../styles/components/MixedSportsHero.css';

const MixedSportsHero = () => {
    return (
        <div className="mixed-hero-container">
            <div className="mixed-hero-image" style={{ backgroundImage: `url(${mixedBanner})` }}>
                <div className="mixed-overlay">
                    <div className="mixed-content">
                        <span className="mixed-badge">New Era of Cricket</span>
                        <h2 className="mixed-title">History in the Making</h2>
                        <p className="mixed-desc">
                            Experience the first-ever Mixed Gender Pro League. Men and Women, Same Team, Same Field.
                        </p>
                        <button className="mixed-btn">View Schedule</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MixedSportsHero;
