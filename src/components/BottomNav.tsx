import { Home, Dumbbell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { haptic } from '../lib/haptics';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeView?: 'welcome' | 'intro' | 'workouts';
  onViewChange?: (view: 'welcome' | 'intro' | 'workouts') => void;
}

const tabs = [
  { id: 'welcome' as const, icon: Home, labelKey: 'nav.home' },
  { id: 'workouts' as const, icon: Dumbbell, labelKey: 'nav.train', matchIntro: true },
];

/** P03/P04 nav: edge-to-edge bar, active = bone + 20×2 red rule above. */
export default function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleNav = (target: 'welcome' | 'workouts') => {
    haptic.light();
    onViewChange?.(target === 'workouts' && !user ? 'intro' : target);
    if (location.pathname !== '/') navigate('/');
  };

  const isActive = (tab: (typeof tabs)[number]) => {
    if (tab.matchIntro) return activeView === 'workouts' || activeView === 'intro';
    return activeView === tab.id;
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-hair bg-[rgba(17,17,16,0.94)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex h-[62px] max-w-lg px-10 pt-2.5">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNav(tab.id)}
              aria-label={t(tab.labelKey)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1.5 pt-2',
                'text-[11px] font-semibold uppercase tracking-[0.08em]',
                active ? 'text-txt-hi' : 'text-txt-lo'
              )}
            >
              {active && (
                <span className="absolute -top-[11px] h-0.5 w-5 rounded-sm bg-brand" aria-hidden />
              )}
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span>{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
