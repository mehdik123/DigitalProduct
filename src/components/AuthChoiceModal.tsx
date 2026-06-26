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
            className="bg-hero fixed inset-0 z-[150] overflow-hidden"
        >
            {/* Ambient grid + diagonal speed streak (the brand signature). */}
            <div className="ambient-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="ambient-streak pointer-events-none absolute -left-[30%] -top-[10%] h-[46%] w-[160%]" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-md flex-col px-6 pb-8 pt-6">
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
                <div className="flex flex-1 flex-col justify-center py-6">
                    <Eyebrow className="animate-rise opacity-0" style={{ animationDelay: '.1s' }}>
                        {t('welcome.eyebrow')}
                    </Eyebrow>

                    <h1 className="mt-5 font-display text-[64px] font-black uppercase italic leading-[.86] tracking-tight sm:text-[72px]">
                        <span className="block animate-slide-in-italic text-txt-hi opacity-0" style={{ animationDelay: '.15s' }}>
                            Hybrid
                        </span>
                        <span className="text-grad-coral block animate-slide-in-italic opacity-0" style={{ animationDelay: '.26s' }}>
                            Athlete
                        </span>
                    </h1>

                    <p className="mt-4 max-w-[300px] animate-rise text-[14.5px] leading-relaxed text-txt-mid opacity-0" style={{ animationDelay: '.4s' }}>
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
                <div className="flex animate-rise flex-col gap-3 opacity-0" style={{ animationDelay: '.6s' }}>
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
