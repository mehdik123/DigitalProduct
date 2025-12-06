import { Repeat, TrendingUp, Timer } from 'lucide-react';
import { Exercise } from '../types/workout';
import { exerciseVideos } from '../data/exerciseVideos';
import SimpleWeightInput from './SimpleWeightInput';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onSelectVideo?: (videoId: string) => void;
  userData?: any;
  weekNumber?: number;
  workoutDayId?: number;
  onDataChange?: () => void;
}

export default function ExerciseCard({
  exercise,
  index,
  userData,
  weekNumber = 1,
  workoutDayId = 1,
  onDataChange
}: ExerciseCardProps) {
  const videoId = exerciseVideos[exercise.id];
  const isBodybuilding = exercise.type === 'bodybuilding';

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
                <div className="space-y-2">
                  {Array.from({ length: exercise.sets }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs md:text-sm font-bold text-gray-400 w-10 md:w-12">Set {i + 1}:</span>
                      <SimpleWeightInput
                        exerciseId={exercise.id}
                        exerciseName={exercise.name}
                        setNumber={i + 1}
                        userData={userData}
                        weekNumber={weekNumber}
                        workoutDayId={workoutDayId}
                        onDataChange={onDataChange}
                      />
                    </div>
                  ))}
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
