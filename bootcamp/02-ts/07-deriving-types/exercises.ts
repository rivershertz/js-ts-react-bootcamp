// 02-ts/07 Deriving types from values
//
// What you build: lists of values written once, with their types derived from them.
// Finished when:  `yarn verify 02-ts/07` shows ✓ for steps 1 to 3. Stretch steps are optional.
//
// Write each value once and let TypeScript derive the types from it.
// Check your work with:  yarn verify 02-ts/07
// The checker reads the `// @step N` markers below, so keep them.

// @step 1 (core): Status from STATUSES
// Make STATUSES a readonly tuple of its exact strings, then derive Status from it.
// Status must be exactly 'open' | 'assigned' | 'blocked' | 'closed', with no other strings allowed.
//
// Example:
//   const s: Status = 'open';       // compiles
//   const t: Status = 'archived';   // error
//   // add 'archived' to STATUSES, and the second line compiles too
export const STATUSES = ['open', 'assigned', 'blocked', 'closed'];
export type Status = string; // TODO: derive from STATUSES

// @step 2 (core): labels with satisfies
// PRIORITIES is done for you. Give PRIORITY_LABELS a label for every priority.
// Use `satisfies` so a missing or misspelled key is an error,
// while PriorityLabel stays the exact label strings.
//
// Example:
//   PRIORITY_LABELS.high   // 'High'
//   type PriorityLabel     // 'Low' | 'Medium' | 'High' | 'Urgent'
//   // remove urgent from PRIORITY_LABELS: error
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}; // TODO: add `as const` and `satisfies`
export type PriorityLabel = string; // TODO: derive from PRIORITY_LABELS

// @step 3 (core): dropdown options
// statusOptions() builds the options for a status dropdown from STATUSES.
// Each option is { value, label } where label is the status with a capital first letter.
// The return type must say that value is a Status, not just any string.
//
// Example:
//   statusOptions()
//   // [{ value: 'open', label: 'Open' }, { value: 'assigned', label: 'Assigned' },
//   //  { value: 'blocked', label: 'Blocked' }, { value: 'closed', label: 'Closed' }]
export function statusOptions() {
  // TODO
  return [] as { value: string; label: string }[];
}

// @step 4 (stretch): keys of a type
// TicketField is the union of the keys of Ticket.
//
// Example:
//   type TicketField   // 'id' | 'title' | 'status' | 'priority'
export type Ticket = { id: string; title: string; status: Status; priority: Priority };
export type TicketField = string; // TODO: derive from Ticket
