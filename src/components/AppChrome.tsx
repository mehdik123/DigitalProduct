import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { BrandMark, IconButton } from './ui';
import { haptic } from '../lib/haptics';
import { cn } from '../lib/utils';

interface AppChromeProps {
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

/** Quiet top chrome: brand + language + logout. No pills / glow. */
export default function AppChrome({ showBack, onBack, className }: AppChromeProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    haptic.light();
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[200] w-full bg-bg/94 pad-safe-top',
        className
      )}
    >
      <div className="mx-auto flex h-[52px] max-w-lg items-center justify-between gap-3 px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {showBack && onBack ? (
            <IconButton aria-label={t('common.back')} onClick={onBack}>
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={1.75} />
            </IconButton>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="min-w-0"
              aria-label={t('nav.home')}
            >
              <BrandMark />
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageToggle />
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="grid h-10 w-10 place-items-center rounded-xl text-txt-lo transition-colors hover:bg-surface-1 hover:text-txt-hi"
              aria-label={t('nav.logout')}
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
