import { Exercise } from '../types/workout';

/** How the user should enter load in the logger. */
export type WeightEntryMode = 'bar_total' | 'dumbbell_each' | 'machine' | 'bodyweight';

export type DumbbellJumpKg = 1 | 2 | 2.5;

export const DEFAULT_DUMBBELL_JUMP: DumbbellJumpKg = 2.5;

/** Rep ladder: 8 → 10 → 12 → 14, then reset to 8 + weight jump. Never prescribe 15+. */
export const REP_LADDER = [8, 10, 12, 14] as const;
export const RESET_REPS = 8;

export interface LoggedProgressSet {
  reps: number;
  weight: number;
  logged: boolean;
}

export interface NextTarget {
  reps: number;
  weight: number | null;
}

interface ExerciseRule {
  /** kg added when reps reset to 8 (total bar / stack / per dumbbell as logged). */
  jumpKg: number;
  /** True for BW movements that may later take added load. */
  bodyweight: boolean;
  /** Never increase load on reset (pike / diamond / neutral-grip pull-ups). */
  neverAddLoad: boolean;
  weightEntry: WeightEntryMode;
}

const RULES: Record<string, ExerciseRule> = {
  'barbell-skull-crushers': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'incline-barbell-bench-smith': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  dips: { jumpKg: 5, bodyweight: true, neverAddLoad: false, weightEntry: 'bodyweight' },
  'standing-db-lateral-raises': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
  'standing-db-lateral-raises-day5': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
  'pike-push-ups': { jumpKg: 0, bodyweight: true, neverAddLoad: true, weightEntry: 'bodyweight' },
  'wide-grip-lat-pulldowns': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'barbell-bent-over-rows': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'straight-bar-bicep-curls': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'high-bar-back-squats': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'machine-leg-extensions': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'machine-leg-extensions-day2': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'leg-press': { jumpKg: 20, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'prone-leg-curls': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'prone-leg-curls-day4': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'dumbbell-rdl': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
  'calf-raises-in': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'calf-raises-in-day4': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'calf-raises-out': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'calf-raises-out-day4': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'flat-barbell-bench': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'pull-ups': { jumpKg: 2.5, bodyweight: true, neverAddLoad: false, weightEntry: 'bodyweight' },
  'pull-ups-day5': { jumpKg: 2.5, bodyweight: true, neverAddLoad: false, weightEntry: 'bodyweight' },
  'reverse-grip-bent-rows': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'seated-lateral-raises': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
  'db-rear-delt-kickbacks': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
  'chin-ups': { jumpKg: 2.5, bodyweight: true, neverAddLoad: false, weightEntry: 'bodyweight' },
  'overhead-cable-triceps': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'overhead-cable-triceps-day5': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'diamond-push-ups': { jumpKg: 0, bodyweight: true, neverAddLoad: true, weightEntry: 'bodyweight' },
  'front-squats-smith': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'front-squats-smith-day4': { jumpKg: 10, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'jump-squats': { jumpKg: 2.5, bodyweight: true, neverAddLoad: false, weightEntry: 'bodyweight' },
  'adductor-machine': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'machine' },
  'incline-db-bench': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
  'push-ups': { jumpKg: 5, bodyweight: true, neverAddLoad: false, weightEntry: 'bodyweight' },
  'neutral-grip-pull-ups': { jumpKg: 0, bodyweight: true, neverAddLoad: true, weightEntry: 'bodyweight' },
  'wide-grip-ez-curls': { jumpKg: 5, bodyweight: false, neverAddLoad: false, weightEntry: 'bar_total' },
  'db-hammer-curls': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
  'dumbbell-lunges': { jumpKg: 2.5, bodyweight: false, neverAddLoad: false, weightEntry: 'dumbbell_each' },
};

const FALLBACK: ExerciseRule = {
  jumpKg: 2.5,
  bodyweight: false,
  neverAddLoad: false,
  weightEntry: 'machine',
};

export function getExerciseRule(exerciseId: string): ExerciseRule {
  return RULES[exerciseId] ?? FALLBACK;
}

export function getWeightEntryMode(exercise: Exercise): WeightEntryMode {
  const rule = getExerciseRule(exercise.id);
  if (exercise.type === 'calisthenics' || rule.bodyweight) return rule.weightEntry;
  if (exercise.progressionType === 'dumbbell') return 'dumbbell_each';
  if (exercise.progressionType === 'barbell_compound' || exercise.progressionType === 'barbell_upper') {
    return 'bar_total';
  }
  return rule.weightEntry;
}

export function allowsLoggedWeight(exercise: Exercise): boolean {
  const rule = getExerciseRule(exercise.id);
  if (rule.neverAddLoad) return false;
  return true;
}

const roundToHalf = (n: number) => Math.round(n * 2) / 2;

function sameLoad(a: number, b: number): boolean {
  return roundToHalf(a) === roundToHalf(b);
}

function jumpFor(exercise: Exercise, dumbbellJump: DumbbellJumpKg): number {
  const rule = getExerciseRule(exercise.id);
  if (rule.neverAddLoad) return 0;
  if (rule.weightEntry === 'dumbbell_each') return dumbbellJump;
  return rule.jumpKg;
}

/**
 * Progressive overload for one exercise → next week's uniform targets.
 * Same movement on two days is two separate logs (caller passes day-scoped sets).
 */
export function computeNextTarget(
  exercise: Exercise,
  sets: LoggedProgressSet[],
  opts: { expectedSets: number; dumbbellJump?: DumbbellJumpKg } = { expectedSets: 3 }
): NextTarget {
  const rule = getExerciseRule(exercise.id);
  const dumbbellJump = opts.dumbbellJump ?? DEFAULT_DUMBBELL_JUMP;
  const expected = Math.max(1, opts.expectedSets);

  const logged = sets.filter((s) => s.logged);
  const anyMissing = logged.length < expected || sets.some((s) => !s.logged);

  const weightOf = (s: LoggedProgressSet) => roundToHalf(s.weight || 0);
  const repsOf = (s: LoggedProgressSet) => Math.max(0, Math.round(s.reps || 0));

  // 1) Every set is 0 reps → 8 reps, weight stays.
  if (logged.length > 0 && logged.every((s) => repsOf(s) === 0)) {
    const w = logged.reduce((m, s) => Math.max(m, weightOf(s)), 0);
    return { reps: RESET_REPS, weight: rule.bodyweight && w <= 0 ? null : w };
  }

  const working = logged.filter((s) => repsOf(s) > 0);
  if (working.length === 0) {
    return { reps: RESET_REPS, weight: rule.bodyweight ? null : 0 };
  }

  const bestReps = Math.max(...working.map(repsOf));
  const bestWeight = Math.max(...working.map(weightOf));

  // 2) Non-bodyweight still at 0 kg → unchanged (copy best logged, no progress).
  if (!rule.bodyweight && bestWeight <= 0) {
    return { reps: bestReps, weight: 0 };
  }

  const allMatch =
    working.length > 0 &&
    working.every((s) => repsOf(s) === repsOf(working[0]) && sameLoad(weightOf(s), weightOf(working[0])));

  // Incomplete log, or sets don't match → copy best set onto every set (no jump).
  if (anyMissing || !allMatch) {
    return {
      reps: bestReps,
      weight: rule.bodyweight && bestWeight <= 0 ? null : bestWeight,
    };
  }

  // 4) Every counting set matches → climb the ladder (+2), or reset + jump.
  const matchedReps = repsOf(working[0]);
  const matchedWeight = weightOf(working[0]);
  const atZeroBw = rule.bodyweight && matchedWeight <= 0;

  const shouldReset = matchedReps >= 13;
  if (shouldReset) {
    let nextWeight = matchedWeight;
    if (rule.neverAddLoad) {
      nextWeight = matchedWeight;
    } else if (atZeroBw) {
      nextWeight = 0;
    } else {
      // Bodyweight only gains jump after added weight already exists; loaded lifts always jump.
      nextWeight = roundToHalf(matchedWeight + jumpFor(exercise, dumbbellJump));
    }
    return {
      reps: RESET_REPS,
      weight: rule.bodyweight && nextWeight <= 0 ? null : nextWeight,
    };
  }

  const nextReps = Math.min(matchedReps + 2, 14);
  return {
    reps: nextReps,
    weight: rule.bodyweight && matchedWeight <= 0 ? null : matchedWeight,
  };
}
