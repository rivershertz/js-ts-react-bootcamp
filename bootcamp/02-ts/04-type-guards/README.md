# 02-ts/04 Type guards: checking unknown data

**Time:** 30 min lesson, 35 min exercises (core), plus 10 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **02-ts/04 Type guards: checking unknown data**.

## 2. Quick recap

- Types are not checked at run time. Data from an API, `JSON.parse` or a form can be anything, so treat it as `unknown`.
- A **type guard** is a function returning `value is Ticket`. It checks at run time, and after `if (isTicket(x))` TypeScript knows `x` is a `Ticket`.
- Build big guards from small ones: `isRecord`, then a `typeof` check per field.
- An **assertion function** returns `asserts value is Ticket` and throws when the check fails, so the code after the call can rely on it.
- `array.filter(isTicket)` gives a `Ticket[]`: guards work as filter callbacks.

## 3. Exercises

Open [`exercises.ts`](exercises.ts). No `as` and no `any`: the point is to prove the type with a check.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `isPriority`: your first type predicate |
| 2 | core | `isRecord`: an object you can read fields from |
| 3 | core | `isAssignee` |
| 4 | core | `isTicket`: every field with the right type |
| 5 | core | `assertTicket`: an assertion function |
| 6 | core | `parseTickets`: keep the valid tickets, count the rest |
| 7 | stretch | `ticketProblems`: say what is wrong with a ticket |

```
yarn verify 02-ts/04
```

Try it on real bad data: start the API with `python server/server.py --bad-data` and look at the last ticket in `localhost:8000/api/tickets`. Your Phase 2 project uses `isTicket` to skip it.
