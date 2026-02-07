'use client';
import { useState, useEffect } from 'react';

const TRANSLATIONS = {
    'hi-IN': { title: 'सुरक्षित आश्रय', subtitle: 'घरेलू हिंसा से सुरक्षा', backBtn: '← वापस', youAreSafe: 'आप सुरक्षित हैं', helpOnWay: 'मदद आ रही है', quickConnect: 'तुरंत कॉल करें', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'नजदीकी पुलिस थाना', safetyTips: '💡 सुरक्षा सुझाव', tip1: '✓ सुरक्षित स्थान पर जाएं', tip2: '✓ किसी विश्वसनीय को बताएं', tip3: '✓ दस्तावेज़ साथ रखें', locating: 'स्थान खोज रहे हैं...' },
    'en-IN': { title: 'Safe Shelter', subtitle: 'Protection from domestic violence', backBtn: '← Back', youAreSafe: 'You Are Protected', helpOnWay: 'Help is coming', quickConnect: 'Quick Call', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'Nearby Police Station', safetyTips: '💡 Safety Tips', tip1: '✓ Move to a safe location', tip2: '✓ Inform someone you trust', tip3: '✓ Keep documents ready', locating: 'Finding your location...' },
    'bn-IN': { title: 'নিরাপদ আশ্রয়', backBtn: '← ফিরুন', youAreSafe: 'আপনি সুরক্ষিত', helpOnWay: 'সাহায্য আসছে', quickConnect: 'দ্রুত কল', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'কাছের থানা', safetyTips: '💡 নিরাপত্তা', tip1: '✓ নিরাপদ স্থানে যান', tip2: '✓ বিশ্বস্তকে জানান', tip3: '✓ নথি রাখুন', locating: 'অবস্থান...' },
    'te-IN': { title: 'సురక్షిత ఆశ్రయం', backBtn: '← వెనక్కి', youAreSafe: 'మీరు సురక్షితం', helpOnWay: 'సహాయం వస్తోంది', quickConnect: 'త్వరిత కాల్', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'దగ్గరి పోలీస్ స్టేషన్', safetyTips: '💡 భద్రత', tip1: '✓ సురక్షిత చోటికి వెళ్ళండి', tip2: '✓ నమ్మకమైన వారికి చెప్పండి', tip3: '✓ పత్రాలు ఉంచండి', locating: 'స్థానం...' },
    'ta-IN': { title: 'பாதுகாப்பு', backBtn: '← பின்', youAreSafe: 'பாதுகாப்பாக', helpOnWay: 'உதவி வருகிறது', quickConnect: 'விரைவு கால்', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'அருகில் காவல் நிலையம்', safetyTips: '💡 பாதுகாப்பு', tip1: '✓ பாதுகாப்பான இடம்', tip2: '✓ நம்பகமானவரிடம்', tip3: '✓ ஆவணங்கள்', locating: 'இருப்பிடம்...' },
    'mr-IN': { title: 'सुरक्षित आश्रय', backBtn: '← मागे', youAreSafe: 'तुम्ही सुरक्षित', helpOnWay: 'मदत येत आहे', quickConnect: 'त्वरित कॉल', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'जवळचे पोलिस ठाणे', safetyTips: '💡 सुरक्षितता', tip1: '✓ सुरक्षित ठिकाणी जा', tip2: '✓ विश्वासू व्यक्तीला सांगा', tip3: '✓ कागदपत्रे', locating: 'स्थान...' },
    'gu-IN': { title: 'સુરક્ષિત આશ્રય', backBtn: '← પાછા', youAreSafe: 'તમે સુરક્ષિત', helpOnWay: 'મદદ આવે છે', quickConnect: 'ઝડપી કૉલ', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'નજીકનું પોલીસ સ્ટેશન', safetyTips: '💡 સુરક્ષા', tip1: '✓ સુરક્ષિત સ્થળે જાઓ', tip2: '✓ વિશ્વાસુને જણાવો', tip3: '✓ દસ્તાવેજો', locating: 'સ્થાન...' },
    'kn-IN': { title: 'ಸುರಕ್ಷಿತ ಆಶ್ರಯ', backBtn: '← ಹಿಂದೆ', youAreSafe: 'ನೀವು ಸುರಕ್ಷಿತ', helpOnWay: 'ಸಹಾಯ ಬರುತ್ತಿದೆ', quickConnect: 'ತ್ವರಿತ ಕರೆ', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆ', safetyTips: '💡 ಸುರಕ್ಷತೆ', tip1: '✓ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ', tip2: '✓ ನಂಬಿಕಸ್ಥರಿಗೆ ತಿಳಿಸಿ', tip3: '✓ ದಾಖಲೆಗಳು', locating: 'ಸ್ಥಳ...' },
    'ml-IN': { title: 'സുരക്ഷിത അഭയം', backBtn: '← തിരികെ', youAreSafe: 'നിങ്ങൾ സുരക്ഷിതം', helpOnWay: 'സഹായം വരുന്നു', quickConnect: 'ദ്രുത കോൾ', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'അടുത്തുള്ള പോലീസ് സ്റ്റേഷൻ', safetyTips: '💡 സുരക്ഷ', tip1: '✓ സുരക്ഷിത സ്ഥലത്തേക്ക്', tip2: '✓ വിശ്വസ്തരെ അറിയിക്കുക', tip3: '✓ രേഖകൾ', locating: 'സ്ഥാനം...' },
    'pa-IN': { title: 'ਸੁਰੱਖਿਅਤ ਆਸਰਾ', backBtn: '← ਪਿੱਛੇ', youAreSafe: 'ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ', helpOnWay: 'ਮਦਦ ਆ ਰਹੀ', quickConnect: 'ਤੁਰੰਤ ਕੌਲ', womenHelpline: '👩 181', police: '🚔 100', womenCell: '👮‍♀️ 1091', ncw: '🏛️ NCW', nearbyHelp: 'ਨੇੜਲਾ ਥਾਣਾ', safetyTips: '💡 ਸੁਰੱਖਿਆ', tip1: '✓ ਸੁਰੱਖਿਅਤ ਥਾਂ ਜਾਓ', tip2: '✓ ਭਰੋਸੇਯੋਗ ਨੂੰ ਦੱਸੋ', tip3: '✓ ਦਸਤਾਵੇਜ਼', locating: 'ਟਿਕਾਣਾ...' }
};

export default function ShelterPage() {
    const [location, setLocation] = useState(null);
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
                (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLoading(false); },
                () => { setLocation({ lat: 28.6139, lng: 77.2090 }); setLoading(false); }
            );
        } else { setLocation({ lat: 28.6139, lng: 77.2090 }); setLoading(false); }
    }, []);

    // Optimized search: ONLY police stations (most reliable for protection)
    const mapUrl = location ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=police+station&center=${location.lat},${location.lng}&zoom=14` : null;

    return (
        <>
            <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .shltr-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff 0%, #fdf4ff 50%, #fce7f3 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .shltr-header { background: linear-gradient(135deg, #7c3aed, #db2777); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
        .shltr-header-left { display: flex; align-items: center; gap: 10px; }
        .shltr-header-left img { height: 36px; }
        .shltr-header-left span { color: white; font-size: 17px; font-weight: 700; }
        .shltr-back { background: rgba(255,255,255,0.2); color: white; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-size: 13px; }
        
        .shltr-content { display: flex; gap: 20px; padding: 20px; max-width: 1400px; margin: 0 auto; }
        .shltr-sidebar { width: 320px; display: flex; flex-direction: column; gap: 16px; }
        
        .shltr-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 20px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.5); }
        
        .shltr-safe { background: linear-gradient(135deg, #059669, #10b981); border-radius: 16px; padding: 24px; color: white; text-align: center; }
        .shltr-safe-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 32px; }
        .shltr-safe h2 { font-size: 20px; font-weight: 700; }
        .shltr-safe p { font-size: 13px; opacity: 0.9; margin-top: 4px; }
        
        .shltr-section { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .shltr-section::before { content: ''; width: 4px; height: 14px; background: linear-gradient(135deg, #7c3aed, #db2777); border-radius: 2px; }
        
        .shltr-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .shltr-btn { display: flex; flex-direction: column; align-items: center; padding: 16px 12px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 20px; color: white; transition: all 0.2s; }
        .shltr-btn span { font-size: 11px; font-weight: 500; margin-top: 4px; opacity: 0.9; }
        .shltr-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .shltr-btn.purple { background: linear-gradient(135deg, #7c3aed, #9333ea); }
        .shltr-btn.red { background: linear-gradient(135deg, #dc2626, #ef4444); }
        .shltr-btn.pink { background: linear-gradient(135deg, #db2777, #ec4899); }
        .shltr-btn.blue { background: linear-gradient(135deg, #2563eb, #3b82f6); }
        
        .shltr-tips { background: linear-gradient(135deg, #fef3c7, #fef9c3); border-radius: 14px; padding: 16px; border: 1px solid #fcd34d; }
        .shltr-tips-title { font-size: 13px; font-weight: 600; color: #92400e; margin-bottom: 10px; }
        .shltr-tips-list { list-style: none; }
        .shltr-tips-list li { padding: 6px 0; color: #78350f; font-size: 12px; }
        
        .shltr-map-wrap { flex: 1; position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-height: 480px; }
        .shltr-map { width: 100%; height: 100%; border: none; min-height: 520px; }
        .shltr-map-badge { position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 10px 16px; border-radius: 10px; font-weight: 600; font-size: 13px; color: #7c3aed; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 6px; }
        .shltr-map-badge::before { content: '🚔'; }
        
        .shltr-footer { display: flex; gap: 8px; padding: 14px 20px; justify-content: center; flex-wrap: wrap; background: linear-gradient(135deg, #1f2937, #374151); }
        .shltr-footer a { padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 13px; color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); transition: all 0.2s; }
        .shltr-footer a:hover { background: rgba(255,255,255,0.2); }
        
        @media (max-width: 900px) {
          .shltr-content { flex-direction: column; padding: 16px; }
          .shltr-sidebar { width: 100%; }
          .shltr-map-wrap, .shltr-map { min-height: 320px; }
        }
      `}</style>

            <div className="shltr-page">
                <header className="shltr-header">
                    <div className="shltr-header-left">
                        <img src="/sakhi-logo.png" alt="Sakhi" />
                        <span>{t.title}</span>
                    </div>
                    <a href="/" className="shltr-back">{t.backBtn}</a>
                </header>

                <div className="shltr-content">
                    <div className="shltr-sidebar">
                        <div className="shltr-safe">
                            <div className="shltr-safe-icon">🛡️</div>
                            <h2>{t.youAreSafe}</h2>
                            <p>{t.helpOnWay}</p>
                        </div>

                        <div className="shltr-card">
                            <div className="shltr-section">{t.quickConnect}</div>
                            <div className="shltr-btns">
                                <a href="tel:181" className="shltr-btn purple">
                                    {t.womenHelpline}
                                    <span>Women Helpline</span>
                                </a>
                                <a href="tel:100" className="shltr-btn red">
                                    {t.police}
                                    <span>Police</span>
                                </a>
                                <a href="tel:1091" className="shltr-btn pink">
                                    {t.womenCell}
                                    <span>Women Cell</span>
                                </a>
                                <a href="tel:7827170170" className="shltr-btn blue">
                                    {t.ncw}
                                    <span>Commission</span>
                                </a>
                            </div>
                        </div>

                        <div className="shltr-tips">
                            <div className="shltr-tips-title">{t.safetyTips}</div>
                            <ul className="shltr-tips-list">
                                <li>{t.tip1}</li>
                                <li>{t.tip2}</li>
                                <li>{t.tip3}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="shltr-map-wrap">
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f9fafb' }}>
                                <p style={{ color: '#6b7280' }}>{t.locating}</p>
                            </div>
                        ) : (
                            <>
                                <iframe src={mapUrl} className="shltr-map" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                <div className="shltr-map-badge">{t.nearbyHelp}</div>
                            </>
                        )}
                    </div>
                </div>

                <div className="shltr-footer">
                    <a href="tel:181">Women Helpline 181</a>
                    <a href="tel:100">Police 100</a>
                    <a href="tel:1091">Women Cell 1091</a>
                </div>
            </div>
        </>
    );
}
