'use client';
import { useState, useEffect } from 'react';

// Translations for all languages
const TRANSLATIONS = {
    'hi-IN': {
        title: 'सुरक्षित आश्रय',
        subtitle: 'घरेलू हिंसा से तत्काल सुरक्षा और मदद',
        backBtn: '← वापस जाएं',
        youAreSafe: 'आप सुरक्षित हैं',
        helpOnWay: 'मदद आ रही है...',
        findingShelter: 'आश्रय खोज रहे हैं...',
        nearbyCenters: 'नजदीकी सहायता केंद्र',
        directConnect: 'सीधे जुड़ें',
        womenHelpline: '👩 महिला हेल्पलाइन 181',
        police: '🚔 पुलिस 100',
        womenCell: '👮‍♀️ महिला सेल 1091',
        ncw: '🏛️ राष्ट्रीय महिला आयोग',
        callNow: 'अभी कॉल करें',
        emergencyHelp: 'आपातकालीन सहायता',
        safetyTips: 'सुरक्षा सुझाव',
        tip1: 'सुरक्षित स्थान पर जाएं',
        tip2: 'किसी विश्वसनीय को बताएं',
        tip3: 'ज़रूरी दस्तावेज़ साथ रखें',
        connecting: 'जोड़ रहे हैं...',
        locationError: 'स्थान एक्सेस अस्वीकृत।',
        locating: 'आपका स्थान खोज रहे हैं...'
    },
    'en-IN': {
        title: 'Safe Shelter',
        subtitle: 'Immediate protection from domestic violence',
        backBtn: '← Back to Chat',
        youAreSafe: 'You Are Safe',
        helpOnWay: 'Help is on the way...',
        findingShelter: 'Finding safe shelters...',
        nearbyCenters: 'Nearby Help Centers',
        directConnect: 'Direct Connect',
        womenHelpline: '👩 Women Helpline 181',
        police: '🚔 Police 100',
        womenCell: '👮‍♀️ Women Cell 1091',
        ncw: '🏛️ National Commission for Women',
        callNow: 'Call Now',
        emergencyHelp: 'Emergency Help',
        safetyTips: 'Safety Tips',
        tip1: 'Move to a safe location',
        tip2: 'Inform someone you trust',
        tip3: 'Keep important documents ready',
        connecting: 'Connecting...',
        locationError: 'Location access denied.',
        locating: 'Locating you...'
    },
    'bn-IN': {
        title: 'নিরাপদ আশ্রয়',
        subtitle: 'পারিবারিক সহিংসতা থেকে তাৎক্ষণিক সুরক্ষা',
        backBtn: '← ফিরে যান',
        youAreSafe: 'আপনি নিরাপদ',
        helpOnWay: 'সাহায্য আসছে...',
        findingShelter: 'আশ্রয় খুঁজছি...',
        nearbyCenters: 'কাছের সাহায্য কেন্দ্র',
        directConnect: 'সরাসরি যোগাযোগ',
        womenHelpline: '👩 মহিলা হেল্পলাইন 181',
        police: '🚔 পুলিশ 100',
        womenCell: '👮‍♀️ মহিলা সেল 1091',
        ncw: '🏛️ জাতীয় মহিলা কমিশন',
        callNow: 'এখনই কল করুন',
        emergencyHelp: 'জরুরি সাহায্য',
        safetyTips: 'নিরাপত্তা পরামর্শ',
        tip1: 'নিরাপদ স্থানে যান',
        tip2: 'বিশ্বস্ত কাউকে জানান',
        tip3: 'গুরুত্বপূর্ণ নথি সঙ্গে রাখুন',
        connecting: 'সংযোগ করা হচ্ছে...',
        locationError: 'অবস্থান অ্যাক্সেস অস্বীকৃত।',
        locating: 'আপনার অবস্থান খুঁজছি...'
    },
    'te-IN': {
        title: 'సురక్షిత ఆశ్రయం',
        subtitle: 'గృహ హింస నుండి తక్షణ రక్షణ',
        backBtn: '← వెనక్కి',
        youAreSafe: 'మీరు సురక్షితం',
        helpOnWay: 'సహాయం వస్తోంది...',
        findingShelter: 'ఆశ్రయం వెతుకుతోంది...',
        nearbyCenters: 'సమీపంలోని సహాయ కేంద్రాలు',
        directConnect: 'నేరుగా కనెక్ట్',
        womenHelpline: '👩 మహిళా హెల్ప్‌లైన్ 181',
        police: '🚔 పోలీసు 100',
        womenCell: '👮‍♀️ మహిళా సెల్ 1091',
        ncw: '🏛️ జాతీయ మహిళా కమిషన్',
        callNow: 'ఇప్పుడే కాల్ చేయండి',
        emergencyHelp: 'అత్యవసర సహాయం',
        safetyTips: 'భద్రతా చిట్కాలు',
        tip1: 'సురక్షిత ప్రదేశానికి వెళ్ళండి',
        tip2: 'నమ్మకమైన వారికి చెప్పండి',
        tip3: 'ముఖ్యమైన పత్రాలు సిద్ధంగా ఉంచండి',
        connecting: 'కనెక్ట్ చేస్తోంది...',
        locationError: 'స్థాన యాక్సెస్ తిరస్కరించబడింది.',
        locating: 'మీ స్థానాన్ని గుర్తిస్తోంది...'
    },
    'ta-IN': {
        title: 'பாதுகாப்பான தங்குமிடம்',
        subtitle: 'குடும்ப வன்முறையிலிருந்து உடனடி பாதுகாப்பு',
        backBtn: '← பின் செல்',
        youAreSafe: 'நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள்',
        helpOnWay: 'உதவி வருகிறது...',
        findingShelter: 'தங்குமிடம் தேடுகிறது...',
        nearbyCenters: 'அருகிலுள்ள உதவி மையங்கள்',
        directConnect: 'நேரடி இணைப்பு',
        womenHelpline: '👩 பெண்கள் ஹெல்ப்லைன் 181',
        police: '🚔 காவல் 100',
        womenCell: '👮‍♀️ பெண்கள் பிரிவு 1091',
        ncw: '🏛️ தேசிய பெண்கள் ஆணையம்',
        callNow: 'இப்போதே அழைக்கவும்',
        emergencyHelp: 'அவசர உதவி',
        safetyTips: 'பாதுகாப்பு குறிப்புகள்',
        tip1: 'பாதுகாப்பான இடத்திற்குச் செல்லுங்கள்',
        tip2: 'நம்பகமானவர்களிடம் சொல்லுங்கள்',
        tip3: 'முக்கிய ஆவணங்களை தயாராக வைக்கவும்',
        connecting: 'இணைக்கிறது...',
        locationError: 'இருப்பிட அணுகல் மறுக்கப்பட்டது.',
        locating: 'உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...'
    },
    'mr-IN': {
        title: 'सुरक्षित आश्रय',
        subtitle: 'घरगुती हिंसाचारापासून तात्काळ संरक्षण',
        backBtn: '← मागे जा',
        youAreSafe: 'तुम्ही सुरक्षित आहात',
        helpOnWay: 'मदत येत आहे...',
        findingShelter: 'आश्रय शोधत आहे...',
        nearbyCenters: 'जवळील मदत केंद्रे',
        directConnect: 'थेट कनेक्ट',
        womenHelpline: '👩 महिला हेल्पलाइन 181',
        police: '🚔 पोलिस 100',
        womenCell: '👮‍♀️ महिला सेल 1091',
        ncw: '🏛️ राष्ट्रीय महिला आयोग',
        callNow: 'आता कॉल करा',
        emergencyHelp: 'आणीबाणी मदत',
        safetyTips: 'सुरक्षितता टिप्स',
        tip1: 'सुरक्षित ठिकाणी जा',
        tip2: 'विश्वासू व्यक्तीला सांगा',
        tip3: 'महत्त्वाची कागदपत्रे तयार ठेवा',
        connecting: 'जोडत आहे...',
        locationError: 'स्थान प्रवेश नाकारला.',
        locating: 'तुमचे स्थान शोधत आहे...'
    },
    'gu-IN': {
        title: 'સુરક્ષિત આશ્રય',
        subtitle: 'ઘરેલું હિંસાથી તાત્કાલિક સુરક્ષા',
        backBtn: '← પાછા જાઓ',
        youAreSafe: 'તમે સુરક્ષિત છો',
        helpOnWay: 'મદદ આવી રહી છે...',
        findingShelter: 'આશ્રય શોધી રહ્યું છે...',
        nearbyCenters: 'નજીકના સહાય કેન્દ્રો',
        directConnect: 'સીધું કનેક્ટ',
        womenHelpline: '👩 મહિલા હેલ્પલાઇન 181',
        police: '🚔 પોલીસ 100',
        womenCell: '👮‍♀️ મહિલા સેલ 1091',
        ncw: '🏛️ રાષ્ટ્રીય મહિલા આયોગ',
        callNow: 'હવે કૉલ કરો',
        emergencyHelp: 'ઇમરજન્સી મદદ',
        safetyTips: 'સુરક્ષા ટિપ્સ',
        tip1: 'સુરક્ષિત સ્થળે જાઓ',
        tip2: 'વિશ્વાસુ વ્યક્તિને જણાવો',
        tip3: 'મહત્વના દસ્તાવેજો તૈયાર રાખો',
        connecting: 'કનેક્ટ કરી રહ્યું છે...',
        locationError: 'સ્થાન ઍક્સેસ નકારી.',
        locating: 'તમારું સ્થાન શોધી રહ્યું છે...'
    },
    'kn-IN': {
        title: 'ಸುರಕ್ಷಿತ ಆಶ್ರಯ',
        subtitle: 'ಗೃಹ ಹಿಂಸೆಯಿಂದ ತಕ್ಷಣದ ರಕ್ಷಣೆ',
        backBtn: '← ಹಿಂದೆ',
        youAreSafe: 'ನೀವು ಸುರಕ್ಷಿತರಾಗಿದ್ದೀರಿ',
        helpOnWay: 'ಸಹಾಯ ಬರುತ್ತಿದೆ...',
        findingShelter: 'ಆಶ್ರಯ ಹುಡುಕುತ್ತಿದೆ...',
        nearbyCenters: 'ಹತ್ತಿರದ ಸಹಾಯ ಕೇಂದ್ರಗಳು',
        directConnect: 'ನೇರ ಸಂಪರ್ಕ',
        womenHelpline: '👩 ಮಹಿಳಾ ಹೆಲ್ಪ್‌ಲೈನ್ 181',
        police: '🚔 ಪೊಲೀಸ್ 100',
        womenCell: '👮‍♀️ ಮಹಿಳಾ ಕೋಶ 1091',
        ncw: '🏛️ ರಾಷ್ಟ್ರೀಯ ಮಹಿಳಾ ಆಯೋಗ',
        callNow: 'ಈಗಲೇ ಕರೆ ಮಾಡಿ',
        emergencyHelp: 'ತುರ್ತು ಸಹಾಯ',
        safetyTips: 'ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು',
        tip1: 'ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ',
        tip2: 'ನಂಬಿಕಸ್ಥರಿಗೆ ತಿಳಿಸಿ',
        tip3: 'ಪ್ರಮುಖ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ',
        connecting: 'ಸಂಪರ್ಕಿಸುತ್ತಿದೆ...',
        locationError: 'ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ.',
        locating: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕುತ್ತಿದೆ...'
    },
    'ml-IN': {
        title: 'സുരക്ഷിത അഭയകേന്ദ്രം',
        subtitle: 'ഗാർഹിക പീഡനത്തിൽ നിന്ന് ഉടനടി സംരക്ഷണം',
        backBtn: '← തിരികെ',
        youAreSafe: 'നിങ്ങൾ സുരക്ഷിതരാണ്',
        helpOnWay: 'സഹായം വരുന്നു...',
        findingShelter: 'അഭയകേന്ദ്രം തിരയുന്നു...',
        nearbyCenters: 'സമീപത്തുള്ള സഹായ കേന്ദ്രങ്ങൾ',
        directConnect: 'നേരിട്ട് ബന്ധപ്പെടുക',
        womenHelpline: '👩 വനിതാ ഹെൽപ്പ്‌ലൈൻ 181',
        police: '🚔 പോലീസ് 100',
        womenCell: '👮‍♀️ വനിതാ സെൽ 1091',
        ncw: '🏛️ ദേശീയ വനിതാ കമ്മീഷൻ',
        callNow: 'ഇപ്പോൾ വിളിക്കുക',
        emergencyHelp: 'അടിയന്തര സഹായം',
        safetyTips: 'സുരക്ഷാ നിർദ്ദേശങ്ങൾ',
        tip1: 'സുരക്ഷിത സ്ഥലത്തേക്ക് പോകുക',
        tip2: 'വിശ്വസ്തരെ അറിയിക്കുക',
        tip3: 'പ്രധാന രേഖകൾ തയ്യാറാക്കുക',
        connecting: 'ബന്ധിപ്പിക്കുന്നു...',
        locationError: 'ലൊക്കേഷൻ ആക്‌സസ് നിരസിച്ചു.',
        locating: 'നിങ്ങളുടെ സ്ഥാനം കണ്ടെത്തുന്നു...'
    },
    'pa-IN': {
        title: 'ਸੁਰੱਖਿਅਤ ਆਸਰਾ',
        subtitle: 'ਘਰੇਲੂ ਹਿੰਸਾ ਤੋਂ ਤੁਰੰਤ ਸੁਰੱਖਿਆ',
        backBtn: '← ਪਿੱਛੇ ਜਾਓ',
        youAreSafe: 'ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਹੋ',
        helpOnWay: 'ਮਦਦ ਆ ਰਹੀ ਹੈ...',
        findingShelter: 'ਆਸਰਾ ਲੱਭ ਰਹੇ ਹਾਂ...',
        nearbyCenters: 'ਨੇੜਲੇ ਮਦਦ ਕੇਂਦਰ',
        directConnect: 'ਸਿੱਧਾ ਕਨੈਕਟ',
        womenHelpline: '👩 ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ 181',
        police: '🚔 ਪੁਲਿਸ 100',
        womenCell: '👮‍♀️ ਮਹਿਲਾ ਸੈੱਲ 1091',
        ncw: '🏛️ ਰਾਸ਼ਟਰੀ ਮਹਿਲਾ ਕਮਿਸ਼ਨ',
        callNow: 'ਹੁਣੇ ਕਾਲ ਕਰੋ',
        emergencyHelp: 'ਐਮਰਜੈਂਸੀ ਮਦਦ',
        safetyTips: 'ਸੁਰੱਖਿਆ ਸੁਝਾਅ',
        tip1: 'ਸੁਰੱਖਿਅਤ ਥਾਂ ਤੇ ਜਾਓ',
        tip2: 'ਭਰੋਸੇਯੋਗ ਨੂੰ ਦੱਸੋ',
        tip3: 'ਮਹੱਤਵਪੂਰਨ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਰੱਖੋ',
        connecting: 'ਕਨੈਕਟ ਕਰ ਰਹੇ ਹਾਂ...',
        locationError: 'ਟਿਕਾਣਾ ਐਕਸੈਸ ਅਸਵੀਕਾਰ।',
        locating: 'ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਲੱਭ ਰਹੇ ਹਾਂ...'
    }
};

