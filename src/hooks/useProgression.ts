import { useMemo } from 'react';
import { WorkoutDay } from '../types/workout';
import { getWeekProgression } from '../data/progressionRules';

export const useProgression = (workout: WorkoutDay, weekNumber: number): WorkoutDay => {
    return useMemo(() => {
        // 1. Get the rules for this week
        const progression = getWeekProgression(weekNumber);

        // 2. Clone the workout to avoid mutation
        const adjustedWorkout = { ...workout };

        // 3. Apply progression multipliers to exercises
        adjustedWorkout.exercises = workout.exercises.map(exercise => {
            // Calculate adjusted sets
            // Base sets * volumeMultiplier. Rounding to nearest whole number.
            // e.g. 3 sets * 1.3 = 3.9 -> 4 sets
            const newSets = Math.max(1, Math.round(exercise.sets * progression.volumeMultiplier));

            // Adjust rest times?
            // Parsing "3 min" -> 180s -> * multiplier -> back to string is complex but valuable.
            // For now, let's stick to Sets & Intensity notes.

            let notes = exercise.notes;
            if (progression.description) {
                notes = `${exercise.notes} • Phase Focus: ${progression.goals[0]}`;
            }

            return {
                ...exercise,
                sets: newSets,
                notes: notes,
                // We could also adjust target reps if the phase changes (e.g. lower reps for strength)
                // But for now, volume (sets) is the primary lever we're pulling programmatically.
            };
        });

        // 4. Update Description/Focus
        adjustedWorkout.description = `${workout.description} | ${progression.phase} Phase (Week ${weekNumber})`;

        return adjustedWorkout;
    }, [workout, weekNumber]);
};
