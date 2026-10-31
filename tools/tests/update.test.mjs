// Tests for the offline update (bootcamp/scripts/update.mjs). Run: node --test tools/tests/
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { findBase, hashContent, listFiles, merge, plan, remapProgress } from '../../bootcamp/scripts/update.mjs';

const ORIGINAL = '// Step 1: old comment\nexport function f() {\n  throw new Error("TODO");\n}\n';
const UPDATED =
  '// Step 1: clearer comment\n// Example: f() returns 1\nexport function f() {\n  throw new Error("TODO");\n}\n';

function folder(root, files) {
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), text);
  }
  return root;
}

test("keeps the junior's code, takes the new comments, and leaves their progress alone", (t) => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'update-test-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const release = { id: 'old', date: '2026-10-01', files: {} };
  const old = {
    'ex.js': ORIGINAL,
    'lesson.md': 'old lesson\n',
    'gone.md': 'removed later\n',
    'clash.js': ORIGINAL,
  };
  for (const [rel, text] of Object.entries(old))
    release.files[rel] = hashContent(Buffer.from(text));

  const mine = folder(path.join(tmp, 'mine'), {
    ...old,
    'ex.js': ORIGINAL.replace('throw new Error("TODO");', 'return 1;'),
    'clash.js': ORIGINAL.replace('old comment', 'my own note'),
    'lesson.md': 'old lesson\r\n', // a Windows checkout of the same file
    '.progress.json': '{}',
  });
  const next = folder(path.join(tmp, 'next'), {
    'ex.js': UPDATED,
    'clash.js': UPDATED,
    'lesson.md': 'new lesson\n',
    'added.md': 'new\n',
  });

  assert.equal(findBase([release], mine).release, release);
  const actions = plan({
    target: mine,
    base: release,
    blobs: { [release.files['ex.js']]: ORIGINAL },
    newFiles: listFiles(next),
  });
  const kind = Object.fromEntries(actions.map((a) => [a.rel, a.kind]));
  assert.deepEqual(kind, {
    'added.md': 'add',
    'clash.js': 'side',
    'ex.js': 'merge',
    'gone.md': 'delete',
    'lesson.md': 'replace',
  });
  const merged = actions.find((a) => a.rel === 'ex.js').text;
  assert.match(merged, /clearer comment/);
  assert.match(merged, /return 1;/);
  assert.equal(readFileSync(path.join(mine, '.progress.json'), 'utf8'), '{}');
});

test('merges line changes from both sides, and refuses when they touch the same lines', () => {
  const base = 'a\nb\nc\nd\ne\n';
  assert.equal(merge('a\nB\nc\nd\ne\n', base, 'a\nb\nc\nD\ne\n'), 'a\nB\nc\nD\ne\n');
  assert.equal(merge('a\nb\nc\nd\ne\nmine\n', base, 'top\na\nb\nc\nd\ne\n'), 'top\na\nb\nc\nd\ne\nmine\n');
  assert.equal(merge('a\nb\nd\ne\n', base, 'a\nb\nc\nd\ne\nnew\n'), 'a\nb\nd\ne\nnew\n');
  assert.equal(merge('a\nX\nc\nd\ne\n', base, 'a\nY\nc\nd\ne\n'), undefined);
  assert.equal(merge('a\r\nB\r\nc\r\nd\r\ne\r\n', base, base), 'a\nB\nc\nd\ne\n');
  // A new version renumbers the TODO placeholder the junior already replaced: their code wins.
  const todo = 'f() {\n  throw new Error("TODO: step 1");\n}\n';
  assert.equal(
    merge('f() {\n  return 1;\n}\n', todo, 'g() {}\nf() {\n  throw new Error("TODO: step 2");\n}\n'),
    'g() {}\nf() {\n  return 1;\n}\n',
  );
});

test('moves saved results to the new step numbers when steps are added', () => {
  const steps = (...titles) => titles.map((title, i) => ({ n: i + 1, title }));
  const oldCatalog = {
    modules: [
      { id: 'm', steps: steps('counter', 'once') },
      { id: 'same', steps: steps('first', 'old wording') },
    ],
  };
  const newCatalog = {
    modules: [
      { id: 'm', steps: steps('greeter', 'counter', 'queue', 'once') },
      { id: 'same', steps: steps('first', 'new wording') },
    ],
  };
  const progress = { m: { 1: 'pass', 2: 'fail' }, same: { 1: 'pass', 2: 'pass' }, gone: { 1: 'pass' } };
  assert.deepEqual(remapProgress(progress, oldCatalog, newCatalog), {
    m: { 2: 'pass', 4: 'fail' },
    same: { 1: 'pass', 2: 'pass' },
    gone: { 1: 'pass' },
  });
});
