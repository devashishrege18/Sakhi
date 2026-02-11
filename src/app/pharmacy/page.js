'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const TRANSLATIONS = {
  'hi-IN': { title: 'फार्मेसी', banner: 'महिलाओं के स्वास्थ्य की जरूरतें', bannerSub: 'भरोसेमंद उत्पाद • कैश ऑन डिलीवरी • ₹499+ पर मुफ्त शिपिंग', cartTitle: 'आपका कार्ट', cartEmpty: 'कार्ट खाली है', total: 'कुल', orderBtn: 'ऑर्डर करें (COD)', add: 'जोड़ें' },
  'en-IN': { title: 'Pharmacy', banner: "Women's Health Essentials", bannerSub: 'Trusted products • Cash on Delivery • Free shipping above ₹499', cartTitle: 'Your Cart', cartEmpty: 'Your cart is empty', total: 'Total', orderBtn: 'Order Now (COD)', add: 'Add' },
  'bn-IN': { title: 'ফার্মেসি', banner: 'মহিলাদের স্বাস্থ্য প্রয়োজনীয়তা', bannerSub: 'বিশ্বস্ত পণ্য • ক্যাশ অন ডেলিভারি • ₹499+ এ বিনামূল্যে শিপিং', cartTitle: 'আপনার কার্ট', cartEmpty: 'কার্ট খালি', total: 'মোট', orderBtn: 'অর্ডার করুন', add: 'যোগ করুন' },
  'te-IN': { title: 'ఫార్మసీ', banner: 'మహిళల ఆరోగ్య అవసరాలు', bannerSub: 'నమ్మకమైన ఉత్పత్తులు • క్యాష్ ఆన్ డెలివరీ • ₹499+ పై ఉచిత షిప్పింగ్', cartTitle: 'మీ కార్ట్', cartEmpty: 'కార్ట్ ఖాళీగా ఉంది', total: 'మొత్తం', orderBtn: 'ఆర్డర్ చేయండి', add: 'జోడించు' },
  'ta-IN': { title: 'மருந்தகம்', banner: 'பெண்கள் ஆரோக்கிய தேவைகள்', bannerSub: 'நம்பகமான பொருட்கள் • கேஷ் ஆன் டெலிவரி • ₹499+ இல் இலவச ஷிப்பிங்', cartTitle: 'உங்கள் கார்ட்', cartEmpty: 'கார்ட் காலியாக உள்ளது', total: 'மொத்தம்', orderBtn: 'ஆர்டர் செய்க', add: 'சேர்' },
  'mr-IN': { title: 'फार्मसी', banner: 'महिलांच्या आरोग्याच्या गरजा', bannerSub: 'विश्वासार्ह उत्पादने • कॅश ऑन डिलिव्हरी • ₹499+ वर मोफत शिपिंग', cartTitle: 'तुमची कार्ट', cartEmpty: 'कार्ट रिकामी आहे', total: 'एकूण', orderBtn: 'ऑर्डर करा', add: 'जोडा' },
  'gu-IN': { title: 'ફાર્મસી', banner: 'મહિલાઓના સ્વાસ્થ્ય જરૂરિયાતો', bannerSub: 'વિશ્વસનીય ઉત્પાદનો • કેશ ઓન ડિલિવરી • ₹499+ પર મફત શિપિંગ', cartTitle: 'તમારી કાર્ટ', cartEmpty: 'કાર્ટ ખાલી છે', total: 'કુલ', orderBtn: 'ઓર્ડર કરો', add: 'ઉમેરો' },
  'kn-IN': { title: 'ಔಷಧಾಲಯ', banner: 'ಮಹಿಳೆಯರ ಆರೋಗ್ಯ ಅಗತ್ಯಗಳು', bannerSub: 'ವಿಶ್ವಾಸಾರ್ಹ ಉತ್ಪನ್ನಗಳು • ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ • ₹499+ ಮೇಲೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್', cartTitle: 'ನಿಮ್ಮ ಕಾರ್ಟ್', cartEmpty: 'ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ', total: 'ಒಟ್ಟು', orderBtn: 'ಆರ್ಡರ್ ಮಾಡಿ', add: 'ಸೇರಿಸಿ' },
  'ml-IN': { title: 'ഫാർമസി', banner: 'സ്ത്രീ ആരോഗ്യ ആവശ്യങ്ങൾ', bannerSub: 'വിശ്വസനീയ ഉൽപ്പന്നങ്ങൾ • ക്യാഷ് ഓൺ ഡെലിവറി • ₹499+ ൽ സൗജന്യ ഷിപ്പിംഗ്', cartTitle: 'നിങ്ങളുടെ കാർട്ട്', cartEmpty: 'കാർട്ട് ശൂന്യമാണ്', total: 'ആകെ', orderBtn: 'ഓർഡർ ചെയ്യുക', add: 'ചേർക്കുക' },
  'pa-IN': { title: 'ਫਾਰਮੇਸੀ', banner: 'ਔਰਤਾਂ ਦੀ ਸਿਹਤ ਲੋੜਾਂ', bannerSub: 'ਭਰੋਸੇਮੰਦ ਉਤਪਾਦ • ਕੈਸ਼ ਆਨ ਡਿਲੀਵਰੀ • ₹499+ ਤੇ ਮੁਫ਼ਤ ਸ਼ਿਪਿੰਗ', cartTitle: 'ਤੁਹਾਡੀ ਕਾਰਟ', cartEmpty: 'ਕਾਰਟ ਖਾਲੀ ਹੈ', total: 'ਕੁੱਲ', orderBtn: 'ਆਰਡਰ ਕਰੋ', add: 'ਜੋੜੋ' }
};

