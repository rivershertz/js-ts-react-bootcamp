// 03-react/04 Custom hooks: worked solutions
import { useCallback, useEffect, useRef, useState } from 'react';

export function useToggle(initial: boolean): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function SearchBox({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, 300);
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    onSearch(debounced);
  }, [debounced, onSearch]);
  return (
    <label>
      Search <input value={text} onChange={(e) => setText(e.target.value)} />
    </label>
  );
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
