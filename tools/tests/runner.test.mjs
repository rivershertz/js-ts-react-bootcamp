// Tests for the junior-facing runner. Run: node --test tools/tests/
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadCatalog, resolveTarget } from '../../bootcamp/scripts/lib/catalog.mjs';

const bootcamp = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'bootcamp');
const catalog = loadCatalog(bootcamp);

test('accepts every way a junior might type a module', () => {
  for (const input of ['01-js/03', '01-js\\03', '01-js/03/', '01-js/03-scope-closures', '.\\01-js\\03\\']) {
    const { module, step, error } = resolveTarget(input, catalog);
    assert.equal(error, undefined, input);
    assert.equal(module.id, '01-js/03', input);
    assert.equal(step, undefined, input);
  }
});

test('reads a step number after the module', () => {
  assert.equal(resolveTarget('01-js/03/4', catalog).step, 4);
  assert.equal(resolveTarget('01-js\\03\\4', catalog).step, 4);
  assert.equal(resolveTarget('final-project/2', catalog).step, 2);
  assert.equal(resolveTarget('final-project', catalog).module.id, 'final-project');
});

test('explains unknown modules and steps', () => {
  assert.match(resolveTarget('09-go/01', catalog).error, /Unknown exercise/);
  assert.match(resolveTarget(undefined, catalog).error, /Unknown exercise/);
  assert.match(resolveTarget('01-js/03/99', catalog).error, /has no step 99/);
});

test('catalog and check files agree', () => {
  const ids = new Set();
  for (const m of catalog.modules) {
    assert.ok(!ids.has(m.id), `duplicate id ${m.id}`);
    ids.add(m.id);
    const check = readFileSync(path.join(bootcamp, m.check), 'utf8');
    const used = [...check.matchAll(/^step\((\d+),/gm)].map((x) => Number(x[1]));
    assert.deepEqual(used, m.steps.map((s) => s.n), `${m.id}: steps in ${m.check} must match catalog.json, in order`);
    assert.ok(m.steps.some((s) => s.level === 'core'), `${m.id} has no core step`);
    for (const s of m.steps) {
      assert.ok(['core', 'stretch'].includes(s.level), `${m.id} step ${s.n} level`);
      assert.ok(s.hint && s.title, `${m.id} step ${s.n} needs a title and a hint`);
    }
  }
});

test('every module folder in the catalog exists', () => {
  for (const m of catalog.modules) assert.ok(readdirSync(path.join(bootcamp, m.dir)).length > 0, m.dir);
});
