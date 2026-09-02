/**
 * Fails if any translatable program string in workoutData.ts has no
 * translation. Exercise and day names are excluded by design: they are
 * technical gym terms and stay in English.
 *
 * Run: npx tsx scripts/checkContent.ts
 */
import { threeDaySplit, fourDaySplit, fiveDaySplit } from '../src/data/workoutData';
import { translations } from '../src/i18n/translations';
import { contentKey, ContentKind } from '../src/i18n/programContent';

const days = [...threeDaySplit, ...fourDaySplit, ...fiveDaySplit];
const missing = new Map<string, string>();

const check = (kind: ContentKind, source?: string | null) => {
  if (!source) return;
  const key = contentKey(kind, source);
  const entry = translations[key];
  if (!entry || !entry.ar || !entry.fr) missing.set(key, `${kind}: ${source}`);
};

// Exercise names and day names are intentionally untranslated technical terms,
// so they are not checked here.
for (const day of days) {
  const d = day as unknown as Record<string, string | undefined>;
  check('dayDesc', d.description);
  check('focus', d.focus);
  check('difficulty', d.difficulty);
}

if (missing.size) {
  console.error(`Untranslated program content (${missing.size}):`);
  for (const [key, label] of missing) console.error(`  - ${label}  [${key}]`);
  process.exit(1);
}

const contentKeys = Object.keys(translations).filter((k) => k.startsWith('content.'));
console.log(`All program content translated (${contentKeys.length} content keys, en/ar/fr).`);
