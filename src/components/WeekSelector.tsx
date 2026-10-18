import { Check, Lock } from 'lucide-react';
import { TOTAL_WEEKS } from '../data/programConfig';
import { WeekStatus } from '../services/workoutService';
import { useLanguage } from '../contexts/LanguageContext';
import { haptic } from '../lib/haptics';
import { cn } from '../lib/utils';

interface WeekSelectorProps {
  currentWeek: number;
  weeks: Record<number, WeekStatus>;
  onWeekSelect: (week: number) => void;
  onLockedSelect?: (week: number) => void;
}

/** P04 week grid: 8 equal cells — now / done / locked. */
export default function WeekSelector({
  currentWeek,
  weeks,
  onWeekSelect,
  onLockedSelect,
}: WeekSelectorProps) {
  const { t } = useLanguage();
  const list = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  const statusOf = (week: number): WeekStatus => weeks[week] ?? 'locked';

  return (
    <div className="grid grid-cols-8 gap-[5px]">
      {list.map((week) => {
        const status = statusOf(week);
        const isNow = week === currentWeek;
        const isDone = status === 'completed' && !isNow;
        const isLocked = status === 'locked';

        return (
          <button
            key={week}
            type="button"
            onClick={() => {
              haptic.light();
              if (isLocked) onLockedSelect?.(week);
              else onWeekSelect(week);
            }}
            aria-disabled={isLocked}
            aria-current={isNow ? 'true' : undefined}
            className={cn(
              'flex h-[58px] flex-col items-center justify-center gap-1.5 rounded-[10px] transition-colors',
              isNow && 'bg-brand',
              !isNow && 'bg-surface-1',
              isLocked && 'opacity-90'
            )}
          >
            <span
              className={cn(
                'font-display text-[21px] font-semibold leading-none tabular-nums',
                isNow ? 'text-white' : isDone ? 'text-txt-hi' : 'text-txt-lo'
              )}
            >
              {week}
            </span>
            <span
              className={cn(
                'flex h-2.5 items-center text-[9px] font-semibold uppercase tracking-[0.12em]',
                isNow ? 'text-white' : isDone ? 'text-txt-mid' : 'text-txt-lo'
              )}
            >
              {isNow ? (
                t('week.now')
              ) : isDone ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Lock className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
