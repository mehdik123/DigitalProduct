import { X, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, IconButton } from './ui';
import { celebrateVariants } from '../design/motion';

interface LockedWeekModalProps {
    week: number;
    onClose: () => void;
}

export default function LockedWeekModal({ week, onClose }: LockedWeekModalProps) {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-end justify-center bg-black/75 p-3 backdrop-blur-xl sm:items-center sm:p-6"
            onClick={onClose}
        >
            <motion.div
                variants={celebrateVariants}
                initial="hidden"
                animate="show"
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface-1 p-5 shadow-soft"
            >
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
                            <Lock className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-display text-xl font-black uppercase italic leading-none text-txt-hi">
                                {t('week.locked.title')}
                            </h2>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-txt-lo">
                                {t('week.label')} {week}
                            </p>
                        </div>
                    </div>
                    <IconButton aria-label="close" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </IconButton>
                </div>

                <p className="text-sm leading-relaxed text-txt-mid">{t('week.locked.message')}</p>
                <p className="mt-2 text-xs leading-relaxed text-txt-lo">{t('week.lockedNotice')}</p>

                <Button variant="primary" size="lg" fullWidth onClick={onClose} className="mt-4 tracking-[0.15em]">
                    {t('common.gotIt')}
                </Button>
            </motion.div>
        </motion.div>
    );
}
