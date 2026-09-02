import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Dumbbell, Utensils, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { haptic } from '../lib/haptics';
import { spring } from '../design/motion';
import { cn } from '../lib/utils';

interface BottomNavProps {
    activeView?: 'welcome' | 'intro' | 'workouts' | 'nutrition';
    onViewChange?: (view: 'welcome' | 'intro' | 'workouts') => void;
}

const tabs = [
    { id: 'welcome' as const, icon: Target, labelKey: 'nav.home' },
    { id: 'workouts' as const, icon: Dumbbell, labelKey: 'nav.train', matchIntro: true },
    { id: 'nutrition' as const, icon: Utensils, labelKey: 'nav.diet', route: true },
];

export default function BottomNav({ activeView, onViewChange }: BottomNavProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();
    const { t } = useLanguage();

    const isNutrition = location.pathname.startsWith('/nutrition');
    const currentView = isNutrition ? 'nutrition' : activeView;

    const handleNav = (target: 'welcome' | 'workouts' | 'nutrition') => {
        haptic.light();
        if (target === 'nutrition') {
            navigate('/nutrition');
            return;
        }
        onViewChange?.(target === 'workouts' && !user ? 'intro' : target);
        if (location.pathname !== '/') navigate('/');
    };

    const isActive = (tab: (typeof tabs)[number]) => {
        if (tab.id === 'nutrition') return currentView === 'nutrition';
        if (tab.matchIntro) return currentView === 'workouts' || currentView === 'intro';
        return currentView === tab.id;
    };

    return (
        <nav
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center px-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
            <div className="pointer-events-auto flex w-full max-w-sm items-center gap-1 rounded-[1.75rem] border border-hair bg-surface-1/90 p-1.5 shadow-soft backdrop-blur-2xl">
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {tabs.map((tab) => {
                    const active = isActive(tab);
                    const Icon = tab.icon;
                    return (
                        <motion.button
                            key={tab.id}
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            transition={spring.snappy}
                            onClick={() => handleNav(tab.id)}
                            aria-label={t(tab.labelKey)}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] py-2.5 min-h-[52px] transition-colors',
                                active
                                    ? 'bg-grad-red text-white shadow-red'
                                    : 'text-txt-lo hover:bg-white/5 hover:text-txt-hi'
                            )}
                        >
                            <Icon className={cn('h-5 w-5', active && 'drop-shadow-sm')} />
                            <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                                {t(tab.labelKey)}
                            </span>
                        </motion.button>
                    );
                })}

                {user && (
                    <>
                        <div className="mx-0.5 h-8 w-px bg-hair" />
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            transition={spring.snappy}
                            onClick={async () => {
                                haptic.light();
                                await signOut();
                                navigate('/');
                                onViewChange?.('welcome');
                            }}
                            aria-label={t('nav.logout')}
                            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[1.25rem] text-txt-lo transition-colors hover:bg-brand-soft hover:text-brand"
                        >
                            <LogOut className="h-5 w-5" />
                        </motion.button>
                    </>
                )}
            </div>
        </nav>
    );
}
