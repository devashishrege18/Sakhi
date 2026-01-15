import React, { useState } from 'react';
import { ArrowUpRight, Play, Calendar, Search, TrendingUp, Award, BarChart2, Activity, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import Leaderboard from '../components/Leaderboard';

const Home = () => {
    const { addPoints } = usePoints();
    const [pollVoted, setPollVoted] = useState(false);
    const [predictionMade, setPredictionMade] = useState(false);

    const handlePrediction = (player) => {
        if (!predictionMade) {
            addPoints(150, 'Live Prediction Made');
            setPredictionMade(true);
        }
    };

    const handlePoll = () => {
        if (!pollVoted) {
            addPoints(50, 'Quick Poll Participation');
            setPollVoted(true);
        }
    };

    return (
        <div className="space-y-8">

            {/* Top Section: Search Bar (Page Level) */}
            <div className="flex justify-end">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search matches, players, stats..."
                        className="w-full bg-surface/50 border border-surfaceHighlight text-white pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:border-primary transition-all placeholder:text-textMuted"
                    />
                </div>
            </div>

            {/* Hero Section: Mixed Team Cricket */}
            <div className="relative h-[300px] md:h-[450px] rounded-[32px] overflow-hidden group">
                <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2674&auto=format&fit=crop"
                    alt="Cricket Stadium"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-primary text-black text-[10px] font-black uppercase rounded-lg animate-pulse">
                            ● World Premiere
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-none uppercase">
                        History in the <br />
                        <span className="text-primary">Making</span>
                    </h1>
                    <p className="text-sm md:text-xl font-bold text-white uppercase tracking-wider max-w-xl">
                        First-Ever Mixed Team Cricket Tournament
                    </p>
                    <p className="text-xs md:text-sm text-gray-300 italic max-w-md font-medium">
                        "Redefining how teams are formed in modern sport."
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <button className="px-8 py-3 bg-primary text-black rounded-full font-black uppercase text-sm flex items-center gap-2 hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                            Watch Live <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button className="px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-black uppercase text-sm hover:bg-white/10 transition-all">
                            Tournament Info
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN (Content Stream) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Featured Events Carousel */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" /> Featured Events
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-1 rounded bg-surfaceHighlight hover:bg-primary hover:text-black transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                <button className="p-1 rounded bg-surfaceHighlight hover:bg-primary hover:text-black transition-colors"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {[
                                { id: 1, title: 'Super Six Finals', type: 'Mixed Doubles', img: '/assets/thumb_womens_football_1765784471060.png', tag: 'Support Local Talent' },
                                { id: 2, title: 'Slamball Semis', type: 'Extreme Sports', img: '/assets/thumb_redbull_extreme_1765784514775.png', tag: 'Low Viewership - Join In!' },
                                { id: 3, title: 'Pro Surf League', type: 'World Tour', img: '/assets/thumb_surfing_wsl_1765784559697.png' },
                                { id: 4, title: 'WNBA All-Stars', type: 'Exhibition', img: '/assets/thumb_wnba_basketball_1765784493211.png' },
                                { id: 5, title: 'Gold Medal Rerun', type: 'Olympics', img: '/assets/thumb_olympics_gold_1765784536137.png' }
                            ].map((ev) => (
                                <div key={ev.id} className="min-w-[280px] h-40 rounded-xl bg-surface border border-surfaceHighlight p-4 flex flex-col justify-between hover:border-primary transition-colors cursor-pointer relative overflow-hidden group">
                                    <div className="absolute inset-0">
                                        <img src={ev.img} alt="Event" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Aug 24 • 14:00 GMT</span>
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-white text-lg leading-tight mb-1">{ev.title}</h4>
                                        <p className="text-xs text-gray-300 mb-2">{ev.type} • Match {ev.id}</p>
                                        {ev.tag === 'Support Local Talent' && (
                                            <span className="inline-block px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold uppercase rounded border border-white/20">
                                                Support Local Talent
                                            </span>
                                        )}
                                        {ev.tag === 'Low Viewership - Join In!' && (
                                            <span className="inline-block px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase rounded border border-red-500/20">
                                                Low Viewership - Join In!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Live & Upcoming Matches */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" /> Match Centre
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {/* Live Card */}
                            <div className="premium-card p-0 flex flex-col md:flex-row overflow-hidden group">
                                <div className="w-full md:w-1/3 bg-black relative flex items-center justify-center p-6 border-r border-surfaceHighlight">
                                    <img src="/assets/generic_sport_thumb.png" alt="Live" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded-sm animate-pulse z-10">Live</div>
                                    <div className="text-center relative z-10">
                                        <div className="flex items-center justify-center gap-4 text-2xl font-black text-white mb-2">
                                            <span>IND</span> <span className="text-textMuted text-lg">vs</span> <span>AUS</span>
                                        </div>
                                        <p className="text-xs text-primary font-bold uppercase tracking-widest">Mixed T20 • Innings 2</p>
                                        <p className="text-sm text-textMuted mt-1">AUS needs 42 runs in 28 balls</p>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between bg-surface/50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Semi-Final 1</h3>
                                            <p className="text-xs text-textMuted">Wankhede Stadium, Mumbai</p>
                                        </div>
                                        <button className="px-4 py-1.5 rounded-full bg-primary text-black text-xs font-bold uppercase hover:bg-white transition-colors">Watch</button>
                                    </div>
                                    <div className="w-full bg-surfaceHighlight h-1 rounded-full overflow-hidden">
                                        <div className="w-[70%] h-full bg-primary" />
                                    </div>
                                    <p className="text-[10px] text-right text-textMuted mt-1">Win Probability: IND 70%</p>
                                </div>
                            </div>

                            {/* Upcoming Card */}
                            <div className="premium-card p-4 flex items-center justify-between hover:bg-surfaceHighlight/30 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="text-center w-12 text-xs font-bold text-textMuted">
                                        <span className="block text-white text-sm">18:00</span>
                                        Today
                                    </div>
                                    <div className="h-8 w-[1px] bg-surfaceHighlight" />
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-white">ENG (Mix)</span>
                                        <span className="text-xs text-textMuted">vs</span>
                                        <span className="font-bold text-white">SA (Mix)</span>
                                    </div>
                                </div>
                                <button className="p-2 text-textMuted hover:text-white"><ArrowUpRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </section>

                    {/* Trending Highlights */}
                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Trending Now
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Incredible one-handed catch!', img: '/assets/thumb_redbull_extreme_1765784514775.png' },
                                { title: 'Last minute goal!', img: '/assets/thumb_womens_football_1765784471060.png' },
                                { title: 'Perfect 10 Ride', img: '/assets/thumb_surfing_wsl_1765784559697.png' },
                                { title: 'Buzzer Beater 3pt', img: '/assets/thumb_fiba_basketball_1765784610870.png' }
                            ].map((highlight, i) => (
                                <div key={i} className="premium-card relative aspect-video group overflow-hidden cursor-pointer">
                                    <img src={highlight.img} alt="Highlight" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-3 bg-primary/90 rounded-full text-black">
                                            <Play className="w-6 h-6 fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 w-full p-4">
                                        <span className="tiniest-text text-primary uppercase font-bold bg-black/50 px-1 rounded">Highlight</span>
                                        <p className="text-white font-bold leading-tight mt-1">{highlight.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Social Proof Bar */}
                    <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-xl border border-primary/20 flex items-center gap-4 animate-fade-in">
                        <div className="p-2 bg-primary/20 rounded-full">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">
                                🔥 <span className="text-primary">12,430 fans</span> watching history unfold right now
                            </p>
                            <p className="text-xs text-textMuted">Join the conversation in the Forum or Voice Rooms.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Stats & Interaction) */}
                <div className="space-y-6">

                    {/* Points Dashboard */}
                    <div className="premium-card p-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-primary" /> My Points
                        </h3>
                        <div className="text-center py-4 border-b border-surfaceHighlight mb-4">
                            {/* Live updated via context in real app, hardcoded fallback for layout */}
                            <span className="text-5xl font-black text-primary italic tracking-tighter">
                                8,450
                            </span>
                            <p className="text-xs text-textMuted mt-1 uppercase tracking-widest">Total XP Earned</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-textMuted">Weekly Rank</span>
                                <span className="text-white font-bold">#42</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-textMuted">Prediction Accuracy</span>
                                <span className="text-white font-bold">87%</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Prediction Widget */}
                    <div className="premium-card p-0 overflow-hidden border-primary/50">
                        <div className="bg-primary/10 p-4 border-b border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-xs font-black text-primary uppercase tracking-widest">Live Prediction</span>
                            </div>
                            <p className="text-white font-bold text-sm">Who will hit the next 6?</p>
                        </div>
                        <div className="p-4 space-y-2">
                            <button
                                onClick={() => handlePrediction('A')}
                                disabled={predictionMade}
                                className={`w-full py-2 rounded-lg ${predictionMade ? 'bg-surfaceHighlight text-textMuted' : 'bg-surfaceHighlight hover:bg-primary hover:text-black'} transition-colors text-xs font-bold text-white uppercase`}
                            >
                                Player A (1.5x)
                            </button>
                            <button
                                onClick={() => handlePrediction('B')}
                                disabled={predictionMade}
                                className={`w-full py-2 rounded-lg ${predictionMade ? 'bg-surfaceHighlight text-textMuted' : 'bg-surfaceHighlight hover:bg-primary hover:text-black'} transition-colors text-xs font-bold text-white uppercase`}
                            >
                                Player B (2.0x)
                            </button>
                        </div>
                    </div>

                    {/* Mid-Match Poll */}
                    <div className="premium-card p-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Quick Poll</h3>
                        <p className="text-xs text-textMuted mb-3">Should mixed doubles be introduced in Test Cricket?</p>
                        <div onClick={handlePoll} className={`w-full bg-surfaceHighlight rounded-full h-8 relative mb-2 cursor-pointer overflow-hidden group ${pollVoted ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="absolute inset-0 flex items-center justify-between px-3 z-10">
                                <span className="text-[10px] font-bold text-white uppercase">YES</span>
                                <span className="text-[10px] font-bold text-white">72%</span>
                            </div>
                            <div className="h-full bg-green-500/20 w-[72%] group-hover:bg-green-500/30 transition-colors" />
                        </div>
                        <div onClick={handlePoll} className={`w-full bg-surfaceHighlight rounded-full h-8 relative cursor-pointer overflow-hidden group ${pollVoted ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="absolute inset-0 flex items-center justify-between px-3 z-10">
                                <span className="text-[10px] font-bold text-white uppercase">NO</span>
                                <span className="text-[10px] font-bold text-white">28%</span>
                            </div>
                            <div className="h-full bg-red-500/20 w-[28%] group-hover:bg-red-500/30 transition-colors" />
                        </div>
                    </div>

                    {/* Global Leaderboard */}
                    <Leaderboard />

                </div>
            </div >
        </div >
    );
};

export default Home;
