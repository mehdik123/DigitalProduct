import { ArrowLeft, Zap, Dumbbell, Target, CheckCircle2, ChevronRight } from 'lucide-react';

interface ProgramIntroProps {
    onBack: () => void;
    onStart: () => void;
}

export default function ProgramIntro({ onBack, onStart }: ProgramIntroProps) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30 font-sans overflow-hidden">
            {/* Visual Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen">
                {/* Navigation */}
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 text-neutral-500 hover:text-white transition-all mb-12 self-start"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Back to Portal</span>
                </button>

                <div className="space-y-12 animate-slide-up pb-32">
                    {/* Hero Section */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            Hybrid Training System
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                            8-WEEK <span className="text-red-600">ELITE</span> PROGRAM
                        </h1>
                        <p className="text-lg md:text-2xl text-neutral-400 font-medium leading-relaxed max-w-2xl">
                            A high-performance progressive overload system designed to build functional power, elite aesthetics, and hybrid work capacity.
                        </p>
                    </div>

                    {/* Program Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-red-600/30 transition-all group">
                            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">5-Day Split</h3>
                                <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Optimized Frequency</p>
                            </div>
                        </div>
                        <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-red-600/30 transition-all group">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Progression</h3>
                                <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Scientific Overload</p>
                            </div>
                        </div>
                        <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-red-600/30 transition-all group">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Full Support</h3>
                                <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Video Drill Guides</p>
                            </div>
                        </div>
                    </div>

                    {/* What's Inside */}
                    <div className="space-y-8 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl" />
                        <h2 className="text-2xl font-black uppercase italic tracking-tight">The Athlete Experience</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Advanced 8-Week Microcycles",
                                "Weight Tracking & Logging",
                                "Exercise Video Demonstrations",
                                "Personal Record Dashboard",
                                "Mobile-First Interaction",
                                "Progressive Fatigue Management"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-10 flex flex-col items-center gap-8">
                        <button
                            onClick={onStart}
                            className="group relative w-full md:w-auto px-16 py-8 bg-red-600 text-white rounded-[2rem] shadow-[0_0_50px_rgba(220,30,58,0.4)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                <span className="text-sm font-black uppercase tracking-[0.4em]">Access Program</span>
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
