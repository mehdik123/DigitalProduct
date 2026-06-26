import { Dumbbell, Clock, Zap, ArrowRight } from 'lucide-react';
import { WorkoutDay } from '../types/workout';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onClick: () => void;
}

export default function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <button
      onClick={onClick}
      className="press group relative overflow-hidden rounded-3xl border border-hair bg-surface-1 text-left transition-colors duration-500 hover:border-brand/40 hover:shadow-red"
    >
      {/* Ambient glow on hover */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-soft opacity-0 blur-[60px] transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative z-10 space-y-6 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-brand/20 bg-brand-soft px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-brand">
                Series {workout.id % 2 === 0 ? 'B' : 'A'}
              </span>
              <span className="rounded-md border border-hair bg-glass px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-txt-mid">
                {workout.difficulty}
              </span>
            </div>
            <h3 className="font-display text-3xl font-black uppercase italic leading-[.9] tracking-tight text-txt-hi transition-colors duration-300 group-hover:text-brand">
              {workout.name}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-hair bg-surface-3 text-brand shadow-soft transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
            <Dumbbell className="h-6 w-6 fill-current" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-hair pt-4">
          <div className="flex items-center gap-4 text-txt-lo">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{workout.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-brand" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{workout.exercises.length} Drills</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-brand">
            <span className="-translate-x-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              Start
            </span>
            <div className="rounded-full bg-brand-soft p-1.5 transition-colors group-hover:bg-brand group-hover:text-white">
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
