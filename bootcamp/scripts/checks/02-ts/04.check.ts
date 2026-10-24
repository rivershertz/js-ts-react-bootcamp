import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { findShortcuts, stepSource } from '../../lib/source';
import { typeErrorsForStep } from '../../lib/typecheck';
import fixtures from '../../fixtures/tickets.json';
import assignees from '../../fixtures/assignees.json';

type Guard = (value: unknown) => boolean;
type Exercises = {
  isPriority: Guard;
  isRecord: Guard;
  isAssignee: Guard;
  isTicket: Guard;
  assertTicket: (value: unknown) => void;
  parseTickets: (data: unknown) => { tickets: { id: string }[]; invalid: number };
  ticketProblems: (value: unknown) => string[];
};

const step = defineSteps('02-ts/04');
const exercise = '02-ts/04-type-guards/exercises';
const ex = () => load<Exercises>(exercise);

function expectCleanStep(n: number) {
  const errors = typeErrorsForStep([path.join(__dirname, '04.types.ts'), junior(exercise)], n);
  if (errors.length) throw new Error(errors.join('\n'));
  const shortcuts = findShortcuts(stepSource(junior(exercise), n)).filter((s) => s.kind === 'as' || s.kind === 'any');
  expect(shortcuts.map((s) => s.text), 'Check the value instead of using `as` or `any`').toEqual([]);
}

const good = fixtures[0];
const bad = { id: 't-bad', title: 'Imported from the old system', priority: 3, status: 'open' };

step(1, async () => {
  expectCleanStep(1);
  const { isPriority } = await ex();
  for (const p of ['low', 'medium', 'high', 'urgent']) expect(isPriority(p), p).toBe(true);
  for (const v of ['Urgent', 'critical', 3, null, undefined, ['low']]) expect(isPriority(v), JSON.stringify(v)).toBe(false);
});

step(2, async () => {
  expectCleanStep(2);
  const { isRecord } = await ex();
  expect(isRecord({})).toBe(true);
  expect(isRecord(good)).toBe(true);
  expect(isRecord(null), 'typeof null is "object" in JavaScript, so check for null separately').toBe(false);
  expect(isRecord([]), 'arrays are objects too: use Array.isArray').toBe(false);
  expect(isRecord('t1')).toBe(false);
});

step(3, async () => {
  expectCleanStep(3);
  const { isAssignee } = await ex();
  for (const a of assignees) expect(isAssignee(a)).toBe(true);
  expect(isAssignee({ id: 'a1' }), 'name is missing').toBe(false);
  expect(isAssignee({ id: 1, name: 'Dana' }), 'id is a number').toBe(false);
  expect(isAssignee(null)).toBe(false);
});

step(4, async () => {
  expectCleanStep(4);
  const { isTicket } = await ex();
  for (const t of fixtures) expect(isTicket(t), `fixture ticket ${t.id}`).toBe(true);
  expect(isTicket(bad), 'priority 3 is not a priority, and createdAt is missing').toBe(false);
  expect(isTicket({ ...good, status: 'archived' })).toBe(false);
  expect(isTicket({ ...good, dueDate: undefined }), 'dueDate must be a string or null, not missing').toBe(false);
  expect(isTicket({ ...good, title: null })).toBe(false);
  expect(isTicket('t1')).toBe(false);
});

step(5, async () => {
  expectCleanStep(5);
  const { assertTicket } = await ex();
  expect(() => assertTicket(good)).not.toThrow();
  expect(() => assertTicket(bad)).toThrow('Not a valid ticket: t-bad');
  expect(() => assertTicket(42)).toThrow('Not a valid ticket: ?');
});

step(6, async () => {
  expectCleanStep(6);
  const { parseTickets } = await ex();
  const result = parseTickets([...fixtures, bad, null]);
  expect(result.tickets.map((t) => t.id)).toEqual(fixtures.map((t) => t.id));
  expect(result.invalid).toBe(2);
  expect(() => parseTickets({ error: 'oops' })).toThrow('Expected a list of tickets');
});

step(7, async () => {
  expectCleanStep(7);
  const { ticketProblems } = await ex();
  expect(ticketProblems(good)).toEqual([]);
  expect(ticketProblems(bad)).toEqual(['priority must be one of low, medium, high, urgent', 'createdAt must be a string', 'dueDate must be a string or null']);
  expect(ticketProblems('x')).toEqual(['not an object']);
});
