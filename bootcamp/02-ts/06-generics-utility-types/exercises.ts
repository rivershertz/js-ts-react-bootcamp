// 02-ts/06 Generics and utility types
//
// What you build: reusable typed helpers (generic functions) and types derived from Ticket.
// Finished when:  `yarn verify 02-ts/06` shows ✓ for steps 1 to 6. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
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
// What:   Return the first item, or undefined for an empty list. Make it generic, so that
//         first(tickets) is Ticket | undefined and first([1, 2]) is number | undefined.
// Result: first([1, 2]) → 1, typed number | undefined;  first([]) → undefined
// Needs:  slide "A type parameter".
export function first(items: readonly unknown[]): unknown {
  throw new Error('TODO: step 1');
}

// @step 2 (core): indexBy
// What:   Make an object from key to item, using keyOf to get each item's key.
// Result: indexBy(tickets, (t) => t.id) → { t1: t1, ... }, typed Record<string, Ticket>
// Needs:  slide "Generics, side by side".
export function indexBy(items: readonly unknown[], keyOf: (item: unknown) => string): Record<string, unknown> {
  throw new Error('TODO: step 2');
}

// @step 3 (core): derived types
// What:   Derive these from Ticket with utility types, instead of writing the fields again:
//           TicketDraft    what a form sends: a Ticket without id and createdAt     (Omit)
//           TicketChanges  an edit: any subset of the TicketDraft fields             (Partial)
//           TicketSummary  just id and title                                        (Pick)
// Result: adding a field to Ticket adds it to TicketDraft and TicketChanges with no other change.
// Needs:  slide "Utility types".
export type TicketDraft = Ticket; // TODO
export type TicketChanges = Ticket; // TODO
export type TicketSummary = Ticket; // TODO

// @step 4 (core): updateTicket
// What:   Apply changes to a ticket and return the updated copy. id and createdAt never change.
//         Types are gone at run time, so changes may still carry an id or createdAt: keep the original ones.
// Result: updateTicket(t1, { title: 'New' }) → a copy with title 'New';  even with an id in changes, the result keeps t1.id.
// Needs:  slide "Types do not touch values".
export function updateTicket(ticket: Ticket, changes: TicketChanges): Ticket {
  throw new Error('TODO: step 4');
}

// @step 5 (core): summarize
// What:   Return only id and title. The result must not contain any other field.
// Result: summarize(t1) → { id: 't1', title: 'Login page shows blank screen' }, and nothing else.
// Needs:  slide "Types do not touch values".
export function summarize(ticket: Ticket): TicketSummary {
  throw new Error('TODO: step 5');
}

// @step 6 (core): Result<T>
// What:   A result that is either data or an error, for any kind of data T:
//           { ok: true; data: T }  or  { ok: false; error: string }
//         Then write unwrap: the data, or `fallback` when the result is an error.
// Result: unwrap({ ok: true, data: 5 }, 0) → 5;  unwrap({ ok: false, error: 'x' }, 0) → 0
// Needs:  slide "Constraints and generic unions".
export type Result<T> = { ok: boolean; data?: T; error?: string }; // TODO
export function unwrap<T>(result: Result<T>, fallback: T): T {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch): countBy
// What:   Count items per key, for any items and any string-like key K.
// Result: countBy(tickets, (t) => t.status) → { open: 3, closed: 1 },
//         typed Partial<Record<'open' | 'assigned' | 'blocked' | 'closed', number>>
// Needs:  slide "Constraints and generic unions".
export function countBy(items: readonly unknown[], keyOf: (item: unknown) => string): Partial<Record<string, number>> {
  throw new Error('TODO: step 7');
}
