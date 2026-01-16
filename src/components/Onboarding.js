'use client';
import { useState } from 'react';

// Translations for the Tutorial Steps
const TUTORIAL_TRANSLATIONS = {
    'hi-IN': { welcome: 'सखी में आपका स्वागत है', step1: 'माइक बटन दबाएं', step2: 'अपनी भाषा में बोलें', step3: 'तुरंत मदद पाएं', start: 'शुरू करें' },
    'bn-IN': { welcome: 'সখীতে স্বাগতম', step1: 'মাইক বোতাম টিপুন', step2: 'আপনার ভাষায় কথা বলুন', step3: 'তাৎক্ষণিক সাহায্য পান', start: 'শুরু করুন' },
    'te-IN': { welcome: 'సఖికి స్వాగతం', step1: 'మైక్ బటన్ నొక్కండి', step2: 'మీ భాషలో మాట్లాడండి', step3: 'తక్షణ సహాయం పొందండి', start: 'ప్రారంభించండి' },
    'mr-IN': { welcome: 'सखी मध्ये आपले स्वागत आहे', step1: 'माइक बटण दाबा', step2: 'तुमच्या भाषेत बोला', step3: 'त्वरित मदत मिळवा', start: 'सुरू करा' },
    'ta-IN': { welcome: 'சகிக்கு வரவேற்கிறோம்', step1: 'மைக் பொத்தானை அழுத்தவும்', step2: 'உங்கள் மொழியில் பேசுங்கள்', step3: 'உடனடி உதவி பெறுங்கள்', start: 'தொடங்கவும்' },
    'gu-IN': { welcome: 'સખીમાં તમારું સ્વાગત છે', step1: 'માઈક બટન દબાવો', step2: 'તમારી ભાષામાં બોલો', step3: 'તરત મદદ મેળવો', start: 'શરૂ કરો' },
    'kn-IN': { welcome: 'ಸಖಿಗೆ ಸ್ವಾಗತ', step1: 'ಮೈಕ್ ಬಟನ್ ಒತ್ತಿರಿ', step2: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ', step3: 'ತಕ್ಷಣ ಸಹಾಯ ಪಡೆಯಿರಿ', start: 'ಪ್ರಾರಂಭಿಸಿ' },
    'ml-IN': { welcome: 'സഖിയിലേക്ക് സ്വാഗതം', step1: 'മൈക്ക് ബട്ടൺ അമർത്തുക', step2: 'നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കുക', step3: 'ഉടൻ സഹായം നേടുക', start: 'തുടങ്ങുക' },
    'pa-IN': { welcome: 'ਸਖੀ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ', step1: 'ਮਾਈਕ ਬਟਨ ਦਬਾਓ', step2: 'ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲੋ', step3: 'ਤੁਰੰਤ ਮਦਦ ਲਵੋ', start: 'ਸ਼ੁਰੂ ਕਰੋ' },
    'en-IN': { welcome: 'Welcome to Sakhi', step1: 'Tap the Mic Button', step2: 'Speak in your language', step3: 'Get Instant Help', start: 'Start Chatting' }
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        padding: '32px',
        width: '90%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        background: 'linear-gradient(to right, #db2777, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
        letterSpacing: '-0.5px'
    },
    subtitle: {
        color: '#4b5563',
        marginBottom: '32px',
        lineHeight: '1.6',
        fontSize: '16px',
        fontWeight: '500'
    },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'
    },
    langBtn: {
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        background: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    langBtnHover: {
        borderColor: '#db2777',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(219, 39, 119, 0.15)'
    },
    langName: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '2px'
    },
    langEng: {
        fontSize: '13px',
        color: '#9ca3af',
        fontWeight: '500'
    },
    stepItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
        textAlign: 'left',
        background: 'white',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    stepIcon: {
        width: '36px',
        height: '36px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #db2777, #be185d)',
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '16px',
        flexShrink: 0,
        fontSize: '14px',
        boxShadow: '0 4px 6px -1px rgba(219, 39, 119, 0.3)'
    },
    ctaBtn: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(to right, #db2777, #be185d)',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '16px',
        boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)',
        transition: 'transform 0.1s'
    }
};

export default function Onboarding({ languages, onComplete }) {
    const [step, setStep] = useState(0);
    const [selectedLang, setSelectedLang] = useState(null);
    const [hoveredLang, setHoveredLang] = useState(null);

    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setStep(1);
    };

    const t = selectedLang ? (TUTORIAL_TRANSLATIONS[selectedLang.code] || TUTORIAL_TRANSLATIONS['en-IN']) : TUTORIAL_TRANSLATIONS['hi-IN'];

    if (step === 0) {
        return (
            <div style={styles.overlay}>
                <div style={styles.card}>
                    <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
                    <h2 style={styles.title}>नमस्ते! 🙏</h2>
                    <p style={styles.subtitle}>
                        कृपया अपनी भाषा चुनें<br />
                        <span style={{ fontSize: '14px', opacity: 0.7 }}>Please select your language</span>
                    </p>

                    <div style={styles.grid}>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang)}
                                onMouseEnter={() => setHoveredLang(lang.code)}
                                onMouseLeave={() => setHoveredLang(null)}
                                style={{
                                    ...styles.langBtn,
                                    ...(hoveredLang === lang.code ? styles.langBtnHover : {})
                                }}
                            >
                                <span style={styles.langName}>{lang.name}</span>
                                <span style={styles.langEng}>{lang.english}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
                <div style={{ ...styles.stepIcon, margin: '0 auto 24px', width: '64px', height: '64px', fontSize: '28px', borderRadius: '20px' }}>
                    ✨
                </div>

                <h2 style={styles.title}>{t.welcome}</h2>
                <p style={{ ...styles.subtitle, marginBottom: '32px' }}>Your AI Health Companion</p>

                <div style={{ textAlign: 'left' }}>
                    <div style={styles.stepItem}>
                        <div style={styles.stepIcon}>1</div>
                        <div>
                            <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '2px' }}>{t.step1}</div>
                        </div>
                    </div>

                    <div style={styles.stepItem}>
                        <div style={styles.stepIcon}>2</div>
                        <div>
                            <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '2px' }}>{t.step2}</div>
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                "{selectedLang?.english === 'Hindi' ? 'Pet dukh raha hai' : selectedLang?.english === 'Tamil' ? 'Thalai vali' : 'Health query...'}"
                            </div>
                        </div>
                    </div>

                    <div style={styles.stepItem}>
                        <div style={styles.stepIcon}>3</div>
                        <div>
                            <div style={{ fontWeight: '700', color: '#1f2937' }}>{t.step3}</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onComplete(selectedLang)}
                    style={styles.ctaBtn}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {t.start}
                </button>
            </div>
        </div>
    );
}
