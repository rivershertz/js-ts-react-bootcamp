// 02-ts/01 Why TypeScript, and how it runs (solution)

// @step 1 (core)
export function daysOpen(createdAt: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(createdAt).getTime()) / 86_400_000);
}

// @step 2 (core)
export function shout(ticket: { id: string; title: string }): string {
  return ticket.title.toUpperCase();
}

// @step 3 (core)
export function titleOf(tickets: { id: string; title: string }[], id: string): string {
  const found = tickets.find((t) => t.id === id);
  return found ? found.title : '(not found)';
}

// @step 4 (core)
function formatDate(date: string): string {
  return `due ${date}`;
}
export function dueLabel(ticket: { dueDate: string | null }): string {
  return ticket.dueDate === null ? 'no due date' : formatDate(ticket.dueDate);
}

// @step 5 (core)
// 3 + 4 is 7, then 7 + '5' joins text: '75'. The type said number[]; nothing checked it at run time.
export const PRINTED: string = '75';
