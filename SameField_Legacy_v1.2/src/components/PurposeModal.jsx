import React, { useState, useEffect } from 'react';
import { Video, Star, Heart, Trophy, ChevronRight } from 'lucide-react';

const BlockbusterPurposeModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenPurpose = localStorage.getItem('samefield_purpose_seen');
        if (!hasSeenPurpose) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('samefield_purpose_seen', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    // Rich content: Women in sports focus (training, matches, crowds, grassroots)
    const posters = [
        "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530549387634-e797817f9a91?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612872080531-421e3050c410?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1461896704190-3213c9607051?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544698310-74ea0d0d50cb?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526676037777-05a232534f57?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1431324155629-1a6eda1dec2d?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop",
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden font-outfit select-none flex flex-col items-center justify-center">

            {/* BACKGROUND: High-Density Texture Wall (Restored Visibility) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-[-20%] grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-2 opacity-55 blur-[4px] grayscale-[20%] animate-slow-drift"
                >
                    {[...posters, ...posters, ...posters, ...posters].map((img, i) => (
                        <div key={i} className="aspect-[2/3] rounded-sm overflow-hidden border border-white/5">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                </div>

                {/* BACKGROUND TREATMENT: Eased Vignette & Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-70" />
            </div>

            {/* FOREGROUND: Core Content Layer (Normalized Proportions) */}
            <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center space-y-8 md:space-y-10 animate-blockbuster-entry">

                {/* TEXT HIERARCHY: Dominant Headline (Premium Stylized Scaling) */}
                <div className="space-y-5">
                    <div className="flex items-center justify-center gap-6 mb-2 opacity-100">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.6em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Samefield Sports</span>
                        <Trophy className="w-4 h-4 text-primary" />
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                        Watch. Support.<br />
                        <span className="text-primary italic drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">Elevate.</span>
                    </h1>

                    {/* Body Text: Human-Written Clean Statement (Scaled Down) */}
                    <div className="max-w-2xl mx-auto pt-2">
                        <p className="text-base md:text-2xl font-medium text-gray-200 tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            Join the movement to amplify women athletes. <br className="hidden md:block" />
                            Every point you earn creates <span className="text-white">real impact.</span>
                        </p>
                        <p className="text-[10px] md:text-xs font-bold text-primary/100 tracking-[0.2em] uppercase mt-5 italic bg-black/40 py-1 px-4 inline-block rounded-full backdrop-blur-sm shadow-xl">
                            Elevating women’s sports, one point at a time.
                        </p>
                    </div>
                </div>

                {/* PROCESS: Minimalist Icons (Tighter Spacing) */}
                <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-white/10">
                    {[
                        { icon: Video, text: "Watch Matches" },
                        { icon: Heart, text: "Earn XP" },
                        { icon: Star, text: "Unlock Rewards" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 group">
                            <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* CTA: Rock Solid Confidence (Normalized Scale) */}
                <div className="pt-2">
                    <button
                        onClick={handleDismiss}
                        className="px-14 py-5 bg-primary text-black rounded-lg font-black uppercase text-base md:text-lg tracking-[0.2em] transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,215,0,0.25)] border-none outline-none"
                    >
                        Start Supporting
                    </button>
                    <p className="mt-6 text-[8px] text-white/30 uppercase tracking-[0.8em] font-black">EST. 2025 • Purpose First</p>
                </div>

            </div>

            <style>{`
                @keyframes slow-drift {
                    0% { transform: scale(1.1) translate(0, 0); }
                    100% { transform: scale(1.1) translate(-2%, -2%); }
                }
                .animate-slow-drift {
                    animation: slow-drift 60s linear infinite alternate;
                }
                @keyframes blockbuster-entry {
                    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-blockbuster-entry {
                    animation: blockbuster-entry 1s cubic-bezier(0.2, 0, 0, 1) forwards;
                }
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
};

export default BlockbusterPurposeModal;
