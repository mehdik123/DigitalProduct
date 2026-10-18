/**
 * Hybrid Athlete redesign v1 — warm graphite, bone type, one red signal.
 * Source: design/Hybrid-Athlete-Redesign.html
 */

export const colors = {
  bg: '#111110',
  surface: '#1A1918',
  surface2: '#22201E',
  surface3: '#2C2A27',
  border: '#2E2C29',
  borderStrong: '#3E3B37',

  text: '#F2EDE6',
  textMuted: '#A8A29A',
  textFaint: '#6F6A64',

  accent: '#E8112D',
  accentDeep: '#C80E27',
  accentSoft: 'rgba(232,17,45,0.14)',
  accentBorder: 'rgba(232,17,45,0.35)',
  coral: '#E8112D',

  success: '#34d399',
  successSoft: 'rgba(52,211,153,0.14)',

  locked: '#6F6A64',
} as const;

export const type = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 20,
  xl: 28,
  '2xl': 40,
  '3xl': 64,
} as const;

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
  md: 14,
  lg: 18,
  xl: 28,
  full: 9999,
} as const;

export const motion = {
  fast: 0.18,
  base: 0.28,
  slow: 0.45,
  celebrate: 0.9,
  ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
  easeOut: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
} as const;
