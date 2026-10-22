import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import fixtures from '../../fixtures/tickets.json';

type Ticket = (typeof fixtures)[number] & { assignee?: string };
type Fn = (...args: never[]) => unknown;
type Exercises = Record<
  'titles' | 'notClosed' | 'findById' | 'checkTickets' | 'countByPriority' | 'newestFirst' | 'indexById' | 'hotList' | 'groupBy' | 'pipe',
  Fn
>;

const step = defineSteps('01-js/02');
const ex = () => load<Exercises>('01-js/02-array-object-methods/exercises');
const tickets = fixtures as Ticket[];
const call = <F extends Fn>(fn: F, ...args: Parameters<F>) => callPure(fn as (...a: unknown[]) => ReturnType<F>, ...(args as unknown[]));

step(1, async () => {
  const { titles } = await ex();
  expect(call(titles, tickets)).toEqual(tickets.map((t) => t.title));
  expect(call(titles, [])).toEqual([]);
});

step(2, async () => {
  const { notClosed } = await ex();
  const result = call(notClosed, tickets) as Ticket[];
  expect(result.map((t) => t.id)).toEqual(['t1', 't2', 't3', 't5', 't6', 't7', 't10']);
});

step(3, async () => {
  const { findById } = await ex();
  expect((call(findById, tickets, 't7') as Ticket).title).toBe(tickets[6].title);
  expect(call(findById, tickets, 'nope'), 'an unknown id gives undefined').toBeUndefined();
});

step(4, async () => {
  const { checkTickets } = await ex();
  expect(call(checkTickets, tickets)).toEqual({ anyUrgent: true, allAssigned: false });
  const assigned = tickets.filter((t) => t.assignee && t.priority !== 'urgent');
  expect(call(checkTickets, assigned)).toEqual({ anyUrgent: false, allAssigned: true });
  expect(call(checkTickets, []), 'with no tickets, "every" is true and "some" is false').toEqual({ anyUrgent: false, allAssigned: true });
});

step(5, async () => {
  const { countByPriority } = await ex();
  expect(call(countByPriority, tickets)).toEqual({ low: 3, medium: 2, high: 4, urgent: 3 });
  expect(call(countByPriority, []), 'every priority is in the result, even with 0').toEqual({ low: 0, medium: 0, high: 0, urgent: 0 });
});

step(6, async () => {
  const { newestFirst } = await ex();
  const result = call(newestFirst, tickets) as Ticket[];
  expect(result.map((t) => t.id)).toEqual(['t3', 't8', 't12', 't9', 't10', 't6', 't1', 't7', 't5', 't2', 't11', 't4']);
});

step(7, async () => {
  const { indexById } = await ex();
  const index = call(indexById, tickets) as Record<string, Ticket>;
  expect(Object.keys(index)).toHaveLength(12);
  expect(index.t4).toEqual(tickets[3]);
});

step(8, async () => {
  const { hotList } = await ex();
  expect(call(hotList, tickets, 2)).toEqual(['Search ignores Hebrew characters', 'Avatar upload fails over 2MB']);
  expect(call(hotList, tickets, 10), 'asking for more than there are returns all of them').toEqual([
    'Search ignores Hebrew characters',
    'Avatar upload fails over 2MB',
    'Table pagination resets on edit',
  ]);
});

step(9, async () => {
  const { groupBy } = await ex();
  const groups = call(groupBy, tickets, ((t: Ticket) => t.status) as never) as Record<string, Ticket[]>;
  expect(Object.keys(groups).sort()).toEqual(['assigned', 'blocked', 'closed', 'open']);
  expect(groups.closed.map((t) => t.id)).toEqual(['t4', 't8', 't9', 't11', 't12']);
  expect(call(groupBy, [], ((x: unknown) => x) as never)).toEqual({});
});

step(10, async () => {
  const { pipe } = await ex();
  const run = (pipe as (...fns: ((x: number) => number)[]) => (x: number) => number)(
    (x) => x + 1,
    (x) => x * 10,
    (x) => x - 3,
  );
  expect(run(2)).toBe(27);
  expect((pipe as () => (x: number) => number)()(5), 'with no functions, pipe returns the input').toBe(5);
});
