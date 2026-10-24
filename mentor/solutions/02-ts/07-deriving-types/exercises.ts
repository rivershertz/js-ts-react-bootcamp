// 02-ts/07 Deriving types from values: worked solutions

// @step 1 (core)
export const STATUSES = ['open', 'assigned', 'blocked', 'closed'] as const;
export type Status = (typeof STATUSES)[number];

// @step 2 (core)
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
} as const satisfies Record<Priority, string>;
export type PriorityLabel = (typeof PRIORITY_LABELS)[Priority];

// @step 3 (core)
export function statusOptions(): { value: Status; label: string }[] {
  return STATUSES.map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }));
}

// @step 4 (stretch)
export type Ticket = { id: string; title: string; status: Status; priority: Priority };
export type TicketField = keyof Ticket;
