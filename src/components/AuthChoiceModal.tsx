import { X, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Eyebrow, StatStrip, IconButton, BrandMark } from './ui';

interface AuthChoiceModalProps {
    onClose: () => void;
    onJoin: () => void;
    onLogin: () => void;
    /** When true, shows a close button (used as a dismissible modal). The
     *  logged-out entry screen leaves this false — there's nothing to close. */
    dismissible?: boolean;
}

export default function AuthChoiceModal({ onClose, onJoin, onLogin, dismissible = false }: AuthChoiceModalProps) {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-hero fixed inset-0 z-[150] overflow-y-auto overflow-x-hidden"
        >
            {/* Ambient grid + diagonal speed streak (the brand signature). */}
            <div className="ambient-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="ambient-streak pointer-events-none absolute -left-[30%] -top-[10%] h-[46%] w-[160%]" />

            <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
                {/* Top bar */}
                <div className="flex animate-rise items-center justify-between opacity-0" style={{ animationDelay: '.05s' }}>
                    <BrandMark />
                    {dismissible && (
                        <IconButton aria-label="close" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </IconButton>
                    )}
                </div>

                {/* Hero */}
                <div className="flex flex-col justify-center py-4 sm:flex-1 sm:py-6">
                    <Eyebrow className="animate-rise opacity-0" style={{ animationDelay: '.1s' }}>
                        {t('welcome.eyebrow')}
                    </Eyebrow>

                    <h1 className="mt-4 font-display font-black uppercase italic tracking-tight">
                        <span className="text-display-hero block animate-slide-in-italic text-txt-hi opacity-0" style={{ animationDelay: '.15s' }}>
                            Hybrid
                        </span>
                        <span className="text-display-hero text-grad-coral block animate-slide-in-italic opacity-0" style={{ animationDelay: '.26s' }}>
                            Athlete
                        </span>
                    </h1>

                    <p className="mt-3 max-w-[320px] animate-rise text-sm leading-relaxed text-txt-mid opacity-0 sm:text-[14.5px]" style={{ animationDelay: '.4s' }}>
                        {t('welcome.tagline')}
                    </p>

                    <StatStrip
                        className="mt-6 animate-rise opacity-0"
                        style={{ animationDelay: '.5s' }}
                        items={[
                            { value: '12', unit: 'wk', label: t('welcome.stat.program'), accent: true },
                            { value: '5', unit: '/wk', label: t('welcome.stat.sessions') },
                            { value: 'S+E', label: t('welcome.stat.focus') },
                        ]}
                    />
                </div>

                {/* CTAs */}
                <div className="mt-auto flex animate-rise flex-col gap-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] opacity-0 sm:gap-3" style={{ animationDelay: '.6s' }}>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={onJoin}
                        icon={<UserPlus className="h-[22px] w-[22px]" />}
                        subtitle={t('welcome.join.subtitle')}
                    >
                        {t('common.createAccount')}
                    </Button>

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onLogin}
                        icon={<LogIn className="h-5 w-5" />}
                        subtitle={t('welcome.login.subtitle')}
                    >
                        {t('common.login')}
                    </Button>

                    <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-txt-lo">
                        <ShieldCheck className="h-[13px] w-[13px] text-emerald" />
                        {t('welcome.trust')}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
