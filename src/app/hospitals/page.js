'use client';
import { useState, useEffect } from 'react';

export default function HospitalsPage() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        (err) => {
          setError('Location access denied. Using default location.');
          setLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi default
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setLocation({ lat: 28.6139, lng: 77.2090 });
      setLoading(false);
    }
  }, []);

  const mapUrl = location
    ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=hospitals+near+me&center=${location.lat},${location.lng}&zoom=14`
    : null;

  return (
    <>
      <style jsx global>{`
        .hospitals-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; flex-direction: column; }
        .hospitals-header { background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(107,33,168,0.3); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header-left img { height: 40px; }
        .header-left span { color: white; font-size: 20px; font-weight: bold; }
        .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
        .hospitals-title { padding: 20px 24px; text-align: center; }
        .hospitals-title h1 { font-size: 24px; font-weight: bold; color: #4a1a6b; margin: 0; }
        .hospitals-title p { color: #666; font-size: 14px; margin-top: 8px; }
        .hospitals-title .error { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .map-container { flex: 1; padding: 0 24px 24px; }
        .map-loading { display: flex; align-items: center; justify-content: center; height: 400px; background: rgba(255,255,255,0.9); border-radius: 16px; }
        .map-loading p { color: #666; }
        .map-frame { width: 100%; height: 500px; border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .emergency-btns { padding: 16px 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .emergency-btn { padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; color: white; }
        .emergency-btn.red { background: #dc2626; }
        .emergency-btn.purple { background: #6b21a8; }
        .emergency-btn.pink { background: #db2777; }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .hospitals-header { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
          .header-left span { font-size: 16px; }
          .header-left img { height: 32px; }
          .back-btn { padding: 6px 12px; font-size: 12px; }
          .hospitals-title { padding: 16px; }
          .hospitals-title h1 { font-size: 20px; }
          .map-container { padding: 0 16px 16px; }
          .map-frame { height: 350px; }
          .emergency-btns { padding: 12px 16px; gap: 8px; }
          .emergency-btn { padding: 12px 16px; font-size: 12px; flex: 1; text-align: center; min-width: 100px; }
        }
        @media (max-width: 480px) {
          .map-frame { height: 280px; }
          .emergency-btn { padding: 10px 12px; font-size: 11px; }
        }
      `}</style>

      <div className="hospitals-page">
        <header className="hospitals-header">
          <div className="header-left">
            <img src="/sakhi-logo.png" alt="Sakhi" />
            <span>Nearby Hospitals</span>
          </div>
          <a href="/" className="back-btn">← Back to Chat</a>
        </header>

        <div className="hospitals-title">
          <h1>🏥 Nearby Hospitals</h1>
          <p>Find hospitals and clinics near you</p>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="map-container">
          {loading ? (
            <div className="map-loading">
              <p>Loading map...</p>
            </div>
          ) : (
            <iframe
              src={mapUrl}
              className="map-frame"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>

        <div className="emergency-btns">
          <a href="tel:108" className="emergency-btn red">🚨 Emergency 108</a>
          <a href="tel:102" className="emergency-btn purple">🚑 Ambulance 102</a>
          <a href="tel:181" className="emergency-btn pink">📞 Women Helpline 181</a>
        </div>
      </div>
    </>
  );
}
