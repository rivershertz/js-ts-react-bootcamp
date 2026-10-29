// @vitest-environment jsdom
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, type ComponentType } from 'react';
import { expect, vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';

type Exercises = {
  useToggle: (initial: boolean) => [boolean, () => void];
  useCounter: (initial?: number) => { count: number; increment: () => void; decrement: () => void; reset: () => void };
  useElapsedSeconds: () => number;
  useDebouncedValue: <T>(value: T, delayMs?: number) => T;
  SearchBox: ComponentType<{ onSearch: (text: string) => void }>;
  usePrevious: <T>(value: T) => T | undefined;
};

const step = defineSteps('03-react/04');
const ex = () => load<Exercises>('03-react/04-custom-hooks/exercises');

step(1, async () => {
  const { useToggle } = await ex();
  const { result } = renderHook(() => useToggle(false));
  expect(result.current[0]).toBe(false);
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
  act(() => result.current[1]());
  expect(result.current[0]).toBe(false);
});

step(2, async () => {
  const { useCounter } = await ex();
  const { result } = renderHook(() => useCounter(5));
  expect(result.current.count).toBe(5);
  act(() => result.current.increment());
  act(() => result.current.increment());
  expect(result.current.count).toBe(7);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(6);
  act(() => result.current.reset());
  expect(result.current.count, 'reset goes back to the initial count').toBe(5);
  const other = renderHook(() => useCounter());
  expect(other.result.current.count, 'useCounter() with no argument starts at 0').toBe(0);
  act(() => other.result.current.increment());
  expect(result.current.count, 'each component that calls the hook has its own count').toBe(5);
});

step(3, async () => {
  const { useElapsedSeconds } = await ex();
  vi.useFakeTimers();
  const cleared = vi.spyOn(globalThis, 'clearInterval');
  try {
    const { result, unmount } = renderHook(() => useElapsedSeconds(), { wrapper: StrictMode });
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(3000));
    ensure(result.current === 3, `After 3 seconds it should return 3, not ${result.current} (checked in StrictMode, as in development)`);
    unmount();
    expect(cleared, 'stop the interval when the component goes away: return a cleanup from the effect').toHaveBeenCalled();
  } finally {
    cleared.mockRestore();
    vi.useRealTimers();
  }
});

step(4, async () => {
  const { useDebouncedValue } = await ex();
  vi.useFakeTimers();
  try {
    const { result, rerender, unmount } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    });
    expect(result.current).toBe('a');
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current, 'the value must wait until it stops changing for 300 ms').toBe('a');
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('abc');
    const spy = vi.spyOn(globalThis, 'clearTimeout');
    rerender({ value: 'abcd' });
    unmount();
    expect(spy, 'clear the pending timer when the component unmounts (effect cleanup)').toHaveBeenCalled();
  } finally {
    vi.useRealTimers();
  }
});

step(5, async () => {
  const { SearchBox } = await ex();
  const onSearch = vi.fn();
  render(<SearchBox onSearch={onSearch} />);
  await userEvent.type(screen.getByLabelText('Search'), 'login');
  expect(onSearch, 'onSearch must not run on every key press').not.toHaveBeenCalledWith('l');
  await act(() => new Promise((r) => setTimeout(r, 400)));
  expect(onSearch, 'after typing "login" and pausing, onSearch should get "login"').toHaveBeenLastCalledWith('login');
  expect(onSearch.mock.calls.filter(([t]) => t !== '').length, 'onSearch should run once after typing stops').toBe(1);
});

step(6, async () => {
  const { usePrevious } = await ex();
  const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 1 } });
  expect(result.current).toBeUndefined();
  rerender({ value: 2 });
  expect(result.current).toBe(1);
  rerender({ value: 5 });
  expect(result.current).toBe(2);
});
