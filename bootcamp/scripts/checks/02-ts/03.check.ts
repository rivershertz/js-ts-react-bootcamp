import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { findShortcuts, stepSource } from '../../lib/source';
import { typeErrorsForStep } from '../../lib/typecheck';

type Assignee = { id: string; name: string };
type Exercises = {
  DEFAULT_PRIORITY: string;
  assigneeName: (id: string | undefined, assignees: Assignee[]) => string;
  toTicketId: (id: string | number) => string;
  describeResult: (r: { id: string; title: string } | { error: string }) => string;
  errorMessage: (e: unknown) => string;
  priorityRank: (p: string) => number;
  parsePriority: (text: string) => string | undefined;
};

const step = defineSteps('02-ts/03');
const exercise = '02-ts/03-unions-narrowing/exercises';
const ex = () => load<Exercises>(exercise);

/** No type errors in step n, and no `as` / `any` shortcuts in its code. */
function expectCleanStep(n: number) {
  const errors = typeErrorsForStep([path.join(__dirname, '03.types.ts'), junior(exercise)], n);
  if (errors.length) throw new Error(errors.join('\n'));
  const shortcuts = findShortcuts(stepSource(junior(exercise), n)).filter((s) => s.kind === 'as' || s.kind === 'any');
  expect(shortcuts.map((s) => s.text), 'Narrow with a check instead of `as` or `any`').toEqual([]);
}

const assignees: Assignee[] = [{ id: 'a1', name: 'Dana Levi' }];

step(1, async () => {
  expectCleanStep(1);
  expect((await ex()).DEFAULT_PRIORITY).toBe('medium');
});

step(2, async () => {
  expectCleanStep(2);
  const { assigneeName } = await ex();
  expect(assigneeName('a1', assignees)).toBe('Dana Levi');
  expect(assigneeName(undefined, assignees)).toBe('Unassigned');
  expect(assigneeName('a9', assignees)).toBe('Unknown (a9)');
});

step(3, async () => {
  expectCleanStep(3);
  const { toTicketId } = await ex();
  expect(toTicketId(12)).toBe('t12');
  expect(toTicketId('t3')).toBe('t3');
});

step(4, async () => {
  expectCleanStep(4);
  const { describeResult } = await ex();
  expect(describeResult({ id: 't1', title: 'Login page' })).toBe('Login page');
  expect(describeResult({ error: 'Not found' })).toBe('Error: Not found');
});

step(5, async () => {
  expectCleanStep(5);
  const { errorMessage } = await ex();
  expect(errorMessage(new Error('Timed out'))).toBe('Timed out');
  expect(errorMessage(new TypeError('x is undefined')), 'subclasses of Error count too').toBe('x is undefined');
  expect(errorMessage('Server down')).toBe('Server down');
  expect(errorMessage(42)).toBe('Something went wrong');
  expect(errorMessage(null)).toBe('Something went wrong');
});

step(6, async () => {
  expectCleanStep(6);
  const { priorityRank } = await ex();
  expect(['low', 'medium', 'high', 'urgent'].map(priorityRank)).toEqual([1, 2, 3, 4]);
});

step(7, async () => {
  expectCleanStep(7);
  const { parsePriority } = await ex();
  expect(parsePriority('  High ')).toBe('high');
  expect(parsePriority('urgent')).toBe('urgent');
  expect(parsePriority('critical')).toBeUndefined();
});
