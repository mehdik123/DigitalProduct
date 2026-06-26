import { ArrowLeft, Zap, Dumbbell, Target, CheckCircle2 } from 'lucide-react';
import { Button, Card, Eyebrow } from './ui';
import { cn } from '../lib/utils';

interface ProgramIntroProps {
    onBack: () => void;
    onStart: () => void;
}

const SPECS = [
    { icon: Dumbbell, title: '5-Day Split', sub: 'Optimized Frequency', solid: true },
    { icon: Zap, title: 'Progression', sub: 'Scientific Overload', solid: false },
    { icon: Target, title: 'Full Support', sub: 'Video Drill Guides', solid: false },
];

const INSIDE = [
    'Advanced 12-Week Microcycles',
    'Weight Tracking & Logging',
    'Exercise Video Demonstrations',
    'Personal Record Dashboard',
    'Mobile-First Interaction',
    'Progressive Fatigue Management',
];

export default function ProgramIntro({ onBack, onStart }: ProgramIntroProps) {
    return (
        <div className="bg-app relative min-h-screen overflow-hidden font-sans text-txt-hi">
            <div className="ambient-grid pointer-events-none fixed inset-0 opacity-30" />
            <div className="ambient-streak pointer-events-none fixed -left-[30%] -top-[5%] h-[46%] w-[160%]" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12 md:py-16">
                <button
                    onClick={onBack}
                    className="group mb-12 flex items-center gap-3 self-start text-txt-lo transition-colors hover:text-txt-hi"
                >
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Back to Portal</span>
                </button>

                <div className="space-y-12 pb-32">
                    {/* Hero */}
                    <div className="animate-rise space-y-5 opacity-0" style={{ animationDelay: '.05s' }}>
                        <Eyebrow>Hybrid Training System</Eyebrow>
                        <h1 className="font-display text-5xl font-black uppercase italic leading-none tracking-tight md:text-8xl">
                            12-Week <span className="text-grad-coral">Elite</span> Program
                        </h1>
                        <p className="max-w-2xl text-lg font-medium leading-relaxed text-txt-mid md:text-xl">
                            A high-performance progressive overload system designed to build functional power,
                            elite aesthetics, and hybrid work capacity.
                        </p>
                    </div>

                    {/* Specifications */}
                    <div className="grid animate-rise grid-cols-1 gap-4 opacity-0 md:grid-cols-3" style={{ animationDelay: '.15s' }}>
                        {SPECS.map(({ icon: Icon, title, sub, solid }) => (
                            <Card key={title} interactive className="group space-y-4">
                                <div
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                                        solid
                                            ? 'bg-grad-red text-white shadow-red'
                                            : 'border border-hair bg-surface-3 text-brand'
                                    )}
                                >
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-extrabold uppercase italic tracking-tight">
                                        {title}
                                    </h3>
                                    <p className="text-xs font-bold uppercase tracking-wider text-txt-lo">{sub}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* What's Inside */}
                    <div className="animate-rise opacity-0" style={{ animationDelay: '.25s' }}>
                        <Card className="relative space-y-8 overflow-hidden p-8 md:p-10">
                            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-soft blur-3xl" />
                            <h2 className="font-display text-2xl font-black uppercase italic tracking-tight">
                                The Athlete Experience
                            </h2>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {INSIDE.map((item) => (
                                    <div key={item} className="group flex items-center gap-4">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft transition-colors group-hover:bg-brand">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-brand group-hover:text-white" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-txt-mid transition-colors group-hover:text-txt-hi">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Action */}
                    <div className="flex animate-rise justify-center pt-6 opacity-0" style={{ animationDelay: '.35s' }}>
                        <Button variant="primary" size="lg" arrow onClick={onStart} className="w-full px-12 md:w-auto">
                            <span className="tracking-[0.3em]">Access Program</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
