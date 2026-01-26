import { useState, useEffect } from 'react';
import { ArrowLeft, Send, History } from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import { WorkoutDay, ExerciseSet } from '../types/workout';
import { supabase } from '../lib/supabaseClient';

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
  const [isFinishing, setIsFinishing] = useState(false);

  // Load existing logs for this workout/week
  useEffect(() => {
    const loadLogs = async () => {
      if (!profile) return;

      const { data } = await supabase
        .from('workout_logs')
        .select('exercise_id')
        .eq('user_id', profile.id)
        .eq('week_number', weekNumber)
        .eq('workout_id', workout.id);

      if (data) {
        setCompletedExercises(data.map(log => log.exercise_id));
      }
    };

    loadLogs();
  }, [profile, weekNumber, workout.id]);

  const handleSaveBatch = async (exerciseId: string, exerciseName: string, setsData: ExerciseSet[]) => {
    if (!profile) return;

    try {
      const logEntry = {
        user_id: profile.id,
        week_number: weekNumber,
        workout_id: workout.id,
        exercise_id: exerciseId,
        exercise_name: exerciseName,
        sets: setsData,
        created_at: new Date().toISOString()
      };

      // Check if log already exists
      const { data: existingLog, error: fetchError } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('user_id', profile.id)
        .eq('week_number', weekNumber)
        .eq('workout_id', workout.id)
        .eq('exercise_id', exerciseId)
        .single();

      let error;

      if (existingLog) {
        // Update existing log
        const { error: updateError } = await supabase
          .from('workout_logs')
          .update(logEntry)
          .eq('id', existingLog.id);
        error = updateError;
      } else {
        // Insert new log
        const { error: insertError } = await supabase
          .from('workout_logs')
          .insert(logEntry);
        error = insertError;
      }

      if (error) throw error;

      setCompletedExercises(prev =>
        prev.includes(exerciseId) ? prev : [...prev, exerciseId]
      );
    } catch (error) {
      console.error('Error saving workout log:', error);
      alert('Failed to save progress. Please try again.');
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
