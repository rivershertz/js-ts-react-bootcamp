# 02-ts/06 Generics and utility types

**Time:** 10 min lesson, 25 min exercises (core), plus 10 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **02-ts/06 Generics and utility types**.

## 2. Quick recap

- A **type parameter** `<T>` lets one function work for many types while keeping the real type: `first<T>(items: readonly T[]): T | undefined`.
- TypeScript usually infers `T` from the arguments, so you rarely write `first<Ticket>(...)`.
- `K extends string` limits what a type parameter may be.
- **Utility types** derive new types from existing ones: `Omit<T, 'a' | 'b'>`, `Pick<T, 'a'>`, `Partial<T>`, `Record<K, V>`, `ReturnType<typeof fn>`.
- Types never change values at run time: `Pick` does not remove fields from an object, your code does.
- A generic union like `Result<T> = { ok: true; data: T } | { ok: false; error: string }` combines this module with the last one.

## 3. Exercises

Open [`exercises.ts`](exercises.ts). No `any`: a type parameter is how you keep the real type.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `first<T>` |
| 2 | core | `indexBy<T>` with a typed callback |
| 3 | core | `TicketDraft`, `TicketChanges`, `TicketSummary` with `Omit`, `Partial`, `Pick` |
| 4 | core | `updateTicket` with a `Partial` |
| 5 | core | `summarize`: really return only two fields |
| 6 | core | `Result<T>` and `unwrap` |
| 7 | stretch | `countBy<T, K extends string>` |

```
yarn verify 02-ts/06
```
