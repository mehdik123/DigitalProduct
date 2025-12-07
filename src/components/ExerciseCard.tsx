import { useState, useEffect } from 'react';
import { Repeat, TrendingUp, Timer, Save, Check } from 'lucide-react';
import { Exercise, ExerciseSet } from '../types/workout';
import { exerciseVideos } from '../data/exerciseVideos';
import SimpleWeightInput from './SimpleWeightInput';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onSelectVideo?: (videoId: string) => void;
  userData?: any;
  weekNumber?: number;
  workoutDayId?: number;
  onSaveBatch?: (exerciseId: string, exerciseName: string, setsData: ExerciseSet[]) => Promise<void>;
  savedData?: ExerciseSet[];
}

export default function ExerciseCard({
  exercise,
  index,
  userData,
  weekNumber = 1,
  workoutDayId = 1,
  onSaveBatch,
  savedData = []
}: ExerciseCardProps) {
  const videoId = exerciseVideos[exercise.id];
  const isBodybuilding = exercise.type === 'bodybuilding';

  // Initialize sets state from savedData or default
  const [sets, setSets] = useState<ExerciseSet[]>(() => {
    // Create default sets
    const defaultSets = Array.from({ length: exercise.sets }, (_, i) => ({
      setNumber: i + 1,
      weight: 0,
      reps: 0,
      rpe: 7,
      completed: false
    }));

    // Merge with saved data if available
    if (savedData && savedData.length > 0) {
      return defaultSets.map(set => {
        const savedSet = savedData.find(s => s.setNumber === set.setNumber);
        return savedSet ? { ...set, ...savedSet } : set;
      });
    }

    return defaultSets;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Update sets when savedData changes (e.g. after initial load)
  useEffect(() => {
    if (savedData && savedData.length > 0) {
      setSets(prev => prev.map(set => {
        const savedSet = savedData.find(s => s.setNumber === set.setNumber);
        return savedSet ? { ...set, ...savedSet } : set;
      }));
      setIsSaved(true);
    }
  }, [savedData]);

  // Parse target reps for initialization (only if no saved data)
  useEffect(() => {
    if (savedData && savedData.length > 0) return;

    const match = exercise.reps.match(/(\d+)/);
    const targetReps = match ? parseInt(match[0]) : 0;

    setSets(prev => prev.map(set => ({
      ...set,
      reps: set.reps || targetReps
    })));
  }, [exercise.reps, savedData]);

  const handleSetChange = (setIndex: number, field: keyof ExerciseSet, value: any) => {
    setSets(prev => prev.map((set, i) =>
      i === setIndex ? { ...set, [field]: value } : set
    ));
    setIsSaved(false);
  };

  const handleSaveExercise = async () => {
    if (!onSaveBatch) return;

    setIsSaving(true);
    try {
      // Mark all sets as completed when saving
      const completedSets = sets.map(set => ({ ...set, completed: true }));
      setSets(completedSets);

      await onSaveBatch(exercise.id, exercise.name, completedSets);
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving exercise:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-700 hover:border-slate-600">
      <div className="flex flex-col md:flex-row h-full">
        {/* Video Thumbnail - Mobile optimized */}
        <div className="w-full md:w-2/5 relative bg-slate-900 overflow-hidden">
          {videoId && (
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full h-40 md:h-full bg-black block group/video"
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-colors">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center group-hover/video:scale-110 transition-transform shadow-lg">
                  <svg className="w-6 h-6 md:w-10 md:h-10 text-white ml-0.5 md:ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
          )}
        </div>

        {/* Exercise Details - Mobile optimized */}
        <div className="w-full md:w-3/5 p-3 md:p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 md:gap-4 mb-2 md:mb-4">
              <div className="flex-1">
                <div className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-1 md:mb-2">
                  Exercise {index} • {isBodybuilding ? 'Bodybuilding' : 'Calisthenics'}
                </div>
                <h3 className="text-base md:text-xl lg:text-2xl font-black text-white leading-tight">
                  {exercise.name}
                </h3>
              </div>
            </div>

            {/* Stats Grid - Mobile optimized */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Repeat className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Sets</span>
                </div>
                <p className="text-base md:text-xl font-black text-white">{exercise.sets}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Reps</span>
                </div>
                <p className="text-base md:text-xl font-black text-white">{exercise.reps}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Timer className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Rest</span>
                </div>
                <p className="text-sm md:text-lg font-black text-white">{exercise.rest}</p>
              </div>
            </div>

            {/* Weight Logging (if user is logged in) */}
            {userData && (
              <div className="mb-3 md:mb-4 bg-slate-900/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-slate-600">
                <h4 className="text-xs md:text-sm font-bold text-white mb-2 md:mb-3">Log Your Sets:</h4>
                <div className="space-y-4">
                  {sets.map((set, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs md:text-sm font-bold text-gray-400 w-10 md:w-12">Set {i + 1}:</span>
                      <SimpleWeightInput
                        setNumber={i + 1}
                        data={set}
                        onChange={(field, value) => handleSetChange(i, field, value)}
                        targetReps={exercise.reps}
                      />
                    </div>
                  ))}

                  {/* Batch Save Button */}
                  <button
                    onClick={handleSaveExercise}
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 transform active:scale-[0.98] ${isSaved
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Exercise Saved</span>
                      </>
                    ) : (
                      <>
                        {isSaving ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save Exercise'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {exercise.notes && (
              <div className="bg-amber-500/20 border-l-4 border-amber-500 p-3 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-amber-200 font-medium">
                  <span className="font-bold">💡 Pro Tip:</span> {exercise.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
