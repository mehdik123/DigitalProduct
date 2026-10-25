import { ExerciseSet, Exercise, WorkoutDay } from '../types/workout';
import { getWorkoutSplit, DaysPerWeek } from '../data/workoutData';
import { getPhase, isDeloadWeek, TOTAL_WEEKS } from '../data/programConfig';
import {
  computeNextTarget,
  DEFAULT_DUMBBELL_JUMP,
  type DumbbellJumpKg,
} from '../data/exerciseProgression';
import type { WeekStatus, ProgramState, CloudSet } from './workoutService';

/**
 * Offline-first program engine.
 *
 * The app stays fully usable without a network connection: every set the user
 * logs is written to localStorage instantly, week unlocking + progressive
 * overload are computed on the device. localStorage is the source of truth.
 *
 * Rules (progressive overload spec):
 *  - Week N+1 unlocks only when EVERY set of EVERY exercise across ALL days of
 *    week N has been logged.
 *  - Per exercise (day-scoped): mismatched sets → copy best set; matched sets
 *    climb 8→10→12→14 (+2), then reset to 8 and add the exercise jump.
 *  - Barbell / Smith loads are total on the bar; dumbbells are one side.
 */

const DELOAD_LOAD_FACTOR = 0.6;

interface StoredSet {
  setNumber: number;
  targetReps: number;
  targetWeight: number | null;
  reps: number | null;
  weight: number | null;
  logged: boolean;
}

type WeekLogs = Record<number, Record<string, StoredSet[]>>; // day_id -> exercise_id -> sets

interface Store {
  version: 1;
  daysPerWeek: DaysPerWeek;
  currentWeek: number;
  weeks: Record<number, WeekStatus>;
  logs: Record<number, WeekLogs>; // week -> day -> exercise -> sets
  /** Optional override for dumbbell side jumps (default 2.5 kg). */
  dumbbellJumpKg?: DumbbellJumpKg;
}

const DEFAULT_DAYS: DaysPerWeek = 5;
const storageKey = (userId: string) => `ha_program_v1_${userId}`;

function isCalisthenics(exercise: Exercise): boolean {
  return exercise.type === 'calisthenics';
}

/** The workout split this store's user is enrolled in. */
function splitOf(store: Store): WorkoutDay[] {
  return getWorkoutSplit(store.daysPerWeek);
}

/**
 * Deterministic week-1 target reps seeded by exercise id (base range 6–10).
 * 7 → 8 and 9 → 10; 6, 8, and 10 stay as-is.
 */
export function seedReps(exerciseId: string): number {
  let h = 0;
  for (let i = 0; i < exerciseId.length; i++) {
    h = (h * 31 + exerciseId.charCodeAt(i)) >>> 0;
  }
  const raw = 6 + (h % 5); // 6..10 inclusive
  if (raw === 7) return 8;
  if (raw === 9) return 10;
  return raw;
}

function expectedSets(exercise: Exercise, week: number): number {
  return isDeloadWeek(week)
    ? Math.max(1, Math.floor(exercise.sets / 2))
    : exercise.sets;
}

function round(value: number): number {
  return Math.round(value * 2) / 2;
}

/** Builds fresh (unlogged) target sets for week 1. */
function buildWeek1Targets(split: WorkoutDay[]): WeekLogs {
  const week: WeekLogs = {};
  for (const day of split) {
    week[day.id] = {};
    for (const ex of day.exercises) {
      const count = expectedSets(ex, 1);
      const reps = seedReps(ex.id);
      week[day.id][ex.id] = Array.from({ length: count }, (_, i) => ({
        setNumber: i + 1,
        targetReps: reps,
        targetWeight: null,
        reps: null,
        weight: null,
        logged: false,
      }));
    }
  }
  return week;
}

function normalizeDays(days?: DaysPerWeek | number | null): DaysPerWeek {
  return days === 3 || days === 4 || days === 5 ? days : DEFAULT_DAYS;
}

function createStore(daysPerWeek: DaysPerWeek = DEFAULT_DAYS): Store {
  const weeks: Record<number, WeekStatus> = {};
  for (let w = 1; w <= TOTAL_WEEKS; w++) weeks[w] = w === 1 ? 'active' : 'locked';
  return {
    version: 1,
    daysPerWeek,
    currentWeek: 1,
    weeks,
    logs: { 1: buildWeek1Targets(getWorkoutSplit(daysPerWeek)) },
  };
}

