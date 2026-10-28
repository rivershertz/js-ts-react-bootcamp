// 02-ts/02 Basics: object types, functions, optional and readonly
//
// What you build: the Ticket and Assignee types, and small functions that use them.
// Finished when:  `yarn verify 02-ts/02` shows ✓ for steps 1 to 6. Stretch steps are optional.
//
// Check your work with:  yarn verify 02-ts/02
// The checker reads the `// @step N` markers, so keep them.

// @step 1 (core): Assignee
// Describe an assignee: an object with `id` and `name`, both strings.
//
// Example:
//   const ok: Assignee = { id: 'a1', name: 'Dana' };   // compiles
//   const bad: Assignee = { id: 'a1' };                // error: name is missing
export type Assignee = object; // TODO

// @step 2 (core): Ticket
// Describe a ticket. Add the missing fields:
//   id           string, and it can never be changed (readonly)
//   title        string
//   description  string, optional (the field may be missing)
//   priority     string
//   status       string
//   createdAt    string
//   dueDate      string or null (always there, null when there is no due date)
//
// Example:
//   ticket.id = 't2';   // error: id is readonly
//   // a ticket without description compiles; a ticket without dueDate does not
export type Ticket = { id: string; title: string }; // TODO

// @step 3 (core): createTicket
// Create a new open ticket. Type the parameters; priority is optional and defaults to 'medium'.
// createdAt is the current time as an ISO string (new Date().toISOString()), dueDate is null.
//
// Example:
//   createTicket('t9', 'Export fails')
//   // { id: 't9', title: 'Export fails', priority: 'medium', status: 'open',
//   //   createdAt: '2026-10-27T18:00:00.000Z' (now), dueDate: null }
//   createTicket('t9', 'Export fails', 'high')   // the same, with priority 'high'
export function createTicket(id, title, priority) {
  throw new Error('TODO: step 3');
}

// @step 4 (core): ClosedTicket
// Make ClosedTicket an interface that extends Ticket and adds closedAt: string.
// Then return a closed copy of the ticket: status 'closed' and closedAt set. Do not change `ticket`.
//
// Example:
//   closeTicket(ticket, '2026-10-28')
//   // a copy of ticket with status: 'closed' and closedAt: '2026-10-28'; ticket itself is unchanged
export type ClosedTicket = Ticket; // TODO
export function closeTicket(ticket: Ticket, closedAt: string): ClosedTicket {
  throw new Error('TODO: step 4');
}

// @step 5 (core): readonly list
// Add a ticket to the list. The list is readonly, so TypeScript refuses push: return a new array.
//
// Example:
//   addTicket([t1], t2)   // [t1, t2], and the list you passed in is still [t1]
export function addTicket(tickets: readonly Ticket[], ticket: Ticket): readonly Ticket[] {
  tickets.push(ticket);
  return tickets;
}

// @step 6 (core): a function type
// TicketFilter is the type of a function that takes a Ticket and returns a boolean.
// isOpen is a TicketFilter: true when the status is not 'closed'.
//
// Example:
//   isOpen({ ...ticket, status: 'open' })     // true
//   isOpen({ ...ticket, status: 'closed' })   // false
//   tickets.filter(isOpen)                    // compiles, and gives Ticket[]
export type TicketFilter = (ticket: unknown) => unknown; // TODO
export const isOpen: TicketFilter = () => {
  throw new Error('TODO: step 6');
};

// @step 7 (stretch): Record
// Return an object from id to ticket. Write the return type with Record.
// New here: Record<K, V> is the type of an object whose keys are K and whose values are V.
// It is covered properly in 02-ts/06.
//
// Example:
//   indexById([t1, t2])   // { t1: t1, t2: t2 }, typed Record<string, Ticket>
export function indexById(tickets: readonly Ticket[]) {
  throw new Error('TODO: step 7');
}
