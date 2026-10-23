// 02-ts/05 Discriminated unions: one type per ticket state
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

// @step 1 (core)
// Today Ticket is a bag of optional fields, so nonsense like an open ticket with closedAt is allowed.
// Replace it with four types joined in a union, using status as the discriminant:
//   OpenTicket      status 'open'      no extra fields
//   AssignedTicket  status 'assigned'  assignee: string
//   BlockedTicket   status 'blocked'   assignee: string, blockedReason: string
//   ClosedTicket    status 'closed'    closedAt: string, assignee?: string (optional)
// Each one is TicketBase & { ... }.
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

// @step 2 (core)
// A label per status, using fields only that status has:
//   'Open'   'Assigned to a1'   'Blocked: Waiting for design'   'Closed on 2026-10-28' (the date part of closedAt)
// Use a switch on ticket.status.
export function statusLabel(ticket: Ticket): string {
  throw new Error('TODO: step 2');
}

// @step 3 (core)
// Make statusLabel exhaustive: in a `default:` branch, assign ticket to a variable of type `never`.
// If someone later adds a status, statusLabel stops compiling until it handles it.
// (The checker adds an 'archived' status to a copy of this file and expects a compile error.)
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// @step 4 (core)
// Assign an open ticket. The result is an AssignedTicket (do not change `ticket`).
export function assign(ticket: OpenTicket, assignee: string): AssignedTicket {
  throw new Error('TODO: step 4');
}

// @step 5 (stretch)
// Close any ticket. Keep its assignee if it has one; never keep blockedReason.
// Build the result from the base fields, so no field of the old status sneaks in.
export function close(ticket: Ticket, closedAt: string): ClosedTicket {
  throw new Error('TODO: step 5');
}

// @step 6 (stretch)
// Return the assignee of a ticket, or undefined for an open ticket. Use `in` or the status: no `as`.
export function assigneeOf(ticket: Ticket): string | undefined {
  throw new Error('TODO: step 6');
}
