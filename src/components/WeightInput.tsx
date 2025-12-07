import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Dumbbell, Repeat, Activity, Check, Trophy } from 'lucide-react';
import { ExerciseSet } from '../types/workout';

interface WeightInputProps {
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    previousWeight?: number;
    previousReps?: number;
    onSave: (setData: ExerciseSet) => Promise<void>;
    targetReps: string;
    isPersonalRecord?: boolean;
}

export default function WeightInput({
    setNumber,
    previousWeight,
    previousReps,
    onSave,
    targetReps,
    isPersonalRecord = false
}: WeightInputProps) {
    const [weight, setWeight] = useState<number>(previousWeight || 0);
    const [reps, setReps] = useState<number>(0);
    const [rpe, setRpe] = useState<number>(7);
    const [completed, setCompleted] = useState(false);
    const [saving, setSaving] = useState(false);

    // Auto-save when values change and set is marked complete
    useEffect(() => {
        if (completed && weight > 0 && reps > 0) {
            handleSave();
        }
    }, [completed, weight, reps, rpe]);

    const handleSave = async () => {
        if (!completed || weight <= 0 || reps <= 0) return;

        setSaving(true);
        try {
            await onSave({
                setNumber,
                reps,
                weight,
                rpe,
                completed
            });
        } catch (error) {
            console.error('Error saving set:', error);
        } finally {
            setSaving(false);
        }
    };

    // Calculate progress indicator
    const getProgressIndicator = () => {
        if (!previousWeight || !completed) return null;

        const weightDiff = weight - previousWeight;
        const repsDiff = previousReps ? reps - previousReps : 0;

        if (weightDiff > 0 || (weightDiff === 0 && repsDiff > 0)) {
            return (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {weightDiff > 0 && `+${weightDiff.toFixed(1)} lbs`}
                    {weightDiff === 0 && repsDiff > 0 && `+${repsDiff} reps`}
                </div>
            );
        } else if (weightDiff < 0 || (weightDiff === 0 && repsDiff < 0)) {
            return (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {weightDiff < 0 && `${weightDiff.toFixed(1)} lbs`}
                    {weightDiff === 0 && repsDiff < 0 && `${repsDiff} reps`}
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                    <Minus className="w-3.5 h-3.5" />
                    Same
                </div>
            );
        }
    };

    return (
        <div
            className={`relative group transition-all duration-300 rounded-2xl border ${completed
                ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                } ${isPersonalRecord ? 'ring-1 ring-amber-500/50 shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)]' : ''}`}
        >
            {/* Header Section */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm transition-colors ${completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                        {setNumber}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold transition-colors ${completed ? 'text-emerald-400' : 'text-slate-200'}`}>
                            Set {setNumber}
                        </span>
                        {isPersonalRecord && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                                <Trophy className="w-3 h-3" /> New PR
                            </span>
                        )}
                    </div>
                </div>
                {getProgressIndicator()}
            </div>

            {/* Inputs Section */}
            <div className="p-4 grid grid-cols-12 gap-3">
                {/* Weight Input */}
                <div className="col-span-5 relative group/input">
                    <label className="absolute -top-2 left-2 px-1 bg-slate-950 text-[10px] font-bold text-slate-500 uppercase tracking-wider z-10 group-focus-within/input:text-blue-400 transition-colors">
                        Weight
                    </label>
                    <div className="relative">
                        <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
                        <input
                            type="number"
                            value={weight || ''}
                            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                            step="2.5"
                            min="0"
                            className="w-full pl-9 pr-3 py-3 bg-black/20 border border-slate-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                            placeholder="0"
                        />
                    </div>
                    {previousWeight && (
                        <div className="absolute -bottom-5 left-1 text-[10px] text-slate-500 font-medium">
                            Last: <span className="text-slate-400">{previousWeight}lbs</span>
                        </div>
                    )}
                </div>

                {/* Reps Input */}
                <div className="col-span-4 relative group/input">
                    <label className="absolute -top-2 left-2 px-1 bg-slate-950 text-[10px] font-bold text-slate-500 uppercase tracking-wider z-10 group-focus-within/input:text-purple-400 transition-colors">
                        Reps
                    </label>
                    <div className="relative">
                        <Repeat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-purple-500 transition-colors" />
                        <input
                            type="number"
                            value={reps || ''}
                            onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                            min="0"
                            className="w-full pl-9 pr-3 py-3 bg-black/20 border border-slate-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-700"
                            placeholder="0"
                        />
                    </div>
                    <div className="absolute -bottom-5 left-1 text-[10px] text-slate-500 font-medium">
                        Target: <span className="text-slate-400">{targetReps}</span>
                    </div>
                </div>

                {/* RPE Input */}
                <div className="col-span-3 relative group/input">
                    <label className="absolute -top-2 left-2 px-1 bg-slate-950 text-[10px] font-bold text-slate-500 uppercase tracking-wider z-10 group-focus-within/input:text-orange-400 transition-colors">
                        RPE
                    </label>
                    <div className="relative">
                        <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-orange-500 transition-colors" />
                        <input
                            type="number"
                            value={rpe}
                            onChange={(e) => setRpe(parseInt(e.target.value) || 7)}
                            min="1"
                            max="10"
                            className="w-full pl-9 pr-2 py-3 bg-black/20 border border-slate-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-orange-500/50 focus:bg-orange-500/5 focus:ring-1 focus:ring-orange-500/50 transition-all text-center"
                        />
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="p-3 pt-0 mt-4">
                <button
                    onClick={() => setCompleted(!completed)}
                    className={`w-full relative overflow-hidden group/btn flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${completed
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                >
                    {completed ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>{saving ? 'Saving...' : 'Set Completed'}</span>
                        </>
                    ) : (
                        <>
                            <span className="opacity-0 group-hover/btn:opacity-100 absolute left-4 transition-opacity">
                                <Check className="w-4 h-4" />
                            </span>
                            <span>Log Set</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
