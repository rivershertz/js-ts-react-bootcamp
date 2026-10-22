# 02-ts/07 Deriving types from values

**Time:** 30 min lesson, 30 min exercises (core).

> POC note: this module has exercises but no lesson deck yet. It shows how type-level checks work.

## Recap

- Write a value once, then let TypeScript work out the type from it, so the two can never drift apart.
- `as const` keeps the exact strings of an array or object, instead of widening them to `string`.
- `(typeof STATUSES)[number]` turns an array type into the union of its items.
- `satisfies` checks a value against a type without changing the value's own, more exact type.
- `keyof T` is the union of the keys of a type.

## Exercises

Open [`exercises.ts`](exercises.ts). Keep the `// @step N` comments: the checker uses them to tell which step an error belongs to.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `Status` derived from `STATUSES` |
| 2 | core | `PRIORITY_LABELS` checked with `satisfies` |
| 3 | core | `statusOptions()` typed from `Status` |
| 4 | stretch | `TicketField` from the keys of `Ticket` |

```
yarn verify 02-ts/07
```

Most steps are checked by the TypeScript compiler, not by running code. VS Code also shows the same errors as red underlines while you type.
