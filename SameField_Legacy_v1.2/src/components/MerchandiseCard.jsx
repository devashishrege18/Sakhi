import React from 'react';
import { Heart, Briefcase, ArrowRight, Leaf } from 'lucide-react';

const MerchandiseCard = ({ item }) => {
    return (
        <div className="premium-card p-6 border-t-4 border-t-primary">
            <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Ethical Choice</h3>
            </div>

            <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-4 group cursor-pointer">
                <img src={item.imageSrc} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform" />

                {/* Fair Trade Badge (Conditional based on data) */}
                {item.isFairTrade && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-[10px] text-primary font-bold uppercase border border-primary/20 flex items-center gap-1 z-10">
                        <Heart className="w-3 h-3 fill-primary" /> Fair Trade
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 p-4">
                    <h4 className="text-white font-bold leading-tight mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-300 line-clamp-2">{item.description}</p>
                </div>
            </div>

            {/* Buttons Section */}
            <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-surfaceHighlight hover:bg-primary hover:text-black transition-colors group">
                    <span className="text-xs font-bold uppercase flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Meet the Maker
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full py-2 bg-white text-black text-xs font-black uppercase rounded hover:bg-primary transition-colors">
                    View Collection
                </button>
            </div>
        </div>
    );
};

export default MerchandiseCard;