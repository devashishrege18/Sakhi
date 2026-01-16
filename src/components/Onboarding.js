'use client';
import { useState } from 'react';

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        animation: 'fadeIn 0.3s ease-out'
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#666',
        marginBottom: '25px',
        lineHeight: '1.5'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
    },
    langBtn: {
        padding: '15px',
        borderRadius: '12px',
        border: '2px solid #eee',
        background: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    langName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '4px'
    },
    langEng: {
        fontSize: '13px',
        color: '#888'
    },
    stepItem: {
        display: 'flex',
        alignItems: 'center', // Align icon and text vertically
        marginBottom: '20px',
        textAlign: 'left',
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '12px'
    },
    stepIcon: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#ec4899', // Pink-600
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '15px',
        flexShrink: 0
    },
    ctaBtn: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#ec4899',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px'
    }
};

export default function Onboarding({ languages, onComplete }) {
    const [step, setStep] = useState(0); // 0: Language, 1: Tutorial
    const [selectedLang, setSelectedLang] = useState(null);

    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setStep(1);
    };

    const handleFinish = () => {
        if (selectedLang) {
            onComplete(selectedLang);
        }
    };

    if (step === 0) {
        return (
            <div style={styles.overlay}>
                <div style={styles.card}>
                    <h2 style={styles.title}>नमस्ते! 🙏</h2>
                    <p style={styles.subtitle}>
                        कृपया अपनी भाषा चुनें<br />
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>Please select your language</span>
                    </p>

                    <div style={styles.grid}>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang)}
                                style={styles.langBtn}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#ec4899';
                                    e.currentTarget.style.backgroundColor = '#fff0f7';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#eee';
                                    e.currentTarget.style.backgroundColor = 'transparent';
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
                <div style={{ ...styles.stepIcon, margin: '0 auto 20px', width: '60px', height: '60px', fontSize: '24px' }}>
                    ✨
                </div>

                <h2 style={styles.title}>Welcome to Sakhi</h2>
                <p style={{ ...styles.subtitle, marginBottom: '30px' }}>Your AI Health Companion</p>

                <div style={{ textAlign: 'left' }}>
                    <div style={styles.stepItem}>
                        <div style={styles.stepIcon}>1</div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Tap the Mic Button</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>नीचे दिए गए माइक बटन को दबाएं</div>
                        </div>
                    </div>

                    <div style={styles.stepItem}>
                        <div style={styles.stepIcon}>2</div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Speak in {selectedLang?.english}</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>
                                "Pet dukh raha hai" or "Headache"
                            </div>
                        </div>
                    </div>

                    <div style={styles.stepItem}>
                        <div style={styles.stepIcon}>3</div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Get Instant Help</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>Sakhi will answer in {selectedLang?.english}</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleFinish}
                    style={styles.ctaBtn}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    Start Chatting
                </button>
            </div>
        </div>
    );
}
