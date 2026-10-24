# 02-ts/02 Basics: object types and functions

**Time:** 30 min lesson, 30 min exercises (core), plus 5 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **02-ts/02 Basics: object types and functions**.

## 2. Quick recap

- An object type lists each field and its type: `type Assignee = { id: string; name: string };`
- `readonly id` cannot be reassigned. `description?: string` may be missing. `dueDate: string | null` is always there but may be `null`.
- `type` and `interface` both describe objects. `interface X extends Y { ... }` adds fields to another type.
- Type every parameter. A parameter with a default value is optional and gets its type from the default.
- `readonly Ticket[]` is an array you may read but not change: no `push`, no `sort`.
- A function type is written like an arrow: `(ticket: Ticket) => boolean`.

## 3. Exercises

Open [`exercises.ts`](exercises.ts). Red underlines are part of the exercise: when a step is done, its underlines are gone. Keep the `// @step N` comments.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `Assignee` object type |
| 2 | core | `Ticket` with readonly, optional and nullable fields |
| 3 | core | `createTicket` with typed parameters and a default |
| 4 | core | `ClosedTicket` interface that extends `Ticket`, and `closeTicket` |
| 5 | core | `addTicket` on a readonly array |
| 6 | core | `TicketFilter` function type and `isOpen` |
| 7 | stretch | `indexById` returning `Record<string, Ticket>` |

```
yarn verify 02-ts/02
```
