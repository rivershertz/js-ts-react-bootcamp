# Mentor guide

For the people supporting juniors through the bootcamp. Juniors never get this folder.

## How the bootcamp runs

- **Self-paced, planned as two days.** JavaScript, then TypeScript, then React, then the final project. The time guide below adds up to more than two working days of core work, so plan the calendar from it, not from the day labels.
- Each module is: a lesson deck (`yarn lessons`), a short README, and an exercise ladder checked by `yarn verify <module>`.
- **Core** steps are the path. **Stretch** steps are optional and never block the next module.
- A junior is done when every core step passes and `yarn verify final-project` is green.

## Your daily routine

1. Morning: check each junior ran `yarn verify 00-setup` green on their first morning.
2. A few times a day: ask them to run `yarn progress` and share the output. It shows every module, which steps pass, and the next step.
3. If someone is more than 30 minutes behind the time guide on one module, sit with them.

## Reading `yarn progress`

```
  01-js/02         Array and object methods           ✓ ✓ ✗ (·) · · (·) · (·) (·)   2/6 core
```

- One mark per step, in order: ✓ passed, ✗ failed the last time they ran it, · not run yet. Marks in brackets are stretch steps, shown only as (✓) done or (·) not done, so an untouched stretch step never looks like a failure.
- The count at the end is core steps only. The last line names the next core step to do.
- It shows the result of each step's last `yarn verify` run, so ask them to run `yarn verify <module>` first if it looks stale.
- A ✗ followed by several · usually means they are stuck on that step. Ask about it before it costs them 30 minutes.

## Time guide

Each module README gives a lesson time, a core exercise time and a stretch time. Added up, core is about:

| Phase | Core time |
| --- | --- |
| Setup | 0.5 h |
| Phase 1: JavaScript, with its project | 5.5 h |
| Phase 2: TypeScript, with its project (about 2 to 2.5 h) | 6 h |
| Phase 3: React modules | 6 h |
| Final project | 4.5 h |
| **Total** | **about 22.5 h** |

These are estimates (about 1.25 minutes per slide, and 4 to 6 minutes per core step), corrected after a dry run, until a real cohort has gone through. The dry run found the final project's TypeScript migration of the antd code the slowest part. Note where juniors are much faster or slower, so the guides can be corrected.

## Unblocking without giving the answer

- Ask them to read the failing step's hint out loud, then show you the slide it points to.
- Ask what they expected to happen, then have them `console.log` (or set a `debugger;` breakpoint) at the line where it differs.
- For type errors, have them hover the red underline in VS Code and read the type TypeScript inferred.
- Worked solutions are in `solutions/`, mirroring the bootcamp paths. Use them to check your own reasoning; avoid handing them over, except in the case below.

## If a junior did not finish Phase 2

The final project imports the junior's own Phase 2 ticket logic. If their Phase 2 project is not green when they reach Phase 3, give them `solutions/02-ts/project/src` to copy into `02-ts/project/src`, so they can do the React work on time.

## Known sticking points

Filled in per module as the material is written.

