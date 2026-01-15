import React, { useState, useEffect } from 'react';
import { User, ArrowRight, Sparkles } from 'lucide-react';

const UsernameModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('samefield_username');
        if (!storedName) {
            setIsOpen(true);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }
        localStorage.setItem('samefield_username', name.trim());

        // Trigger a custom event so other components (VoiceService) can pick it up immediately if needed
        window.dispatchEvent(new Event('usernameUpdated'));

        // Reload to ensure everything picks up the new identity (simplest way to propagate to singletons)
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in p-4">
            <div className="w-full max-w-md bg-surface border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.1)] overflow-hidden relative">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="p-8 relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center rotate-3 shadow-lg group">
                            <User className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Identify Yourself</h2>
                        <p className="text-textMuted text-sm">Enter the name that will represent you across the <span className="text-primary font-bold">SameField</span> universe.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Username..."
                                className="w-full bg-black/50 border border-surfaceHighlight rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold"
                                autoFocus
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        </div>

                        {error && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_5px_20px_rgba(255,215,0,0.3)]"
                        >
                            <span>Enter Arena</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UsernameModal;
