// Shared by the Phase 3 exercises: a ticket type and a few sample tickets. Done for you.
export const STATUSES = ['open', 'assigned', 'blocked', 'closed'] as const;
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export type Ticket = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee?: string;
  dueDate: string | null;
  createdAt: string;
};

export const sampleTickets: Ticket[] = [
  { id: 't1', title: 'Login page shows blank screen', status: 'open', priority: 'low', dueDate: null, createdAt: '2026-09-05T14:00:00Z' },
  { id: 't2', title: 'Export to CSV drops last row', status: 'assigned', priority: 'medium', assignee: 'a1', dueDate: '2026-10-02', createdAt: '2026-07-12T09:30:00Z' },
  { id: 't3', title: 'Search ignores Hebrew characters', status: 'blocked', priority: 'high', assignee: 'a4', dueDate: null, createdAt: '2026-10-14T09:15:00Z' },
  { id: 't4', title: 'Dashboard loads slowly', status: 'closed', priority: 'urgent', dueDate: '2026-12-02', createdAt: '2026-07-08T11:00:00Z' },
  { id: 't5', title: 'Wrong timezone on due dates', status: 'open', priority: 'low', dueDate: '2026-09-19', createdAt: '2026-07-18T16:45:00Z' },
  { id: 't6', title: 'Password reset email not sent', status: 'assigned', priority: 'medium', assignee: 'a1', dueDate: '2026-10-12', createdAt: '2026-09-18T08:20:00Z' },
];
