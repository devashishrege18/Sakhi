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
        secs: 'सेकंड',
        ambulanceTypes: 'एम्बुलेंस प्रकार',
        pta: 'रोगी परिवहन',
        bls: 'बेसिक लाइफ सपोर्ट',
        als: 'एडवांस्ड लाइफ सपोर्ट',
        micu: 'मोबाइल ICU',
        stopAlarm: 'अलार्म बंद करने के लिए बटन दबाएं',
        emergency108: '🚨 आपातकालीन 108',
        maternity102: '🚑 मातृत्व 102',
        childline: '👶 चाइल्डलाइन 1098',
        trackingLive: 'लाइव ट्रैकिंग',
        ambulanceOnWay: 'एम्बुलेंस रास्ते में है...',
        locating: 'आपका स्थान पता लगा रहे हैं...',
        locationError: 'स्थान एक्सेस अस्वीकृत। डिफ़ॉल्ट स्थान का उपयोग।'
    },
    'en-IN': {
        title: 'Emergency Ambulance',
        subtitle: 'Immediate help for pregnancy & delivery',
        backBtn: '← Back to Chat',
        callRaised: 'EMERGENCY CALL RAISED..!',
        eta: 'Estimated Time',
        mins: 'mins',
        secs: 'secs',
        ambulanceTypes: 'Ambulance Types',
        pta: 'Patient Transport',
        bls: 'Basic Life Support',
        als: 'Advanced Life Support',
        micu: 'Mobile ICU',
        stopAlarm: '*press emergency button to stop alarm',
        emergency108: '🚨 Emergency 108',
        maternity102: '🚑 Maternity 102',
        childline: '👶 Childline 1098',
        trackingLive: 'Live Tracking',
        ambulanceOnWay: 'Ambulance on the way...',
        locating: 'Locating you...',
        locationError: 'Location access denied. Using default.'
    },
    'bn-IN': {
        title: 'জরুরি অ্যাম্বুলেন্স',
        subtitle: 'গর্ভাবস্থা ও প্রসবের জন্য তাৎক্ষণিক সাহায্য',
        backBtn: '← ফিরে যান',
        callRaised: 'জরুরি কল পাঠানো হয়েছে!',
        eta: 'আনুমানিক সময়',
        mins: 'মিনিট',
        secs: 'সেকেন্ড',
        ambulanceTypes: 'অ্যাম্বুলেন্স প্রকার',
        pta: 'রোগী পরিবহন',
        bls: 'বেসিক লাইফ সাপোর্ট',
        als: 'অ্যাডভান্সড লাইফ সাপোর্ট',
        micu: 'মোবাইল ICU',
        stopAlarm: '*অ্যালার্ম বন্ধ করতে বোতাম টিপুন',
        emergency108: '🚨 জরুরি 108',
        maternity102: '🚑 মাতৃত্ব 102',
        childline: '👶 চাইল্ডলাইন 1098',
        trackingLive: 'লাইভ ট্র্যাকিং',
        ambulanceOnWay: 'অ্যাম্বুলেন্স আসছে...',
        locating: 'আপনার অবস্থান খুঁজছি...',
        locationError: 'অবস্থান অ্যাক্সেস অস্বীকৃত।'
    },
    'te-IN': {
        title: 'అత్యవసర అంబులెన్స్',
        subtitle: 'గర్భం & ప్రసవానికి తక్షణ సహాయం',
        backBtn: '← వెనక్కి',
        callRaised: 'అత్యవసర కాల్ పంపబడింది!',
        eta: 'అంచనా సమయం',
        mins: 'నిమిషాలు',
        secs: 'సెకన్లు',
        ambulanceTypes: 'అంబులెన్స్ రకాలు',
        emergency108: '🚨 అత్యవసర 108',
        maternity102: '🚑 మాతృత్వ 102',
        childline: '👶 చైల్డ్‌లైన్ 1098',
        trackingLive: 'లైవ్ ట్రాకింగ్',
        ambulanceOnWay: 'అంబులెన్స్ వస్తోంది...',
        locating: 'మీ స్థానాన్ని గుర్తిస్తోంది...',
        locationError: 'స్థాన యాక్సెస్ తిరస్కరించబడింది.'
    },
    'ta-IN': {
        title: 'அவசர ஆம்புலன்ஸ்',
        subtitle: 'கர்ப்பம் & பிரசவத்திற்கு உடனடி உதவி',
        backBtn: '← பின் செல்',
        callRaised: 'அவசர அழைப்பு அனுப்பப்பட்டது!',
        eta: 'மதிப்பிட்ட நேரம்',
        mins: 'நிமிடங்கள்',
        secs: 'வினாடிகள்',
        emergency108: '🚨 அவசர 108',
        maternity102: '🚑 மகப்பேறு 102',
        childline: '👶 சைல்ட்லைன் 1098',
        trackingLive: 'நேரடி கண்காணிப்பு',
        ambulanceOnWay: 'ஆம்புலன்ஸ் வருகிறது...',
        locating: 'உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...',
        locationError: 'இருப்பிட அணுகல் மறுக்கப்பட்டது.'
    },
    'mr-IN': {
        title: 'आणीबाणी रुग्णवाहिका',
        subtitle: 'गर्भधारणा आणि प्रसूतीसाठी तात्काळ मदत',
        backBtn: '← मागे जा',
        callRaised: 'आणीबाणी कॉल पाठवला!',
        eta: 'अंदाजे वेळ',
        mins: 'मिनिटे',
        secs: 'सेकंद',
        emergency108: '🚨 आणीबाणी 108',
        maternity102: '🚑 मातृत्व 102',
        childline: '👶 चाइल्डलाइन 1098',
        trackingLive: 'लाइव्ह ट्रॅकिंग',
        ambulanceOnWay: 'रुग्णवाहिका येत आहे...',
        locating: 'तुमचे स्थान शोधत आहे...',
        locationError: 'स्थान प्रवेश नाकारला.'
    },
    'gu-IN': {
        title: 'ઇમરજન્સી એમ્બ્યુલન્સ',
        subtitle: 'ગર્ભાવસ્થા અને ડિલિવરી માટે તાત્કાલિક મદદ',
        backBtn: '← પાછા જાઓ',
        callRaised: 'ઇમરજન્સી કૉલ મોકલ્યો!',
        eta: 'અંદાજિત સમય',
        mins: 'મિનિટ',
        secs: 'સેકન્ડ',
        emergency108: '🚨 ઇમરજન્સી 108',
        maternity102: '🚑 મેટર્નિટી 102',
        childline: '👶 ચાઇલ્ડલાઇન 1098',
        trackingLive: 'લાઇવ ટ્રેકિંગ',
        ambulanceOnWay: 'એમ્બ્યુલન્સ આવી રહી છે...',
        locating: 'તમારું સ્થાન શોધી રહ્યું છે...',
        locationError: 'સ્થાન ઍક્સેસ નકારી.'
    },
    'kn-IN': {
        title: 'ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್',
        subtitle: 'ಗರ್ಭಧಾರಣೆ ಮತ್ತು ಹೆರಿಗೆಗೆ ತಕ್ಷಣದ ಸಹಾಯ',
        backBtn: '← ಹಿಂದೆ',
        callRaised: 'ತುರ್ತು ಕರೆ ಕಳುಹಿಸಲಾಗಿದೆ!',
        eta: 'ಅಂದಾಜು ಸಮಯ',
        mins: 'ನಿಮಿಷಗಳು',
        secs: 'ಸೆಕೆಂಡುಗಳು',
        emergency108: '🚨 ತುರ್ತು 108',
        maternity102: '🚑 ಮಾತೃತ್ವ 102',
        childline: '👶 ಚೈಲ್ಡ್‌ಲೈನ್ 1098',
        trackingLive: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
        ambulanceOnWay: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಬರುತ್ತಿದೆ...',
        locating: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕುತ್ತಿದೆ...',
        locationError: 'ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ.'
    },
    'ml-IN': {
        title: 'അടിയന്തര ആംബുലൻസ്',
        subtitle: 'ഗർഭധാരണത്തിനും പ്രസവത്തിനും ഉടനടി സഹായം',
        backBtn: '← തിരികെ',
        callRaised: 'അടിയന്തര കോൾ അയച്ചു!',
        eta: 'എത്തിച്ചേരാനുള്ള സമയം',
        mins: 'മിനിറ്റ്',
        secs: 'സെക്കൻഡ്',
        emergency108: '🚨 അടിയന്തര 108',
        maternity102: '🚑 മെറ്റേണിറ്റി 102',
        childline: '👶 ചൈൽഡ്‌ലൈൻ 1098',
        trackingLive: 'ലൈവ് ട്രാക്കിംഗ്',
        ambulanceOnWay: 'ആംബുലൻസ് വരുന്നു...',
        locating: 'നിങ്ങളുടെ സ്ഥാനം കണ്ടെത്തുന്നു...',
        locationError: 'ലൊക്കേഷൻ ആക്‌സസ് നിരസിച്ചു.'
    },
    'pa-IN': {
        title: 'ਐਮਰਜੈਂਸੀ ਐਂਬੂਲੈਂਸ',
        subtitle: 'ਗਰਭ ਅਵਸਥਾ ਅਤੇ ਡਿਲੀਵਰੀ ਲਈ ਤੁਰੰਤ ਮਦਦ',
        backBtn: '← ਪਿੱਛੇ ਜਾਓ',
        callRaised: 'ਐਮਰਜੈਂਸੀ ਕਾਲ ਭੇਜੀ ਗਈ!',
        eta: 'ਅੰਦਾਜ਼ਨ ਸਮਾਂ',
        mins: 'ਮਿੰਟ',
        secs: 'ਸਕਿੰਟ',
        emergency108: '🚨 ਐਮਰਜੈਂਸੀ 108',
        maternity102: '🚑 ਮੈਟਰਨਿਟੀ 102',
        childline: '👶 ਚਾਈਲਡਲਾਈਨ 1098',
        trackingLive: 'ਲਾਈਵ ਟਰੈਕਿੰਗ',
        ambulanceOnWay: 'ਐਂਬੂਲੈਂਸ ਆ ਰਹੀ ਹੈ...',
        locating: 'ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਲੱਭ ਰਹੇ ਹਾਂ...',
        locationError: 'ਟਿਕਾਣਾ ਐਕਸੈਸ ਅਸਵੀਕਾਰ।'
    }
};

