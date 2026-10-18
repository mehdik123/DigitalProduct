import { Clock, List, ChevronRight, Check } from 'lucide-react';
import { WorkoutDay } from '../types/workout';
import { haptic } from '../lib/haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { dayName, localizeMinutes } from '../i18n/content';
import { cn } from '../lib/utils';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onClick: () => void;
  completed?: boolean;
  /** 1-based day index for the tile numeral. */
  dayIndex?: number;
  /** Highlight as the next session (red tile). */
  isNext?: boolean;
}

/** P04 day row: 76px, numeral tile, meta, chevron. */
export default function WorkoutCard({
  workout,
  onClick,
  completed = false,
  dayIndex,
  isNext = false,
}: WorkoutCardProps) {
  const { t } = useLanguage();
  const n = dayIndex ?? 1;

  return (
    <button
      type="button"
      onClick={() => {
        haptic.light();
        onClick();
      }}
      className="flex h-[76px] w-full items-center gap-3.5 rounded-2xl bg-surface-1 px-3.5 text-left transition-[transform,background-color] duration-150 ease-smooth active:scale-[0.985] active:bg-surface-2"
    >
      <span
        className={cn(
          'grid h-[46px] w-[46px] shrink-0 place-items-center rounded-xl font-display text-xl font-semibold tabular-nums',
          isNext && !completed
            ? 'bg-brand text-white'
            : completed
              ? 'bg-surface-3 text-txt-hi'
              : 'bg-surface-2 text-txt-mid'
        )}
      >
        {completed ? <Check className="h-5 w-5" strokeWidth={2} /> : n}
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[17px] font-semibold text-txt-hi">{dayName(t, workout.name)}</div>
        <div className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-txt-mid">
          <Clock className="h-3.5 w-3.5 text-txt-lo" strokeWidth={2} />
          <span>{localizeMinutes(t, workout.duration)}</span>
          <span className="mx-1.5 h-[11px] w-px bg-hair-strong" />
          <List className="h-3.5 w-3.5 text-txt-lo" strokeWidth={2} />
          <span>
            {workout.exercises.length} {t('home.exercises')}
          </span>
        </div>
      </div>

      <span className="flex shrink-0 items-center text-txt-lo">
        {isNext && !completed && (
          <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            {t('home.upNext')}
          </span>
        )}
        <ChevronRight className="h-5 w-5 rtl:rotate-180" strokeWidth={1.75} />
      </span>
    </button>
  );
}