export default function ShelterPage() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState('en-IN');

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
                },
                (err) => {
                    setError(t.locationError);
                    setLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi default
                    setLoading(false);
                }
            );
        } else {
            setLocation({ lat: 28.6139, lng: 77.2090 });
            setLoading(false);
        }
    }, []);

    const mapUrl = location
        ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=women+shelter+home+near+me&center=${location.lat},${location.lng}&zoom=13`
        : null;

    return (
        <>
            <style jsx global>{`
        .shelter-page { min-height: 100vh; background: linear-gradient(135deg, #ede9fe, #fce7f3); display: flex; flex-direction: column; font-family: sans-serif; }
        .shelter-header { background: linear-gradient(135deg, #7c3aed, #db2777); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(124,58,237,0.3); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header-left img { height: 40px; }
        .header-left span { color: white; font-size: 20px; font-weight: bold; }
        .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
        
        .content-wrapper { display: flex; flex: 1; padding: 20px; gap: 20px; }
        
        .left-panel { width: 340px; display: flex; flex-direction: column; gap: 16px; }
        
        .safety-card { background: linear-gradient(135deg, #059669, #10b981); border-radius: 16px; padding: 24px; color: white; text-align: center; }
        .safety-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; }
        .safety-card h2 { font-size: 22px; margin: 0 0 8px; }
        .safety-card p { opacity: 0.9; margin: 0; }
        
        .help-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .help-card h3 { font-size: 14px; color: #666; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; }
        .help-card h3::before { content: ''; display: block; width: 4px; height: 16px; background: #7c3aed; border-radius: 2px; }
        
        .helpline-btns { display: flex; flex-direction: column; gap: 10px; }
        .helpline-btn { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; transition: all 0.2s; border: none; cursor: pointer; }
        .helpline-btn.purple { background: linear-gradient(135deg, #7c3aed, #9333ea); color: white; }
        .helpline-btn.red { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; }
        .helpline-btn.pink { background: linear-gradient(135deg, #db2777, #ec4899); color: white; }
        .helpline-btn.blue { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; }
        .helpline-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .btn-arrow { margin-left: auto; opacity: 0.7; }
        
        .tips-card { background: #fef3c7; border-radius: 16px; padding: 20px; border: 1px solid #fcd34d; }
        .tips-card h3 { font-size: 14px; color: #92400e; margin: 0 0 12px; }
        .tips-list { list-style: none; padding: 0; margin: 0; }
        .tips-list li { padding: 8px 0; color: #78350f; font-size: 13px; display: flex; align-items: center; gap: 8px; }
        .tips-list li::before { content: '✓'; color: #059669; font-weight: bold; }
        
        .map-container { flex: 1; position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); min-height: 400px; }
        .map-frame { width: 100%; height: 100%; border: none; min-height: 500px; }
        .map-overlay { position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.95); padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #7c3aed; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        
        .emergency-strip { padding: 16px 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; background: linear-gradient(135deg, #1f2937, #374151); }
        .emergency-strip a { padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 13px; color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); transition: all 0.2s; }
        .emergency-strip a:hover { background: rgba(255,255,255,0.2); }
        
        @media (max-width: 900px) {
          .content-wrapper { flex-direction: column; }
          .left-panel { width: 100%; }
          .map-container { min-height: 350px; }
          .map-frame { min-height: 350px; }
        }
        @media (max-width: 480px) {
          .shelter-header { padding: 12px 16px; }
          .header-left span { font-size: 16px; }
          .content-wrapper { padding: 12px; }
          .safety-card h2 { font-size: 18px; }
        }
      `}</style>

            <div className="shelter-page">
                <header className="shelter-header">
                    <div className="header-left">
                        <img src="/sakhi-logo.png" alt="Sakhi" />
                        <span>{t.title}</span>
                    </div>
                    <a href="/" className="back-btn">{t.backBtn}</a>
                </header>

                <div className="content-wrapper">
                    <div className="left-panel">
                        <div className="safety-card">
                            <div className="safety-icon">🛡️</div>
                            <h2>{t.youAreSafe}</h2>
                            <p>{t.helpOnWay}</p>
                        </div>

                        <div className="help-card">
                            <h3>{t.directConnect}</h3>
                            <div className="helpline-btns">
                                <a href="tel:181" className="helpline-btn purple">
                                    {t.womenHelpline}
                                    <span className="btn-arrow">→</span>
                                </a>
                                <a href="tel:100" className="helpline-btn red">
                                    {t.police}
                                    <span className="btn-arrow">→</span>
                                </a>
                                <a href="tel:1091" className="helpline-btn pink">
                                    {t.womenCell}
                                    <span className="btn-arrow">→</span>
                                </a>
                                <a href="tel:7827170170" className="helpline-btn blue">
                                    {t.ncw}
                                    <span className="btn-arrow">→</span>
                                </a>
                            </div>
                        </div>

                        <div className="tips-card">
                            <h3>💡 {t.safetyTips}</h3>
                            <ul className="tips-list">
                                <li>{t.tip1}</li>
                                <li>{t.tip2}</li>
                                <li>{t.tip3}</li>
                            </ul>
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
                                    📍 {t.nearbyCenters}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="emergency-strip">
                    <a href="tel:181">{t.womenHelpline}</a>
                    <a href="tel:100">{t.police}</a>
                    <a href="tel:1091">{t.womenCell}</a>
                </div>
            </div>
        </>
    );
}
