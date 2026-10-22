// Authoring helper: screenshot a page. node tools/shot.mjs <url> <out.png> [width] [height] [dark]
import { chromium } from 'playwright-core';

const [url, out, width = '1280', height = '800', scheme = 'light'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +width, height: +height }, colorScheme: scheme });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: out });
if (errors.length) console.log('Page errors:\n' + errors.join('\n'));
await browser.close();
