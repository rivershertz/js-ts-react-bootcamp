# Phase 2 project: ticket logic in strict TypeScript

## Definition of Done

For the user, `yarn tickets` behaves exactly as before. Nothing visible changes; the code is now safe to build on.

Technical:

- [ ] Every Phase 1 file is `.ts`, and strict TypeScript finds no errors in it (`yarn verify 02-ts/project/2`).
- [ ] No `any`, no `@ts-ignore`, no non-null `!` assertions.
- [ ] Ticket statuses and priorities are defined once as `as const` arrays, and their types are derived from them.
- [ ] A ticket is a discriminated union on `status` (for example, only a `closed` ticket has `closedAt`, only an `assigned` ticket has `assignee`).
- [ ] Every `switch` on status is exhaustive, enforced by a `never` check.
- [ ] API responses arrive as `unknown` and pass through a type guard before use; a malformed ticket is reported, not trusted.
- [ ] `yarn verify 02-ts/project` passes.

**Stretch:** the due-date sort from Phase 1 still works (step 9), then template literal types, mapped types, and generic constraints with `extends` wherever they make your code clearer.

**Time:** about 2 to 2.5 hours.

## What you are building

The same code as Phase 1, made safe. In the final project a React app imports it from here, so keep the function names exactly as they are.

```
src/
  constants.ts    STATUSES, PRIORITIES as const, with Status and Priority derived from them
  types.ts        Ticket (a discriminated union), Assignee, and the other shapes    (new file)
  api.ts          client.get<unknown>, then isTicket on every item
  filters.ts      filterTickets, sortTickets
  stats.ts        groupByStatus, computeStats, statusLabel                           (statusLabel is new)
  validation.ts   validateTicket, isTicket                                           (isTicket is new)
  index.ts        re-exports everything, including types.ts
```

## How to work

1. Run `yarn copy-project` once. It copies `01-js/project/src` into `02-ts/project/src`. It never overwrites: if the folder exists, it stops and tells you.
2. Rename every file in `02-ts/project/src` from `.js` to `.ts`, and change the imports to match (`./constants.ts`). Step 1 now passes, and VS Code shows red underlines.
3. Fix one file at a time, in this order. Each one only depends on the files before it, so the errors you see are your own.
   1. **constants.ts:** add `as const` and export `Status` and `Priority` derived from the arrays (module 02-ts/07).
   2. **types.ts and validation.ts:** write the `Ticket` union, one type per status (module 02-ts/05). The API's tickets also have an optional description, so add `description?: string` to the shared base. Then write `isTicket(value: unknown): value is Ticket` next to `validateTicket` (module 02-ts/04). `validateTicket` checks what a user typed, which can be anything, so give its draft unknown fields: `type TicketDraft = { title?: unknown; priority?: unknown; dueDate?: unknown }`.
   3. **filters.ts:** type the parameters. Hover anything you are not sure of. Only some kinds of ticket have an `assignee`, so `t.assignee` is an error on the union: check `'assignee' in t && t.assignee === filters.assignee`.
   4. **stats.ts:** type `groupByStatus` and `computeStats`, then add `statusLabel` with a `never` check in `default` (module 02-ts/05). Two errors you will likely meet:
      - `reduce` cannot guess its result type from `Object.fromEntries(...)`, which always has string keys. Give it the type and a literal start value: `tickets.reduce<Record<Status, Ticket[]>>((groups, t) => ..., { open: [], assigned: [], blocked: [], closed: [] })`.
      - TypeScript does not let you subtract two `Date`s. Subtract numbers: `now.getTime() - new Date(t.createdAt).getTime()`.
   5. **api.ts:** ask axios for `unknown` and keep only the items that pass `isTicket` (module 02-ts/08 is the same workflow). Then:
      - Keep `fetchTickets(client)` returning `Promise<Ticket[]>`, the valid tickets only: the final project calls it.
      - Write a helper that both `fetchTickets` and `loadAll` use, which returns the valid tickets and the ids of the others: `{ tickets: Ticket[]; invalidIds: string[] }`.
      - In `loadAll`, add a warning that names them, for example `Skipped 1 malformed ticket(s): t-bad`.
      - The error in a `catch` or a rejected promise is `unknown`, and `as` is not allowed. Narrow it: `axios.isAxiosError(error)` tells you it is an axios error (then `error.response?.status` is typed), and `error instanceof Error` gives you `error.message` for anything else.
4. Run `yarn tickets` after each file. It now runs your TypeScript version (it says so on the first line), so you see at once if something stopped working.
5. Run `yarn verify 02-ts/project` to check everything, or `yarn verify 02-ts/project/5` for one step.

Keep the `Ticket` union on one line that starts with `export type Ticket =`. Step 6 adds a fifth status to a copy of that line to prove your `switch` notices.

`statusLabel` turns a ticket into the text a user sees:

| Ticket | `statusLabel(ticket)` |
| --- | --- |
| open | `Open` |
| assigned to `a1` | `Assigned to a1` |
| blocked, reason "Waiting for design" | `Blocked: Waiting for design` |
| closed at `2026-10-28T12:00:00Z` | `Closed on 2026-10-28` |

To see a malformed ticket reported, stop the server (Ctrl+C) and start it with `python server/server.py --bad-data`. `yarn tickets` should still show every good ticket, plus a warning that names the bad one.

## What the final project imports

The final project's React app imports these from your `src/index.ts`. Keep these names and shapes, and the app runs on your code without changes:

| Export | Shape |
| --- | --- |
| `STATUSES`, `PRIORITIES` | the `as const` arrays, and the `Status`, `Priority` types |
| `Ticket`, `Assignee` | your types |
| `createClient(baseURL)` | returns an `AxiosInstance` |
| `fetchTickets(client)` | `Promise<Ticket[]>`, the valid tickets only |
| `fetchAssignees(client)` | `Promise<Assignee[]>` |
| `isTicket(value)` | `value is Ticket` |
| `filterTickets(tickets, { status, priority, assignee, search })` | `Ticket[]` |
| `sortTickets(tickets, { by, direction })` | `Ticket[]`, with `by` one of `'title'`, `'priority'`, `'createdAt'` |
| `computeStats(tickets)` | `{ total, open, overdue, averageAgeDays }` |
| `statusLabel(ticket)` | `string` |

Name the types of the filter, sort and stats objects as you like: you import them by your own names when you migrate the app.

## Steps

| Step | Level | What `yarn verify 02-ts/project/<step>` checks |
| --- | --- | --- |
| 1 | core | Every file in `src/` is `.ts` |
| 2 | core | `tsc` in strict mode finds no errors in `src/` |
| 3 | core | No `any`, no `as` casts (`as const` is fine), no `!`, no `@ts-ignore` or `@ts-expect-error` |
| 4 | core | `STATUSES` and `PRIORITIES` are `as const`, and `Status` and `Priority` are derived from them |
| 5 | core | `Ticket` is a discriminated union: an open ticket cannot have `closedAt`, an assigned one needs an `assignee` |
| 6 | core | `statusLabel` gives the labels above, and adding a status breaks the build |
| 7 | core | `api.ts` asks for `unknown`, `isTicket` is a type guard, and `loadAll` names the malformed ticket |
| 8 | core | Phase 1 steps 1 to 10 still pass on this version |
| 9 | stretch | Phase 1 step 11 (due-date sort) still passes |

## When you are done

Run `yarn progress`. If every Phase 2 core step is green, Phase 2 is done. Next is Phase 3's first lesson, and the final project imports this `src` folder.
