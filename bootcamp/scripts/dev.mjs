import { existsSync } from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { bootcampRoot, loadCatalog, resolveTarget } from './lib/catalog.mjs';

const catalog = loadCatalog();
const target = resolveTarget(process.argv[2], catalog);
const runnable = catalog.modules.filter((m) => existsSync(path.join(bootcampRoot, m.dir, 'index.html')));

if (target.error || !existsSync(path.join(bootcampRoot, target.module.dir, 'index.html'))) {
  console.log(target.error ?? `${target.module.id} has nothing to show in the browser.`);
  console.log('\nUsage: yarn dev <exercise>   for example: yarn dev final-project\n\nThese open in the browser:');
  for (const m of runnable) console.log(`  ${m.id.padEnd(16)} ${m.title}`);
  process.exit(1);
}

const dir = path.join(bootcampRoot, target.module.dir);
const ownConfig = path.join(dir, 'vite.config.ts');
const server = await createServer(
  existsSync(ownConfig)
    ? { root: dir, configFile: ownConfig }
    : {
        root: dir,
        configFile: false,
        plugins: [react()],
        server: { port: 5173, proxy: { '/api': 'http://localhost:8000' }, fs: { allow: [bootcampRoot] } },
      },
);
await server.listen();

const apiUp = await fetch('http://localhost:8000/api/assignees').then(
  (r) => r.ok,
  () => false,
);
console.log(`\n${styleText('bold', target.module.id)}  ${target.module.title}\n`);
server.printUrls();
if (!apiUp) {
  console.log(styleText('yellow', '\n  The ticket API is not running, so pages that load tickets will show an error.'));
  console.log(styleText('yellow', '  Start it in a second terminal:  python server/server.py'));
}
console.log(styleText('dim', '\n  Press Ctrl+C to stop.\n'));
