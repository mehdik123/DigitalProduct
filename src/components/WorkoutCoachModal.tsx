import { X, Dumbbell, ClipboardList, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, IconButton } from './ui';
import { celebrateVariants } from '../design/motion';
import { markWorkoutCoachSeen } from '../lib/onboarding';

interface WorkoutCoachModalProps {
    onClose: () => void;
}

const STEPS = [
    { icon: Dumbbell, titleKey: 'coach.step1.title', descKey: 'coach.step1.desc' },
    { icon: ClipboardList, titleKey: 'coach.step2.title', descKey: 'coach.step2.desc' },
    { icon: Unlock, titleKey: 'coach.step3.title', descKey: 'coach.step3.desc' },
] as const;

export default function WorkoutCoachModal({ onClose }: WorkoutCoachModalProps) {
    const { t } = useLanguage();

    const dismiss = () => {
        markWorkoutCoachSeen();
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-end justify-center bg-black/75 p-3 backdrop-blur-xl sm:items-center sm:p-6"
            onClick={dismiss}
        >
            <motion.div
                variants={celebrateVariants}
                initial="hidden"
                animate="show"
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface-1 p-5 shadow-soft sm:p-6"
            >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/20 blur-3xl" />

                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-brand">
                            {t('coach.subtitle')}
                        </p>
                        <h2 className="mt-1 font-display text-2xl font-black uppercase italic leading-none tracking-tight text-txt-hi">
                            {t('coach.title')}
                        </h2>
                    </div>
                    <IconButton aria-label="close" onClick={dismiss}>
                        <X className="h-4 w-4" />
                    </IconButton>
                </div>

                <div className="space-y-2.5">
                    {STEPS.map(({ icon: Icon, titleKey, descKey }, i) => (
                        <motion.div
                            key={titleKey}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 * i }}
                            className="flex items-start gap-3 rounded-2xl border border-white/8 bg-surface-2/60 p-3"
                        >
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-grad-red text-white shadow-red">
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 pt-0.5">
                                <p className="text-[11px] font-black uppercase tracking-wide text-txt-hi">
                                    {i + 1}. {t(titleKey)}
                                </p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-txt-mid">{t(descKey)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p className="mt-3 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-[10px] leading-relaxed text-txt-mid">
                    {t('coach.tip')}
                </p>

                <Button variant="primary" size="lg" fullWidth arrow onClick={dismiss} className="mt-4 tracking-[0.15em]">
                    {t('coach.start')}
                </Button>
            </motion.div>
        </motion.div>
    );
}
