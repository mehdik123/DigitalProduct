
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Utensils, ArrowRight } from 'lucide-react';

interface WelcomePortalProps {
    onSelectTraining: () => void;
    userName?: string;
}

export default function WelcomePortal({ onSelectTraining, userName }: WelcomePortalProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl w-full">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-down">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm">
                        <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            HYBRID ATHLETE BLUEPRINT v1.1
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        Welcome{userName ? `, ${userName}` : ''}
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Choose your focus for today. Master your body through training or fuel your performance through nutrition.
                    </p>
                </div>

                {/* Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 px-4">

                    {/* Training Card */}
                    <button
                        onClick={onSelectTraining}
                        className="group relative h-[400px] rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 group-hover:border-blue-500/50 transition-colors" />

                        {/* Image/Gradient Overlay */}
                        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative h-full p-8 flex flex-col justify-between z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                <Dumbbell className="w-8 h-8" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                    Training
                                </h2>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-6">
                                    Access your 8-week progressive overload program, log workouts, and track PRs.
                                </p>

                                <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:text-white transition-colors">
                                    <span>Start Workout</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* Nutrition Card */}
                    <button
                        onClick={() => navigate('/nutrition')}
                        className="group relative h-[400px] rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 group-hover:border-green-500/50 transition-colors" />

                        {/* Image/Gradient Overlay */}
                        <div className="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative h-full p-8 flex flex-col justify-between z-10">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                                <Utensils className="w-8 h-8" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-3xl font-black text-white group-hover:translate-x-2 transition-transform duration-300">
                                        Nutrition
                                    </h2>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/20 animate-pulse">
                                        NEW
                                    </span>
                                </div>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-6">
                                    Calculate macros, plan meals, and discover healthy alternatives for your goals.
                                </p>

                                <div className="flex items-center gap-2 text-green-400 font-bold group-hover:text-white transition-colors">
                                    <span>Open Kitchen</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
}
