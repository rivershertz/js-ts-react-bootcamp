// 01-js/01 Values and references
// Check your work with:  yarn verify 01-js/01
// Check one step with:   yarn verify 01-js/01/3
//
// Rule for every step: never change the objects or arrays you are given.
// The checker freezes them, so changing one makes the step fail.
//
// A ticket looks like: { id: 't1', title: 'Login page shows blank screen', status: 'open', priority: 'low' }

// Step 1 (core)
// Return a new ticket object with the same fields as `ticket`.
// Changing the copy must not change the original.
export function copyTicket(ticket) {
  throw new Error('TODO: step 1');
}

// Step 2 (core)
// Return a new ticket like `ticket`, but with status 'closed' and a `closedAt` field set to `closedAt`.
export function closeTicket(ticket, closedAt) {
  throw new Error('TODO: step 2');
}

// Step 3 (core)
// Return a label like 't1 · Login page shows blank screen · low'.
// If the ticket has no title, use '(no title)'. If it has no priority, use 'medium'.
// Use destructuring with default values.
export function ticketLabel(ticket) {
  throw new Error('TODO: step 3');
}

// Step 4 (core)
// `filters` looks like { statuses: ['open', 'blocked'], search: 'login' }.
// Return new filters where `status` is added to `statuses` if it is missing, or removed if it is there.
// Neither `filters` nor `filters.statuses` may change.
export function toggleStatus(filters, status) {
  throw new Error('TODO: step 4');
}

// Step 5 (core)
// Return a new array where the ticket with the same id as `updated` is replaced by `updated`.
// Every other ticket must be the very same object as before (not a copy).
export function replaceTicket(tickets, updated) {
  throw new Error('TODO: step 5');
}

// Step 6 (core)
// Return a new array without the ticket whose id is `id`.
export function removeTicket(tickets, id) {
  throw new Error('TODO: step 6');
}

// Step 7 (stretch)
// Return true if a and b have the same content: same primitives, or arrays / plain objects
// whose items are the same content, at any depth. Like Python's == on lists and dicts.
export function sameContent(a, b) {
  throw new Error('TODO: step 7');
}

// Step 8 (stretch)
// Freeze `value` and every object or array inside it (Object.freeze is shallow). Return `value`.
export function deepFreeze(value) {
  throw new Error('TODO: step 8');
}
