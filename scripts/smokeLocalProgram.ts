/**
 * Offline smoke test: 8-week config + local progressive overload, no Supabase.
 * Run: npx tsx scripts/smokeLocalProgram.ts
 */
import { TOTAL_WEEKS, PHASE_MAP, getPhase, isDeloadWeek } from '../src/data/programConfig';
import {
  ensureLocalProgram,
  getLocalProgramState,
  saveLocalDaySets,
  getLocalDaySets,
} from '../src/services/localProgram';
import { getWorkoutSplit } from '../src/data/workoutData';

const mem = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => {
    mem.set(k, v);
  },
  removeItem: (k: string) => {
    mem.delete(k);
  },
  clear: () => mem.clear(),
  key: () => null,
  length: 0,
};
(globalThis as any).window = globalThis;

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

assert(TOTAL_WEEKS === 8, `TOTAL_WEEKS should be 8, got ${TOTAL_WEEKS}`);
assert(Object.keys(PHASE_MAP).length === 8, 'PHASE_MAP should have 8 weeks');
assert(isDeloadWeek(5), 'Week 5 should be deload');
assert(getPhase(8).phase === 'peak', 'Week 8 should be peak');
assert(!getPhase(8).isRetest, 'Week 8 should not be cloud retest');

const userId = 'smoke-user';
ensureLocalProgram(userId, 3);
const state0 = getLocalProgramState(userId, 3);
assert(state0.currentWeek === 1, 'fresh program starts at week 1');
assert(Object.keys(state0.weeks).length === 8, 'local weeks map has 8 entries');

const split = getWorkoutSplit(3);
const day = split[0];
const exercise = day.exercises[0];

const sets = Array.from({ length: exercise.sets }, (_, i) => ({
  setNumber: i + 1,
  reps: 12,
  weight: 20,
  targetReps: 8,
  targetWeight: 20,
  completed: true,
}));

// Log every exercise on every day of week 1 so the week completes.
for (const d of split) {
  for (const ex of d.exercises) {
    const need = ex.sets;
    const logged = Array.from({ length: need }, (_, i) => ({
      setNumber: i + 1,
      reps: 12,
      weight: 20,
      targetReps: 8,
      targetWeight: 20,
      completed: true,
    }));
    saveLocalDaySets(userId, 1, d.id, ex, logged as any);
  }
}

const after = getLocalProgramState(userId, 3);
assert(after.weeks[1] === 'completed', 'week 1 completed');
assert(after.currentWeek === 2, `should unlock week 2, got ${after.currentWeek}`);
assert(after.weeks[2] === 'active', 'week 2 active');

const nextTargets = getLocalDaySets(userId, 2, day.id, exercise.id);
assert(nextTargets.length > 0, 'week 2 has generated targets');
const sampleW = nextTargets[0]?.targetWeight ?? 0;
assert(sampleW >= 20, `expected load bump or hold from 20kg, got ${sampleW}`);

console.log('smokeLocalProgram OK', {
  TOTAL_WEEKS,
  deload: 5,
  peak: 8,
  unlocked: after.currentWeek,
  sampleTarget: nextTargets[0],
  firstExercise: exercise.id,
  setsLoggedShape: sets.length,
});
