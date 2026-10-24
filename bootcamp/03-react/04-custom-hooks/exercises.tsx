// 03-react/04 Custom hooks
// Check your work with:  yarn verify 03-react/04
// See it in the browser:  yarn dev 03-react/04
import { useState } from 'react';

// Step 1 (core)
// useToggle(initial) returns [value, toggle]. Calling toggle() flips the value.
export function useToggle(initial: boolean): [boolean, () => void] {
  throw new Error('TODO: step 1');
}

// Step 2 (core)
// useDebouncedValue(value, delayMs) returns `value`, but only after it has stopped
// changing for `delayMs` milliseconds. Until then it keeps returning the previous value.
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  throw new Error('TODO: step 2');
}

// Step 3 (core)
// SearchBox shows an input labelled "Search". It calls onSearch(text) once the user
// has stopped typing for 300 ms, not on every key press. Use your useDebouncedValue.
// If onSearch is in your effect's dependencies, the parent must pass the same function every
// render (useCallback, module 07), or the effect runs after every parent render. The playground does.
export function SearchBox({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <label>
      Search <input value={text} onChange={(e) => setText(e.target.value)} />
    </label>
  );
}

// Step 4 (stretch)
// usePrevious(value) returns the value from the previous render (undefined on the first one).
export function usePrevious<T>(value: T): T | undefined {
  throw new Error('TODO: step 4');
}
