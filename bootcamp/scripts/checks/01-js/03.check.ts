import { expect, vi } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';

type Fn = (...args: unknown[]) => unknown;
type Ticket = { id: string; status: string };
type Store<T> = { getState: () => T; setState: (next: T) => void; subscribe: (listener: (value: T) => void) => () => void };
type Exercises = {
  makeGreeter: (greeting: string) => (name: string) => string;
  byStatus: (status: string) => (ticket: Ticket) => boolean;
  makeTicker: () => () => number;
  makeCounter: () => { increment: () => number; current: () => number };
  createIdGenerator: (prefix: string) => () => string;
  makeTicketQueue: () => { add: (title: string) => number; next: () => string | undefined; size: () => number };
  predictClosures: () => string[];
  makeHandlers: (labels: string[]) => (() => string)[];
  countCalls: (fn: Fn) => { call: Fn; count: () => number };
  once: (fn: Fn) => Fn;
  memoize: (fn: Fn) => Fn;
  debounce: (fn: Fn, ms: number) => Fn;
  createStore: <T>(initial: T) => Store<T>;
};

const step = defineSteps('01-js/03');
const ex = () => load<Exercises>('01-js/03-scope-closures/exercises');

step(1, async () => {
  const { makeGreeter } = await ex();
  const hello = makeGreeter('Hello');
  expect(typeof hello, 'makeGreeter should return a function, not a string').toBe('function');
  expect(hello('Dana')).toBe('Hello, Dana!');
  expect(hello('Avi'), 'the returned function can be called again with another name').toBe('Hello, Avi!');
  expect(makeGreeter('Hi')('Noa'), 'each greeter remembers its own greeting').toBe('Hi, Noa!');
});

step(2, async () => {
  const { byStatus } = await ex();
  const tickets = [
    { id: 't1', status: 'open' },
    { id: 't2', status: 'closed' },
    { id: 't3', status: 'open' },
  ];
  const isOpen = byStatus('open');
  expect(typeof isOpen, 'byStatus should return a function that takes a ticket').toBe('function');
  expect(isOpen(tickets[0])).toBe(true);
  expect(isOpen(tickets[1])).toBe(false);
  expect(tickets.filter(byStatus('open')).map((t) => t.id)).toEqual(['t1', 't3']);
  expect(tickets.filter(byStatus('closed')).map((t) => t.id)).toEqual(['t2']);
  expect(tickets.some(byStatus('blocked'))).toBe(false);
});

step(3, async () => {
  const { makeTicker } = await ex();
  const tick = makeTicker();
  expect(typeof tick, 'makeTicker should return a function').toBe('function');
  expect([tick(), tick(), tick()], 'the count must survive between calls: keep it outside the returned function').toEqual([1, 2, 3]);
  const other = makeTicker();
  expect(other(), 'a new ticker starts at 1: each call of makeTicker gets its own count').toBe(1);
  expect(tick(), 'and the first ticker carries on where it was').toBe(4);
});

step(4, async () => {
  const { makeCounter } = await ex();
  const a = makeCounter();
  const b = makeCounter();
  expect(a.current()).toBe(0);
  expect(a.increment()).toBe(1);
  expect(a.increment()).toBe(2);
  expect(a.current()).toBe(2);
  expect(b.current(), 'a second counter must start at 0, not share the first one').toBe(0);
});

step(5, async () => {
  const { makeTicketQueue } = await ex();
  const queue = makeTicketQueue();
  expect(queue.size()).toBe(0);
  expect(queue.add('Login bug'), 'add returns how many titles are waiting').toBe(1);
  expect(queue.add('Slow search')).toBe(2);
  expect(queue.next(), 'next takes the oldest title first').toBe('Login bug');
  expect(queue.size()).toBe(1);
  expect(queue.next()).toBe('Slow search');
  expect(queue.next(), 'an empty queue returns undefined').toBeUndefined();
  expect(Object.keys(queue).sort(), 'the object has only add, next and size: the list stays in the backpack').toEqual(['add', 'next', 'size']);
  const other = makeTicketQueue();
  other.add('Other');
  expect(queue.size(), 'two queues must not share their list').toBe(0);
});

