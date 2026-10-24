import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import { typeErrorsForStep } from '../../lib/typecheck';

type Ticket = { id: string; title: string; priority: string; status: string; createdAt: string; dueDate: string | null };
type Exercises = {
  createTicket: (id: string, title: string, priority?: string) => Ticket;
  closeTicket: (t: Ticket, closedAt: string) => Ticket & { closedAt: string };
  addTicket: (tickets: readonly Ticket[], t: Ticket) => readonly Ticket[];
  isOpen: (t: Ticket) => boolean;
  indexById: (tickets: readonly Ticket[]) => Record<string, Ticket>;
};

const step = defineSteps('02-ts/02');
const exercise = '02-ts/02-basics/exercises';
const ex = () => load<Exercises>(exercise);

function expectNoTypeErrors(n: number) {
  const errors = typeErrorsForStep([path.join(__dirname, '02.types.ts'), junior(exercise)], n);
  if (errors.length) throw new Error(errors.join('\n'));
}

const ticket: Ticket = { id: 't1', title: 'Login page', priority: 'low', status: 'open', createdAt: '2026-09-05T14:00:00Z', dueDate: null };

step(1, () => expectNoTypeErrors(1));

step(2, () => expectNoTypeErrors(2));

step(3, async () => {
  expectNoTypeErrors(3);
  const { createTicket } = await ex();
  const created = createTicket('t9', 'Export fails');
  expect(created).toMatchObject({ id: 't9', title: 'Export fails', priority: 'medium', status: 'open', dueDate: null });
  expect(Number.isNaN(Date.parse(created.createdAt)), 'createdAt should be an ISO date string').toBe(false);
  expect(createTicket('t10', 'Crash', 'urgent').priority).toBe('urgent');
});

step(4, async () => {
  expectNoTypeErrors(4);
  const { closeTicket } = await ex();
  expect(callPure(closeTicket, ticket, '2026-10-20T10:00:00Z')).toEqual({ ...ticket, status: 'closed', closedAt: '2026-10-20T10:00:00Z' });
});

step(5, async () => {
  expectNoTypeErrors(5);
  const { addTicket } = await ex();
  const other = { ...ticket, id: 't2' };
  expect(callPure(addTicket, [ticket], other).map((t) => t.id)).toEqual(['t1', 't2']);
});

step(6, async () => {
  expectNoTypeErrors(6);
  const { isOpen } = await ex();
  expect(isOpen(ticket)).toBe(true);
  expect(isOpen({ ...ticket, status: 'blocked' })).toBe(true);
  expect(isOpen({ ...ticket, status: 'closed' })).toBe(false);
});

step(7, async () => {
  expectNoTypeErrors(7);
  const { indexById } = await ex();
  const other = { ...ticket, id: 't2' };
  expect(callPure(indexById, [ticket, other])).toEqual({ t1: ticket, t2: other });
});
