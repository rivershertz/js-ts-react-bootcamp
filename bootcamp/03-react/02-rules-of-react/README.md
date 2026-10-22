# 03-react/02 Rules of React

**Time:** 20 min lesson, 35 min exercises (core), plus 5 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/02 Rules of React**.

## 2. Quick recap

- **Rendering is pure.** Same props and state, same JSX. A render changes nothing outside the component. Side effects go in event handlers or effects.
- **Never mutate** state, props, or shared data. React compares old and new state with `Object.is`: give it a new array or object (`[...list, x]`, `{ ...ticket, title }`, `map`, `filter`, `toSorted`).
- A spread copies one level. To change one item of a list, `map` to a new list with a new object for that item.
- **Hooks at the top level**: every hook on every render, in the same order. Never in a condition, a loop, or after an early `return`.
- An effect's dependency array lists every value the effect reads.
- ESLint's `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps` find hook-order and dependency mistakes. It cannot find mutation.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx). Each component works a little, and each breaks one rule. Find it and fix it without changing what the component shows.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `TagEditor`: adding a tag does nothing |
| 2 | core | `AssigneePicker`: assigning does nothing |
| 3 | core | `SortedTitles`: the parent's list changes order |
| 4 | core | `NumberedTitles`: wrong numbers |
| 5 | core | `TicketDetails`: crashes going back to no ticket |
| 6 | core | `DocumentTitle`: the tab title does not follow |
| 7 | core | `yarn eslint 03-react/02-rules-of-react` reports nothing |
| 8 | stretch | `Checklist`: the parent's items change |

See them in the browser (it reloads as you edit):

```
yarn dev 03-react/02
```

Check them:

```
yarn verify 03-react/02
```
