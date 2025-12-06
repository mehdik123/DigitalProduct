import { useState, useEffect } from 'react';

interface SimpleWeightInputProps {
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    userData: any;
    weekNumber: number;
    workoutDayId: number;
    onDataChange?: () => void;
}

export default function SimpleWeightInput({
    exerciseId,
    setNumber,
    userData,
    weekNumber,
    workoutDayId,
    onDataChange
}: SimpleWeightInputProps) {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [completed, setCompleted] = useState(false);

    // Load saved data from temporary localStorage
    useEffect(() => {
        if (userData) {
            const logKey = `workout_${workoutDayId}-${weekNumber}-${exerciseId}-${setNumber}`;
            const saved = localStorage.getItem(logKey);
            if (saved) {
                const data = JSON.parse(saved);
                setWeight(data.weight || '');
                setReps(data.reps || '');
                setCompleted(data.completed || false);
            }
        }
    }, [userData, workoutDayId, weekNumber, exerciseId, setNumber]);

    // Save data to temporary localStorage and notify parent
    useEffect(() => {
        if (userData && (weight || reps || completed)) {
            const logKey = `workout_${workoutDayId}-${weekNumber}-${exerciseId}-${setNumber}`;
            const data = { weight, reps, completed };
            localStorage.setItem(logKey, JSON.stringify(data));

            if (onDataChange) {
                onDataChange();
            }
        }
    }, [weight, reps, completed, userData, workoutDayId, weekNumber, exerciseId, setNumber, onDataChange]);

    if (!userData) {
        return null;
    }

    return (
        <div className="flex items-center gap-1.5 md:gap-2 flex-1">
            <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-16 md:w-20 px-2 md:px-3 py-1.5 md:py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-xs md:text-sm"
            />
            <span className="text-gray-400 text-xs md:text-sm">lbs ×</span>
            <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-12 md:w-16 px-2 md:px-3 py-1.5 md:py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-xs md:text-sm"
            />
            <label className="flex items-center gap-1 md:gap-2 cursor-pointer ml-auto">
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="w-4 h-4 md:w-5 md:h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                />
                <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap">Done</span>
            </label>
        </div>
    );
}
