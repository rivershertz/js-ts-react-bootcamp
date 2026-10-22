import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import { findShortcuts, stepSource } from '../../lib/source';
import { typeErrorsForStep } from '../../lib/typecheck';
import fixtures from '../../fixtures/tickets.json';

type Ticket = (typeof fixtures)[number];
type Fn = (...args: never[]) => unknown;
type Exercises = Record<'first' | 'indexBy' | 'updateTicket' | 'summarize' | 'unwrap' | 'countBy', Fn>;

const step = defineSteps('02-ts/06');
const exercise = '02-ts/06-generics-utility-types/exercises';
const ex = () => load<Exercises>(exercise);
const call = <R>(fn: Fn, ...args: unknown[]) => callPure(fn as (...a: unknown[]) => R, ...args);

function expectCleanStep(n: number) {
  const errors = typeErrorsForStep([path.join(__dirname, '06.types.ts'), junior(exercise)], n);
  if (errors.length) throw new Error(errors.join('\n'));
  const shortcuts = findShortcuts(stepSource(junior(exercise), n)).filter((s) => s.kind === 'any');
  expect(shortcuts.map((s) => s.text), 'No `any`: a type parameter keeps the real type').toEqual([]);
}

const tickets = fixtures as Ticket[];

step(1, async () => {
  expectCleanStep(1);
  const { first } = await ex();
  expect(call(first, tickets)).toEqual(tickets[0]);
  expect(call(first, [])).toBeUndefined();
});

step(2, async () => {
  expectCleanStep(2);
  const { indexBy } = await ex();
  const byId = call<Record<string, Ticket>>(indexBy, tickets, (t: Ticket) => t.id);
  expect(Object.keys(byId)).toHaveLength(12);
  expect(byId.t7.title).toBe('Table pagination resets on edit');
});

step(3, () => expectCleanStep(3));

step(4, async () => {
  expectCleanStep(4);
  const { updateTicket } = await ex();
  const t = tickets[0];
  expect(call(updateTicket, t, { title: 'New title', priority: 'high' })).toEqual({ ...t, title: 'New title', priority: 'high' });
  expect(call(updateTicket, t, {})).toEqual(t);
  const sneaky = call<Ticket>(updateTicket, t, { id: 'hacked', createdAt: '2000-01-01T00:00:00Z' });
  expect(sneaky.id, 'id never changes, even if changes contains one at run time').toBe(t.id);
  expect(sneaky.createdAt).toBe(t.createdAt);
});

step(5, async () => {
  expectCleanStep(5);
  const { summarize } = await ex();
  expect(call(summarize, tickets[2]), 'only id and title, no other fields').toStrictEqual({ id: 't3', title: 'Search ignores Hebrew characters' });
});

step(6, async () => {
  expectCleanStep(6);
  const { unwrap } = await ex();
  expect(call(unwrap, { ok: true, data: [1, 2] }, [])).toEqual([1, 2]);
  expect(call(unwrap, { ok: false, error: 'Server down' }, [])).toEqual([]);
});

step(7, async () => {
  expectCleanStep(7);
  const { countBy } = await ex();
  expect(call(countBy, tickets, (t: Ticket) => t.status)).toEqual({ open: 2, assigned: 3, blocked: 2, closed: 5 });
  expect(call(countBy, [], (t: Ticket) => t.status)).toEqual({});
});
