import { Exercise, ProgressionType } from '../types/workout';
import { getPhase } from '../data/programConfig';
import { computeNextTarget, DEFAULT_DUMBBELL_JUMP } from '../data/exerciseProgression';

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

/**
 * Preview next-week targets from logged sets (mirrors localProgram engine).
 * Prefer passing a real `exercise` when available so jumps / BW rules apply.
 */
export function previewNextTarget(
  fromWeek: number,
  progressionType: ProgressionType,
  lastSets: LoggedSet[],
  exercise?: Exercise
): TargetPreview {
  const next = fromWeek + 1;
  const nextPhase = getPhase(next);

  const stub: Exercise =
    exercise ??
    ({
      id: `preview-${progressionType}`,
      name: 'Preview',
      type: progressionType === 'calisthenics' ? 'calisthenics' : 'bodybuilding',
      progressionType,
      sets: Math.max(1, lastSets.length),
      reps: '8',
      rest: '2 min',
    } satisfies Exercise);

  const logged = lastSets.map((s) => ({
    reps: s.actualReps,
    weight: s.actualWeight,
    logged: true,
  }));

  const { reps, weight } = computeNextTarget(stub, logged, {
    expectedSets: Math.max(1, lastSets.length),
    dumbbellJump: DEFAULT_DUMBBELL_JUMP,
  });

  return {
    weight: weight ?? 0,
    reps,
    repRange: nextPhase.repRange,
    rpeText: nextPhase.rpeText,
  };
}
