'use client';
import { useState, useEffect, useRef } from 'react';

// Translations for all languages
const TRANSLATIONS = {
    'hi-IN': {
        title: 'आपातकालीन एम्बुलेंस',
        subtitle: 'गर्भावस्था और प्रसव के लिए तत्काल सहायता',
        backBtn: '← वापस जाएं',
        callRaised: 'आपातकालीन कॉल भेजी गई!',
        eta: 'अनुमानित समय',
        mins: 'मिनट',
        ambulanceDispatched: 'एम्बुलेंस भेजा गया',
        driverAssigned: 'ड्राइवर: राजेश कुमार',
        vehicleNo: 'DL 01 AB 1234',
        tracking: 'लाइव ट्रैकिंग',
        emergency108: '🚨 आपातकालीन 108',
        maternity102: '🚑 मातृत्व 102',
        childline: '👶 चाइल्डलाइन 1098',
        stayCalm: 'शांत रहें, मदद आ रही है',
        locating: 'आपका स्थान पता लगा रहे हैं...',
        locationError: 'स्थान एक्सेस अस्वीकृत।'
    },
    'en-IN': {
        title: 'Emergency Ambulance',
        subtitle: 'Immediate help for pregnancy & delivery',
        backBtn: '← Back to Chat',
        callRaised: 'EMERGENCY CALL RAISED!',
        eta: 'Estimated Arrival',
        mins: 'mins',
        ambulanceDispatched: 'Ambulance Dispatched',
        driverAssigned: 'Driver: Rajesh Kumar',
        vehicleNo: 'DL 01 AB 1234',
        tracking: 'Live Tracking',
        emergency108: '🚨 Emergency 108',
        maternity102: '🚑 Maternity 102',
        childline: '👶 Childline 1098',
        stayCalm: 'Stay calm, help is on the way',
        locating: 'Locating you...',
        locationError: 'Location access denied.'
    },
    'bn-IN': { title: 'জরুরি অ্যাম্বুলেন্স', subtitle: 'গর্ভাবস্থা ও প্রসবের জন্য সাহায্য', backBtn: '← ফিরে যান', callRaised: 'জরুরি কল পাঠানো হয়েছে!', eta: 'আনুমানিক সময়', mins: 'মিনিট', ambulanceDispatched: 'অ্যাম্বুলেন্স পাঠানো হয়েছে', tracking: 'লাইভ ট্র্যাকিং', emergency108: '🚨 জরুরি 108', maternity102: '🚑 মাতৃত্ব 102', childline: '👶 চাইল্ডলাইন 1098', stayCalm: 'শান্ত থাকুন, সাহায্য আসছে', locating: 'অবস্থান খুঁজছি...' },
    'te-IN': { title: 'అత్యవసర అంబులెన్స్', subtitle: 'గర్భం & ప్రసవానికి సహాయం', backBtn: '← వెనక్కి', callRaised: 'అత్యవసర కాల్ పంపబడింది!', eta: 'అంచనా సమయం', mins: 'నిమిషాలు', ambulanceDispatched: 'అంబులెన్స్ పంపబడింది', tracking: 'లైవ్ ట్రాకింగ్', emergency108: '🚨 అత్యవసర 108', maternity102: '🚑 మాతృత్వ 102', childline: '👶 చైల్డ్‌లైన్ 1098', stayCalm: 'ప్రశాంతంగా ఉండండి', locating: 'మీ స్థానం గుర్తిస్తోంది...' },
    'ta-IN': { title: 'அவசர ஆம்புலன்ஸ்', subtitle: 'கர்ப்பம் & பிரசவத்திற்கு உதவி', backBtn: '← பின் செல்', callRaised: 'அவசர அழைப்பு அனுப்பப்பட்டது!', eta: 'மதிப்பிட்ட நேரம்', mins: 'நிமிடங்கள்', ambulanceDispatched: 'ஆம்புலன்ஸ் அனுப்பப்பட்டது', tracking: 'நேரடி கண்காணிப்பு', emergency108: '🚨 அவசர 108', maternity102: '🚑 மகப்பேறு 102', childline: '👶 சைல்ட்லைன் 1098', stayCalm: 'அமைதியாக இருங்கள்', locating: 'இருப்பிடம் கண்டறிகிறது...' },
    'mr-IN': { title: 'आणीबाणी रुग्णवाहिका', subtitle: 'गर्भधारणा आणि प्रसूतीसाठी मदत', backBtn: '← मागे जा', callRaised: 'आणीबाणी कॉल पाठवला!', eta: 'अंदाजे वेळ', mins: 'मिनिटे', ambulanceDispatched: 'रुग्णवाहिका पाठवली', tracking: 'लाइव्ह ट्रॅकिंग', emergency108: '🚨 आणीबाणी 108', maternity102: '🚑 मातृत्व 102', childline: '👶 चाइल्डलाइन 1098', stayCalm: 'शांत राहा, मदत येत आहे', locating: 'स्थान शोधत आहे...' },
    'gu-IN': { title: 'ઇમરજન્સી એમ્બ્યુલન્સ', subtitle: 'ગર્ભાવસ્થા અને ડિલિવરી માટે મદદ', backBtn: '← પાછા જાઓ', callRaised: 'ઇમરજન્સી કૉલ મોકલ્યો!', eta: 'અંદાજિત સમય', mins: 'મિનિટ', ambulanceDispatched: 'એમ્બ્યુલન્સ મોકલ્યું', tracking: 'લાઇવ ટ્રેકિંગ', emergency108: '🚨 ઇમરજન્સી 108', maternity102: '🚑 મેટર્નિટી 102', childline: '👶 ચાઇલ્ડલાઇન 1098', stayCalm: 'શાંત રહો, મદદ આવી રહી છે', locating: 'સ્થાન શોધી રહ્યું છે...' },
    'kn-IN': { title: 'ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್', subtitle: 'ಗರ್ಭಧಾರಣೆ ಮತ್ತು ಹೆರಿಗೆಗೆ ಸಹಾಯ', backBtn: '← ಹಿಂದೆ', callRaised: 'ತುರ್ತು ಕರೆ ಕಳುಹಿಸಲಾಗಿದೆ!', eta: 'ಅಂದಾಜು ಸಮಯ', mins: 'ನಿಮಿಷಗಳು', ambulanceDispatched: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಕಳುಹಿಸಲಾಗಿದೆ', tracking: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್', emergency108: '🚨 ತುರ್ತು 108', maternity102: '🚑 ಮಾತೃತ್ವ 102', childline: '👶 ಚೈಲ್ಡ್‌ಲೈನ್ 1098', stayCalm: 'ಶಾಂತವಾಗಿರಿ', locating: 'ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ...' },
    'ml-IN': { title: 'അടിയന്തര ആംബുലൻസ്', subtitle: 'ഗർഭധാരണത്തിനും പ്രസവത്തിനും സഹായം', backBtn: '← തിരികെ', callRaised: 'അടിയന്തര കോൾ അയച്ചു!', eta: 'എത്തിച്ചേരാനുള്ള സമയം', mins: 'മിനിറ്റ്', ambulanceDispatched: 'ആംബുലൻസ് അയച്ചു', tracking: 'ലൈവ് ട്രാക്കിംഗ്', emergency108: '🚨 അടിയന്തര 108', maternity102: '🚑 മെറ്റേണിറ്റി 102', childline: '👶 ചൈൽഡ്‌ലൈൻ 1098', stayCalm: 'ശാന്തമായിരിക്കുക', locating: 'സ്ഥാനം കണ്ടെത്തുന്നു...' },
    'pa-IN': { title: 'ਐਮਰਜੈਂਸੀ ਐਂਬੂਲੈਂਸ', subtitle: 'ਗਰਭ ਅਤੇ ਡਿਲੀਵਰੀ ਲਈ ਮਦਦ', backBtn: '← ਪਿੱਛੇ ਜਾਓ', callRaised: 'ਐਮਰਜੈਂਸੀ ਕਾਲ ਭੇਜੀ ਗਈ!', eta: 'ਅੰਦਾਜ਼ਨ ਸਮਾਂ', mins: 'ਮਿੰਟ', ambulanceDispatched: 'ਐਂਬੂਲੈਂਸ ਭੇਜੀ ਗਈ', tracking: 'ਲਾਈਵ ਟਰੈਕਿੰਗ', emergency108: '🚨 ਐਮਰਜੈਂਸੀ 108', maternity102: '🚑 ਮੈਟਰਨਿਟੀ 102', childline: '👶 ਚਾਈਲਡਲਾਈਨ 1098', stayCalm: 'ਸ਼ਾਂਤ ਰਹੋ, ਮਦਦ ਆ ਰਹੀ ਹੈ', locating: 'ਟਿਕਾਣਾ ਲੱਭ ਰਹੇ ਹਾਂ...' }
};

