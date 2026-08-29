import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const REQUEST_TIMEOUT_MS = 30_000;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  console.error(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Add them to project/.env and restart the dev server (npm run dev).'
  );
}

/** Thrown when a Supabase request exceeds REQUEST_TIMEOUT_MS. */
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

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();

  // A plain local flag rather than AbortSignal.reason: passing a reason to
  // abort() is silently ignored by older browsers, which then surface the
  // opaque "signal is aborted without reason" DOMException instead.
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  // Honour a caller-supplied signal instead of silently discarding it.
  const external = init?.signal ?? null;
  const forwardAbort = () => controller.abort();
  if (external) {
    if (external.aborted) forwardAbort();
    else external.addEventListener('abort', forwardAbort, { once: true });
  }

  return fetch(input, { ...init, signal: controller.signal })
    .catch((err) => {
      if (timedOut) throw new RequestTimeoutError();
      throw err;
    })
    .finally(() => {
      clearTimeout(timeoutId);
      external?.removeEventListener('abort', forwardAbort);
    });
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public',
    },
    global: {
      fetch: fetchWithTimeout,
    },
  }
);

// Auth helpers
export const auth = supabase.auth;

// Database helpers
export const db = supabase;
