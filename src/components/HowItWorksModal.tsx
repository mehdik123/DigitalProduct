import { X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, IconButton } from './ui';
import { celebrateVariants } from '../design/motion';

interface HowItWorksModalProps {
    onClose: () => void;
}

export default function HowItWorksModal({ onClose }: HowItWorksModalProps) {
    const { t } = useLanguage();

    const steps = [
        { n: '01', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.description') },
        { n: '02', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.description') },
        { n: '03', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.description') },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-6 backdrop-blur-2xl"
            onClick={onClose}
        >
            <div className="ambient-grid pointer-events-none absolute inset-0 opacity-25" />

            <motion.div
                variants={celebrateVariants}
                initial="hidden"
                animate="show"
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-hair bg-surface-1 p-6 shadow-soft md:p-9"
            >
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-soft blur-3xl" />

                {/* Header */}
                <div className="mb-9 flex items-start justify-between">
                    <div className="space-y-1">
                        <h3 className="font-display text-3xl font-black uppercase italic leading-none tracking-tight text-txt-hi">
                            {t('howItWorks.title')}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-txt-lo">
                            Protocol Sovereignty Guide
                        </p>
                    </div>
                    <IconButton aria-label="close" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </IconButton>
                </div>

                {/* Steps */}
                <div className="space-y-7">
                    {steps.map((step) => (
                        <div key={step.n} className="flex gap-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-hair bg-surface-3 font-stat font-bold text-brand">
                                {step.n}
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="font-display text-lg font-extrabold uppercase italic tracking-tight text-txt-hi">
                                    {step.title}
                                </h4>
                                <p className="text-sm font-medium leading-relaxed text-txt-mid">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Important note */}
                <div className="mt-9 flex items-start gap-4 rounded-2xl border border-brand/20 bg-brand-soft p-5">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <p className="text-xs font-medium leading-relaxed text-txt-mid">
                        {t('howItWorks.important')}
                    </p>
                </div>

                {/* Action */}
                <Button variant="primary" size="lg" arrow fullWidth onClick={onClose} className="mt-9 tracking-[0.2em]">
                    {t('howItWorks.gotIt')}
                </Button>
            </motion.div>
        </motion.div>
    );
}
