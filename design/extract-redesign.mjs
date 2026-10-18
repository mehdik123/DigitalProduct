import fs from 'fs';

const html = fs.readFileSync('c:/Users/DELL/Downloads/Hybrid-Athlete-Redesign.html', 'utf8');
const clean = html
  .replace(/url\(data:[^)]+\)/g, 'url(#asset)')
  .replace(/src="data:[^"]+"/g, 'src="#"');

const s = clean.indexOf('<style>');
const e = clean.indexOf('</style>');
const css = clean.slice(s + 7, e);
fs.writeFileSync(new URL('./redesign-extracted.css', import.meta.url), css);

const bodyStart = clean.indexOf('</style>') + 8;
const body = clean.slice(bodyStart);
fs.writeFileSync(new URL('./redesign-body.html', import.meta.url), body);

console.log('css chars', css.length);
console.log('body chars', body.length);

// Print P01-P06 text content (no tags heavy)
for (const id of ['P01', 'P02', 'P03', 'P04', 'P05', 'P06']) {
  const idx = body.indexOf(`class="pid">${id}`);
  console.log('\n===', id, 'idx', idx);
  if (idx < 0) continue;
  const chunk = body.slice(Math.max(0, idx - 200), idx + 1800).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(chunk.slice(0, 900));
}
