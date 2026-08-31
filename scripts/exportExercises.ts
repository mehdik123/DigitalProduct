/**
 * Exports every unique movement used across the 3/4/5-day programs to a CSV,
 * so video links can be collected in a spreadsheet and pasted back in.
 *
 * Run: npx tsx scripts/exportExercises.ts
 */
import { writeFileSync } from 'node:fs';
import { threeDaySplit, fourDaySplit, fiveDaySplit } from '../src/data/workoutData';
import { WorkoutDay } from '../src/types/workout';

const programs: Array<{ label: string; split: WorkoutDay[] }> = [
  { label: '3', split: threeDaySplit },
  { label: '4', split: fourDaySplit },
  { label: '5', split: fiveDaySplit },
];

interface Row {
  name: string;
  type: string;
  ids: Set<string>;
  days: Set<string>;
  programs: Set<string>;
  videoUrl: string;
}

// Group by movement name: the same movement can appear under several ids
// (e.g. pull-ups on two different days), but needs only one video link.
const byName = new Map<string, Row>();

for (const { label, split } of programs) {
  for (const day of split) {
    for (const ex of day.exercises) {
      let row = byName.get(ex.name);
      if (!row) {
        row = {
          name: ex.name,
          type: ex.type,
          ids: new Set(),
          days: new Set(),
          programs: new Set(),
          videoUrl: ex.videoUrl || '',
        };
        byName.set(ex.name, row);
      }
      row.ids.add(ex.id);
      row.days.add(day.name);
      row.programs.add(label);
    }
  }
}

const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

const header = [
  'Exercise',
  'Type',
  'Used On Days',
  'In Programs (days/week)',
  'Exercise IDs',
  'Current Video URL',
  'New Video URL',
];

const rows = [...byName.values()]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((r) =>
    [
      r.name,
      r.type,
      [...r.days].join(' + '),
      [...r.programs].sort().join(' / '),
      [...r.ids].join(' + '),
      r.videoUrl,
      '',
    ]
      .map(csvCell)
      .join(',')
  );

const csv = [header.join(','), ...rows].join('\r\n') + '\r\n';
writeFileSync('exercise-video-links.csv', csv, 'utf8');

// Tab-separated copy: pasting this straight into Excel fills separate columns.
const tsvRows = [...byName.values()]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((r) =>
    [
      r.name,
      r.type,
      [...r.days].join(' + '),
      [...r.programs].sort().join(' / '),
      [...r.ids].join(' + '),
      r.videoUrl,
      '',
    ].join('\t')
  );
const tsv = [header.join('\t'), ...tsvRows].join('\r\n') + '\r\n';
writeFileSync('exercise-video-links.tsv', tsv, 'utf8');

console.log(tsv);
console.log(`${rows.length} unique movements written to exercise-video-links.csv and .tsv`);
