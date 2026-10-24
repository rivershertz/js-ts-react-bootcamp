// 02-ts/06 Generics and utility types
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

// @step 1 (core)
// Return the first item, or undefined for an empty list. Make it generic, so that
// first(tickets) is Ticket | undefined and first([1, 2]) is number | undefined.
export function first(items: readonly unknown[]): unknown {
  throw new Error('TODO: step 1');
}

// @step 2 (core)
// Make an object from key to item, using keyOf to get each item's key.
//   indexBy(tickets, (t) => t.id)  // Record<string, Ticket>
export function indexBy(items: readonly unknown[], keyOf: (item: unknown) => string): Record<string, unknown> {
  throw new Error('TODO: step 2');
}

// @step 3 (core)
// Derive these from Ticket with utility types, instead of writing the fields again:
//   TicketDraft    what a form sends: a Ticket without id and createdAt     (Omit)
//   TicketChanges  an edit: any subset of the TicketDraft fields             (Partial)
//   TicketSummary  just id and title                                        (Pick)
export type TicketDraft = Ticket; // TODO
export type TicketChanges = Ticket; // TODO
export type TicketSummary = Ticket; // TODO

// @step 4 (core)
// Apply changes to a ticket and return the updated copy. id and createdAt never change.
export function updateTicket(ticket: Ticket, changes: TicketChanges): Ticket {
  throw new Error('TODO: step 4');
}

// @step 5 (core)
// Return only id and title. The result must not contain any other field.
export function summarize(ticket: Ticket): TicketSummary {
  throw new Error('TODO: step 5');
}

// @step 6 (core)
// A result that is either data or an error, for any kind of data T:
//   { ok: true; data: T }  or  { ok: false; error: string }
// Then write unwrap: the data, or `fallback` when the result is an error.
export type Result<T> = { ok: boolean; data?: T; error?: string }; // TODO
export function unwrap<T>(result: Result<T>, fallback: T): T {
  throw new Error('TODO: step 6');
}

// @step 7 (stretch)
// Count items per key, for any items and any string-like key K:
//   countBy(tickets, (t) => t.status)  // Partial<Record<'open' | 'assigned' | 'blocked' | 'closed', number>>
export function countBy(items: readonly unknown[], keyOf: (item: unknown) => string): Partial<Record<string, number>> {
  throw new Error('TODO: step 7');
}
