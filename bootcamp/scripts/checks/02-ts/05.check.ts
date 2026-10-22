import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import { findShortcuts, stepSource } from '../../lib/source';
import { typeErrors, typeErrorsForStep } from '../../lib/typecheck';

type T = Record<string, unknown> & { id: string; status: string };
type Exercises = {
  statusLabel: (t: T) => string;
  assign: (t: T, assignee: string) => T;
  close: (t: T, closedAt: string) => T;
  assigneeOf: (t: T) => string | undefined;
};

const step = defineSteps('02-ts/05');
const exercise = '02-ts/05-discriminated-unions/exercises';
const ex = () => load<Exercises>(exercise);

function expectCleanStep(n: number) {
  const errors = typeErrorsForStep([path.join(__dirname, '05.types.ts'), junior(exercise)], n);
  if (errors.length) throw new Error(errors.join('\n'));
  const shortcuts = findShortcuts(stepSource(junior(exercise), n)).filter((s) => s.kind === 'as' || s.kind === 'any' || s.kind === 'non-null');
  expect(shortcuts.map((s) => s.text), 'Use the status to narrow instead of `as`, `any` or `!`').toEqual([]);
}

const base = { title: 'Login page', priority: 'low', createdAt: '2026-09-05T14:00:00Z', dueDate: null };
const open = { ...base, id: 't1', status: 'open' };
const assigned = { ...base, id: 't2', status: 'assigned', assignee: 'a1' };
const blocked = { ...base, id: 't3', status: 'blocked', assignee: 'a4', blockedReason: 'Waiting for design' };
const closed = { ...base, id: 't4', status: 'closed', closedAt: '2026-10-28T12:00:00Z' };

step(1, () => expectCleanStep(1));

step(2, async () => {
  expectCleanStep(2);
  const { statusLabel } = await ex();
  expect([open, assigned, blocked, closed].map((t) => statusLabel(t))).toEqual([
    'Open',
    'Assigned to a1',
    'Blocked: Waiting for design',
    'Closed on 2026-10-28',
  ]);
});

step(3, async () => {
  expectCleanStep(3);
  // Add a fifth status to a copy of the file: statusLabel must stop compiling.
  const file = junior(exercise);
  const source = readFileSync(file, 'utf8');
  const marker = /export type Ticket\s*=/;
  expect(source, 'keep the line `export type Ticket =`').toMatch(marker);
  const changed = source.replace(marker, "export type Ticket = (TicketBase & { status: 'archived' }) |");
  const before = typeErrors([file]).length;
  const after = typeErrors([file], { replace: { [file]: changed } }).length;
  expect(
    after,
    "With an extra 'archived' status, statusLabel still compiles. In `default:`, pass ticket to assertNever (or assign it to a `never` variable).",
  ).toBeGreaterThan(before);
});

step(4, async () => {
  expectCleanStep(4);
  const { assign } = await ex();
  expect(callPure(assign, open, 'a5')).toEqual({ ...open, status: 'assigned', assignee: 'a5' });
});

step(5, async () => {
  expectCleanStep(5);
  const { close } = await ex();
  const at = '2026-10-30T09:00:00Z';
  expect(callPure(close, open, at)).toEqual({ ...open, status: 'closed', closedAt: at });
  expect(callPure(close, assigned, at)).toEqual({ ...assigned, status: 'closed', closedAt: at });
  const fromBlocked = callPure(close, blocked, at);
  expect(fromBlocked, 'a closed ticket keeps the assignee but not blockedReason').toEqual({ ...base, id: 't3', status: 'closed', assignee: 'a4', closedAt: at });
  expect('blockedReason' in fromBlocked, 'blockedReason must not be in a closed ticket at all').toBe(false);
});

step(6, async () => {
  expectCleanStep(6);
  const { assigneeOf } = await ex();
  expect([open, assigned, blocked, closed, { ...closed, assignee: 'a3' }].map((t) => assigneeOf(t))).toEqual([undefined, 'a1', 'a4', undefined, 'a3']);
});