const CATEGORIES = ['All', 'Menstrual', 'Vitamins', 'Skincare', 'Wellness'];

const PRODUCTS = [
  { id: 1, name: 'Whisper Choice Ultra XL', desc: '6 Pads, 100% stain protection', category: 'Menstrual', price: 40, mrp: 55, image: '/whisper ultrachoice.jpeg' },
  { id: 2, name: 'Fecarbo-FZ Iron Capsules', desc: 'Iron, Folic Acid, B12 & Vitamin C', category: 'Vitamins', price: 185, mrp: 250, image: '/irn tablets.jpg.jpeg' },
  { id: 3, name: 'iCare Menstrual Cup', desc: 'Medical grade silicone, Size S', category: 'Menstrual', price: 399, mrp: 599, image: '/menstrual cup.jpeg' },
  { id: 4, name: 'Calizon-D Tablets', desc: 'Calcium Carbonate + Vitamin D3', category: 'Vitamins', price: 220, mrp: 310, image: '/calcium D3.jpg.jpeg' },
  { id: 5, name: 'NaturesPlus Biotin Gummies', desc: '5000 mcg, 60 Raspberry Gummies', category: 'Skincare', price: 449, mrp: 599, image: '/gummies.jpg.jpeg' },
  { id: 6, name: 'Comfy Period Pain Roll-On', desc: '100% Ayurvedic, 50ml', category: 'Menstrual', price: 125, mrp: 175, image: '/rollon.jpg.jpeg' },
  { id: 7, name: 'Naturelo Women Multivitamin', desc: '120 Vegetarian Capsules', category: 'Vitamins', price: 349, mrp: 499, image: '/muulti vitamin.jpg.jpeg' },
  { id: 8, name: 'Stress Relief Herbal Tea', desc: 'Chamomile & lavender blend', category: 'Wellness', price: 199, mrp: 249, image: '/herbal tea.jpeg' }
];


