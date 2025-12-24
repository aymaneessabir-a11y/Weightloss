import { motion } from 'framer-motion';
import { Home, History, Settings, Plus } from 'lucide-react';
import { View } from '../../types';

interface NavbarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
}

export function Navbar({ currentView, setCurrentView }: NavbarProps) {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'weigh-in', icon: Plus, label: 'Log' },
        { id: 'history', icon: History, label: 'History' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="flex items-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id as View)}
                            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 ${isActive ? 'text-background' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute inset-0 bg-accent rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon className="w-5 h-5 relative z-10" />
                            <span className="sr-only">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
