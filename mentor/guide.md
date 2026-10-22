# Mentor guide

For the people supporting juniors through the bootcamp. Juniors never get this folder.

## How the bootcamp runs

- **Self-paced, two days.** Day 1 is JavaScript (morning) and TypeScript (afternoon). Day 2 is React, then the final project.
- Each module is: a lesson deck (`yarn lessons`), a short README, and an exercise ladder checked by `yarn verify <module>`.
- **Core** steps fit the two days. **Stretch** steps are optional and never block the next module.
- A junior is done when every core step passes and `yarn verify final-project` is green.

## Your daily routine

1. Morning: check each junior ran `yarn verify 00-setup` green on day 1.
2. A few times a day: ask them to run `yarn progress` and share the output. It shows every module, which steps pass, and the next step.
3. If someone is more than 30 minutes behind the time guide on one module, sit with them.

## Unblocking without giving the answer

- Ask them to read the failing step's hint out loud, then show you the slide it points to.
- Ask what they expected to happen, then have them `console.log` (or set a `debugger;` breakpoint) at the line where it differs.
- For type errors, have them hover the red underline in VS Code and read the type TypeScript inferred.
- Worked solutions are in `solutions/`, mirroring the bootcamp paths. Use them to check your own reasoning; avoid handing them over, except in the case below.

## If a junior did not finish Phase 2

The final project imports the junior's own Phase 2 ticket logic. If their Phase 2 project is not green by the start of day 2, give them `solutions/02-ts/project/src` to copy into `02-ts/project/src`, so they can do the React work on time.

## Known sticking points

Filled in per module as the material is written.

| Module | Where juniors get stuck | What to ask |
| --- | --- | --- |
| 00-setup | `.npmrc` missing or with the wrong registry; `yarn install` hangs or 404s | "Open your `.npmrc`. Which address does `registry=` point at?" |
| 00-setup | `python` not found on Windows | "Try `py server/server.py`." |
| 01-js/03 | `once` returns `undefined` on the second call | "Where is the first result stored between calls?" |
| 01-js/03 | `memoize` calls `fn` again for a cached `undefined` | "How do you tell 'no entry' from 'an entry whose value is undefined'?" |
| 02-ts/07 | `Status` comes out as `string` | "Hover `STATUSES`. What type does TypeScript give it? What does `as const` change?" |
| 03-react/04 | `useDebouncedValue` updates on every key press | "What does your effect's cleanup do when the value changes again?" |

## The final project's planted problems

Never point to these directly; each check names the symptom.

| # | Kind | File | Symptom | How to unblock |
| --- | --- | --- | --- | --- |
| 1 | Rules of React | `src/pages/TicketListPage` | Sorting reorders the React Query cache | "Which array methods change the array they are called on?" |
| 2 | Performance | `src/pages/TicketListPage` | Rows rebuilt on every key press | "What should the filter depend on: what is typed, or what was typed 300 ms ago?" |
| 3 | Lint (Rules of Hooks) | `src/pages/TicketListPage` | `exhaustive-deps` error on the title effect | "What does the effect read? Is it in the dependency array?" |

The full project adds five more Rules of React bugs and two more performance problems; this table grows with them.
