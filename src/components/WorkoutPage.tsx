import { useState } from 'react';
import { ChevronLeft, Clock, TrendingUp, Zap, Target, Save } from 'lucide-react';
import { WorkoutDay } from '../types/workout';
import ExerciseCard from './ExerciseCard';
import { supabase } from '../lib/supabaseClient';

interface WorkoutPageProps {
  workout: WorkoutDay;
  weekNumber: number;
  onBack: () => void;
  session?: any;
  userProfile?: any;
}

export default function WorkoutPage({ workout, weekNumber, onBack, session, userProfile }: WorkoutPageProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const Icon = {
    Dumbbell: Zap,
    Activity: Target,
    Zap: TrendingUp,
    Flame: Zap,
    Target: Target,
  }[workout.icon] || Zap;



  // Save workout to database
  const handleSaveWorkout = async () => {
    if (!session?.user) {
      alert('Please login to save workouts');
      return;
    }

    setIsSaving(true);

    try {
      // Get all exercise logs from localStorage (temporary storage)
      const exerciseLogs: any[] = [];

      workout.exercises.forEach((exercise) => {
        for (let setNum = 1; setNum <= exercise.sets; setNum++) {
          const logKey = `workout_${workout.id}-${weekNumber}-${exercise.id}-${setNum}`;
          const saved = localStorage.getItem(logKey);

          if (saved) {
            const data = JSON.parse(saved);
            if (data.weight || data.reps || data.completed) {
              exerciseLogs.push({
                exercise_id: exercise.id,
                exercise_name: exercise.name,
                set_number: setNum,
                weight: data.weight ? parseFloat(data.weight) : null,
                reps: data.reps ? parseInt(data.reps) : null,
                completed: data.completed || false
              });
            }
          }
        }
      });

      if (exerciseLogs.length === 0) {
        alert('No workout data to save. Please log some weights first!');
        setIsSaving(false);
        return;
      }

      // Insert workout log
      const { data: workoutLog, error: workoutError } = await supabase
        .from('workout_logs')
        .insert({
          user_id: session.user.id,
          workout_day_id: workout.id,
          week_number: weekNumber,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Add workout_log_id to exercise logs
      const exerciseLogsWithWorkoutId = exerciseLogs.map(log => ({
        ...log,
        workout_log_id: workoutLog.id
      }));

      // Insert exercise logs
      const { error: exerciseError } = await supabase
        .from('exercise_logs')
        .insert(exerciseLogsWithWorkoutId);

      if (exerciseError) throw exerciseError;

      // Clear temporary localStorage data
      workout.exercises.forEach((exercise) => {
        for (let setNum = 1; setNum <= exercise.sets; setNum++) {
          const logKey = `workout_${workout.id}-${weekNumber}-${exercise.id}-${setNum}`;
          localStorage.removeItem(logKey);
        }
      });

      setHasUnsavedChanges(false);
      alert('✅ Workout saved successfully!');
    } catch (error: any) {
      console.error('Error saving workout:', error);
      alert(`Error saving workout: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="max-w-7xl mx-auto p-3 md:p-6 lg:p-8">
        {/* Back Button - Smaller on mobile */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 md:gap-2 text-gray-400 hover:text-white transition-colors mb-3 md:mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm md:text-base font-semibold">Back to Workouts</span>
        </button>

        {/* Workout Header - Much more compact on mobile */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 lg:p-8 mb-4 md:mb-6 lg:mb-8 border border-slate-700/50 shadow-2xl">
          <div className="flex items-start gap-2 md:gap-4 lg:gap-6">
            <div className={`p-2 md:p-4 lg:p-5 rounded-lg md:rounded-2xl bg-gradient-to-br ${workout.color} shadow-lg flex-shrink-0`}>
              <Icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl lg:text-5xl font-black text-white mb-2 md:mb-4">{workout.name}</h1>
              <p className="text-xs md:text-base lg:text-lg text-gray-300 leading-relaxed mb-3 md:mb-6">
                {workout.description}
              </p>

              {/* Workout Stats - Compact on mobile */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border border-slate-700">
                  <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                    <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Exercises</span>
                  </div>
                  <p className="text-base md:text-xl lg:text-2xl font-black text-white">{workout.exercises.length}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border border-slate-700">
                  <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Duration</span>
                  </div>
                  <p className="text-sm md:text-xl lg:text-2xl font-black text-white">{workout.duration}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border border-slate-700">
                  <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Focus</span>
                  </div>
                  <p className="text-sm md:text-base lg:text-lg font-bold text-white">{workout.focus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Reminder (if logged in and has changes) - Compact on mobile */}
        {userProfile && hasUnsavedChanges && (
          <div className="mb-3 md:mb-6 bg-amber-500/20 border-l-4 border-amber-500 p-2.5 md:p-4 rounded-lg">
            <p className="text-xs md:text-sm text-amber-200">
              <span className="font-bold">⚠️ Reminder:</span> Don't forget to save your workout after logging your weights!
            </p>
          </div>
        )}

        {/* Save Button (if logged in) - Compact on mobile */}
        {userProfile && (
          <div className="mb-4 md:mb-6">
            <button
              onClick={handleSaveWorkout}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 md:py-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Save className="w-4 h-4 md:w-5 md:h-5" />
              {isSaving ? 'Saving Workout...' : '💾 Save Workout'}
            </button>
          </div>
        )}

        {/* Exercises - Smaller spacing on mobile */}
        <div className="space-y-4 md:space-y-8">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index + 1}
              userData={userProfile}
              weekNumber={weekNumber}
              workoutDayId={workout.id}
              onDataChange={() => setHasUnsavedChanges(true)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
