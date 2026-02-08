import { useNavigate, useLocation } from 'react-router-dom';
import { Target, Dumbbell, Utensils, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
    activeView?: 'welcome' | 'intro' | 'workouts' | 'nutrition';
    onViewChange?: (view: 'welcome' | 'intro' | 'workouts') => void;
}

export default function BottomNav({ activeView, onViewChange }: BottomNavProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();

    const isNutrition = location.pathname.startsWith('/nutrition');

    // Determine active state
    const currentView = isNutrition ? 'nutrition' : activeView;

    const handleNav = (target: 'welcome' | 'workouts' | 'nutrition') => {
        if (target === 'nutrition') {
            navigate('/nutrition');
        } else {
            if (onViewChange) {
                onViewChange(target === 'workouts' && !user ? 'intro' : target);
            }
            if (location.pathname !== '/') {
                navigate('/');
                // We'll need a way to communicate the view change if we just navigated
                // For now, most nav happens within App.tsx where onViewChange is provided
            }
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
        if (onViewChange) onViewChange('welcome');
    };

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up flex justify-center w-full max-w-sm px-4 pointer-events-none">
            <div className="w-full bg-zinc-900/80 backdrop-blur-2xl rounded-[2rem] p-2 flex items-center justify-between shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto ring-1 ring-white/5 relative overflow-hidden">

                {/* Gloss Reflection */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                {/* Home */}
                <button
                    onClick={() => handleNav('welcome')}
                    className={`relative p-4 rounded-[1.5rem] transition-all duration-500 flex items-center gap-2 group overflow-hidden ${currentView === 'welcome' ? 'flex-1 bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                    <div className="relative z-10 flex items-center justify-center w-full gap-2">
                        <Target className={`w-5 h-5 ${currentView === 'welcome' ? 'animate-pulse' : ''}`} />
                        {currentView === 'welcome' && (
                            <span className="font-black text-[10px] uppercase tracking-[0.2em] animate-fade-in whitespace-nowrap">
                                Home
                            </span>
                        )}
                    </div>
                </button>

                {/* Training */}
                <button
                    onClick={() => handleNav('workouts')}
                    className={`relative p-4 rounded-[1.5rem] transition-all duration-500 flex items-center gap-2 group overflow-hidden ${currentView === 'workouts' || currentView === 'intro' ? 'flex-1 bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                    <div className="relative z-10 flex items-center justify-center w-full gap-2">
                        <Dumbbell className={`w-5 h-5 ${currentView === 'workouts' || currentView === 'intro' ? 'animate-pulse' : ''}`} />
                        {(currentView === 'workouts' || currentView === 'intro') && (
                            <span className="font-black text-[10px] uppercase tracking-[0.2em] animate-fade-in whitespace-nowrap">
                                Train
                            </span>
                        )}
                    </div>
                </button>

                {/* Nutrition */}
                <button
                    onClick={() => handleNav('nutrition')}
                    className={`relative p-4 rounded-[1.5rem] transition-all duration-500 flex items-center gap-2 group overflow-hidden ${currentView === 'nutrition' ? 'flex-1 bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                    <div className="relative z-10 flex items-center justify-center w-full gap-2">
                        <Utensils className={`w-5 h-5 ${currentView === 'nutrition' ? 'animate-pulse' : ''}`} />
                        {currentView === 'nutrition' && (
                            <span className="font-black text-[10px] uppercase tracking-[0.2em] animate-fade-in whitespace-nowrap">
                                Diet
                            </span>
                        )}
                    </div>
                </button>

                {user && (
                    <>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <button
                            onClick={handleLogout}
                            className="p-3 rounded-full text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
