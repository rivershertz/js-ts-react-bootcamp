// 03-react/04 Custom hooks
//
// What you build: three reusable hooks and a search box that uses one of them.
// Finished when:  `yarn verify 03-react/04` shows ✓ for steps 1 to 3. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Check your work with:  yarn verify 03-react/04
// See it in the browser:  yarn dev 03-react/04
import { useState } from 'react';

// Step 1 (core): useToggle
// What:   useToggle(initial) returns [value, toggle]. Calling toggle() flips the value.
// Result: const [open, toggle] = useToggle(false); after toggle(), open is true.
// Needs:  slide "A custom hook is a function that calls hooks".
export function useToggle(initial: boolean): [boolean, () => void] {
  throw new Error('TODO: step 1');
}

// Step 2 (core): useDebouncedValue
// What:   useDebouncedValue(value, delayMs) returns `value`, but only after it has stopped
//         changing for `delayMs` milliseconds. Until then it keeps returning the previous value.
// Result: value goes 'a', 'ab', 'abc' less than 300 ms apart → the hook keeps returning 'a', then 'abc'
//         300 ms after the last change.
// Needs:  slide "Debouncing, step by step".
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  throw new Error('TODO: step 2');
}

// Step 3 (core): SearchBox
// What:   SearchBox shows an input labelled "Search". It calls onSearch(text) once the user
//         has stopped typing for 300 ms, not on every key press. Use your useDebouncedValue.
//         If onSearch is in your effect's dependencies, the parent must pass the same function every
//         render (useCallback, module 07), or the effect runs after every parent render. The playground does.
// Result: typing "login" quickly calls onSearch('login') once, 300 ms after the last key.
// Needs:  your step 2, and an effect (03-react/03).
export function SearchBox({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <label>
      Search <input value={text} onChange={(e) => setText(e.target.value)} />
    </label>
  );
}

// Step 4 (stretch): usePrevious
// What:   usePrevious(value) returns the value from the previous render (undefined on the first one).
// Result: renders with 1, then 2, then 3 → usePrevious returns undefined, 1, 2.
// Needs:  slide "Stretch: refs remember without rendering".
export function usePrevious<T>(value: T): T | undefined {
  throw new Error('TODO: step 4');
}
