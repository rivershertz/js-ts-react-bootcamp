// 03-react/04 Custom hooks
//
// What you build: four reusable hooks and a search box that uses one of them.
// The steps climb slowly: state only (steps 1 and 2), then an effect with a cleanup (step 3),
// then an effect that restarts when a value changes (step 4).
// Finished when:  `yarn verify 03-react/04` shows ✓ for steps 1 to 5. Stretch steps are optional.
//
// Check your work with:  yarn verify 03-react/04
// See it in the browser:  yarn dev 03-react/04
import { useState } from 'react';

// Step 1 (core): useToggle
// useToggle(initial) returns [value, toggle]. Calling toggle() flips the value.
//
// Example:
//   const [open, toggle] = useToggle(false);   // open is false
//   toggle();                                  // next render: open is true
export function useToggle(initial: boolean): [boolean, () => void] {
  throw new Error('TODO: step 1');
}

// Step 2 (core): useCounter
// useCounter(initial) returns an object with the count and three functions:
//   increment()  adds 1
//   decrement()  takes 1 away
//   reset()      goes back to `initial`
// Two components that call useCounter each get their own count.
//
// Example:
//   const { count, increment, reset } = useCounter(5);   // count is 5
//   increment();                                          // next render: count is 6
//   reset();                                              // next render: count is 5
export function useCounter(initial = 0): { count: number; increment: () => void; decrement: () => void; reset: () => void } {
  throw new Error('TODO: step 2');
}

// Step 3 (core): useElapsedSeconds
// useElapsedSeconds() returns how many whole seconds have passed since the component that
// calls it appeared: 0, then 1 a second later, then 2, and so on. When that component goes away,
// no timer may be left running. This is 03-react/03's OpenTimer, moved into a hook.
//
// Example:
//   const seconds = useElapsedSeconds();   // 0 at first, 3 after three seconds
export function useElapsedSeconds(): number {
  throw new Error('TODO: step 3');
}

// Step 4 (core): useDebouncedValue
// useDebouncedValue(value, delayMs) returns `value`, but only after it has stopped
// changing for `delayMs` milliseconds. Until then it keeps returning the previous value.
//
// Example (delayMs 300):
//   value 'a'                          → returns 'a'
//   value 'ab', then 'abc' 100 ms apart → still returns 'a'
//   300 ms after 'abc'                 → returns 'abc'
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  throw new Error('TODO: step 4');
}

// Step 5 (core): SearchBox
// SearchBox shows an input labelled "Search". It calls onSearch(text) once the user
// has stopped typing for 300 ms, not on every key press. Use your useDebouncedValue.
// If onSearch is in your effect's dependencies, the parent must pass the same function every
// render (useCallback, module 07), or the effect runs after every parent render. The playground does.
//
// Example: type "login" quickly → onSearch('login') is called once, 300 ms after the last key.
export function SearchBox({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <label>
      Search <input value={text} onChange={(e) => setText(e.target.value)} />
    </label>
  );
}

// Step 6 (stretch): usePrevious
// usePrevious(value) returns the value from the previous render (undefined on the first one).
//
// Example: renders with value 1, then 2, then 3 → usePrevious returns undefined, then 1, then 2.
export function usePrevious<T>(value: T): T | undefined {
  throw new Error('TODO: step 6');
}
