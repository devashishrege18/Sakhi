'use client';
import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Menstrual', 'Vitamins', 'Skincare', 'Wellness'];

const PRODUCTS = [
  { id: 1, name: 'Organic Cotton Pads', desc: 'Biodegradable pack of 30', category: 'Menstrual', price: 149, mrp: 199, image: '/organic_cotton_pads.png' },
  { id: 2, name: 'Iron + Folic Acid', desc: 'Monthly supply', category: 'Vitamins', price: 299, mrp: 399, image: '/iron_folic_acid.png' },
  { id: 3, name: 'Menstrual Cup', desc: 'Medical grade silicone', category: 'Menstrual', price: 399, mrp: 599, image: '/menstrual_cup.png' },
  { id: 4, name: 'Calcium + D3', desc: 'Bone health support', category: 'Vitamins', price: 249, mrp: 349, image: '/calcium_d3.png' },
  { id: 5, name: 'Biotin Gummies', desc: 'For hair & nails', category: 'Skincare', price: 449, mrp: 599, image: '/biotin_gummies.png' },
  { id: 6, name: 'Period Pain Roll-on', desc: 'Ayurvedic formula', category: 'Menstrual', price: 129, mrp: 179, image: '/period_pain_rollon.png' },
  { id: 7, name: 'Women Multivitamin', desc: 'Complete daily nutrition', category: 'Vitamins', price: 349, mrp: 499, image: '/women_multivitamin.png' },
  { id: 8, name: 'Stress Relief Tea', desc: 'Chamomile & lavender', category: 'Wellness', price: 199, mrp: 249, image: '/stress_relief_tea.png' }
];


export default function PharmacyPage() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

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
          <span className="page-title">Pharmacy</span>
          <button className="cart-icon" onClick={() => setShowCart(true)}>🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
        </nav>

        <div className="pharm-content">
          <div className="pharm-banner">
            <h2> Women's Health Essentials</h2>
            <p>Trusted products  Cash on Delivery  Free shipping above ₹499</p>
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
                    <button className="add-btn" onClick={() => addToCart(p)}>Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCart && (
          <div className="cart-modal" onClick={() => setShowCart(false)}>
            <div className="cart-box" onClick={e => e.stopPropagation()}>
              <div className="cart-head"><h3>Your Cart</h3><button className="close-x" onClick={() => setShowCart(false)}></button></div>
              {cart.length === 0 ? <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '30px' }}>Your cart is empty</p> : (
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
                  <div className="cart-total"><span>Total</span><span>₹{total}</span></div>
                  <button className="order-btn"> Order Now (COD)</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}