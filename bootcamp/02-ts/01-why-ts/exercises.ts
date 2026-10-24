// 02-ts/01 Why TypeScript, and how it runs
// Each step below has a red underline in VS Code. Fix the code so the underline goes away
// AND the function does what its comment says.
// Check your work with:  yarn verify 02-ts/01
// The checker reads the `// @step N` markers, so keep them.

// @step 1 (core)
// Days between createdAt (an ISO date string) and now, rounded down.
// Add types to the parameters and the return value.
export function daysOpen(createdAt, now) {
  return Math.floor((now.getTime() - new Date(createdAt).getTime()) / 86_400_000);
}

// @step 2 (core)
// Return the title in capitals. TypeScript found a bug here before you ran anything.
export function shout(ticket: { id: string; title: string }): string {
  return ticket.titel.toUpperCase();
}

// @step 3 (core)
// Return the title of the ticket with this id, or '(not found)' when there is none.
export function titleOf(tickets: { id: string; title: string }[], id: string): string {
  const found = tickets.find((t) => t.id === id);
  return found.title;
}

// @step 4 (core)
// Return 'due 2026-10-01', or 'no due date' when dueDate is null.
function formatDate(date: string): string {
  return `due ${date}`;
}
export function dueLabel(ticket: { dueDate: string | null }): string {
  return formatDate(ticket.dueDate);
}

// @step 5 (core)
// Run:  node 02-ts/01-why-ts/run-me.ts
// Node runs a .ts file by deleting the types, without checking them. Copy what it printed
// after "Total hours:" into PRINTED, exactly as printed. Then think: why that value?
export const PRINTED: string = '';