export default function PharmacyPage() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [lang, setLang] = useState('en-IN');

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en-IN'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('sakhi_lang_code');
      if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);
    }
  }, []);

  const filtered = selectedCat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === selectedCat);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <>
      <style jsx global>{`
        .pharm-page { min-height: 100vh; background: #FDF2F8; }
        .pharm-nav { background: linear-gradient(135deg, #6B21A8, #9333EA); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;  }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-img { width: 36px; height: 36px; }
        .logo-text { font-size: 24px; font-weight: 800; color: white; font-style: italic; font-style: italic; }
        .page-title { font-size: 24px; font-weight: 700; color: white; }
        .cart-icon { position: relative; background: white; padding: 8px 12px; border-radius: 20px; border: none; cursor: pointer; font-size: 18px; }
        .cart-badge { position: absolute; top: -5px; right: -5px; background: #EC4899; color: white; font-size: 10px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .pharm-content { padding: 20px 24px; }
        .pharm-banner { background: linear-gradient(135deg, #6B21A8, #9333EA); padding: 25px 30px; border-radius: 16px; color: white; margin-bottom: 20px; }
        .pharm-banner h2 { font-size: 22px; font-weight: 700; margin-bottom: 5px; }
        .pharm-banner p { opacity: 0.9; font-size: 14px; }
        .cat-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 20px; }
        .cat-btn { padding: 10px 20px; border-radius: 25px; border: 1px solid #E5E7EB; background: white; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; color: #6B7280; transition: all 0.2s; }
        .cat-btn.active { background: #9333EA; color: white; border-color: #9333EA; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .prod-card { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #F3E8FF; transition: box-shadow 0.2s; }
        .prod-card:hover { box-shadow: 0 4px 15px rgba(147, 51, 234, 0.15); }
        .prod-icon { height: 140px; background: #F8F4F0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .prod-icon img { width: 100%; height: 100%; object-fit: cover; }
        .prod-body { padding: 14px; }
        .prod-name { font-weight: 600; color: #1F2937; font-size: 14px; margin-bottom: 4px; }
        .prod-desc { color: #9CA3AF; font-size: 12px; margin-bottom: 10px; }
        .prod-row { display: flex; justify-content: space-between; align-items: center; }
        .prod-price { font-weight: 700; color: #9333EA; font-size: 16px; }
        .prod-mrp { color: #D1D5DB; text-decoration: line-through; font-size: 12px; margin-left: 5px; }
        .add-btn { background: #9333EA; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .add-btn:hover { background: #7C3AED; }
        .cart-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 100; }
        .cart-box { background: white; width: 100%; max-width: 500px; border-radius: 20px 20px 0 0; padding: 24px; max-height: 70vh; overflow: auto; }
        .cart-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .cart-head h3 { font-size: 20px; font-weight: 700; }
        .close-x { background: none; border: none; font-size: 28px; color: #9CA3AF; cursor: pointer; }
        .cart-item { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #F3F4F6; }
        .cart-item-icon { width: 45px; height: 45px; background: #F3E8FF; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .cart-item-info { flex: 1; }
        .cart-item-name { font-weight: 600; font-size: 14px; }
        .cart-item-price { color: #9333EA; font-size: 13px; }
        .cart-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 18px; margin: 18px 0; }
        .order-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #EC4899, #9333EA); color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: 700; cursor: pointer; }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .pharm-nav { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
          .page-title { font-size: 18px; }
          .logo-text { font-size: 20px; }
          .pharm-content { padding: 16px; }
          .pharm-banner { padding: 18px 20px; }
          .pharm-banner h2 { font-size: 18px; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .prod-icon { height: 120px; }
          .prod-body { padding: 10px; }
          .prod-name { font-size: 13px; }
          .prod-desc { font-size: 11px; margin-bottom: 8px; }
          .prod-price { font-size: 14px; }
          .add-btn { padding: 6px 14px; font-size: 11px; }
          .cat-btn { padding: 8px 14px; font-size: 12px; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .prod-icon { height: 100px; }
        }
      `}</style>

      <div className="pharm-page">
        <nav className="pharm-nav">
          <Link href="/" className="nav-logo">
            <img src="/sakhi-logo.png" alt="Sakhi" className="logo-img" onError={(e) => e.target.style.display = 'none'} />
            <span className="logo-text">Sakhi</span>
          </Link>
          <span className="page-title">{t.title}</span>
          <button className="cart-icon" onClick={() => setShowCart(true)}>🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
        </nav>

        <div className="pharm-content">
          <div className="pharm-banner">
            <h2>{t.banner}</h2>
            <p>{t.bannerSub}</p>
          </div>

          <div className="cat-row">
            {CATEGORIES.map(c => <button key={c} className={`cat-btn ${selectedCat === c ? 'active' : ''}`} onClick={() => setSelectedCat(c)}>{c}</button>)}
          </div>

          <div className="products-grid">
            {filtered.map(p => (
              <div key={p.id} className="prod-card">
                <div className="prod-icon"><img src={p.image} alt={p.name} /></div>
                <div className="prod-body">
                  <div className="prod-name">{p.name}</div>
                  <div className="prod-desc">{p.desc}</div>
                  <div className="prod-row">
                    <div><span className="prod-price">₹{p.price}</span><span className="prod-mrp">₹{p.mrp}</span></div>
                    <button className="add-btn" onClick={() => addToCart(p)}>{t.add}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCart && (
          <div className="cart-modal" onClick={() => setShowCart(false)}>
            <div className="cart-box" onClick={e => e.stopPropagation()}>
              <div className="cart-head"><h3>{t.cartTitle}</h3><button className="close-x" onClick={() => setShowCart(false)}></button></div>
              {cart.length === 0 ? <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '30px' }}>{t.cartEmpty}</p> : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-icon">{item.icon}</div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">₹{item.price}  {item.qty}</div>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total"><span>{t.total}</span><span>₹{total}</span></div>
                  <button className="order-btn">{t.orderBtn}</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}