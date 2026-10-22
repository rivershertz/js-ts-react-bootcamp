# 02-ts/03 Unions and narrowing

**Time:** 30 min lesson, 30 min exercises (core), plus 5 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **02-ts/03 Unions and narrowing**.

## 2. Quick recap

- A union `A | B` is a value that is one or the other. A literal type like `'urgent'` allows exactly one value, so `'low' | 'medium' | 'high' | 'urgent'` allows exactly four.
- On a union you can only use what every member has. To use more, **narrow**: check which member you have, and TypeScript remembers the answer inside the `if`.
- Ways to narrow: `=== undefined` / `=== null` or truthiness, `typeof x === 'string'`, `'field' in obj`, `x instanceof Error`, and `switch` on a literal field.
- `unknown` is the safe "anything": you must narrow it before using it. `any` switches the checker off; do not use it.
- `as` tells TypeScript to trust you without checking. Avoid it: a check is always safer.

## 3. Exercises

Open [`exercises.ts`](exercises.ts). No `as` and no `any` in this module; the checker looks for both.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `Priority` as a union of literals (then fix the bug it reveals) |
| 2 | core | `assigneeName`: narrow away `undefined` |
| 3 | core | `toTicketId`: narrow with `typeof` |
| 4 | core | `describeResult`: narrow with `in` |
| 5 | core | `errorMessage`: narrow `unknown` with `instanceof` and `typeof` |
| 6 | core | `priorityRank`: `switch` over a union |
| 7 | stretch | `parsePriority`: text to `Priority` without `as` |

```
yarn verify 02-ts/03
```
