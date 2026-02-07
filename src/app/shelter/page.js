'use client';
import { useState, useEffect } from 'react';

const TRANSLATIONS = {
    'hi-IN': {
        title: 'सुरक्षित आश्रय',
        subtitle: 'घरेलू हिंसा से तत्काल सुरक्षा',
        backBtn: '← वापस जाएं',
        youAreSafe: 'आप सुरक्षित हैं',
        helpOnWay: 'मदद आ रही है...',
        quickConnect: 'तुरंत जुड़ें',
        womenHelpline: '👩 महिला हेल्पलाइन 181',
        police: '🚔 पुलिस 100',
        womenCell: '👮‍♀️ महिला सुरक्षा 1091',
        ncw: '🏛️ महिला आयोग',
        nearbyHelp: 'नजदीकी मदद केंद्र',
        safetyTips: '💡 सुरक्षा सुझाव',
        tip1: '✓ सुरक्षित स्थान पर जाएं',
        tip2: '✓ किसी विश्वसनीय को बताएं',
        tip3: '✓ ज़रूरी दस्तावेज़ साथ रखें',
        locating: 'स्थान खोज रहे हैं...'
    },
    'en-IN': {
        title: 'Safe Shelter',
        subtitle: 'Immediate protection from domestic violence',
        backBtn: '← Back to Chat',
        youAreSafe: 'You Are Protected',
        helpOnWay: 'Help is on the way...',
        quickConnect: 'Quick Connect',
        womenHelpline: '👩 Women Helpline 181',
        police: '🚔 Police 100',
        womenCell: '👮‍♀️ Women Safety 1091',
        ncw: '🏛️ Women Commission',
        nearbyHelp: 'Nearby Help Centers',
        safetyTips: '💡 Safety Tips',
        tip1: '✓ Move to a safe location',
        tip2: '✓ Inform someone you trust',
        tip3: '✓ Keep important documents ready',
        locating: 'Finding your location...'
    },
    'bn-IN': { title: 'নিরাপদ আশ্রয়', subtitle: 'পারিবারিক সহিংসতা থেকে সুরক্ষা', backBtn: '← ফিরে যান', youAreSafe: 'আপনি সুরক্ষিত', helpOnWay: 'সাহায্য আসছে...', quickConnect: 'দ্রুত যোগাযোগ', womenHelpline: '👩 মহিলা হেল্পলাইন 181', police: '🚔 পুলিশ 100', womenCell: '👮‍♀️ মহিলা সেল 1091', ncw: '🏛️ মহিলা কমিশন', nearbyHelp: 'কাছের সাহায্য কেন্দ্র', safetyTips: '💡 নিরাপত্তা পরামর্শ', tip1: '✓ নিরাপদ স্থানে যান', tip2: '✓ বিশ্বস্ত কাউকে জানান', tip3: '✓ গুরুত্বপূর্ণ নথি রাখুন', locating: 'অবস্থান খুঁজছি...' },
    'te-IN': { title: 'సురక్షిత ఆశ్రయం', subtitle: 'గృహ హింస నుండి రక్షణ', backBtn: '← వెనక్కి', youAreSafe: 'మీరు సురక్షితం', helpOnWay: 'సహాయం వస్తోంది...', quickConnect: 'త్వరిత కనెక్ట్', womenHelpline: '👩 మహిళా హెల్ప్‌లైన్ 181', police: '🚔 పోలీసు 100', womenCell: '👮‍♀️ మహిళా సెల్ 1091', ncw: '🏛️ మహిళా కమిషన్', nearbyHelp: 'సమీపంలోని సహాయ కేంద్రాలు', safetyTips: '💡 భద్రతా చిట్కాలు', tip1: '✓ సురక్షిత ప్రదేశానికి వెళ్ళండి', tip2: '✓ నమ్మకమైన వారికి చెప్పండి', tip3: '✓ పత్రాలు సిద్ధంగా ఉంచండి', locating: 'మీ స్థానం గుర్తిస్తోంది...' },
    'ta-IN': { title: 'பாதுகாப்பான தங்குமிடம்', subtitle: 'குடும்ப வன்முறையிலிருந்து பாதுகாப்பு', backBtn: '← பின் செல்', youAreSafe: 'நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள்', helpOnWay: 'உதவி வருகிறது...', quickConnect: 'விரைவு இணைப்பு', womenHelpline: '👩 பெண்கள் ஹெல்ப்லைன் 181', police: '🚔 காவல் 100', womenCell: '👮‍♀️ பெண்கள் பிரிவு 1091', ncw: '🏛️ பெண்கள் ஆணையம்', nearbyHelp: 'அருகிலுள்ள உதவி மையங்கள்', safetyTips: '💡 பாதுகாப்பு குறிப்புகள்', tip1: '✓ பாதுகாப்பான இடத்திற்குச் செல்லுங்கள்', tip2: '✓ நம்பகமானவர்களிடம் சொல்லுங்கள்', tip3: '✓ ஆவணங்களை தயாராக வைக்கவும்', locating: 'இருப்பிடம் கண்டறிகிறது...' },
    'mr-IN': { title: 'सुरक्षित आश्रय', subtitle: 'घरगुती हिंसाचारापासून संरक्षण', backBtn: '← मागे जा', youAreSafe: 'तुम्ही सुरक्षित आहात', helpOnWay: 'मदत येत आहे...', quickConnect: 'त्वरित कनेक्ट', womenHelpline: '👩 महिला हेल्पलाइन 181', police: '🚔 पोलिस 100', womenCell: '👮‍♀️ महिला सेल 1091', ncw: '🏛️ महिला आयोग', nearbyHelp: 'जवळील मदत केंद्रे', safetyTips: '💡 सुरक्षितता टिप्स', tip1: '✓ सुरक्षित ठिकाणी जा', tip2: '✓ विश्वासू व्यक्तीला सांगा', tip3: '✓ कागदपत्रे तयार ठेवा', locating: 'स्थान शोधत आहे...' },
    'gu-IN': { title: 'સુરક્ષિત આશ્રય', subtitle: 'ઘરેલું હિંસાથી સુરક્ષા', backBtn: '← પાછા જાઓ', youAreSafe: 'તમે સુરક્ષિત છો', helpOnWay: 'મદદ આવી રહી છે...', quickConnect: 'ઝડપી કનેક્ટ', womenHelpline: '👩 મહિલા હેલ્પલાઇન 181', police: '🚔 પોલીસ 100', womenCell: '👮‍♀️ મહિલા સેલ 1091', ncw: '🏛️ મહિલા આયોગ', nearbyHelp: 'નજીકના સહાય કેન્દ્રો', safetyTips: '💡 સુરક્ષા ટિપ્સ', tip1: '✓ સુરક્ષિત સ્થળે જાઓ', tip2: '✓ વિશ્વાસુને જણાવો', tip3: '✓ દસ્તાવેજો તૈયાર રાખો', locating: 'સ્થાન શોધી રહ્યું છે...' },
    'kn-IN': { title: 'ಸುರಕ್ಷಿತ ಆಶ್ರಯ', subtitle: 'ಗೃಹ ಹಿಂಸೆಯಿಂದ ರಕ್ಷಣೆ', backBtn: '← ಹಿಂದೆ', youAreSafe: 'ನೀವು ಸುರಕ್ಷಿತ', helpOnWay: 'ಸಹಾಯ ಬರುತ್ತಿದೆ...', quickConnect: 'ತ್ವರಿತ ಸಂಪರ್ಕ', womenHelpline: '👩 ಮಹಿಳಾ ಹೆಲ್ಪ್‌ಲೈನ್ 181', police: '🚔 ಪೊಲೀಸ್ 100', womenCell: '👮‍♀️ ಮಹಿಳಾ ಕೋಶ 1091', ncw: '🏛️ ಮಹಿಳಾ ಆಯೋಗ', nearbyHelp: 'ಹತ್ತಿರದ ಸಹಾಯ ಕೇಂದ್ರಗಳು', safetyTips: '💡 ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು', tip1: '✓ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ', tip2: '✓ ನಂಬಿಕಸ್ಥರಿಗೆ ತಿಳಿಸಿ', tip3: '✓ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ', locating: 'ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ...' },
    'ml-IN': { title: 'സുരക്ഷിത അഭയകേന്ദ്രം', subtitle: 'ഗാർഹിക പീഡനത്തിൽ നിന്ന് സംരക്ഷണം', backBtn: '← തിരികെ', youAreSafe: 'നിങ്ങൾ സുരക്ഷിതം', helpOnWay: 'സഹായം വരുന്നു...', quickConnect: 'ദ്രുത ബന്ധം', womenHelpline: '👩 വനിതാ ഹെൽപ്പ്‌ലൈൻ 181', police: '🚔 പോലീസ് 100', womenCell: '👮‍♀️ വനിതാ സെൽ 1091', ncw: '🏛️ വനിതാ കമ്മീഷൻ', nearbyHelp: 'സമീപത്തുള്ള സഹായ കേന്ദ്രങ്ങൾ', safetyTips: '💡 സുരക്ഷാ നിർദ്ദേശങ്ങൾ', tip1: '✓ സുരക്ഷിത സ്ഥലത്തേക്ക് പോകുക', tip2: '✓ വിശ്വസ്തരെ അറിയിക്കുക', tip3: '✓ രേഖകൾ തയ്യാറാക്കുക', locating: 'സ്ഥാനം കണ്ടെത്തുന്നു...' },
    'pa-IN': { title: 'ਸੁਰੱਖਿਅਤ ਆਸਰਾ', subtitle: 'ਘਰੇਲੂ ਹਿੰਸਾ ਤੋਂ ਸੁਰੱਖਿਆ', backBtn: '← ਪਿੱਛੇ ਜਾਓ', youAreSafe: 'ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਹੋ', helpOnWay: 'ਮਦਦ ਆ ਰਹੀ ਹੈ...', quickConnect: 'ਤੁਰੰਤ ਕਨੈਕਟ', womenHelpline: '👩 ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ 181', police: '🚔 ਪੁਲਿਸ 100', womenCell: '👮‍♀️ ਮਹਿਲਾ ਸੈੱਲ 1091', ncw: '🏛️ ਮਹਿਲਾ ਕਮਿਸ਼ਨ', nearbyHelp: 'ਨੇੜਲੇ ਮਦਦ ਕੇਂਦਰ', safetyTips: '💡 ਸੁਰੱਖਿਆ ਸੁਝਾਅ', tip1: '✓ ਸੁਰੱਖਿਅਤ ਥਾਂ ਤੇ ਜਾਓ', tip2: '✓ ਭਰੋਸੇਯੋਗ ਨੂੰ ਦੱਸੋ', tip3: '✓ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਰੱਖੋ', locating: 'ਟਿਕਾਣਾ ਲੱਭ ਰਹੇ ਹਾਂ...' }
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

    // Updated search: Police stations + NGO + Women help centers
    const mapUrl = location ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=police+station+women+help+center+NGO&center=${location.lat},${location.lng}&zoom=13` : null;

    return (
        <>
            <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .shelter-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff 0%, #fdf4ff 50%, #fce7f3 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .shelter-header { background: linear-gradient(135deg, #7c3aed, #db2777); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
        .shelter-header-left { display: flex; align-items: center; gap: 12px; }
        .shelter-header-left img { height: 40px; }
        .shelter-header-left span { color: white; font-size: 18px; font-weight: 700; }
        .shelter-back { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 12px; text-decoration: none; font-size: 14px; backdrop-filter: blur(10px); }
        
        .shelter-content { display: flex; gap: 24px; padding: 24px; max-width: 1400px; margin: 0 auto; }
        
        .shelter-sidebar { width: 380px; display: flex; flex-direction: column; gap: 20px; }
        
        .shelter-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); border-radius: 24px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.5); }
        
        .shelter-safe { background: linear-gradient(135deg, #059669, #10b981); border-radius: 20px; padding: 28px; color: white; text-align: center; }
        .shelter-safe-icon { width: 72px; height: 72px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 36px; }
        .shelter-safe h2 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
        .shelter-safe p { font-size: 14px; opacity: 0.9; }
        
        .shelter-section-title { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .shelter-section-title::before { content: ''; width: 4px; height: 16px; background: linear-gradient(135deg, #7c3aed, #db2777); border-radius: 2px; }
        
        .shelter-btns { display: flex; flex-direction: column; gap: 12px; }
        .shelter-btn { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-radius: 16px; text-decoration: none; font-weight: 600; font-size: 15px; color: white; transition: all 0.2s; }
        .shelter-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .shelter-btn.purple { background: linear-gradient(135deg, #7c3aed, #9333ea); }
        .shelter-btn.red { background: linear-gradient(135deg, #dc2626, #ef4444); }
        .shelter-btn.pink { background: linear-gradient(135deg, #db2777, #ec4899); }
        .shelter-btn.blue { background: linear-gradient(135deg, #2563eb, #3b82f6); }
        .shelter-btn-arrow { margin-left: auto; opacity: 0.7; font-size: 18px; }
        
        .shelter-tips { background: linear-gradient(135deg, #fef3c7, #fef9c3); border-radius: 16px; padding: 20px; border: 1px solid #fcd34d; }
        .shelter-tips-title { font-size: 14px; font-weight: 600; color: #92400e; margin-bottom: 12px; }
        .shelter-tips-list { list-style: none; }
        .shelter-tips-list li { padding: 8px 0; color: #78350f; font-size: 13px; }
        
        .shelter-map-wrap { flex: 1; position: relative; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-height: 500px; }
        .shelter-map { width: 100%; height: 100%; border: none; min-height: 550px; }
        .shelter-map-badge { position: absolute; top: 20px; left: 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 12px; font-weight: 600; color: #7c3aed; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        
        .shelter-footer { display: flex; gap: 12px; padding: 20px 24px; justify-content: center; flex-wrap: wrap; background: linear-gradient(135deg, #1f2937, #374151); }
        .shelter-footer a { padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 13px; color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); transition: all 0.2s; }
        .shelter-footer a:hover { background: rgba(255,255,255,0.2); }
        
        @media (max-width: 900px) {
          .shelter-content { flex-direction: column; padding: 16px; }
          .shelter-sidebar { width: 100%; }
          .shelter-map-wrap { min-height: 350px; }
          .shelter-map { min-height: 350px; }
        }
      `}</style>

            <div className="shelter-page">
                <header className="shelter-header">
                    <div className="shelter-header-left">
                        <img src="/sakhi-logo.png" alt="Sakhi" />
                        <span>{t.title}</span>
                    </div>
                    <a href="/" className="shelter-back">{t.backBtn}</a>
                </header>

                <div className="shelter-content">
                    <div className="shelter-sidebar">
                        <div className="shelter-safe">
                            <div className="shelter-safe-icon">🛡️</div>
                            <h2>{t.youAreSafe}</h2>
                            <p>{t.helpOnWay}</p>
                        </div>

                        <div className="shelter-card">
                            <div className="shelter-section-title">{t.quickConnect}</div>
                            <div className="shelter-btns">
                                <a href="tel:181" className="shelter-btn purple">
                                    {t.womenHelpline}
                                    <span className="shelter-btn-arrow">→</span>
                                </a>
                                <a href="tel:100" className="shelter-btn red">
                                    {t.police}
                                    <span className="shelter-btn-arrow">→</span>
                                </a>
                                <a href="tel:1091" className="shelter-btn pink">
                                    {t.womenCell}
                                    <span className="shelter-btn-arrow">→</span>
                                </a>
                                <a href="tel:7827170170" className="shelter-btn blue">
                                    {t.ncw}
                                    <span className="shelter-btn-arrow">→</span>
                                </a>
                            </div>
                        </div>

                        <div className="shelter-tips">
                            <div className="shelter-tips-title">{t.safetyTips}</div>
                            <ul className="shelter-tips-list">
                                <li>{t.tip1}</li>
                                <li>{t.tip2}</li>
                                <li>{t.tip3}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="shelter-map-wrap">
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f9fafb' }}>
                                <p style={{ color: '#6b7280' }}>{t.locating}</p>
                            </div>
                        ) : (
                            <>
                                <iframe src={mapUrl} className="shelter-map" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                <div className="shelter-map-badge">📍 {t.nearbyHelp}</div>
                            </>
                        )}
                    </div>
                </div>

                <div className="shelter-footer">
                    <a href="tel:181">{t.womenHelpline}</a>
                    <a href="tel:100">{t.police}</a>
                    <a href="tel:1091">{t.womenCell}</a>
                </div>
            </div>
        </>
    );
}