/**
 * Loads (or creates) the local store. `daysPerWeek` is only used the first time
 * a store is created for this user; once set it is never changed here (the
 * choice is irreversible and owned by the profile).
 */
/** Recompute unlogged next-week targets for every completed week (rule fixes). */
function repairProgressionTargets(store: Store): boolean {
  let changed = false;
  for (let w = 1; w < TOTAL_WEEKS; w++) {
    if (store.weeks?.[w] !== 'completed') continue;
    if (!isWeekComplete(store, w)) continue;
    const before = JSON.stringify(store.logs[w + 1] ?? null);
    generateNextWeek(store, w);
    if (JSON.stringify(store.logs[w + 1] ?? null) !== before) changed = true;
  }
  return changed;
}

function load(userId: string, daysPerWeek?: DaysPerWeek | number | null): Store {
  const days = normalizeDays(daysPerWeek);
  if (typeof window === 'undefined') return createStore(days);
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) {
      const fresh = createStore(days);
      save(userId, fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw) as Store;
    let dirty = false;
    if (!parsed.daysPerWeek) {
      parsed.daysPerWeek = days;
      dirty = true;
    }
    if (!parsed?.logs?.[1]) {
      parsed.logs = { ...(parsed.logs ?? {}), 1: buildWeek1Targets(splitOf(parsed)) };
      dirty = true;
    }
    if (repairProgressionTargets(parsed)) dirty = true;
    if (dirty) save(userId, parsed);
    return parsed;
  } catch {
    const fresh = createStore(days);
    save(userId, fresh);
    return fresh;
  }
}

/** True if the user has logged any set on this device. */
function hasAnyLoggedSets(store: Store): boolean {
  for (const week of Object.values(store.logs ?? {})) {
    for (const day of Object.values(week ?? {})) {
      for (const sets of Object.values(day ?? {})) {
        if ((sets ?? []).some((s) => s.logged)) return true;
      }
    }
  }
  return false;
}

/**
 * Ensures a local store exists for this user, seeded with their chosen program.
 * If the profile days-per-week differs and nothing has been logged yet, rebuilds
 * the store so a signup race (default 5) cannot stick forever.
 */
export function ensureLocalProgram(userId: string, daysPerWeek?: DaysPerWeek | number | null): DaysPerWeek {
  const desired = daysPerWeek != null ? normalizeDays(daysPerWeek) : null;
  const store = load(userId, desired ?? undefined);

  if (desired && store.daysPerWeek !== desired && !hasAnyLoggedSets(store)) {
    const fresh = createStore(desired);
    save(userId, fresh);
    return desired;
  }

  return store.daysPerWeek;
}

/** The days-per-week this device has recorded for the user. */
export function getLocalDaysPerWeek(userId: string): DaysPerWeek {
  return load(userId).daysPerWeek;
}

function save(userId: string, store: Store): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(store));
  } catch (e) {
    console.warn('[localProgram] failed to persist:', e);
  }
}

function toExerciseSets(stored: StoredSet[]): ExerciseSet[] {
  return stored.map((s) => ({
    setNumber: s.setNumber,
    reps: s.logged ? s.reps ?? 0 : s.targetReps ?? 0,
    weight: s.logged ? s.weight ?? 0 : s.targetWeight ?? 0,
    completed: s.logged,
    targetReps: s.targetReps ?? undefined,
    targetWeight: s.targetWeight ?? undefined,
  }));
}

function deriveState(store: Store): ProgramState {
  return { currentWeek: store.currentWeek, weeks: { ...store.weeks } };
}

/** Public: current program state (instant, local). */
export function getLocalProgramState(userId: string, daysPerWeek?: DaysPerWeek | number | null): ProgramState {
  return deriveState(load(userId, daysPerWeek));
}

