// Bring a new version of the bootcamp into your own copy, without losing your work.
//
// Your mentor sends a new zip. Unzip it next to your copy (not over it), then run, from the
// NEW folder's `bootcamp` folder:
//
//   node scripts/update.mjs <path to YOUR bootcamp folder>             see what would change
//   node scripts/update.mjs <path to YOUR bootcamp folder> --apply     make the changes
//
// Files you never touched are replaced by the new version. Files you changed (your exercises,
// your projects) keep your code: the new version's changes are merged into them when they do not
// overlap, and otherwise saved next to your file as `<name>.new` for you to compare.
// node_modules and .npmrc are never touched, and every file the update changes is first copied to
// .update-backup/ in your folder. Your progress (.progress.json) is kept; when a new version adds
// steps to a module, each result moves to the step's new number.
//
// Only Node's own modules are used, so this runs before `yarn install`.
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';

const newRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Never part of a release: installs, build output, and what belongs to one junior.
const IGNORED = new Set([
  'node_modules',
  'dist',
  '.verify-tmp',
  '.progress.json',
  '.npmrc',
  '.update-backup',
  '.git',
]);

/** Same rule as tools/make-update-history.mjs: text is hashed with LF line endings, so Windows checkouts match. */
export function hashContent(buffer) {
  const data = buffer.includes(0)
    ? buffer
    : Buffer.from(buffer.toString('utf8').replaceAll('\r\n', '\n'));
  return createHash('sha1').update(data).digest('hex').slice(0, 12);
}

export function listFiles(root, dir = root, found = new Map()) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name) || entry.name.endsWith('.new')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(root, full, found);
    else if (entry.isFile()) found.set(path.relative(root, full).split(path.sep).join('/'), full);
  }
  return found;
}

function hashOf(file) {
  return existsSync(file) && statSync(file).isFile() ? hashContent(readFileSync(file)) : undefined;
}

/** The release the junior's copy came from: the one most of their files still match. */
export function findBase(releases, target) {
  let best;
  for (const release of releases) {
    let score = 0;
    for (const [rel, hash] of Object.entries(release.files))
      if (hashOf(path.join(target, rel)) === hash) score++;
    if (!best || score >= best.score) best = { release, score };
  }
  return best;
}

