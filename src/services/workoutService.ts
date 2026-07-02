import { supabase } from '../lib/supabaseClient';
import { ExerciseSet } from '../types/workout';

export type WeekStatus = 'locked' | 'active' | 'completed';

export interface ProgramState {
  currentWeek: number;
  weeks: Record<number, WeekStatus>;
}

export interface SaveExerciseParams {
  weekNumber: number;
  workoutDayId: number;
  exerciseId: string;
  sets: ExerciseSet[];
}

export interface BaselineLift {
  exerciseId: string;
  weight: number;
  reps: number;
}

export interface ComparisonRow {
  exerciseId: string;
  baselineWeight: number;
  baselineReps: number;
  currentWeight: number;
  currentReps: number;
}

const RPC_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: PromiseLike<T>, ms = RPC_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              'Could not reach Supabase. Check your internet, confirm the project is not paused in the Supabase dashboard, then restart the dev server.'
            )
          ),
        ms
      )
    ),
  ]);
}

/** Local fallback when Supabase is unreachable — keeps the UI usable offline. */
export function defaultProgramState(currentWeek = 1): ProgramState {
  const week = Math.min(12, Math.max(1, currentWeek));
  const weeks: Record<number, WeekStatus> = {};
  for (let w = 1; w <= 12; w++) {
    if (w < week) weeks[w] = 'completed';
    else if (w === week) weeks[w] = 'active';
    else weeks[w] = 'locked';
  }
  return { currentWeek: week, weeks };
}

/**
 * Ensures the user is on Week 1+ without requiring a baseline screen.
 * Calls start_program RPC (012 migration) or falls back to direct profile update.
 */
export async function ensureProgramStarted(userId: string): Promise<ProgramState> {
  try {
    let state = await getProgramState(userId);
    if (state.currentWeek >= 1) return state;

    try {
      const { data, error } = await withTimeout(supabase.rpc('start_program'));
      if (error) throw error;
      if (data && (data as any).success === false) {
        throw new Error((data as any).reason ?? 'Could not start program');
      }
    } catch {
      // Fallback if migration 012 not applied yet.
      await withTimeout(
        supabase.from('profiles').update({ current_week: 1 }).eq('id', userId)
      );
      await withTimeout(
        supabase
          .from('week_status')
          .upsert({ user_id: userId, week: 1, status: 'active' as WeekStatus })
      );
    }

    state = await getProgramState(userId);
    return state.currentWeek >= 1 ? state : defaultProgramState(1);
  } catch (e) {
    console.warn('[workoutService] ensureProgramStarted offline fallback:', e);
    return defaultProgramState(1);
  }
}

/**
 * Reads the user's program state (current week + per-week status).
 * Weeks with no row are implicitly 'locked'.
 */
