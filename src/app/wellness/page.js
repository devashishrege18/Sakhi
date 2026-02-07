'use client';
import { useState, useEffect } from 'react';

const TRANSLATIONS = {
  'hi-IN': { title: 'वेलनेस और डाइट टिप्स', subtitle: 'व्यक्तिगत स्वास्थ्य और पोषण मार्गदर्शन', backBtn: '← वापस', recommended: '✅ अनुशंसित खाद्य पदार्थ', avoid: '❌ परहेज करें', exercise: '🏃‍♀️ व्यायाम सुझाव', sakhiTip: '💡 साखी की टिप' },
  'en-IN': { title: 'Wellness & Diet Tips', subtitle: 'Personalized health and nutrition guidance', backBtn: '← Back to Chat', recommended: '✅ Recommended Foods', avoid: '❌ Foods to Avoid', exercise: '🏃‍♀️ Exercise Recommendations', sakhiTip: '💡 Sakhi ka Tip' },
  'bn-IN': { title: 'সুস্থতা ও ডায়েট টিপস', subtitle: 'ব্যক্তিগত স্বাস্থ্য ও পুষ্টি নির্দেশিকা', backBtn: '← ফিরুন', recommended: '✅ সুপারিশকৃত খাবার', avoid: '❌ এড়িয়ে চলুন', exercise: '🏃‍♀️ ব্যায়াম সুপারিশ', sakhiTip: '💡 সাখির টিপ' },
  'te-IN': { title: 'వెల్‌నెస్ & డైట్ టిప్స్', subtitle: 'వ్యక్తిగత ఆరోగ్య మరియు పోషణ మార్గదర్శకత్వం', backBtn: '← వెనక్కి', recommended: '✅ సిఫార్సు చేసిన ఆహారాలు', avoid: '❌ నివారించాల్సినవి', exercise: '🏃‍♀️ వ్యాయామ సూచనలు', sakhiTip: '💡 సాఖి టిప్' },
  'ta-IN': { title: 'ஆரோக்கியம் & உணவு குறிப்புகள்', subtitle: 'தனிப்பயன் சுகாதார வழிகாட்டுதல்', backBtn: '← பின்', recommended: '✅ பரிந்துரைக்கப்பட்ட உணவுகள்', avoid: '❌ தவிர்க்க வேண்டியவை', exercise: '🏃‍♀️ உடற்பயிற்சி பரிந்துரைகள்', sakhiTip: '💡 சாகி டிப்' },
  'mr-IN': { title: 'वेलनेस आणि डाएट टिप्स', subtitle: 'वैयक्तिक आरोग्य आणि पोषण मार्गदर्शन', backBtn: '← मागे', recommended: '✅ शिफारस केलेले अन्न', avoid: '❌ टाळायचे', exercise: '🏃‍♀️ व्यायाम शिफारसी', sakhiTip: '💡 साखीची टिप' },
  'gu-IN': { title: 'વેલનેસ અને ડાયેટ ટિપ્સ', subtitle: 'વ્યક્તિગત આરોગ્ય માર્ગદર્શન', backBtn: '← પાછા', recommended: '✅ ભલામણ કરેલ ખોરાક', avoid: '❌ ટાળવું', exercise: '🏃‍♀️ કસરત ભલામણો', sakhiTip: '💡 સાખી ટિપ' },
  'kn-IN': { title: 'ಆರೋಗ್ಯ ಮತ್ತು ಆಹಾರ ಸಲಹೆಗಳು', subtitle: 'ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ', backBtn: '← ಹಿಂದೆ', recommended: '✅ ಶಿಫಾರಸು ಮಾಡಿದ ಆಹಾರಗಳು', avoid: '❌ ತಪ್ಪಿಸಬೇಕಾದವು', exercise: '🏃‍♀️ ವ್ಯಾಯಾಮ ಶಿಫಾರಸುಗಳು', sakhiTip: '💡 ಸಾಖಿ ಟಿಪ್' },
  'ml-IN': { title: 'ആരോഗ്യവും ഡയറ്റ് ടിപ്പുകളും', subtitle: 'വ്യക്തിഗത ആരോഗ്യ മാർഗ്ഗനിർദ്ദേശം', backBtn: '← തിരികെ', recommended: '✅ ശുപാർശ ചെയ്ത ഭക്ഷണങ്ങൾ', avoid: '❌ ഒഴിവാക്കേണ്ടവ', exercise: '🏃‍♀️ വ്യായാമ ശുപാർശകൾ', sakhiTip: '💡 സാഖി ടിപ്പ്' },
  'pa-IN': { title: 'ਵੈਲਨੈਸ ਅਤੇ ਡਾਈਟ ਟਿਪਸ', subtitle: 'ਨਿੱਜੀ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ', backBtn: '← ਪਿੱਛੇ', recommended: '✅ ਸਿਫ਼ਾਰਿਸ਼ੀ ਭੋਜਨ', avoid: '❌ ਪਰਹੇਜ਼', exercise: '🏃‍♀️ ਕਸਰਤ ਸਿਫ਼ਾਰਿਸ਼ਾਂ', sakhiTip: '💡 ਸਾਖੀ ਟਿਪ' }
};

