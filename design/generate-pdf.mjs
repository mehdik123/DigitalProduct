import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.error('Installing puppeteer…');
    const { execSync } = await import('child_process');
    execSync('npm install --no-save puppeteer', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    puppeteer = require('puppeteer');
  }

  const htmlPath = path.join(__dirname, 'app-pages.html');
  const outPath = path.join(__dirname, 'Hybrid-Athlete-Current-Screens.pdf');
  const fileUrl = pathToFileURL(htmlPath).href;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await browser.close();

  const stat = fs.statSync(outPath);
  console.log(`Wrote ${outPath} (${Math.round(stat.size / 1024)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
