// 02-ts/07 Deriving types from values
// Write each value once and let TypeScript derive the types from it.
// Check your work with:  yarn verify 02-ts/07
// The checker reads the `// @step N` markers below, so keep them.

// @step 1 (core)
// Make STATUSES a readonly tuple of its exact strings, then derive Status from it.
// Status must be exactly 'open' | 'assigned' | 'blocked' | 'closed', with no other strings allowed.
export const STATUSES = ['open', 'assigned', 'blocked', 'closed'];
export type Status = string; // TODO: derive from STATUSES

// @step 2 (core)
// PRIORITIES is done for you. Give PRIORITY_LABELS a label for every priority.
// Use `satisfies` so a missing or misspelled key is an error,
// while PriorityLabel stays the exact label strings ('Low' | 'Medium' | ...).
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}; // TODO: add `as const` and `satisfies`
export type PriorityLabel = string; // TODO: derive from PRIORITY_LABELS

// @step 3 (core)
// statusOptions() builds the options for a status dropdown from STATUSES.
// Each option is { value, label } where label is the status with a capital first letter.
// The return type must say that value is a Status, not just any string.
export function statusOptions() {
  // TODO
  return [] as { value: string; label: string }[];
}

// @step 4 (stretch)
// TicketField is the union of the keys of Ticket: 'id' | 'title' | 'status' | 'priority'.
export type Ticket = { id: string; title: string; status: Status; priority: Priority };
export type TicketField = string; // TODO: derive from Ticket
