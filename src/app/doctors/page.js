'use client';
import { useState, useEffect } from 'react';

const TRANSLATIONS = {
  'hi-IN': { title: 'डॉक्टर से बात करें', subtitle: 'महिला स्वास्थ्य विशेषज्ञों से वीडियो कॉल पर परामर्श', backBtn: '← वापस', available: '🟢 अभी उपलब्ध', busy: '🔴 व्यस्त', startCall: '📹 कॉल शुरू करें', footer: '🔒 साखी उपयोगकर्ताओं के लिए मुफ्त परामर्श। कॉल प्राइवेट और सुरक्षित हैं।', therapistTitle: '🧠 थेरेपिस्ट से बात करें', therapistSubtitle: 'मानसिक स्वास्थ्य विशेषज्ञों से गोपनीय परामर्श' },
  'en-IN': { title: 'Talk to Doctor', subtitle: 'Consult with women health specialists via video call', backBtn: '← Back to Chat', available: '🟢 Available Now', busy: '🔴 Busy', startCall: '📹 Start Call', footer: '🔒 Free consultation for Sakhi users. Calls are private and secure.', therapistTitle: '🧠 Talk to a Therapist', therapistSubtitle: 'Confidential mental health support from certified professionals' },
  'bn-IN': { title: 'ডাক্তারের সাথে কথা বলুন', subtitle: 'ভিডিও কলে মহিলা স্বাস্থ্য বিশেষজ্ঞদের সাথে পরামর্শ করুন', backBtn: '← ফিরুন', available: '🟢 এখন উপলব্ধ', busy: '🔴 ব্যস্ত', startCall: '📹 কল শুরু', footer: '🔒 সাখি ব্যবহারকারীদের জন্য বিনামূল্যে পরামর্শ।', therapistTitle: '🧠 থেরাপিস্টের সাথে কথা বলুন', therapistSubtitle: 'মানসিক স্বাস্থ্য বিশেষজ্ঞদের সাথে গোপনীয় পরামর্শ' },
  'te-IN': { title: 'డాక్టర్‌తో మాట్లాడండి', subtitle: 'వీడియో కాల్ ద్వారా మహిళా ఆరోగ్య నిపుణులను సంప్రదించండి', backBtn: '← వెనక్కి', available: '🟢 ఇప్పుడు అందుబాటులో', busy: '🔴 బిజీ', startCall: '📹 కాల్ ప్రారంభించు', footer: '🔒 సాఖి వినియోగదారులకు ఉచిత సంప్రదింపు.', therapistTitle: '🧠 థెరపిస్ట్‌తో మాట్లాడండి', therapistSubtitle: 'మానసిక ఆరోగ్య నిపుణుల నుండి రహస్య సహాయం' },
  'ta-IN': { title: 'மருத்துவரிடம் பேசுங்கள்', subtitle: 'வீடியோ அழைப்பு மூலம் பெண்கள் சுகாதார நிபுணர்களை அணுகுங்கள்', backBtn: '← பின்', available: '🟢 இப்போது கிடைக்கும்', busy: '🔴 பிஸி', startCall: '📹 அழைப்பை தொடங்கு', footer: '🔒 சாகி பயனர்களுக்கு இலவச ஆலோசனை.', therapistTitle: '🧠 சிகிச்சையாளரிடம் பேசுங்கள்', therapistSubtitle: 'மன நல நிபுணர்களிடம் ரகசிய ஆலோசனை' },
  'mr-IN': { title: 'डॉक्टरांशी बोला', subtitle: 'व्हिडिओ कॉलद्वारे महिला आरोग्य तज्ञांशी सल्लामसलत करा', backBtn: '← मागे', available: '🟢 आता उपलब्ध', busy: '🔴 व्यस्त', startCall: '📹 कॉल सुरू करा', footer: '🔒 साखी वापरकर्त्यांसाठी मोफत सल्ला.', therapistTitle: '🧠 थेरपिस्टशी बोला', therapistSubtitle: 'मानसिक आरोग्य तज्ञांशी गोपनीय सल्लामसलत' },
  'gu-IN': { title: 'ડૉક્ટર સાથે વાત કરો', subtitle: 'વિડિયો કૉલ દ્વારા મહિલા આરોગ્ય નિષ્ણાતોની સલાહ લો', backBtn: '← પાછા', available: '🟢 હવે ઉપલબ્ધ', busy: '🔴 વ્યસ્ત', startCall: '📹 કૉલ શરૂ કરો', footer: '🔒 સાખી વપરાશકર્તાઓ માટે મફત સલાહ.', therapistTitle: '🧠 થેરાપિસ્ટ સાથે વાત કરો', therapistSubtitle: 'માનસિક સ્વાસ્થ્ય નિષ્ણાતો સાથે ગોપનીય સલાહ' },
  'kn-IN': { title: 'ವೈದ್ಯರೊಂದಿಗೆ ಮಾತನಾಡಿ', subtitle: 'ವೀಡಿಯೊ ಕರೆ ಮೂಲಕ ಮಹಿಳಾ ಆರೋಗ್ಯ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ', backBtn: '← ಹಿಂದೆ', available: '🟢 ಈಗ ಲಭ್ಯ', busy: '🔴 ಬ್ಯುಸಿ', startCall: '📹 ಕರೆ ಪ್ರಾರಂಭಿಸಿ', footer: '🔒 ಸಾಖಿ ಬಳಕೆದಾರರಿಗೆ ಉಚಿತ ಸಲಹೆ.', therapistTitle: '🧠 ಥೆರಪಿಸ್ಟ್ ಜೊತೆ ಮಾತನಾಡಿ', therapistSubtitle: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ ತಜ್ಞರಿಂದ ಗೌಪ್ಯ ಸಹಾಯ' },
  'ml-IN': { title: 'ഡോക്ടറുമായി സംസാരിക്കുക', subtitle: 'വീഡിയോ കോൾ വഴി വനിതാ ആരോഗ്യ വിദഗ്ധരെ സമീപിക്കുക', backBtn: '← തിരികെ', available: '🟢 ഇപ്പോൾ ലഭ്യമാണ്', busy: '🔴 ബിസി', startCall: '📹 കോൾ ആരംഭിക്കുക', footer: '🔒 സാഖി ഉപയോക്താക്കൾക്ക് സൗജന്യ കൺസൾട്ടേഷൻ.', therapistTitle: '🧠 തെറാപ്പിസ്റ്റുമായി സംസാരിക്കുക', therapistSubtitle: 'മാനസികാരോഗ്യ വിദഗ്ധരിൽ നിന്ന് രഹസ്യ സഹായം' },
  'pa-IN': { title: 'ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ', subtitle: 'ਵੀਡੀਓ ਕਾਲ ਰਾਹੀਂ ਮਹਿਲਾ ਸਿਹਤ ਮਾਹਿਰਾਂ ਨਾਲ ਸਲਾਹ ਲਓ', backBtn: '← ਪਿੱਛੇ', available: '🟢 ਹੁਣ ਉਪਲਬਧ', busy: '🔴 ਵਿਅਸਤ', startCall: '📹 ਕਾਲ ਸ਼ੁਰੂ ਕਰੋ', footer: '🔒 ਸਾਖੀ ਉਪਭੋਗਤਾਵਾਂ ਲਈ ਮੁਫ਼ਤ ਸਲਾਹ.', therapistTitle: '🧠 ਥੈਰੇਪਿਸਟ ਨਾਲ ਗੱਲ ਕਰੋ', therapistSubtitle: 'ਮਾਨਸਿਕ ਸਿਹਤ ਮਾਹਿਰਾਂ ਤੋਂ ਗੁਪਤ ਸਹਾਇਤਾ' }
};

const DOCTORS = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Gynecologist', experience: '15 years', rating: 4.8, available: true, image: '👩‍⚕️' },
  { id: 2, name: 'Dr. Anjali Gupta', specialty: 'PCOS Specialist', experience: '12 years', rating: 4.9, available: true, image: '👩‍⚕️' },
  { id: 3, name: 'Dr. Meera Patel', specialty: 'Fertility Expert', experience: '18 years', rating: 4.7, available: false, image: '👩‍⚕️' },
  { id: 4, name: 'Dr. Kavita Reddy', specialty: 'Obstetrician', experience: '10 years', rating: 4.6, available: true, image: '👩‍⚕️' },
];

