# 01-js/03 Scope and closures

**Time:** 20 min lesson, 25 min exercises (core), plus 10 min stretch.

## 1. Watch the lesson

Run `yarn lessons`, open the link it prints, and pick **01-js/03 Scope and closures**. Step through it with →. Take your time on the two walkthroughs ("Calling a function" and "The backpack").

## 2. Quick recap

- Every function call gets its own execution context on the call stack. When it returns, its local variables are gone.
- `let` and `const` exist only inside their `{ }` block. `var` does not respect blocks; avoid it.
- A function created inside another function keeps a link to the variables around it: its **backpack** (the real name is *closure*). The backpack outlives the outer call.
- Each call of the outer function makes a new, separate backpack.

## 3. Exercises

Open [`exercises.js`](exercises.js). Each step is a function that currently throws `TODO`. Do them in order.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `makeCounter()`: each counter keeps its own count |
| 2 | core | `once(fn)`: run `fn` only the first time |
| 3 | core | `memoize(fn)`: remember results by argument |
| 4 | core | `createIdGenerator(prefix)`: ticket ids like `T-1`, `T-2` |
| 5 | stretch | `debounce(fn, ms)`: wait until calls stop |

Check all steps:

```
yarn verify 01-js/03
```

Check one step:

```
yarn verify 01-js/03/2
```

A failing step shows a hint. If you are stuck for more than 15 minutes on a core step, ask a mentor.

Coming from Python? Step 3 is like `functools.lru_cache`, built by hand.
