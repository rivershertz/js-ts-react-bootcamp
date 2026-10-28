// 02-ts/03 Unions and narrowing
//
// What you build: the Priority type, and functions that accept values of more than one type.
// Finished when:  `yarn verify 02-ts/03` shows ✓ for steps 1 to 6. Stretch steps are optional.
//
// Check your work with:  yarn verify 02-ts/03
// The checker reads the `// @step N` markers, so keep them.
// No `as` and no `any` in this module: narrow with checks instead, and TypeScript follows along.

export type Ticket = { id: string; title: string };
export type Assignee = { id: string; name: string };

// @step 1 (core): Priority
// Priority is exactly one of 'low' | 'medium' | 'high' | 'urgent'. Write it as a union of literal types.
// Once Priority is right, TypeScript finds a bug in DEFAULT_PRIORITY. Fix that too.
//
// Example:
//   const a: Priority = 'urgent';     // compiles
//   const b: Priority = 'critical';   // error
export type Priority = string; // TODO
export const DEFAULT_PRIORITY: Priority = 'meduim';

// @step 2 (core): assignee name
// Return the assignee's name, 'Unassigned' when assigneeId is undefined,
// or 'Unknown (<id>)' when no assignee has that id.
//
// Example:
//   const assignees = [{ id: 'a1', name: 'Dana' }];
//   assigneeName('a1', assignees)        // 'Dana'
//   assigneeName(undefined, assignees)   // 'Unassigned'
//   assigneeName('a9', assignees)        // 'Unknown (a9)'
export function assigneeName(assigneeId: string | undefined, assignees: Assignee[]): string {
  return assignees.find((a) => a.id === assigneeId).name;
}

// @step 3 (core): old and new ids
// Old ids arrive as numbers (12), new ones as strings ('t12'). Always return the string form.
//
// Example:
//   toTicketId(12)      // 't12'
//   toTicketId('t12')   // 't12'
export function toTicketId(id: string | number): string {
  return id;
}

// @step 4 (core): ticket or error
// The API sends either a ticket or { error: '...' }. Return the title, or 'Error: <message>'.
//
// Example:
//   describeResult({ id: 't1', title: 'Login' })   // 'Login'
//   describeResult({ error: 'Not found' })         // 'Error: Not found'
export type ApiError = { error: string };
export function describeResult(result: Ticket | ApiError): string {
  return result.title;
}

// @step 5 (core): any thrown value
// Anything can be thrown. Return its message: an Error gives error.message, a string is used as it is,
// anything else gives 'Something went wrong'.
//
// Example:
//   errorMessage(new Error('Boom'))   // 'Boom'
//   errorMessage('Boom')              // 'Boom'
//   errorMessage(42)                  // 'Something went wrong'
export function errorMessage(error: unknown): string {
  return error.message;
}

// @step 6 (core): rank
// Return 1 for 'low', 2 for 'medium', 3 for 'high', 4 for 'urgent'. Use a switch.
//
// Example:
//   priorityRank('high')   // 3
export function priorityRank(priority: Priority): number {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch): parse user input
// Turn user input into a Priority, ignoring case and spaces around it, or undefined when it is not one. No `as`.
//
// Example:
//   parsePriority('  High ')    // 'high'
//   parsePriority('critical')   // undefined
export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];
export function parsePriority(text: string): Priority | undefined {
  throw new Error('TODO: step 7');
}
