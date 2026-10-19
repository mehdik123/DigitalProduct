/**
 * Soft signup gate: only people with the program access code can create an account.
 * The code is a Vite env var (visible in the client bundle) — enough to stop
 * casual link-sharing, not a cryptographic lock.
 */

export function getExpectedAccessCode(): string {
  return (import.meta.env.VITE_PROGRAM_ACCESS_CODE as string | undefined)?.trim() ?? '';
}

/** Normalize for comparison: trim + case-insensitive. */
export function normalizeAccessCode(value: string): string {
  return value.trim().toLowerCase();
}

export function isAccessCodeValid(input: string): boolean {
  const expected = getExpectedAccessCode();
  if (!expected) return false;
  return normalizeAccessCode(input) === normalizeAccessCode(expected);
}

export function isAccessCodeConfigured(): boolean {
  return getExpectedAccessCode().length > 0;
}
