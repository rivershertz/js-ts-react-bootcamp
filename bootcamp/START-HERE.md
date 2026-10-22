# Start here

> **This is the proof of concept.** It has one thin slice of every part of the bootcamp so you can try how it feels: one interactive lesson, three short exercise modules, a slice of the final project, the checker, and the Python API. The full bootcamp follows the same patterns.

## One-time setup (about 10 minutes)

1. Put your `.npmrc` (the one that points at Artifactory) in this folder.
2. In a terminal in this folder, run `yarn install`.
3. Start the ticket API in a **second** terminal and leave it running:

   ```
   python server/server.py
   ```

   If Windows says `python` is not found, use `py server/server.py`.

## Try each part

| What | Command | What you should see |
| --- | --- | --- |
| Lessons | `yarn lessons` | A link to open. Pick **01-js/03 Scope and closures**, press → to step through. Press `?` for keys, `d` for dark mode. |
| An exercise, unsolved | `yarn verify 01-js/03` | Every step marked as not started. |
| An exercise, one step | `yarn verify 01-js/03/1` | Only step 1, with a hint if it fails. |
| Type-level exercise | `yarn verify 02-ts/07` | Steps checked by the TypeScript compiler, with plain-English messages. |
| React exercise in the browser | `yarn dev 03-react/04` | A playground page for the hooks you write. |
| Phase 1 project | `yarn tickets` | Your ticket logic running against the Python API ("not done yet" for the parts you have not written). |
| Your progress | `yarn progress` | Every module, every step, and the next thing to do. |
| Final project | `yarn dev final-project` | The ticket table, running against the Python API. |
| Final project checks | `yarn verify final-project` | Six checks: TS migration, tsc, ESLint, a planted bug, a performance problem, a new feature. |

Solve a step in `01-js/03-scope-closures/exercises.js`, run `yarn verify 01-js/03` again, and watch it turn green.

## Folders

| Folder | What is in it |
| --- | --- |
| `lessons/` | The lesson app and its design system. You only open it through `yarn lessons`. |
| `01-js/`, `02-ts/`, `03-react/` | One folder per module: `lesson.tsx` (the slides), `README.md` (the exercises), the starter file. |
| `final-project/` | The ticket app you migrate, fix and extend on day 2. |
| `server/` | The Python ticket API. Standard library only. |
| `scripts/` | The tools behind `yarn verify`, `yarn progress`, `yarn lessons` and `yarn dev`. You do not need to read them. |
