// 02-ts/04 Type guards: checking data that arrives as unknown
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

// @step 1 (core)
// True when value is one of the four priorities. Change the return type to a type predicate,
// so that after `if (isPriority(x))` TypeScript knows x is a Priority.
export function isPriority(value: unknown): boolean {
  throw new Error('TODO: step 1');
}

// @step 2 (core)
// True when value is a plain object you can read fields from: not null, not an array.
// Return type: value is Record<string, unknown>
export function isRecord(value: unknown): boolean {
  throw new Error('TODO: step 2');
}

// @step 3 (core)
// True when value looks like { id: string, name: string }. Use isRecord first.
export function isAssignee(value: unknown): boolean {
  throw new Error('TODO: step 3');
}

// @step 4 (core)
// True when value has every Ticket field with the right type:
// id, title, createdAt are strings; status is one of STATUSES; priority passes isPriority;
// dueDate is a string or null.
export function isTicket(value: unknown): boolean {
  throw new Error('TODO: step 4');
}

// @step 5 (core)
// An assertion function: return nothing when value is a Ticket, otherwise
// throw new Error('Not a valid ticket: <id>') (use '?' when there is no string id).
// Return type: asserts value is Ticket
export function assertTicket(value: unknown): void {
  throw new Error('TODO: step 5');
}

// @step 6 (core)
// The API answer arrives as unknown. If it is not an array, throw new Error('Expected a list of tickets').
// Otherwise keep the valid tickets and count the invalid ones.
export function parseTickets(data: unknown): { tickets: Ticket[]; invalid: number } {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch)
// List what is wrong with a ticket, one message per bad field, in this order:
// id, title, status, priority, createdAt, dueDate. For example:
//   ['priority must be one of low, medium, high, urgent', 'createdAt must be a string']
// Return [] for a valid ticket, and ['not an object'] when value is not a record.
export function ticketProblems(value: unknown): string[] {
  throw new Error('TODO: step 7');
}
