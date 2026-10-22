# JS / TS / React Bootcamp: Build Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the `bootcamp/` and `mentor/` folders described in the spec: lessons, self-checking exercise ladders, three phase projects, the final project, the Python API, and the tooling that checks and tracks a junior's progress.

**Architecture:** One root `package.json` inside `bootcamp/`. All checks are Vitest files kept in `bootcamp/scripts/checks/`, run through a small Node CLI that prints pass / fail plus a hint per step. Every exercise has a worked solution in `mentor/solutions/` mirroring the `bootcamp/` paths; an authoring tool at the repo root (`tools/verify.mjs`, not shipped) proves that every solution passes and every starter fails. The final project is built correct-first in TypeScript, then degraded into the buggy JS starter. Lessons are interactive HTML slide decks (React + TS, one shared design system) served offline by `yarn lessons`; exercise instructions stay in Markdown next to the code.

**Tech Stack:** Node 24, Yarn 1.22, TypeScript 5.9, Vite 5 (matches the team's apps) with @vitejs/plugin-react 4, Vitest 3 pinned to resolve against Vite 5 (+ jsdom, Testing Library), React 18.3, antd 5, axios, @tanstack/react-query 5, react-router-dom 6, ESLint 9 (flat config, typescript-eslint, eslint-plugin-react-hooks), Prettier 3, prism-react-renderer (code highlighting in slides), @fontsource fonts (bundled, no CDN). Python 3 standard library for the API.

**Spec:** `docs/superpowers/specs/2026-10-22-bootcamp-design.md`

## Global Constraints

- Juniors run Windows (PowerShell / cmd). Every script is a Node script; no bash, no `rm -rf`, no `&&` chains in `package.json` scripts that break in cmd.
- Closed network. No `http(s)://` links in any file under `bootcamp/` except `localhost`. React docs are referenced as "search the React docs for …".
- Lessons are HTML slide decks, one per module, built on a shared lesson kit and served by `yarn lessons` (Vite, fully offline: no CDN fonts, scripts or images). Exercise instructions, project Definitions of Done, `START-HERE.md` and the mentor guide are Markdown readable in VS Code's built-in preview.
- No registry config shipped. `yarn.lock` is shipped (Yarn 1 rewrites the default registry host to the one in the junior's `.npmrc`).
- Few, mainstream dependencies only; nothing that downloads binaries on install (so no Playwright, no Cypress, no CRA / `react-scripts`).
- Python API: standard library only, one command (`python server/server.py`), port `8000`.
- Juniors never write tests. Every exercise step is marked **core** or **stretch**; stretch never blocks anything.
- Each project `README.md` opens with its Definition of Done, copied from spec section 7 as a checklist.
- Out of scope (do not teach or use): class components, Redux, Next.js, server components, React DevTools, optimistic updates, `this` binding, generators, writing tests, HTML/CSS basics, deployment.

## A spec change this plan needs: `yarn check` is a Yarn 1 built-in

In Yarn 1.22, `yarn check` runs Yarn's own dependency checker and **ignores a `check` script** (verified: it prints "success Folder in sync."). Juniors would type the spec's command and get a confusing false success. This plan uses **`yarn verify <path>`** instead (`verify` is not a Yarn built-in) and this PR already updates the spec wording. `yarn progress` and `yarn tickets` are unaffected. Nahar is asked to confirm this in the thread.

## Review Focus

1. **Python server not running.** Any check that needs the API must say "start the server with `python server/server.py`" rather than fail with `ECONNREFUSED`. Checks therefore never call the real server: they use an in-test fixture server (Task 2), and `yarn tickets` / `yarn dev` print the start-the-server hint on connection errors.
2. **Windows paths and line endings.** `yarn verify 01-js\03` (backslash) and `yarn verify 01-js/03/` must both work; checks must not compare strings containing CRLF. Covered by runner tests in Task 2 and the Windows CI job in Task 2.
3. **Junior renames or moves files during migration.** `.js` → `.ts` / `.tsx` must keep checks working. Checks import without extensions (`../../02-ts/project/src/filters`), and Task 2's resolver tests both extensions.
4. **Starter that already passes.** A check that passes on the untouched starter teaches nothing. `tools/verify.mjs` fails the build if any core step passes on its starter.
5. **Junior who did not finish Phase 2 reaches the final project.** The final UI imports their Phase 2 logic. The mentor guide documents handing over `mentor/solutions/02-ts/project/src`, and the final-project README says what to ask a mentor for.

---

## Repo layout (decided here, used by every task)

```
tools/verify.mjs                  authoring only, not shipped
.github/workflows/verify.yml      authoring only: runs tools/verify.mjs on windows-latest + ubuntu-latest
.gitattributes                    * text=auto eol=lf ; *.svg text eol=lf
bootcamp/
  START-HERE.md
  package.json  yarn.lock  tsconfig.json  eslint.config.js  .prettierrc  vitest.config.ts  .gitignore
  lessons/         the lesson kit: index.html (deck list), kit/{Deck,Slide,layouts,tokens.css}, widgets/*
  00-setup/README.md  00-setup/lesson.tsx  00-setup/python-to-js.md
  01-js/01-values-references/   lesson.tsx  README.md  exercises.js
  01-js/02-array-object-methods/ …  03-scope-closures/  04-async/  05-modules/
  01-js/project/   README.md  src/{constants,api,filters,stats,validation,index}.js
  02-ts/01-why-ts/ … 08-migration/   lesson.tsx  README.md  exercises.ts
  02-ts/project/   README.md  (src/ is created by `yarn copy-project`)
  03-react/01-fundamentals/ … 09-versions/   lesson.tsx  README.md  exercises/*.tsx  main.tsx  index.html
  final-project/   README.md  index.html  vite.config.ts  .env  src/**  (JS + JSX, buggy)
  server/server.py  server/seed.json  server/README.md
  scripts/
    verify.mjs  progress.mjs  tickets.mjs  dev.mjs  lessons.mjs  copy-project.mjs
    lib/{resolve-target,reporter,step,load,progress-store}.mjs
    catalog.json                       every module, its steps, core|stretch
    checks/01-js/01.check.ts …  checks/02-ts/… checks/03-react/… checks/final/*.check.tsx
    fixtures/{tickets,assignees}.json  fixtures/fixture-server.ts
mentor/
  guide.md
  solutions/   mirrors bootcamp/ paths (01-js/03-scope-closures/exercises.js, final-project/src/**, …)
```

Exercise ids: the folder number. `yarn verify 01-js/03` resolves to `01-js/03-scope-closures`; `yarn verify 01-js/03/4` runs only step 4; `yarn verify 01-js/project`, `yarn verify final-project`.

## Domain model (decided here, used from Phase 1 to the final project)

- `STATUSES = ['open', 'assigned', 'blocked', 'closed']`, `PRIORITIES = ['low', 'medium', 'high', 'urgent']` (priority order is array order).
- Ticket fields: `id: string`, `title`, `description`, `priority`, `status`, `createdAt` (ISO datetime), `dueDate` (ISO date or `null`). Status-specific: `assigned` and `blocked` have `assignee` (assignee id); `blocked` has `blockedReason`; `closed` has `closedAt` and optional `assignee`; `open` has neither.
- Assignee: `{ id: string, name: string }`.
- "Open" in stats means `status !== 'closed'`. "Overdue" means not closed and `dueDate` before `now`'s date. Age is `now - createdAt` in whole days.
- API (`server/server.py`): `GET /api/tickets`, `GET /api/tickets/:id`, `POST /api/tickets`, `PUT /api/tickets/:id`, `GET /api/assignees`. In-memory, reset from `seed.json` on restart. Flags: `--delay MS` (slow responses for loading states), `--fail tickets|assignees` (500 on that route, for `allSettled` and error states), `--bad-data` (adds one malformed ticket, for the Phase 2 type guard), `--many N` (generates N tickets, for the performance work). Seed: about 40 tickets, 6 assignees, every status and priority, some overdue. 400 with `{ "errors": [{ "field", "message" }] }` on invalid POST / PUT.

### Phase 1 / 2 project exports (the final UI depends on these names)

```
constants:  STATUSES, PRIORITIES
api:        createClient(baseURL) -> AxiosInstance
            fetchTickets(client) -> Promise<Ticket[]>
            fetchAssignees(client) -> Promise<Assignee[]>
            loadAll(client) -> Promise<{ tickets: Ticket[], assignees: Assignee[], warnings: string[] }>   // allSettled
filters:    filterTickets(tickets, { status?, priority?, assignee?, search? }) -> Ticket[]
            sortTickets(tickets, { by: 'createdAt' | 'priority' | 'title', direction: 'asc' | 'desc' }) -> Ticket[]
stats:      groupByStatus(tickets) -> Record<Status, Ticket[]>   // every status key present
            computeStats(tickets, now = new Date()) -> { total, open, overdue, averageAgeDays }
validation: validateTicket(draft, now = new Date()) -> { valid: boolean, errors: { field, message }[] }
            isTicket(value: unknown): value is Ticket          // Phase 2 only
index:      re-exports all of the above
```

Phase 1 ships `constants.js` and `index.js` filled in, and the other four files as stubs that throw `new Error('TODO: …')`. `yarn copy-project` copies `01-js/project/src` to `02-ts/project/src` (refuses to overwrite). Phase 2 TS files import with `.ts` extensions (`allowImportingTsExtensions`, `erasableSyntaxOnly`, `verbatimModuleSyntax`) so Node 24 runs them directly by type stripping, which the "Why TS and how it runs" lesson uses as its demo. `yarn tickets` runs the TS version if `02-ts/project/src/index.ts` exists, otherwise the JS one, and says which.

## Module template (every lesson module follows it)

- `lesson.tsx`: the slide deck. Time guide on the title slide, "Coming from Python" comparison slides, the mental-model walkthrough as step-through widgets (for Phase 1, Will Sentance style: click through execution context, call stack, memory, the closure backpack, the event loop), worked examples with "predict the output, then reveal" slides, and a closing slide that points to the exercises.
- `README.md`: short. Time guide, "open the lesson with `yarn lessons`, deck <id>", a one-paragraph recap to refer back to while coding, then the ladder: a numbered list, each step marked **core** or **stretch**, with the task and the command `yarn verify <id>/<n>`.
- Starter (`exercises.js` / `.ts` / `exercises/*.tsx`): one export per step, stubbed to throw `TODO`.
- Check (`scripts/checks/<phase>/<nn>.check.ts[x]`): one `step()` per ladder step, with a hint that points back to the lesson slide or README section, never the answer.
- Solution in `mentor/solutions/<same path>`.
- Ladder: 6 to 10 steps, harder each step, the last core step touches the ticket domain so it feeds the phase project.
- Phase 3 modules add `main.tsx` + `index.html`, so `yarn dev 03-react/03` shows the exercises in the browser.

---

### Task 1: Scaffold, configs, spec wording fix

**Files:** Create `.gitattributes`, `bootcamp/{package.json,tsconfig.json,eslint.config.js,.prettierrc,.gitignore,vitest.config.ts}`, `mentor/guide.md` (skeleton).

- [ ] `package.json` scripts: `verify`, `progress`, `tickets`, `dev`, `copy-project`, `server` (prints the Python command; Yarn cannot assume `python` vs `py` on Windows). Pin exact dependency versions from the Tech Stack.
- [ ] `tsconfig.json`: `strict`, `noEmit`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `jsx: react-jsx`, `moduleResolution: bundler`. Phase-local `tsconfig.json` files extend it (Phase 2 migration lesson starts one at `allowJs` / `checkJs` / non-strict).
- [ ] `eslint.config.js`: typescript-eslint recommended, react-hooks `recommended` (both rules as errors), `@typescript-eslint/no-explicit-any` error, `--no-inline-config` used by the final check.
- [ ] `yarn install` succeeds; `yarn tsc -v`, `yarn eslint -v` work. Commit `yarn.lock`.
- [ ] Commit.

### Task 2: Check runner, progress, fixtures, verify tool

**Files:** `bootcamp/scripts/{verify,progress,dev,tickets,copy-project}.mjs`, `scripts/lib/*`, `scripts/catalog.json`, `scripts/fixtures/*`, `tools/verify.mjs`, `.github/workflows/verify.yml`, plus one sample exercise used to prove the pipeline (becomes `01-js/01` in Task 5).

**Interfaces (produces):**
- `step({ n, level: 'core' | 'stretch', title, hint }, fn)` in `scripts/lib/step.mjs`; wraps Vitest `test` and stores `n`, `level`, `hint` in `task.meta`.
- `load(relPath)` in `scripts/lib/load.mjs`: imports a junior file from `bootcamp/` (or from `$BOOTCAMP_SOLUTIONS` when set), trying `.ts`, `.tsx`, `.js`, `.jsx` when no extension is given.
- `startFixtureServer(): Promise<{ baseURL, close }>` serving `fixtures/*.json` with the real API's routes and the `--fail` / `--bad-data` behaviour toggled per test.
- Reporter output: one line per step, `PASS 3 core  Closures keep their backpack` / `FAIL 4 core  …` then `Hint: …`, then a summary. Exit code 1 if any core step failed.
- `scripts/.progress.json` (gitignored): `{ "<module id>": { "<step n>": "pass" | "fail" } }`, written by every `yarn verify` run. `yarn progress` prints all modules from `catalog.json` with ✓ / ✗ / · per step, core and stretch counts, and the next core step to do.

- [ ] Runner tests (authoring-side, under `tools/tests/`): target resolution for `01-js/03`, `01-js\03`, `01-js/03/`, `01-js/03/4`, `final-project`, unknown id (prints the list of valid ids); `load()` finds `.ts` after a `.js` file was renamed; catalog and check files agree (every `step` n exists in `catalog.json` and vice versa).
- [ ] `tools/verify.mjs`: runs every check with `BOOTCAMP_SOLUTIONS=mentor/solutions` (must be all green), then against starters (every core step must fail), then scans `bootcamp/**/*.md` and `**/lesson.tsx` for non-localhost `http` links and for relative links / images that do not resolve. Prints a table and exits non-zero on any problem.
- [ ] `yarn dev <id>`: starts Vite via its JS API with the exercise folder as root, React plugin, and `/api` proxied to `http://localhost:8000`; on proxy `ECONNREFUSED` prints the start-the-server hint. `final-project` uses its own `vite.config.ts`.
- [ ] GitHub Actions workflow runs `tools/verify.mjs` on `windows-latest` and `ubuntu-latest` with Node 24 and Python 3. (Authoring only; outside both ZIP folders.)
- [ ] Commit.

### Task 3: Python API and Phase 0 setup

**Files:** `bootcamp/server/{server.py,seed.json,README.md}`, `bootcamp/00-setup/{README.md,python-to-js.md}`, `scripts/fixtures/*.json` (generated from `seed.json`), `tools/tests/test_server.py` (stdlib `unittest`).

- [ ] Server tests: each route, 404 on unknown id, 400 with the per-field `errors` list on an invalid POST, each flag (`--delay`, `--fail`, `--bad-data`, `--many 2000`), CORS not needed (Vite proxies). Runs with `python -m unittest`.
- [ ] Implement `server.py` with `http.server.ThreadingHTTPServer`; prints `Ticket API on http://localhost:8000` on start.
- [ ] Setup lesson deck is written in Task 4; the setup README covers: add `.npmrc` (what to put in it, explained in words, no URL), `yarn install`, `yarn verify 00-setup` (a smoke check: Node 24, Yarn 1, deps installed, server reachable), starting the server, and points to the deck for how the Vite dev server and proxy work. Also: ESLint and Prettier in VS Code (format on save, reading a hooks-rule error), and browser DevTools basics (Console, Sources breakpoints, Network tab watching the proxied `/api` calls). `python-to-js.md`: one page, side-by-side table.
- [ ] Commit.

### Task 4: Lesson kit (slide engine, design system, widgets)

**Files:** `bootcamp/lessons/**`, `bootcamp/scripts/lessons.mjs`, `00-setup/lesson.tsx` (first real deck, proves the kit).

**Interfaces (produces):**
- `<Deck title timeGuide>` / `<Slide layout>` with layouts `title`, `concept`, `code`, `compare` (Python left, JS / TS right), `diagram`, `predict` (question, then reveal), `recap`.
- Navigation: arrow keys and click, `#/n` in the URL per slide, in-slide build steps, progress bar, `?` shows keyboard help.
- `<Code lang highlight={[lines]}>` (prism-react-renderer, line focus per build step) and `<RunCode>` (runs a JS snippet in the page and shows its console output; JS phase only).
- Walkthrough widgets driven by a list of steps: `<CallStackStepper>`, `<MemoryDiagram>` (stack / heap, references as arrows), `<ClosureBackpack>`, `<EventLoop>` (call stack, task queue, microtask queue), `<RenderTimeline>` (renders, commits, effects for Phase 3).
- `tokens.css`: one design system (colour, type scale, spacing, code theme), light and dark, readable on a projector. Fonts from `@fontsource`.
- `yarn lessons`: serves `lessons/index.html` plus every `**/lesson.tsx` with Vite, prints `Lessons on http://localhost:5174`; the index lists decks in course order with their time guides.

- [ ] Kit tests (Vitest + Testing Library): keyboard navigation and URL hash, build steps advance before slides, each widget renders its step N state from a step list.
- [ ] Authoring screenshot pass (`tools/screenshot-decks.mjs`, uses the pre-installed Chromium through Playwright in `tools/` only, never in `bootcamp/package.json`): every slide of every deck at 1280×720 in light and dark, reviewed for overflow and contrast.
- [ ] `tools/verify.mjs` also builds every deck (`vite build`) and fails on any non-local URL in deck source.
- [ ] Commit; open the **Foundation PR** (Tasks 1 to 4).

### Tasks 5 to 9: Phase 1 modules (one task each)

01 values and references, 02 array and object methods, 03 scope and closures, 04 async, 05 modules. Each follows the module template. Module 04's ladder uses `startFixtureServer()` and ends with axios against it; it also has a `setTimeout` / Promise ordering step ("predict the log order") checked by capturing output. Module 05 covers ESM vs Python packages and ends with splitting a file into modules.

- [ ] Per module: lesson deck, README, starter, check, solution; `node tools/verify.mjs` green for that module; commit.

### Task 10: Phase 1 project

**Files:** `01-js/project/{README.md,src/*}`, `scripts/checks/01-js/project.check.ts`, `scripts/tickets.mjs`, `mentor/solutions/01-js/project/src/*`.

- [ ] Check steps map one-to-one to the Phase 1 Definition of Done: loading with server down returns a warning rather than throwing; each filter and combined filters; each sort in both directions plus "input array unchanged" (deep-frozen input); `groupByStatus` includes empty groups; `computeStats` with a fixed `now`; `validateTicket` returns all three errors at once; `loadAll` with `--fail assignees` still returns tickets plus a warning; no `console.` in `src/` (static scan); no mutation of inputs (frozen fixtures across all functions).
- [ ] `yarn tickets`: prints table, groups, stats, a validation demo, and the allSettled demo; on `ECONNREFUSED` prints the start-the-server hint.
- [ ] Commit; open the **Phase 1 PR** (Tasks 5 to 10).

### Tasks 11 to 18: Phase 2 modules (one task each)

01 why TS and how it runs (type stripping demo with `node file.ts`, `tsc --noEmit`, mypy comparison), 02 basics, 03 unions and narrowing, 04 type guards (validating `unknown` API data), 05 discriminated unions (ticket states, `never` check), 06 generics and utility types, 07 deriving types from values, 08 migration workflow (works on a small provided JS file, raising strictness in steps).

- [ ] Type-level steps are checked by running `tsc --noEmit` on the module plus a check-owned `.types.ts` file using `@ts-expect-error` and an `Expect<Equal<A, B>>` helper; runtime steps use Vitest as in Phase 1. The runner reports which step a type error belongs to by mapping the error's line to the step's marked region in the starter.
- [ ] Per module: lesson deck, README, starter, check, solution, verify green, commit.

### Task 19: Phase 2 project

- [ ] `yarn copy-project`; README with the Phase 2 Definition of Done and a suggested migration order (constants → validation/`isTicket` → filters → stats → api).
- [ ] Check steps: no `.js` left in `02-ts/project/src`; `tsc --noEmit` strict clean; static scan for `any`, `@ts-ignore`, `@ts-expect-error`, non-null `!`; `Status` / `Priority` types equal `(typeof STATUSES)[number]` etc. (type test); the `Ticket` union rejects `closedAt` on an open ticket and requires `assignee` on assigned (type tests); removing a status from a `switch` fails compilation (the check compiles a mutated copy); `fetchTickets` with `--bad-data` reports the malformed ticket in `warnings` and excludes it; all Phase 1 behaviour checks re-run against the TS code.
- [ ] Commit; open the **Phase 2 PR** (Tasks 11 to 19).

### Task 20: Final project, correct reference app (TypeScript)

Built before the Phase 3 lessons, so the lessons teach exactly what the app uses.

**Files:** `mentor/solutions/final-project/**`.
- `src/main.tsx` (`createRoot`, `QueryClientProvider`, `ConfigProvider` with a token theme, `BrowserRouter`), `src/App.tsx` (routes `/tickets`, `/tickets/new`, `/tickets/:id`, `*` → `/tickets`).
- `src/api/tickets.ts`: `ticketsQuery`, `useTickets()`, `useTicket(id)`, `useAssignees()`, `useSaveTicket()` (invalidates `['tickets']`); uses `@tickets/logic` (Vite and tsconfig alias to `02-ts/project/src/index.ts`) for `fetchTickets` / `isTicket`.
- `src/hooks/useDebouncedValue.ts`: `useDebouncedValue<T>(value: T, delayMs = 300): T`.
- `src/pages/TicketListPage.tsx`, `src/pages/TicketFormPage.tsx`, `src/components/{TicketTable,TicketFilters,StatsPanel,TicketForm}.tsx`.
- URL state: `?assignee=<id>` via `useSearchParams`.
- [ ] Runs against the real server with `yarn dev final-project`; manual pass of every browser item in the final Definition of Done, including `--delay 1500`, `--fail tickets` and `--many 2000`.
- [ ] Commit.

### Task 21: Final project, buggy JS starter and its checks

**Files:** `bootcamp/final-project/**` (`.js` / `.jsx`, same file names), `scripts/checks/final/*.check.tsx`, `mentor/guide.md` (final-project section).

Planted Rules of React bugs (each with its own check, run in jsdom with the API module mocked through `vi.mock('…/src/api/tickets')` and antd components counted through a partial `vi.mock('antd')`):

1. Sorting with `tickets.sort()` on React Query data (mutates the cache). Check: the query data's order is unchanged after sorting.
2. `useTicket` called after an early `return` in `TicketFormPage`. Check: navigating `/tickets/new` → `/tickets/t1` renders without the "rendered more hooks" error.
3. `keydown` listener (`/` focuses search) added in an effect without cleanup. Check: add and remove listener counts match after unmount.
4. Form pre-fill effect with `[]` deps. Check: navigating `/tickets/t1` → `/tickets/t2` shows t2's title.
5. Filtered rows held in state and synced by an effect ("you might not need an effect"). Check: no committed render shows rows that do not match the current filters.
6. Filters object mutated then passed to `setFilters`. Check: choosing a status filter updates the table.

Planted performance problems:

1. Filtering and sorting recomputed on every render, over `--many 2000` data. Check: `filterTickets` / `sortTickets` call counts while typing 5 characters stay at or under 2.
2. Search text drives the table directly with no debounce. Check: antd `Table` render count while typing 5 characters stays at or under 2, and `useDebouncedValue` is imported from `src/hooks/useDebouncedValue` (static).
3. `StatsPanel` is wrapped in `memo` but receives an inline object and arrow function. Check: `StatsPanel`'s antd `Statistic` render count does not grow while typing.

Feature check: rendering `/tickets?assignee=a2` shows only a2's tickets; picking an assignee updates `location.search`; the assignee select is pre-set from the URL.

Global checks: no `.js` / `.jsx` under `final-project/src`; `tsc --noEmit -p final-project` strict clean; ESLint with `--no-inline-config` and `--max-warnings 0`.

- [ ] Derive the starter from Task 20 (convert to JS, remove `useDebouncedValue`, remove the assignee filter, plant the 9 problems). Each planted problem is marked in the mentor guide with file, symptom, and how to unblock, never in the starter.
- [ ] `tools/verify.mjs`: solution passes everything; starter fails each of the 9 problem checks and the feature check individually.
- [ ] Commit; open the **Final project PR** (Tasks 20 to 21).

### Tasks 22 to 30: Phase 3 modules (one task each)

01 fundamentals in TS, 02 Rules of React, 03 rendering dynamics, 04 custom hooks (ends by writing `useDebouncedValue`), 05 server data, 06 antd (Table, Form, theming, telling versions apart), 07 performance (Performance tab walkthrough, render counts), 08 routing, 09 version differences and tooling (React 16 / 18 / 19, CRA vs Vite, `yarn build` output, `VITE_` / `REACT_APP_` env variables and the dev proxy in each, taught by reading small code samples; no CRA install). Ladders use components in `exercises/*.tsx`, checked with Testing Library + `user-event`. Each module's lesson names which final-project bug or feature it prepares for, without giving the fix away. Stretch: `useReducer` in module 03.

- [ ] Per module: lesson deck, README, starter, check, solution, `main.tsx` playground, verify green, commit.
- [ ] Open the **Phase 3 PR** (Tasks 22 to 30).

### Task 31: START-HERE, mentor guide, time guides, dry run

- [ ] `START-HERE.md`: the path (Phase 0 → 1 → 2 → 3 → final), time guide per section summing to two days of core work, how `yarn lessons` / `yarn verify` / `yarn progress` work, how to ask for help, what "done" means (spec section 3).
- [ ] `mentor/guide.md`: per module, known sticking points and unblocking questions; the 9 planted problems; the Phase 2 hand-over fallback; how to read `yarn progress` output.
- [ ] Dry run: a fresh agent, given only `bootcamp/` and the instructions in `START-HERE.md`, works the core path from a clean `yarn install` and logs every place it got stuck, guessed, or found the time guide wrong. Fix what it finds.
- [ ] `tools/verify.mjs` green on both CI runners. Open the **Polish PR**.

## Delivery

Six PRs into `main`, each reviewable on its own: Foundation, Phase 1, Phase 2, Final project, Phase 3, Polish. Each PR description lists what to try by hand (for example `yarn verify 01-js/03` on the starter and on the solution). Nahar zips `bootcamp/` and `mentor/` from `main` when the Polish PR merges.
