import { useState, useEffect } from 'react';
import { ArrowLeft, Send, History } from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import { WorkoutDay, ExerciseSet } from '../types/workout';
import { supabase } from '../lib/supabaseClient';
import { saveWorkoutLog } from '../services/workoutService';

interface WorkoutPageProps {
  workout: WorkoutDay;
  weekNumber: number;
  onBack: () => void;
  profile: any;
  onSignup: () => void;
  isGuest?: boolean;
}

export default function WorkoutPage({ workout, weekNumber, onBack, profile, isGuest = false }: WorkoutPageProps) {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseSet[]>([]); // Store full set data
  const [isFinishing, setIsFinishing] = useState(false);

  // Load existing logs for this workout/week
  useEffect(() => {
    const loadLogs = async () => {
      if (!profile) return;

      try {
        // First get the workout session ID (V2)
        const { data: session, error: sessionError } = await supabase
          .from('workout_sessions') // V2 Table
          .select('id')
          .eq('user_id', profile.id)
          .eq('week_number', weekNumber)
          .eq('workout_day_id', workout.id)
          .maybeSingle(); // Use maybeSingle to handle case where no session exists

        if (sessionError && sessionError.code !== 'PGRST116') {
          // PGRST116 is "not found" which is fine, but other errors should be logged
          console.error('Error loading session:', sessionError);
        }

        if (session) {
          // Then get ALL sets for this session
          const { data: sets, error: setsError } = await supabase
            .from('workout_sets') // V2 Table
            .select('*')
            .eq('session_id', session.id)
            .order('exercise_id')
            .order('set_number');

          if (setsError) {
            console.error('Error loading sets:', setsError);
          } else if (sets && sets.length > 0) {
            // 1. Update Completed IDs
            const completedIds = Array.from(new Set(sets.map(s => s.exercise_id)));
            setCompletedExercises(completedIds);

            // 2. Store Full Logs for UI Inputs - ensure proper number conversion
            const formattedLogs: ExerciseSet[] = sets.map(s => ({
              setNumber: s.set_number,
              reps: s.reps ? Number(s.reps) : 0,
              weight: s.weight ? Number(s.weight) : 0,
              rpe: s.rpe ? Number(s.rpe) : undefined,
              completed: s.completed !== false,
              exerciseId: s.exercise_id // Helper for filtering
            }));
            setExerciseLogs(formattedLogs);
          }
        }
      } catch (error) {
        console.error('Error loading logs:', error);
      }
    };

    loadLogs();
  }, [profile, weekNumber, workout.id]);

  // 🔍 DEBUG: Prefix for logs
  const TAG = '📋 [WORKOUT-PAGE]';

  const handleSaveBatch = async (
    exerciseId: string,
    exerciseName: string,
    setsData: ExerciseSet[]
  ) => {
    console.log(`${TAG} Save requested for: ${exerciseName}`);
    console.log(`${TAG} Sets data:`, setsData);

    if (!profile) {
      console.error(`${TAG} No profile available`);
      alert('Please sign in to save your workout');
      return;
    }

    try {
      console.log(`${TAG} Calling saveWorkoutLog...`);
      const result = await saveWorkoutLog({
        userId: profile.id,
        weekNumber,
        workoutDayId: workout.id,
        exerciseId,
        exerciseName,
        sets: setsData
      });

      console.log(`${TAG} Save result:`, result);

      if (result.success) {
        console.log(`${TAG} ✅ Save successful!`);

        // Optimistic UI Update: Mark as completed
        setCompletedExercises(prev =>
          prev.includes(exerciseId) ? prev : [...prev, exerciseId]
        );

        // Optimistic UI Update: Update local logs so inputs persist without reload
        setExerciseLogs(prev => {
          // Remove old logs for this exercise to avoid duplicates
          const otherLogs = prev.filter(l => (l as any).exerciseId !== exerciseId);
          // Add new logs with the exerciseId attached
          const newLogs = setsData.map(s => ({ ...s, exerciseId }));
          return [...otherLogs, ...newLogs];
        });

      } else {
        console.error(`${TAG} ❌ Save failed: ${result.error}`);
        alert(`Failed to save: ${result.error || 'Unknown error'}`);
        throw new Error(result.error || 'Save failed');
      }

    } catch (err: any) {
      console.error(`${TAG} 💥 UNEXPECTED ERROR:`, err);
      console.error(`${TAG} Error stack:`, err.stack);
      alert(`An unexpected error occurred while saving: ${err.message || 'Unknown error'}`);
      throw err; // Re-throw so ExerciseCard can handle it
    }
  };

  const handleFinishWorkout = async () => {
    setIsFinishing(true);
    // Logic to mark workout as fully complete if needed
    setTimeout(() => {
      setIsFinishing(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-32">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-10 md:mb-12">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 text-neutral-500 hover:text-white transition-all bg-white/5 px-5 py-3 rounded-2xl border border-white/5 hover:border-white/10"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Exit Session</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Week {weekNumber}</p>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Active Program</p>
            </div>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
              <History className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-6 mb-12 md:mb-20 text-center sm:text-left">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none">
              {workout.name}
            </h1>
            <p className="text-red-500 font-extrabold uppercase tracking-[0.5em] text-[10px] md:text-xs">
              {workout.focus} • {workout.duration}
            </p>
          </div>
          <p className="text-neutral-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto sm:mx-0">
            {workout.description}
          </p>
        </div>

        {/* Exercise List */}
        <div className="space-y-6 md:space-y-10">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index + 1}
              weekNumber={weekNumber}
              workoutDayId={workout.id}
              userData={profile}
              isGuest={isGuest}
              onSaveBatch={handleSaveBatch}
              savedData={exerciseLogs.filter((l: any) => l.exerciseId === exercise.id)}
            />
          ))}
        </div>

        {/* Completion Footer - Only for authenticated users */}
        {!isGuest && (
          <div className="mt-20 pt-12 border-t border-white/5 text-center px-4">
            <div className="max-w-md mx-auto space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase italic tracking-tight">Session Alpha Complete</h3>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Verify all sets and metrics before saving.</p>
              </div>

              <button
                onClick={handleFinishWorkout}
                disabled={isFinishing}
                className="w-full py-6 bg-red-600 text-white text-[11px] font-black rounded-[2rem] uppercase tracking-[0.4em] shadow-2xl shadow-red-900/40 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isFinishing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Archiving...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Sync Performance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
