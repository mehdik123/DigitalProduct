import { useState, useEffect } from 'react';
import { Repeat, TrendingUp, Timer, Save, Check, Lock, HelpCircle } from 'lucide-react';
import { Exercise, ExerciseSet } from '../types/workout';
import { exerciseVideos } from '../data/exerciseVideos';
import SimpleWeightInput from './SimpleWeightInput';
import ExerciseHelpModal from './ExerciseHelpModal';
import Tooltip from './Tooltip';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onSelectVideo?: (videoId: string) => void;
  userData?: any;
  weekNumber?: number;
  workoutDayId?: number;
  onSaveBatch?: (exerciseId: string, exerciseName: string, setsData: ExerciseSet[]) => Promise<void>;
  savedData?: ExerciseSet[];
  isGuest?: boolean;
}

const DEFAULT_SAVED_DATA: ExerciseSet[] = [];

export default function ExerciseCard({
  exercise,
  index,
  userData,
  weekNumber = 1,
  workoutDayId = 1,
  onSaveBatch,
  savedData = DEFAULT_SAVED_DATA,
  isGuest = false
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
  const [showHelpModal, setShowHelpModal] = useState(false);

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
    setSets(prev => prev.map((set, i) => {
      if (i === setIndex) {
        // Convert string values to numbers for weight and reps
        let convertedValue = value;
        if (field === 'weight' || field === 'reps') {
          convertedValue = value === '' ? 0 : Number(value);
          // Handle NaN cases
          if (isNaN(convertedValue)) {
            convertedValue = 0;
          }
        } else if (field === 'rpe') {
          convertedValue = value === '' ? 7 : Number(value);
          if (isNaN(convertedValue)) {
            convertedValue = 7;
          }
        }
        return { ...set, [field]: convertedValue };
      }
      return set;
    }));
    setIsSaved(false);
  };

  const handleSaveExercise = async () => {
    if (!onSaveBatch) {
      console.error('ExerciseCard: onSaveBatch not provided');
      return;
    }

    setIsSaving(true);
    setIsSaved(false);

    // Mark as completed locally for UI feedback
    const completedSets = sets.map(set => ({ ...set, completed: true }));
    setSets(completedSets);

    try {
      console.log('ExerciseCard: Calling onSaveBatch with sets:', completedSets);
      await onSaveBatch(exercise.id, exercise.name, completedSets);
      console.log('ExerciseCard: Save completed successfully');
      setIsSaved(true);
    } catch (error) {
      console.error('ExerciseCard: Error saving:', error);
      setIsSaved(false);
      // Show error to user
      alert(`Failed to save exercise: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
              {/* Help Button */}
              <button
                onClick={() => setShowHelpModal(true)}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-red-600/20 hover:bg-red-600/30 transition-all flex-shrink-0"
                aria-label="Exercise Help"
              >
                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              </button>
            </div>

            {/* Stats Grid - Mobile optimized */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Repeat className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Sets</span>
                  <Tooltip
                    title="Sets"
                    content="A group of repetitions performed without rest. Complete all reps, rest, then start the next set."
                  />
                </div>
                <p className="text-base md:text-xl font-black text-white">{exercise.sets}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Reps</span>
                  <Tooltip
                    title="Reps (Repetitions)"
                    content="The number of times you perform the movement in one set."
                  />
                </div>
                <p className="text-base md:text-xl font-black text-white">{exercise.reps}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Timer className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Rest</span>
                  <Tooltip
                    title="Rest Period"
                    content="Time to recover between sets. Use a timer to ensure consistent rest periods."
                  />
                </div>
                <p className="text-sm md:text-lg font-black text-white">{exercise.rest}</p>
              </div>
            </div>

            {/* Weight Logging */}
            {isGuest ? (
              /* Guest View - Locked */
              <div className="mb-3 md:mb-4 bg-slate-900/50 rounded-lg md:rounded-xl p-6 md:p-8 border border-slate-600 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-red-600/20 rounded-full flex items-center justify-center">
                    <Lock className="w-7 h-7 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm md:text-base font-black text-white uppercase tracking-wider">Tracking Locked</h4>
                    <p className="text-xs md:text-sm text-gray-400 font-medium max-w-xs mx-auto">
                      Create your copy to track weights, reps, and progress for each set
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-xs font-bold">
                    <span>{exercise.sets} Sets</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{exercise.reps} Reps</span>
                  </div>
                </div>
              </div>
            ) : userData ? (
              /* Authenticated View - Full Tracking */
              <div className="mb-3 md:mb-4 bg-slate-900/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="text-xs md:text-sm font-bold text-white">Track Your Performance</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Fill in weight and reps for each set</p>
                </div>
                <div className="space-y-3">
                  {sets.map((set, i) => (
                    <SimpleWeightInput
                      key={i}
                      setNumber={i + 1}
                      data={set}
                      onChange={(field, value) => handleSetChange(i, field, value)}
                      targetReps={exercise.reps}
                    />
                  ))}

                  {/* Batch Save Button */}
                  <button
                    onClick={handleSaveExercise}
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center gap-2 py-3 md:py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 transform active:scale-[0.98] ${isSaved
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
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
            ) : null}

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

      {/* Help Modal */}
      <ExerciseHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
