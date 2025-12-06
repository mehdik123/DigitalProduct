import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
                <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    {weightDiff > 0 && `+${weightDiff.toFixed(1)} lbs`}
                    {weightDiff === 0 && repsDiff > 0 && `+${repsDiff} reps`}
                </div>
            );
        } else if (weightDiff < 0 || (weightDiff === 0 && repsDiff < 0)) {
            return (
                <div className="flex items-center gap-1 text-orange-400 text-xs font-semibold">
                    <TrendingDown className="w-3 h-3" />
                    {weightDiff < 0 && `${weightDiff.toFixed(1)} lbs`}
                    {weightDiff === 0 && repsDiff < 0 && `${repsDiff} reps`}
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                    <Minus className="w-3 h-3" />
                    Same
                </div>
            );
        }
    };

    return (
        <div className={`p-4 rounded-xl border-2 transition-all ${completed
            ? 'bg-green-500/10 border-green-500/50'
            : 'bg-slate-800/30 border-slate-700/50'
            } ${isPersonalRecord ? 'ring-2 ring-yellow-500/50' : ''}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Set {setNumber}</span>
                    {isPersonalRecord && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">
                            🏆 PR!
                        </span>
                    )}
                </div>
                {getProgressIndicator()}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Weight Input */}
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Weight (lbs)
                    </label>
                    <input
                        type="number"
                        value={weight || ''}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        step="2.5"
                        min="0"
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                    />
                    {previousWeight && (
                        <p className="text-xs text-gray-500 mt-1">
                            Last: {previousWeight} lbs
                        </p>
                    )}
                </div>

                {/* Reps Input */}
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Reps
                    </label>
                    <input
                        type="number"
                        value={reps || ''}
                        onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Target: {targetReps}
                    </p>
                </div>

                {/* RPE Input */}
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                        RPE
                    </label>
                    <input
                        type="number"
                        value={rpe}
                        onChange={(e) => setRpe(parseInt(e.target.value) || 7)}
                        min="1"
                        max="10"
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        1-10
                    </p>
                </div>
            </div>

            {/* Complete Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-900/50 checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500 cursor-pointer transition-all"
                />
                <span className="text-sm font-semibold text-gray-300">
                    {completed ? (saving ? 'Saving...' : 'Completed ✓') : 'Mark as complete'}
                </span>
            </label>
        </div>
    );
}
