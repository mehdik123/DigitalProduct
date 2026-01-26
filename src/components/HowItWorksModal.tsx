import { X, CheckCircle, Copy, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HowItWorksModalProps {
    onClose: () => void;
}

export default function HowItWorksModal({ onClose }: HowItWorksModalProps) {
    const { t } = useLanguage();

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-[200] animate-fade-in"
            onClick={onClose}
        >
            <div
                className="glass-card p-6 md:p-10 max-w-2xl w-full border-white/10 shadow-2xl relative overflow-hidden animate-slide-up text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{t('howItWorks.title')}</h3>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Protocol Sovereignty Guide</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 text-neutral-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Steps */}
                <div className="space-y-8">
                    {/* Step 1 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 font-black">
                                01
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="text-lg font-black uppercase italic tracking-tight">{t('howItWorks.step1.title')}</h4>
                            <p className="text-neutral-400 text-sm font-black uppercase tracking-tight">{t('howItWorks.step1.description')}</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 font-black">
                                02
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="text-lg font-black uppercase italic tracking-tight">{t('howItWorks.step2.title')}</h4>
                            <p className="text-neutral-400 text-sm font-black uppercase tracking-tight">{t('howItWorks.step2.description')}</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 font-black">
                                03
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="text-lg font-black uppercase italic tracking-tight">{t('howItWorks.step3.title')}</h4>
                            <p className="text-neutral-400 text-sm font-black uppercase tracking-tight">{t('howItWorks.step3.description')}</p>
                        </div>
                    </div>
                </div>

                {/* Important Note */}
                <div className="mt-10 p-5 bg-red-600/10 border border-red-600/20 rounded-2xl flex gap-4 items-start">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-300 font-black uppercase tracking-tight leading-relaxed">
                        {t('howItWorks.important')}
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="mt-10 w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                    <span>{t('howItWorks.gotIt')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    );
}
