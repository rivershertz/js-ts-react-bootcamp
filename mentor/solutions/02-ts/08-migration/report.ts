// The weekly overdue report, migrated to strict TypeScript (solution).
import type { AxiosInstance } from 'axios';
import { isTicket, type Priority, type Ticket } from './types.ts';

export const PRIORITY_WEIGHT = { low: 1, medium: 2, high: 3, urgent: 5 } as const satisfies Record<Priority, number>;

// today looks like '2026-10-20'
export function isOverdue(ticket: Ticket, today: string): boolean {
  return ticket.status !== 'closed' && ticket.dueDate !== null && ticket.dueDate < today;
}

export function weight(ticket: Ticket): number {
  return PRIORITY_WEIGHT[ticket.priority];
}

// One line per overdue ticket, heaviest first: 't2 Export to CSV drops last row (due 2026-10-02)'
export function reportLines(tickets: readonly Ticket[], today: string): string[] {
  return tickets
    .filter((t) => isOverdue(t, today))
    .toSorted((a, b) => weight(b) - weight(a))
    .map((t) => `${t.id} ${t.title} (due ${t.dueDate})`);
}

// Average weight, rounded to one decimal: 2.7
export function averageWeight(tickets: readonly Ticket[]): number {
  if (tickets.length === 0) return 0;
  const total = tickets.reduce((sum, t) => sum + weight(t), 0);
  return Math.round((total / tickets.length) * 10) / 10;
}

// client is an axios instance pointed at the API
export async function fetchReport(client: AxiosInstance, today: string): Promise<string[]> {
  const response = await client.get<unknown>('/tickets');
  const data = Array.isArray(response.data) ? response.data : [];
  return reportLines(data.filter(isTicket), today);
}
