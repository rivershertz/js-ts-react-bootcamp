import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { typeErrorsForStep } from '../../lib/typecheck';

type Exercises = {
  daysOpen: (createdAt: string, now: Date) => number;
  shout: (t: { id: string; title: string }) => string;
  titleOf: (tickets: { id: string; title: string }[], id: string) => string;
  dueLabel: (t: { dueDate: string | null }) => string;
  PRINTED: string;
};

const step = defineSteps('02-ts/01');
const exercise = '02-ts/01-why-ts/exercises';
const ex = () => load<Exercises>(exercise);

function expectNoTypeErrors(n: number) {
  const errors = typeErrorsForStep([path.join(__dirname, '01.types.ts'), junior(exercise)], n);
  if (errors.length) throw new Error(errors.join('\n'));
}

step(1, async () => {
  expectNoTypeErrors(1);
  const { daysOpen } = await ex();
  expect(daysOpen('2026-10-01T09:00:00Z', new Date('2026-10-11T08:00:00Z'))).toBe(9);
});

step(2, async () => {
  expectNoTypeErrors(2);
  const { shout } = await ex();
  expect(shout({ id: 't1', title: 'Login page' })).toBe('LOGIN PAGE');
});

step(3, async () => {
  expectNoTypeErrors(3);
  const { titleOf } = await ex();
  const tickets = [{ id: 't1', title: 'Login page' }];
  expect(titleOf(tickets, 't1')).toBe('Login page');
  expect(titleOf(tickets, 't9'), 'a missing id should give (not found), not a crash').toBe('(not found)');
});

step(4, async () => {
  expectNoTypeErrors(4);
  const { dueLabel } = await ex();
  expect(dueLabel({ dueDate: '2026-10-01' })).toBe('due 2026-10-01');
  expect(dueLabel({ dueDate: null })).toBe('no due date');
});

step(5, async () => {
  const { PRINTED } = await ex();
  expect(String(PRINTED).trim(), 'Run node 02-ts/01-why-ts/run-me.ts and copy what follows "Total hours:"').toBe('75');
});
