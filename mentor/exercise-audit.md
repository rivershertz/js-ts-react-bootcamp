# Exercise audit: where the ladders were too steep

Juniors reported that the scope and closures module had too few exercises, with big jumps between them. This note records how every module was checked for the same problem, what changed, and what to look at next. Juniors never get this folder.

## How the modules were ranked

Each module was scored on two questions:

- **How hard is it for someone coming from Python?** New mental models (closures, the event loop, React's render snapshots) score high. Syntax that maps onto Python (array methods, basic types) scores low.
- **How often does it decide whether a junior's ticket works?** Things behind real bugs in the team's apps, and behind the final project's planted bugs, score high.

Then each ladder was read step by step, looking for a step that needs two or more new ideas at once.

| Module | Hard for Python devs | Matters for tickets | Ladder before | Verdict |
| --- | --- | --- | --- | --- |
| 01-js/03 Scope and closures | high | high: every React handler and effect is a closure | 4 core, starting at a two-function counter | **Rebuilt** |
| 01-js/04 Async | high | high: every API call | 6 core, jumping from `wait` and one prediction straight to axios | **Extended** |
| 03-react/03 Rendering and effects | high | high: 4 of the final project's 6 bugs are stale state or effects | 5 core, one step per idea | **Extended** |
| 03-react/04 Custom hooks | medium | high: the final project's search needs `useDebouncedValue` | 3 core, from `useState` straight to an effect with a restarting timer | **Extended** |
| 01-js/01 Values and references | medium | high | 6 core, gradual, and 03-react/02 practises it again | Fine |
| 02-ts/03 to 02-ts/05 Narrowing, guards, unions | medium | high | 5 to 6 core each, one tool per step | Fine |
| 02-ts/06 Generics | medium | medium: mostly used, rarely written | 6 core; `first` to `indexBy` is the biggest jump | Next candidate |
| 03-react/05 React Query | medium | high | 4 core | Next candidate, after the first cohort's feedback |
| Others | low to medium | medium | gradual | Fine |

## What changed

Most new steps either add one idea to the step before, or practise the same idea in a new setting.

**01-js/03 Scope and closures: 4 core steps become 11 (plus 2 stretch).** The ladder now starts lower and climbs one idea at a time: a function that returns a function (`makeGreeter`), the same idea used with `.filter` (`byStatus`), one variable that survives between calls (`makeTicker`), then the existing `makeCounter`. After it come private state (`makeTicketQueue`), reading code that shows a closure keeps the variable and not a copy (`predictClosures`), the `var`-in-a-loop bug (`makeHandlers`), and wrapping a function (`countCalls`) as the stepping stone to `once` and `memoize`. New stretch: `createStore`, a closure that returns an unsubscribe function. The lesson has a new prediction slide for closures in a loop.

**01-js/04 Async: 6 core steps become 11.** Four steps without any network now come before the first request: predicting where `await` pauses (`predictAwait`), `await` on a plain promise (`doubleLater`), the same with `.then` (`addOneWithThen`, because the team's older code uses it), and `try / catch` around `await` (`loadOr`). Between one request and `Promise.all` there is now `fetchOneByOne`, so juniors write the sequential loop on purpose before they replace it with the parallel version. The lesson has a new prediction slide for `await`.

**03-react/03 Rendering: 5 core steps become 7.** Each of the two ideas behind most React bugs gets a second, practice step: `DelayedLike` (a timeout that remembers the old state, after `TripleVote`) and `EscapeToClose` (a keyboard listener that is never removed, after `OpenTimer`). The second one is the same mistake as the final project's keyboard bug.

**03-react/04 Custom hooks: 3 core steps become 5.** Between `useToggle` and `useDebouncedValue` there are now `useCounter` (a hook that returns an object, with its own state per caller) and `useElapsedSeconds` (an effect with a cleanup, moved into a hook).

**Time:** core work grows by about 45 minutes in Phase 1 and 20 minutes in Phase 3. The module READMEs, decks, START-HERE, the welcome deck and the mentor guide's time guide are updated.

## For juniors already working

The offline update keeps their answers and their progress:

- Existing steps kept their titles and their order in the exercise files, so a junior's solved steps merge without conflicts. New steps were only inserted between them. (In 01-js/03 that is why `createIdGenerator` now comes after `memoize`.)
- The update now moves each saved result to its step's new number, by step title, so `yarn progress` stays right.
- A renumbered `TODO: step N` placeholder that the junior already replaced no longer counts as a conflict.

## Adding steps later

Keep the same rules, so updates stay painless: insert new steps between existing ones, never reorder existing steps in the file, and keep existing step titles (the update matches progress by title). Then run `node tools/verify.mjs` and `node tools/make-update-history.mjs`.
