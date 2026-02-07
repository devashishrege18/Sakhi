'use client';
import { useState, useEffect } from 'react';

const TRANSLATIONS = {
  'hi-IN': { title: 'पास के अस्पताल', subtitle: 'अपने पास अस्पताल खोजें', backBtn: '← वापस', locating: 'स्थान खोज रहे हैं...', emergency: '🚨 आपातकालीन 108', ambulance: '🚑 एम्बुलेंस' },
  'en-IN': { title: 'Nearby Hospitals', subtitle: 'Find hospitals and clinics near you', backBtn: '← Back to Chat', locating: 'Finding your location...', emergency: '🚨 Emergency 108', ambulance: '🚑 Ambulance' },
  'bn-IN': { title: 'কাছের হাসপাতাল', subtitle: 'আপনার কাছে হাসপাতাল খুঁজুন', backBtn: '← ফিরুন', locating: 'অবস্থান খুঁজছি...', emergency: '🚨 জরুরি 108', ambulance: '🚑 অ্যাম্বুলেন্স' },
  'te-IN': { title: 'సమీపంలోని ఆసుపత్రులు', subtitle: 'మీ సమీపంలో ఆసుపత్రులను కనుగొనండి', backBtn: '← వెనక్కి', locating: 'స్థానం గుర్తిస్తోంది...', emergency: '🚨 అత్యవసర 108', ambulance: '🚑 అంబులెన్స్' },
  'ta-IN': { title: 'அருகிலுள்ள மருத்துவமனைகள்', subtitle: 'உங்களுக்கு அருகில் மருத்துவமனைகளைக் கண்டறியுங்கள்', backBtn: '← பின்', locating: 'இருப்பிடம் கண்டறிகிறது...', emergency: '🚨 அவசர 108', ambulance: '🚑 ஆம்புலன்ஸ்' },
  'mr-IN': { title: 'जवळची रुग्णालये', subtitle: 'तुमच्या जवळची रुग्णालये शोधा', backBtn: '← मागे', locating: 'स्थान शोधत आहे...', emergency: '🚨 आणीबाणी 108', ambulance: '🚑 रुग्णवाहिका' },
  'gu-IN': { title: 'નજીકની હોસ્પિટલો', subtitle: 'તમારી નજીકની હોસ્પિટલો શોધો', backBtn: '← પાછા', locating: 'સ્થાન શોધી રહ્યું છે...', emergency: '🚨 ઇમરજન્સી 108', ambulance: '🚑 એમ્બ્યુલન્સ' },
  'kn-IN': { title: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು', subtitle: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ', backBtn: '← ಹಿಂದೆ', locating: 'ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ...', emergency: '🚨 ತುರ್ತು 108', ambulance: '🚑 ಆಂಬ್ಯುಲೆನ್ಸ್' },
  'ml-IN': { title: 'അടുത്തുള്ള ആശുപത്രികൾ', subtitle: 'നിങ്ങളുടെ അടുത്തുള്ള ആശുപത്രികൾ കണ്ടെത്തുക', backBtn: '← തിരികെ', locating: 'സ്ഥാനം കണ്ടെത്തുന്നു...', emergency: '🚨 അടിയന്തര 108', ambulance: '🚑 ആംബുലൻസ്' },
  'pa-IN': { title: 'ਨੇੜੇ ਦੇ ਹਸਪਤਾਲ', subtitle: 'ਆਪਣੇ ਨੇੜੇ ਹਸਪਤਾਲ ਲੱਭੋ', backBtn: '← ਪਿੱਛੇ', locating: 'ਟਿਕਾਣਾ ਲੱਭ ਰਹੇ ਹਾਂ...', emergency: '🚨 ਐਮਰਜੈਂਸੀ 108', ambulance: '🚑 ਐਂਬੂਲੈਂਸ' }
};

export default function HospitalsPage() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en-IN');

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en-IN'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('sakhi_lang_code');
      if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);
    }
  }, []);

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
            <span>{t.title}</span>
          </div>
          <a href="/" className="back-btn">{t.backBtn}</a>
        </header>

        <div className="hospitals-title">
          <h1>🏥 {t.title}</h1>
          <p>{t.subtitle}</p>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="map-container">
          {loading ? (
            <div className="map-loading">
              <p>{t.locating}</p>
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
          <a href="tel:108" className="emergency-btn red">{t.emergency}</a>
          <a href="tel:102" className="emergency-btn purple">{t.ambulance}</a>
          <a href="tel:181" className="emergency-btn pink">📞 Women Helpline 181</a>
        </div>
      </div>
    </>
  );
}
