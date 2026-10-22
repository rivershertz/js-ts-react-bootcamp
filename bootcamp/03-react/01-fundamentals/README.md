# 03-react/01 React fundamentals in TypeScript

**Time:** 25 min lesson, 35 min exercises (core), plus 10 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/01 React fundamentals in TypeScript**.

## 2. Quick recap

- A component is a function that takes props and returns JSX. Its name starts with a capital letter. Type its props: `function PriorityBadge({ priority }: { priority: Priority })`.
- JSX differs from HTML: `className`, camelCase events (`onClick`), every tag closed, one root element (or a fragment `<>...</>`).
- `useState` gives a value and a setter. Calling the setter schedules a new render; inside the current render, the value does not change.
- Pass event handlers, do not call them: `onClick={save}` or `onClick={() => remove(id)}`.
- Lists: `items.map(...)` with `key={item.id}`, never the index when items can move.
- Conditions: a ternary, an early `return`, or `&&` with a real boolean (`tickets.length > 0 &&`, not `tickets.length &&`).
- Controlled inputs: `value` plus `onChange`. Submit logic goes in the form's `onSubmit`, with `event.preventDefault()`.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx). The ticket type and sample tickets come from [`../tickets.ts`](../tickets.ts).

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `PriorityBadge`: typed props |
| 2 | core | `TicketCard`: compose components, conditional rendering |
| 3 | core | `TicketList`: lists, keys, an empty state |
| 4 | core | `EstimateCounter`: state and click events |
| 5 | core | `NewTicketForm`: a controlled input and a form |
| 6 | stretch | `SearchableTicketList`: filter while typing |

See your components in the browser (it reloads as you edit):

```
yarn dev 03-react/01
```

Check them:

```
yarn verify 03-react/01
```
