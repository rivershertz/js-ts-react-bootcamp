# Final project: migrate, fix and extend the ticket app

A teammate wrote this ticket tracker in JavaScript. It mostly works, but users report odd behaviour and it feels slow with a lot of tickets. Your job is the kind of ticket you will get in your first weeks: move it to TypeScript, find and fix what is wrong, and add one feature.

## Definition of Done

In the browser, the user can:

- [ ] Open the ticket list and see an antd Table of tickets from the Python API, with a loading state while it fetches and an error state with a Retry button if the server is down.
- [ ] Sort the table by any column and page through results.
- [ ] Filter by status and priority, and type in a search box that only filters after they stop typing (debounced).
- [ ] Filter by assignee, and have that filter kept in the URL: refreshing the page or sharing the link keeps the same filter. *(the new feature)*
- [ ] Click "New ticket" and fill in an antd Form that validates required fields and shows field errors inline.
- [ ] Click a ticket to edit it in the same form, pre-filled; saving updates the table without a manual refresh.
- [ ] Use the browser back and forward buttons between the list and the form pages.
- [ ] Type in the search box without the whole table visibly lagging.

Technical:

- [ ] Every file in `src` is `.ts` or `.tsx`; `tsc` passes with `strict: true` and no `any`.
- [ ] ESLint passes with the React Hooks rules turned on, with no disabled rules.
- [ ] All six Rules of React bugs are fixed (each has its own check).
- [ ] All three performance problems are fixed (each has its own check).
- [ ] The debounced search uses your `useDebouncedValue` hook, in `src/hooks/useDebouncedValue.ts`.
- [ ] `yarn verify final-project` passes.

**Time:** about 3 hours.

## Before you start

The app's ticket logic is **your own Phase 2 project**. Every file here imports it as `@tickets/logic`, which points at `02-ts/project/src/index.ts`. So `filterTickets`, `sortTickets`, `computeStats`, `statusLabel`, `isTicket` and the `Ticket` type are the ones you wrote yesterday. If your Phase 2 project is not green yet, ask your mentor.

## Run it

Terminal 1, the API:

```
python server/server.py
```

Terminal 2, the app:

```
yarn dev final-project
```

Try the app with the server in different moods (stop it with Ctrl+C and start it again with an option):

| Start the server with | To see |
| --- | --- |
| `--delay 1500` | The loading state |
| `--fail tickets` | The error state and the Retry button |
| `--many 2000` | Whether typing in the search still feels instant |

## What is in `src`

```
main.jsx                    providers: React Query, antd theme and App, the router
App.jsx                     the routes: /tickets, /tickets/new, /tickets/:id
api/client.js               the axios client (createClient from your Phase 2 logic)
api/tickets.js              useTickets, useTicket, useAssignees, useSaveTicket (React Query)
pages/TicketListPage.jsx    the list: stats, filters, table
pages/TicketFormPage.jsx    create and edit
components/                 TicketTable, TicketFilters, StatsPanel, TicketForm
```

## How to work

1. Click around with the server in each mood above. Note anything that looks wrong.
2. Run `yarn verify final-project`. Each failing step names a symptom, not the fix. Run one step with `yarn verify final-project/7`.
3. Migrate to TypeScript one file at a time (step 1), starting with `api/`, then `components/`, then `pages/`. The bug steps run on `.js` and `.ts` alike, so you can fix bugs before, during or after the migration.
4. ESLint (step 3) points at some of the bugs on its own. Read each rule's message before you change anything.
5. For the performance steps, module 03-react/07 shows how to count renders and read the browser's Performance tab.

## Steps

| Step | What `yarn verify final-project/<step>` checks |
| --- | --- |
| 1 | Every file in `src` is `.ts` or `.tsx` |
| 2 | `tsc` passes in strict mode, with no `any` |
| 3 | ESLint passes, including the React Hooks rules |
| 4 to 9 | One Rules of React bug each. The check describes what the user would see. |
| 10 to 12 | One performance problem each, measured while typing in the search box |
| 13 | The assignee filter, kept in the URL as `?assignee=a3` |

## When you are done

Every core step in `yarn progress` is green. Show your mentor the app running with `--many 2000`, and walk them through one bug: what the user saw, why it happened, and what rule of React it broke.