step(6, async () => {
  const { predictClosures } = await ex();
  const [a, b, c, d] = predictClosures();
  expect(a, 'A: readStatus reads the variable status when it is called, not when it was created').toBe('closed');
  expect(b, 'B: saved got a copy of the string before status changed').toBe('open');
  expect(c, 'C: the backpack holds the same ticket object, and that object was changed').toBe('Login page is blank');
  expect(d, 'D: the backpack holds the variable title, which was reassigned before label was called').toBe('BUG');
});

step(7, async () => {
  const { makeHandlers } = await ex();
  const handlers = makeHandlers(['Login bug', 'Slow search', 'Typo']);
  expect(handlers).toHaveLength(3);
  const texts = handlers.map((h) => h());
  expect(texts[0], 'every function shares one i that ended at 3. Which keyword gives each turn of the loop its own i?').toBe('1. Login bug');
  expect(texts).toEqual(['1. Login bug', '2. Slow search', '3. Typo']);
});

step(8, async () => {
  const { countCalls } = await ex();
  const add = countCalls((a, b) => (a as number) + (b as number));
  expect(add.count()).toBe(0);
  expect(add.call(2, 3), 'call passes every argument on to fn and returns its result').toBe(5);
  expect(add.call(1, 1)).toBe(2);
  expect(add.count()).toBe(2);
  const other = countCalls(() => 'x');
  other.call();
  expect(other.count(), 'each wrapper keeps its own count').toBe(1);
  expect(add.count()).toBe(2);
});

step(9, async () => {
  const { once } = await ex();
  const fn = vi.fn((x: number) => x * 2);
  const double = once(fn);
  expect(double(5)).toBe(10);
  expect(double(7), 'later calls return the first result').toBe(10);
  expect(fn).toHaveBeenCalledTimes(1);
});

step(10, async () => {
  const { memoize } = await ex();
  const fn = vi.fn((x: number) => x * x);
  const square = memoize(fn);
  expect(square(4)).toBe(16);
  expect(square(4)).toBe(16);
  expect(square(5)).toBe(25);
  expect(fn, 'fn runs once per different argument').toHaveBeenCalledTimes(2);
  const nothing = vi.fn(() => undefined);
  const m = memoize(nothing);
  m('x');
  m('x');
  expect(nothing, 'a remembered undefined result still counts as remembered').toHaveBeenCalledTimes(1);
});

step(11, async () => {
  const { createIdGenerator } = await ex();
  const ticketId = createIdGenerator('T');
  const bugId = createIdGenerator('BUG');
  expect([ticketId(), ticketId(), bugId(), ticketId()]).toEqual(['T-1', 'T-2', 'BUG-1', 'T-3']);
});

step(12, async () => {
  vi.useFakeTimers();
  try {
    const { debounce } = await ex();
    const fn = vi.fn();
    const save = debounce(fn, 300);
    save('a');
    vi.advanceTimersByTime(200);
    save('b');
    vi.advanceTimersByTime(200);
    expect(fn, 'nothing runs while calls keep coming').not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  } finally {
    vi.useRealTimers();
  }
});

step(13, async () => {
  const { createStore } = await ex();
  const store = createStore(0);
  expect(store.getState()).toBe(0);
  const first = vi.fn();
  const second = vi.fn();
  const stopFirst = store.subscribe(first);
  store.subscribe(second);
  store.setState(1);
  expect(store.getState()).toBe(1);
  expect(first, 'setState calls every listener with the new value').toHaveBeenCalledWith(1);
  expect(second).toHaveBeenCalledWith(1);
  stopFirst();
  store.setState(2);
  expect(first, 'the function subscribe returned should remove that listener').toHaveBeenCalledTimes(1);
  expect(second, 'other listeners keep listening').toHaveBeenCalledTimes(2);
  expect(createStore('a').getState(), 'each store keeps its own value').toBe('a');
});