/** Public: resolved sets for one exercise on a given week/day. */
export function getLocalDaySets(
  userId: string,
  week: number,
  dayId: number,
  exerciseId: string
): ExerciseSet[] {
  const store = load(userId);
  const stored = store.logs?.[week]?.[dayId]?.[exerciseId];
  if (stored && stored.length) return toExerciseSets(stored);

  // Fallback: synthesize targets if this week has not been generated yet.
  const day = splitOf(store).find((d) => d.id === dayId);
  const ex = day?.exercises.find((e) => e.id === exerciseId);
  if (!ex) return [];
  const count = expectedSets(ex, week);
  const reps = week === 1 ? seedReps(ex.id) : getPhase(week).repRange?.[0] ?? 8;
  return Array.from({ length: count }, (_, i) => ({
    setNumber: i + 1,
    reps,
    weight: 0,
    completed: false,
    targetReps: reps,
    targetWeight: undefined,
  }));
}

/** Count of logged sets across the whole week (all days). */
export function getLocalCompletedCount(userId: string, week: number): number {
  const store = load(userId);
  const weekLogs = store.logs?.[week];
  if (!weekLogs) return 0;
  let count = 0;
  for (const day of splitOf(store)) {
    const dayLogs = weekLogs[day.id];
    if (!dayLogs) continue;
    for (const ex of day.exercises) {
      count += (dayLogs[ex.id] ?? []).filter((s) => s.logged).length;
    }
  }
  return count;
}

/** True when every set of every exercise in a single day/week is logged. */
export function isLocalDayComplete(userId: string, week: number, dayId: number): boolean {
  const store = load(userId);
  const dayLogs = store.logs?.[week]?.[dayId];
  if (!dayLogs) return false;
  const day = splitOf(store).find((d) => d.id === dayId);
  if (!day) return false;
  for (const ex of day.exercises) {
    const need = expectedSets(ex, week);
    const have = (dayLogs[ex.id] ?? []).filter((s) => s.logged).length;
    if (have < need) return false;
  }
  return true;
}

/**
 * How many exercises in this day are fully logged.
 * Used to tag Train rows — same rule every week (1…8).
 */
export function getLocalDayExerciseProgress(
  userId: string,
  week: number,
  dayId: number
): { done: number; total: number } {
  const store = load(userId);
  const day = splitOf(store).find((d) => d.id === dayId);
  if (!day) return { done: 0, total: 0 };
  const dayLogs = store.logs?.[week]?.[dayId];
  let done = 0;
  for (const ex of day.exercises) {
    const need = expectedSets(ex, week);
    const have = (dayLogs?.[ex.id] ?? []).filter((s) => s.logged).length;
    if (have >= need) done += 1;
  }
  return { done, total: day.exercises.length };
}

/**
 * Confirm the whole day at target values (no per-set edits required).
 * Always writes the full expected set count per exercise (pads short logs),
 * so a day cannot get stuck at e.g. 7/8 because one move needed 4 sets.
 */
export function confirmLocalDayAtTargets(
  userId: string,
  week: number,
  dayId: number
): LocalSaveResult {
  const store = load(userId);
  const day = splitOf(store).find((d) => d.id === dayId);
  if (!day) {
    return { completedCount: getLocalCompletedCount(userId, week) };
  }

  let last: LocalSaveResult = { completedCount: getLocalCompletedCount(userId, week) };
  for (const ex of day.exercises) {
    const need = expectedSets(ex, week);
    const existing = getLocalDaySets(userId, week, dayId, ex.id);
    const fallbackReps = existing[0]?.targetReps ?? existing[0]?.reps ?? seedReps(ex.id);
    const fallbackWeight = existing[0]?.targetWeight ?? existing[0]?.weight ?? 0;

    const sets = Array.from({ length: need }, (_, i) => {
      const s = existing[i];
      const targetReps = s?.targetReps ?? fallbackReps;
      const targetWeight = s?.targetWeight ?? fallbackWeight;
      // Keep real logged values when present; otherwise use targets.
      const reps = s?.completed ? (s.reps ?? targetReps) : targetReps;
      const weight = s?.completed ? (s.weight ?? targetWeight) : targetWeight;
      return {
        setNumber: i + 1,
        reps,
        weight,
        completed: true,
        targetReps,
        targetWeight: typeof targetWeight === 'number' ? targetWeight : undefined,
      };
    });

    last = saveLocalDaySets(userId, week, dayId, ex, sets);
  }
  return last;
}

