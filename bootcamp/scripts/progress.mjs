import { styleText } from 'node:util';
import { bootcampRoot, loadCatalog } from './lib/catalog.mjs';
import { readProgress } from './lib/progress-store.mjs';

const catalog = loadCatalog();
const progress = readProgress(bootcampRoot);
let next;
let coreDone = 0;
let coreTotal = 0;

console.log(`\n${styleText('bold', 'Your progress')}   ${styleText('green', '✓')} passed   ${styleText('red', '✗')} failed   · not tried yet\n`);
for (const m of catalog.modules) {
  const done = progress[m.id] ?? {};
  const marks = m.steps
    .map((s) => {
      const state = done[s.n];
      const mark = state === 'pass' ? styleText('green', '✓') : state === 'fail' ? styleText('red', '✗') : '·';
      return s.level === 'stretch' ? styleText('dim', `(${mark})`) : mark;
    })
    .join(' ');
  const core = m.steps.filter((s) => s.level === 'core');
  const passed = core.filter((s) => done[s.n] === 'pass').length;
  coreDone += passed;
  coreTotal += core.length;
  if (!next && passed < core.length) next = { m, s: core.find((s) => done[s.n] !== 'pass') };
  console.log(`  ${m.id.padEnd(16)} ${m.title.padEnd(30)} ${marks}   ${passed}/${core.length} core`);
}
console.log(`\n  ${coreDone} of ${coreTotal} core steps done. Stretch steps are in brackets and optional.`);
if (next) console.log(`  Next: yarn verify ${next.m.id}/${next.s.n}   (${next.s.title})`);
else console.log(styleText('green', '  Every core step is done.'));
console.log(styleText('dim', '\n  Progress updates each time you run yarn verify.\n'));
