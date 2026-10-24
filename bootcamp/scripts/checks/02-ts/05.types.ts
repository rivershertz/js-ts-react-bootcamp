// Type-level checks for 02-ts/05. The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import type {
  AssignedTicket,
  BlockedTicket,
  ClosedTicket,
  OpenTicket,
  Ticket,
  TicketBase,
} from '../../../02-ts/05-discriminated-unions/exercises.ts';

const base: TicketBase = { id: 't1', title: 'Login page', priority: 'low', createdAt: '2026-09-05T14:00:00Z', dueDate: null };

// @step 1
// Ticket should be the union OpenTicket | AssignedTicket | BlockedTicket | ClosedTicket.
export type S1 = Expect<Equal<Ticket, OpenTicket | AssignedTicket | BlockedTicket | ClosedTicket>>;
// AssignedTicket should have assignee: string (required).
export type S1b = Expect<Equal<AssignedTicket['assignee'], string>>;
// BlockedTicket should have blockedReason: string (required).
export type S1c = Expect<Equal<BlockedTicket['blockedReason'], string>>;

// An open ticket must not be allowed to have closedAt.
// @ts-expect-error
export const openWithClosedAt: Ticket = { id: base.id, title: base.title, priority: base.priority, createdAt: base.createdAt, dueDate: null, status: 'open', closedAt: '2026-10-28T12:00:00Z' };

// An assigned ticket must not be allowed without an assignee.
// @ts-expect-error
export const assignedWithoutAssignee: Ticket = { ...base, status: 'assigned' };

// A closed ticket must not be allowed without closedAt.
// @ts-expect-error
export const closedWithoutDate: Ticket = { ...base, status: 'closed' };

// A closed ticket may keep its assignee.
export const closedWithAssignee: Ticket = { ...base, status: 'closed', closedAt: '2026-10-28T12:00:00Z', assignee: 'a1' };
