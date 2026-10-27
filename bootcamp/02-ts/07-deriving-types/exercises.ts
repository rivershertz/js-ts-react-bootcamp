// 02-ts/07 Deriving types from values
//
// What you build: lists of values written once, with their types derived from them.
// Finished when:  `yarn verify 02-ts/07` shows ✓ for steps 1 to 3. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Write each value once and let TypeScript derive the types from it.
// Check your work with:  yarn verify 02-ts/07
// The checker reads the `// @step N` markers below, so keep them.

// @step 1 (core): Status from STATUSES
// What:   Make STATUSES a readonly tuple of its exact strings, then derive Status from it.
//         Status must be exactly 'open' | 'assigned' | 'blocked' | 'closed', with no other strings allowed.
// Result: const s: Status = 'archived' is an error;  adding a status to STATUSES adds it to Status.
// Needs:  slide "as const keeps the exact values".
export const STATUSES = ['open', 'assigned', 'blocked', 'closed'];
export type Status = string; // TODO: derive from STATUSES

// @step 2 (core): labels with satisfies
// What:   PRIORITIES is done for you. Give PRIORITY_LABELS a label for every priority.
//         Use `satisfies` so a missing or misspelled key is an error,
//         while PriorityLabel stays the exact label strings ('Low' | 'Medium' | ...).
// Result: removing urgent from PRIORITY_LABELS is an error;  PriorityLabel is 'Low' | 'Medium' | 'High' | 'Urgent'.
// Needs:  slide "satisfies: check without widening".
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
// What:   statusOptions() builds the options for a status dropdown from STATUSES.
//         Each option is { value, label } where label is the status with a capital first letter.
//         The return type must say that value is a Status, not just any string.
// Result: statusOptions() → [{ value: 'open', label: 'Open' }, { value: 'assigned', label: 'Assigned' }, ...]
// Needs:  slide "From values to UI";  s[0].toUpperCase() + s.slice(1) (cheat sheet, "Strings and numbers").
export function statusOptions() {
  // TODO
  return [] as { value: string; label: string }[];
}

// @step 4 (stretch): keys of a type
// What:   TicketField is the union of the keys of Ticket: 'id' | 'title' | 'status' | 'priority'.
// Result: adding a field to Ticket adds it to TicketField.
// Needs:  slide "The type operators".
export type Ticket = { id: string; title: string; status: Status; priority: Priority };
export type TicketField = string; // TODO: derive from Ticket