export async function getProgramState(userId: string): Promise<ProgramState> {
  try {
    const weeks: Record<number, WeekStatus> = {};

    const [profileRes, statusRes] = await Promise.all([
      supabase.from('profiles').select('current_week').eq('id', userId).maybeSingle(),
      supabase.from('week_status').select('week, status').eq('user_id', userId),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (statusRes.error) throw statusRes.error;

    (statusRes.data ?? []).forEach((row: { week: number; status: WeekStatus }) => {
      weeks[row.week] = row.status;
    });

    const currentWeek = profileRes.data?.current_week ?? 0;

    for (let w = 1; w <= 12; w++) {
      if (weeks[w]) continue;
      if (currentWeek >= 1 && w < currentWeek) weeks[w] = 'completed';
      else if (w === currentWeek) weeks[w] = 'active';
      else weeks[w] = 'locked';
    }

    return { currentWeek, weeks };
  } catch (e) {
    console.warn('[workoutService] getProgramState offline fallback:', e);
    return defaultProgramState(1);
  }
}

// -----------------------------------------------------------------------------
// Cross-device cloud persistence
// -----------------------------------------------------------------------------

export interface CloudSet {
  week: number;
  dayId: number;
  exerciseId: string;
  setIndex: number;
  targetReps: number | null;
  targetWeight: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  completed: boolean;
}

export interface CloudProgram {
  currentWeek: number;
  weeks: Record<number, WeekStatus>;
  sets: CloudSet[];
}

/** Pulls the user's entire program (profile week, statuses, all sets) from Supabase. */
export async function fetchCloudProgram(userId: string): Promise<CloudProgram | null> {
  try {
    const [profileRes, statusRes, setsRes] = await Promise.all([
      supabase.from('profiles').select('current_week').eq('id', userId).maybeSingle(),
      supabase.from('week_status').select('week, status').eq('user_id', userId),
      supabase
        .from('set_logs')
        .select(
          'week, day_id, exercise_id, set_index, target_reps, target_weight, actual_reps, actual_weight, completed'
        )
        .eq('user_id', userId),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (statusRes.error) throw statusRes.error;
    if (setsRes.error) throw setsRes.error;

    const weeks: Record<number, WeekStatus> = {};
    (statusRes.data ?? []).forEach((r: any) => {
      weeks[r.week] = r.status;
    });

    const sets: CloudSet[] = (setsRes.data ?? []).map((r: any) => ({
      week: r.week,
      dayId: r.day_id,
      exerciseId: r.exercise_id,
      setIndex: r.set_index,
      targetReps: r.target_reps,
      targetWeight: r.target_weight,
      actualReps: r.actual_reps,
      actualWeight: r.actual_weight,
      completed: r.completed ?? false,
    }));

    return { currentWeek: profileRes.data?.current_week ?? 0, weeks, sets };
  } catch (e) {
    console.warn('[workoutService] fetchCloudProgram failed (offline):', e);
    return null;
  }
}

/** Writes the full program (all sets + statuses + current week) to Supabase in bulk. */
export async function pushProgramToCloud(
  userId: string,
  sets: CloudSet[],
  currentWeek: number,
  weeks: Record<number, WeekStatus>
): Promise<boolean> {
  try {
    if (sets.length) {
      const rows = sets.map((s) => ({
        user_id: userId,
        week: s.week,
        day_id: s.dayId,
        exercise_id: s.exerciseId,
        set_index: s.setIndex,
        target_reps: s.targetReps,
        target_weight: s.targetWeight,
        actual_reps: s.actualReps,
        actual_weight: s.actualWeight,
        rpe: 8,
        completed: s.completed,
      }));
      const { error } = await withTimeout(
        supabase.from('set_logs').upsert(rows, {
          onConflict: 'user_id,week,day_id,exercise_id,set_index',
        })
      );
      if (error) throw error;
    }

    const wkRows = Object.entries(weeks).map(([w, status]) => ({
      user_id: userId,
      week: Number(w),
      status,
    }));
    if (wkRows.length) {
      const { error } = await withTimeout(
        supabase.from('week_status').upsert(wkRows, { onConflict: 'user_id,week' })
      );
      if (error) throw error;
    }

    await withTimeout(
      supabase.from('profiles').update({ current_week: currentWeek }).eq('id', userId)
    );
    return true;
  } catch (e) {
    console.warn('[workoutService] pushProgramToCloud failed (offline):', e);
    return false;
  }
}

/**
 * Loads all set logs for a given week/day, grouped by exercise id.
 * Returns target + actual values so the UI can render this week's plan.
 */
export async function loadWorkoutSets(
  userId: string,
  weekNumber: number,
  workoutDayId: number
): Promise<Map<string, ExerciseSet[]>> {
  const result = new Map<string, ExerciseSet[]>();

  try {
    const { data, error } = await withTimeout(
      supabase
        .from('set_logs')
        .select('exercise_id, set_index, target_reps, target_weight, actual_reps, actual_weight, rpe, completed')
        .eq('user_id', userId)
        .eq('week', weekNumber)
        .eq('day_id', workoutDayId)
        .order('set_index', { ascending: true })
    );

    if (error) {
      console.error('[workoutService] loadWorkoutSets error:', error.message);
      return result;
    }

    (data ?? []).forEach((row: any) => {
      if (!result.has(row.exercise_id)) result.set(row.exercise_id, []);
      result.get(row.exercise_id)!.push({
        setNumber: row.set_index,
        reps: row.actual_reps ?? 0,
        weight: row.actual_weight ?? 0,
        rpe: row.rpe ?? undefined,
        completed: row.completed ?? false,
        targetReps: row.target_reps ?? undefined,
        targetWeight: row.target_weight ?? undefined,
      });
    });
  } catch (e: any) {
    console.error('[workoutService] loadWorkoutSets failed:', e?.message ?? e);
  }

  return result;
}

/**
 * Loads previous-week actuals for an exercise, keyed by set index,
 * so the UI can show "Last week: X x Y".
 */
export async function loadPreviousWeekSets(
  userId: string,
  weekNumber: number,
  exerciseId: string
): Promise<Map<number, { reps: number; weight: number }>> {
  const map = new Map<number, { reps: number; weight: number }>();
  if (weekNumber <= 1) return map;

  const { data } = await withTimeout(
    supabase
      .from('set_logs')
      .select('set_index, actual_reps, actual_weight')
      .eq('user_id', userId)
      .eq('week', weekNumber - 1)
      .eq('exercise_id', exerciseId)
  );

  (data ?? []).forEach((row: any) => {
    if (row.actual_reps != null) {
      map.set(row.set_index, { reps: row.actual_reps, weight: row.actual_weight ?? 0 });
    }
  });

  return map;
}

/** Counts fully-logged (completed) sets for a week across all days. */
export async function getCompletedSetCount(userId: string, week: number): Promise<number> {
  try {
    const { count } = await withTimeout(
      supabase
        .from('set_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('week', week)
        .eq('completed', true)
        .not('actual_reps', 'is', null)
    );
    return count ?? 0;
  } catch (e: any) {
    console.error('[workoutService] getCompletedSetCount failed:', e?.message ?? e);
    return 0;
  }
}

/** Saves every set of one exercise via the save_set_log RPC. */
export async function saveExerciseSets(
  params: SaveExerciseParams & { calisthenics?: boolean }
): Promise<{ success: boolean; error?: string }> {
  try {
    // 0 is a valid value; every set in the exercise is persisted.
    for (const s of params.sets) {
      const hasWeight = Number.isFinite(s.weight) && (s.weight as number) > 0;
      const { data, error } = await withTimeout(
        supabase.rpc('save_set_log', {
          p_week: params.weekNumber,
          p_day_id: params.workoutDayId,
          p_exercise_id: params.exerciseId,
          p_set_index: s.setNumber,
          p_target_reps: s.targetReps ?? null,
          p_target_weight: s.targetWeight ?? null,
          p_actual_reps: Number.isFinite(s.reps) ? s.reps : 0,
          // Calisthenics weight is optional: only send it when the user logged one.
          p_actual_weight: params.calisthenics
            ? (hasWeight ? s.weight : null)
            : (Number.isFinite(s.weight) ? s.weight : 0),
          p_rpe: s.rpe ?? 8,
          p_completed: s.completed === true,
        })
      );

      if (error) {
        if (error.message?.includes('save_set_log') || error.code === 'PGRST202') {
          return {
            success: false,
            error: 'Database not ready. Run migration 011_program_engine.sql in Supabase.',
          };
        }
        return { success: false, error: error.message };
      }
      if (data && (data as any).success === false) {
        return { success: false, error: (data as any).reason ?? 'Save rejected by server.' };
      }
    }

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? 'Save failed.' };
  }
}

/**
 * Attempts to complete the given week. The server validates that every
 * set of every exercise is logged before generating next week's targets.
 */
export async function completeWeek(
  weekNumber: number
): Promise<{ success: boolean; unlockedWeek?: number; final?: boolean; reason?: string; error?: string }> {
  try {
    const { data, error } = await withTimeout(
      supabase.rpc('complete_week_and_generate', { p_week: weekNumber })
    );
    if (error) return { success: false, error: error.message };

    const res = (data ?? {}) as any;
    return {
      success: res.success === true,
      unlockedWeek: res.unlocked_week,
      final: res.final,
      reason: res.reason,
    };
  } catch (e: any) {
    return { success: false, error: e.message ?? 'Could not complete week.' };
  }
}

/** Submits Week 0 baseline numbers and unlocks Week 1. */
export async function submitBaseline(
  lifts: BaselineLift[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = lifts.map((l) => ({
      exercise_id: l.exerciseId,
      weight: l.weight,
      reps: l.reps,
    }));
    const { data, error } = await withTimeout(
      supabase.rpc('submit_baseline', { p_lifts: payload })
    );
    if (error) return { success: false, error: error.message };
    if (data && (data as any).success === false) {
      return { success: false, error: (data as any).reason ?? 'Baseline rejected.' };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? 'Could not save baseline.' };
  }
}

/** Baseline (Week 1) vs Week 12 comparison for key lifts. */
export async function getComparison(
  userId: string,
  keyLiftIds: string[]
): Promise<ComparisonRow[]> {
  const [{ data: week1 }, { data: week12 }] = await Promise.all([
    withTimeout(
      supabase
        .from('set_logs')
        .select('exercise_id, actual_reps, actual_weight')
        .eq('user_id', userId)
        .eq('week', 1)
    ),
    withTimeout(
      supabase
        .from('set_logs')
        .select('exercise_id, actual_reps, actual_weight')
        .eq('user_id', userId)
        .eq('week', 12)
    ),
  ]);

  const baseMap = new Map<string, { weight: number; reps: number }>();
  (week1 ?? []).forEach((row: any) => {
    if (row.actual_reps == null) return;
    const prev = baseMap.get(row.exercise_id);
    const w = row.actual_weight ?? 0;
    if (!prev || w > prev.weight) {
      baseMap.set(row.exercise_id, { weight: w, reps: row.actual_reps ?? 0 });
    }
  });

  const bestMap = new Map<string, { weight: number; reps: number }>();
  (week12 ?? []).forEach((row: any) => {
    if (row.actual_reps == null) return;
    const prev = bestMap.get(row.exercise_id);
    const w = row.actual_weight ?? 0;
    if (!prev || w > prev.weight || (w === prev.weight && (row.actual_reps ?? 0) > prev.reps)) {
      bestMap.set(row.exercise_id, { weight: w, reps: row.actual_reps ?? 0 });
    }
  });

  return keyLiftIds.map((id) => {
    const base = baseMap.get(id) ?? { weight: 0, reps: 0 };
    const best = bestMap.get(id) ?? { weight: 0, reps: 0 };
    return {
      exerciseId: id,
      baselineWeight: base.weight,
      baselineReps: base.reps,
      currentWeight: best.weight,
      currentReps: best.reps,
    };
  });
}
