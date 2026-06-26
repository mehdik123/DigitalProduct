import { ProgressionType } from '../types/workout';

export const TOTAL_WEEKS = 12;

export type PhaseId =
  | 'anatomical'
  | 'hypertrophy'
  | 'deload'
  | 'strength'
  | 'peak'
  | 'retest';

export interface PhaseWeek {
  week: number;
  phase: PhaseId;
  phaseLabelKey: string;
  repRange: [number, number] | null;
  targetRPE: number | null;
  rpeText: string;
  isDeload: boolean;
  isRetest: boolean;
}

const make = (
  week: number,
  phase: PhaseId,
  repRange: [number, number] | null,
  targetRPE: number | null,
  rpeText: string,
  opts: { isDeload?: boolean; isRetest?: boolean } = {}
): PhaseWeek => ({
  week,
  phase,
  phaseLabelKey: `phase.${phase}`,
  repRange,
  targetRPE,
  rpeText,
  isDeload: opts.isDeload ?? false,
  isRetest: opts.isRetest ?? false,
});

export const PHASE_MAP: Record<number, PhaseWeek> = {
  1: make(1, 'anatomical', [8, 12], 7, '7'),
  2: make(2, 'anatomical', [8, 12], 7, '7'),
  3: make(3, 'hypertrophy', [8, 10], 8, '8'),
  4: make(4, 'hypertrophy', [8, 10], 8, '8'),
  5: make(5, 'hypertrophy', [8, 10], 8, '8'),
  6: make(6, 'deload', [8, 10], 6, '6', { isDeload: true }),
  7: make(7, 'strength', [5, 7], 9, '8-9'),
  8: make(8, 'strength', [5, 7], 9, '8-9'),
  9: make(9, 'strength', [5, 7], 9, '8-9'),
  10: make(10, 'peak', [3, 5], 9, '9'),
  11: make(11, 'peak', [3, 5], 9, '9'),
  12: make(12, 'retest', null, null, '-', { isDeload: true, isRetest: true }),
};

export function getPhase(week: number): PhaseWeek {
  return PHASE_MAP[week] ?? PHASE_MAP[1];
}

export function isDeloadWeek(week: number): boolean {
  return getPhase(week).isDeload;
}

export function isRetestWeek(week: number): boolean {
  return getPhase(week).isRetest;
}

/**
 * Default load increment (kg) applied by the double-progression engine
 * once the top of the rep range is hit across all working sets.
 * Editable defaults — keep in sync with the SQL engine (011_program_engine.sql).
 */
export const INCREMENTS: Record<ProgressionType, number> = {
  barbell_compound: 5,
  barbell_upper: 2.5,
  dumbbell: 2,
  machine: 5,
  isolation: 1.5,
  calisthenics: 2.5,
};

/** Deload overrides (week 6 and 12). */
export const DELOAD_LOAD_FACTOR = 0.6;
export const DELOAD_SET_FACTOR = 0.5;

/**
 * Key lifts measured at Week 0 baseline and re-tested at Week 12.
 * IDs must match exercise IDs in workoutData.ts.
 */
export const KEY_LIFTS: string[] = [
  'high-bar-back-squats',
  'deadlifts',
  'flat-barbell-bench',
  'barbell-bent-over-rows',
];

export const KEY_LIFT_LABELS: Record<string, string> = {
  'high-bar-back-squats': 'High Bar Back Squat',
  'deadlifts': 'Deadlift',
  'flat-barbell-bench': 'Flat Barbell Bench Press',
  'barbell-bent-over-rows': 'Barbell Bent Over Row',
};
