// 02-ts/04 Type guards: checking data that arrives as unknown
//
// What you build: guards that check API data at run time, so the rest of the code can trust its types.
// Finished when:  `yarn verify 02-ts/04` shows ✓ for steps 1 to 6. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
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
// What:   True when value is one of the four priorities. Change the return type to a type predicate,
//         so that after `if (isPriority(x))` TypeScript knows x is a Priority.
// Result: isPriority('high') → true;  isPriority('critical') and isPriority(3) → false.
// Needs:  slide "unknown in, checked type out".
export function isPriority(value: unknown): boolean {
  throw new Error('TODO: step 1');
}

// @step 2 (core): isRecord
// What:   True when value is a plain object you can read fields from: not null, not an array.
//         Return type: value is Record<string, unknown>
// Result: isRecord({ a: 1 }) → true;  isRecord(null), isRecord([]), isRecord('x') → false
// Needs:  slide "A JavaScript classic".
export function isRecord(value: unknown): boolean {
  throw new Error('TODO: step 2');
}

// @step 3 (core): isAssignee
// What:   True when value looks like { id: string, name: string }. Use isRecord first.
// Result: { id: 'a1', name: 'Dana' } → true;  { id: 'a1' } → false;  null → false
// Needs:  slide "Checking a shape".
export function isAssignee(value: unknown): boolean {
  throw new Error('TODO: step 3');
}

// @step 4 (core): isTicket
// What:   True when value has every Ticket field with the right type:
//         id, title, createdAt are strings; status is one of STATUSES; priority passes isPriority;
//         dueDate is a string or null.
// Result: a ticket from the API → true;  the same ticket with priority 'critical' or dueDate 3 → false
// Needs:  slide "Checking a shape".
export function isTicket(value: unknown): boolean {
  throw new Error('TODO: step 4');
}

// @step 5 (core): assertTicket
// What:   An assertion function: return nothing when value is a Ticket, otherwise
//         throw new Error('Not a valid ticket: <id>') (use '?' when there is no string id).
//         Return type: asserts value is Ticket
// Result: a valid ticket → returns;  { id: 't3' } → throws 'Not a valid ticket: t3';  5 → throws 'Not a valid ticket: ?'
// Needs:  slide "Guard or assert?".
export function assertTicket(value: unknown): void {
  throw new Error('TODO: step 5');
}

// @step 6 (core): parseTickets
// What:   The API answer arrives as unknown. If it is not an array, throw new Error('Expected a list of tickets').
//         Otherwise keep the valid tickets and count the invalid ones.
// Result: [valid, valid, {}] → { tickets: [valid, valid], invalid: 1 };  {} → throws 'Expected a list of tickets'
// Needs:  slide "Guards are filter callbacks".
export function parseTickets(data: unknown): { tickets: Ticket[]; invalid: number } {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch): ticketProblems
// What:   List what is wrong with a ticket, one message per bad field, in this order:
//         id, title, status, priority, createdAt, dueDate.
//         Return [] for a valid ticket, and ['not an object'] when value is not a record.
// Result: ['priority must be one of low, medium, high, urgent', 'createdAt must be a string']
// Needs:  the guards from steps 1 to 4.
export function ticketProblems(value: unknown): string[] {
  throw new Error('TODO: step 7');
}
