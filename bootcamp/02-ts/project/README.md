# Phase 2 project: ticket logic in strict TypeScript

**Time:** about 2 to 2.5 hours. **Before you start:** the Phase 1 project and every core step of modules 02-ts/01 to 02-ts/08 are green in `yarn progress`.

## What you are building

The same code as Phase 1, made safe. You copy your Phase 1 project, rename every file to `.ts`, and answer every question strict TypeScript asks, without switching the checker off. Two things are new: the API's answer is checked before it is trusted, and a ticket's type knows which fields each status has.

For the user, nothing changes: `yarn tickets` prints the same thing as before. In the final project a React app imports this code, so keep the function names exactly as they are.

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

## The files

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

## How to run it

You need two terminals, both in the `bootcamp` folder.

1. Terminal 1, the API. Start it and leave it running: `python server/server.py`.
2. Terminal 2, once: `yarn copy-project`. It copies `01-js/project/src` into `02-ts/project/src`. It never overwrites: if the folder exists, it stops and tells you.
3. Terminal 2, as often as you like: `yarn tickets`. As soon as `02-ts/project/src/index.ts` exists, it runs your TypeScript version instead of the Phase 1 one, and says so on the first line.

To see a malformed ticket reported, stop the API with Ctrl+C and start it with `python server/server.py --bad-data`. The last ticket it sends has a number where the priority should be.

## How to test it

- `yarn verify 02-ts/project` checks every step. `yarn verify 02-ts/project/5` checks one.
- Step 2 runs the TypeScript checker on your `src` folder only. Untouched stretch exercises elsewhere never fail it.
- Step 8 runs the Phase 1 checks again on your TypeScript code, so you know the migration changed nothing for the user.
- VS Code shows the same type errors as red underlines while you type. Hover one to read it.

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

## What to expect

**Right after `yarn copy-project`**, step 1 lists your `.js` files, and every other core step says "Finish step 1 first":

```
  ✗  1 core    Every file is .ts
                Still JavaScript: api.js, constants.js, filters.js, index.js, stats.js, validation.js. Rename each one in 02-ts/project/src to .ts.
  ✗  2 core    tsc strict: zero errors
                Finish step 1 first. Not .ts yet: src/constants, src/api, src/filters, src/stats, src/validation, src/index
```

**After the renames**, VS Code fills with red underlines, and step 2 lists the same errors. That is expected: work through them one file at a time (see How to work below).

**When you are done**, `yarn tickets` looks exactly like Phase 1, with two differences. The first line says it runs TypeScript, and a new section shows `statusLabel`:

```
Using 02-ts/project/src/index.ts (TypeScript)

Loading tickets and assignees (loadAll)
  40 tickets, 6 assignees
...
One ticket per status (statusLabel)
  t1     Open
  t2     Assigned to a1
  t3     Blocked: Waiting for design
  t4     Closed on 2026-07-28
```

With the API started with `--bad-data`, every good ticket still loads, and the bad one is named:

```
Loading tickets and assignees (loadAll)
  40 tickets, 6 assignees
  Warning: Skipped 1 malformed ticket(s): t-bad
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
4. After each file, run `yarn tickets` to see that nothing stopped working, and `yarn verify 02-ts/project` to see which steps pass.

Keep the `Ticket` union on one line that starts with `export type Ticket =`. Step 6 adds a fifth status to a copy of that line to prove your `switch` notices.

`statusLabel` turns a ticket into the text a user sees:

| Ticket | `statusLabel(ticket)` |
| --- | --- |
| open | `Open` |
| assigned to `a1` | `Assigned to a1` |
| blocked, reason "Waiting for design" | `Blocked: Waiting for design` |
| closed at `2026-10-28T12:00:00Z` | `Closed on 2026-10-28` |

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

## When you are done

Run `yarn progress`. When every Phase 2 core step is green, Phase 2 is done. Next is Phase 3's first lesson. The final project imports this `src` folder.
