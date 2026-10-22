// @vitest-environment jsdom
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { expect, vi } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';

type Exercises = {
  useToggle: (initial: boolean) => [boolean, () => void];
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

step(3, async () => {
  const { SearchBox } = await ex();
  const onSearch = vi.fn();
  render(<SearchBox onSearch={onSearch} />);
  await userEvent.type(screen.getByLabelText('Search'), 'login');
  expect(onSearch, 'onSearch must not run on every key press').not.toHaveBeenCalledWith('l');
  await act(() => new Promise((r) => setTimeout(r, 400)));
  expect(onSearch, 'after typing "login" and pausing, onSearch should get "login"').toHaveBeenLastCalledWith('login');
  expect(onSearch.mock.calls.filter(([t]) => t !== '').length, 'onSearch should run once after typing stops').toBe(1);
});

step(4, async () => {
  const { usePrevious } = await ex();
  const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 1 } });
  expect(result.current).toBeUndefined();
  rerender({ value: 2 });
  expect(result.current).toBe(1);
  rerender({ value: 5 });
  expect(result.current).toBe(2);
});
