import { styleText } from 'node:util';
import { bootcampRoot, loadCatalog, resolveTarget } from './lib/catalog.mjs';
import { runChecks } from './lib/run.mjs';
import { recordProgress } from './lib/progress-store.mjs';

const catalog = loadCatalog();
const input = process.argv[2];
const target = resolveTarget(input, catalog);

if (target.error) {
  console.log(target.error);
  console.log('\nUsage: yarn verify <exercise>[/<step>]   for example: yarn verify 01-js/03  or  yarn verify 01-js/03/2\n');
  console.log('Exercises:');
  for (const m of catalog.modules) console.log(`  ${m.id.padEnd(16)} ${m.title}`);
  process.exit(1);
}

const { module, step } = target;
console.log(`\n${styleText('bold', module.id)}  ${module.title}${step ? `  (step ${step} only)` : ''}\n`);
console.log(styleText('dim', 'Checking...'));

const results = runChecks({ root: bootcampRoot, module, step });
recordProgress(bootcampRoot, module.id, results);

const crashed = results.find((r) => r.n === 0);
if (crashed) {
  console.log(styleText('red', '\nThe checks could not load your code:\n'));
  console.log(indent(crashed.message, 4));
}

const shown = module.steps.filter((s) => step === undefined || s.n === step);
for (const s of shown) {
  const r = results.find((x) => x.n === s.n);
  const state = r?.state ?? 'fail';
  const notStarted = state !== 'pass' && /^TODO\b/.test(r?.message ?? '');
  const mark =
    state === 'pass' ? styleText('green', '✓') : notStarted || s.level === 'stretch' ? styleText('dim', '·') : styleText('red', '✗');
  const label = `${String(s.n).padStart(2)} ${s.level.padEnd(8)}`;
  console.log(`  ${mark} ${label}${s.title}${notStarted ? styleText('dim', '   (not started)') : ''}`);
  if (state !== 'pass' && !notStarted && !crashed) {
    console.log(styleText('cyan', `${' '.repeat(16)}Hint: ${s.hint}`));
    if (r?.message) console.log(styleText('dim', indent(r.message, 16)));
  }
}

const core = shown.filter((s) => s.level === 'core');
const corePassed = core.filter((s) => results.find((r) => r.n === s.n)?.state === 'pass');
const next = core.find((s) => !corePassed.includes(s));
console.log('');
if (step !== undefined) {
  const passed = results.find((r) => r.n === step)?.state === 'pass';
  console.log(passed ? styleText('green', `Step ${step} passes.`) : `Step ${step} does not pass yet.`);
} else if (core.length && corePassed.length === core.length) {
  console.log(styleText('green', `All ${core.length} core steps pass.`) + ' Stretch steps are optional.');
} else {
  console.log(`${corePassed.length} of ${core.length} core steps pass.${next ? ` Next: step ${next.n}, ${next.title}.` : ''}`);
}
console.log('');
process.exit(core.length === corePassed.length && !crashed ? 0 : 1);

function indent(text, n) {
  return text
    .split('\n')
    .map((line) => ' '.repeat(n) + line)
    .join('\n');
}
