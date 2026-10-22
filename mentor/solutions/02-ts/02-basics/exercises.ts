// 02-ts/02 Basics (solution)

// @step 1 (core)
export type Assignee = { id: string; name: string };

// @step 2 (core)
export type Ticket = {
  readonly id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  createdAt: string;
  dueDate: string | null;
};

// @step 3 (core)
export function createTicket(id: string, title: string, priority = 'medium'): Ticket {
  return { id, title, priority, status: 'open', createdAt: new Date().toISOString(), dueDate: null };
}

// @step 4 (core)
export interface ClosedTicket extends Ticket {
  closedAt: string;
}
export function closeTicket(ticket: Ticket, closedAt: string): ClosedTicket {
  return { ...ticket, status: 'closed', closedAt };
}

// @step 5 (core)
export function addTicket(tickets: readonly Ticket[], ticket: Ticket): readonly Ticket[] {
  return [...tickets, ticket];
}

// @step 6 (core)
export type TicketFilter = (ticket: Ticket) => boolean;
export const isOpen: TicketFilter = (ticket) => ticket.status !== 'closed';

// @step 7 (stretch)
export function indexById(tickets: readonly Ticket[]): Record<string, Ticket> {
  return Object.fromEntries(tickets.map((t) => [t.id, t]));
}
