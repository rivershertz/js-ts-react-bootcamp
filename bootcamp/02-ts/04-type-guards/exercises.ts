// 02-ts/04 Type guards: checking data that arrives as unknown
//
// What you build: guards that check API data at run time, so the rest of the code can trust its types.
// Finished when:  `yarn verify 02-ts/04` shows ✓ for steps 1 to 6. Stretch steps are optional.
//
// Check your work with:  yarn verify 02-ts/04
// The checker reads the `// @step N` markers, so keep them. No `as` (except `as const`) and no `any`.

export type Status = 'open' | 'assigned' | 'blocked' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export const STATUSES: readonly Status[] = ['open', 'assigned', 'blocked', 'closed'];
export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];

export type Assignee = { id: string; name: string };
export type Ticket = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  dueDate: string | null;
};

// @step 1 (core): isPriority
// True when value is one of the four priorities. Change the return type to a type predicate,
// so that after `if (isPriority(x))` TypeScript knows x is a Priority.
//
// Example:
//   isPriority('high')       // true
//   isPriority('critical')   // false
//   isPriority(3)            // false
export function isPriority(value: unknown): boolean {
  throw new Error('TODO: step 1');
}

// @step 2 (core): isRecord
// True when value is a plain object you can read fields from: not null, not an array.
// Return type: value is Record<string, unknown>
//
// Example:
//   isRecord({ a: 1 })   // true
//   isRecord(null)       // false
//   isRecord([1, 2])     // false
//   isRecord('text')     // false
export function isRecord(value: unknown): boolean {
  throw new Error('TODO: step 2');
}

// @step 3 (core): isAssignee
// True when value looks like { id: string, name: string }. Use isRecord first.
//
// Example:
//   isAssignee({ id: 'a1', name: 'Dana' })   // true
//   isAssignee({ id: 'a1' })                 // false
//   isAssignee(null)                         // false
export function isAssignee(value: unknown): boolean {
  throw new Error('TODO: step 3');
}

// @step 4 (core): isTicket
// True when value has every Ticket field with the right type:
// id, title, createdAt are strings; status is one of STATUSES; priority passes isPriority;
// dueDate is a string or null.
//
// Example:
//   isTicket({ id: 't1', title: 'Login', status: 'open', priority: 'low',
//              createdAt: '2026-09-05T14:00:00Z', dueDate: null })   // true
//   // the same object with priority: 'critical', or with dueDate: 3   // false
export function isTicket(value: unknown): boolean {
  throw new Error('TODO: step 4');
}

// @step 5 (core): assertTicket
// An assertion function: return nothing when value is a Ticket, otherwise
// throw new Error('Not a valid ticket: <id>') (use '?' when there is no string id).
// Return type: asserts value is Ticket
//
// Example:
//   assertTicket(validTicket)    // returns, and validTicket is a Ticket after this line
//   assertTicket({ id: 't3' })   // throws Error('Not a valid ticket: t3')
//   assertTicket(5)              // throws Error('Not a valid ticket: ?')
export function assertTicket(value: unknown): void {
  throw new Error('TODO: step 5');
}

// @step 6 (core): parseTickets
// The API answer arrives as unknown. If it is not an array, throw new Error('Expected a list of tickets').
// Otherwise keep the valid tickets and count the invalid ones.
//
// Example:
//   parseTickets([t1, t2, { id: 'bad' }])   // { tickets: [t1, t2], invalid: 1 }
//   parseTickets({ tickets: [] })           // throws Error('Expected a list of tickets')
export function parseTickets(data: unknown): { tickets: Ticket[]; invalid: number } {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch): ticketProblems
// List what is wrong with a ticket, one message per bad field, in this order:
// id, title, status, priority, createdAt, dueDate.
//
// Example:
//   ticketProblems(validTicket)   // []
//   ticketProblems('text')        // ['not an object']
//   ticketProblems({ ...validTicket, priority: 'critical', createdAt: 5 })
//   // ['priority must be one of low, medium, high, urgent', 'createdAt must be a string']
export function ticketProblems(value: unknown): string[] {
  throw new Error('TODO: step 7');
}
