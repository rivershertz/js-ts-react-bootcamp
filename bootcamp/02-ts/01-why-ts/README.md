# 02-ts/01 Why TypeScript, and how it runs

**Time:** 20 min lesson, 20 min exercises (core).

## 1. Watch the lesson

Run `yarn lessons` and pick **02-ts/01 Why TypeScript, and how it runs**.

## 2. Quick recap

- TypeScript is JavaScript plus type annotations, written after the name with a colon, like Python type hints.
- The checker runs in VS Code as you type (red underlines) and in `tsc --noEmit`. It only reports problems.
- Vite and Node delete the types and run the JavaScript that is left. They do not check types, so wrong code can still run.
- Type every function's parameters. TypeScript infers most other types; hover a name to see what it inferred.
- Strict mode is on: no untyped parameters, and `null` / `undefined` only where the type allows them.

## 3. Exercises

Open [`exercises.ts`](exercises.ts). Steps 1 to 4 each have a red underline: fix the code so it disappears **and** the function does what its comment says. Keep the `// @step N` comments; the checker uses them.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `daysOpen`: add types to the parameters and the result |
| 2 | core | `shout`: fix the bug TypeScript found |
| 3 | core | `titleOf`: handle a ticket that is not found |
| 4 | core | `dueLabel`: handle a `null` due date |
| 5 | core | Run [`run-me.ts`](run-me.ts) with Node and record what it prints |

```
yarn verify 02-ts/01
```

For step 5, run this in the bootcamp folder:

```
node 02-ts/01-why-ts/run-me.ts
```

Node 24 runs `.ts` files directly by deleting the types. Notice that it does not complain about the error VS Code shows.
