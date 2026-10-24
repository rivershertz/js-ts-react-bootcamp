// Authoring check for the whole bootcamp. Not shipped to juniors.
//
//   node tools/verify.mjs            every module
//   node tools/verify.mjs 01-js/03   one module
//
// 1. Starters: every core step must FAIL on the untouched bootcamp/ files
//    (a check that passes on the starter teaches nothing). The final project is also run with
//    Phase 2 solved, since it imports that logic.
// 2. Solutions: mentor/solutions/ is copied over a scratch copy of bootcamp/
//    and every step, core and stretch, must PASS.
// 3. Content: no internet links under bootcamp/, relative links resolve, the solved copy
//    type-checks, and lessons, scripts and starters lint cleanly (the final project is meant to fail both).
import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bootcamp = path.join(repo, 'bootcamp');
const solutions = path.join(repo, 'mentor', 'solutions');
const scratch = path.join(repo, '.verify-tmp', 'bootcamp');

const { loadCatalog } = await import(pathToUrl(path.join(bootcamp, 'scripts/lib/catalog.mjs')));
const { runChecks } = await import(pathToUrl(path.join(bootcamp, 'scripts/lib/run.mjs')));

const catalog = loadCatalog(bootcamp);
const only = process.argv[2];
const modules = catalog.modules.filter((m) => !only || m.id === only);
const problems = [];

// Scratch copy with the solutions laid over the starters. node_modules is linked, not copied
// (a junction, so this also works on Windows without admin rights).
rmSync(scratch, { recursive: true, force: true });
mkdirSync(scratch, { recursive: true });
cpSync(bootcamp, scratch, {
  recursive: true,
  filter: (src) => !src.startsWith(path.join(bootcamp, 'node_modules')) && !src.endsWith('.progress.json'),
});
symlinkSync(path.join(bootcamp, 'node_modules'), path.join(scratch, 'node_modules'), 'junction');
cpSync(solutions, scratch, { recursive: true });
removeStarterFilesReplacedBySolutions();

// The setup check (and any check that needs the real API) talks to a running server.
const api = startApi();

for (const module of modules) {
  process.stdout.write(`${module.id.padEnd(16)} `);
  const starter = runChecks({ root: bootcamp, module });
  // The setup check insists on being started by Yarn 1, as juniors do; this tool is started by node.
  const solved = runChecks({ root: scratch, module, env: { npm_config_user_agent: 'yarn/1.22.22 tools/verify' } });
  const row = [];
  for (const s of module.steps) {
    const onStarter = starter.find((r) => r.n === s.n)?.state ?? 'fail';
    const onSolution = solved.find((r) => r.n === s.n);
    if (s.level === 'core' && onStarter === 'pass' && module.kind !== 'smoke') problems.push(`${module.id} step ${s.n} passes on the untouched starter`);
    if (onSolution?.state !== 'pass') {
      const why = onSolution?.message ?? solved.find((r) => r.n === 0)?.message ?? 'no result';
      problems.push(`${module.id} step ${s.n} fails on the solution:\n      ${why.split('\n').join('\n      ')}`);
    }
    row.push(onSolution?.state === 'pass' && (s.level === 'stretch' || module.kind === 'smoke' || onStarter !== 'pass') ? styleText('green', '✓') : styleText('red', '✗'));
  }
  console.log(row.join(' '));
}

// The final project imports the junior's Phase 2 logic, which the untouched bootcamp does not have yet.
// So also run its checks on the starter app with Phase 2 solved: each planted problem must be caught on its own.
const final = modules.find((m) => m.id === 'final-project');
if (final) {
  const withPhase2 = path.join(repo, '.verify-tmp', 'final-starter');
  rmSync(withPhase2, { recursive: true, force: true });
  cpSync(bootcamp, withPhase2, {
    recursive: true,
    filter: (src) => !src.startsWith(path.join(bootcamp, 'node_modules')) && !src.endsWith('.progress.json'),
  });
  symlinkSync(path.join(bootcamp, 'node_modules'), path.join(withPhase2, 'node_modules'), 'junction');
  rmSync(path.join(withPhase2, '02-ts/project/src'), { recursive: true, force: true });
  cpSync(path.join(solutions, '02-ts/project/src'), path.join(withPhase2, '02-ts/project/src'), { recursive: true });
  process.stdout.write(`${'  with Phase 2'.padEnd(16)} `);
  const results = runChecks({ root: withPhase2, module: final });
  const row = [];
  for (const s of final.steps) {
    const r = results.find((x) => x.n === s.n);
    if (s.level === 'core' && r?.state === 'pass') problems.push(`final-project step ${s.n} passes on the starter app (with Phase 2 solved)`);
    if (r?.message?.includes('02-ts/project/src/index.ts is missing')) problems.push(`final-project step ${s.n} could not find the Phase 2 logic`);
    row.push(r?.state === 'pass' ? styleText('red', '✗') : styleText('green', '✓'));
  }
  console.log(row.join(' '));
}

