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

const RPC_TIMEOUT_MS = 12000;

function withTimeout<T>(promise: PromiseLike<T>, ms = RPC_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Check your connection and try again.')), ms)
    ),
  ]);
}

/**
 * Reads the user's program state (current week + per-week status).
 * Weeks with no row are implicitly 'locked'.
 */
export async function getProgramState(userId: string): Promise<ProgramState> {
  const weeks: Record<number, WeekStatus> = {};

  const [{ data: profile }, { data: statuses }] = await Promise.all([
    withTimeout(supabase.from('profiles').select('current_week').eq('id', userId).maybeSingle()),
    withTimeout(supabase.from('week_status').select('week, status').eq('user_id', userId)),
  ]);

  (statuses ?? []).forEach((row: { week: number; status: WeekStatus }) => {
    weeks[row.week] = row.status;
  });

  const currentWeek = profile?.current_week ?? 0;

  // Backfill any missing week so gating still works for users without
  // explicit week_status rows: past weeks completed, current active, rest locked.
  for (let w = 1; w <= 12; w++) {
    if (weeks[w]) continue;
    if (currentWeek >= 1 && w < currentWeek) weeks[w] = 'completed';
    else if (w === currentWeek) weeks[w] = 'active';
    else weeks[w] = 'locked';
  }

  return { currentWeek, weeks };
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
    if (row.actual_reps != null && row.actual_weight != null) {
      map.set(row.set_index, { reps: row.actual_reps, weight: row.actual_weight });
    }
  });

  return map;
}

/** Counts fully-logged (completed) sets for a week across all days. */
export async function getCompletedSetCount(userId: string, week: number): Promise<number> {
  const { count } = await withTimeout(
    supabase
      .from('set_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('week', week)
      .eq('completed', true)
      .not('actual_reps', 'is', null)
      .not('rpe', 'is', null)
  );
  return count ?? 0;
}

/** Saves every set of one exercise via the save_set_log RPC. */
export async function saveExerciseSets(
  params: SaveExerciseParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const valid = params.sets.filter(
      (s) => s.reps > 0 || s.weight > 0 || s.completed
    );
    if (valid.length === 0) {
      return { success: false, error: 'Enter reps or weight before saving.' };
    }

    for (const s of valid) {
      const { data, error } = await withTimeout(
        supabase.rpc('save_set_log', {
          p_week: params.weekNumber,
          p_day_id: params.workoutDayId,
          p_exercise_id: params.exerciseId,
          p_set_index: s.setNumber,
          p_target_reps: s.targetReps ?? null,
          p_target_weight: s.targetWeight ?? null,
          p_actual_reps: Number.isFinite(s.reps) ? s.reps : null,
          p_actual_weight: Number.isFinite(s.weight) ? s.weight : null,
          p_rpe: s.rpe ?? null,
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

/** Baseline (Week 0) vs current best (Week 12) comparison for key lifts. */
export async function getComparison(
  userId: string,
  keyLiftIds: string[]
): Promise<ComparisonRow[]> {
  const [{ data: baselines }, { data: week12 }] = await Promise.all([
    withTimeout(supabase.from('baseline').select('exercise_id, weight, reps').eq('user_id', userId)),
    withTimeout(
      supabase
        .from('set_logs')
        .select('exercise_id, actual_reps, actual_weight')
        .eq('user_id', userId)
        .eq('week', 12)
    ),
  ]);

  const baseMap = new Map<string, { weight: number; reps: number }>();
  (baselines ?? []).forEach((b: any) => baseMap.set(b.exercise_id, { weight: b.weight, reps: b.reps }));

  const bestMap = new Map<string, { weight: number; reps: number }>();
  (week12 ?? []).forEach((row: any) => {
    if (row.actual_weight == null) return;
    const prev = bestMap.get(row.exercise_id);
    if (!prev || row.actual_weight > prev.weight) {
      bestMap.set(row.exercise_id, { weight: row.actual_weight, reps: row.actual_reps ?? 0 });
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
