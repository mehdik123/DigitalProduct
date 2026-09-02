import { ArrowLeft, Zap, Dumbbell, Target, CheckCircle2 } from 'lucide-react';
import { Button, Card, Eyebrow } from './ui';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface ProgramIntroProps {
    onBack: () => void;
    onStart: () => void;
    /** The user's chosen training frequency; omitted before a choice is made. */
    daysPerWeek?: number;
}

const INSIDE_KEYS = [
    'intro.inside.microcycles',
    'intro.inside.tracking',
    'intro.inside.videos',
    'intro.inside.records',
    'intro.inside.mobile',
    'intro.inside.fatigue',
];

export default function ProgramIntro({ onBack, onStart, daysPerWeek }: ProgramIntroProps) {
    const { t } = useLanguage();

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
        <div className="bg-app relative min-h-dvh overflow-x-hidden font-sans text-txt-hi">
            <div className="ambient-grid pointer-events-none fixed inset-0 opacity-30" />
            <div className="ambient-streak pointer-events-none fixed -left-[30%] -top-[5%] h-[46%] w-[160%]" />

            {/* Use pt-* only: a py-* utility would also set padding-bottom and cancel pb-nav-space. */}
            <div className="relative z-10 mx-auto flex min-h-dvh max-w-4xl flex-col px-5 pt-6 pb-nav-space sm:px-6 sm:pt-12 md:pt-16">
                <button
                    onClick={onBack}
                    className="group mb-4 flex items-center gap-2 self-start text-txt-lo transition-colors hover:text-txt-hi sm:mb-12 sm:gap-3"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 sm:h-5 sm:w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] sm:text-xs">{t('intro.backToPortal')}</span>
                </button>

                <div className="space-y-4 sm:space-y-12">
                    {/* Hero */}
                    <div className="animate-rise space-y-2.5 opacity-0 sm:space-y-5" style={{ animationDelay: '.05s' }}>
                        <Eyebrow>{t('intro.eyebrow')}</Eyebrow>
                        <h1 className="font-display text-display-lg font-black uppercase italic leading-none tracking-tight sm:text-display-hero">
                            {t('intro.headline.line1')}{' '}
                            <span className="text-grad-coral">{t('intro.headline.accent')}</span>{' '}
                            {t('intro.headline.line2')}
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-txt-mid sm:text-lg md:text-xl">
                            {t('intro.tagline')}
                        </p>
                    </div>

                    {/* Specifications */}
                    <div className="grid animate-rise grid-cols-3 gap-2 opacity-0 sm:gap-4 md:grid-cols-3" style={{ animationDelay: '.15s' }}>
                        {specs.map(({ icon: Icon, title, sub, solid }) => (
                            <Card key={title} interactive className="group space-y-2 sm:space-y-4">
                                <div
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-xl',
                                        solid
                                            ? 'bg-grad-red text-white shadow-red'
                                            : 'border border-hair bg-surface-3 text-brand'
                                    )}
                                >
                                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <h3 className="font-display text-sm font-extrabold uppercase italic leading-tight tracking-tight sm:text-xl">
                                        {title}
                                    </h3>
                                    <p className="text-[8px] font-bold uppercase tracking-wider text-txt-lo sm:text-xs">{sub}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* What's Inside */}
                    <div className="animate-rise opacity-0" style={{ animationDelay: '.25s' }}>
                        <Card className="relative space-y-3 overflow-hidden p-4 sm:space-y-8 sm:p-8 md:p-10">
                            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-soft blur-3xl" />
                            <h2 className="font-display text-base font-black uppercase italic tracking-tight sm:text-2xl">
                                {t('intro.inside.title')}
                            </h2>
                            <div className="grid grid-cols-1 gap-2 sm:gap-5 md:grid-cols-2">
                                {INSIDE_KEYS.map((key) => (
                                    <div key={key} className="group flex items-center gap-2.5 sm:gap-4">
                                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-soft transition-colors group-hover:bg-brand sm:h-6 sm:w-6">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-brand group-hover:text-white sm:h-3.5 sm:w-3.5" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-txt-mid transition-colors group-hover:text-txt-hi sm:text-[11px] sm:tracking-[0.2em]">
                                            {t(key)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Action */}
                    <div className="flex animate-rise justify-center opacity-0" style={{ animationDelay: '.35s' }}>
                        <Button variant="primary" size="lg" arrow onClick={onStart} className="w-full px-12 md:w-auto">
                            <span className="tracking-[0.3em]">{t('intro.accessProgram')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
