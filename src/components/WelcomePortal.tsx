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
            {/* Visual Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24 flex flex-col min-h-screen">
                {/* Simplified Header */}
                <header className="flex flex-col items-center gap-6 mb-16 md:mb-24 text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,30,58,0.4)] rotate-12">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.4em] text-neutral-500">
                            {userName ? (
                                <div className="flex flex-col items-center gap-2">
                                    <span>Welcome, {userName.split(' ')[0]}</span>
                                </div>
                            ) : 'Elite Performance'}
                        </h1>
                        <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                            CHOOSE YOUR <span className="text-red-600">PATH</span>
                        </h2>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 flex-1">
                    {/* Training Option */}
                    <div
                        onClick={onSelectTraining}
                        className="group relative bg-[#09090b] rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden transition-all duration-700 hover:border-red-600/40 hover:shadow-[0_0_80px_rgba(220,30,58,0.15)] cursor-pointer active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 h-full flex flex-col justify-between space-y-12">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-red-600 shadow-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                <Zap className="w-10 h-10" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Training Program</h3>
                                <p className="text-neutral-500 text-lg md:text-xl font-medium leading-relaxed max-w-sm">Access your 8-week progressive overload system and track every drill.</p>
                            </div>

                            <div className="flex items-center gap-4 text-red-600 font-extrabold uppercase tracking-[0.3em] text-sm group-hover:gap-6 transition-all">
                                Open Program <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Option */}
                    <div
                        onClick={onSelectNutrition}
                        className="group relative bg-[#09090b] rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden transition-all duration-700 hover:border-red-600/40 hover:shadow-[0_0_80px_rgba(220,30,58,0.15)] cursor-pointer active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 h-full flex flex-col justify-between space-y-12">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-red-600/80 shadow-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                <Activity className="w-10 h-10" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Nutrition Guard</h3>
                                <p className="text-neutral-500 text-lg md:text-xl font-medium leading-relaxed max-w-sm">Calculate macros, plan meals, and optimize your hybrid biology.</p>
                            </div>

                            <div className="flex items-center gap-4 text-red-600 font-extrabold uppercase tracking-[0.3em] text-sm group-hover:gap-6 transition-all">
                                Open Nutrition <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 flex flex-col items-center gap-6 text-center">
                    <p className="text-[10px] md:text-xs font-black text-neutral-600 uppercase tracking-[0.4em]">Designed for Performance • Built for Athletes</p>
                </footer>
            </div>
        </div>
    );
}
