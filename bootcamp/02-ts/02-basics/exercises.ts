// 02-ts/02 Basics: object types, functions, optional and readonly
// Check your work with:  yarn verify 02-ts/02
// The checker reads the `// @step N` markers, so keep them.

// @step 1 (core)
// Describe an assignee: an object with `id` and `name`, both strings.
export type Assignee = object; // TODO

// @step 2 (core)
// Describe a ticket. Add the missing fields:
//   id           string, and it can never be changed (readonly)
//   title        string
//   description  string, optional (the field may be missing)
//   priority     string
//   status       string
//   createdAt    string
//   dueDate      string or null (always there, null when there is no due date)
export type Ticket = { id: string; title: string }; // TODO

// @step 3 (core)
// Create a new open ticket. Type the parameters; priority is optional and defaults to 'medium'.
// createdAt is the current time as an ISO string (new Date().toISOString()), dueDate is null.
export function createTicket(id, title, priority) {
  throw new Error('TODO: step 3');
}

// @step 4 (core)
// Make ClosedTicket an interface that extends Ticket and adds closedAt: string.
// Then return a closed copy of the ticket: status 'closed' and closedAt set. Do not change `ticket`.
export type ClosedTicket = Ticket; // TODO
export function closeTicket(ticket: Ticket, closedAt: string): ClosedTicket {
  throw new Error('TODO: step 4');
}

// @step 5 (core)
// Add a ticket to the list. The list is readonly, so TypeScript refuses push: return a new array.
export function addTicket(tickets: readonly Ticket[], ticket: Ticket): readonly Ticket[] {
  tickets.push(ticket);
  return tickets;
}

// @step 6 (stretch)
// TicketFilter is the type of a function that takes a Ticket and returns a boolean.
// isOpen is a TicketFilter: true when the status is not 'closed'.
export type TicketFilter = (ticket: unknown) => unknown; // TODO
export const isOpen: TicketFilter = () => {
  throw new Error('TODO: step 6');
};

// @step 7 (stretch)
// Return an object from id to ticket. Write the return type with Record.
export function indexById(tickets: readonly Ticket[]) {
  throw new Error('TODO: step 7');
}
