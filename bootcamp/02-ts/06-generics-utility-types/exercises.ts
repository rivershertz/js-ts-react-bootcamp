// 02-ts/06 Generics and utility types
//
// What you build: reusable typed helpers (generic functions) and types derived from Ticket.
// Finished when:  `yarn verify 02-ts/06` shows ✓ for steps 1 to 6. Stretch steps are optional.
//
// Check your work with:  yarn verify 02-ts/06
// The checker reads the `// @step N` markers, so keep them. No `any`.

export type Ticket = {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'blocked' | 'closed';
  createdAt: string;
  dueDate: string | null;
};

// @step 1 (core): first
// Return the first item, or undefined for an empty list. Make it generic, so that
// first(tickets) is Ticket | undefined and first([1, 2]) is number | undefined.
//
// Example:
//   first([1, 2])    // 1, and its type is number | undefined
//   first(tickets)   // tickets[0], and its type is Ticket | undefined
//   first([])        // undefined
export function first(items: readonly unknown[]): unknown {
  throw new Error('TODO: step 1');
}

// @step 2 (core): indexBy
// Make an object from key to item, using keyOf to get each item's key. Make it generic.
//
// Example:
//   indexBy([t1, t2], (t) => t.id)   // { t1: t1, t2: t2 }, typed Record<string, Ticket>
export function indexBy(items: readonly unknown[], keyOf: (item: unknown) => string): Record<string, unknown> {
  throw new Error('TODO: step 2');
}

// @step 3 (core): derived types
// Derive these from Ticket with utility types, instead of writing the fields again:
//   TicketDraft    what a form sends: a Ticket without id and createdAt     (Omit)
//   TicketChanges  an edit: any subset of the TicketDraft fields             (Partial)
//   TicketSummary  just id and title                                        (Pick)
//
// Example:
//   const d: TicketDraft = { title: 'Login', ... };   // error if you add id or createdAt
//   const c: TicketChanges = { title: 'New title' };  // compiles: every field is optional
//   const s: TicketSummary = { id: 't1', title: 'Login' };
export type TicketDraft = Ticket; // TODO
export type TicketChanges = Ticket; // TODO
export type TicketSummary = Ticket; // TODO

// @step 4 (core): updateTicket
// Apply changes to a ticket and return the updated copy. id and createdAt never change.
// Types are gone at run time, so changes may still carry an id or createdAt: keep the original ones.
//
// Example:
//   updateTicket(t1, { title: 'New title' })   // t1's fields, with title 'New title'
//   // at run time, changes can still hold id: 'x' (from a form or the API): the result keeps t1.id
export function updateTicket(ticket: Ticket, changes: TicketChanges): Ticket {
  throw new Error('TODO: step 4');
}

// @step 5 (core): summarize
// Return only id and title. The result must not contain any other field.
//
// Example:
//   summarize({ id: 't1', title: 'Login', status: 'open', ... })   // { id: 't1', title: 'Login' }
export function summarize(ticket: Ticket): TicketSummary {
  throw new Error('TODO: step 5');
}

// @step 6 (core): Result<T>
// A result that is either data or an error, for any kind of data T:
//   { ok: true; data: T }  or  { ok: false; error: string }
// Then write unwrap: the data, or `fallback` when the result is an error.
//
// Example:
//   unwrap({ ok: true, data: 5 }, 0)          // 5
//   unwrap({ ok: false, error: 'Boom' }, 0)   // 0
//   const r: Result<number> = { ok: true, error: 'Boom' };   // error
export type Result<T> = { ok: boolean; data?: T; error?: string }; // TODO
export function unwrap<T>(result: Result<T>, fallback: T): T {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch): countBy
// Count items per key, for any items and any string-like key K.
//
// Example:
//   countBy([open1, open2, closed1], (t) => t.status)
//   // { open: 2, closed: 1 }, typed Partial<Record<'open' | 'assigned' | 'blocked' | 'closed', number>>
export function countBy(items: readonly unknown[], keyOf: (item: unknown) => string): Partial<Record<string, number>> {
  throw new Error('TODO: step 7');
}
