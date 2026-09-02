/**
 * Lookup helpers for translating program content that lives in data files.
 *
 * Each helper falls back to the original English string when no translation
 * exists, so adding an exercise to `workoutData.ts` can never render a raw
 * translation key to the user.
 */
import { hasTranslation } from './translations';
import { contentKey, ContentKind } from './programContent';

type TFn = (key: string, vars?: Record<string, string | number>) => string;

function localize(t: TFn, kind: ContentKind, source?: string | null): string {
    if (!source) return '';
    const key = contentKey(kind, source);
    return hasTranslation(key) ? t(key) : source;
}

/**
 * Exercise and day names are technical gym terminology and stay in English in
 * every language. These pass-throughs exist so call sites read consistently and
 * there is a single place to revisit the decision.
 */
export const exerciseName = (_t: TFn, name?: string | null) => name ?? '';
export const dayName = (_t: TFn, name?: string | null) => name ?? '';

export const dayDescription = (t: TFn, description?: string | null) =>
    localize(t, 'dayDesc', description);
export const focusLabel = (t: TFn, value?: string | null) => localize(t, 'focus', value);
export const difficultyLabel = (t: TFn, value?: string | null) =>
    localize(t, 'difficulty', value);

/**
 * Durations and rest periods are numeric ranges plus a unit ("3 min",
 * "75-90 min"), so only the unit needs translating.
 */
export const localizeMinutes = (t: TFn, value?: string | null) =>
    value ? value.replace(/\bmins?\b/gi, t('unit.min')) : '';
