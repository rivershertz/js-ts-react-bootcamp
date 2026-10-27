// 02-ts/01 Why TypeScript, and how it runs
//
// What you build: nothing new: you fix five small functions that TypeScript underlines in red.
// Finished when:  `yarn verify 02-ts/01` shows ✓ for steps 1 to 5. Stretch steps are optional.
//
// Each step below has a red underline in VS Code. Fix the code so the underline goes away
// AND the function does what its comment says.
// Check your work with:  yarn verify 02-ts/01
// The checker reads the `// @step N` markers, so keep them.

// @step 1 (core): add types
// Days between createdAt (an ISO date string) and now, rounded down.
// Add types to the parameters and the return value. Do not change the body.
//
// Example:
//   daysOpen('2026-10-01T00:00:00Z', new Date('2026-10-03T12:00:00Z'))   // 2
export function daysOpen(createdAt, now) {
  return Math.floor((now.getTime() - new Date(createdAt).getTime()) / 86_400_000);
}

// @step 2 (core): a typo
// Return the title in capitals. TypeScript found a bug here before you ran anything.
//
// Example:
//   shout({ id: 't1', title: 'Login' })   // 'LOGIN'
export function shout(ticket: { id: string; title: string }): string {
  return ticket.titel.toUpperCase();
}

// @step 3 (core): not found
// Return the title of the ticket with this id, or '(not found)' when there is none.
//
// Example:
//   titleOf([{ id: 't1', title: 'Login' }], 't1')   // 'Login'
//   titleOf([{ id: 't1', title: 'Login' }], 't9')   // '(not found)'
export function titleOf(tickets: { id: string; title: string }[], id: string): string {
  const found = tickets.find((t) => t.id === id);
  return found.title;
}

// @step 4 (core): no due date
// Return 'due <date>', or 'no due date' when dueDate is null.
//
// Example:
//   dueLabel({ dueDate: '2026-10-01' })   // 'due 2026-10-01'
//   dueLabel({ dueDate: null })           // 'no due date'
function formatDate(date: string): string {
  return `due ${date}`;
}
export function dueLabel(ticket: { dueDate: string | null }): string {
  return formatDate(ticket.dueDate);
}

// @step 5 (core): types disappear
// Run:  node 02-ts/01-why-ts/run-me.ts
// Node runs a .ts file by deleting the types, without checking them. Copy what it printed
// after "Total hours:" into PRINTED, exactly as printed. Then think: why that value?
//
// Example: if Node printed "Total hours: 7", PRINTED is '7'.
export const PRINTED: string = '';