| Module | Where juniors get stuck | What to ask |
| --- | --- | --- |
| 00-setup | `.npmrc` missing or with the wrong registry; `yarn install` hangs or 404s | "Open your `.npmrc`. Which address does `registry=` point at?" |
| 00-setup | `python` not found on Windows | "Try `py server/server.py`." |
| 01-js/01 | `toggleStatus` passes, but `replaceTicket` fails with "changed one of its inputs" | "Which line changes something you were given? What would give you a new array instead?" |
| 01-js/02 | `newestFirst` uses `.sort()` and fails as a mutation | "Is there a version of sort that returns a new array?" |
| 01-js/02 | `countByPriority` misses priorities with 0 tickets | "What is your starting value for reduce?" |
| 01-js/03 | `once` returns `undefined` on the second call | "Where is the first result stored between calls?" |
| 01-js/03 | `memoize` calls `fn` again for a cached `undefined` | "How do you tell 'no entry' from 'an entry whose value is undefined'?" |
| 01-js/04 | `predictOrder` answered as `['A', 'B', 'C', 'D']` | "Replay the event-loop slide. Which queue does a promise callback go to, and which one is emptied first?" |
| 01-js/04 | `fetchMany` is sequential (`await` inside a `for` loop): the timing check fails | "When does the second request start? Can you start all of them before awaiting?" |
| 01-js/04 | `fetchTicketOrNull` swallows every error | "What should happen for a 500? Which property tells you the status?" |
| 01-js/05 | Wrote `from './dates'` and the step asks for the extension | "Node needs the whole file name. Which file does `./dates` mean?" |
| 01-js/05 | Step 3 still has `isOverdue` in `tickets.js` | "Did you move it or copy it?" |
| 01-js/project | `loadAll` throws when the server is down | "Which Promise method never rejects?" |
| 01-js/project | Priority sort comes out alphabetical (`high, low, medium, urgent`) | "Where is the real order of priorities written down?" |
| 01-js/project | `averageAgeDays` off by a little | "Are you averaging all tickets or only the ones that are not closed? Rounded how?" |
| 02-ts/01 | Thinks the `'75'` result is a TypeScript bug | "What type does `JSON.parse` return? Who checked the data at run time?" |
| 02-ts/02 | `addTicket` uses `push` and gets "Property 'push' does not exist on readonly" | "The readonly type is telling you something. How did you add to an array without changing it in Phase 1?" |
| 02-ts/03 | Reaches for `as Priority` to make an error go away | "What would make TypeScript sure it is a Priority? Which check narrows a string to one of the four?" |
| 02-ts/04 | `isTicket` checks only `id` and `title` | "Which fields does a `blocked` ticket need that an `open` one does not?" |
| 02-ts/05 | Step 3 fails even though `statusLabel` looks complete | "What happens in your `default` if a fifth status appears? Which type is left over there?" |
| 02-ts/06 | `first<T>` returns `T`, not `T \| undefined` | "What does `first([])` return at run time?" |
| 02-ts/07 | `Status` comes out as `string` | "Hover `STATUSES`. What type does TypeScript give it? What does `as const` change?" |
| 02-ts/08 | Fixes errors with `any` or `!` and step 4 fails | "The checker lists each shortcut with its line. What question is that shortcut hiding?" |
| 02-ts/project | Hundreds of errors after renaming, and the junior freezes | "Close every file except `constants.ts`. Which file does everything else import?" |
| 02-ts/project | Step 6 says "everything still compiles" with an extra state | "Is there a `never` check in `statusLabel`'s `default`, and is the `Ticket` union on one line starting `export type Ticket =`?" |
| 02-ts/project | Step 7: `fetchTickets` still returns the bad ticket | "Where does `isTicket` run: on the response, or on each item of it?" |
| 03-react/01 | `NewTicketForm` submits on the button's `onClick`; Enter in the input does nothing | "Which element knows the user submitted: the button or the form?" |
| 03-react/02 | Step 1 "works" in the browser: the tag shows up as soon as they type again | "Does the tag appear because of your click, or because something else re-rendered? What does `Object.is` say about the array?" |
| 03-react/02 | Step 5 fixed by deleting the early return | "Can you keep the early return and still call every hook on every render?" |
| 03-react/03 | `TicketBoard` gets its own `useState` but `StatusTabs` keeps one too | "How many places hold the selected status now? Which one does the list read?" |
| 03-react/03 | `OpenTimer` counts 2 s per second in the playground | "The playground runs in StrictMode. What does it do to effects, and what stops the second interval?" |
| 03-react/04 | `useDebouncedValue` updates on every key press | "What does your effect's cleanup do when the value changes again?" |
| 03-react/05 | Step 1 returns `{ data }` from `useQuery`, and step 2 has no `isPending` | "Return the whole result. What else is on it besides `data`?" |
| 03-react/05 | Step 3 wraps `useQuery` in `if (id)` | "Rules of Hooks: what does `useQuery` take that says whether it may run?" |
| 03-react/05 | Step 4 calls `refetch` from the board, or reloads the page | "Who knows the save changed the list: the button or the mutation? What can `onSuccess` tell the cache?" |
| 03-react/06 | Step 2 still warns about keys after adding `key` to each column | "The warning is about rows, not columns. Which field of a ticket is unique, and which Table prop names it?" |
| 03-react/06 | Step 3 sorts `high, low, medium, urgent` | "What does `localeCompare` compare? Where is the real order of priorities written down?" |
| 03-react/06 | Step 5 form stays empty, or shows the first ticket after switching | "When does antd read `initialValues`? What did module 03 say about resetting state with a key?" |
| 03-react/06 | Copies a version 3 or 4 example (`getFieldDecorator`, `antd/dist/antd.css`) | "Which antd is this project on? Check `package.json` first." |
| 03-react/07 | Step 1 puts `filters` or the whole state in the `useMemo` dependencies | "Which values does the filter read? Is `compact` one of them?" |
| 03-react/07 | Step 3 still renders 6 rows after adding `useCallback` | "Did step 2 wrap `TicketRow` in `memo`? Who compares the props?" |
| 03-react/07 | Wants to memoize everything after this module | Point at step 4 and the "When not to memoize" slide: measure first. |
| 03-react/08 | Step 1: `/tickets/new` shows "No ticket new" | "Which route matched? Is there a route for `/tickets/new` at all?" |
| 03-react/08 | Step 4 keeps `useState` and also writes the URL | "Where does the filter live now: in two places? Which one survives a refresh?" |
| 03-react/08 | Step 4 replaces the whole query string, losing other parameters | "What does `setSearchParams({ status })` do to `?sort=...`? Try the function form." |
| 03-react/09 | Step 1 passes but the unmount part fails | "What does createRoot give you back, and which of its methods undoes render?" |
| 03-react/09 | Guesses at steps 2 and 5 until they pass | Ask for the reason behind each answer. The batching demo in the playground shows step 2 live. |

