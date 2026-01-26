import { Dumbbell, Clock, Zap, ArrowRight } from 'lucide-react';
import { WorkoutDay } from '../types/workout';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onClick: () => void;
}

export default function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#09090b] rounded-[1.25rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-red-600/30 hover:shadow-[0_0_30px_rgba(220,30,58,0.1)] cursor-pointer active:scale-[0.98]"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent opacity-50" />
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-red-600/5 rounded-full blur-[40px] group-hover:bg-red-600/10 transition-all duration-700" />

      <div className="p-5 space-y-5 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">
                Series {workout.id % 2 === 0 ? 'B' : 'A'}
              </span>
              <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-neutral-500 uppercase tracking-tighter">
                {workout.difficulty}
              </div>
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-red-500 transition-colors leading-[1.1]">
              {workout.name}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-600 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Dumbbell className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-4 text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{workout.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{workout.exercises.length} Drills</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-red-600 group/link">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:mr-1 transition-all">Open</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
