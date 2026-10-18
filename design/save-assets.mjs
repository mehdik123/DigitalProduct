import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('c:/Users/DELL/Downloads/Hybrid-Athlete-Redesign.html', 'utf8');
const outDir = path.resolve('public/images');

function save(dataUrl, name) {
  const [meta, b64] = dataUrl.split(',');
  const ext = meta.includes('png') ? 'png' : 'jpg';
  const file = path.join(outDir, `${name}.${ext}`);
  fs.writeFileSync(file, Buffer.from(b64, 'base64'));
  console.log('saved', file, fs.statSync(file).size);
}

const hero = html.match(/class="hero"><img src="(data:image\/jpeg;base64,[^"]+)"/);
const brand = html.match(/class="brand"><img src="(data:image\/png;base64,[^"]+)"/);
if (hero) save(hero[1], 'coach_hero');
else console.log('no hero');
if (brand) save(brand[1], 'brand_mark');
else console.log('no brand');
