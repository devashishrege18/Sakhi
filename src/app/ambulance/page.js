'use client';
import { useState, useEffect, useRef } from 'react';

const TRANSLATIONS = {
    'hi-IN': { title: 'आपातकालीन एम्बुलेंस', backBtn: '← वापस', callRaised: 'एम्बुलेंस भेजी गई!', eta: 'पहुँचने का समय', mins: 'मिनट', driverName: 'ड्राइवर: राजेश कुमार', vehicleNo: 'DL 01 AB 1234', tracking: 'लाइव ट्रैकिंग', emergency108: '🚨 आपातकालीन 108', maternity102: '🚑 मातृत्व 102', childline: '👶 चाइल्डलाइन 1098', stayCalm: 'शांत रहें, मदद आ रही है', locating: 'स्थान खोज रहे हैं...', arrived: '🎉 एम्बुलेंस पहुँच गई!' },
    'en-IN': { title: 'Emergency Ambulance', backBtn: '← Back', callRaised: 'AMBULANCE DISPATCHED!', eta: 'Arriving In', mins: 'mins', driverName: 'Driver: Rajesh Kumar', vehicleNo: 'DL 01 AB 1234', tracking: 'Live Tracking', emergency108: '🚨 Emergency 108', maternity102: '🚑 Maternity 102', childline: '👶 Childline 1098', stayCalm: 'Stay calm, help is coming', locating: 'Locating you...', arrived: '🎉 Ambulance has arrived!' },
    'bn-IN': { title: 'জরুরি অ্যাম্বুলেন্স', backBtn: '← ফিরুন', callRaised: 'অ্যাম্বুলেন্স পাঠানো হয়েছে!', eta: 'আসছে', mins: 'মিনিট', tracking: 'লাইভ ট্র্যাকিং', emergency108: '🚨 জরুরি 108', maternity102: '🚑 মাতৃত্ব 102', childline: '👶 চাইল্ডলাইন 1098', stayCalm: 'শান্ত থাকুন', locating: 'অবস্থান খুঁজছি...', arrived: '🎉 অ্যাম্বুলেন্স পৌঁছেছে!' },
    'te-IN': { title: 'అత్యవసర అంబులెన్స్', backBtn: '← వెనక్కి', callRaised: 'అంబులెన్స్ పంపబడింది!', eta: 'చేరుకుంటోంది', mins: 'నిమిషాలు', tracking: 'లైవ్ ట్రాకింగ్', emergency108: '🚨 అత్యవసర 108', maternity102: '🚑 మాతృత్వ 102', childline: '👶 చైల్డ్‌లైన్ 1098', stayCalm: 'ప్రశాంతంగా ఉండండి', locating: 'మీ స్థానం...', arrived: '🎉 అంబులెన్స్ వచ్చేసింది!' },
    'ta-IN': { title: 'அவசர ஆம்புலன்ஸ்', backBtn: '← பின்', callRaised: 'ஆம்புலன்ஸ் அனுப்பப்பட்டது!', eta: 'வருகிறது', mins: 'நிமிடங்கள்', tracking: 'நேரடி கண்காணிப்பு', emergency108: '🚨 அவசர 108', maternity102: '🚑 மகப்பேறு 102', childline: '👶 சைல்ட்லைன் 1098', stayCalm: 'அமைதியாக இருங்கள்', locating: 'இருப்பிடம்...', arrived: '🎉 ஆம்புலன்ஸ் வந்துவிட்டது!' },
    'mr-IN': { title: 'आणीबाणी रुग्णवाहिका', backBtn: '← मागे', callRaised: 'रुग्णवाहिका पाठवली!', eta: 'येत आहे', mins: 'मिनिटे', tracking: 'लाइव्ह ट्रॅकिंग', emergency108: '🚨 आणीबाणी 108', maternity102: '🚑 मातृत्व 102', childline: '👶 चाइल्डलाइन 1098', stayCalm: 'शांत राहा', locating: 'स्थान...', arrived: '🎉 रुग्णवाहिका आली!' },
    'gu-IN': { title: 'ઇમરજન્સી એમ્બ્યુલન્સ', backBtn: '← પાછા', callRaised: 'એમ્બ્યુલન્સ મોકલી!', eta: 'આવી રહી છે', mins: 'મિનિટ', tracking: 'લાઇવ ટ્રેકિંગ', emergency108: '🚨 ઇમરજન્સી 108', maternity102: '🚑 મેટર્નિટી 102', childline: '👶 ચાઇલ્ડલાઇન 1098', stayCalm: 'શાંત રહો', locating: 'સ્થાન...', arrived: '🎉 એમ્બ્યુલન્સ આવી ગઈ!' },
    'kn-IN': { title: 'ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್', backBtn: '← ಹಿಂದೆ', callRaised: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಕಳುಹಿಸಲಾಗಿದೆ!', eta: 'ಬರುತ್ತಿದೆ', mins: 'ನಿಮಿಷ', tracking: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್', emergency108: '🚨 ತುರ್ತು 108', maternity102: '🚑 ಮಾತೃತ್ವ 102', childline: '👶 ಚೈಲ್ಡ್‌ಲೈನ್ 1098', stayCalm: 'ಶಾಂತವಾಗಿರಿ', locating: 'ಸ್ಥಳ...', arrived: '🎉 ಆಂಬ್ಯುಲೆನ್ಸ್ ಬಂದಿದೆ!' },
    'ml-IN': { title: 'അടിയന്തര ആംബുലൻസ്', backBtn: '← തിരികെ', callRaised: 'ആംബുലൻസ് അയച്ചു!', eta: 'വരുന്നു', mins: 'മിനിറ്റ്', tracking: 'ലൈവ് ട്രാക്കിംഗ്', emergency108: '🚨 അടിയന്തര 108', maternity102: '🚑 മെറ്റേണിറ്റി 102', childline: '👶 ചൈൽഡ്‌ലൈൻ 1098', stayCalm: 'ശാന്തമായിരിക്കുക', locating: 'സ്ഥാനം...', arrived: '🎉 ആംബുലൻസ് എത്തി!' },
    'pa-IN': { title: 'ਐਮਰਜੈਂਸੀ ਐਂਬੂਲੈਂਸ', backBtn: '← ਪਿੱਛੇ', callRaised: 'ਐਂਬੂਲੈਂਸ ਭੇਜੀ!', eta: 'ਆ ਰਹੀ ਹੈ', mins: 'ਮਿੰਟ', tracking: 'ਲਾਈਵ ਟਰੈਕਿੰਗ', emergency108: '🚨 ਐਮਰਜੈਂਸੀ 108', maternity102: '🚑 ਮੈਟਰਨਿਟੀ 102', childline: '👶 ਚਾਈਲਡਲਾਈਨ 1098', stayCalm: 'ਸ਼ਾਂਤ ਰਹੋ', locating: 'ਟਿਕਾਣਾ...', arrived: '🎉 ਐਂਬੂਲੈਂਸ ਆ ਗਈ!' }
};

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateETA(distanceKm) {
    return Math.max(2, Math.min(Math.ceil((distanceKm / 30) * 60), 30));
}

