import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlayCircle, Users, MessageSquare, Compass } from 'lucide-react';

const MobileNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Watch', path: '/watch', icon: PlayCircle },
        { name: 'Fandom', path: '/fandom', icon: Users },
        { name: 'Forum', path: '/forum', icon: MessageSquare },
        { name: 'Discover', path: '/discover', icon: Compass },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-[#161616]/90 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-around px-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`relative p-3 flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        <item.icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                        {isActive && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default MobileNav;
