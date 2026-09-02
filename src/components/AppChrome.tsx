import { ArrowLeft, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { BrandMark } from './ui';
import { haptic } from '../lib/haptics';
import { spring, tapSubtle } from '../design/motion';
import { cn } from '../lib/utils';

interface AppChromeProps {
    showBack?: boolean;
    onBack?: () => void;
    className?: string;
}

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
                'fixed inset-x-0 top-0 z-[200] w-full max-w-[100vw] overflow-hidden border-b border-white/8 bg-bg/85 backdrop-blur-2xl pad-safe-top',
                'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent',
                className
            )}
        >
            <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-1.5 px-2.5 sm:h-12 sm:gap-2 sm:px-4">
                <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
                    {showBack && onBack ? (
                        <motion.button
                            type="button"
                            whileTap={tapSubtle}
                            transition={spring.snappy}
                            onClick={onBack}
                            aria-label={t('common.back')}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-surface-1/80 text-txt-mid shadow-soft backdrop-blur-sm transition-colors hover:border-brand/30 hover:text-txt-hi sm:h-9 sm:w-9"
                        >
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        </motion.button>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="press min-w-0 max-w-[42%] truncate sm:max-w-none"
                        aria-label={t('nav.home')}
                    >
                        <BrandMark compact />
                    </button>
                </div>

                <div className="flex shrink-0 items-center rounded-full border border-white/10 bg-surface-1/70 p-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md">
                    <LanguageToggle compact embedded />
                    {user && (
                        <>
                            <span className="mx-0.5 h-4 w-px bg-white/10" aria-hidden />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={tapSubtle}
                                transition={spring.snappy}
                                onClick={handleLogout}
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-txt-mid transition-colors hover:bg-brand/15 hover:text-brand sm:h-8 sm:w-8"
                                aria-label={t('nav.logout')}
                            >
                                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
