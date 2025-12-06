import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { WorkoutLog, ExerciseLog, ExerciseSet, PreviousWorkoutData, PersonalRecord } from '../types/workout';

export const useWorkoutLog = (workoutDayId: number, weekNumber: number) => {
    const { user } = useAuth();
    const [currentWorkoutLog, setCurrentWorkoutLog] = useState<WorkoutLog | null>(null);
    const [previousWorkoutData, setPreviousWorkoutData] = useState<Map<string, PreviousWorkoutData>>(new Map());
    const [personalRecords, setPersonalRecords] = useState<Map<string, PersonalRecord>>(new Map());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch previous workout data for comparison
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchPreviousWorkout = async () => {
            try {
                // Get the most recent workout for this workout day
                const { data: workoutLogs, error: workoutError } = await supabase
                    .from('workout_logs')
                    .select('id, completed_at')
                    .eq('user_id', user.id)
                    .eq('workout_day_id', workoutDayId)
                    .lt('week_number', weekNumber)
                    .order('week_number', { ascending: false })
                    .limit(1);

                if (workoutError) throw workoutError;

                if (workoutLogs && workoutLogs.length > 0) {
                    const previousWorkoutId = workoutLogs[0].id;

                    // Get exercise logs for that workout
                    const { data: exerciseLogs, error: exerciseError } = await supabase
                        .from('exercise_logs')
                        .select('*')
                        .eq('workout_log_id', previousWorkoutId)
                        .order('exercise_id')
                        .order('set_number');

                    if (exerciseError) throw exerciseError;

                    // Group by exercise
                    const previousData = new Map<string, PreviousWorkoutData>();
                    exerciseLogs?.forEach((log) => {
                        if (!previousData.has(log.exercise_id)) {
                            previousData.set(log.exercise_id, {
                                exerciseId: log.exercise_id,
                                sets: [],
                                completedAt: new Date(workoutLogs[0].completed_at)
                            });
                        }
                        previousData.get(log.exercise_id)?.sets.push({
                            setNumber: log.set_number,
                            reps: log.reps,
                            weight: parseFloat(log.weight),
                            rpe: log.rpe,
                            completed: log.completed
                        });
                    });

                    setPreviousWorkoutData(previousData);
                }

                // Fetch personal records
                const { data: prs, error: prError } = await supabase
                    .from('personal_records')
                    .select('*')
                    .eq('user_id', user.id);

                if (prError) throw prError;

                const prMap = new Map<string, PersonalRecord>();
                prs?.forEach((pr) => {
                    prMap.set(pr.exercise_id, {
                        id: pr.id,
                        userId: pr.user_id,
                        exerciseId: pr.exercise_id,
                        exerciseName: pr.exercise_name,
                        weight: parseFloat(pr.weight),
                        reps: pr.reps,
                        achievedAt: new Date(pr.achieved_at)
                    });
                });
                setPersonalRecords(prMap);

            } catch (error) {
                console.error('Error fetching previous workout:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreviousWorkout();
    }, [user, workoutDayId, weekNumber]);

    // Save exercise set
    const saveExerciseSet = async (
        exerciseId: string,
        exerciseName: string,
        setData: ExerciseSet
    ) => {
        if (!user) return;

        setSaving(true);
        try {
            // Create or get current workout log
            let workoutLogId = currentWorkoutLog?.id;

            if (!workoutLogId) {
                const { data: newWorkoutLog, error: workoutError } = await supabase
                    .from('workout_logs')
                    .insert({
                        user_id: user.id,
                        workout_day_id: workoutDayId,
                        week_number: weekNumber,
                    })
                    .select()
                    .single();

                if (workoutError) throw workoutError;
                workoutLogId = newWorkoutLog.id;
                setCurrentWorkoutLog({
                    id: workoutLogId,
                    userId: user.id,
                    workoutDayId,
                    weekNumber,
                    completedAt: new Date(),
                    exercises: []
                });
            }

            // Check if this set already exists
            const { data: existingSet } = await supabase
                .from('exercise_logs')
                .select('id')
                .eq('workout_log_id', workoutLogId)
                .eq('exercise_id', exerciseId)
                .eq('set_number', setData.setNumber)
                .single();

            if (existingSet) {
                // Update existing set
                const { error } = await supabase
                    .from('exercise_logs')
                    .update({
                        reps: setData.reps,
                        weight: setData.weight,
                        rpe: setData.rpe,
                        completed: setData.completed
                    })
                    .eq('id', existingSet.id);

                if (error) throw error;
            } else {
                // Insert new set
                const { error } = await supabase
                    .from('exercise_logs')
                    .insert({
                        workout_log_id: workoutLogId,
                        exercise_id: exerciseId,
                        exercise_name: exerciseName,
                        set_number: setData.setNumber,
                        reps: setData.reps,
                        weight: setData.weight,
                        rpe: setData.rpe,
                        completed: setData.completed
                    });

                if (error) throw error;
            }

            // Check if this is a new personal record
            await checkAndUpdatePR(exerciseId, exerciseName, setData.weight, setData.reps);

        } catch (error) {
            console.error('Error saving exercise set:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    // Check and update personal record
    const checkAndUpdatePR = async (
        exerciseId: string,
        exerciseName: string,
        weight: number,
        reps: number
    ) => {
        if (!user) return;

        const currentPR = personalRecords.get(exerciseId);

        // Simple PR logic: higher weight OR same weight with more reps
        const isNewPR = !currentPR ||
            weight > currentPR.weight ||
            (weight === currentPR.weight && reps > currentPR.reps);

        if (isNewPR) {
            try {
                const { data, error } = await supabase
                    .from('personal_records')
                    .upsert({
                        user_id: user.id,
                        exercise_id: exerciseId,
                        exercise_name: exerciseName,
                        weight,
                        reps,
                        achieved_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,exercise_id'
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Update local state
                if (data) {
                    setPersonalRecords(prev => new Map(prev).set(exerciseId, {
                        id: data.id,
                        userId: data.user_id,
                        exerciseId: data.exercise_id,
                        exerciseName: data.exercise_name,
                        weight: parseFloat(data.weight),
                        reps: data.reps,
                        achievedAt: new Date(data.achieved_at)
                    }));
                }
            } catch (error) {
                console.error('Error updating PR:', error);
            }
        }
    };

    // Complete workout
    const completeWorkout = async (notes?: string) => {
        if (!currentWorkoutLog?.id || !user) return;

        try {
            const { error } = await supabase
                .from('workout_logs')
                .update({
                    notes,
                    completed_at: new Date().toISOString()
                })
                .eq('id', currentWorkoutLog.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error completing workout:', error);
            throw error;
        }
    };

    return {
        previousWorkoutData,
        personalRecords,
        loading,
        saving,
        saveExerciseSet,
        completeWorkout
    };
};
