// Authoring helper: step through a deck and screenshot every step, in light and dark.
//   node tools/screenshot-deck.mjs 01-js/03      (needs `yarn lessons` running)
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const id = process.argv[2];
const out = `tools/screenshots/${id.replaceAll('/', '_')}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const scheme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1320, height: 760 }, colorScheme: scheme });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`http://localhost:5174/#/${id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  let previous = '';
  for (let n = 1; n <= 120; n++) {
    await page.waitForTimeout(300);
    const shot = await page.screenshot({ path: `${out}/${scheme}-${String(n).padStart(3, '0')}.png` });
    const key = shot.toString('base64');
    if (key === previous) break;
    previous = key;
    await page.keyboard.press('ArrowRight');
  }
  // Content that overflows its slide is a layout bug.
  if (errors.length) console.log(`${scheme}: page errors:\n${errors.join('\n')}`);
  await page.close();
}
await browser.close();
console.log(`Screenshots in ${out}`);
