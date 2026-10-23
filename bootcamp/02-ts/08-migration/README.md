# 02-ts/08 Migrating JavaScript to TypeScript

**Time:** 10 min lesson, 20 min exercises (core), plus 5 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **02-ts/08 Migrating JavaScript to TypeScript**.

## 2. Quick recap

- Migrate in small steps, keeping the code working after each one.
- `// @ts-check` at the top of a `.js` file makes TypeScript check it with loose settings: it finds real bugs before you change anything.
- Rename one file to `.ts`. Strict mode then asks for parameter types. Answer with real types, imported with `import type` or `import { type X }`.
- Never silence the checker: no `any`, no `as`, no `!`, no `@ts-ignore`. Each of those hides a question TypeScript asked.
- Data from axios is `any` by default. Ask for `unknown` (`client.get<unknown>(...)`) and pass it through a type guard.

## 3. Exercises

You migrate [`report.js`](report.js), a small module that builds an overdue report. [`types.ts`](types.ts) already has the `Ticket` type and an `isTicket` guard for you to import.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | Add `// @ts-check` to `report.js` and fix the bug it finds |
| 2 | core | Rename `report.js` to `report.ts` (behaviour unchanged) |
| 3 | core | Zero type errors under strict |
| 4 | core | No `any`, `as`, `!` or `@ts-ignore` |
| 5 | core | `fetchReport` checks the API data with `isTicket` |
| 6 | stretch | `PRIORITY_WEIGHT` with `as const satisfies` |

```
yarn verify 02-ts/08
```

This is a rehearsal for your Phase 2 project, where you migrate your own Phase 1 code the same way.
