import { Activity, Zap, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BrandMark, Eyebrow } from './ui';
import { cn } from '../lib/utils';

interface WelcomePortalProps {
    onSelectTraining: () => void;
    onSelectNutrition: () => void;
    onSignup: () => void;
    userName?: string;
}

export default function WelcomePortal({ onSelectTraining, onSelectNutrition, userName }: WelcomePortalProps) {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-dvh overflow-x-hidden bg-bg font-sans text-txt-hi">
            {/* Background image + layered dark / red ambient. */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/images/welcome_bg.jpg"
                    alt=""
                    className="h-full w-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/90" />
                <div className="bg-app absolute inset-0 opacity-80" />
                <div className="ambient-grid pointer-events-none absolute inset-0 opacity-30" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-4 pb-5 sm:py-7 md:py-16">
                {/* Header */}
                <header className="mb-4 flex flex-col items-center gap-2 text-center sm:mb-8 sm:gap-4 md:mb-14">
                    <div className="animate-rise opacity-0" style={{ animationDelay: '.05s' }}>
                        <BrandMark />
                    </div>
                    <div className="flex animate-rise flex-col items-center gap-2 opacity-0 sm:gap-4" style={{ animationDelay: '.12s' }}>
                        <Eyebrow>
                            {userName ? `${t('welcome.title')}, ${userName.split(' ')[0]}` : t('welcome.eyebrow')}
                        </Eyebrow>
                        <h1 className="font-display text-display-lg font-black uppercase italic tracking-tight text-txt-hi drop-shadow-2xl sm:text-display-hero">
                            {t('welcome.choosePath.line1')}{' '}
                            <span className="text-grad-coral">{t('welcome.choosePath.line2')}</span>
                        </h1>
                    </div>
                </header>

                {/* No flex-1 on mobile: stretching the rows is what made these cards huge. */}
                <div className="grid grid-cols-1 content-start gap-3 pb-2 sm:flex-1 sm:gap-6 sm:pb-4 md:grid-cols-2 md:gap-8">
                    <PortalCard
                        onClick={onSelectTraining}
                        image="/images/upper_body_3.jpg"
                        tone="brand"
                        icon={<Zap className="h-5 w-5 fill-current sm:h-7 sm:w-7 md:h-9 md:w-9" />}
                        title={t('welcome.training')}
                        description={t('welcome.training.description')}
                        cta={t('welcome.startWorkout')}
                        delay=".2s"
                    />
                    <PortalCard
                        onClick={onSelectNutrition}
                        image="/images/lower_body_2.jpg"
                        tone="emerald"
                        icon={<Activity className="h-5 w-5 fill-current sm:h-7 sm:w-7 md:h-9 md:w-9" />}
                        title={t('welcome.nutrition')}
                        description={t('welcome.nutrition.description')}
                        cta={t('welcome.openKitchen')}
                        delay=".3s"
                    />
                </div>

                <footer className="mt-3 flex animate-rise flex-col items-center gap-2 text-center opacity-0 sm:mt-6 md:mt-10" style={{ animationDelay: '.4s' }}>
                    <p className="line-clamp-2 text-[9px] font-bold uppercase tracking-[0.3em] text-txt-lo sm:text-[10px] sm:tracking-[0.4em] md:text-xs">
                        {t('welcome.tagline')}
                    </p>
                </footer>
            </div>
        </div>
    );
}

interface PortalCardProps {
    onClick: () => void;
    image: string;
    tone: 'brand' | 'emerald';
    icon: React.ReactNode;
    title: string;
    description: string;
    cta: string;
    delay: string;
}

function PortalCard({ onClick, image, tone, icon, title, description, cta, delay }: PortalCardProps) {
    const isBrand = tone === 'brand';
    return (
        <button
            onClick={onClick}
            style={{ animationDelay: delay }}
            className={cn(
                'group relative flex animate-rise flex-col overflow-hidden rounded-2xl p-3.5 text-left opacity-0 sm:min-h-[240px] sm:rounded-[28px] sm:p-6 md:p-10',
                'press transition-[border-color] duration-500'
            )}
        >
            {/* Image + gradient */}
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
            </div>

            {/* Glass border */}
            <div
                className={cn(
                    'absolute inset-0 z-10 rounded-[28px] border bg-surface-1/20 backdrop-blur-sm transition-colors duration-500',
                    isBrand ? 'border-hair group-hover:border-brand/50' : 'border-hair group-hover:border-emerald/50'
                )}
            />

            <div className="relative z-20 flex h-full flex-col justify-between gap-2.5 sm:gap-8">
                {/* Mobile: icon and title share a row to save vertical space. */}
                <div className="flex items-center gap-3 sm:block">
                    <div
                        className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hair bg-surface-1/40 shadow-soft backdrop-blur-md transition-all duration-500 group-hover:scale-110 sm:h-16 sm:w-16 sm:rounded-2xl md:h-20 md:w-20',
                            isBrand
                                ? 'text-brand group-hover:bg-brand group-hover:text-white'
                                : 'text-emerald group-hover:bg-emerald group-hover:text-white'
                        )}
                    >
                        {icon}
                    </div>
                    <h3 className="font-display text-2xl font-black uppercase italic leading-none tracking-tight text-txt-hi drop-shadow-xl sm:hidden">
                        {title}
                    </h3>
                </div>

                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                    <h3 className="hidden font-display text-display-lg font-black uppercase italic leading-none tracking-tight text-txt-hi drop-shadow-xl sm:block">
                        {title}
                    </h3>
                    <p className="line-clamp-2 max-w-sm text-[11px] font-medium leading-snug text-txt-mid sm:line-clamp-none sm:text-sm sm:leading-relaxed md:text-base">
                        {description}
                    </p>
                </div>

                <div
                    className={cn(
                        'flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all sm:gap-3 sm:text-xs sm:tracking-[0.3em] md:text-sm',
                        isBrand ? 'text-brand' : 'text-emerald'
                    )}
                >
                    {cta}
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5 sm:h-5 sm:w-5" />
                </div>
            </div>
        </button>
    );
}
