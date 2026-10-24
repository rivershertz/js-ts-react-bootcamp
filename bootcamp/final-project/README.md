# Final project: migrate, fix and extend the ticket app

**Time:** about 4.5 hours. **Before you start:** every core step of Phase 3 is green in `yarn progress`, and so is your Phase 2 project (this app runs on it, see below).

## What you are building

A teammate wrote this ticket tracker in React and JavaScript. It mostly works, but users report odd behaviour and it feels slow with a lot of tickets. Your job is the kind of ticket you will get in your first weeks:

1. **Migrate** it to strict TypeScript.
2. **Fix** six bugs that break the Rules of React, and three performance problems.
3. **Extend** it with one feature: an assignee filter that is kept in the URL.

The app's ticket logic is **your own Phase 2 project**. Every file here imports it as `@tickets/logic`, which points at `02-ts/project/src/index.ts`. So `filterTickets`, `sortTickets`, `computeStats`, `statusLabel`, `isTicket` and the `Ticket` type are the ones you wrote. If your Phase 2 project is not green yet, the app does not start: ask your mentor.

## Definition of Done

In the browser, the user can:

- [ ] Open the ticket list and see an antd Table of tickets from the Python API, with a loading state while it fetches and an error state with a Retry button if the server is down.
- [ ] Sort the table by title, priority or created date, and page through results.
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

## The files

```
src/
  main.jsx                    providers: React Query, antd theme and App, the router
  App.jsx                     the routes: /tickets, /tickets/new, /tickets/:id
  api/client.js               the axios client (createClient from your Phase 2 logic)
  api/tickets.js              useTickets, useTicket, useAssignees, useSaveTicket (React Query)
  pages/TicketListPage.jsx    the list: stats, filters, table
  pages/TicketFormPage.jsx    create and edit
  components/                 TicketTable, TicketFilters, StatsPanel, TicketForm
  hooks/                      does not exist yet: your useDebouncedValue goes here
```

## How to run it

You need two terminals, both in the `bootcamp` folder.

1. Terminal 1, the API: `python server/server.py` (or `py server/server.py`). Leave it running.
2. Terminal 2, the app: `yarn dev final-project`. Open the address it prints, usually http://localhost:5173.

The page reloads by itself when you save a file, so keep it open while you work.

Try the app with the server in different moods. Stop it with Ctrl+C and start it again with an option:

| Start the server with | To see |
| --- | --- |
| `--delay 1500` | The loading state |
| `--fail tickets` | The error state and the Retry button |
| `--many 2000` | Whether typing in the search still feels instant |

## How to test it

- `yarn verify final-project` runs every step. `yarn verify final-project/7` runs only step 7.
- Each failing step describes what the user would see, not the fix. The hint names the module that explains it.
- The bug and performance steps (4 to 13) drive the real app in a test browser, so they work on `.jsx` and `.tsx` alike. You can fix bugs before, during or after the migration.
- Step 3 ignores `eslint-disable` comments. Fix the code, never the rule.
- `yarn tsc -p final-project` and `yarn eslint final-project` show every error with its file and line. VS Code shows the same ones as you type.

| Step | What `yarn verify final-project/<step>` checks |
| --- | --- |
| 1 | Every file in `src` is `.ts` or `.tsx` |
| 2 | `tsc` passes in strict mode, with no `any` |
| 3 | ESLint passes, including the React Hooks rules |
| 4 to 9 | One Rules of React bug each. The check describes what the user would see. |
| 10 to 12 | One performance problem each, measured while typing in the search box |
| 13 | The assignee filter, kept in the URL as `?assignee=a3` |

## What to expect

**In the browser**, the app starts and looks finished: a stats panel, filters and a table of 40 tickets. The problems show up when you use it. Some filters do not seem to do anything, the form does not always show the ticket you clicked, and with `--many 2000` the search lags. Click around for ten minutes before you change any code, and write down what looks wrong.

**In `yarn verify`**, every step fails at first. Each message is a symptom you can reproduce in the browser:

```
  ✗  1 core    Every file in src is .ts or .tsx
                10 files are still JavaScript: src/App.jsx, src/api/client.js, ...
  ✗  3 core    ESLint passes with the React Hooks rules
                42:48  error  React Hook "useTicket" is called conditionally ...
  ✗  4 core    Bug: sorting must not change the cached tickets
                The tickets in the React Query cache changed order (now t3, t8, t12, t9, ...).
                Something sorted them in place.
  ✗  7 core    Bug: Previous / Next shows the right ticket in the form
                After going from t1 to t2 (the Next button), the form shows
                "Login page shows blank screen" instead of "Export to CSV drops last row"
  ✗ 11 core    Performance: the list is not filtered again on every render
                While typing 5 letters, the whole list was filtered or sorted again 5 times;
                expected at most 2.
  ✗ 13 core    Feature: assignee filter kept in the URL
                For ?assignee=a3 the table should show a3's 3 tickets, but it shows 10 rows

0 of 13 core steps pass. Next: step 1, Every file in src is .ts or .tsx.
```

If steps 4 to 13 say "02-ts/project/src/index.ts is missing", your Phase 2 project is not in place yet.

Expect step 2 to report many errors right after you rename a file. That is normal: rename one file, fix it, then the next.

**When you are done**, the same command ends with:

```
All 13 core steps pass. Stretch steps are optional.
```

In the browser, the search waits until you stop typing, Previous and Next show the right ticket, and `/tickets?assignee=a3` still shows a3's tickets after you press F5.

## How to work

1. Click around with the server in each mood above. Note anything that looks wrong.
2. Run `yarn verify final-project`. Match each failing step to something you saw in the browser.
3. Migrate to TypeScript one file at a time (step 1), starting with `api/`, then `components/`, then `pages/`.
4. ESLint (step 3) points at some of the bugs on its own. Read each rule's message before you change anything.
5. For the performance steps, module 03-react/07 shows how to count renders and read the browser's Performance tab.
6. Add the feature (step 13) last, once the filters it sits next to work.

Stuck for more than 20 minutes on one step? Ask your mentor, with the step number and the `yarn verify` output.

## TypeScript with antd

Most of step 2's errors come from antd's props. These are the types you will need, all imported from `antd` (`import { type TableColumnsType } from 'antd'`):

| For | Use |
| --- | --- |
| Table columns | `const columns: TableColumnsType<Ticket> = [...]`: then `render: (_, t) => ...` knows `t` is a `Ticket` |
| Table `onChange` | `const handleChange: TableProps<Ticket>['onChange'] = (pagination, filters, sorter) => ...`. `sorter` can be an array, and `sorter.columnKey` is a `Key`, so check it with a type guard before you use it as a sort field. |
| A column's `sortOrder` | `'ascend' \| 'descend' \| null`, not `string` |
| A form | `const [form] = Form.useForm<Values>()`, with `Values` the type of the form's fields |
| `form.setFields` | each `name` must be one of the form's field names (`keyof Values`), not any `string`. A type guard turns the server's field name into one. |
| A ref to an antd `Input` | `useRef<InputRef>(null)` |
| `document.getElementById('root')` | `HTMLElement \| null`: check it with an `if` and throw a clear error |

Step 2 only bans `any` and `@ts-ignore`. Avoid `as` and `!` too, as in Phase 2: each one tells TypeScript to trust you instead of checking. If you keep one, be ready to explain it to your mentor.

## When you are done

Every core step in `yarn progress` is green. Show your mentor the app running with `--many 2000`, and walk them through one bug: what the user saw, why it happened, and what rule of React it broke.
