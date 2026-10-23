// 02-ts/03 Unions and narrowing
// Check your work with:  yarn verify 02-ts/03
// The checker reads the `// @step N` markers, so keep them.
// No `as` and no `any` in this module: narrow with checks instead, and TypeScript follows along.

export type Ticket = { id: string; title: string };
export type Assignee = { id: string; name: string };

// @step 1 (core)
// Priority is exactly one of 'low' | 'medium' | 'high' | 'urgent'. Write it as a union of literal types.
// Once Priority is right, TypeScript finds a bug in DEFAULT_PRIORITY. Fix that too.
export type Priority = string; // TODO
export const DEFAULT_PRIORITY: Priority = 'meduim';

// @step 2 (core)
// Return the assignee's name, 'Unassigned' when assigneeId is undefined,
// or 'Unknown (a9)' when no assignee has that id.
export function assigneeName(assigneeId: string | undefined, assignees: Assignee[]): string {
  return assignees.find((a) => a.id === assigneeId).name;
}

// @step 3 (core)
// Old ids arrive as numbers (12), new ones as strings ('t12'). Always return the string form.
export function toTicketId(id: string | number): string {
  return id;
}

// @step 4 (core)
// The API sends either a ticket or { error: '...' }. Return the title, or 'Error: <message>'.
export type ApiError = { error: string };
export function describeResult(result: Ticket | ApiError): string {
  return result.title;
}

// @step 5 (stretch)
// Anything can be thrown. Return its message: an Error gives error.message, a string is used as it is,
// anything else gives 'Something went wrong'.
export function errorMessage(error: unknown): string {
  return error.message;
}

// @step 6 (core)
// Return 1 for 'low', 2 for 'medium', 3 for 'high', 4 for 'urgent'. Use a switch.
export function priorityRank(priority: Priority): number {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch)
// Turn user input like '  High ' into a Priority, or undefined when it is not one. No `as`.
export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];
export function parsePriority(text: string): Priority | undefined {
  throw new Error('TODO: step 7');
}
