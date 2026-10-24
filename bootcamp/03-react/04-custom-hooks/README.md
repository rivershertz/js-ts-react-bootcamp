# 03-react/04 Custom hooks

**Time:** 30 min lesson, 40 min exercises (core).

> POC note: this module has exercises but no lesson deck yet. It shows how React exercises are checked and previewed.

## Recap

- A custom hook is a function whose name starts with `use` and that calls other hooks. It shares logic, not state: each component that calls it gets its own state.
- The Rules of Hooks apply inside it too: call hooks at the top level, never in a condition or loop.
- An effect that starts a timer must return a cleanup that clears it.

## Exercises

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
