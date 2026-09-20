import {
  getLocalCompletedCount,
  getLocalProgramState,
  isLocalDayComplete,
} from '../services/localProgram';
import { getWorkoutSplit, DaysPerWeek } from '../data/workoutData';
import { TOTAL_WEEKS } from '../data/programConfig';

export type MilestoneId =
  | 'first_set'
  | 'first_day'
  | 'week2'
  | 'three_days'
  | 'week4'
  | 'deload'
  | 'strength'
  | 'peak'
  | 'retest'
  | 'complete';

export interface MilestoneDef {
  id: MilestoneId;
  icon: 'zap' | 'check' | 'unlock' | 'flame' | 'target' | 'trophy' | 'star' | 'shield' | 'flag' | 'crown';
  titleKey: string;
  bodyKey: string;
}

/** Ordered list. Unlock order is independent; display order stays fixed. */
export const MILESTONES: MilestoneDef[] = [
  { id: 'first_set', icon: 'zap', titleKey: 'milestone.first_set.title', bodyKey: 'milestone.first_set.body' },
  { id: 'first_day', icon: 'check', titleKey: 'milestone.first_day.title', bodyKey: 'milestone.first_day.body' },
  { id: 'week2', icon: 'unlock', titleKey: 'milestone.week2.title', bodyKey: 'milestone.week2.body' },
  { id: 'three_days', icon: 'flame', titleKey: 'milestone.three_days.title', bodyKey: 'milestone.three_days.body' },
  { id: 'week4', icon: 'target', titleKey: 'milestone.week4.title', bodyKey: 'milestone.week4.body' },
  { id: 'deload', icon: 'shield', titleKey: 'milestone.deload.title', bodyKey: 'milestone.deload.body' },
  { id: 'strength', icon: 'star', titleKey: 'milestone.strength.title', bodyKey: 'milestone.strength.body' },
  { id: 'peak', icon: 'flag', titleKey: 'milestone.peak.title', bodyKey: 'milestone.peak.body' },
  { id: 'retest', icon: 'trophy', titleKey: 'milestone.retest.title', bodyKey: 'milestone.retest.body' },
  { id: 'complete', icon: 'crown', titleKey: 'milestone.complete.title', bodyKey: 'milestone.complete.body' },
];

const storageKey = (userId: string) => `hybrid_milestones_v1_${userId}`;

function readUnlocked(userId: string): Set<MilestoneId> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr.filter((id): id is MilestoneId => MILESTONES.some((m) => m.id === id)));
  } catch {
    return new Set();
  }
}

function writeUnlocked(userId: string, set: Set<MilestoneId>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify([...set]));
}

export function getUnlockedMilestones(userId: string): MilestoneId[] {
  return [...readUnlocked(userId)];
}

export function getMilestoneProgress(userId: string): { done: number; total: number } {
  return { done: readUnlocked(userId).size, total: MILESTONES.length };
}

function countCompletedDays(userId: string, daysPerWeek?: DaysPerWeek | number): number {
  const split = getWorkoutSplit(daysPerWeek);
  let n = 0;
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    for (const day of split) {
      if (isLocalDayComplete(userId, w, day.id)) n += 1;
    }
  }
  return n;
}

function countDistinctDayTypesDone(userId: string, daysPerWeek?: DaysPerWeek | number): number {
  const split = getWorkoutSplit(daysPerWeek);
  let distinct = 0;
  for (const day of split) {
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      if (isLocalDayComplete(userId, w, day.id)) {
        distinct += 1;
        break;
      }
    }
  }
  return distinct;
}

export interface MilestoneContext {
  userId: string;
  daysPerWeek?: DaysPerWeek | number;
  dayJustCompleted?: boolean;
  setsLoggedThisWeek?: number;
  unlockedWeek?: number;
  programFinal?: boolean;
}

/**
 * Evaluates progress and returns newly unlocked milestones (in display order).
 * Each milestone unlocks once per account on this device.
 */
export function evaluateMilestones(ctx: MilestoneContext): MilestoneDef[] {
  const unlocked = readUnlocked(ctx.userId);
  const state = getLocalProgramState(ctx.userId, ctx.daysPerWeek);
  const currentWeek = Math.max(state.currentWeek, ctx.unlockedWeek ?? 0);
  const setsNow =
    ctx.setsLoggedThisWeek ?? getLocalCompletedCount(ctx.userId, state.currentWeek);
  const distinctDays = countDistinctDayTypesDone(ctx.userId, ctx.daysPerWeek);
  const anyDayDone = countCompletedDays(ctx.userId, ctx.daysPerWeek) > 0 || Boolean(ctx.dayJustCompleted);

  const checks: Record<MilestoneId, boolean> = {
    first_set: setsNow > 0 || getLocalCompletedCount(ctx.userId, 1) > 0,
    first_day: anyDayDone,
    week2: currentWeek >= 2,
    three_days: distinctDays >= 3,
    week4: currentWeek >= 4,
    deload: currentWeek >= 6,
    strength: currentWeek >= 7,
    peak: currentWeek >= 10,
    retest: currentWeek >= 12,
    complete: Boolean(ctx.programFinal) || state.weeks[12] === 'completed',
  };

  const newly: MilestoneDef[] = [];
  for (const m of MILESTONES) {
    if (!unlocked.has(m.id) && checks[m.id]) {
      unlocked.add(m.id);
      newly.push(m);
    }
  }

  if (newly.length) writeUnlocked(ctx.userId, unlocked);
  return newly;
}

export function getMilestoneById(id: MilestoneId): MilestoneDef | undefined {
  return MILESTONES.find((m) => m.id === id);
}
