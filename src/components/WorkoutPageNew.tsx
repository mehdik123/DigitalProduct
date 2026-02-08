import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { WorkoutDay, ExerciseSet } from '../types/workout';
import ExerciseCardNew from './ExerciseCardNew';
import { saveExerciseSets, loadWorkoutSets } from '../services/workoutService';

interface WorkoutPageNewProps {
  workout: WorkoutDay;
  weekNumber: number;
  onBack: () => void;
  profile: { id: string };
}

export default function WorkoutPageNew({ workout, weekNumber, onBack, profile }: WorkoutPageNewProps) {
  const [savedSets, setSavedSets] = useState<Map<string, ExerciseSet[]>>(new Map());
  const [loading, setLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('WorkoutPageNew mounted:', {
      workoutName: workout?.name,
      weekNumber,
      profileId: profile?.id,
      exercisesCount: workout?.exercises?.length
    });
  }, []);

  // Load saved data on mount
  useEffect(() => {
    if (profile?.id) {
      loadSavedData();
    } else {
      setLoading(false);
    }
  }, [profile?.id, weekNumber, workout.id]);

  const loadSavedData = async () => {
    if (!profile?.id) {
      console.error('No profile ID available');
      setLoading(false);
      return;
    }

    setLoading(true);

    // Add timeout to prevent infinite loading (reduced since tables may not exist)
    const timeout = setTimeout(() => {
      console.warn('Load timeout - database tables may not exist. Run migration first.');
      setLoading(false);
    }, 8000); // Increased to 8 seconds

    try {
      const loaded = await loadWorkoutSets(profile.id, weekNumber, workout.id);
      clearTimeout(timeout);
      setSavedSets(loaded);
    } catch (error) {
      clearTimeout(timeout);
      console.error('Failed to load saved data:', error);
      // Don't block the UI if loading fails - just show empty state
      setSavedSets(new Map());
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExercise = async (exerciseId: string, exerciseName: string, sets: ExerciseSet[]) => {
    const result = await saveExerciseSets({
      userId: profile.id,
      weekNumber,
      workoutDayId: workout.id,
      exerciseId,
      exerciseName,
      sets
    });

    if (result.success) {
      // Update local state
      setSavedSets(prev => new Map(prev).set(exerciseId, sets));
      return;
    } else {
      // Throw error with message so ExerciseCard can show it
      throw new Error(result.error || 'Save failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">No workout data available</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden" style={{ minHeight: '100vh' }}>

      {/* Ambient Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Modern Glass Header */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-black/30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 bg-zinc-900/50 hover:bg-zinc-800 rounded-full border border-white/5 transition-all active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white truncate shadow-black drop-shadow-lg">
                {workout?.name || 'Workout'}
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <span className="text-red-500">Week {weekNumber}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>{workout?.focus || 'General'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 pb-32 space-y-8">

        {/* Description Card */}
        {workout?.description && (
          <div className="p-5 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl">
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
              {workout.description}
            </p>
          </div>
        )}

        {/* Exercises List */}
        {workout?.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-6">
            {workout.exercises.map((exercise, index) => (
              <ExerciseCardNew
                key={exercise.id || index}
                exercise={exercise}
                index={index}
                savedSets={savedSets.get(exercise.id)}
                onSave={(sets) => handleSaveExercise(exercise.id, exercise.name, sets)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">No exercises found for this workout</p>
          </div>
        )}

        {/* Bottom Spacer & Debug */}
        <div className="pb-12 text-center">
          <button
            onClick={() => {
              if (confirm('This will log you out and clear all local data to fix connection issues. Continue?')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }
            }}
            className="text-xs text-red-500/50 hover:text-red-500 underline uppercase tracking-widest"
          >
            Troubleshoot: Reset App Data
          </button>
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}

