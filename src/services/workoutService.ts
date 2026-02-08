import { supabase } from '../lib/supabaseClient';
import { ExerciseSet } from '../types/workout';

export interface SaveExerciseParams {
  userId: string;
  weekNumber: number;
  workoutDayId: number;
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
}

// ------------------------------------------------------------------
// "Nuclear Option" & Diagnostic Save Function
// ------------------------------------------------------------------
export async function saveExerciseSets(params: SaveExerciseParams): Promise<{ success: boolean; error?: string }> {
  const startTime = performance.now();

  try {
    const validSets = params.sets.filter(s => s.reps > 0 || s.weight > 0);

    if (validSets.length === 0) {
      return { success: false, error: 'No data to save (reps/weight required)' };
    }

    const setsPayload = validSets.map(s => ({
      set_number: s.setNumber,
      reps: Number(s.reps),
      weight: Number(s.weight),
      rpe: null,
      completed: s.completed !== false
    }));

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const PROJECT_REF = 'wfcvyrsmtcylmdwstqxq'; // Extracted from URL

    console.log('🔍 Pre-auth check:', (performance.now() - startTime).toFixed(2), 'ms');

    // Check Service Workers (Diagnostic)
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('🔍 Active Service Workers:', registrations.length);
    }

    // ---------------------------------------------------------
    // MANUAL TOKEN RETRIEVAL (Bypassing supabase-js lock)
    // ---------------------------------------------------------
    let accessToken: string | undefined;

    try {
      const storageKey = `sb-${PROJECT_REF}-auth-token`;
      const item = localStorage.getItem(storageKey);
      if (item) {
        const parsed = JSON.parse(item);
        accessToken = parsed.access_token;
        console.log('🔍 Token found in LocalStorage (Manual Read)');
      }
    } catch (e) {
      console.warn('Manual token read failed, falling back to client:', e);
    }

    if (!accessToken) {
      console.log('🔍 Manual read empty, calling getSession()...');
      // Add timeout to getSession to prevent infinite hang
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('getSession timeout')), 2000)
      );

      try {
        const result: any = await Promise.race([sessionPromise, timeoutPromise]);
        accessToken = result.data?.session?.access_token;
      } catch (e) {
        console.error('getSession failed/timed out');
      }
    }

    console.log('🔍 Auth retrieved:', (performance.now() - startTime).toFixed(2), 'ms', accessToken ? '(Found)' : '(Missing)');

    if (!accessToken) {
      throw new Error('No active session. Please sign in again.');
    }

    // Add timeout wrapper (10s strict timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    console.log('🔍 Starting fetch:', (performance.now() - startTime).toFixed(2), 'ms');

    // NUCLEAR CACHE BUSTING (Headers only, no URL params)
    const urlWithCacheBust = `${supabaseUrl}/rest/v1/rpc/save_workout`;

    const response = await fetch(urlWithCacheBust, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${accessToken}`,
        'Connection': 'close',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({
        p_user_id: params.userId,
        p_week_number: params.weekNumber,
        p_workout_day_id: params.workoutDayId,
        p_exercise_id: params.exerciseId,
        p_exercise_name: params.exerciseName,
        p_sets: setsPayload
      }),
      signal: controller.signal,
      cache: 'no-store',
      keepalive: false
    });

    clearTimeout(timeoutId);
    console.log('🔍 Fetch completed:', (performance.now() - startTime).toFixed(2), 'ms');

    if (!response.ok) {
      let errorText = await response.text();
      console.error('❌ Server Error Response:', response.status, errorText);
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 Total time:', (performance.now() - startTime).toFixed(2), 'ms');

    if (data && !data.success) {
      throw new Error(data.error || 'Server reported failure');
    }

    return { success: true };

  } catch (error: any) {
    console.error('❌ Save failed at:', (performance.now() - startTime).toFixed(2), 'ms');

    if (error.name === 'AbortError') {
      return { success: false, error: 'Request timeout after 10s (Aborted)' };
    }

    console.error('Save failed (Diagnostic):', error);
    return {
      success: false,
      error: error.message || 'Connection failed'
    };
  }
}

// ------------------------------------------------------------------
// Diagnostic Load Function (Raw Fetch)
// ------------------------------------------------------------------
export async function loadWorkoutSets(
  userId: string,
  weekNumber: number,
  workoutDayId: number
): Promise<Map<string, ExerciseSet[]>> {

  const resultMap = new Map<string, ExerciseSet[]>();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const PROJECT_REF = 'wfcvyrsmtcylmdwstqxq';

  try {
    // 1. Get Token (Manual strategy)
    let accessToken: string | undefined;
    try {
      const storageKey = `sb-${PROJECT_REF}-auth-token`;
      const item = localStorage.getItem(storageKey);
      if (item) accessToken = JSON.parse(item).access_token;
    } catch (e) { /* ignore */ }

    if (!accessToken) {
      // Fallback: Use getSession with timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('getSession timeout')), 2000));

      try {
        const result: any = await Promise.race([sessionPromise, timeoutPromise]);
        accessToken = result.data?.session?.access_token;
      } catch (e) { console.error('getSession failed'); }
    }

    if (!accessToken) return resultMap;

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // 2. Get Session ID
    const sessionUrl = `${supabaseUrl}/rest/v1/workout_sessions?user_id=eq.${userId}&week_number=eq.${weekNumber}&workout_day_id=eq.${workoutDayId}&select=id`;

    const sessionRes = await fetch(sessionUrl, { headers });
    if (!sessionRes.ok) throw new Error('Failed to fetch session');

    const sessions = await sessionRes.json();
    if (!sessions || sessions.length === 0) return resultMap;

    const sessionId = sessions[0].id;

    // 3. Get Sets
    const setsUrl = `${supabaseUrl}/rest/v1/workout_sets?session_id=eq.${sessionId}&order=set_number.asc`;

    const setsRes = await fetch(setsUrl, { headers });
    if (!setsRes.ok) throw new Error('Failed to fetch sets');

    const sets = await setsRes.json();

    // 4. Group Results
    sets.forEach((row: any) => {
      if (!resultMap.has(row.exercise_id)) {
        resultMap.set(row.exercise_id, []);
      }
      resultMap.get(row.exercise_id)?.push({
        setNumber: row.set_number,
        reps: row.reps,
        weight: row.weight,
        rpe: row.rpe,
        completed: row.completed
      });
    });

    return resultMap;

  } catch (error) {
    console.error('Load failed (Raw Fetch):', error);
    return resultMap;
  }
}
