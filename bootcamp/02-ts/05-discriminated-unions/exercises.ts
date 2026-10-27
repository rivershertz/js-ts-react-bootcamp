// 02-ts/05 Discriminated unions: one type per ticket state
//
// What you build: one type per ticket state, so an impossible ticket does not compile.
// Finished when:  `yarn verify 02-ts/05` shows ✓ for steps 1 to 5. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Check your work with:  yarn verify 02-ts/05
// The checker reads the `// @step N` markers, so keep them.

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Fields every ticket has, whatever its status.
export type TicketBase = {
  id: string;
  title: string;
  priority: Priority;
  createdAt: string;
  dueDate: string | null;
};

// @step 1 (core): one type per state
// What:   Today Ticket is a bag of optional fields, so nonsense like an open ticket with closedAt is allowed.
//         Replace it with four types joined in a union, using status as the discriminant:
//           OpenTicket      status 'open'      no extra fields
//           AssignedTicket  status 'assigned'  assignee: string
//           BlockedTicket   status 'blocked'   assignee: string, blockedReason: string
//           ClosedTicket    status 'closed'    closedAt: string, assignee?: string (optional)
//         Each one is TicketBase & { ... }.
// Result: { status: 'open', closedAt: '...' } and { status: 'blocked', assignee: 'a1' } (no reason) are compile errors.
// Needs:  slide "One type per state".
export type OpenTicket = TicketBase & { status: 'open' };
export type AssignedTicket = TicketBase & { status: 'assigned' };
export type BlockedTicket = TicketBase & { status: 'blocked' };
export type ClosedTicket = TicketBase & { status: 'closed' };
export type Ticket = TicketBase & {
  status: 'open' | 'assigned' | 'blocked' | 'closed';
  assignee?: string;
  blockedReason?: string;
  closedAt?: string;
}; // TODO: OpenTicket | AssignedTicket | BlockedTicket | ClosedTicket

// @step 2 (core): status label
// What:   A label per status, using fields only that status has. Use a switch on ticket.status.
// Result: 'Open',  'Assigned to a1',  'Blocked: Waiting for design',  'Closed on 2026-10-28' (the date part of closedAt)
// Needs:  slide "Switching on the tag"; closedAt.slice(0, 10) gives the date part.
export function statusLabel(ticket: Ticket): string {
  throw new Error('TODO: step 2');
}

// @step 3 (core): exhaustive
// What:   Make statusLabel exhaustive: in a `default:` branch, assign ticket to a variable of type `never`.
//         If someone later adds a status, statusLabel stops compiling until it handles it.
//         (The checker adds an 'archived' status to a copy of this file and expects a compile error.)
// Result: your file compiles;  the checker's copy with 'archived' does not.
// Needs:  slide "never: the case you forgot".
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// @step 4 (core): assign
// What:   Assign an open ticket. The result is an AssignedTicket (do not change `ticket`).
// Result: assign(openTicket, 'a1') → a copy with status 'assigned' and assignee 'a1'.
// Needs:  slide "Changing state".
export function assign(ticket: OpenTicket, assignee: string): AssignedTicket {
  throw new Error('TODO: step 4');
}

// @step 5 (core): close
// What:   Close any ticket. Keep its assignee if it has one; never keep blockedReason.
//         Build the result from the base fields, so no field of the old status sneaks in.
// Result: close(blockedTicket, '2026-10-28') → status 'closed', closedAt set, the same assignee, no blockedReason field.
// Needs:  slide "Changing state".
export function close(ticket: Ticket, closedAt: string): ClosedTicket {
  throw new Error('TODO: step 5');
}

// @step 6 (stretch): assigneeOf
// What:   Return the assignee of a ticket, or undefined for an open ticket. Use `in` or the status: no `as`.
// Result: an assigned ticket → its assignee;  an open ticket → undefined
// Needs:  slide "Switching on the tag".
export function assigneeOf(ticket: Ticket): string | undefined {
  throw new Error('TODO: step 6');
}
