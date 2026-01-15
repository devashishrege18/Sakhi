import React, { useState } from 'react';
import { Search, MapPin, Ticket, UserPlus, ShoppingBag, Heart, Globe, Briefcase, Leaf, ArrowRight, X, Shield, Star, Rocket, CheckCircle } from 'lucide-react';

const Discover = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'info' }

    const showToast = (message) => {
        setToast({ message, type: 'success' });
        setTimeout(() => setToast(null), 4000);
    };

    // START: Task 2 - Define the API Call Handler (Pari's Work)
    const handleSupportClick = async (athleteName) => {
        setSelectedItem({
            type: 'support',
            name: athleteName,
            description: `You are officially supporting ${athleteName}'s journey to the professional leagues. Your support helps fund training and equipment.`,
            stats: { support: '2.4k fans', level: 'Rising Star' },
            img: '/assets/talent_gully_cricket_1765787655210.png'
        });

        try {
            await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ athleteId: athleteName }),
            });
        } catch (error) { console.error("Support API failed", error); }
    };

    const handleAction = async (actionType, itemName) => {
        let modalData = {
            type: actionType,
            name: itemName,
            description: "Loading premium experience...",
            stats: {}
        };

        if (actionType === 'store_visit') {
            modalData.description = `Welcome to the official ${itemName} curated collection. Explore exclusive high-performance gear designed for elite athletes.`;
            modalData.stats = { members: '150k+', products: '42 items' };
            modalData.img = (itemName || "").includes('VK18') ? '/assets/store_vk18_fitness_1765787964441.png' : '/assets/store_serena_ventures_1765787984356.png';
        } else if (actionType === 'ticket_buy') {
            modalData.description = `Secure your spot at the ${itemName}. Experience the energy of grassroots sports and support local communities.`;
            modalData.stats = { availability: 'Limited', category: 'General' };
        } else if (actionType === 'purchase') {
            modalData.description = `Directly support artisans by purchasing the ${itemName}. Each piece is handcrafted with sustainable materials.`;
            modalData.stats = { stock: 'In Stock', delivery: '3-5 Days' };
            modalData.img = '/assets/product_leather_gloves_1765788007746.png';
        } else if (actionType === 'meet_maker') {
            modalData.description = `Connecting with the artisans... You'll soon see a live-story feature showing the hand-stitching process in Kashmir.`;
            modalData.stats = { tradition: '3rd Gen', impact: 'Supporting 50+ Families' };
        } else if (actionType === 'follow') {
            showToast(`Awesome! You're now following ${itemName}.`);
            return;
        }

        setSelectedItem(modalData);

        try {
            await fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionType, itemName }),
            });
        } catch (error) { console.error("Action API failed", error); }
    };

    const handleConfirm = () => {
        if (!selectedItem) return;

        let msg = "";
        switch (selectedItem.type) {
            case 'support': msg = `Success! You are now a verified supporter of ${selectedItem.name}. +10 XP earned!`; break;
            case 'store_visit': msg = `Welcome! You've unlocked exclusive access to the ${selectedItem.name} premium store.`; break;
            case 'ticket_buy': msg = `Confirmed! Your spot at ${selectedItem.name} is reserved. Check your profile for tickets.`; break;
            case 'purchase': msg = `Ordered! Your ${selectedItem.name} will be handcrafted and shipped soon.`; break;
            case 'meet_maker': msg = `Connecting... You've started a journey with the artisans of ${selectedItem.name}.`; break;
            default: msg = "Action successfully processed by SameField Edge!";
        }

        showToast(msg);
        setSelectedItem(null);
    };

    const Toast = () => {
        if (!toast) return null;
        return (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-500">
                <div className="bg-surface border border-green-500/50 rounded-lg shadow-2xl px-6 py-4 flex items-center gap-4 backdrop-blur-xl">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold leading-tight">{toast.message}</p>
                        <p className="text-[10px] text-green-500 font-extrabold uppercase tracking-[0.2em] mt-1">Verified Success</p>
                    </div>
                    <button onClick={() => setToast(null)} className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-3 h-3 text-textMuted" />
                    </button>
                </div>
            </div>
        );
    };

    const DetailModal = () => {
        if (!selectedItem) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                <div className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-primary hover:text-black rounded-full text-white z-10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {selectedItem.img && (
                        <div className="h-48 overflow-hidden relative">
                            <img src={selectedItem.img} className="w-full h-full object-cover opacity-60" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Verified Secure</span>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">{selectedItem.name}</h2>
                        <p className="text-textMuted text-sm leading-relaxed mb-8">
                            {selectedItem.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {Object.entries(selectedItem.stats).map(([key, val]) => (
                                <div key={key} className="p-3 bg-surfaceHighlight/30 rounded-lg border border-white/5">
                                    <p className="text-[8px] font-bold text-textMuted uppercase mb-1">{key}</p>
                                    <p className="text-sm font-black text-white">{val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-4 bg-primary text-black font-black uppercase rounded-lg hover:bg-white transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Rocket className="w-4 h-4" />
                                {selectedItem.type === 'store_visit' ? 'Explore Store' : 'Confirm Action'}
                            </button>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-4 border border-white/10 text-white font-bold uppercase rounded-lg hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Transaction encrypted by SameField Edge</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            <DetailModal />
            <Toast />

            {/* Search Header */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                <input
                    type="text"
                    placeholder="Find local matches, rising stars, or ethical gear..."
                    className="w-full bg-surface border border-surfaceHighlight rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary transition-all placeholder:text-textMuted"
                />
            </div>

            {/* Rising Talent Spotlight */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-1">Rising <span className="text-primary">Talent</span></h2>
                        <p className="text-textMuted text-sm">Discover the next generation of athletes before they go pro.</p>
                    </div>
                    <button className="text-xs font-bold text-white hover:text-primary uppercase flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { name: 'Arjun K.', sport: 'Gully Cricket', location: 'Mumbai, IN', role: 'Fast Bowler', img: '/assets/talent_gully_cricket_1765787655210.png' },
                        { name: 'Sarah L.', sport: 'Wheelchair Tennis', location: 'London, UK', role: 'Seed #4', img: '/assets/talent_wheelchair_tennis_1765787672511.png' },
                        { name: 'Team Elevate', sport: 'Street Football', location: 'Lagos, NG', role: 'U-19 Squad', img: '/assets/talent_street_football_1765787693394.png' },
                        { name: 'Miguel R.', sport: 'Boxing', location: 'Bronx, NY', role: 'Amateur Champ', img: '/assets/talent_boxing_training_1765787719934.png' }
                    ].map((talent, i) => (
                        <div key={i} className="premium-card p-0 group cursor-pointer hover:-translate-y-1 transition-transform">
                            <div className="h-40 bg-surfaceHighlight relative overflow-hidden">
                                <img src={talent.img} alt="Talent" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-3 left-3">
                                    <h3 className="font-bold text-white text-lg leading-none">{talent.name}</h3>
                                    <p className="text-xs text-primary font-bold uppercase mt-1">{talent.sport}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-surface">
                                <div className="flex items-center gap-2 text-xs text-textMuted mb-3">
                                    <MapPin className="w-3 h-3" /> {talent.location}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSupportClick(talent.name)}
                                        className="flex-1 py-2 bg-primary text-black text-[10px] font-black uppercase rounded hover:bg-white transition-colors">
                                        Support
                                    </button>
                                    <button
                                        onClick={() => handleAction('follow', talent.name)}
                                        className="p-2 border border-surfaceHighlight rounded text-textMuted hover:text-white hover:border-white transition-colors"><UserPlus className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Grassroots Events */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" /> Grassroots & Local Events
                        </h2>
                        <div className="space-y-4">
                            {[
                                { title: 'District T20 Finals', loc: 'Shivaji Park, Mumbai', date: 'Sat, Aug 28 • 10:00 AM', price: '₹50', img: '/assets/thumb_fiba_basketball_1765784610870.png' },
                                { title: 'Community Charity Run', loc: 'Hyde Park, London', date: 'Sun, Aug 29 • 07:00 AM', price: 'Free', img: '/assets/thumb_olympics_gold_1765784536137.png' },
                                { title: 'Corporate Mixed Doubles', loc: 'Downtown Arena', date: 'Fri, Sep 02 • 06:00 PM', price: '$15 - Registration', img: '/assets/thumb_womens_football_1765784471060.png' }
                            ].map((evt, i) => (
                                <div key={i} className="premium-card p-5 flex flex-col md:flex-row items-center gap-6 hover:bg-surfaceHighlight/30 transition-colors">
                                    <div className="w-full md:w-20 h-20 bg-surfaceHighlight rounded-lg flex flex-col items-center justify-center border border-white/5 text-center p-2 relative overflow-hidden">
                                        <img src={evt.img} alt="Event" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                                        <span className="text-xs text-primary font-bold uppercase relative z-10">{evt.date.split('•')[0].split(',')[0]}</span>
                                        <span className="text-2xl font-black text-white relative z-10">{evt.date.split(' ')[2]}</span>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="font-bold text-white text-lg">{evt.title}</h3>
                                        <p className="text-sm text-textMuted flex items-center justify-center md:justify-start gap-1 mt-1">
                                            <MapPin className="w-3 h-3" /> {evt.loc} • <span className="text-white">{evt.date.split('•')[1]}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                                        <span className="text-lg font-black text-primary">{evt.price}</span>
                                        <button
                                            onClick={() => handleAction('ticket_buy', evt.title)}
                                            className="w-full py-2 px-4 rounded-full bg-white text-black text-xs font-black uppercase hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Ticket className="w-3 h-3" /> {evt.price === 'Free' ? 'Join' : 'Buy Ticket'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT: Ethical Marketplace */}
                <div className="space-y-8">

                    {/* Athlete Stores */}
                    <div className="premium-card p-6 border-l-4 border-l-green-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-green-500" /> Athlete Owned
                            </h3>
                            <Globe className="w-4 h-4 text-textMuted" />
                        </div>
                        <div className="space-y-4">
                            <div
                                onClick={() => handleAction('store_visit', 'VK18 Fitness Tech')}
                                className="bg-surfaceHighlight/30 p-3 rounded-lg flex gap-3 cursor-pointer group hover:bg-surfaceHighlight/50 transition-colors">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                                    <img src="/assets/store_vk18_fitness_1765787964441.png" className="w-full h-full object-cover" alt="VK" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">VK18 Fitness Tech</h4>
                                    <p className="text-xs text-textMuted">Owned by Virat Kohli</p>
                                </div>
                            </div>
                            <div
                                onClick={() => handleAction('store_visit', 'Serena Ventures')}
                                className="bg-surfaceHighlight/30 p-3 rounded-lg flex gap-3 cursor-pointer group hover:bg-surfaceHighlight/50 transition-colors">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                                    <img src="/assets/store_serena_ventures_1765787984356.png" className="w-full h-full object-cover" alt="SW" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">Serena Ventures</h4>
                                    <p className="text-xs text-textMuted">Owned by Serena Williams</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ethical & Artisan Showcase */}
                    <div className="premium-card p-6 border-t-4 border-t-primary">
                        <div className="flex items-center gap-2 mb-4">
                            <Leaf className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">Ethical Choice</h3>
                        </div>

                        <div
                            onClick={() => handleAction('purchase', 'Hand-Stitched Leather Gloves')}
                            className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-4 group cursor-pointer">
                            <img src="/assets/product_leather_gloves_1765788007746.png" alt="Product" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-[10px] text-primary font-bold uppercase border border-primary/20 flex items-center gap-1 z-10">
                                <Heart className="w-3 h-3 fill-primary" /> Fair Trade
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 p-4">
                                <h4 className="text-white font-bold leading-tight mb-1">Hand-Stitched Leather Gloves</h4>
                                <p className="text-xs text-gray-300 line-clamp-2">Crafted by artisans in Kashmir. 100% of profits go to worker welfare.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleAction('meet_maker', 'Hand-Stitched Leather Gloves')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-surfaceHighlight hover:bg-primary hover:text-black transition-colors group">
                                <span className="text-xs font-bold uppercase flex items-center gap-2">
                                    <Briefcase className="w-3 h-3" /> Meet the Maker
                                </span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => handleAction('store_visit', 'Ethical Artisan Collection')}
                                className="w-full py-2 bg-white text-black text-xs font-black uppercase rounded hover:bg-primary transition-colors">
                                View Collection
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Discover;