export default function AmbulancePage() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emergencyActive, setEmergencyActive] = useState(false);
    const [eta, setEta] = useState({ mins: 8, secs: 45 });
    const [lang, setLang] = useState('en-IN');
    const timerRef = useRef(null);

    const t = TRANSLATIONS[lang] || TRANSLATIONS['en-IN'];

    // Get saved language from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('sakhi_lang_code');
            if (savedLang && TRANSLATIONS[savedLang]) {
                setLang(savedLang);
            }
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setLoading(false);
                    // Auto-trigger emergency when page loads
                    setEmergencyActive(true);
                },
                (err) => {
                    setError(t.locationError);
                    setLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi default
                    setLoading(false);
                    setEmergencyActive(true);
                }
            );
        } else {
            setLocation({ lat: 28.6139, lng: 77.2090 });
            setLoading(false);
            setEmergencyActive(true);
        }
    }, []);

    // ETA Countdown Timer
    useEffect(() => {
        if (emergencyActive && (eta.mins > 0 || eta.secs > 0)) {
            timerRef.current = setInterval(() => {
                setEta(prev => {
                    if (prev.secs > 0) {
                        return { ...prev, secs: prev.secs - 1 };
                    } else if (prev.mins > 0) {
                        return { mins: prev.mins - 1, secs: 59 };
                    }
                    return prev;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [emergencyActive]);

    const mapUrl = location
        ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=ambulance+services+near+me&center=${location.lat},${location.lng}&zoom=14`
        : null;

    return (
        <>
            <style jsx global>{`
        .ambulance-page { min-height: 100vh; background: linear-gradient(135deg, #fef2f2, #fce7f3); display: flex; flex-direction: column; font-family: sans-serif; }
        .ambulance-header { background: linear-gradient(135deg, #dc2626, #be185d); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(220,38,38,0.3); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header-left img { height: 40px; }
        .header-left span { color: white; font-size: 20px; font-weight: bold; }
        .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
        
        .content-wrapper { display: flex; flex: 1; padding: 20px; gap: 20px; }
        
        .left-panel { width: 320px; display: flex; flex-direction: column; gap: 16px; }
        
        .status-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .status-card h3 { font-size: 14px; color: #666; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .emergency-alert { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .pulse-icon { width: 48px; height: 48px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite; }
        .pulse-icon svg { width: 28px; height: 28px; color: white; }
        @keyframes pulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220,38,38,0.5); } 50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(220,38,38,0); } }
        .alert-text h2 { font-size: 16px; color: #dc2626; font-weight: bold; margin: 0; }
        
        .eta-display { background: linear-gradient(135deg, #1f2937, #374151); border-radius: 12px; padding: 20px; text-align: center; color: white; }
        .eta-label { font-size: 12px; opacity: 0.8; margin-bottom: 8px; }
        .eta-time { font-size: 36px; font-weight: bold; font-family: monospace; }
        .eta-time span { font-size: 14px; opacity: 0.7; }
        
        .ambulance-types { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
        .type-badge { padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .type-badge.pta { background: #fef3c7; color: #92400e; }
        .type-badge.bls { background: #dbeafe; color: #1e40af; }
        .type-badge.als { background: #dcfce7; color: #166534; }
        .type-badge.micu { background: #fce7f3; color: #be185d; }
        
        .stop-alarm { font-size: 11px; color: #999; text-align: center; margin-top: 12px; }
        
        .map-container { flex: 1; position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); min-height: 400px; }
        .map-frame { width: 100%; height: 100%; border: none; min-height: 500px; }
        .map-overlay { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.95); padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .live-dot { width: 8px; height: 8px; background: #dc2626; border-radius: 50%; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        
        .emergency-btns { padding: 16px 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; background: rgba(255,255,255,0.5); }
        .emergency-btn { padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; color: white; display: flex; align-items: center; gap: 8px; }
        .emergency-btn.red { background: #dc2626; }
        .emergency-btn.pink { background: #be185d; }
        .emergency-btn.orange { background: #ea580c; }
        
        @media (max-width: 900px) {
          .content-wrapper { flex-direction: column; }
          .left-panel { width: 100%; }
          .map-container { min-height: 350px; }
          .map-frame { min-height: 350px; }
        }
        @media (max-width: 480px) {
          .ambulance-header { padding: 12px 16px; }
          .header-left span { font-size: 16px; }
          .content-wrapper { padding: 12px; }
          .eta-time { font-size: 28px; }
        }
      `}</style>

            <div className="ambulance-page">
                <header className="ambulance-header">
                    <div className="header-left">
                        <img src="/sakhi-logo.png" alt="Sakhi" />
                        <span>{t.title}</span>
                    </div>
                    <a href="/" className="back-btn">{t.backBtn}</a>
                </header>

                <div className="content-wrapper">
                    <div className="left-panel">
                        <div className="status-card">
                            <div className="emergency-alert">
                                <div className="pulse-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="alert-text">
                                    <h2>{t.callRaised}</h2>
                                </div>
                            </div>

                            <div className="eta-display">
                                <div className="eta-label">{t.eta}</div>
                                <div className="eta-time">
                                    {String(eta.mins).padStart(2, '0')}:{String(eta.secs).padStart(2, '0')}
                                    <span> {t.mins}</span>
                                </div>
                            </div>

                            <div className="ambulance-types">
                                <span className="type-badge pta">PTA</span>
                                <span className="type-badge bls">BLS</span>
                                <span className="type-badge als">ALS</span>
                                <span className="type-badge micu">MICU</span>
                            </div>

                            <p className="stop-alarm">{t.stopAlarm}</p>
                        </div>
                    </div>

                    <div className="map-container">
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f3f4f6' }}>
                                <p>{t.locating}</p>
                            </div>
                        ) : (
                            <>
                                <iframe
                                    src={mapUrl}
                                    className="map-frame"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <div className="map-overlay">
                                    <span className="live-dot"></span>
                                    {t.trackingLive}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="emergency-btns">
                    <a href="tel:108" className="emergency-btn red">{t.emergency108}</a>
                    <a href="tel:102" className="emergency-btn pink">{t.maternity102}</a>
                    <a href="tel:1098" className="emergency-btn orange">{t.childline}</a>
                </div>
            </div>
        </>
    );
}
