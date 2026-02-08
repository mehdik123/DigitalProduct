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
      className="group relative overflow-hidden rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-white/5 transition-all duration-500 hover:border-red-500/30 hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] cursor-pointer active:scale-[0.98]"
    >
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Ambient Glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-red-600/10 rounded-full blur-[60px] group-hover:bg-red-600/20 transition-all duration-700" />

      <div className="p-6 space-y-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">
                Series {workout.id % 2 === 0 ? 'B' : 'A'}
              </span>
              <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                {workout.difficulty}
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-red-500 transition-colors duration-300 leading-[0.9]">
              {workout.name}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 shadow-xl group-hover:scale-110 group-hover:rotate-6 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
            <Dumbbell className="w-6 h-6 fill-current" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{workout.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{workout.exercises.length} Drills</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-red-500 group/link">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">Start</span>
            <div className="p-1.5 rounded-full bg-red-500/10 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
