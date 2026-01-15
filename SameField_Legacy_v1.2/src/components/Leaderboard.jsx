import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'users'),
            orderBy('xp', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaders(list);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div className="p-8 text-center animate-pulse">
            <Trophy className="mx-auto mb-4 text-white/10" size={48} />
            <div className="h-4 bg-white/5 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-1/3 mx-auto"></div>
        </div>
    );

    return (
        <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                        <Trophy className="text-primary" size={20} /> Hall of Fandom
                    </h3>
                    <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-1">Real-time Global Rankings</p>
                </div>
                <div className="px-3 py-1 bg-primary/20 rounded-full border border-primary/30 flex items-center gap-2">
                    <TrendingUp size={12} className="text-primary" />
                    <span className="text-[10px] text-white font-black uppercase">Live Now</span>
                </div>
            </div>

            <div className="p-4 space-y-2">
                {leaders.map((user, index) => (
                    <div
                        key={user.id}
                        className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${index === 0 ? 'bg-primary/5 border border-primary/20' : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <div className="w-8 flex justify-center font-black text-lg">
                            {index === 0 && <Crown className="text-yellow-400" size={20} />}
                            {index === 1 && <Medal className="text-gray-400" size={20} />}
                            {index === 2 && <Medal className="text-orange-400" size={20} />}
                            {index > 2 && <span className="text-textMuted opacity-50">#{index + 1}</span>}
                        </div>

                        <div className="relative">
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                className="w-10 h-10 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-colors"
                                alt=""
                            />
                            {index === 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-surface animate-pulse" />}
                        </div>

                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user.name}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-textMuted font-black uppercase">Level {Math.floor(user.xp / 1000)}</span>
                                <div className="h-0.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary/50"
                                        style={{ width: `${(user.xp % 1000) / 10}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-sm font-black text-white italic tabular-nums">{user.xp.toLocaleString()}</span>
                            <p className="text-[9px] text-textMuted font-black uppercase tracking-tighter">TOTAL XP</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                <button className="text-[10px] font-black text-textMuted hover:text-white uppercase tracking-widest transition-colors">
                    View Full Rankings
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
