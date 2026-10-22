# JS / TS / React Bootcamp: Design Spec

Status: draft for review · Date: 2026-10-22 · Owner: Nahar

## 1. Purpose

A 2-day, self-paced bootcamp that gets junior developers to the point where they can pick up frontend tickets in the team's apps without hand-holding on the basics: work in existing JavaScript code, migrate files to TypeScript, and follow the Rules of React.

It exists because the team is actively migrating its (mostly JavaScript) React apps to TypeScript.

## 2. Audience

- Junior developers who know **Python**, the terminal, and backend basics.
- Limited tooling knowledge. No frontend web development knowledge.
- Day-to-day work will mix Python backend tasks with frontend tasks in React apps.
- The backend stays Python. JS/TS is only taught for the frontend.

### Their environment

| Item | Value |
| --- | --- |
| OS | Windows (PowerShell / cmd) |
| Node | 24 (already installed) |
| Package manager | Yarn 1.22 (already installed) |
| Python | Python 3 (already installed; standard library only is assumed) |
| Network | Closed network. No internet, except some React docs pages. Dependencies come from an internal Artifactory. |
| Delivery | The repo is handed over as ZIP files |

## 3. Success criteria ("done")

A junior is done when they have:

1. Passed every **core** exercise (`yarn check` green).
2. Finished the **final project**: migrated the provided ticket UI to TypeScript, fixed the planted bugs and performance problems, and added the new feature, with the final-project check green.

**Stretch** exercises are optional and never block the next step.

## 4. Scope

### In scope

- **JavaScript:** values and references, object and array methods, scope and closures, async, modules. Taught by comparison with Python.
- **TypeScript:** narrowing, type guards, discriminated unions, deriving types from values (`as const`, `typeof`, `keyof`, indexed access, `satisfies`) and the groundwork they need, plus a JS to TS migration workflow.
- **React:** Rules of React, rendering dynamics, custom hooks, server data with axios + React Query, routing, performance basics.
- **Ant Design (antd):** Table, Form, theming, and version differences (v3, v4, v5).
- **Tooling:** Yarn, Vite and CRA (dev server, builds, env variables, API proxy), ESLint and Prettier (including the React Hooks rules), browser DevTools (debugging, Network tab, Performance tab), `tsconfig` and `tsc`.
- **Version awareness:** React 16 / 18 / 19 and CRA vs Vite, because the team's apps mix them.

### Out of scope

