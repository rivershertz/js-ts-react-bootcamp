# 01-js/05 Modules

**Time:** 15 min lesson, 30 min exercises (core), plus 15 min stretch.

## 1. Watch the lesson

Run `yarn lessons`, open the link it prints, and pick **01-js/05 Modules**.

## 2. Quick recap

- One file is one module. Only names marked `export` can be imported from another file.
- Import your own files with a relative path and the full file name: `import { compute } from './stats.js';`. A bare name like `'axios'` is a package.
- **Named** exports: many per file, imported in braces with the exact name. **Default** export: at most one per file, imported without braces under any name.
- A module runs once, on its first import, and every importer shares it. Imports are live: they always show the current value.
- An `index.js` can re-export a folder's public names, so the rest of the code has one place to import from.

## 3. Exercises

This module is a small folder of files instead of one `exercises.js`. Each step says which file to change.

| Step | Level | File | Task |
| --- | --- | --- | --- |
| 1 | core | [`priorities.js`](priorities.js) | Export `PRIORITIES` and `comparePriority` (named exports) |
| 2 | core | [`format.js`](format.js) | Import `PRIORITIES`, and make `formatTicket` the default export |
| 3 | core | [`tickets.js`](tickets.js) | Move `isOverdue` into a new file `dates.js`, then import it back |
| 4 | core | [`index.js`](index.js) | Re-export all five public names from one place |
| 5 | stretch | [`counter.js`](counter.js) | Export a `count` variable and an `increment()` function |
| 6 | core | [`report.js`](report.js) | `overdueReport()`, importing only from `./index.js` |
| 7 | stretch | [`report.js`](report.js) | `loadFormatter()`, loading `format.js` on demand with `import()` |

Check all steps:

```
yarn verify 01-js/05
```

Check one step:

```
yarn verify 01-js/05/3
```

Always write the `.js` at the end of your own imports. The checker looks for it, because plain Node (which runs `yarn tickets` in your project) refuses imports without it.

Coming from Python? Step 4 is what a package's `__init__.py` does when it imports names from its submodules.
