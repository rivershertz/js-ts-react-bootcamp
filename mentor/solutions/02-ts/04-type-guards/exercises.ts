// 02-ts/04 Type guards (solution)

export type Status = 'open' | 'assigned' | 'blocked' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export const STATUSES: readonly Status[] = ['open', 'assigned', 'blocked', 'closed'];
export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];

export type Assignee = { id: string; name: string };
export type Ticket = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  dueDate: string | null;
};

// @step 1 (core)
export function isPriority(value: unknown): value is Priority {
  return PRIORITIES.some((p) => p === value);
}

// @step 2 (core)
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// @step 3 (core)
export function isAssignee(value: unknown): value is Assignee {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string';
}

// @step 4 (core)
function isStatus(value: unknown): value is Status {
  return STATUSES.some((s) => s === value);
}
export function isTicket(value: unknown): value is Ticket {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    isStatus(value.status) &&
    isPriority(value.priority) &&
    typeof value.createdAt === 'string' &&
    (value.dueDate === null || typeof value.dueDate === 'string')
  );
}

// @step 5 (stretch)
export function assertTicket(value: unknown): asserts value is Ticket {
  if (!isTicket(value)) {
    const id = isRecord(value) && typeof value.id === 'string' ? value.id : '?';
    throw new Error(`Not a valid ticket: ${id}`);
  }
}

// @step 6 (core)
export function parseTickets(data: unknown): { tickets: Ticket[]; invalid: number } {
  if (!Array.isArray(data)) throw new Error('Expected a list of tickets');
  const tickets = data.filter(isTicket);
  return { tickets, invalid: data.length - tickets.length };
}

// @step 7 (stretch)
export function ticketProblems(value: unknown): string[] {
  if (!isRecord(value)) return ['not an object'];
  const problems: string[] = [];
  for (const field of ['id', 'title'] as const) {
    if (typeof value[field] !== 'string') problems.push(`${field} must be a string`);
  }
  if (!isStatus(value.status)) problems.push(`status must be one of ${STATUSES.join(', ')}`);
  if (!isPriority(value.priority)) problems.push(`priority must be one of ${PRIORITIES.join(', ')}`);
  if (typeof value.createdAt !== 'string') problems.push('createdAt must be a string');
  if (value.dueDate !== null && typeof value.dueDate !== 'string') problems.push('dueDate must be a string or null');
  return problems;
}