export default function AmbulancePage() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eta, setEta] = useState({ mins: 8, secs: 45 });
    const [lang, setLang] = useState('en-IN');
    const timerRef = useRef(null);

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

    useEffect(() => {
        if (eta.mins > 0 || eta.secs > 0) {
            timerRef.current = setInterval(() => {
                setEta(prev => prev.secs > 0 ? { ...prev, secs: prev.secs - 1 } : prev.mins > 0 ? { mins: prev.mins - 1, secs: 59 } : prev);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, []);

    const mapUrl = location ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=ambulance+services+hospital+emergency&center=${location.lat},${location.lng}&zoom=14` : null;

    return (
        <>
            <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .amb-page { min-height: 100vh; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .amb-header { background: linear-gradient(135deg, #dc2626, #be185d); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
        .amb-header-left { display: flex; align-items: center; gap: 12px; }
        .amb-header-left img { height: 40px; }
        .amb-header-left span { color: white; font-size: 18px; font-weight: 700; }
        .amb-back { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 12px; text-decoration: none; font-size: 14px; backdrop-filter: blur(10px); }
        
        .amb-content { display: flex; gap: 24px; padding: 24px; max-width: 1400px; margin: 0 auto; }
        
        .amb-sidebar { width: 380px; display: flex; flex-direction: column; gap: 20px; }
        
        .amb-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); border-radius: 24px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.5); }
        
        .amb-alert { background: linear-gradient(135deg, #dc2626, #ef4444); border-radius: 20px; padding: 20px; color: white; display: flex; align-items: center; gap: 16px; }
        .amb-pulse { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .amb-pulse svg { width: 28px; height: 28px; }
        .amb-alert-text h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .amb-alert-text p { font-size: 13px; opacity: 0.9; }
        
        .amb-eta { text-align: center; padding: 28px; }
        .amb-eta-label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .amb-eta-time { font-size: 56px; font-weight: 800; background: linear-gradient(135deg, #dc2626, #be185d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: monospace; }
        .amb-eta-mins { font-size: 16px; color: #6b7280; margin-top: 4px; }
        
        .amb-driver { display: flex; align-items: center; gap: 16px; padding: 20px; background: linear-gradient(135deg, #f3e8ff, #fdf4ff); border-radius: 16px; margin-top: 16px; }
        .amb-driver-avatar { width: 48px; height: 48px; background: linear-gradient(135deg, #a855f7, #ec4899); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
        .amb-driver-info h4 { font-size: 14px; font-weight: 600; color: #1f2937; }
        .amb-driver-info p { font-size: 12px; color: #6b7280; }
        
        .amb-status { margin-top: 20px; }
        .amb-status-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .amb-status-dot { width: 10px; height: 10px; border-radius: 50%; }
        .amb-status-dot.active { background: #22c55e; animation: blink 1s infinite; }
        .amb-status-dot.pending { background: #d1d5db; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .amb-status-text { font-size: 14px; color: #374151; }
        
        .amb-map-wrap { flex: 1; position: relative; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-height: 500px; }
        .amb-map { width: 100%; height: 100%; border: none; min-height: 550px; }
        .amb-map-badge { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 12px; display: flex; align-items: center; gap: 10px; font-weight: 600; color: #059669; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .amb-live-dot { width: 10px; height: 10px; background: #dc2626; border-radius: 50%; animation: blink 1s infinite; }
        
        .amb-btns { display: flex; gap: 12px; padding: 20px 24px; justify-content: center; flex-wrap: wrap; background: rgba(255,255,255,0.5); }
        .amb-btn { padding: 14px 28px; border-radius: 16px; text-decoration: none; font-weight: 600; font-size: 14px; color: white; display: flex; align-items: center; gap: 8px; transition: transform 0.2s, box-shadow 0.2s; }
        .amb-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .amb-btn.red { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .amb-btn.pink { background: linear-gradient(135deg, #db2777, #be185d); }
        .amb-btn.orange { background: linear-gradient(135deg, #ea580c, #c2410c); }
        
        @media (max-width: 900px) {
          .amb-content { flex-direction: column; padding: 16px; }
          .amb-sidebar { width: 100%; }
          .amb-map-wrap { min-height: 350px; }
          .amb-map { min-height: 350px; }
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
                            <div className="amb-pulse">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="amb-alert-text">
                                <h3>{t.callRaised}</h3>
                                <p>{t.stayCalm || 'Help is on the way'}</p>
                            </div>
                        </div>

                        <div className="amb-card">
                            <div className="amb-eta">
                                <div className="amb-eta-label">{t.eta}</div>
                                <div className="amb-eta-time">{String(eta.mins).padStart(2, '0')}:{String(eta.secs).padStart(2, '0')}</div>
                                <div className="amb-eta-mins">{t.mins}</div>
                            </div>

                            <div className="amb-driver">
                                <div className="amb-driver-avatar">🚑</div>
                                <div className="amb-driver-info">
                                    <h4>{t.ambulanceDispatched}</h4>
                                    <p>{t.vehicleNo || 'DL 01 AB 1234'}</p>
                                </div>
                            </div>

                            <div className="amb-status">
                                <div className="amb-status-item">
                                    <span className="amb-status-dot active"></span>
                                    <span className="amb-status-text">{t.callRaised}</span>
                                </div>
                                <div className="amb-status-item">
                                    <span className="amb-status-dot active"></span>
                                    <span className="amb-status-text">{t.ambulanceDispatched}</span>
                                </div>
                                <div className="amb-status-item">
                                    <span className="amb-status-dot pending"></span>
                                    <span className="amb-status-text">{t.tracking}...</span>
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
