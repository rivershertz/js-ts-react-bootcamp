// 02-ts/05 Discriminated unions: one type per ticket state
//
// What you build: one type per ticket state, so an impossible ticket does not compile.
// Finished when:  `yarn verify 02-ts/05` shows ✓ for steps 1 to 5. Stretch steps are optional.
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
// Today Ticket is a bag of optional fields, so nonsense like an open ticket with closedAt is allowed.
// Replace it with four types joined in a union, using status as the discriminant:
//   OpenTicket      status 'open'      no extra fields
//   AssignedTicket  status 'assigned'  assignee: string
//   BlockedTicket   status 'blocked'   assignee: string, blockedReason: string
//   ClosedTicket    status 'closed'    closedAt: string, assignee?: string (optional)
// Each one is TicketBase & { ... }.
//
// Example:
//   const a: Ticket = { ...base, status: 'blocked', assignee: 'a1', blockedReason: 'Waiting' };   // compiles
//   const b: Ticket = { ...base, status: 'open', closedAt: '2026-10-28' };                        // error
//   const c: Ticket = { ...base, status: 'blocked', assignee: 'a1' };                             // error: no reason
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
// A label per status, using fields only that status has. Use a switch on ticket.status.
//
// Example:
//   statusLabel(openTicket)                                       // 'Open'
//   statusLabel({ ...base, status: 'assigned', assignee: 'a1' })  // 'Assigned to a1'
//   statusLabel({ ...base, status: 'blocked', assignee: 'a1', blockedReason: 'Waiting for design' })
//                                                                 // 'Blocked: Waiting for design'
//   statusLabel({ ...base, status: 'closed', closedAt: '2026-10-28T12:00:00Z' })
//                                                                 // 'Closed on 2026-10-28'
export function statusLabel(ticket: Ticket): string {
  throw new Error('TODO: step 2');
}

// @step 3 (core): exhaustive
// Make statusLabel exhaustive: in a `default:` branch, assign ticket to a variable of type `never`.
// If someone later adds a status, statusLabel stops compiling until it handles it.
//
// Example: the checker adds an 'archived' status to a copy of this file. Your file compiles;
// the copy must fail to compile inside statusLabel.
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// @step 4 (core): assign
// Assign an open ticket. The result is an AssignedTicket (do not change `ticket`).
//
// Example:
//   assign({ ...base, status: 'open' }, 'a1')
//   // { ...base, status: 'assigned', assignee: 'a1' }
export function assign(ticket: OpenTicket, assignee: string): AssignedTicket {
  throw new Error('TODO: step 4');
}

// @step 5 (core): close
// Close any ticket. Keep its assignee if it has one; never keep blockedReason.
// Build the result from the base fields, so no field of the old status sneaks in.
//
// Example:
//   close({ ...base, status: 'blocked', assignee: 'a1', blockedReason: 'Waiting' }, '2026-10-28')
//   // { ...base, status: 'closed', closedAt: '2026-10-28', assignee: 'a1' }   (no blockedReason)
//   close({ ...base, status: 'open' }, '2026-10-28')
//   // { ...base, status: 'closed', closedAt: '2026-10-28' }                   (no assignee)
export function close(ticket: Ticket, closedAt: string): ClosedTicket {
  throw new Error('TODO: step 5');
}

// @step 6 (stretch): assigneeOf
// Return the assignee of a ticket, or undefined for an open ticket. Use `in` or the status: no `as`.
//
// Example:
//   assigneeOf({ ...base, status: 'assigned', assignee: 'a1' })   // 'a1'
//   assigneeOf({ ...base, status: 'open' })                       // undefined
export function assigneeOf(ticket: Ticket): string | undefined {
  throw new Error('TODO: step 6');
}
