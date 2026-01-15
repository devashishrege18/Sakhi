import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlayCircle, Users, MessageSquare, Compass, Hexagon, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Watch', path: '/watch', icon: PlayCircle },
        { name: 'Fandom', path: '/fandom', icon: Users },
        { name: 'Forum', path: '/forum', icon: MessageSquare },
        { name: 'Discover', path: '/discover', icon: Compass },
    ];

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const handleNavigation = (path, e) => {
        e.stopPropagation(); // Prevent toggling sidebar if clicking link
        navigate(path);
    };

    return (
        <aside
            className={`hidden md:flex h-screen bg-[#050505] border-r border-surfaceHighlight flex-col transition-all duration-300 z-20 relative flex-shrink-0
            ${isExpanded ? 'w-64' : 'w-20'} items-center`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >

            {/* Brand / Toggle */}
            <div
                className={`flex items-center justify-center h-20 w-full mb-6 transition-colors ${isExpanded ? 'px-6 justify-start' : ''}`}
            >
                <div
                    onClick={toggleSidebar}
                    className="relative cursor-pointer hover:scale-105 transition-transform"
                >
                    <Hexagon className={`w-8 h-8 text-primary fill-current transition-transform duration-500 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
                    {!isExpanded && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center"><ChevronRight className="w-2 h-2 text-black" /></div>}
                </div>

                {isExpanded && (
                    <div
                        onClick={(e) => handleNavigation('/', e)}
                        className="ml-3 flex flex-col overflow-hidden whitespace-nowrap animate-fade-in hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <span className="font-black text-xl tracking-tighter text-white uppercase leading-none">Samefield</span>
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase leading-none mt-1">Sports</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2 w-full px-3 z-10">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.name}
                            onClick={(e) => handleNavigation(item.path, e)}
                            title={!isExpanded ? item.name : ''}
                            className={`
                                relative z-10 cursor-pointer flex items-center ${isExpanded ? 'justify-start px-4' : 'justify-center px-0'} py-3 rounded-lg transition-all duration-300 group
                                ${isActive ? 'text-primary bg-surfaceHighlight' : 'text-textMuted hover:text-white hover:bg-surfaceHighlight/50'}
                            `}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                            {isExpanded && (
                                <span className="ml-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap overflow-hidden animate-fade-in">{item.name}</span>
                            )}

                            {/* Active Indicator Glow */}
                            {isActive && (
                                <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_theme('colors.primary')] ${isExpanded ? 'left-0' : 'left-0'}`} />
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer Toggle Hint */}
            <div className="mt-auto pb-6 w-full flex justify-center">
                <button onClick={toggleSidebar} className="p-2 text-textMuted hover:text-white transition-colors">
                    {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