function isWeekComplete(store: Store, week: number): boolean {
  const weekLogs = store.logs?.[week];
  if (!weekLogs) return false;
  for (const day of splitOf(store)) {
    const dayLogs = weekLogs[day.id];
    if (!dayLogs) return false;
    for (const ex of day.exercises) {
      const need = expectedSets(ex, week);
      const have = (dayLogs[ex.id] ?? []).filter((s) => s.logged).length;
      if (have < need) return false;
    }
  }
  return true;
}

/**
 * Progressive overload: generate next week's targets from this week's logs.
 * Leaves alone any next-week exercise that already has logged sets.
 */
function generateNextWeek(store: Store, week: number): void {
  const next = week + 1;
  if (next > TOTAL_WEEKS) return;

  const deload = isDeloadWeek(next);
  const dumbbellJump = store.dumbbellJumpKg ?? DEFAULT_DUMBBELL_JUMP;
  const prevNext = store.logs[next] ?? {};
  const nextLogs: WeekLogs = {};

  for (const day of splitOf(store)) {
    nextLogs[day.id] = {};
    for (const ex of day.exercises) {
      const existing = prevNext[day.id]?.[ex.id] ?? [];
      if (existing.some((s) => s.logged)) {
        nextLogs[day.id][ex.id] = existing;
        continue;
      }

      const countThis = expectedSets(ex, week);
      const raw = store.logs?.[week]?.[day.id]?.[ex.id] ?? [];
      const loggedSets = Array.from({ length: countThis }, (_, i) => {
        const s = raw[i];
        return {
          reps: s?.reps ?? 0,
          weight: s?.weight ?? 0,
          logged: Boolean(s?.logged),
        };
      });

      let { reps: nextReps, weight: nextWeight } = computeNextTarget(ex, loggedSets, {
        expectedSets: countThis,
        dumbbellJump,
      });

      if (deload && nextWeight != null && nextWeight > 0) {
        nextWeight = round(nextWeight * DELOAD_LOAD_FACTOR);
        nextReps = 8;
      }

      const count = expectedSets(ex, next);
      nextLogs[day.id][ex.id] = Array.from({ length: count }, (_, i) => ({
        setNumber: i + 1,
        targetReps: nextReps,
        targetWeight: nextWeight,
        reps: null,
        weight: null,
        logged: false,
      }));
    }
  }

  store.logs[next] = nextLogs;
}

export interface LocalSaveResult {
  unlockedWeek?: number;
  final?: boolean;
  completedCount: number;
}

/** Public: persist one exercise's sets and re-evaluate week unlocking. */
export function saveLocalDaySets(
  userId: string,
  week: number,
  dayId: number,
  exercise: Exercise,
  sets: ExerciseSet[]
): LocalSaveResult {
  const store = load(userId);
  const cali = isCalisthenics(exercise);
  const need = expectedSets(exercise, week);
  const fallbackReps = sets[0]?.targetReps ?? sets[0]?.reps ?? seedReps(exercise.id);
  const fallbackWeight = sets[0]?.targetWeight ?? sets[0]?.weight ?? 0;

  if (!store.logs[week]) store.logs[week] = {};
  if (!store.logs[week][dayId]) store.logs[week][dayId] = {};

  // Always persist the full expected set count so days cannot stick at N-1.
  store.logs[week][dayId][exercise.id] = Array.from({ length: need }, (_, i) => {
    const s = sets[i] ?? sets[sets.length - 1];
    const targetReps = s?.targetReps ?? fallbackReps;
    const targetWeight = s?.targetWeight ?? fallbackWeight;
    const reps = Number.isFinite(s?.reps) ? (s!.reps as number) : targetReps;
    const rawWeight = Number.isFinite(s?.weight) ? (s!.weight as number) : targetWeight;
    return {
      setNumber: i + 1,
      targetReps,
      targetWeight: typeof targetWeight === 'number' ? targetWeight : null,
      reps,
      weight: cali ? (rawWeight > 0 ? rawWeight : null) : rawWeight ?? 0,
      logged: true,
    };
  });

  let result: LocalSaveResult = { completedCount: 0 };

  const alreadyCompleted = store.weeks[week] === 'completed';
  if (isWeekComplete(store, week)) {
    if (!alreadyCompleted) {
      store.weeks[week] = 'completed';
      if (week >= TOTAL_WEEKS) {
        store.currentWeek = TOTAL_WEEKS;
        result.final = true;
      } else {
        store.weeks[week + 1] = 'active';
        store.currentWeek = week + 1;
        result.unlockedWeek = week + 1;
      }
    }
    // Fresh unlock or re-save after a rule fix: refresh unlogged next-week targets.
    if (week < TOTAL_WEEKS) {
      generateNextWeek(store, week);
    }
  }

  save(userId, store);
  result.completedCount = getLocalCompletedCount(userId, week);
  return result;
}

