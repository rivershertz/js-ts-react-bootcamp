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
// Your progress (.progress.json), node_modules and .npmrc are never touched, and every file the
// update changes is first copied to .update-backup/ in your folder.
//
// Only Node's own modules are used, so this runs before `yarn install`.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';
import { gunzipSync } from 'node:zlib';

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

/** Three-way merge with git. Returns the merged text, or undefined when the changes overlap or git is missing. */
function merge(yours, original, update) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'bootcamp-update-'));
  try {
    const files = { yours, original, update };
    for (const [name, text] of Object.entries(files))
      writeFileSync(path.join(dir, name), text.replaceAll('\r\n', '\n'));
    const res = spawnSync('git', ['merge-file', '-p', 'yours', 'original', 'update'], {
      cwd: dir,
      encoding: 'utf8',
    });
    return res.status === 0 ? res.stdout : undefined;
  } finally {
    rmSync(dir, { recursive: true, force: true });
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
    gunzipSync(readFileSync(path.join(newRoot, 'scripts', 'update', 'history.json.gz'))).toString(
      'utf8',
    ),
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
  const backup = apply(target, actions);
  console.log(styleText('green', `\nDone. Every file that changed was first copied to ${backup}`));
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
  console.log('\nYour progress is kept. Run  yarn progress  to see it.\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
