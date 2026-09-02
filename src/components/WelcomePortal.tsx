import { Zap, ChevronRight, Dumbbell, Timer, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Eyebrow } from './ui';
import { cn } from '../lib/utils';
import { haptic } from '../lib/haptics';
import { itemVariants, listVariants, spring, tapSubtle } from '../design/motion';

interface WelcomePortalProps {
    onSelectTraining: () => void;
    onSignup: () => void;
    userName?: string;
}

const perks = [
    { icon: Dumbbell, key: 'welcome.training' as const },
    { icon: TrendingUp, key: 'welcome.stat.program' as const },
    { icon: Timer, key: 'welcome.stat.focus' as const },
];

export default function WelcomePortal({ onSelectTraining, userName }: WelcomePortalProps) {
    const { t } = useLanguage();
    const firstName = userName?.split(' ')[0];

    return (
        <div className="relative min-h-dvh overflow-x-hidden bg-bg font-sans text-txt-hi">
            <div className="fixed inset-0 z-0">
                <img
                    src="/images/welcome_bg.jpg"
                    alt=""
                    className="h-full w-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/90" />
                <div className="bg-app absolute inset-0 opacity-80" />
                <div className="ambient-grid pointer-events-none absolute inset-0 opacity-30" />
                <motion.div
                    className="ambient-streak pointer-events-none absolute -left-[30%] -top-[5%] h-[46%] w-[160%]"
                    animate={{ opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <motion.div
                className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-4 pb-nav-space sm:py-6 md:py-10"
                variants={listVariants}
                initial="hidden"
                animate="show"
            >
                <motion.header
                    variants={itemVariants}
                    className="mb-4 flex flex-col items-center gap-2 text-center sm:mb-6 sm:gap-3"
                >
                    <Eyebrow>
                        {firstName ? `${t('welcome.title')}, ${firstName}` : t('welcome.eyebrow')}
                    </Eyebrow>
                    <h1 className="font-display text-display-lg font-black uppercase italic tracking-tight text-txt-hi drop-shadow-2xl sm:text-display-hero">
                        {t('welcome.choosePath.line1')}{' '}
                        <span className="text-grad-coral">{t('welcome.choosePath.line2')}</span>
                    </h1>
                </motion.header>

                <motion.div variants={itemVariants} className="mx-auto w-full max-w-lg">
                    <PortalCard
                        onClick={() => {
                            haptic.light();
                            onSelectTraining();
                        }}
                        image="/images/upper_body_3.jpg"
                        title={t('welcome.training')}
                        description={t('welcome.training.description')}
                        cta={t('welcome.startWorkout')}
                    />
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mx-auto mt-4 grid w-full max-w-lg grid-cols-3 gap-2 sm:mt-5"
                >
                    {perks.map(({ icon: Icon, key }) => (
                        <motion.div
                            key={key}
                            whileHover={{ y: -2, borderColor: 'rgba(255,46,84,0.35)' }}
                            whileTap={tapSubtle}
                            transition={spring.snappy}
                            className="rounded-xl border border-hair bg-surface-1/60 px-2 py-2.5 text-center backdrop-blur-sm sm:rounded-2xl sm:py-3"
                        >
                            <Icon className="mx-auto mb-1 h-4 w-4 text-brand sm:h-5 sm:w-5" />
                            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-txt-mid sm:text-[9px]">
                                {t(key)}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.footer
                    variants={itemVariants}
                    className="mt-4 flex flex-col items-center gap-2 text-center sm:mt-6"
                >
                    <p className="line-clamp-2 text-[9px] font-bold uppercase tracking-[0.3em] text-txt-lo sm:text-[10px] sm:tracking-[0.35em]">
                        {t('welcome.tagline')}
                    </p>
                </motion.footer>
            </motion.div>
        </div>
    );
}

interface PortalCardProps {
    onClick: () => void;
    image: string;
    title: string;
    description: string;
    cta: string;
}

function PortalCard({ onClick, image, title, description, cta }: PortalCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={tapSubtle}
            transition={spring.snappy}
            className={cn(
                'group relative flex w-full flex-col overflow-hidden rounded-2xl p-3.5 text-left sm:min-h-[200px] sm:rounded-[28px] sm:p-6',
                'border border-hair bg-surface-1/20 shadow-soft backdrop-blur-sm',
                'transition-[border-color,box-shadow] duration-500 hover:border-brand/45 hover:shadow-red'
            )}
        >
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover opacity-45 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/65 to-transparent" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between gap-3 sm:gap-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hair bg-surface-1/50 text-brand shadow-soft backdrop-blur-md sm:h-14 sm:w-14 sm:rounded-2xl"
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Zap className="h-5 w-5 fill-current sm:h-7 sm:w-7" />
                    </motion.div>
                    <h3 className="font-display text-xl font-black uppercase italic leading-none tracking-tight text-txt-hi sm:text-display-md">
                        {title}
                    </h3>
                </div>

                <p className="max-w-sm text-[11px] font-medium leading-snug text-txt-mid sm:text-sm sm:leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand sm:text-xs sm:tracking-[0.25em]">
                        {cta}
                    </span>
                    <motion.span
                        className="grid h-8 w-8 place-items-center rounded-full bg-grad-red text-white shadow-red sm:h-9 sm:w-9"
                        whileHover={{ x: 3 }}
                        transition={spring.snappy}
                    >
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </motion.span>
                </div>
            </div>
        </motion.button>
    );
}
