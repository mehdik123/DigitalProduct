import { getWorkoutSplit, DaysPerWeek } from '../data/workoutData';
import { isDeloadWeek } from '../data/programConfig';
import { getLocalCompletedCount, isLocalDayComplete } from '../services/localProgram';
import { dayName } from '../i18n/content';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function getExpectedSetCountForWeek(week: number, daysPerWeek?: DaysPerWeek | number): number {
  const deload = isDeloadWeek(week);
  return getWorkoutSplit(daysPerWeek).reduce(
    (sum, day) =>
      sum + day.exercises.reduce((s, e) => s + (deload ? Math.max(1, Math.floor(e.sets / 2)) : e.sets), 0),
    0
  );
}

export function getNextWorkoutName(
  userId: string,
  week: number,
  daysPerWeek: DaysPerWeek | number | undefined,
  t: Translate
): string | null {
  const split = getWorkoutSplit(daysPerWeek);
  for (const day of split) {
    if (!isLocalDayComplete(userId, week, day.id)) {
      return dayName(t, day.name);
    }
  }
  return null;
}

export function getWeekSetProgress(
  userId: string,
  week: number,
  daysPerWeek?: DaysPerWeek | number
): { done: number; total: number } {
  return {
    done: getLocalCompletedCount(userId, week),
    total: getExpectedSetCountForWeek(week, daysPerWeek),
  };
}
