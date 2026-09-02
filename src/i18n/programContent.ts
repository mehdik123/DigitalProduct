/**
 * Translations for the program *content* that lives in `src/data/workoutData.ts`.
 *
 * Technical gym terminology is deliberately NOT translated: exercise names
 * ("Barbell Bent Over Rows") and day names ("Upper Body 1") stay in English in
 * every language, because that is how lifters read and search for them.
 * Only prose and labels are translated here.
 *
 * Entries are keyed by the English source string and the translation key is
 * derived from it, so `workoutData.ts` needs no `nameKey` fields and a key can
 * never drift from the string it translates.
 */
import { slug } from './slug';

interface Localized {
    ar: string;
    fr: string;
}

const dayDescriptions: Record<string, Localized> = {
    'Upper body push focus with chest and triceps emphasis': {
        ar: 'تركيز على دفع أعلى الجسم مع الصدر والترايسبس',
        fr: 'Focus poussée du haut du corps, accent sur pectoraux et triceps',
    },
    'Lower body power and strength development': {
        ar: 'تطوير القوة والانفجار في أسفل الجسم',
        fr: 'Développement de la puissance et de la force du bas du corps',
    },
    'Shoulder development with core work': {
        ar: 'تطوير الأكتاف مع عمل على عضلات الوسط',
        fr: 'Développement des épaules avec travail du tronc',
    },
    'Complete lower body development with quad, hamstring, and calf focus': {
        ar: 'تطوير كامل لأسفل الجسم مع التركيز على الفخذ الأمامي والخلفي والسمانة',
        fr: 'Développement complet du bas du corps : quadriceps, ischio-jambiers et mollets',
    },
    'Intense arm training with superset protocol': {
        ar: 'تدريب مكثف للذراعين بنظام السوبرست',
        fr: 'Entraînement intense des bras avec protocole en superset',
    },
};

const focus: Record<string, Localized> = {
    Push: { ar: 'دفع', fr: 'Poussée' },
    Legs: { ar: 'الأرجل', fr: 'Jambes' },
    Shoulders: { ar: 'الأكتاف', fr: 'Épaules' },
    Arms: { ar: 'الذراعين', fr: 'Bras' },
};

const difficulty: Record<string, Localized> = {
    Beginner: { ar: 'مبتدئ', fr: 'Débutant' },
    Intermediate: { ar: 'متوسط', fr: 'Intermédiaire' },
    Advanced: { ar: 'متقدم', fr: 'Avancé' },
};

export const CONTENT_KINDS = {
    dayDesc: dayDescriptions,
    focus,
    difficulty,
} as const;

export type ContentKind = keyof typeof CONTENT_KINDS;

export const contentKey = (kind: ContentKind, source: string) =>
    `content.${kind}.${slug(source)}`;

/** Flattened into the same shape the main `translations` map uses. */
export const programContentTranslations: Record<
    string,
    { en: string; ar: string; fr: string }
> = Object.fromEntries(
    Object.entries(CONTENT_KINDS).flatMap(([kind, entries]) =>
        Object.entries(entries).map(([en, localized]) => [
            contentKey(kind as ContentKind, en),
            { en, ar: localized.ar, fr: localized.fr },
        ])
    )
);
