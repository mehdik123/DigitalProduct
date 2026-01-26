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
        <nav className="fixed bottom-0 left-0 right-0 p-4 z-[100] animate-slide-up flex justify-center pointer-events-none">
            <div className="glass-panel rounded-[2.5rem] p-2 flex items-center gap-1 shadow-2xl shadow-black/80 border-white/10 pointer-events-auto backdrop-blur-3xl ring-1 ring-white/5">

                {/* Home */}
                <button
                    onClick={() => handleNav('welcome')}
                    className={`p-4 md:p-5 rounded-[2rem] transition-all duration-300 flex items-center gap-3 ${currentView === 'welcome' ? 'bg-red-600 text-white shadow-xl shadow-red-500/40 px-6 md:px-8' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                    title="Home"
                >
                    <Target className="w-6 h-6" />
                    {currentView === 'welcome' && <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Home</span>}
                </button>

                {/* Training */}
                <button
                    onClick={() => handleNav('workouts')}
                    className={`p-4 md:p-5 rounded-[2rem] transition-all duration-300 flex items-center gap-3 ${currentView === 'workouts' || currentView === 'intro' ? 'bg-red-600 text-white shadow-xl shadow-red-500/40 px-6 md:px-8' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                    title="Training"
                >
                    <Dumbbell className="w-6 h-6" />
                    {(currentView === 'workouts' || currentView === 'intro') && <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Program</span>}
                </button>

                {/* Nutrition */}
                <button
                    onClick={() => handleNav('nutrition')}
                    className={`p-4 md:p-5 rounded-[2rem] transition-all duration-300 flex items-center gap-3 ${currentView === 'nutrition' ? 'bg-red-600 text-white shadow-xl shadow-red-500/40 px-6 md:px-8' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                    title="Nutrition"
                >
                    <Utensils className="w-6 h-6" />
                    {currentView === 'nutrition' && <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Biology</span>}
                </button>

                {user && (
                    <>
                        <div className="w-px h-8 bg-white/10 mx-2" />
                        <button
                            onClick={handleLogout}
                            className="p-4 md:p-5 rounded-[2rem] text-neutral-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
