import { Dumbbell, Clock, Zap, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkoutDay } from '../types/workout';
import { itemVariants, spring, tapSubtle } from '../design/motion';
import { haptic } from '../lib/haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { dayName, difficultyLabel, localizeMinutes } from '../i18n/content';
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
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={tapSubtle}
      transition={spring.snappy}
      onClick={() => {
        haptic.light();
        onClick();
      }}
      className={cn(
        'group relative w-full overflow-hidden rounded-[1.35rem] border text-left backdrop-blur-sm transition-[border-color,box-shadow] duration-300',
        completed
          ? 'border-success/35 bg-success/[0.07] shadow-[0_4px_24px_rgba(34,197,94,0.08)]'
          : 'border-white/10 bg-surface-1/80 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:border-brand/45 hover:shadow-[0_8px_32px_rgba(255,45,85,0.15)]'
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/25 opacity-0 blur-3xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-110" />

      <div className="relative z-10 flex items-center gap-2.5 p-2.5 sm:gap-3 sm:p-3.5">
        {/* Icon tile */}
        <motion.div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-soft sm:h-11 sm:w-11',
            completed
              ? 'border-success/40 bg-success/15 text-success'
              : 'border-brand/25 bg-gradient-to-br from-brand/20 to-brand/5 text-brand'
          )}
          whileHover={{ rotate: completed ? 0 : [-2, 2, 0] }}
          transition={{ duration: 0.4 }}
        >
          {completed ? (
            <Check className="h-4 w-4" strokeWidth={3} />
          ) : (
            <Dumbbell className="h-4 w-4 fill-current" />
          )}
        </motion.div>

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-full border border-brand/25 bg-brand/10 px-1.5 py-px text-[7px] font-black uppercase tracking-[0.14em] text-brand sm:text-[8px]">
              {t('workout.series')} {workout.id % 2 === 0 ? 'B' : 'A'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-px text-[7px] font-bold uppercase tracking-wider text-txt-lo sm:text-[8px]">
              {difficultyLabel(t, workout.difficulty)}
            </span>
            {completed && (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-success/35 bg-success/10 px-1.5 py-px text-[7px] font-black uppercase tracking-[0.12em] text-success">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                {t('workout.done')}
              </span>
            )}
          </div>

          <h3 className="truncate font-display text-base font-black uppercase italic leading-none tracking-tight text-txt-hi transition-colors group-hover:text-brand sm:text-lg">
            {dayName(t, workout.name)}
          </h3>

          <div className="flex items-center gap-2.5 text-txt-lo">
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide">
              <Clock className="h-3 w-3 shrink-0 text-brand/80" />
              {localizeMinutes(t, workout.duration)}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-txt-lo/50" />
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide">
              <Zap className="h-3 w-3 shrink-0 text-brand/80" />
              {workout.exercises.length} {t('workout.drills')}
            </span>
          </div>
        </div>

        {/* CTA arrow */}
        <motion.div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            completed ? 'bg-success/15 text-success' : 'bg-grad-red text-white shadow-red'
          )}
          whileHover={{ scale: 1.08, x: 2 }}
          transition={spring.snappy}
        >
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" strokeWidth={3} />
        </motion.div>
      </div>
    </motion.button>
  );
}
