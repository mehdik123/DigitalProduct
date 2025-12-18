import { ChevronLeft, Clock, TrendingUp, Zap, Target, Info } from 'lucide-react';
import { WorkoutDay } from '../types/workout';
import ExerciseCard from './ExerciseCard';
import { useWorkoutLog } from '../hooks/useWorkoutLog';

interface WorkoutPageProps {
  workout: WorkoutDay;
  weekNumber: number;
  onBack: () => void;
  session?: any;
  userProfile?: any;
}

export default function WorkoutPage({ workout, weekNumber, onBack, session, userProfile }: WorkoutPageProps) {
  // Use workout directly without modification

  const {
    currentWorkoutLog,
    saveExerciseBatch,
    completeWorkout,
    saving: isSaving
  } = useWorkoutLog(workout.id, weekNumber);

  const Icon = {
    Dumbbell: Zap,
    Activity: Target,
    Zap: TrendingUp,
    Flame: Zap,
    Target: Target,
  }[workout.icon] || Zap;

  const handleFinishWorkout = async () => {
    try {
      await completeWorkout();
      onBack();
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('Error saving workout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-0">
      {/* Header */}
      <div className={`relative h-48 md:h-64 overflow-hidden ${workout.color}`}>
        {workout.backgroundImage ? (
          <div className="absolute inset-0">
            <img
              src={workout.backgroundImage}
              alt={workout.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={onBack}
            className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-wider mb-2">
            <Icon className="w-4 h-4" />
            <span>Week {weekNumber}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
            {workout.name}
          </h1>
          <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{workout.duration}</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
              {workout.difficulty}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-2">Workout Focus</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {workout.description}
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {workout.exercises.map((exercise, index) => {
            // Find logs for this exercise
            const exerciseLog = currentWorkoutLog?.exercises?.find(
              log => log.exerciseId === exercise.id
            );
            const savedSets = exerciseLog?.sets || [];

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index + 1}
                userData={session?.user}
                weekNumber={weekNumber}
                workoutDayId={workout.id}
                onSaveBatch={saveExerciseBatch}
                savedData={savedSets}
              />
            );
          })}
        </div>

        {/* Finish Workout Button */}
        <div className="pt-4 pb-8">
          <button
            onClick={handleFinishWorkout}
            disabled={isSaving}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-black text-white uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Finish Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}
