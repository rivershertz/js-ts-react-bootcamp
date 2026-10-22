import { expect, vi } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';

type Fn = (...args: unknown[]) => unknown;
type Exercises = {
  makeCounter: () => { increment: () => number; current: () => number };
  once: (fn: Fn) => Fn;
  memoize: (fn: Fn) => Fn;
  createIdGenerator: (prefix: string) => () => string;
  debounce: (fn: Fn, ms: number) => Fn;
};

const step = defineSteps('01-js/03');
const ex = () => load<Exercises>('01-js/03-scope-closures/exercises');

step(1, async () => {
  const { makeCounter } = await ex();
  const a = makeCounter();
  const b = makeCounter();
  expect(a.current()).toBe(0);
  expect(a.increment()).toBe(1);
  expect(a.increment()).toBe(2);
  expect(a.current()).toBe(2);
  expect(b.current(), 'a second counter must start at 0, not share the first one').toBe(0);
});

step(2, async () => {
  const { once } = await ex();
  const fn = vi.fn((x: number) => x * 2);
  const double = once(fn);
  expect(double(5)).toBe(10);
  expect(double(7), 'later calls return the first result').toBe(10);
  expect(fn).toHaveBeenCalledTimes(1);
});

step(3, async () => {
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

step(4, async () => {
  const { createIdGenerator } = await ex();
  const ticketId = createIdGenerator('T');
  const bugId = createIdGenerator('BUG');
  expect([ticketId(), ticketId(), bugId(), ticketId()]).toEqual(['T-1', 'T-2', 'BUG-1', 'T-3']);
});

step(5, async () => {
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
