// 02-ts/02 Basics: object types, functions, optional and readonly
//
// What you build: the Ticket and Assignee types, and small functions that use them.
// Finished when:  `yarn verify 02-ts/02` shows ✓ for steps 1 to 6. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Check your work with:  yarn verify 02-ts/02
// The checker reads the `// @step N` markers, so keep them.

// @step 1 (core): Assignee
// What:   Describe an assignee: an object with `id` and `name`, both strings.
// Result: { id: 'a1', name: 'Dana' } is an Assignee;  { id: 'a1' } is a compile error.
// Needs:  slide "Describing a shape".
export type Assignee = object; // TODO

// @step 2 (core): Ticket
// What:   Describe a ticket. Add the missing fields:
//           id           string, and it can never be changed (readonly)
//           title        string
//           description  string, optional (the field may be missing)
//           priority     string
//           status       string
//           createdAt    string
//           dueDate      string or null (always there, null when there is no due date)
// Result: ticket.id = 'x' is an error;  a ticket without description compiles;  one without dueDate does not.
// Needs:  slides "Describing a shape" and "Three kinds of maybe".
export type Ticket = { id: string; title: string }; // TODO

// @step 3 (core): createTicket
// What:   Create a new open ticket. Type the parameters; priority is optional and defaults to 'medium'.
//         createdAt is the current time as an ISO string (new Date().toISOString()), dueDate is null.
// Result: createTicket('t9', 'Export fails')
//           → { id: 't9', title: 'Export fails', priority: 'medium', status: 'open', createdAt: <now>, dueDate: null }
// Needs:  slide "Typing functions".
export function createTicket(id, title, priority) {
  throw new Error('TODO: step 3');
}

// @step 4 (core): ClosedTicket
// What:   Make ClosedTicket an interface that extends Ticket and adds closedAt: string.
//         Then return a closed copy of the ticket: status 'closed' and closedAt set. Do not change `ticket`.
// Result: closeTicket(t, '2026-10-28') → a copy with status 'closed' and closedAt '2026-10-28';  t is unchanged.
// Needs:  slide "type or interface?", and spread (01-js/01).
export type ClosedTicket = Ticket; // TODO
export function closeTicket(ticket: Ticket, closedAt: string): ClosedTicket {
  throw new Error('TODO: step 4');
}

// @step 5 (core): readonly list
// What:   Add a ticket to the list. The list is readonly, so TypeScript refuses push: return a new array.
// Result: addTicket([t1], t2) → [t1, t2], and the input is still [t1].
// Needs:  [...list, item] (01-js/01, slide "Update without changing").
export function addTicket(tickets: readonly Ticket[], ticket: Ticket): readonly Ticket[] {
  tickets.push(ticket);
  return tickets;
}

// @step 6 (core): a function type
// What:   TicketFilter is the type of a function that takes a Ticket and returns a boolean.
//         isOpen is a TicketFilter: true when the status is not 'closed'.
// Result: isOpen(openTicket) → true;  isOpen(closedTicket) → false;  tickets.filter(isOpen) compiles.
// Needs:  slide "Typing functions".
export type TicketFilter = (ticket: unknown) => unknown; // TODO
export const isOpen: TicketFilter = () => {
  throw new Error('TODO: step 6');
};

// @step 7 (stretch): Record
// What:   Return an object from id to ticket. Write the return type with Record.
// Result: indexById([t1, t2]) → { t1: t1, t2: t2 }, with the return type Record<string, Ticket>.
// Needs:  Record comes properly in 02-ts/06. All you need now: Record<K, V> is an object whose keys are K
//         and whose values are V. Building the object is 01-js/02 step 7.
export function indexById(tickets: readonly Ticket[]) {
  throw new Error('TODO: step 7');
}
