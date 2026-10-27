// Authoring tool, run before every release that juniors may receive as a zip.
//
//   node tools/make-update-history.mjs           rewrite bootcamp/scripts/update/history.json.gz
//   node tools/make-update-history.mjs --check   fail if it is missing a release (CI runs this)
//
// `yarn update` (bootcamp/scripts/update.mjs) needs to know what the junior's copy looked like
// when they got it, so it can tell their own edits apart from files that simply changed since.
// Every commit on main's first-parent history is a version someone may have zipped. For each one
// this stores a hash of every bootcamp file, plus the full text of the files juniors edit
// (exercises and projects), which a three-way merge needs as the common original.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync, gzipSync } from 'node:zlib';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(repo, 'bootcamp', 'scripts', 'update', 'history.json.gz');
const { hashContent } = await import(
  new URL('../bootcamp/scripts/update.mjs', import.meta.url).href
);

// Files juniors are expected to edit. Only these need their old text, for merging.
const EDITED = [
  /\/exercises\.[jt]sx?$/,
  /^01-js\/05-modules\//,
  /^02-ts\/08-migration\//,
  /^01-js\/project\/src\//,
  /^02-ts\/project\//,
  /^final-project\//,
];

const git = (...args) => execFileSync('git', args, { cwd: repo, maxBuffer: 1 << 28 });
const ref = process.env.UPDATE_HISTORY_REF ?? 'origin/main';
const head = git('rev-parse', 'HEAD').toString().trim();

const commits = git('rev-list', '--first-parent', '--reverse', ref, '--', 'bootcamp')
  .toString()
  .trim()
  .split('\n')
  .filter((c) => c && c !== head);

if (process.argv.includes('--check')) {
  let known = [];
  try {
    known = JSON.parse(gunzipSync(readFileSync(out)).toString('utf8')).releases.map(
      (r) => r.commit,
    );
  } catch {
    // missing or unreadable: every commit below is reported
  }
  const missing = commits.filter((c) => !known.includes(c));
  if (missing.length) {
    console.error(
      `${path.relative(repo, out)} is missing ${missing.length} release(s) from ${ref}.`,
    );
    console.error('Run  node tools/make-update-history.mjs  and commit the result.');
    process.exit(1);
  }
  console.log(`Update history covers all ${commits.length} releases on ${ref}.`);
  process.exit(0);
}

const blobText = new Map();
const releases = [];
const blobs = {};
for (const commit of commits) {
  const files = {};
  for (const line of git('ls-tree', '-r', commit, 'bootcamp/').toString().trim().split('\n')) {
    const [meta, file] = line.split('\t');
    const blob = meta.split(' ')[2];
    const rel = file.slice('bootcamp/'.length);
    if (!blobText.has(blob)) blobText.set(blob, git('cat-file', 'blob', blob));
    const content = blobText.get(blob);
    const hash = hashContent(content);
    files[rel] = hash;
    if (EDITED.some((re) => re.test(rel)) && !content.includes(0))
      blobs[hash] = content.toString('utf8');
  }
  const date = git('show', '-s', '--format=%cI', commit).toString().trim();
  releases.push({ commit, id: commit.slice(0, 7), date, files });
}

mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, gzipSync(JSON.stringify({ releases, blobs }), { level: 9 }));
console.log(
  `Wrote ${path.relative(repo, out)}: ${releases.length} releases, ${Object.keys(blobs).length} original files.`,
);
