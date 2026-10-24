# 01-js/01 Values and references

**Time:** 15 min lesson, 35 min exercises (core), plus 15 min stretch.

## 1. Watch the lesson

`yarn lessons`, then **01-js/01 Values and references**.

## 2. Quick recap

- Primitives (numbers, strings, booleans, `null`, `undefined`) are copied when assigned. Objects and arrays are shared: the variable holds a reference.
- `===` on objects asks "same object?", like Python's `is`. Nothing in JavaScript compares contents for you. Never use `==`.
- `const` stops reassignment, not changes inside an object.
- `{ ...obj }` and `[...arr]` copy one level only.
- Return new objects and arrays instead of changing the ones you were given. React relies on this.

## 3. Exercises

Open [`exercises.js`](exercises.js). The checker **freezes** every object it gives you, so a function that changes its input fails with a clear message.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `copyTicket`: a copy that does not share changes |
| 2 | core | `closeTicket`: a closed copy with `closedAt` |
| 3 | core | `ticketLabel`: destructuring with defaults |
| 4 | core | `toggleStatus`: add or remove a status in nested filters |
| 5 | core | `replaceTicket`: replace one item, keep the others as they are |
| 6 | core | `removeTicket` |
| 7 | stretch | `sameContent`: compare contents, like Python's `==` |
| 8 | stretch | `deepFreeze` |

```
yarn verify 01-js/01
```

Step 4 is the one most people need two tries for. Draw the arrows on paper first.
