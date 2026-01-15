import React from 'react';
import heroImage from '../assets/hero_women_gold.png';
import '../styles/components/Hero.css';

const Hero = () => {
    return (
        <div className="hero-container" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #050505), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="text-stroke">SameField</span>
                    <span className="text-gold">Sports</span>
                </h1>
                <p className="hero-subtitle">
                    Where Champions Are Made | Gender Neutral. Performance Driven.
                </p>
                <div className="hero-actions">
                    <button className="btn-primary">Watch Live</button>
                    <button className="btn-secondary">Join the Club</button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
