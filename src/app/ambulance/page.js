'use client';
import { useState, useEffect, useRef } from 'react';

const TRANSLATIONS = {
    'hi-IN': { title: 'आपातकालीन एम्बुलेंस', subtitle: 'गर्भावस्था और प्रसव के लिए तत्काल सहायता', backBtn: '← वापस जाएं', callRaised: 'आपातकालीन कॉल भेजी गई!', eta: 'पहुँचने का समय', mins: 'मिनट', ambulanceDispatched: 'एम्बुलेंस रवाना', driverName: 'ड्राइवर: राजेश कुमार', vehicleNo: 'DL 01 AB 1234', tracking: 'लाइव ट्रैकिंग', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'शांत रहें, मदद आ रही है', locating: 'स्थान खोज रहे हैं...', arriving: 'पहुँच रहा है...' },
    'en-IN': { title: 'Emergency Ambulance', subtitle: 'Immediate help for pregnancy & delivery', backBtn: '← Back', callRaised: 'EMERGENCY DISPATCHED!', eta: 'Arriving In', mins: 'mins', ambulanceDispatched: 'Ambulance En Route', driverName: 'Driver: Rajesh Kumar', vehicleNo: 'DL 01 AB 1234', tracking: 'Live Tracking', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'Stay calm, help is coming', locating: 'Locating you...', arriving: 'Arriving...' },
    'bn-IN': { title: 'জরুরি অ্যাম্বুলেন্স', backBtn: '← ফিরে যান', callRaised: 'জরুরি কল পাঠানো হয়েছে!', eta: 'আসছে', mins: 'মিনিট', ambulanceDispatched: 'অ্যাম্বুলেন্স রওনা', tracking: 'লাইভ ট্র্যাকিং', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'শান্ত থাকুন', locating: 'অবস্থান খুঁজছি...' },
    'te-IN': { title: 'అత్యవసర అంబులెన్స్', backBtn: '← వెనక్కి', callRaised: 'అత్యవసర కాల్!', eta: 'చేరుకుంటోంది', mins: 'నిమిషాలు', ambulanceDispatched: 'అంబులెన్స్ బయలుదేరింది', tracking: 'లైవ్ ట్రాకింగ్', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'ప్రశాంతంగా ఉండండి', locating: 'మీ స్థానం...' },
    'ta-IN': { title: 'அவசர ஆம்புலன்ஸ்', backBtn: '← பின்', callRaised: 'அவசர அழைப்பு!', eta: 'வருகிறது', mins: 'நிமிடங்கள்', ambulanceDispatched: 'ஆம்புலன்ஸ் புறப்பட்டது', tracking: 'நேரடி கண்காணிப்பு', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'அமைதியாக இருங்கள்', locating: 'இருப்பிடம்...' },
    'mr-IN': { title: 'आणीबाणी रुग्णवाहिका', backBtn: '← मागे', callRaised: 'आणीबाणी कॉल!', eta: 'येत आहे', mins: 'मिनिटे', ambulanceDispatched: 'रुग्णवाहिका निघाली', tracking: 'लाइव्ह ट्रॅकिंग', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'शांत राहा', locating: 'स्थान...' },
    'gu-IN': { title: 'ઇમરજન્સી એમ્બ્યુલન્સ', backBtn: '← પાછા', callRaised: 'ઇમરજન્સી કૉલ!', eta: 'આવી રહી છે', mins: 'મિનિટ', ambulanceDispatched: 'એમ્બ્યુલન્સ નીકળી', tracking: 'લાઇવ ટ્રેકિંગ', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'શાંત રહો', locating: 'સ્થાન...' },
    'kn-IN': { title: 'ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್', backBtn: '← ಹಿಂದೆ', callRaised: 'ತುರ್ತು ಕರೆ!', eta: 'ಬರುತ್ತಿದೆ', mins: 'ನಿಮಿಷ', ambulanceDispatched: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಹೊರಟಿದೆ', tracking: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'ಶಾಂತವಾಗಿರಿ', locating: 'ಸ್ಥಳ...' },
    'ml-IN': { title: 'അടിയന്തര ആംബുലൻസ്', backBtn: '← തിരികെ', callRaised: 'അടിയന്തര കോൾ!', eta: 'വരുന്നു', mins: 'മിനിറ്റ്', ambulanceDispatched: 'ആംബുലൻസ് പുറപ്പെട്ടു', tracking: 'ലൈവ് ട്രാക്കിംഗ്', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'ശാന്തമായിരിക്കുക', locating: 'സ്ഥാനം...' },
    'pa-IN': { title: 'ਐਮਰਜੈਂਸੀ ਐਂਬੂਲੈਂਸ', backBtn: '← ਪਿੱਛੇ', callRaised: 'ਐਮਰਜੈਂਸੀ ਕਾਲ!', eta: 'ਆ ਰਹੀ ਹੈ', mins: 'ਮਿੰਟ', ambulanceDispatched: 'ਐਂਬੂਲੈਂਸ ਨਿਕਲੀ', tracking: 'ਲਾਈਵ ਟਰੈਕਿੰਗ', emergency108: '🚨 108', maternity102: '🚑 102', childline: '👶 1098', stayCalm: 'ਸ਼ਾਂਤ ਰਹੋ', locating: 'ਟਿਕਾਣਾ...' }
};

export default function AmbulancePage() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eta, setEta] = useState({ mins: 8, secs: 30 });
    const [lang, setLang] = useState('en-IN');
    const [progress, setProgress] = useState(0); // 0 to 100 for ambulance position
    const timerRef = useRef(null);
    const totalSeconds = useRef(8 * 60 + 30); // Total ETA in seconds

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

    // ETA countdown + progress sync
    useEffect(() => {
        const startTotal = totalSeconds.current;
        timerRef.current = setInterval(() => {
            setEta(prev => {
                const currentTotal = prev.mins * 60 + prev.secs;
                if (currentTotal <= 0) {
                    clearInterval(timerRef.current);
                    return { mins: 0, secs: 0 };
                }
                const newTotal = currentTotal - 1;
                // Calculate progress: how much time has passed vs total
                const elapsed = startTotal - newTotal;
                const prog = Math.min(100, (elapsed / startTotal) * 100);
                setProgress(prog);
                return { mins: Math.floor(newTotal / 60), secs: newTotal % 60 };
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const mapUrl = location ? `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${location.lat + 0.02},${location.lng + 0.015}&destination=${location.lat},${location.lng}&mode=driving` : null;

    return (
        <>
            <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .amb-page { min-height: 100vh; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .amb-header { background: linear-gradient(135deg, #dc2626, #be185d); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
        .amb-header-left { display: flex; align-items: center; gap: 10px; }
        .amb-header-left img { height: 36px; }
        .amb-header-left span { color: white; font-size: 17px; font-weight: 700; }
        .amb-back { background: rgba(255,255,255,0.2); color: white; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-size: 13px; }
        
        .amb-content { display: flex; gap: 20px; padding: 20px; max-width: 1400px; margin: 0 auto; }
        .amb-sidebar { width: 340px; display: flex; flex-direction: column; gap: 16px; }
        
        .amb-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 20px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.5); }
        
        .amb-alert { background: linear-gradient(135deg, #dc2626, #ef4444); border-radius: 16px; padding: 16px; color: white; display: flex; align-items: center; gap: 14px; }
        .amb-pulse { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite; font-size: 24px; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .amb-alert-text h3 { font-size: 15px; font-weight: 700; }
        .amb-alert-text p { font-size: 12px; opacity: 0.9; margin-top: 2px; }
        
        .amb-eta-card { text-align: center; padding: 24px 20px; }
        .amb-eta-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
        .amb-eta-time { font-size: 52px; font-weight: 800; background: linear-gradient(135deg, #dc2626, #be185d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'SF Mono', monospace; margin: 8px 0; }
        .amb-eta-mins { font-size: 14px; color: #6b7280; }
        
        .amb-track-visual { margin-top: 20px; padding: 16px; background: linear-gradient(135deg, #f3e8ff, #fdf4ff); border-radius: 12px; }
        .amb-track-label { font-size: 11px; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .amb-track-label::before { content: ''; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        
        .amb-track-bar { position: relative; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: visible; }
        .amb-track-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a); border-radius: 4px; transition: width 1s linear; }
        .amb-track-icon { position: absolute; top: -14px; transform: translateX(-50%); font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); transition: left 1s linear; animation: bounce 0.5s infinite alternate; }
        @keyframes bounce { from { transform: translateX(-50%) translateY(0); } to { transform: translateX(-50%) translateY(-3px); } }
        
        .amb-track-points { display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: #6b7280; }
        
        .amb-driver { display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(124,58,237,0.1); border-radius: 12px; margin-top: 16px; }
        .amb-driver-avatar { width: 44px; height: 44px; background: linear-gradient(135deg, #a855f7, #ec4899); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
        .amb-driver-info h4 { font-size: 13px; font-weight: 600; color: #1f2937; }
        .amb-driver-info p { font-size: 11px; color: #6b7280; }
        
        .amb-map-wrap { flex: 1; position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-height: 480px; }
        .amb-map { width: 100%; height: 100%; border: none; min-height: 520px; }
        .amb-map-badge { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 10px 16px; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; color: #059669; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .amb-live-dot { width: 8px; height: 8px; background: #dc2626; border-radius: 50%; animation: blink 1s infinite; }
        
        .amb-btns { display: flex; gap: 10px; padding: 16px 20px; justify-content: center; background: rgba(255,255,255,0.5); }
        .amb-btn { padding: 12px 24px; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 14px; color: white; transition: transform 0.2s; }
        .amb-btn:hover { transform: translateY(-2px); }
        .amb-btn.red { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .amb-btn.pink { background: linear-gradient(135deg, #db2777, #be185d); }
        .amb-btn.orange { background: linear-gradient(135deg, #ea580c, #c2410c); }
        
        @media (max-width: 900px) {
          .amb-content { flex-direction: column; padding: 16px; }
          .amb-sidebar { width: 100%; }
          .amb-map-wrap, .amb-map { min-height: 320px; }
          .amb-eta-time { font-size: 42px; }
        }
      `}</style>

            <div className="amb-page">
                <header className="amb-header">
                    <div className="amb-header-left">
                        <img src="/sakhi-logo.png" alt="Sakhi" />
                        <span>{t.title}</span>
                    </div>
                    <a href="/" className="amb-back">{t.backBtn}</a>
                </header>

                <div className="amb-content">
                    <div className="amb-sidebar">
                        <div className="amb-alert">
                            <div className="amb-pulse">🚑</div>
                            <div className="amb-alert-text">
                                <h3>{t.callRaised}</h3>
                                <p>{t.stayCalm}</p>
                            </div>
                        </div>

                        <div className="amb-card">
                            <div className="amb-eta-card">
                                <div className="amb-eta-label">{t.eta}</div>
                                <div className="amb-eta-time">{String(eta.mins).padStart(2, '0')}:{String(eta.secs).padStart(2, '0')}</div>
                                <div className="amb-eta-mins">{t.mins}</div>
                            </div>

                            <div className="amb-track-visual">
                                <div className="amb-track-label">{t.tracking}</div>
                                <div className="amb-track-bar">
                                    <div className="amb-track-fill" style={{ width: `${progress}%` }}></div>
                                    <div className="amb-track-icon" style={{ left: `${progress}%` }}>🚑</div>
                                </div>
                                <div className="amb-track-points">
                                    <span>🏥 Hospital</span>
                                    <span>📍 You</span>
                                </div>
                            </div>

                            <div className="amb-driver">
                                <div className="amb-driver-avatar">👨‍⚕️</div>
                                <div className="amb-driver-info">
                                    <h4>{t.driverName || 'Driver: Rajesh Kumar'}</h4>
                                    <p>{t.vehicleNo || 'DL 01 AB 1234'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="amb-map-wrap">
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f9fafb' }}>
                                <p style={{ color: '#6b7280' }}>{t.locating}</p>
                            </div>
                        ) : (
                            <>
                                <iframe src={mapUrl} className="amb-map" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                <div className="amb-map-badge">
                                    <span className="amb-live-dot"></span>
                                    {t.tracking}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="amb-btns">
                    <a href="tel:108" className="amb-btn red">{t.emergency108}</a>
                    <a href="tel:102" className="amb-btn pink">{t.maternity102}</a>
                    <a href="tel:1098" className="amb-btn orange">{t.childline}</a>
                </div>
            </div>
        </>
    );
}
