import { Activity, Dumbbell, Flame, Target, Zap, ChevronRight } from 'lucide-react';
import { WorkoutDay } from '../types/workout';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onClick: () => void;
}

const iconMap = {
  Dumbbell,
  Activity,
  Zap,
  Flame,
  Target,
};

export default function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  const Icon = iconMap[workout.icon as keyof typeof iconMap];

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
      style={{
        backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
      }}
    >
      <div className={`bg-gradient-to-br ${workout.color} p-8 relative`}>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-2">
              Day {workout.id}
            </div>
            <h3 className="text-4xl font-black text-white mb-1 tracking-tight">
              {workout.title}
            </h3>
            <p className="text-white/90 text-sm font-medium tracking-wide">
              {workout.subtitle}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-white/90 text-sm font-medium">{workout.focus}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/70 rounded-full"></div>
              <span className="text-white/80 text-xs font-medium">{workout.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/70 rounded-full"></div>
              <span className="text-white/80 text-xs font-medium">{workout.exercises.length} Exercises</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <span className="text-white/80 text-xs font-bold tracking-wider uppercase">
            {workout.difficulty}
          </span>
          <div className="flex items-center gap-2 text-white group-hover:translate-x-1 transition-transform duration-300">
            <span className="text-sm font-semibold">View Details</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
