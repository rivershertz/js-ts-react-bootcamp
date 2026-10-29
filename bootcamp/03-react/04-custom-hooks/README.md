# 03-react/04 Custom hooks

**Time:** 10 min lesson, 30 min exercises (core), plus 5 min stretch.

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

The steps climb slowly, one new idea each:

| Step | Level | Task | New idea |
| --- | --- | --- | --- |
| 1 | core | `useToggle(initial)` | A hook that returns a tuple, like `useState` |
| 2 | core | `useCounter(initial)` | A hook that returns an object; each caller has its own state |
| 3 | core | `useElapsedSeconds()` | An effect with a cleanup, inside a hook |
| 4 | core | `useDebouncedValue(value, delayMs)` | An effect that restarts its timer when the value changes |
| 5 | core | `SearchBox` that reports the search only after typing stops | Using your own hook in a component |
| 6 | stretch | `usePrevious(value)` | |

See your hooks working in the browser (it reloads as you edit):

```
yarn dev 03-react/04
```

Check them:

```
yarn verify 03-react/04
```

You will reuse `useDebouncedValue` in the final project.
