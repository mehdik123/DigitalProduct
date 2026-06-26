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
        <div className="relative min-h-screen overflow-hidden bg-bg font-sans text-txt-hi">
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

            <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 md:py-20">
                {/* Header */}
                <header className="mb-12 flex flex-col items-center gap-6 text-center md:mb-20">
                    <div className="animate-rise opacity-0" style={{ animationDelay: '.05s' }}>
                        <BrandMark />
                    </div>
                    <div className="flex animate-rise flex-col items-center gap-4 opacity-0" style={{ animationDelay: '.12s' }}>
                        <Eyebrow>
                            {userName ? `${t('welcome.title')}, ${userName.split(' ')[0]}` : t('welcome.eyebrow')}
                        </Eyebrow>
                        <h1 className="font-display text-5xl font-black uppercase italic leading-[.9] tracking-tight text-txt-hi drop-shadow-2xl md:text-8xl">
                            {t('welcome.choosePath.line1')}{' '}
                            <span className="text-grad-coral">{t('welcome.choosePath.line2')}</span>
                        </h1>
                    </div>
                </header>

                <div className="grid flex-1 grid-cols-1 gap-6 pb-16 md:grid-cols-2 md:gap-8">
                    <PortalCard
                        onClick={onSelectTraining}
                        image="/images/upper_body_3.jpg"
                        tone="brand"
                        icon={<Zap className="h-7 w-7 fill-current md:h-9 md:w-9" />}
                        title={t('welcome.training')}
                        description={t('welcome.training.description')}
                        cta={t('welcome.startWorkout')}
                        delay=".2s"
                    />
                    <PortalCard
                        onClick={onSelectNutrition}
                        image="/images/lower_body_2.jpg"
                        tone="emerald"
                        icon={<Activity className="h-7 w-7 fill-current md:h-9 md:w-9" />}
                        title={t('welcome.nutrition')}
                        description={t('welcome.nutrition.description')}
                        cta={t('welcome.openKitchen')}
                        delay=".3s"
                    />
                </div>

                <footer className="mt-8 flex animate-rise flex-col items-center gap-2 text-center opacity-0 md:mt-12" style={{ animationDelay: '.4s' }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-txt-lo md:text-xs">
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
                'group relative flex min-h-[300px] animate-rise flex-col overflow-hidden rounded-[28px] p-6 text-left opacity-0 md:p-10',
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

            <div className="relative z-20 flex h-full flex-col justify-between gap-8">
                <div
                    className={cn(
                        'flex h-16 w-16 items-center justify-center rounded-2xl border border-hair bg-surface-1/40 shadow-soft backdrop-blur-md transition-all duration-500 group-hover:scale-110 md:h-20 md:w-20',
                        isBrand
                            ? 'text-brand group-hover:bg-brand group-hover:text-white'
                            : 'text-emerald group-hover:bg-emerald group-hover:text-white'
                    )}
                >
                    {icon}
                </div>

                <div className="space-y-2 md:space-y-3">
                    <h3 className="font-display text-4xl font-black uppercase italic leading-none tracking-tight text-txt-hi drop-shadow-xl md:text-6xl">
                        {title}
                    </h3>
                    <p className="max-w-sm text-sm font-medium leading-relaxed text-txt-mid md:text-base">
                        {description}
                    </p>
                </div>

                <div
                    className={cn(
                        'flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] transition-all md:text-sm',
                        isBrand ? 'text-brand' : 'text-emerald'
                    )}
                >
                    {cta}
                    <ChevronRight className="h-5 w-5 transition-transform duration-300 ease-spring group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5" />
                </div>
            </div>
        </button>
    );
}