api.kill();
if (!only) checkContent();

console.log('');
if (problems.length) {
  console.log(styleText('red', `${problems.length} problem(s):`));
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log(styleText('green', 'All good: starters fail, solutions pass, content is offline-safe.'));

function startApi() {
  const python = process.platform === 'win32' ? 'python' : 'python3';
  const child = spawn(python, [path.join(bootcamp, 'server', 'server.py')], { stdio: 'ignore' });
  child.on('error', () => problems.push(`Could not start the Python API with "${python}"`));
  spawnSync(process.execPath, ['-e', 'setTimeout(() => {}, 1500)']);
  return child;
}

function removeStarterFilesReplacedBySolutions() {
  // A solution .ts/.tsx replaces a starter .js/.jsx of the same name (the migration exercises).
  for (const file of walk(solutions)) {
    const rel = path.relative(solutions, file);
    const base = rel.replace(/\.(tsx?|jsx?)$/, '');
    for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
      const candidate = path.join(scratch, base + ext);
      if (base + ext !== rel && existsSync(candidate)) rmSync(candidate);
    }
  }
  // A solution directory that is a complete app replaces the starter's src entirely.
  for (const dir of ['final-project/src']) {
    if (existsSync(path.join(solutions, dir))) {
      rmSync(path.join(scratch, dir), { recursive: true, force: true });
      cpSync(path.join(solutions, dir), path.join(scratch, dir), { recursive: true });
    }
  }
}

function checkContent() {
  // tsc runs on the solved copy: Phase 2 starters contain type errors on purpose (fixing them is the exercise).
  for (const [label, bin, args, cwd] of [
    ['tsc', 'typescript/bin/tsc', ['-p', 'tsconfig.json', '--pretty', 'false'], scratch],
    ['lesson kit tests', 'vitest/vitest.mjs', ['run', 'lessons', '--config', 'vitest.config.ts'], bootcamp],
    ['eslint', 'eslint/bin/eslint.js', ['lessons', 'scripts', 'playground', '01-js', '02-ts', '03-react', '--max-warnings', '0'], bootcamp],
  ]) {
    const res = spawnSync(process.execPath, [path.join(bootcamp, 'node_modules', bin), ...args], { cwd, encoding: 'utf8' });
    const where = cwd === scratch ? 'the solved copy' : 'bootcamp/';
    if (res.status !== 0) problems.push(`${label} fails on ${where}:\n      ${`${res.stdout}${res.stderr}`.trim().split('\n').slice(0, 10).join('\n      ')}`);
  }
  const files = walk(bootcamp).filter((f) => /\.(md|tsx?|jsx?|html|css)$/.test(f) && !f.includes('node_modules'));
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const rel = path.relative(bootcamp, file);
    for (const m of text.matchAll(/https?:\/\/[^\s)'"`<>]+/g)) {
      if (!/^https?:\/\/(localhost|127\.0\.0\.1)/.test(m[0])) problems.push(`${rel} links to the internet: ${m[0]}`);
    }
    if (file.endsWith('.md')) {
      for (const m of text.matchAll(/\]\(([^)#\s]+)/g)) {
        if (!/^[a-z]+:/.test(m[1]) && !existsSync(path.resolve(path.dirname(file), m[1]))) {
          problems.push(`${rel} has a broken link: ${m[1]}`);
        }
      }
    }
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (name === 'node_modules' || name === 'dist') return [];
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function pathToUrl(p) {
  return new URL(`file:///${p.replaceAll('\\', '/').replace(/^\//, '')}`).href;
}
