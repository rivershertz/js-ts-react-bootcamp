import { readFileSync } from 'node:fs';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import fixtures from '../../fixtures/tickets.json';

type Ticket = (typeof fixtures)[number];
type Mod = Record<string, unknown>;

const step = defineSteps('01-js/05');
const dir = '01-js/05-modules';
const file = (name: string) => load<Mod>(`${dir}/${name}`);
const tickets = fixtures as Ticket[];

/** The file's code without comments, so example lines in comments do not count. */
function source(name: string): string {
  return readFileSync(junior(`${dir}/${name}`), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/** Every `from '...'` and `import('...')` path in a file. */
function importPaths(name: string): string[] {
  return [...source(name).matchAll(/(?:from\s*|import\s*\(\s*)['"]([^'"]+)['"]/g)].map((m) => m[1]);
}

function expectFullPaths(name: string) {
  for (const p of importPaths(name)) {
    expect(p, `In ${name}, write the whole file name: './${p.replace(/^\.\//, '')}.js'. Node needs the .js (Vite forgives it, Node does not).`).toMatch(/\.js$/);
  }
}

function exported(mod: Mod, name: string, fileName: string) {
  expect(mod[name], `${fileName} does not export ${name} yet.`).toBeDefined();
  return mod[name];
}

step(1, async () => {
  const mod = await file('priorities');
  expect(exported(mod, 'PRIORITIES', 'priorities.js')).toEqual(['low', 'medium', 'high', 'urgent']);
  const comparePriority = exported(mod, 'comparePriority', 'priorities.js') as (a: Ticket, b: Ticket) => number;
  const sorted = tickets.slice(0, 4).toSorted(comparePriority);
  expect(sorted.map((t) => t.priority)).toEqual(['urgent', 'high', 'medium', 'low']);
});

step(2, async () => {
  const mod = await file('format');
  expect(mod.default, 'format.js has no default export yet. Write `export default` in front of the function.').toBeTypeOf('function');
  const formatTicket = mod.default as (t: Ticket) => string;
  expect(callPure(formatTicket, tickets[9])).toBe('[P1] t10 Avatar upload fails over 2MB');
  expect(callPure(formatTicket, tickets[0])).toBe('[P4] t1 Login page shows blank screen');
  expect(importPaths('format'), 'format.js should import PRIORITIES from ./priorities.js').toContain('./priorities.js');
  expectFullPaths('format');
});

step(3, async () => {
  const dates = await file('dates');
  const isOverdue = exported(dates, 'isOverdue', 'dates.js') as (t: Ticket, now: Date) => boolean;
  const now = new Date('2026-10-15T12:00:00Z');
  expect(isOverdue(tickets[1], now), 't2 was due 2026-10-02, so it is overdue on 2026-10-15').toBe(true);
  expect(isOverdue(tickets[0], now), 't1 has no due date').toBe(false);

  const code = source('tickets');
  expect(code, 'tickets.js still has its own isOverdue. Move it to dates.js and import it.').not.toMatch(/function\s+isOverdue|isOverdue\s*=/);
  expect(importPaths('tickets'), 'tickets.js should import isOverdue from ./dates.js').toContain('./dates.js');
  expectFullPaths('tickets');

  const { overdueTickets } = await file('tickets');
  const overdue = callPure(overdueTickets as (t: Ticket[], n: Date) => Ticket[], tickets, now);
  expect(overdue.map((t) => t.id)).toEqual(['t2', 't5', 't6']);
});

step(4, async () => {
  const index = await file('index');
  const priorities = await file('priorities');
  const format = await file('format');
  const dates = await file('dates');
  const ticketsModule = await file('tickets');
  // Re-exports hand out the very same functions, not copies.
  expect(exported(index, 'PRIORITIES', 'index.js')).toBe(priorities.PRIORITIES);
  expect(exported(index, 'comparePriority', 'index.js')).toBe(priorities.comparePriority);
  expect(exported(index, 'formatTicket', 'index.js'), 'formatTicket should be the default export of format.js, renamed').toBe(format.default);
  expect(exported(index, 'isOverdue', 'index.js')).toBe(dates.isOverdue);
  expect(exported(index, 'overdueTickets', 'index.js')).toBe(ticketsModule.overdueTickets);
  expectFullPaths('index');
});

step(5, async () => {
  const counter = await file('counter');
  expect(counter.count, 'counter.js should export a variable named count').toBeTypeOf('number');
  const increment = exported(counter, 'increment', 'counter.js') as () => void;
  const before = counter.count as number;
  increment();
  increment();
  expect(counter.count, 'after two increment() calls, the imported count should be 2 more').toBe(before + 2);
});

step(6, async () => {
  const { overdueReport } = await file('report');
  const report = callPure(overdueReport as (t: Ticket[], n: Date) => string[], tickets, new Date('2026-11-25T12:00:00Z'));
  expect(report).toEqual([
    '[P1] t10 Avatar upload fails over 2MB',
    '[P3] t2 Export to CSV drops last row',
    '[P3] t6 Password reset email not sent',
    '[P4] t5 Wrong timezone on due dates',
  ]);
  const staticPaths = [...source('report').matchAll(/from\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  expect(staticPaths, 'report.js should import only from ./index.js').toEqual(['./index.js']);
});

step(7, async () => {
  const { loadFormatter } = await file('report');
  const format = await file('format');
  const promise = (loadFormatter as () => unknown)();
  expect(promise, 'loadFormatter should return a promise (make it async)').toBeInstanceOf(Promise);
  expect(await promise).toBe(format.default);
  expect(source('report'), 'use import(\'./format.js\') inside loadFormatter').toMatch(/import\s*\(\s*['"]\.\/format\.js['"]\s*\)/);
});
