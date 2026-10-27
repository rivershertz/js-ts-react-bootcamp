// 02-ts/03 Unions and narrowing
//
// What you build: the Priority type, and functions that accept values of more than one type.
// Finished when:  `yarn verify 02-ts/03` shows ✓ for steps 1 to 6. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Check your work with:  yarn verify 02-ts/03
// The checker reads the `// @step N` markers, so keep them.
// No `as` and no `any` in this module: narrow with checks instead, and TypeScript follows along.

export type Ticket = { id: string; title: string };
export type Assignee = { id: string; name: string };

// @step 1 (core): Priority
// What:   Priority is exactly one of 'low' | 'medium' | 'high' | 'urgent'. Write it as a union of literal types.
//         Once Priority is right, TypeScript finds a bug in DEFAULT_PRIORITY. Fix that too.
// Result: const p: Priority = 'urgent' compiles;  'critical' is an error;  DEFAULT_PRIORITY is 'medium'.
// Needs:  slide "Unions and literals".
export type Priority = string; // TODO
export const DEFAULT_PRIORITY: Priority = 'meduim';

// @step 2 (core): assignee name
// What:   Return the assignee's name, 'Unassigned' when assigneeId is undefined,
//         or 'Unknown (a9)' when no assignee has that id.
// Result: ('a1', [{ id: 'a1', name: 'Dana' }]) → 'Dana';  (undefined, ...) → 'Unassigned';  ('a9', ...) → 'Unknown (a9)'
// Needs:  slide "Narrowing with find".
export function assigneeName(assigneeId: string | undefined, assignees: Assignee[]): string {
  return assignees.find((a) => a.id === assigneeId).name;
}

// @step 3 (core): old and new ids
// What:   Old ids arrive as numbers (12), new ones as strings ('t12'). Always return the string form.
// Result: toTicketId(12) → 't12';  toTicketId('t12') → 't12'
// Needs:  typeof (slide "Four ways to narrow").
export function toTicketId(id: string | number): string {
  return id;
}

// @step 4 (core): ticket or error
// What:   The API sends either a ticket or { error: '...' }. Return the title, or 'Error: <message>'.
// Result: { id: 't1', title: 'Login' } → 'Login';  { error: 'Not found' } → 'Error: Not found'
// Needs:  `in` (slide "Four ways to narrow").
export type ApiError = { error: string };
export function describeResult(result: Ticket | ApiError): string {
  return result.title;
}

// @step 5 (core): any thrown value
// What:   Anything can be thrown. Return its message: an Error gives error.message, a string is used as it is,
//         anything else gives 'Something went wrong'.
// Result: new Error('Boom') → 'Boom';  'Boom' → 'Boom';  42 → 'Something went wrong'
// Needs:  instanceof and typeof (slides "Four ways to narrow" and "unknown, any and as").
export function errorMessage(error: unknown): string {
  return error.message;
}

// @step 6 (core): rank
// What:   Return 1 for 'low', 2 for 'medium', 3 for 'high', 4 for 'urgent'. Use a switch.
// Result: priorityRank('high') → 3
// Needs:  switch (slide "Four ways to narrow").
export function priorityRank(priority: Priority): number {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch): parse user input
// What:   Turn user input like '  High ' into a Priority, or undefined when it is not one. No `as`.
// Result: parsePriority('  High ') → 'high';  parsePriority('critical') → undefined
// Needs:  slide "Narrowing with find".
export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];
export function parsePriority(text: string): Priority | undefined {
  throw new Error('TODO: step 7');
}
