# 01-js/02 Array and object methods

**Time:** 15 min lesson, 35 min exercises (core), plus 30 min stretch.

## 1. Watch the lesson

`yarn lessons`, then **01-js/02 Array and object methods**.

## 2. Quick recap

| You want | Use |
| --- | --- |
| Change every item | `map` |
| Keep some items | `filter` |
| The first match | `find` (gives `undefined` when nothing matches) |
| Yes/no about the items | `some`, `every`, `includes` |
| One value from all items | `reduce` |
| A sorted copy | `toSorted((a, b) => ...)` — never `sort()` on data you were given |
| Part of an array | `slice(start, end)` |
| Work on an object's fields | `Object.entries` → array methods → `Object.fromEntries` |

## 3. Exercises

Open [`exercises.js`](exercises.js). All steps use the same 12 tickets from `scripts/fixtures/tickets.json`, the ones the API serves first.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `titles` with `map` |
| 2 | core | `notClosed` with `filter` |
| 3 | core | `findById` with `find` |
| 4 | stretch | `checkTickets` with `some` and `every` |
| 5 | core | `countByPriority` with `reduce` |
| 6 | core | `newestFirst` without changing the input |
| 7 | stretch | `indexById` with `Object.fromEntries` |
| 8 | core | `hotList`: a chain of four methods |
| 9 | stretch | `groupBy` with `reduce` |
| 10 | stretch | `pipe` |

```
yarn verify 01-js/02
```

You will reuse steps 5, 6 and 9 almost unchanged in the Phase 1 project.