/** Pairs [i, j] where a[i] === b[j], in order: a longest common subsequence of lines. */
function commonLines(a, b) {
  const n = a.length;
  const m = b.length;
  const len = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      len[i][j] = a[i] === b[j] ? len[i + 1][j + 1] + 1 : Math.max(len[i + 1][j], len[i][j + 1]);
  const pairs = new Map();
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[i] === b[j]) pairs.set(i++, j++);
    else if (len[i + 1][j] >= len[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

const same = (x, y) => x.length === y.length && x.every((line, i) => line === y[i]);
const TODO = /TODO: step \d+/;
/** The update only renumbered the TODO placeholders in these lines, for example when steps were added. */
const onlyTodoRenumbered = (base, update) =>
  base.length === update.length &&
  base.every((line, i) => line.replace(TODO, '') === update[i].replace(TODO, ''));

/**
 * Three-way merge of text files, line by line (the diff3 idea, in plain JavaScript).
 * Returns the merged text, or undefined when yours and the update change the same lines.
 */
export function merge(yours, original, update) {
  const [mine, base, next] = [yours, original, update].map((t) =>
    t.replaceAll('\r\n', '\n').split('\n'),
  );
  if (base.length * Math.max(mine.length, next.length) > 4_000_000) return undefined;
  const inMine = commonLines(base, mine);
  const inNext = commonLines(base, next);
  const out = [];
  let o = 0;
  let a = 0;
  let b = 0;
  for (;;) {
    // The next base line that is unchanged on both sides anchors the merge.
    let k = o;
    while (k < base.length && !(inMine.has(k) && inNext.has(k))) k++;
    const end = k < base.length;
    const chunk = {
      base: base.slice(o, k),
      mine: mine.slice(a, end ? inMine.get(k) : mine.length),
      next: next.slice(b, end ? inNext.get(k) : next.length),
    };
    if (same(chunk.mine, chunk.base)) out.push(...chunk.next);
    else if (same(chunk.next, chunk.base) || same(chunk.mine, chunk.next)) out.push(...chunk.mine);
    // You already replaced the placeholder, so its new step number does not matter: keep yours.
    else if (onlyTodoRenumbered(chunk.base, chunk.next)) out.push(...chunk.mine);
    else return undefined;
    if (!end) return out.join('\n');
    out.push(base[k]);
    [o, a, b] = [k + 1, inMine.get(k) + 1, inNext.get(k) + 1];
  }
}

/**
 * Step numbers move when a new version adds steps to a module. Carry each saved result over to the
 * step with the same title. A result whose title is gone is kept by number only when the module still
 * has the same number of steps (a reworded title); otherwise it is dropped, so no ✓ lands on a new step.
 */
export function remapProgress(progress, oldCatalog, newCatalog) {
  const remapped = {};
  for (const [id, results] of Object.entries(progress)) {
    const before = oldCatalog.modules.find((m) => m.id === id);
    const after = newCatalog.modules.find((m) => m.id === id);
    if (!before || !after) {
      remapped[id] = results;
      continue;
    }
    remapped[id] = {};
    for (const [n, state] of Object.entries(results)) {
      const title = before.steps.find((s) => s.n === Number(n))?.title;
      const moved = after.steps.find((s) => s.title === title);
      if (moved) remapped[id][moved.n] = state;
      else if (before.steps.length === after.steps.length) remapped[id][n] = state;
    }
  }
  return remapped;
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
}

/** Decide what happens to every file. Pure planning: nothing is written here. */
export function plan({ target, base, blobs, newFiles }) {
  const actions = [];
  const paths = new Set([...Object.keys(base.files), ...newFiles.keys()]);
  for (const rel of [...paths].sort()) {
    const mine = path.join(target, rel);
    const baseHash = base.files[rel];
    const newFile = newFiles.get(rel);
    const newHash = newFile && hashContent(readFileSync(newFile));
    const myHash = hashOf(mine);

    if (!newFile) {
      if (myHash && myHash === baseHash) actions.push({ rel, kind: 'delete' });
      continue;
    }
    if (myHash === newHash) continue;
    if (!myHash) {
      if (!baseHash) actions.push({ rel, kind: 'add', from: newFile });
      // You removed or renamed it (for example report.js to report.ts). Leave it gone, but show what changed.
      else if (baseHash !== newHash)
        actions.push({ rel, kind: 'side', from: newFile, why: 'you renamed or removed it' });
      continue;
    }
    if (myHash === baseHash) {
      actions.push({ rel, kind: 'replace', from: newFile });
      continue;
    }
    if (baseHash === newHash) continue; // only you changed it
    const original = baseHash && blobs[baseHash];
    const merged =
      original === undefined
        ? undefined
        : merge(readFileSync(mine, 'utf8'), original, readFileSync(newFile, 'utf8'));
    if (merged !== undefined) actions.push({ rel, kind: 'merge', text: merged });
    else actions.push({ rel, kind: 'side', from: newFile, why: 'you changed the same lines' });
  }
  return actions;
}

function apply(target, actions) {
  const backup = path.join(
    target,
    '.update-backup',
    new Date().toISOString().replaceAll(':', '-').slice(0, 19),
  );
  for (const a of actions) {
    const mine = path.join(target, a.rel);
    if (existsSync(mine) && a.kind !== 'side') {
      mkdirSync(path.dirname(path.join(backup, a.rel)), { recursive: true });
      copyFileSync(mine, path.join(backup, a.rel));
    }
    mkdirSync(path.dirname(mine), { recursive: true });
    if (a.kind === 'delete') rmSync(mine);
    else if (a.kind === 'merge') writeFileSync(mine, a.text);
    else if (a.kind === 'side') copyFileSync(a.from, `${mine}.new`);
    else copyFileSync(a.from, mine);
  }
  return backup;
}

function resolveTarget(arg) {
  if (!arg) return undefined;
  const given = path.resolve(arg);
  for (const candidate of [given, path.join(given, 'bootcamp')]) {
    if (existsSync(path.join(candidate, 'scripts', 'catalog.json'))) return candidate;
  }
  return undefined;
}

function main() {
  const args = process.argv.slice(2);
  const doApply = args.includes('--apply');
  const target = resolveTarget(args.find((a) => !a.startsWith('--')));
  if (!target) {
    console.log('Usage, from the bootcamp folder of the NEW version:');
    console.log('  node scripts/update.mjs <path to YOUR bootcamp folder>            preview');
    console.log('  node scripts/update.mjs <path to YOUR bootcamp folder> --apply    update');
    process.exit(1);
  }
  if (target === newRoot) {
    console.log(
      'That is this new folder. Give the path to the bootcamp folder you have been working in.',
    );
    process.exit(1);
  }

  const history = JSON.parse(
    readFileSync(path.join(newRoot, 'scripts', 'update', 'history.json'), 'utf8'),
  );
  const newFiles = listFiles(newRoot);
  const current = {
    id: 'this version',
    date: '',
    files: Object.fromEntries(
      [...newFiles].map(([rel, file]) => [rel, hashContent(readFileSync(file))]),
    ),
  };
  const { release: base, score } = findBase([...history.releases, current], target);
  if (base === current) {
    console.log(styleText('green', 'Your copy is already on this version. Nothing to do.'));
    return;
  }
  if (score < Object.keys(base.files).length / 2) {
    console.log(
      styleText(
        'yellow',
        `Warning: your folder looks very different from every known version (best match ${base.id}).`,
      ),
    );
    console.log('Check that the path is your bootcamp folder. Nothing was changed.');
    process.exit(1);
  }

  const actions = plan({ target, base, blobs: history.blobs, newFiles });
  const label = {
    add: 'new file',
    replace: 'updated',
    delete: 'removed',
    merge: 'merged into your file',
    side: 'kept yours, new version saved as .new',
  };
  console.log(
    `\nYour copy is from ${base.date.slice(0, 10)} (${base.id}). ${actions.length} file(s) to update:\n`,
  );
  for (const a of actions) {
    const line = `  ${a.rel.padEnd(52)} ${label[a.kind]}${a.why ? ` (${a.why})` : ''}`;
    console.log(a.kind === 'side' ? styleText('yellow', line) : line);
  }
  if (!doApply) {
    console.log(
      styleText(
        'bold',
        '\nNothing was changed yet. Run the same command with --apply to update.\n',
      ),
    );
    return;
  }
  const oldCatalog = readJson(path.join(target, 'scripts', 'catalog.json'));
  const backup = apply(target, actions);
  console.log(styleText('green', `\nDone. Every file that changed was first copied to ${backup}`));
  const progressFile = path.join(target, '.progress.json');
  const progress = readJson(progressFile);
  const newCatalog = readJson(path.join(newRoot, 'scripts', 'catalog.json'));
  let progressMoved = false;
  if (progress && oldCatalog && newCatalog) {
    const remapped = remapProgress(progress, oldCatalog, newCatalog);
    if (JSON.stringify(remapped) !== JSON.stringify(progress)) {
      mkdirSync(backup, { recursive: true });
      copyFileSync(progressFile, path.join(backup, '.progress.json'));
      writeFileSync(progressFile, JSON.stringify(remapped, null, 2));
      progressMoved = true;
    }
  }
  const sides = actions.filter((a) => a.kind === 'side');
  if (sides.length) {
    console.log(
      '\nFor each file marked .new: your file is unchanged. Open both side by side in VS Code',
    );
    console.log(
      '(select both, right-click, "Compare Selected"), take what you want from the .new one, then delete it.',
    );
  }
  if (actions.some((a) => a.rel === 'package.json' || a.rel === 'yarn.lock')) {
    console.log(
      styleText('bold', '\nThe packages changed: run  yarn install  in your bootcamp folder.'),
    );
  }
  if (progressMoved)
    console.log(
      '\nSome modules have new steps, so your progress moved to the new step numbers. Run  yarn progress  to see it.\n',
    );
  else console.log('\nYour progress is kept. Run  yarn progress  to see it.\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
