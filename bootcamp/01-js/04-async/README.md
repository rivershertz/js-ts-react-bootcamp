# 01-js/04 Async

**Time:** 20 min lesson, 35 min exercises (core), plus 15 min stretch.

## 1. Watch the lesson

`yarn lessons`, then **01-js/04 Async**.

## 2. Quick recap

- JavaScript runs on one thread. Timers and network requests wait outside it; their callbacks come back through the event loop.
- Promise callbacks (microtasks) run before timer callbacks (tasks).
- `async` functions return promises. `await` pauses only the current function.
- Wrap `await` in `try / catch`. axios throws for 4xx and 5xx answers; `error.response` is missing when there was no answer at all.
- `Promise.all` runs things at the same time and fails if one fails. `Promise.allSettled` waits for all and tells you which failed.

## 3. Exercises

Open [`exercises.js`](exercises.js). Steps 3 to 6 get an axios `client` that talks to a test copy of the ticket API, so you do not need the Python server running for the checks.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `wait(ms)`: wrap `setTimeout` in a promise |
| 2 | core | `predictOrder`: the event loop, on paper |
| 3 | core | `fetchTitle`: `async` / `await` with axios |
| 4 | core | `fetchTicketOrNull`: handle a 404, rethrow everything else |
| 5 | core | `fetchMany`: in parallel with `Promise.all` |
| 6 | core | `fetchSome`: partial results with `Promise.allSettled` |
| 7 | stretch | `withTimeout` with `Promise.race` |
| 8 | stretch | `retry` |

```
yarn verify 01-js/04
```

Want to see your code hit the real API? Start the Python server and call your functions from the Run box in the lesson, or wait for `yarn tickets` in the project.
