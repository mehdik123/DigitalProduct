import { useState } from 'react';
import { Zap, Dumbbell, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Eyebrow } from './ui';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { haptic } from '../lib/haptics';
import { itemVariants, listVariants, spring, tapSubtle } from '../design/motion';

interface ProgramIntroProps {
    onStart: () => void;
    daysPerWeek?: number;
}

const INSIDE_KEYS = [
    'intro.inside.microcycles',
    'intro.inside.tracking',
    'intro.inside.videos',
    'intro.inside.records',
    'intro.inside.mobile',
    'intro.inside.fatigue',
] as const;

export default function ProgramIntro({ onStart, daysPerWeek }: ProgramIntroProps) {
    const { t } = useLanguage();
    const [activeSpec, setActiveSpec] = useState(0);

    const specs = [
        {
            icon: Dumbbell,
            title: daysPerWeek
                ? t('intro.spec.splitDays', { days: daysPerWeek })
                : t('intro.spec.split.title'),
            sub: t('intro.spec.split.sub'),
            solid: true,
        },
        {
            icon: Zap,
            title: t('intro.spec.progression.title'),
            sub: t('intro.spec.progression.sub'),
            solid: false,
        },
        {
            icon: Target,
            title: t('intro.spec.support.title'),
            sub: t('intro.spec.support.sub'),
            solid: false,
        },
    ];

    return (
        <div className="relative min-h-[calc(100dvh-var(--chrome-height))] overflow-x-hidden font-sans text-txt-hi">
            {/* Animated ambient layer */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="ambient-grid absolute inset-0 opacity-25" />
                <motion.div
                    className="ambient-streak absolute -left-[30%] -top-[5%] h-[46%] w-[160%]"
                    animate={{ opacity: [0.25, 0.5, 0.25], x: ['0%', '2%', '0%'] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -right-16 top-1/4 h-48 w-48 rounded-full bg-brand/20 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -left-10 bottom-1/4 h-36 w-36 rounded-full bg-brand/10 blur-3xl"
                    animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-var(--chrome-height))] max-w-4xl flex-col px-5 pb-nav-space pt-2 sm:px-6 sm:pt-4">
                <motion.div
                    className="flex flex-1 flex-col space-y-4 sm:space-y-8"
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* Hero */}
                    <motion.div variants={itemVariants} className="space-y-2.5 sm:space-y-4">
                        <Eyebrow>{t('intro.eyebrow')}</Eyebrow>
                        <h1 className="font-display text-display-lg font-black uppercase italic leading-none tracking-tight sm:text-display-hero">
                            {t('intro.headline.line1')}{' '}
                            <motion.span
                                className="inline-block text-grad-coral"
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {t('intro.headline.accent')}
                            </motion.span>{' '}
                            {t('intro.headline.line2')}
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-txt-mid sm:text-base md:text-lg">
                            {t('intro.tagline')}
                        </p>
                    </motion.div>

                    {/* Interactive spec cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 sm:gap-3">
                        {specs.map(({ icon: Icon, title, sub, solid }, index) => {
                            const active = activeSpec === index;
                            return (
                                <motion.button
                                    key={title}
                                    type="button"
                                    onClick={() => {
                                        haptic.light();
                                        setActiveSpec(index);
                                    }}
                                    whileHover={{ y: -4, scale: 1.03 }}
                                    whileTap={tapSubtle}
                                    transition={spring.snappy}
                                    className="text-left"
                                >
                                    <Card
                                        interactive
                                        className={cn(
                                            'relative h-full space-y-2 overflow-hidden transition-all duration-300 sm:space-y-3',
                                            active && 'border-brand/50 shadow-red ring-1 ring-brand/30'
                                        )}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="spec-glow"
                                                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent"
                                                transition={spring.smooth}
                                            />
                                        )}
                                        <div
                                            className={cn(
                                                'relative flex h-8 w-8 items-center justify-center rounded-lg transition-transform sm:h-11 sm:w-11 sm:rounded-xl',
                                                solid || active
                                                    ? 'bg-grad-red text-white shadow-red'
                                                    : 'border border-hair bg-surface-3 text-brand'
                                            )}
                                        >
                                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="relative">
                                            <h3 className="font-display text-[11px] font-extrabold uppercase italic leading-tight tracking-tight sm:text-base">
                                                {title}
                                            </h3>
                                            <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-txt-lo sm:text-[10px]">
                                                {sub}
                                            </p>
                                        </div>
                                    </Card>
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {/* What's inside — staggered checklist */}
                    <motion.div variants={itemVariants}>
                        <Card className="relative space-y-3 overflow-hidden p-4 sm:space-y-6 sm:p-7">
                            <motion.div
                                className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-soft blur-3xl"
                                animate={{ opacity: [0.4, 0.7, 0.4] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <h2 className="relative font-display text-base font-black uppercase italic tracking-tight sm:text-xl">
                                {t('intro.inside.title')}
                            </h2>
                            <motion.div
                                className="relative grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2"
                                variants={listVariants}
                                initial="hidden"
                                animate="show"
                            >
                                {INSIDE_KEYS.map((key, i) => (
                                    <motion.div
                                        key={key}
                                        variants={itemVariants}
                                        custom={i}
                                        whileHover={{ x: 4 }}
                                        className="group flex items-center gap-2.5 rounded-xl border border-transparent px-1 py-1 transition-colors hover:border-hair hover:bg-white/[0.03] sm:gap-3"
                                    >
                                        <motion.div
                                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft sm:h-6 sm:w-6"
                                            whileHover={{ scale: 1.15, backgroundColor: 'var(--color-brand)' }}
                                            transition={spring.snappy}
                                        >
                                            <CheckCircle2 className="h-3 w-3 text-brand group-hover:text-white sm:h-3.5 sm:w-3.5" />
                                        </motion.div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-txt-mid transition-colors group-hover:text-txt-hi sm:text-[10px] sm:tracking-[0.18em]">
                                            {t(key)}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Card>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="mt-auto flex justify-center pt-1">
                        <motion.div
                            className="w-full md:w-auto"
                            whileHover={{ scale: 1.02 }}
                            whileTap={tapSubtle}
                            transition={spring.snappy}
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => {
                                    haptic.medium();
                                    onStart();
                                }}
                                className="relative overflow-hidden px-10 tracking-[0.25em] md:min-w-[20rem]"
                            >
                                <motion.span
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ['-120%', '120%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                                />
                                <span className="relative flex items-center justify-center gap-2">
                                    {t('intro.accessProgram')}
                                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                                </span>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
