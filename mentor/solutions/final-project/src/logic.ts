// In the full bootcamp this comes from your own Phase 2 code. The POC keeps a small copy here.
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Ticket = {
  id: string;
  title: string;
  status: 'open' | 'assigned' | 'blocked' | 'closed';
  priority: Priority;
  createdAt: string;
  assignee?: string;
};

export type Assignee = { id: string; name: string };
export type SortBy = 'newest' | 'priority';

export function filterTickets(tickets: Ticket[], { search = '', assignee }: { search?: string; assignee?: string } = {}) {
  const text = search.trim().toLowerCase();
  return tickets.filter(
    (t) => (!text || t.title.toLowerCase().includes(text)) && (!assignee || t.assignee === assignee),
  );
}

export function compareTickets(by: SortBy): (a: Ticket, b: Ticket) => number {
  if (by === 'priority') return (a, b) => PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority);
  return (a, b) => b.createdAt.localeCompare(a.createdAt);
}
