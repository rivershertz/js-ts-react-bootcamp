import { styleText } from 'node:util';
import { bootcampRoot, loadCatalog } from './lib/catalog.mjs';
import { readProgress } from './lib/progress-store.mjs';

const catalog = loadCatalog();

/** Pad or cut a title to one column width, so the step marks line up. */
const fit = (text, width) => (text.length > width ? `${text.slice(0, width - 1)}…` : text.padEnd(width));
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
      if (s.level === 'stretch') return styleText('dim', state === 'pass' ? '(✓)' : '(·)');
      return state === 'pass' ? styleText('green', '✓') : state === 'fail' ? styleText('red', '✗') : '·';
    })
    .join(' ');
  const core = m.steps.filter((s) => s.level === 'core');
  const passed = core.filter((s) => done[s.n] === 'pass').length;
  coreDone += passed;
  coreTotal += core.length;
  if (!next && passed < core.length) next = { m, s: core.find((s) => done[s.n] !== 'pass') };
  console.log(`  ${m.id.padEnd(16)} ${fit(m.title, 34)} ${marks}   ${passed}/${core.length} core`);
}
console.log(`\n  ${coreDone} of ${coreTotal} core steps done. Stretch steps are in brackets, (✓) when done, and optional.`);
if (next) console.log(`  Next: yarn verify ${next.m.id}/${next.s.n}   (${next.s.title})`);
else console.log(styleText('green', '  Every core step is done.'));
console.log(styleText('dim', '\n  Progress updates each time you run yarn verify.\n'));
