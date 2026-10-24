# 03-react/03 Rendering: snapshots, lifting state, keys, effects

**Time:** 35 min lesson, 40 min exercises (core), plus 10 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/03 Rendering: snapshots, lifting state, keys, effects**.

## 2. Quick recap

- A component renders again when its state is set to a new value, when its parent renders, or when a context it reads changes.
- State is a snapshot: setting it does not change the variable in the running code. To build on the latest value, pass an updater: `setVotes((v) => v + 1)`.
- All updates from one event are batched into one render.
- When two components need the same state, lift it to their closest common parent and pass it down as props, with a callback to change it.
- React keeps state while the same component stays in the same place. A different `key` makes a new one with fresh state.
- Effects run after the screen updates, to sync with things outside React. If an effect starts something (a timer, a listener), it returns a cleanup that stops it. StrictMode runs effects twice in development to prove the cleanup works.
- You might not need an effect: compute values from props and state while rendering; reset state with a key; respond to user actions in event handlers.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx).

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `TripleVote`: +3 adds only 1 |
| 2 | core | `TicketBoard`: lift the selected status up |
| 3 | core | `NotesPanel`: a fresh note for each ticket |
| 4 | core | `OpenTimer`: clean up the interval |
| 5 | core | `OpenCount`: remove an effect that is not needed |
| 6 | stretch | `ticketReducer` and `useReducer` |

See them in the browser (the playground runs in StrictMode, like a new Vite app):

```
yarn dev 03-react/03
```

Check them:

```
yarn verify 03-react/03
```
