import { ProgressionType } from '../types/workout';
import { INCREMENTS, getPhase, DELOAD_LOAD_FACTOR } from '../data/programConfig';

export interface LoggedSet {
  actualReps: number;
  actualWeight: number;
}

export interface TargetPreview {
  weight: number;
  reps: number;
  repRange: [number, number] | null;
  rpeText: string;
}

const roundToHalf = (n: number) => Math.round(n * 2) / 2;

/**
 * Pure TypeScript mirror of the server double-progression engine
 * (see 011_program_engine.sql). Used ONLY to preview the upcoming
 * week's target in the UI — the server remains the source of truth.
 *
 * Given the sets logged in `fromWeek`, returns the target for `fromWeek + 1`.
 */
export function previewNextTarget(
  fromWeek: number,
  progressionType: ProgressionType,
  lastSets: LoggedSet[]
): TargetPreview {
  const next = fromWeek + 1;
  const nextPhase = getPhase(next);
  const [lo, hi] = nextPhase.repRange ?? [getPhase(fromWeek).repRange?.[0] ?? 5, getPhase(fromWeek).repRange?.[1] ?? 8];
  const topThisWeek = getPhase(fromWeek).repRange?.[1] ?? hi;
  const increment = INCREMENTS[progressionType];

  const lastWeight = lastSets.length ? Math.max(...lastSets.map((s) => s.actualWeight || 0)) : 0;
  const minReps = lastSets.length ? Math.min(...lastSets.map((s) => s.actualReps || 0)) : 0;
  const allHitTop = lastSets.length > 0 && lastSets.every((s) => (s.actualReps || 0) >= topThisWeek);

  let weight: number;
  let reps: number;

  if (nextPhase.isDeload) {
    weight = roundToHalf(lastWeight * DELOAD_LOAD_FACTOR);
    reps = lo;
  } else if (allHitTop) {
    weight = roundToHalf(lastWeight + increment);
    reps = lo;
  } else {
    weight = roundToHalf(lastWeight);
    reps = Math.min(minReps + 1, hi);
  }

  return {
    weight,
    reps,
    repRange: nextPhase.repRange,
    rpeText: nextPhase.rpeText,
  };
}
