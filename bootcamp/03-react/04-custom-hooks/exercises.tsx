// 03-react/04 Custom hooks
//
// What you build: three reusable hooks and a search box that uses one of them.
// Finished when:  `yarn verify 03-react/04` shows ✓ for steps 1 to 3. Stretch steps are optional.
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

// Step 2 (core): useDebouncedValue
// useDebouncedValue(value, delayMs) returns `value`, but only after it has stopped
// changing for `delayMs` milliseconds. Until then it keeps returning the previous value.
//
// Example (delayMs 300):
//   value 'a'                          → returns 'a'
//   value 'ab', then 'abc' 100 ms apart → still returns 'a'
//   300 ms after 'abc'                 → returns 'abc'
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  throw new Error('TODO: step 2');
}

// Step 3 (core): SearchBox
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

// Step 4 (stretch): usePrevious
// usePrevious(value) returns the value from the previous render (undefined on the first one).
//
// Example: renders with value 1, then 2, then 3 → usePrevious returns undefined, then 1, then 2.
export function usePrevious<T>(value: T): T | undefined {
  throw new Error('TODO: step 4');
}
