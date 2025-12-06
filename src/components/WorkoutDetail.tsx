import { X, Clock, TrendingUp, Repeat, Timer, CheckCircle2, Circle } from 'lucide-react';
import { WorkoutDay } from '../types/workout';

interface WorkoutDetailProps {
  workout: WorkoutDay;
  onClose: () => void;
  completedExercises: string[];
  onToggleExercise: (exerciseId: string) => void;
  onCompleteWorkout: () => void;
}

export default function WorkoutDetail({
  workout,
  onClose,
  completedExercises,
  onToggleExercise,
  onCompleteWorkout
}: WorkoutDetailProps) {
  const allCompleted = completedExercises.length === workout.exercises.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        <div className={`bg-gradient-to-br ${workout.color} p-8 relative`}>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-2">
            Day {workout.id} • {workout.difficulty}
          </div>
          <h2 className="text-5xl font-black text-white mb-2 tracking-tight">
            {workout.name}
          </h2>
          <p className="text-white/90 text-lg font-medium mb-6">{workout.description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">{workout.duration}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">{workout.exercises.length} Exercises</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">
                {completedExercises.length}/{workout.exercises.length} Complete
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Focus Areas</h3>
            <p className="text-gray-600">{workout.focus}</p>
          </div>

          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.includes(exercise.id);
              return (
                <div
                  key={exercise.id}
                  onClick={() => onToggleExercise(exercise.id)}
                  className={`group relative border-2 rounded-2xl p-5 transition-all duration-300 cursor-pointer ${isCompleted
                      ? 'border-green-400 bg-green-50 hover:border-green-500'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-colors ${isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                      }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                            {exercise.name}
                          </h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${exercise.type === 'calisthenics'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                            }`}>
                            {exercise.type === 'calisthenics' ? '🤸 Calisthenics' : '🏋️ Bodybuilding'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleExercise(exercise.id);
                          }}
                          className={`flex-shrink-0 transition-all duration-300 ${isCompleted
                              ? 'text-green-500 scale-110'
                              : 'text-gray-300 hover:text-gray-400 group-hover:scale-110'
                            }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
                          ) : (
                            <Circle className="w-7 h-7" strokeWidth={2} />
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                          <Repeat className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {exercise.sets} sets
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                          <TrendingUp className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {exercise.reps} reps
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                          <Timer className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {exercise.rest} rest
                          </span>
                        </div>
                      </div>

                      {exercise.notes && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                          <p className="text-sm text-amber-900 font-medium">
                            💡 {exercise.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onCompleteWorkout}
            disabled={!allCompleted}
            className={`mt-8 w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${allCompleted
                ? `bg-gradient-to-br ${workout.color} text-white hover:shadow-xl hover:scale-[1.02]`
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {allCompleted ? 'Complete Workout 🎉' : 'Complete All Exercises to Finish'}
          </button>
        </div>
      </div>
    </div>
  );
}