const WELLNESS_TIPS = {
  pcos: {
    title: 'PCOS Management',
    icon: '🩺',
    diet: ['Whole grains (brown rice, oats)', 'Green leafy vegetables', 'Lean proteins (dal, chicken)', 'Anti-inflammatory foods (turmeric, ginger)', 'Low glycemic fruits (berries, apples)'],
    avoid: ['Refined carbs (white bread, maida)', 'Sugary drinks and sweets', 'Processed foods', 'Excessive dairy'],
    exercise: ['30 mins brisk walking daily', 'Yoga (especially pranayama)', 'Strength training 2-3x/week', 'Swimming or cycling'],
    tips: 'PCOS ke liye regular exercise aur balanced diet bahut important hai. Stress kam karna bhi helpful hai.'
  },
  pregnancy: {
    title: 'Pregnancy Care',
    icon: '🤰',
    diet: ['Folic acid rich foods (spinach, lentils)', 'Iron rich foods (jaggery, dates)', 'Calcium (milk, curd, paneer)', 'DHA omega-3 (walnuts, fish)', 'Fresh fruits and vegetables'],
    avoid: ['Raw or undercooked meat/eggs', 'Unpasteurized dairy', 'Excessive caffeine', 'Papaya and pineapple (early pregnancy)'],
    exercise: ['Prenatal yoga', 'Walking', 'Pelvic floor exercises', 'Swimming'],
    tips: 'Pregnancy mein doctor ke saath regular checkups bahut zaroori hain. Khub paani piyein!'
  },
  periods: {
    title: 'Period Pain Relief',
    icon: '🌸',
    diet: ['Iron rich foods (spinach, beetroot)', 'Omega-3 fatty acids', 'Warm herbal teas (ginger, chamomile)', 'Dark chocolate (moderation)', 'Bananas for cramps'],
    avoid: ['Salty foods (causes bloating)', 'Caffeine excess', 'Alcohol', 'Cold drinks'],
    exercise: ['Light yoga stretches', 'Walking', 'Lower back stretches', 'Heat therapy'],
    tips: 'Hot water bottle pet pe rakhna cramps mein bahut help karta hai. Rest zaroor lein!'
  },
  general: {
    title: 'General Wellness',
    icon: '💪',
    diet: ['5 servings fruits/vegetables daily', 'Adequate protein', 'Hydration (8 glasses water)', 'Whole grains', 'Healthy fats (nuts, olive oil)'],
    avoid: ['Processed junk food', 'Excessive sugar', 'Trans fats', 'Skipping meals'],
    exercise: ['30 mins daily activity', 'Yoga or meditation', 'Adequate sleep (7-8 hours)', 'Regular health checkups'],
    tips: 'Self-care pe dhyan dein. Mental health physical health jitni important hai!'
  }
};

export default function WellnessPage() {
  const [selected, setSelected] = useState('general');
  const [lang, setLang] = useState('en-IN');
  const tip = WELLNESS_TIPS[selected];
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en-IN'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('sakhi_lang_code');
      if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        .wellness-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; flex-direction: column; }
        .wellness-header { background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(107,33,168,0.3); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header-left img { height: 40px; }
        .header-left span { color: white; font-size: 20px; font-weight: bold; }
        .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
        .wellness-title { padding: 20px 24px; text-align: center; }
        .wellness-title h1 { font-size: 24px; font-weight: bold; color: #4a1a6b; margin: 0; }
        .wellness-title p { color: #666; font-size: 14px; margin-top: 8px; }
        .category-tabs { padding: 0 24px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .cat-btn { padding: 10px 16px; border-radius: 20px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .cat-btn.active { background: #6b21a8; color: white; }
        .cat-btn:not(.active) { background: rgba(255,255,255,0.9); color: #4a1a6b; }
        .wellness-content { flex: 1; padding: 20px 24px; overflow-y: auto; }
        .content-card { background: rgba(255,248,240,0.95); border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .content-title { font-size: 20px; font-weight: bold; color: #4a1a6b; margin: 0 0 16px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 14px; font-weight: 600; margin: 0 0 10px; }
        .section-title.green { color: #16a34a; }
        .section-title.red { color: #dc2626; }
        .section-title.purple { color: #6b21a8; }
        .section ul { margin: 0; padding-left: 20px; }
        .section li { font-size: 14px; color: #333; margin-bottom: 6px; }
        .sakhi-tip { background: #f3e8ff; padding: 16px; border-radius: 12px; border-left: 4px solid #6b21a8; }
        .sakhi-tip p { margin: 0; font-size: 14px; color: #4a1a6b; font-weight: 500; }
        
        @media (max-width: 768px) {
          .wellness-header { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
          .header-left span { font-size: 16px; }
          .header-left img { height: 32px; }
          .back-btn { padding: 6px 12px; font-size: 12px; }
          .wellness-title { padding: 16px; }
          .wellness-title h1 { font-size: 20px; }
          .category-tabs { padding: 0 16px; gap: 8px; }
          .cat-btn { padding: 8px 12px; font-size: 12px; }
          .wellness-content { padding: 16px; }
          .content-card { padding: 18px; }
          .content-title { font-size: 18px; }
        }
      `}</style>

      <div className="wellness-page">
        <header className="wellness-header">
          <div className="header-left">
            <img src="/sakhi-logo.png" alt="Sakhi" />
            <span>{t.title}</span>
          </div>
          <a href="/" className="back-btn">{t.backBtn}</a>
        </header>

        <div className="wellness-title">
          <h1>🧘 {t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="category-tabs">
          {Object.entries(WELLNESS_TIPS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`cat-btn ${selected === key ? 'active' : ''}`}
            >
              {val.icon} {val.title}
            </button>
          ))}
        </div>

        <div className="wellness-content">
          <div className="content-card">
            <h2 className="content-title">{tip.icon} {tip.title}</h2>

            <div className="section">
              <h3 className="section-title green">{t.recommended}</h3>
              <ul>
                {tip.diet.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3 className="section-title red">{t.avoid}</h3>
              <ul>
                {tip.avoid.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3 className="section-title purple">{t.exercise}</h3>
              <ul>
                {tip.exercise.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="sakhi-tip">
              <p>{t.sakhiTip}: {tip.tips}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
