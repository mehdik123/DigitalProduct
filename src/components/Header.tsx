import { useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import { BrandMark, IconButton } from './ui';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onSignup: () => void;
  showAuthButtons?: boolean;
}

export default function Header({ }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-[60] flex w-full items-center justify-between border-b border-hair bg-bg/60 px-3 py-3 backdrop-blur-xl pad-safe-top supports-[backdrop-filter]:bg-bg/30 sm:px-4 md:px-8">
      {/* Brand Identity */}
      <button
        onClick={() => navigate('/')}
        className="press flex items-center gap-3"
        aria-label="Home"
      >
        <BrandMark />
      </button>

      {/* Action Zone */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="md:hidden">
          <IconButton aria-label="Home" onClick={() => navigate('/')}>
            <Home className="h-[18px] w-[18px]" />
          </IconButton>
        </div>

        <div className="scale-100 opacity-90 transition-opacity hover:opacity-100">
          <LanguageToggle />
        </div>

        {user && (
          <button
            onClick={() => signOut()}
            className="group flex items-center gap-2 rounded-xl border border-hair bg-surface-2 px-3 py-2 text-txt-mid transition-all hover:border-brand/50 hover:bg-brand-soft hover:text-brand sm:px-4"
            aria-label={t('common.logout')}
          >
            <span className="hidden text-[10px] font-bold uppercase tracking-wider sm:inline">{t('common.logout')}</span>
            <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