const THERAPISTS = [
  { id: 101, name: 'Dr. Sunita Verma', specialty: 'Clinical Psychologist', experience: '14 years', rating: 4.9, available: true, image: '🧠' },
  { id: 102, name: 'Dr. Neha Kapoor', specialty: 'Counselling Therapist', experience: '10 years', rating: 4.8, available: true, image: '🧠' },
  { id: 103, name: 'Dr. Asha Menon', specialty: 'Postpartum Depression', experience: '16 years', rating: 4.7, available: true, image: '🧠' },
  { id: 104, name: 'Dr. Ritu Desai', specialty: 'Anxiety & Stress', experience: '8 years', rating: 4.6, available: false, image: '🧠' },
];

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [lang, setLang] = useState('en-IN');

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en-IN'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('sakhi_lang_code');
      if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);
    }
  }, []);

  const startCall = (doctor) => {
    setSelectedDoctor(doctor);
    setInCall(true);
  };

  if (inCall && selectedDoctor) {
    const roomId = `sakhi-consult-${selectedDoctor.id}-${Date.now()}`;
    return (
      <>
        <style jsx global>{`
          .doctors-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; flex-direction: column; }
          .doctors-header { background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(107,33,168,0.3); }
          .header-left { display: flex; align-items: center; gap: 12px; }
          .header-left img { height: 40px; }
          .header-left span { color: white; font-size: 20px; font-weight: bold; }
          .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
          .call-container { flex: 1; padding: 16px; }
          .call-frame { width: 100%; height: calc(100vh - 100px); border: none; border-radius: 16px; }
          @media (max-width: 768px) {
            .doctors-header { padding: 12px 16px; }
            .header-left span { font-size: 16px; }
            .header-left img { height: 32px; }
            .back-btn { padding: 6px 12px; font-size: 12px; }
            .call-container { padding: 8px; }
          }
        `}</style>
        <div className="doctors-page">
          <header className="doctors-header">
            <div className="header-left">
              <img src="/sakhi-logo.png" alt="Sakhi" />
              <span>{t.title}</span>
            </div>
            <a href="/" className="back-btn">{t.backBtn}</a>
          </header>
          <div className="call-container">
            <iframe
              src={`https://meet.jit.si/${roomId}`}
              className="call-frame"
              allow="camera; microphone; fullscreen; display-capture"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        .doctors-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; flex-direction: column; }
        .doctors-header { background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(107,33,168,0.3); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header-left img { height: 40px; }
        .header-left span { color: white; font-size: 20px; font-weight: bold; }
        .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
        .doctors-title { padding: 20px 24px; text-align: center; }
        .doctors-title h1 { font-size: 24px; font-weight: bold; color: #4a1a6b; margin: 0; }
        .doctors-title p { color: #666; font-size: 14px; margin-top: 8px; }
        .doctors-grid { flex: 1; padding: 0 24px 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .doctor-card { background: rgba(255,248,240,0.95); border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; }
        .doctor-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(107,33,168,0.15); }
        .doctor-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .doctor-avatar { font-size: 48px; }
        .doctor-name { margin: 0; font-size: 16px; font-weight: bold; color: #333; }
        .doctor-specialty { margin: 4px 0 0; font-size: 13px; color: #6b21a8; font-weight: 500; }
        .doctor-info { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 12px; }
        .doctor-actions { display: flex; align-items: center; justify-content: space-between; }
        .status-available { font-size: 12px; color: #16a34a; font-weight: 500; }
        .status-busy { font-size: 12px; color: #dc2626; font-weight: 500; }
        .call-btn { background: #6b21a8; color: white; padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; transition: background 0.2s; }
        .call-btn:hover { background: #7c3aed; }
        .call-btn:disabled { background: #ccc; cursor: not-allowed; }
        .call-btn.therapist-btn { background: #0d9488; }
        .call-btn.therapist-btn:hover { background: #14b8a6; }
        .section-divider { padding: 24px 24px 8px; }
        .section-divider h2 { font-size: 22px; font-weight: bold; color: #0d9488; margin: 0; }
        .section-divider p { color: #666; font-size: 14px; margin-top: 6px; }
        .therapist-card { background: linear-gradient(135deg, rgba(240,253,250,0.95), rgba(204,251,241,0.95)); border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(13,148,136,0.1); border: 1px solid rgba(13,148,136,0.15); transition: transform 0.2s, box-shadow 0.2s; }
        .therapist-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(13,148,136,0.2); }
        .therapist-card .doctor-specialty { color: #0d9488; }
        .doctors-footer { padding: 16px 24px; text-align: center; }
        .doctors-footer p { font-size: 12px; color: #666; }
        
        @media (max-width: 768px) {
          .doctors-header { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
          .header-left span { font-size: 16px; }
          .header-left img { height: 32px; }
          .back-btn { padding: 6px 12px; font-size: 12px; }
          .doctors-title { padding: 16px; }
          .doctors-title h1 { font-size: 20px; }
          .doctors-grid { padding: 0 16px 16px; grid-template-columns: 1fr; }
          .doctor-card { padding: 16px; }
          .therapist-card { padding: 16px; }
          .doctor-avatar { font-size: 40px; }
          .doctor-name { font-size: 15px; }
          .section-divider { padding: 16px 16px 4px; }
          .section-divider h2 { font-size: 18px; }
        }
      `}</style>
      <div className="doctors-page">
        <header className="doctors-header">
          <div className="header-left">
            <img src="/sakhi-logo.png" alt="Sakhi" />
            <span>{t.title}</span>
          </div>
          <a href="/" className="back-btn">{t.backBtn}</a>
        </header>

        <div className="doctors-title">
          <h1>👩‍⚕️ {t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="doctors-grid">
          {DOCTORS.map(doc => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-top">
                <span className="doctor-avatar">{doc.image}</span>
                <div>
                  <h3 className="doctor-name">{doc.name}</h3>
                  <p className="doctor-specialty">{doc.specialty}</p>
                </div>
              </div>
              <div className="doctor-info">
                <span>📅 {doc.experience}</span>
                <span>⭐ {doc.rating}</span>
              </div>
              <div className="doctor-actions">
                <span className={doc.available ? 'status-available' : 'status-busy'}>
                  {doc.available ? t.available : t.busy}
                </span>
                <button
                  onClick={() => startCall(doc)}
                  disabled={!doc.available}
                  className="call-btn"
                >
                  {t.startCall}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Therapist Section */}
        <div className="section-divider">
          <h2>{t.therapistTitle}</h2>
          <p>{t.therapistSubtitle}</p>
        </div>

        <div className="doctors-grid">
          {THERAPISTS.map(doc => (
            <div key={doc.id} className="therapist-card">
              <div className="doctor-top">
                <span className="doctor-avatar">{doc.image}</span>
                <div>
                  <h3 className="doctor-name">{doc.name}</h3>
                  <p className="doctor-specialty">{doc.specialty}</p>
                </div>
              </div>
              <div className="doctor-info">
                <span>📅 {doc.experience}</span>
                <span>⭐ {doc.rating}</span>
              </div>
              <div className="doctor-actions">
                <span className={doc.available ? 'status-available' : 'status-busy'}>
                  {doc.available ? t.available : t.busy}
                </span>
                <button
                  onClick={() => startCall(doc)}
                  disabled={!doc.available}
                  className="call-btn therapist-btn"
                >
                  {t.startCall}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="doctors-footer">
          <p>{t.footer}</p>
        </div>
      </div>
    </>
  );
}