## The final project's planted problems

Never point to these directly; each check names the symptom. The solution is in `solutions/final-project/src` (it needs `solutions/02-ts/project/src` as the Phase 2 logic).

| Step | Kind | Where | What is planted | What the junior sees | How to unblock |
| --- | --- | --- | --- | --- | --- |
| 4 | Rules of React | `pages/TicketListPage` | `tickets.sort(newestFirst)` on the React Query data when no column is sorted | "The tickets in the React Query cache changed order" | "Which array methods change the array they are called on? Whose array is `data`?" |
| 5 | Rules of Hooks | `pages/TicketFormPage` | `useTicket` and an effect called after `if (!id) return` | Crash after Create ticket: "Rendered more hooks than during the previous render" (ESLint also flags it) | "Is `TicketFormPage` a new component on `/tickets/t1`, or the same one? Does every render call the same hooks?" |
| 6 | Effects | `components/TicketFilters` | The `/` shortcut's `keydown` listener has no cleanup | "1 keydown listener(s) are still attached" | "When the list goes away, what removes the listener?" |
| 7 | Effects | `pages/TicketFormPage` | Pre-fill effect with `[]` deps, so Previous / Next keeps the first ticket in the form (ESLint flags the deps) | The form shows t1's title on t2 | "When does an effect with `[]` run? Is the page mounted again when only `:id` changes?" Fixes: correct deps, or a `key` per ticket |
| 8 | You might not need an effect | `components/TicketTable` | Rows copied into state and synced in an effect | "The table rendered 1 time(s) with the rows still in the old order" | "Is `rows` anything more than the `tickets` prop?" |
| 9 | State identity | `components/TicketFilters` | `filters[field] = value; onFiltersChange(filters)` | The status filter does nothing (until something else re-renders) | "How does React decide state changed? Is this a new object?" |
| 10 | Performance | `pages/TicketListPage` | The search filters on every key press | "filtered for 5 different search texts" | "What should the filter depend on: what is typed, or what was typed 300 ms ago?" |
| 11 | Performance | `pages/TicketListPage` | Filtering and sorting run on every render | "filtered or sorted again 5 times" | "What does the list depend on? Which hook skips work when those have not changed?" Needs step 10 too |
| 12 | Performance | `pages/TicketListPage` | `memo(StatsPanel)` gets `computeStats(...)` and `() => refetch()` inline | "re-rendered the stats panel (20 Statistic renders)" | "memo compares each prop with the last one. Which are new objects on every render?" |
| 13 | Feature | `components/TicketFilters`, `pages/TicketListPage` | Not there yet | "the table shows 10 rows" for `?assignee=a3` | "Where does the router keep the part after `?`?" (`useSearchParams`) |

Steps 1 to 3 are the TypeScript migration, `tsc` and ESLint. ESLint finds steps 5 and 7 on its own; the others it cannot see, which is why they have checks.