// -----------------------------------------------------------------------------
// Cross-device sync helpers
// -----------------------------------------------------------------------------

function deriveWeeks(currentWeek: number): Record<number, WeekStatus> {
  const weeks: Record<number, WeekStatus> = {};
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    weeks[w] = w < currentWeek ? 'completed' : w === currentWeek ? 'active' : 'locked';
  }
  return weeks;
}

/** Every set currently on this device (logged actuals + unlogged targets). */
export function collectAllSets(userId: string): CloudSet[] {
  const store = load(userId);
  const out: CloudSet[] = [];
  for (const wkStr of Object.keys(store.logs)) {
    const wk = Number(wkStr);
    const days = store.logs[wk];
    for (const dyStr of Object.keys(days)) {
      const dy = Number(dyStr);
      const exs = days[dy];
      for (const exid of Object.keys(exs)) {
        for (const s of exs[exid]) {
          out.push({
            week: wk,
            dayId: dy,
            exerciseId: exid,
            setIndex: s.setNumber,
            targetReps: s.targetReps ?? null,
            targetWeight: s.targetWeight ?? null,
            actualReps: s.logged ? s.reps : null,
            actualWeight: s.logged ? s.weight : null,
            completed: s.logged,
          });
        }
      }
    }
  }
  return out;
}

/**
 * Merges cloud data into the local store so a fresh device restores progress.
 * Cloud wins for exercises that have logged actuals; local-only work is kept.
 */
export function mergeCloudIntoLocal(
  userId: string,
  cloud: { currentWeek: number; sets: CloudSet[] }
): ProgramState {
  const store = load(userId);

  const byKey = new Map<string, CloudSet[]>();
  for (const s of cloud.sets) {
    const k = `${s.week}|${s.dayId}|${s.exerciseId}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(s);
  }

  for (const [k, arr] of byKey) {
    const sep1 = k.indexOf('|');
    const sep2 = k.indexOf('|', sep1 + 1);
    const wk = Number(k.slice(0, sep1));
    const dy = Number(k.slice(sep1 + 1, sep2));
    const exid = k.slice(sep2 + 1);

    arr.sort((a, b) => a.setIndex - b.setIndex);
    const cloudLogged = arr.some((s) => s.actualReps != null);
    const localArr = store.logs?.[wk]?.[dy]?.[exid];
    const localLogged = (localArr ?? []).some((s) => s.logged);

    // Take cloud when it has real logged data, or when this device has none.
    if (cloudLogged || !localLogged) {
      if (!store.logs[wk]) store.logs[wk] = {};
      if (!store.logs[wk][dy]) store.logs[wk][dy] = {};
      store.logs[wk][dy][exid] = arr.map((s) => ({
        setNumber: s.setIndex,
        targetReps: s.targetReps ?? seedReps(exid),
        targetWeight: s.targetWeight ?? null,
        reps: s.actualReps,
        weight: s.actualWeight,
        logged: s.actualReps != null,
      }));
    }
  }

  const mergedCurrent = Math.max(store.currentWeek || 1, cloud.currentWeek || 1, 1);
  store.currentWeek = mergedCurrent;
  store.weeks = deriveWeeks(mergedCurrent);

  save(userId, store);
  return deriveState(store);
}

/** Public: previous-week logged sets for an exercise (for "last week" hints). */
export function getLocalPreviousSets(
  userId: string,
  week: number,
  dayId: number,
  exerciseId: string
): ExerciseSet[] | undefined {
  if (week <= 1) return undefined;
  const store = load(userId);
  const stored = store.logs?.[week - 1]?.[dayId]?.[exerciseId];
  if (!stored) return undefined;
  const logged = stored.filter((s) => s.logged);
  if (!logged.length) return undefined;
  return logged.map((s) => ({
    setNumber: s.setNumber,
    reps: s.reps ?? 0,
    weight: s.weight ?? 0,
    completed: true,
  }));
}
