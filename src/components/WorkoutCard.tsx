import { Dumbbell, Clock, Zap, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkoutDay } from '../types/workout';
import { itemVariants, spring } from '../design/motion';
import { haptic } from '../lib/haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onClick: () => void;
  completed?: boolean;
}

export default function WorkoutCard({ workout, onClick, completed = false }: WorkoutCardProps) {
  const { t } = useLanguage();
  return (
    <motion.button
      type="button"
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      onClick={() => {
        haptic.light();
        onClick();
      }}
      className={cn(
        'press group relative w-full overflow-hidden rounded-2xl border text-left transition-colors duration-300 sm:rounded-3xl',
        completed
          ? 'border-success/40 bg-success/[0.06] hover:border-success/60'
          : 'border-hair bg-surface-1 hover:border-brand/40 active:border-brand/30'
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-soft opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 space-y-2.5 p-3 sm:space-y-5 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md border border-brand/20 bg-brand-soft px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.15em] text-brand sm:text-[9px]">
                Series {workout.id % 2 === 0 ? 'B' : 'A'}
              </span>
              <span className="rounded-md border border-hair bg-glass px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-txt-mid sm:text-[9px]">
                {workout.difficulty}
              </span>
              {completed && (
                <span className="inline-flex items-center gap-1 rounded-md border border-success/40 bg-success/15 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.15em] text-success sm:text-[9px]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                  {t('workout.done')}
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-black uppercase italic tracking-tight text-txt-hi transition-colors group-hover:text-brand sm:text-display-md">
              {workout.name}
            </h3>
          </div>
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-soft transition-transform group-hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl',
              completed
                ? 'border-success/40 bg-success/15 text-success'
                : 'border-hair bg-surface-3 text-brand'
            )}
          >
            {completed ? (
              <Check className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={3} />
            ) : (
              <Dumbbell className="h-4 w-4 fill-current sm:h-6 sm:w-6" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-hair pt-2 sm:pt-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-txt-lo">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0 text-brand" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{workout.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 shrink-0 text-brand" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{workout.exercises.length} Drills</span>
            </div>
          </div>

          <div className={cn('flex shrink-0 items-center gap-1.5', completed ? 'text-success' : 'text-brand')}>
            <span className="hidden text-[9px] font-black uppercase tracking-[0.15em] sm:inline">
              {completed ? t('workout.review') : t('workout.start')}
            </span>
            <div className={cn('rounded-full p-1.5', completed ? 'bg-success/15' : 'bg-brand-soft')}>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 sm:h-4 sm:w-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
