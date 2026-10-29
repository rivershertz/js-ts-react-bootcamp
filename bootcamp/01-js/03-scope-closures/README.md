# 01-js/03 Scope and closures

**Time:** 20 min lesson, 50 min exercises (core), plus 20 min stretch.

## 1. Watch the lesson

Run `yarn lessons`, open the link it prints, and pick **01-js/03 Scope and closures**. Step through it with →. Take your time on the two walkthroughs ("Calling a function" and "The backpack").

## 2. Quick recap

- Every function call gets its own execution context on the call stack. When it returns, its local variables are gone.
- `let` and `const` exist only inside their `{ }` block. `var` does not respect blocks; avoid it.
- A function created inside another function keeps a link to the variables around it: its **backpack** (the real name is *closure*). The backpack outlives the outer call.
- Each call of the outer function makes a new, separate backpack.

## 3. Exercises

Open [`exercises.js`](exercises.js). Each step is a function that currently throws `TODO`. Do them in order.

Closures are one of the most important ideas in JavaScript, and React is built on them, so this module climbs in small steps. Most steps add one new idea to the one before:

| Step | Level | Task | New idea |
| --- | --- | --- | --- |
| 1 | core | `makeGreeter(greeting)`: returns a greeting function | A function that returns a function, and reads its outer parameter |
| 2 | core | `byStatus(status)`: a ready-made filter for `.filter()` | The same, used with array methods |
| 3 | core | `makeTicker()`: returns 1, 2, 3... | A variable in the backpack that changes between calls |
| 4 | core | `makeCounter()`: `increment` and `current` | Two functions sharing one backpack |
| 5 | core | `makeTicketQueue()`: `add`, `next`, `size` | Private state: nothing outside can reach the list |
| 6 | core | `predictClosures()`: read code, predict the results | A closure keeps the variable, not a copy of its value |
| 7 | core | `makeHandlers(labels)`: fix a bug in finished code | Closures in a loop: `var` versus `let` |
| 8 | core | `countCalls(fn)`: wrap a function, count its calls | Wrapping another function and passing its arguments on |
| 9 | core | `once(fn)`: run `fn` only the first time | Remember a result |
| 10 | core | `memoize(fn)`: remember results by argument | Remember many results in a `Map` |
| 11 | core | `createIdGenerator(prefix)`: ticket ids like `T-1`, `T-2` | Recap: a parameter and a counter together |
| 12 | stretch | `debounce(fn, ms)`: wait until calls stop | Remember a timer |
| 13 | stretch | `createStore(initial)`: subscribe and unsubscribe | Return a closure that undoes something |

If a step feels hard, look back at the step before it: it uses the same idea with one thing less.

Check all steps:

```
yarn verify 01-js/03
```

Check one step:

```
yarn verify 01-js/03/2
```

A failing step shows a hint. If you are stuck for more than 15 minutes on a core step, ask a mentor.

Coming from Python? Step 10 is like `functools.lru_cache`, built by hand, and step 3 is the `nonlocal` example from the lesson.
