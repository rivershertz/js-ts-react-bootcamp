// Shared ticket types for the migration exercise. Already TypeScript: import from here.
//   import { isTicket, type Ticket } from './types.ts';

export type Status = 'open' | 'assigned' | 'blocked' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Ticket = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  dueDate: string | null;
};

const STATUSES: readonly Status[] = ['open', 'assigned', 'blocked', 'closed'];
const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];

export function isTicket(value: unknown): value is Ticket {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const t: Record<string, unknown> = { ...value };
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    STATUSES.some((s) => s === t.status) &&
    PRIORITIES.some((p) => p === t.priority) &&
    typeof t.createdAt === 'string' &&
    (t.dueDate === null || typeof t.dueDate === 'string')
  );
}
