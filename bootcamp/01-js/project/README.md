# Phase 1 project: ticket logic in plain JavaScript

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

**Time:** about 1.5 hours.

## What you are building

The logic behind a ticket tracker, without any UI yet. In Phase 2 you turn this same code into TypeScript, and in the final project a React app uses it. So the names below matter: keep them exactly as they are.

```
src/
  constants.js    STATUSES, PRIORITIES, API_URL               (done for you)
  api.js          createClient, fetchTickets, fetchAssignees, loadAll
  filters.js      filterTickets, sortTickets
  stats.js        groupByStatus, computeStats
  validation.js   validateTicket
  index.js        re-exports everything                       (done for you)
```

Each function in the four files you write has a comment that says exactly what it takes and returns. Start with `api.js`, so `yarn tickets` has real data to show.

A ticket from the API looks like this:

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

## How to work

1. Start the API in a second terminal and leave it running: `python server/server.py` (or `py server/server.py`).
2. Write one function, then run `yarn tickets` to see it working on real data. Sections you have not written yet say "not done yet".
3. Run `yarn verify 01-js/project` to check everything, or `yarn verify 01-js/project/4` for one step.

`yarn tickets` options, once filtering and sorting work:

```
yarn tickets --status open --priority high
yarn tickets --assignee a3
yarn tickets --search login --sort priority --desc
```

To see a partial failure, stop the server (Ctrl+C) and start it with `python server/server.py --fail assignees`. To see the "server is down" message, stop it completely.

## Steps

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

The checker freezes every array and object it gives your functions. If a function changes one, the step fails with "Your function changed one of its inputs".

## When you are done

Run `yarn progress`. If every Phase 1 core step is green, start Phase 2 with its first lesson. Phase 2's project begins with `yarn copy-project`, which copies this `src` folder for you; nothing here changes.
