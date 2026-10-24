# Phase 1 project: ticket logic in plain JavaScript

**Time:** about 1.5 hours. **Before you start:** every core step of modules 01-js/01 to 01-js/05 is green in `yarn progress`.

## What you are building

The logic behind a ticket tracker, without any UI yet: load tickets from the Python API, filter them, sort them, count them, and check a new ticket before it is saved. A small command, `yarn tickets`, runs your code against the real API and prints the result, so you can see each function work as soon as you write it.

This code goes the whole way with you. In Phase 2 you turn it into TypeScript, and in the final project a React app runs on it. So the names below matter: keep them exactly as they are.

## Definition of Done

Running `yarn tickets` lets the user:

- [ ] See all tickets loaded from the Python API, with a clear error message (not a crash) if the server is down.
- [ ] Filter tickets by status, priority, assignee, and a free-text search on the title.
- [ ] Sort tickets by created date, priority, or title, ascending or descending, without mutating the original list.
- [ ] See tickets grouped by status, with a count per group.
- [ ] See summary stats: total, open, overdue, and average age in days.
- [ ] Validate a new ticket and get a list of every field error (missing title, unknown priority, due date in the past), not just the first one.
- [ ] Load tickets and assignees in parallel; if one request fails, still see the other with a warning (`Promise.allSettled`).

Technical:

- [ ] `yarn verify 01-js/project` passes.
- [ ] Logic is split into ES modules (`api`, `filters`, `stats`, `validation`) with no UI or `console.log` inside them.
- [ ] No input array or object is mutated.

**Stretch:** sort by due date with missing dates last (step 11), then go back to any stretch steps you skipped in modules 01 to 05.

## The files

```
src/
  constants.js    STATUSES, PRIORITIES, API_URL               (done for you)
  api.js          createClient, fetchTickets, fetchAssignees, loadAll
  filters.js      filterTickets, sortTickets
  stats.js        groupByStatus, computeStats
  validation.js   validateTicket
  index.js        re-exports everything                       (done for you)
```

Each function in the four files you write has a comment that says exactly what it takes and returns. A ticket from the API looks like this:

```js
{
  id: 't7',
  title: 'Table pagination resets on edit',
  description: '...',
  priority: 'high',             // 'low' | 'medium' | 'high' | 'urgent'
  status: 'blocked',            // 'open' | 'assigned' | 'blocked' | 'closed'
  createdAt: '2026-07-19T08:15:00Z',
  dueDate: '2026-12-25',        // or null
  assignee: 'a3',               // only when assigned or blocked (optional when closed)
  blockedReason: 'Needs backend change',   // only when blocked
  closedAt: '2026-10-28T12:00:00Z',        // only when closed
}
```

## How to run it

You need two terminals, both in the `bootcamp` folder.

1. Terminal 1, the API. Start it and leave it running: `python server/server.py` (or `py server/server.py`).
2. Terminal 2, your code: `yarn tickets`.

Once filtering and sorting work, `yarn tickets` takes options:

```
yarn tickets --status open --priority high
yarn tickets --assignee a3
yarn tickets --search login --sort priority --desc
```

Stop the API with Ctrl+C and start it again with an option to see how your code copes:

| Start the API with | To see |
| --- | --- |
| `python server/server.py --fail assignees` | A partial failure: tickets still load, with a warning about assignees |
| (API stopped) | The "server is down" message instead of a crash |

## How to test it

- `yarn verify 01-js/project` checks every step. `yarn verify 01-js/project/4` checks one.
- A failing step says what is wrong and gives a hint. It describes what the user would see, not the fix.
- The checker freezes every array and object it gives your functions. If a function changes one, the step fails with "Your function changed one of its inputs".
- `yarn progress` shows this project's steps next to every module's.

| Step | Level | What `yarn verify 01-js/project/<step>` checks |
| --- | --- | --- |
| 1 | core | `createClient`, `fetchTickets` and `fetchAssignees` load data from the API |
| 2 | core | `loadAll` returns warnings instead of throwing when the server is down |
| 3 | core | `loadAll` sends both requests at once and keeps the tickets when assignees fail |
| 4 | core | `filterTickets` by status, priority, assignee and search |
| 5 | core | `filterTickets` with several filters at once, and with none |
| 6 | core | `sortTickets` by each field in both directions, without changing the input |
| 7 | core | `groupByStatus` has every status, even empty ones |
| 8 | core | `computeStats` with a fixed date |
| 9 | core | `validateTicket` reports every error at once |
| 10 | core | No `console` in `src/`, full file names in imports, and everything works through `index.js` |
| 11 | stretch | `sortTickets` by `dueDate`, tickets without one last |

## What to expect

**Before you write anything**, every section of `yarn tickets` says it is not done yet:

```
Loading tickets and assignees (loadAll)
  not done yet (TODO: createClient)

Tickets, sorted by createdAt asc
  not done yet (TODO: filterTickets)
...
```

**When you are done**, the same command shows real data. Your ticket list and numbers will match these:

```
Loading tickets and assignees (loadAll)
  40 tickets, 6 assignees

Tickets, sorted by createdAt asc
  id     status    priority  assignee        due         title
  t19    open      high                                  Date picker opens off screen
  t29    assigned  medium    Lior Ben-David  2026-10-20  Audit log missing user name
  ...
  40 ticket(s)

Grouped by status (groupByStatus)
  open       13  t1 t5 t16 t19 t21 t22 t23 t25 t26 t27 t31 t34 t36
  assigned   10  t2 t6 t10 t13 t15 t24 t28 t29 t32 t40
  blocked     7  t3 t7 t14 t20 t33 t38 t39
  closed     10  t4 t8 t9 t11 t12 t17 t18 t30 t35 t37

Summary (computeStats)
  total 40   open 30   overdue 12   average age of open tickets 51.9 days

Validating a bad new ticket (validateTicket)
  {"title":"   ","priority":"critical","dueDate":"2020-01-01"}
  valid: false
  - title: Title is required
  - priority: Priority must be one of low, medium, high, urgent
  - dueDate: Due date cannot be in the past
```

The overdue count and the average age depend on today's date, so yours will differ.

With filters, only the matching tickets are listed:

```
yarn tickets --status open --search login --sort priority --desc

Tickets, filtered by status=open search=login, sorted by priority desc
  id     status    priority  assignee        due         title
  t1     open      low                                   Login page shows blank screen
  1 ticket(s)
```

With `--fail assignees`, the tickets still load:

```
Loading tickets and assignees (loadAll)
  40 tickets, 0 assignees
  Warning: Could not load assignees: the server answered 500
```

With the API stopped, you get a message, not a stack trace:

```
Loading tickets and assignees (loadAll)
  0 tickets, 0 assignees
  Warning: Could not load tickets: the server is not running
  Warning: Could not load assignees: the server is not running
```

The exact wording of your warnings can differ. What matters is that `loadAll` returns them instead of throwing.

## How to work

1. Start with `api.js`, so `yarn tickets` has real data to show.
2. Write one function, then run `yarn tickets` to see it on real data.
3. Run `yarn verify 01-js/project/<step>` for the steps that function covers.
4. Then `filters.js`, `stats.js` and `validation.js`, in any order.

Stuck for more than 20 minutes on one step? Ask your mentor, with the step number and the `yarn verify` output.

## When you are done

Run `yarn progress`. When every Phase 1 core step is green, start Phase 2 with its first lesson. Phase 2's project begins with `yarn copy-project`, which copies this `src` folder for you. Nothing here changes.
