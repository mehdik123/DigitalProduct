import { Dumbbell, Repeat, Activity } from 'lucide-react';
import { ExerciseSet } from '../types/workout';

interface SimpleWeightInputProps {
    setNumber: number;
    data: ExerciseSet;
    onChange: (field: keyof ExerciseSet, value: any) => void;
    targetReps?: string;
}

export default function SimpleWeightInput({
    setNumber,
    data,
    onChange,
    targetReps
}: SimpleWeightInputProps) {
    return (
        <div className="flex-1 flex flex-col gap-2">

            {/* Inputs Row */}
            <div className="grid grid-cols-12 gap-2">
                {/* Weight Input */}
                <div className="col-span-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 pl-1">
                        Weight
                    </label>
                    <div className="relative group/input">
                        <Dumbbell className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 group-focus-within/input:text-blue-500 transition-colors" />
                        <input
                            type="number"
                            value={data.weight || ''}
                            onChange={(e) => onChange('weight', parseFloat(e.target.value))}
                            placeholder="0"
                            className="w-full pl-7 pr-2 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-blue-500/10 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                {/* Reps Input */}
                <div className="col-span-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 pl-1">
                        Reps
                    </label>
                    <div className="relative group/input">
                        <Repeat className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 group-focus-within/input:text-purple-500 transition-colors" />
                        <input
                            type="number"
                            value={data.reps || ''}
                            onChange={(e) => onChange('reps', parseInt(e.target.value))}
                            placeholder={targetReps || "0"}
                            className="w-full pl-7 pr-2 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm font-bold focus:outline-none focus:border-purple-500 focus:bg-purple-500/10 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                {/* RPE Input */}
                <div className="col-span-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 pl-1">
                        RPE (1-10)
                    </label>
                    <div className="relative group/input">
                        <Activity className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 group-focus-within/input:text-orange-500 transition-colors" />
                        <input
                            type="number"
                            value={data.rpe || 7}
                            onChange={(e) => onChange('rpe', parseInt(e.target.value))}
                            min="1"
                            max="10"
                            className="w-full pl-7 pr-2 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-orange-500/10 focus:ring-1 focus:ring-orange-500 transition-all text-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
