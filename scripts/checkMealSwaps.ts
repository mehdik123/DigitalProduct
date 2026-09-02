/**
 * Every meal in every plan must offer at least one swap alternative, otherwise
 * the swap button is a dead end for the user.
 *
 * The data files import .jpg assets through the `@nutrition` Vite alias, which
 * Node cannot load, so this reads the sources as text and extracts each meal's
 * type and calories. It mirrors the matching rules in
 * `getAlternativesForMeal`; keep the two in sync.
 *
 * Run: npx tsx scripts/checkMealSwaps.ts
 */
import { readFileSync } from 'node:fs';

const CALORIE_TOLERANCE = 0.2;

interface MealRow {
  name: string;
  type: string;
  calories: number;
}

/** Pulls every `name` / `type` / `calories` triple out of a data file. */
function parseMeals(path: string): MealRow[] {
  const source = readFileSync(path, 'utf8');
  const pattern =
    /name:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*calories:\s*(\d+)/g;
  const rows: MealRow[] = [];
  for (const match of source.matchAll(pattern)) {
    rows.push({ name: match[1], type: match[2], calories: Number(match[3]) });
  }
  return rows;
}

const planMeals = parseMeals('src/nutrition/data/mealPlans.ts');
const alternatives = parseMeals('src/nutrition/data/mealAlternatives.ts');

if (planMeals.length === 0 || alternatives.length === 0) {
  console.error('Parsed no meals — the data file format changed.');
  process.exit(1);
}

const substitutesFor = (meal: MealRow) => {
  const isSubstitute = (candidate: MealRow) =>
    candidate.name !== meal.name &&
    Math.abs(candidate.calories - meal.calories) <= meal.calories * CALORIE_TOLERANCE;

  const sameType = alternatives.filter((c) => c.type === meal.type && isSubstitute(c));
  return sameType.length > 0 ? sameType : alternatives.filter(isSubstitute);
};

console.log(`${planMeals.length} plan meals, ${alternatives.length} alternatives\n`);

let empty = 0;
for (const meal of planMeals) {
  const options = substitutesFor(meal);
  if (options.length === 0) empty++;
  const label = options.length === 0 ? 'NONE' : String(options.length);
  console.log(`  [${label}] ${meal.type} · ${meal.name} (${meal.calories} kcal)`);
}

if (empty > 0) {
  console.error(`\n${empty} meal(s) have no alternatives.`);
  process.exit(1);
}
console.log('\nEvery meal has at least one alternative.');
