# 02-ts/05 Discriminated unions: ticket states

**Time:** 30 min lesson, 35 min exercises (core), plus 5 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **02-ts/05 Discriminated unions: ticket states**.

## 2. Quick recap

- Model each state as its own type, with a shared literal field (the **discriminant**, here `status`) that says which state it is.
- Join the states in a union: `type Ticket = OpenTicket | AssignedTicket | BlockedTicket | ClosedTicket`. Impossible tickets (open with `closedAt`, assigned without `assignee`) no longer type-check.
- `switch (ticket.status)` narrows: inside `case 'blocked':` the ticket is a `BlockedTicket`.
- In `default:`, pass the ticket to a function that takes `never`. If every state is handled, that is fine; add a state and forget a case, and it becomes a compile error.
- When changing state, build the new object on purpose instead of spreading the old one, so fields of the old state do not sneak in.

## 3. Exercises

Open [`exercises.ts`](exercises.ts).

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `Ticket` as a union of four state types |
| 2 | core | `statusLabel`: `switch` on `status` |
| 3 | core | `statusLabel` is exhaustive (`never` check) |
| 4 | core | `assign`: open in, assigned out |
| 5 | core | `close`: any state in, closed out |
| 6 | stretch | `assigneeOf` |

```
yarn verify 02-ts/05
```

Step 3 is checked in an unusual way: the checker adds an `'archived'` status to a copy of your file and expects `statusLabel` to stop compiling.
