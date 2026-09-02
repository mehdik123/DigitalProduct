/**
 * Fails if any translation key is missing a language, or if a language file
 * defines a key that does not exist in the English source.
 *
 * Run: npx tsx scripts/checkTranslations.ts
 */
import { translations, LANGUAGES, Language } from '../src/i18n/translations';
import { frenchTranslations } from '../src/i18n/fr';

const keys = Object.keys(translations);
let failed = false;

for (const lang of LANGUAGES) {
  const missing = keys.filter((key) => {
    const value = translations[key][lang as Exclude<Language, never>];
    return !value || !String(value).trim();
  });
  if (missing.length) {
    failed = true;
    console.error(`\n${lang.toUpperCase()} missing ${missing.length} key(s):`);
    for (const key of missing) console.error(`  - ${key}`);
  } else {
    console.log(`${lang.toUpperCase()}: ${keys.length}/${keys.length} keys translated`);
  }
}

const unknown = Object.keys(frenchTranslations).filter((key) => !translations[key]);
if (unknown.length) {
  failed = true;
  console.error(`\nFrench defines ${unknown.length} unknown key(s):`);
  for (const key of unknown) console.error(`  - ${key}`);
}

if (failed) process.exit(1);
console.log('\nAll languages complete.');