- Writing tests (juniors never write tests; the exercises check themselves).
- Bare HTML and CSS fundamentals.
- Class components (the team's apps have none).
- Redux, Next.js, server components.
- React DevTools.
- Optimistic updates.
- `this` binding, generators.
- Deployment, CI/CD, Docker.

## 5. Teaching approach

Modelled on two courses the owner rates highly:

- **Will Sentance, "JavaScript: The Hard Parts":** build the mental model first (walk through how the code actually runs: execution context, call stack, the closure "backpack", the event loop) before syntax. Then a ladder of bite-size exercises that get harder step by step.
- **Maximilian Schwarzmüller (Udemy):** clear, thorough explanations, and a project at the end of each phase that ties the phase together.

So every phase is: **lessons → exercise ladder → phase project**.

Practice beats reading. The content deliberately exceeds 2 days. Every exercise is marked **core** (fits the 2 days) or **stretch** (extra practice, or to come back to later). Time guides are given per section, not as hard limits.

## 6. The practice app: support-ticket tracker

One app grows across all three phases (the "hybrid" approach):

| Phase | What the junior does with the app |
| --- | --- |
| 1. JavaScript | Writes the ticket logic in plain JS: load tickets from the API, filter, sort, group by status, compute stats, validate a new ticket. |
| 2. TypeScript | Migrates their own Phase 1 code to strict TS. |
| 3. React | Receives a provided JS React + antd UI built on that logic, with planted bugs. Migrates it to TS, fixes it, extends it. |

The domain was chosen because it naturally needs an antd **data table** (sort, filter, paginate) and an antd **form** (create and edit), and because ticket status and priority are natural examples for discriminated unions and `as const`.

The **Python API** is provided and ready-made. Juniors only call it from the frontend. It is written with the Python standard library only, so it needs no `pip install` and runs on any Python 3 with one command.

## 7. Curriculum

### Phase 0: Setup (about 30 min)

- Juniors add their own `.npmrc` (pointing at Artifactory) and run `yarn install` themselves. The repo ships no registry config.
- `yarn check` as a smoke test.
- Start the Python server.
- How a Vite dev server works and how it proxies API calls to the Python backend.
- One-page "Python to JS" cheat sheet.

### Phase 1: JavaScript (day 1 morning, about 4 to 5 h core)

Each module: a mental-model walkthrough, then a 6 to 10 step exercise ladder.

1. **Values and references:** primitives vs objects, mutation vs copying, spread, destructuring, `===`. Compared with Python lists and dicts.
2. **Array and object methods:** `map`, `filter`, `reduce`, `find`, `some` / `every`, `sort` (and its in-place trap), `Object.entries` / `fromEntries`, chaining.
3. **Scope and closures:** execution context, the call stack, `let` / `const` vs `var`, functions returning functions, the closure "backpack", patterns like memoize and once.
4. **Async:** the event loop, callbacks, Promises, `async` / `await`, `Promise.all`, `Promise.allSettled`, error handling, calling the real API with axios.
5. **Modules:** `import` / `export`, and how JS modules differ from Python packages.

**Phase project:** the plain-JS ticket logic (see section 6). There is no UI yet; a small demo script, `yarn tickets`, runs the logic against the live API and prints the results, so the work is visible.

**Definition of Done (Phase 1 project):**

Running `yarn tickets` lets the user:

- [ ] See all tickets loaded from the Python API, with a clear error message (not a crash) if the server is down.
- [ ] Filter tickets by status, priority, assignee, and a free-text search on the title.
- [ ] Sort tickets by created date, priority, or title, ascending or descending, without mutating the original list.
- [ ] See tickets grouped by status, with a count per group.
- [ ] See summary stats: total, open, overdue, and average age in days.
- [ ] Validate a new ticket and get a list of every field error (missing title, unknown priority, due date in the past), not just the first one.
- [ ] Load tickets and assignees in parallel; if one request fails, still see the other with a warning (`Promise.allSettled`).

Technical:

- [ ] `yarn check 01-js/project` passes.
- [ ] Logic is split into ES modules (`api`, `filters`, `stats`, `validation`) with no UI or `console.log` inside them.
- [ ] No input array or object is mutated.

**Stretch:** arrow functions in depth, debounce, harder `reduce` challenges.

### Phase 2: TypeScript (day 1 afternoon, about 4 to 5 h core)

1. **Why TS and how it runs:** types are erased at build time, `tsc` vs Vite. Compared with Python type hints and mypy.
2. **Basics:** annotations, inference, object types, `type` vs `interface`, optional and readonly fields, typing functions.
3. **Unions and literal types, then narrowing:** `typeof`, `in`, `instanceof`, truthiness, equality.
4. **Type guards:** user-defined `x is T` guards, assertion functions, validating API data that arrives as `unknown`.
5. **Discriminated unions:** modelling ticket states, exhaustive `switch` with a `never` check.
6. **Generics basics and utility types:** `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`.
7. **Deriving types from values:** `as const`, `typeof`, `keyof`, indexed access (`T[K]`, `(typeof arr)[number]`), `satisfies`. Example: ticket statuses defined once as a const array produce both the type and the dropdown options.
8. **Migration workflow:** renaming `.js` to `.ts`, `allowJs` and `checkJs`, raising strictness step by step, eliminating `any`, typing axios responses.

**Phase project:** migrate their own Phase 1 ticket logic to strict TS, with zero `any` and zero `tsc` errors.

**Definition of Done (Phase 2 project):**

For the user, `yarn tickets` behaves exactly as before. Nothing visible changes; the code is now safe to build on.

Technical:

- [ ] Every Phase 1 file is `.ts`, and `tsc --noEmit` passes with `strict: true`.
- [ ] No `any`, no `@ts-ignore`, no non-null `!` assertions.
- [ ] Ticket statuses and priorities are defined once as `as const` arrays, and their types are derived from them.
- [ ] A ticket is a discriminated union on `status` (for example, only a `closed` ticket has `closedAt`, only an `assigned` ticket has `assignee`).
- [ ] Every `switch` on status is exhaustive, enforced by a `never` check.
- [ ] API responses arrive as `unknown` and pass through a type guard before use; a malformed ticket is reported, not trusted.
- [ ] `yarn check 02-ts/project` passes.

**Stretch:** template literal types, mapped types, generic constraints with `extends`.

### Phase 3: React + antd (day 2, about 6 to 7 h core)

**App stack:** Vite, React 18, antd 5, axios, React Query, React Router. This is the middle of the team's version range; differences are covered in module 9.

1. **React fundamentals in TS:** JSX, components, typed props, state, events, lists and keys, conditional rendering, controlled inputs.
2. **Rules of React:** pure render, Rules of Hooks, never mutate state, the ESLint hooks rules.
3. **Rendering dynamics:** what triggers a re-render, state as a snapshot, batching, keys resetting state, lifting state up, effects and cleanup, "you might not need an effect".
4. **Custom hooks:** extracting logic into hooks, including `useDebouncedValue` powering a debounced table search.
5. **Server data:** axios with React Query: queries, mutations, invalidation, loading and error states.
6. **antd:** a typed Table (columns, sorting, filtering, pagination); Form (rules, `Form.useForm`, editing); theming (v5 tokens and `ConfigProvider` vs Less in v3 / v4); how to tell which antd version a project uses.
7. **Performance basics:** `memo`, `useMemo`, `useCallback`, when not to use them, measuring with the browser Performance tab and render counts.
8. **Routing:** React Router with a list page and a create / edit page.
9. **Version differences:** React 16 / 18 / 19 (`ReactDOM.render` vs `createRoot`, automatic batching), CRA vs Vite.

**Stretch:** `useReducer`.

### Final project (end of day 2)

The provided JS ticket UI (antd table + form) built on the junior's own logic. The junior:

1. Migrates it to TypeScript.
2. Fixes about 6 planted Rules of React bugs.
3. Fixes 3 planted performance problems.
4. Adds a feature: filter by assignee, kept in the URL.

**Definition of Done (final project):**

In the browser, the user can:

- [ ] Open the ticket list and see an antd Table of tickets from the Python API, with a loading state while it fetches and an error state with a retry button if the server is down.
- [ ] Sort the table by any column and page through results.
- [ ] Filter by status and priority, and type in a search box that only filters after they stop typing (debounced).
- [ ] Filter by assignee, and have that filter kept in the URL: refreshing the page or sharing the link keeps the same filter (the new feature).
- [ ] Click "New ticket" and fill in an antd Form that validates required fields and shows field errors inline.
- [ ] Click a ticket to edit it in the same form, pre-filled; saving updates the table without a manual refresh (React Query invalidation).
- [ ] Use the browser back and forward buttons between the list and the form pages.
- [ ] Type in the search box without the whole table visibly lagging (the planted performance problems are fixed).

Technical:

- [ ] Every file in the app is `.ts` or `.tsx`; `tsc --noEmit` passes with `strict: true` and no `any`.
- [ ] ESLint passes with the React Hooks rules turned on, with no disabled rules.
- [ ] All planted Rules of React bugs are fixed (each has its own check).
- [ ] All planted performance problems are fixed (each has its own check).
- [ ] The debounced search uses the `useDebouncedValue` custom hook.
- [ ] `yarn check final-project` passes.

## 8. Repo and delivery mechanics

### Two folders, two ZIPs

The repo holds two top-level folders. The owner zips each one and hands them out separately. There is no packaging script.

```
bootcamp/          → given to juniors
  START-HERE.md     path through the material, time guides, how to get help
  package.json      single root package; one `yarn install` covers everything
  00-setup/
  01-js/
  02-ts/
  03-react/
  final-project/
  server/           standard-library Python API
  scripts/          Node scripts behind `yarn check` and `yarn progress`
mentor/            → given to mentors only
  solutions/        worked solutions for every exercise and project
  guide.md          known sticking points and how to unblock someone
```

### Exercises

- Each exercise is a folder with a `README.md` (concept, walkthrough, task), a starter file, and a hidden check.
- Each project `README.md` opens with its Definition of Done (section 7): first what the user can do in the app, then the technical checks, as a checklist the junior ticks off.
- `yarn check 01-js/03` runs that exercise's check and prints pass or fail plus a hint.
- `yarn progress` prints a checklist of core and stretch exercises completed.
- Checks are written by the bootcamp author. Juniors never write tests.

### Final-project check

Runs `tsc --noEmit`, ESLint with the React Hooks rules, and one check per planted bug and the new feature.

### Offline and Windows constraints

- All explanations live in the repo. Lessons are Markdown read in VS Code's preview. Diagrams are embedded SVG images, so no extensions or internet are needed.
- No external links. Where the React docs help, lessons say what to search for in them (for example: search the React docs for "You Might Not Need an Effect").
- Dependencies are kept few and mainstream so they resolve through Artifactory.
- All scripts are Node scripts (no bash), so they run in PowerShell and cmd. The repo pins line endings with `.gitattributes`.
