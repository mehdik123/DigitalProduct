import { ExerciseSet } from '../types/workout';
import { Dumbbell, Repeat } from 'lucide-react';
import Tooltip from './Tooltip';

interface SimpleWeightInputProps {
    setNumber?: number;
    data: ExerciseSet;
    onChange: (field: keyof ExerciseSet, value: any) => void;
    targetReps: string;
}

export default function SimpleWeightInput({ setNumber, data, onChange, targetReps }: SimpleWeightInputProps) {
    if (!data) return null;

    return (
        <div className="space-y-2">
            {/* Column Headers - Only show for first set */}
            {setNumber === 1 && (
                <div className="grid grid-cols-2 gap-2 px-1 mb-1">
                    <div className="flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-wider">
                            Reps
                        </span>
                        <Tooltip
                            title="Reps (Repetitions)"
                            content="The number of times you perform the movement. For example, lifting a dumbbell up and down 8 times = 8 reps."
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-wider">
                            Weight (kg)
                        </span>
                        <Tooltip
                            title="Weight"
                            content="The amount of resistance you're using. Start light to master form, then gradually increase as you get stronger."
                        />
                    </div>
                </div>
            )}

            {/* Input Row */}
            <div className="flex items-center gap-2">
                {/* Set Number Badge */}
                <div className="flex items-center gap-2 min-w-[60px]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 border border-red-500/50 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-red-900/30">
                        {data.setNumber}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Target</p>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">{targetReps}</p>
                    </div>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-2 gap-2 flex-1">
                    {/* Reps Input */}
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="e.g., 8"
                            className="w-full bg-slate-900/50 border border-white/10 px-3 py-3 rounded-xl text-white text-sm font-black outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-neutral-700 placeholder:text-xs"
                            value={data.reps || ''}
                            onChange={(e) => onChange('reps', e.target.value)}
                        />
                    </div>

                    {/* Weight Input */}
                    <div className="relative">
                        <input
                            type="number"
                            step="0.5"
                            placeholder="e.g., 20"
                            className="w-full bg-slate-900/50 border border-white/10 px-3 py-3 rounded-xl text-white text-sm font-black outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-neutral-700 placeholder:text-xs"
                            value={data.weight || ''}
                            onChange={(e) => onChange('weight', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
