import type { Status } from './constants.ts';
import type { Ticket, TicketStats } from './types.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

// { open: [...], assigned: [...], blocked: [...], closed: [...] }, every status present.
export function groupByStatus(tickets: readonly Ticket[]): Record<Status, Ticket[]> {
  return {
    open: tickets.filter((t) => t.status === 'open'),
    assigned: tickets.filter((t) => t.status === 'assigned'),
    blocked: tickets.filter((t) => t.status === 'blocked'),
    closed: tickets.filter((t) => t.status === 'closed'),
  };
}

export function computeStats(tickets: readonly Ticket[], now: Date = new Date()): TicketStats {
  const today = now.toISOString().slice(0, 10);
  const open = tickets.filter((t) => t.status !== 'closed');
  const overdue = open.filter((t) => t.dueDate !== null && t.dueDate < today);
  const ages = open.map((t) => Math.floor((now.getTime() - new Date(t.createdAt).getTime()) / DAY_MS));
  const average = ages.length === 0 ? 0 : ages.reduce((sum, age) => sum + age, 0) / ages.length;
  return {
    total: tickets.length,
    open: open.length,
    overdue: overdue.length,
    averageAgeDays: Math.round(average * 10) / 10,
  };
}

// 'Open', 'Assigned to a1', 'Blocked: Waiting for design', 'Closed on 2026-10-28'
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

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
