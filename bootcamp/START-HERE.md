# Start here

This bootcamp gets you from Python to picking up frontend tickets in the team's React apps. You will read JavaScript, migrate it to TypeScript, and follow the Rules of React well enough to work without someone looking over your shoulder.

It is self-paced. You work through lessons and exercises on your own machine, and the exercises check themselves. A mentor is there when you get stuck.

## First: setup (about 30 minutes)

Follow [`00-setup/README.md`](00-setup/README.md). It gets the packages installed through Artifactory, starts the ticket API, and ends with `yarn verify 00-setup` all green. Its last step opens the lessons: watch **00-start**, "Making the most of this bootcamp", first. Come back here when you have.

## The path

Every phase has the same shape: **lessons, then an exercise ladder, then a project** that uses what the phase taught. You build one app the whole way: a support-ticket tracker. You write its logic in JavaScript, turn that same code into TypeScript, and then a React app runs on it.

| Order | Phase | What you do | Core time |
| --- | --- | --- | --- |
| 1 | [Phase 1: JavaScript](01-js/) | Modules 01 to 05, then the [Phase 1 project](01-js/project/README.md): the ticket logic in plain JavaScript | about 6 h |
| 2 | [Phase 2: TypeScript](02-ts/) | Modules 01 to 08, then the [Phase 2 project](02-ts/project/README.md): your Phase 1 code, migrated to strict TypeScript | about 6.5 h |
| 3 | [Phase 3: React and antd](03-react/) | Modules 01 to 09 | about 6.5 h |
| 4 | [Final project](final-project/README.md) | Migrate, fix and extend a ticket app built on your Phase 2 code | about 4.5 h |

Those times are for the **core** steps, as a guide, not a limit. Your mentor tells you how they map onto your calendar. Each module's README gives its own time. If you are behind, keep going with core and leave stretch for later. If you are ahead, do stretch steps.

Do the phases in order. Phase 2 starts from your Phase 1 project, and the final project imports your Phase 2 code.

### Phase 1: JavaScript

| Module | Topic |
| --- | --- |
| [01-js/01](01-js/01-values-references/README.md) | Values and references |
| [01-js/02](01-js/02-array-object-methods/README.md) | Array and object methods |
| [01-js/03](01-js/03-scope-closures/README.md) | Scope and closures |
| [01-js/04](01-js/04-async/README.md) | Async: promises, await, the event loop |
| [01-js/05](01-js/05-modules/README.md) | Modules |
| [01-js/project](01-js/project/README.md) | Phase 1 project |

### Phase 2: TypeScript

| Module | Topic |
| --- | --- |
| [02-ts/01](02-ts/01-why-ts/README.md) | Why TypeScript, and how it runs |
| [02-ts/02](02-ts/02-basics/README.md) | Basic types |
| [02-ts/03](02-ts/03-unions-narrowing/README.md) | Unions and narrowing |
| [02-ts/04](02-ts/04-type-guards/README.md) | Type guards |
| [02-ts/05](02-ts/05-discriminated-unions/README.md) | Discriminated unions |
| [02-ts/06](02-ts/06-generics-utility-types/README.md) | Generics and utility types |
| [02-ts/07](02-ts/07-deriving-types/README.md) | Deriving types from values |
| [02-ts/08](02-ts/08-migration/README.md) | Migrating JavaScript to TypeScript |
| [02-ts/project](02-ts/project/README.md) | Phase 2 project (start it with `yarn copy-project`) |

### Phase 3: React and antd

| Module | Topic |
| --- | --- |
| [03-react/01](03-react/01-fundamentals/README.md) | React fundamentals in TypeScript |
| [03-react/02](03-react/02-rules-of-react/README.md) | Rules of React |
| [03-react/03](03-react/03-rendering/README.md) | Rendering: snapshots, lifting state, keys, effects |
| [03-react/04](03-react/04-custom-hooks/README.md) | Custom hooks |
| [03-react/05](03-react/05-server-data/README.md) | Server data with React Query |
| [03-react/06](03-react/06-antd/README.md) | Ant Design: Table, Form, theming, versions |
| [03-react/07](03-react/07-performance/README.md) | Performance: memo, useMemo, useCallback |
| [03-react/08](03-react/08-routing/README.md) | Routing with React Router |
| [03-react/09](03-react/09-versions/README.md) | Versions and tooling: React 16 / 18 / 19, CRA and Vite |
| [final-project](final-project/README.md) | Final project |

## How a module works

1. **Watch the lesson.** Run `yarn lessons`, open the link, and pick the module. Press → to move, ? for all keys. Slides marked "Your turn" ask you to predict an answer before you see it: say yours out loud first.
2. **Read the module's README.** It has a short recap of the lesson and a table of the exercise steps.
3. **Do the exercises** in the module's starter file, one step at a time. Each step says what to build in a comment above it.
4. **Check them** with `yarn verify <module>`. A failing step tells you what is wrong and gives a hint.
5. Move on when every **core** step is green. **Stretch** steps are extra practice: come back to them when you have time.

## Commands

Run these in a terminal in this `bootcamp` folder. Keep the ticket API (`python server/server.py`) running in a second terminal.

| Command | What it does |
| --- | --- |
| `yarn lessons` | Opens the lesson slides in the browser. |
| `yarn verify 01-js/03` | Checks every step of one module. |
| `yarn verify 01-js/03/2` | Checks one step only. |
| `yarn progress` | Shows every module, which steps are green, and what to do next. |
| `yarn dev 03-react/05` | Opens a module's playground (React modules and the final project) in the browser. It reloads as you edit. |
| `yarn tickets` | Runs your Phase 1 or Phase 2 ticket logic against the API. |
| `yarn copy-project` | Starts Phase 2 by copying your Phase 1 project. |
| `yarn server` | Reminds you how to start the ticket API. |

## When you are stuck

1. Read the step's message and hint from `yarn verify` again, slowly. They describe what the user would see, not the fix.
2. Look at the lesson slide the hint points to, or the module README's recap.
3. Give it about 20 minutes on one step. If you are still stuck, ask your mentor. Bring the module and step number, the `yarn verify` output, and what you tried.

Being stuck is part of the work, and asking is not cheating. Do not copy a solution from another junior: the final project builds on your own code, so you would only move the problem.

## What "done" means

- Every core step of every module is green in `yarn progress`.
- The Phase 1 and Phase 2 projects meet their Definition of Done (the checklist at the top of each README).
- The final project meets its Definition of Done, and `yarn verify final-project` passes.
- You show your mentor the final app running, and walk them through one bug you fixed: what the user saw, why it happened, and which Rule of React it broke.

## Folders

| Folder | What is in it |
| --- | --- |
| `00-setup/` | Setup, and a one-page Python to JavaScript cheat sheet. |
| `01-js/`, `02-ts/`, `03-react/` | One folder per module: `README.md`, the starter file you edit, and `lesson.tsx` (the slides). |
| `final-project/` | The ticket app you migrate, fix and extend at the end. |
| `server/` | The Python ticket API. Standard library only; you never change it. |
| `lessons/` | The lesson app. You only open it through `yarn lessons`. |
| `scripts/`, `playground/` | The tools behind the `yarn` commands. You do not need to read them. |
