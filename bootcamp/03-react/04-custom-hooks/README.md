# 03-react/04 Custom hooks

**Time:** 10 min lesson, 20 min exercises (core), plus 5 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/04 Custom hooks**.

## 2. Quick recap

- A custom hook is a function whose name starts with `use` and that calls other hooks. It shares logic, not state: each component that calls it gets its own state.
- The Rules of Hooks apply inside it too: call hooks at the top level, never in a condition or loop.
- Type the return value: a tuple like `[boolean, () => void]` for a `useState`-style hook, a generic `<T>` when the hook works for any value.
- An effect that starts a timer must return a cleanup that clears it.
- `useDebouncedValue(value, 300)` returns the value only once it has stopped changing for 300 ms. The final project's search needs it.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx).

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `useToggle(initial)` |
| 2 | core | `useDebouncedValue(value, delayMs)` |
| 3 | core | `SearchBox` that reports the search only after typing stops |
| 4 | stretch | `usePrevious(value)` |

See your hooks working in the browser (it reloads as you edit):

```
yarn dev 03-react/04
```

Check them:

```
yarn verify 03-react/04
```

You will reuse `useDebouncedValue` in the final project.
