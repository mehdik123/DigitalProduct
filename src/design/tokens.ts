/**
 * Centralized design tokens for the Training experience.
 * One source of truth: type scale, spacing, radii, near-black surfaces,
 * a single red accent, one success tone, and motion timings.
 */

export const colors = {
  // Layered near-black surfaces (darkest -> lightest)
  bg: '#08090d',
  surface: '#101218',
  surface2: '#15171f',
  surface3: '#1b1e28',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.12)',

  // Text
  text: '#f4f5fa',
  textMuted: '#9ea3b2',
  textFaint: '#646a7a',

  // Single red accent
  accent: '#ff2d55',
  accentDeep: '#e11d48',
  accentSoft: 'rgba(255,45,85,0.14)',
  accentBorder: 'rgba(255,45,85,0.35)',
  coral: '#ff6a55',

  // One success tone
  success: '#34d399',
  successSoft: 'rgba(52,211,153,0.14)',

  // Locked / disabled
  locked: '#3f3f46',
} as const;

/** Type scale (px). */
export const type = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 20,
  xl: 28,
  '2xl': 40,
  '3xl': 64,
} as const;

/** 8px spacing system. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

/** Motion durations (seconds) and easings — used by framer-motion. */
export const motion = {
  fast: 0.18,
  base: 0.28,
  slow: 0.45,
  celebrate: 0.9,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;
