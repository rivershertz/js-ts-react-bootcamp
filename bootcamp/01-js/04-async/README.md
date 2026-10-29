# 01-js/04 Async

**Time:** 20 min lesson, 55 min exercises (core), plus 15 min stretch.

## 1. Watch the lesson

`yarn lessons`, then **01-js/04 Async**.

## 2. Quick recap

- JavaScript runs on one thread. Timers and network requests wait outside it; their callbacks come back through the event loop.
- Promise callbacks (microtasks) run before timer callbacks (tasks).
- `async` functions return promises. `await` pauses only the current function.
- Wrap `await` in `try / catch`. axios throws for 4xx and 5xx answers; `error.response` is missing when there was no answer at all.
- `Promise.all` runs things at the same time and fails if one fails. `Promise.allSettled` waits for all and tells you which failed.

## 3. Exercises

Open [`exercises.js`](exercises.js). Async code is everywhere in the team's apps and the event loop takes time to click, so the steps climb slowly. Steps 1 to 6 use no network at all. Steps 7 to 11 get an axios `client` that talks to a test copy of the ticket API, so you do not need the Python server running for the checks.

| Step | Level | Task | New idea |
| --- | --- | --- | --- |
| 1 | core | `wait(ms)`: wrap `setTimeout` in a promise | Making a promise |
| 2 | core | `predictOrder`: the event loop, on paper | Microtasks run before timers |
| 3 | core | `predictAwait`: the event loop with `await` | An async function runs until its first `await` |
| 4 | core | `doubleLater`: `await` a value, then use it | `await` unwraps a promise |
| 5 | core | `addOneWithThen`: the same with `.then` | Reading the older `.then` style |
| 6 | core | `loadOr`: a fallback when a promise rejects | `try / catch` around `await` |
| 7 | core | `fetchTitle`: `async` / `await` with axios | One real request |
| 8 | core | `fetchTicketOrNull`: handle a 404, rethrow everything else | Telling errors apart |
| 9 | core | `fetchOneByOne`: requests one after another | `await` in a loop |
| 10 | core | `fetchMany`: in parallel with `Promise.all` | All at once |
| 11 | core | `fetchSome`: partial results with `Promise.allSettled` | All at once, surviving failures |
| 12 | stretch | `withTimeout` with `Promise.race` | |
| 13 | stretch | `retry` | |

If a step feels hard, look back at the step before it: it uses the same idea with one thing less.

```
yarn verify 01-js/04
```

Want to see your code hit the real API? Start the Python server and call your functions from the Run box in the lesson, or wait for `yarn tickets` in the project.
