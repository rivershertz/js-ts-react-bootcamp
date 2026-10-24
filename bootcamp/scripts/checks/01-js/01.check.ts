import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { callPure } from '../../lib/pure';

type Ticket = { id: string; title?: string; status: string; priority?: string; closedAt?: string };
type Filters = { statuses: string[]; search: string };
type Exercises = {
  copyTicket: (t: Ticket) => Ticket;
  closeTicket: (t: Ticket, closedAt: string) => Ticket;
  ticketLabel: (t: Ticket) => string;
  toggleStatus: (f: Filters, s: string) => Filters;
  replaceTicket: (ts: Ticket[], u: Ticket) => Ticket[];
  removeTicket: (ts: Ticket[], id: string) => Ticket[];
  sameContent: (a: unknown, b: unknown) => boolean;
  deepFreeze: <T>(v: T) => T;
};

const step = defineSteps('01-js/01');
const ex = () => load<Exercises>('01-js/01-values-references/exercises');
const t1: Ticket = { id: 't1', title: 'Login page shows blank screen', status: 'open', priority: 'low' };
const t2: Ticket = { id: 't2', title: 'Export drops last row', status: 'assigned', priority: 'high' };
const t3: Ticket = { id: 't3', title: 'Dark mode unreadable', status: 'blocked', priority: 'medium' };

step(1, async () => {
  const { copyTicket } = await ex();
  const copy = callPure(copyTicket, t1);
  expect(copy).toEqual(t1);
  const original = { ...t1 };
  const fresh = copyTicket(original);
  expect(fresh, 'return a new object, not the same one').not.toBe(original);
  fresh.title = 'changed';
  expect(original.title, 'changing the copy changed the original').toBe(t1.title);
});

step(2, async () => {
  const { closeTicket } = await ex();
  const closed = callPure(closeTicket, t2, '2026-10-22T10:00:00Z');
  expect(closed).toEqual({ ...t2, status: 'closed', closedAt: '2026-10-22T10:00:00Z' });
});

step(3, async () => {
  const { ticketLabel } = await ex();
  expect(callPure(ticketLabel, t1)).toBe('t1 · Login page shows blank screen · low');
  expect(callPure(ticketLabel, { id: 't9', status: 'open' }), 'defaults for a missing title and priority').toBe('t9 · (no title) · medium');
});

step(4, async () => {
  const { toggleStatus } = await ex();
  const filters = { statuses: ['open', 'blocked'], search: 'login' };
  expect(callPure(toggleStatus, filters, 'closed')).toEqual({ statuses: ['open', 'blocked', 'closed'], search: 'login' });
  expect(callPure(toggleStatus, filters, 'open')).toEqual({ statuses: ['blocked'], search: 'login' });
});

step(5, async () => {
  const { replaceTicket } = await ex();
  const list = [t1, t2, t3];
  const updated = { ...t2, status: 'closed' };
  const result = callPure(replaceTicket, list, updated);
  expect(result).toEqual([t1, updated, t3]);
  const live = [{ ...t1 }, { ...t2 }, { ...t3 }];
  const out = replaceTicket(live, updated);
  expect(out, 'return a new array').not.toBe(live);
  expect(out[0], 'tickets that did not change should be the same objects, not copies').toBe(live[0]);
  expect(out[1]).toBe(updated);
});

step(6, async () => {
  const { removeTicket } = await ex();
  expect(callPure(removeTicket, [t1, t2, t3], 't2')).toEqual([t1, t3]);
  expect(callPure(removeTicket, [t1], 'nope'), 'an unknown id leaves the list as it was').toEqual([t1]);
});

step(7, async () => {
  const { sameContent } = await ex();
  expect(sameContent({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
  expect(sameContent([1, 2], [1, 2, 3])).toBe(false);
  expect(sameContent({ a: 1 }, { a: 1, b: undefined })).toBe(false);
  expect(sameContent({ a: 1 }, { a: '1' }), '1 and "1" are different').toBe(false);
  expect(sameContent([], {}), 'an array is not an object with no keys').toBe(false);
  expect(sameContent(null, {})).toBe(false);
});

step(8, async () => {
  const { deepFreeze } = await ex();
  const value = { a: { b: [1, { c: 2 }] } };
  expect(deepFreeze(value)).toBe(value);
  expect(Object.isFrozen(value.a.b[1]), 'objects inside arrays inside objects must be frozen too').toBe(true);
});
