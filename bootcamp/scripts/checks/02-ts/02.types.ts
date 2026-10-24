// Type-level checks for 02-ts/02. The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import {
  closeTicket,
  createTicket,
  indexById,
  type Assignee,
  type ClosedTicket,
  type Ticket,
  type TicketFilter,
} from '../../../02-ts/02-basics/exercises.ts';

// @step 1
// Assignee should be exactly { id: string; name: string }.
export type S1 = Expect<Equal<Assignee, { id: string; name: string }>>;

// @step 2
// Ticket should have: readonly id, title, optional description, priority, status, createdAt (all strings) and dueDate: string | null.
export type S2 = Expect<
  Equal<
    Ticket,
    {
      readonly id: string;
      title: string;
      description?: string;
      priority: string;
      status: string;
      createdAt: string;
      dueDate: string | null;
    }
  >
>;

// @step 3
// createTicket should take (id: string, title: string, priority?: string).
export type S3 = Expect<Equal<Parameters<typeof createTicket>, [id: string, title: string, priority?: string]>>;
// createTicket should return a Ticket.
export type S3b = Expect<Equal<ReturnType<typeof createTicket>, Ticket>>;

// @step 4
// ClosedTicket should have every field of Ticket, plus closedAt.
export type S4 = Expect<Equal<keyof ClosedTicket, keyof Ticket | 'closedAt'>>;
// closedAt should be a string.
export type S4b = Expect<Equal<ClosedTicket['closedAt'], string>>;
// closeTicket should return a ClosedTicket.
export type S4c = Expect<Equal<ReturnType<typeof closeTicket>, ClosedTicket>>;

// @step 6
// TicketFilter should be (ticket: Ticket) => boolean.
export type S6 = Expect<Equal<TicketFilter, (ticket: Ticket) => boolean>>;

// @step 7
// indexById should return Record<string, Ticket>.
export type S7 = Expect<Equal<ReturnType<typeof indexById>, Record<string, Ticket>>>;
