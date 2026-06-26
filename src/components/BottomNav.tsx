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

    const tabClass = (active: boolean) =>
        `relative flex items-center gap-2 overflow-hidden rounded-[1.5rem] p-4 transition-all duration-500 ${active
            ? 'flex-1 bg-grad-red text-white shadow-red'
            : 'text-txt-lo hover:bg-white/5 hover:text-txt-hi'
        }`;

    return (
        <nav className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 animate-slide-up justify-center px-4">
            <div className="pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-[2rem] border border-hair bg-surface-1/85 p-2 shadow-soft backdrop-blur-2xl">

                {/* Gloss Reflection */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                {/* Home */}
                <button onClick={() => handleNav('welcome')} className={tabClass(currentView === 'welcome')}>
                    <div className="relative z-10 flex w-full items-center justify-center gap-2">
                        <Target className={`h-5 w-5 ${currentView === 'welcome' ? 'animate-pulse' : ''}`} />
                        {currentView === 'welcome' && (
                            <span className="animate-fade-in whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em]">
                                Home
                            </span>
                        )}
                    </div>
                </button>

                {/* Training */}
                <button onClick={() => handleNav('workouts')} className={tabClass(currentView === 'workouts' || currentView === 'intro')}>
                    <div className="relative z-10 flex w-full items-center justify-center gap-2">
                        <Dumbbell className={`h-5 w-5 ${currentView === 'workouts' || currentView === 'intro' ? 'animate-pulse' : ''}`} />
                        {(currentView === 'workouts' || currentView === 'intro') && (
                            <span className="animate-fade-in whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em]">
                                Train
                            </span>
                        )}
                    </div>
                </button>

                {/* Nutrition */}
                <button onClick={() => handleNav('nutrition')} className={tabClass(currentView === 'nutrition')}>
                    <div className="relative z-10 flex w-full items-center justify-center gap-2">
                        <Utensils className={`h-5 w-5 ${currentView === 'nutrition' ? 'animate-pulse' : ''}`} />
                        {currentView === 'nutrition' && (
                            <span className="animate-fade-in whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em]">
                                Diet
                            </span>
                        )}
                    </div>
                </button>

                {user && (
                    <>
                        <div className="mx-1 h-6 w-px bg-hair" />
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-transparent p-3 text-txt-lo transition-all hover:border-brand/20 hover:bg-brand-soft hover:text-brand"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
