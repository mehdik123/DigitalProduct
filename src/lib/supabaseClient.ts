/**
 * Supabase was removed. Auth is Firebase; workouts are localStorage.
 * This stub keeps old imports from crashing until dead code is deleted.
 */

export const supabaseConfigured = false;

export class RequestTimeoutError extends Error {
  readonly name = 'RequestTimeoutError';
  constructor() {
    super('Request timed out. Check your connection and try again.');
  }
}

export function isTimeoutError(error: unknown): boolean {
  if (!error) return false;
  const e = error as { name?: string; message?: string };
  return (
    e.name === 'RequestTimeoutError' ||
    e.name === 'AbortError' ||
    e.name === 'TimeoutError' ||
    /aborted|timed? ?out/i.test(e.message ?? '')
  );
}

const dead = () => {
  throw new Error('Supabase is disabled. Use Firebase auth (see firebase/SETUP.md).');
};

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: dead,
    signInWithPassword: dead,
    signOut: async () => ({ error: null }),
    signInWithOAuth: dead,
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: dead, maybeSingle: async () => ({ data: null, error: null }) }) }),
    insert: dead,
    update: () => ({ eq: dead }),
    upsert: dead,
  }),
  rpc: dead,
} as any;

export const auth = supabase.auth;
export const db = supabase;
