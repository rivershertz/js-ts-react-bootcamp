// 02-ts/05 Discriminated unions (solution)

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketBase = {
  id: string;
  title: string;
  priority: Priority;
  createdAt: string;
  dueDate: string | null;
};

// @step 1 (core)
export type OpenTicket = TicketBase & { status: 'open' };
export type AssignedTicket = TicketBase & { status: 'assigned'; assignee: string };
export type BlockedTicket = TicketBase & { status: 'blocked'; assignee: string; blockedReason: string };
export type ClosedTicket = TicketBase & { status: 'closed'; closedAt: string; assignee?: string };
export type Ticket = OpenTicket | AssignedTicket | BlockedTicket | ClosedTicket;

// @step 2 (core)
export function statusLabel(ticket: Ticket): string {
  switch (ticket.status) {
    case 'open':
      return 'Open';
    case 'assigned':
      return `Assigned to ${ticket.assignee}`;
    case 'blocked':
      return `Blocked: ${ticket.blockedReason}`;
    case 'closed':
      return `Closed on ${ticket.closedAt.slice(0, 10)}`;
    default:
      return assertNever(ticket);
  }
}

// @step 3 (core)
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// @step 4 (core)
export function assign(ticket: OpenTicket, assignee: string): AssignedTicket {
  return { ...ticket, status: 'assigned', assignee };
}

// @step 5 (core)
export function close(ticket: Ticket, closedAt: string): ClosedTicket {
  const { id, title, priority, createdAt, dueDate } = ticket;
  const base = { id, title, priority, createdAt, dueDate };
  return ticket.status === 'open' ? { ...base, status: 'closed', closedAt } : { ...base, status: 'closed', closedAt, assignee: ticket.assignee };
}

// @step 6 (stretch)
export function assigneeOf(ticket: Ticket): string | undefined {
  return ticket.status === 'open' ? undefined : ticket.assignee;
}