export default function AmbulancePage() {
    const [userLocation, setUserLocation] = useState(null);
    const [hospitalLocation, setHospitalLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eta, setEta] = useState({ mins: 0, secs: 0 });
    const [lang, setLang] = useState('en-IN');
    const [progress, setProgress] = useState(0);
    const [arrived, setArrived] = useState(false);
    const [routeCoords, setRouteCoords] = useState([]); // Real road path coordinates
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const ambulanceMarkerRef = useRef(null);
    const timerRef = useRef(null);
    const totalSecondsRef = useRef(0);
    const startTimeRef = useRef(null);
    const currentRouteIndexRef = useRef(0);

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
                    const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setUserLocation(userLoc);
                    const angle = Math.random() * 2 * Math.PI;
                    const dist = 0.02 + Math.random() * 0.03;
                    const hospLoc = { lat: userLoc.lat + dist * Math.cos(angle), lng: userLoc.lng + dist * Math.sin(angle) };
                    setHospitalLocation(hospLoc);
                    const distKm = getDistance(userLoc.lat, userLoc.lng, hospLoc.lat, hospLoc.lng);
                    const etaMins = calculateETA(distKm);
                    totalSecondsRef.current = etaMins * 60;
                    setEta({ mins: etaMins, secs: 0 });
                    startTimeRef.current = Date.now();
                    setLoading(false);
                },
                () => {
                    const userLoc = { lat: 28.6139, lng: 77.2090 };
                    const hospLoc = { lat: 28.6339, lng: 77.2290 };
                    setUserLocation(userLoc);
                    setHospitalLocation(hospLoc);
                    totalSecondsRef.current = 8 * 60;
                    setEta({ mins: 8, secs: 0 });
                    startTimeRef.current = Date.now();
                    setLoading(false);
                }
            );
        }
    }, []);

    // Fetch real road route from OSRM
    useEffect(() => {
        if (!userLocation || !hospitalLocation) return;

        const fetchRoute = async () => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${hospitalLocation.lng},${hospitalLocation.lat};${userLocation.lng},${userLocation.lat}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                if (data.routes && data.routes[0]) {
                    const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); // [lat, lng]
                    setRouteCoords(coords);
                }
            } catch (error) {
                // Fallback to straight line if OSRM fails
                setRouteCoords([[hospitalLocation.lat, hospitalLocation.lng], [userLocation.lat, userLocation.lng]]);
            }
        };
        fetchRoute();
    }, [userLocation, hospitalLocation]);

    // Initialize Leaflet map
    useEffect(() => {
        if (loading || !userLocation || !hospitalLocation || leafletMapRef.current || routeCoords.length === 0) return;

        const initMap = async () => {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');

            const map = L.map(mapRef.current).setView(
                [(userLocation.lat + hospitalLocation.lat) / 2, (userLocation.lng + hospitalLocation.lng) / 2],
                14
            );
            leafletMapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);

            // User marker (blue)
            const userIcon = L.divIcon({
                html: '<div style="background:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup('📍 Your Location');

            // Hospital marker
            const hospIcon = L.divIcon({
                html: '<div style="font-size:24px;">🏥</div>',
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            L.marker([hospitalLocation.lat, hospitalLocation.lng], { icon: hospIcon }).addTo(map).bindPopup('🏥 Hospital');

            // Real road route polyline
            L.polyline(routeCoords, {
                color: '#dc2626',
                weight: 5,
                opacity: 0.9
            }).addTo(map);

            // Fit map to show entire route
            const bounds = L.latLngBounds(routeCoords);
            map.fitBounds(bounds, { padding: [50, 50] });

            // Ambulance marker
            const ambIcon = L.divIcon({
                html: '<div style="font-size:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));animation:bounce 0.5s infinite alternate;">🚑</div>',
                className: '',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            const ambMarker = L.marker(routeCoords[0], { icon: ambIcon }).addTo(map);
            ambulanceMarkerRef.current = ambMarker;

            // Add keyframes
            const style = document.createElement('style');
            style.textContent = '@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }';
            document.head.appendChild(style);
        };

        initMap();
    }, [loading, userLocation, hospitalLocation, routeCoords]);

    // Timer and ambulance movement along route
    useEffect(() => {
        if (loading || arrived || !userLocation || !hospitalLocation || routeCoords.length === 0) return;

        timerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const remaining = Math.max(0, totalSecondsRef.current - elapsed);
            const prog = Math.min(100, (elapsed / totalSecondsRef.current) * 100);

            setProgress(prog);
            setEta({ mins: Math.floor(remaining / 60), secs: Math.floor(remaining % 60) });

            // Calculate which point on the route to show
            const routeIndex = Math.floor((prog / 100) * (routeCoords.length - 1));
            if (ambulanceMarkerRef.current && routeCoords[routeIndex]) {
                ambulanceMarkerRef.current.setLatLng(routeCoords[routeIndex]);
            }

            if (remaining <= 0) {
                setArrived(true);
                clearInterval(timerRef.current);
                if (ambulanceMarkerRef.current) {
                    ambulanceMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
                }
            }
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [loading, arrived, userLocation, hospitalLocation, routeCoords]);

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
        .amb-alert.arrived { background: linear-gradient(135deg, #059669, #10b981); }
        .amb-pulse { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite; font-size: 24px; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .amb-alert-text h3 { font-size: 15px; font-weight: 700; }
        .amb-alert-text p { font-size: 12px; opacity: 0.9; margin-top: 2px; }
        .amb-eta-card { text-align: center; padding: 24px 20px; }
        .amb-eta-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
        .amb-eta-time { font-size: 52px; font-weight: 800; background: linear-gradient(135deg, #dc2626, #be185d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'SF Mono', monospace; margin: 8px 0; }
        .amb-eta-mins { font-size: 14px; color: #6b7280; }
        .amb-track-visual { margin-top: 20px; padding: 16px; padding-bottom: 24px; background: linear-gradient(135deg, #f3e8ff, #fdf4ff); border-radius: 12px; }
        .amb-track-label { font-size: 11px; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .amb-track-label::before { content: ''; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .amb-track-bar { position: relative; height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 20px; }
        .amb-track-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a); border-radius: 4px; transition: width 1s linear; }
        .amb-track-icon { position: absolute; top: -12px; transform: translateX(-50%); font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); transition: left 1s linear; }
        .amb-track-points { display: flex; justify-content: space-between; font-size: 10px; color: #6b7280; }
        .amb-driver { display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(124,58,237,0.1); border-radius: 12px; margin-top: 16px; }
        .amb-driver-avatar { width: 44px; height: 44px; background: linear-gradient(135deg, #a855f7, #ec4899); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
        .amb-driver-info h4 { font-size: 13px; font-weight: 600; color: #1f2937; }
        .amb-driver-info p { font-size: 11px; color: #6b7280; }
        .amb-map-wrap { flex: 1; position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-height: 480px; }
        .amb-map { width: 100%; height: 100%; min-height: 520px; }
        .amb-map-badge { position: absolute; top: 16px; right: 16px; z-index: 1000; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 10px 16px; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; color: #059669; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .amb-live-dot { width: 8px; height: 8px; background: #dc2626; border-radius: 50%; animation: blink 1s infinite; }
        .amb-btns { display: flex; gap: 10px; padding: 16px 20px; justify-content: center; background: rgba(255,255,255,0.5); }
        .amb-btn { padding: 12px 24px; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 14px; color: white; transition: transform 0.2s; }
        .amb-btn:hover { transform: translateY(-2px); }
        .amb-btn.red { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .amb-btn.pink { background: linear-gradient(135deg, #db2777, #be185d); }
        .amb-btn.orange { background: linear-gradient(135deg, #ea580c, #c2410c); }
        @media (max-width: 900px) { .amb-content { flex-direction: column; padding: 16px; } .amb-sidebar { width: 100%; } .amb-map-wrap, .amb-map { min-height: 320px; } .amb-eta-time { font-size: 42px; } }
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
                        <div className={`amb-alert ${arrived ? 'arrived' : ''}`}>
                            <div className="amb-pulse">{arrived ? '✅' : '🚑'}</div>
                            <div className="amb-alert-text">
                                <h3>{arrived ? t.arrived : t.callRaised}</h3>
                                <p>{arrived ? '' : t.stayCalm}</p>
                            </div>
                        </div>

                        <div className="amb-card">
                            <div className="amb-eta-card">
                                <div className="amb-eta-label">{t.eta}</div>
                                <div className="amb-eta-time">{arrived ? '00:00' : `${String(eta.mins).padStart(2, '0')}:${String(eta.secs).padStart(2, '0')}`}</div>
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
                                <div ref={mapRef} className="amb-map"></div>
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
