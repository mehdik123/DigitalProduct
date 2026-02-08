import { Dumbbell, Activity, Zap, ArrowRight } from 'lucide-react';

interface WelcomePortalProps {
    onSelectTraining: () => void;
    onSelectNutrition: () => void;
    onSignup: () => void;
    userName?: string;
}

export default function WelcomePortal({ onSelectTraining, onSelectNutrition, userName }: WelcomePortalProps) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30 font-sans overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <img
                    src="/images/welcome_bg.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-20" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-24 flex flex-col min-h-screen">
                {/* Simplified Header */}
                <header className="flex flex-col items-center gap-4 md:gap-6 mb-12 md:mb-24 text-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-red-600 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-[24deg] transition-all duration-700">
                            <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                    </div>
                    <div className="space-y-2 md:space-y-4">
                        <h1 className="text-lg md:text-2xl font-black uppercase tracking-[0.4em] text-zinc-500">
                            {userName ? (
                                <div className="flex flex-col items-center gap-2">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-zinc-500">
                                        Welcome, {userName.split(' ')[0]}
                                    </span>
                                </div>
                            ) : 'Elite Performance'}
                        </h1>
                        <h2 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
                            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">PATH</span>
                        </h2>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 flex-1 pb-20">
                    {/* Training Option */}
                    <div
                        onClick={onSelectTraining}
                        className="group relative rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-500 min-h-[300px] flex flex-col"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/upper_body_3.jpg"
                                alt="Training"
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        {/* Glass Overlay */}
                        <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm border border-white/10 rounded-[2rem] md:rounded-[2.5rem] group-hover:border-red-500/50 transition-all duration-500 z-10" />

                        <div className="relative z-20 h-full flex flex-col justify-between space-y-6 md:space-y-12">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-black/40 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center text-red-500 shadow-2xl group-hover:scale-110 group-hover:rotate-6 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all duration-500">
                                <Zap className="w-8 h-8 md:w-12 md:h-12 fill-current" />
                            </div>

                            <div className="space-y-2 md:space-y-4">
                                <h3 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter text-white group-hover:text-red-100 transition-colors drop-shadow-xl">Training Program</h3>
                                <p className="text-zinc-300 text-sm md:text-xl font-medium leading-relaxed max-w-sm drop-shadow-md">Access your 8-week progressive overload system.</p>
                            </div>

                            <div className="flex items-center gap-4 text-red-500 font-black uppercase tracking-[0.3em] text-xs md:text-sm group-hover:gap-6 group-hover:text-red-400 transition-all drop-shadow-lg">
                                Open Program <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Option */}
                    <div
                        onClick={onSelectNutrition}
                        className="group relative rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-500 min-h-[300px] flex flex-col"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/lower_body_2.jpg"
                                alt="Nutrition"
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        {/* Glass Overlay */}
                        <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm border border-white/10 rounded-[2rem] md:rounded-[2.5rem] group-hover:border-emerald-500/50 transition-all duration-500 z-10" />

                        <div className="relative z-20 h-full flex flex-col justify-between space-y-6 md:space-y-12">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-black/40 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center text-emerald-500 shadow-2xl group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-500">
                                <Activity className="w-8 h-8 md:w-12 md:h-12 fill-current" />
                            </div>

                            <div className="space-y-2 md:space-y-4">
                                <h3 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter text-white group-hover:text-emerald-100 transition-colors drop-shadow-xl">Nutrition Guard</h3>
                                <p className="text-zinc-300 text-sm md:text-xl font-medium leading-relaxed max-w-sm drop-shadow-md">Calculate macros, plan meals, and optimize.</p>
                            </div>

                            <div className="flex items-center gap-4 text-emerald-500 font-black uppercase tracking-[0.3em] text-xs md:text-sm group-hover:gap-6 group-hover:text-emerald-400 transition-all drop-shadow-lg">
                                Open Nutrition <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-8 md:mt-16 flex flex-col items-center gap-6 text-center">
                    <p className="text-[10px] md:text-xs font-black text-zinc-600 uppercase tracking-[0.4em]">Designed for Performance • Built for Athletes</p>
                </footer>
            </div>
        </div>
    );
}
