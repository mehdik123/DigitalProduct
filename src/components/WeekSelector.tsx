import { getWeekProgression } from '../data/progressionRules';
import { Check } from 'lucide-react';

interface WeekSelectorProps {
    currentWeek: number;
    onWeekSelect: (week: number) => void;
    completedWeeks?: number[];
}

export default function WeekSelector({ currentWeek, onWeekSelect, completedWeeks = [] }: WeekSelectorProps) {
    const weeks = [1, 2, 3, 4, 5, 6, 7, 8];

    const getPhaseColor = (phase: string) => {
        switch (phase) {
            case 'Anatomical Adaptation':
                return 'from-cyan-500 to-blue-600';
            case 'Hypertrophy Focus':
                return 'from-orange-500 to-red-600';
            case 'Strength & Power':
                return 'from-purple-500 to-pink-600';
            case 'Deload':
                return 'from-green-500 to-teal-600';
            case 'Peak Performance':
                return 'from-yellow-500 to-orange-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-slate-700/50">
            <h2 className="text-xl md:text-2xl font-black text-white mb-4">Program Timeline</h2>

            <div className="grid grid-cols-4 gap-2 md:gap-3">
                {weeks.map((week) => {
                    const progression = getWeekProgression(week);
                    const isActive = week === currentWeek;
                    const isCompleted = completedWeeks.includes(week);
                    const phaseColor = getPhaseColor(progression.phase);

                    return (
                        <button
                            key={week}
                            onClick={() => onWeekSelect(week)}
                            className={`relative p-3 md:p-4 rounded-xl border-2 transition-all touch-manipulation ${isActive
                                ? `bg-gradient-to-br ${phaseColor} border-white shadow-lg scale-105`
                                : isCompleted
                                    ? 'bg-green-500/20 border-green-500/50 hover:scale-105 active:scale-95'
                                    : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 hover:scale-105 active:scale-95'
                                }`}
                        >
                            <div className="text-center">
                                <div className={`text-xl md:text-2xl font-black mb-1 ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'
                                    }`}>
                                    {week}
                                </div>
                                <div className={`text-xs font-semibold ${isActive ? 'text-white/90' : isCompleted ? 'text-green-300' : 'text-gray-500'
                                    }`}>
                                    Week
                                </div>
                                {isCompleted && (
                                    <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Current Phase Info */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-slate-900/50 rounded-xl border border-slate-600/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-bold text-white">
                        Week {currentWeek}: {getWeekProgression(currentWeek).phase}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getPhaseColor(getWeekProgression(currentWeek).phase)
                        } text-white`}>
                        RPE {getWeekProgression(currentWeek).rpeRange[0]}-{getWeekProgression(currentWeek).rpeRange[1]}
                    </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mb-3">
                    {getWeekProgression(currentWeek).description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getWeekProgression(currentWeek).goals.map((goal, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5 text-xs md:text-sm">•</span>
                            <span className="text-xs text-gray-300">{goal}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
