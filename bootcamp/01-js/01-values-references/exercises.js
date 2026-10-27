// 01-js/01 Values and references
//
// What you build: the helpers a ticket app uses to change data without changing the original.
// Finished when:  `yarn verify 01-js/01` shows ✓ for steps 1 to 6. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or the
// Python to JavaScript cheat sheet in 00-setup/python-to-js.md). Nothing else is expected.
//
// Check your work with:  yarn verify 01-js/01
// Check one step with:   yarn verify 01-js/01/3
//
// Rule for every step: never change the objects or arrays you are given.
// The checker freezes them, so changing one makes the step fail.
//
// A ticket looks like: { id: 't1', title: 'Login page shows blank screen', status: 'open', priority: 'low' }

// Step 1 (core): copy a ticket
// What:   Return a new ticket object with the same fields as `ticket`.
// Result: copy !== ticket, copy.title === ticket.title, and changing copy.status leaves ticket.status alone.
// Needs:  spread, { ...obj } (slide "Spread copies one level").
export function copyTicket(ticket) {
  throw new Error('TODO: step 1');
}

// Step 2 (core): close a ticket
// What:   Return a copy of `ticket` with status 'closed' and a new field `closedAt` set to `closedAt`.
// Result: closeTicket({ id: 't1', status: 'open' }, '2026-10-28')
//           → { id: 't1', status: 'closed', closedAt: '2026-10-28' }, and the original is still 'open'.
// Needs:  { ...ticket, status: 'closed' } (slide "Update without changing").
export function closeTicket(ticket, closedAt) {
  throw new Error('TODO: step 2');
}

// Step 3 (core): a one-line label
// What:   Return the label shown for a ticket in a list: id · title · priority.
//         No title gives '(no title)'. No priority gives 'medium'. Use destructuring with default values.
// Result: ticketLabel({ id: 't1', title: 'Login page shows blank screen', priority: 'low' })
//           → 't1 · Login page shows blank screen · low'
//         ticketLabel({ id: 't2' }) → 't2 · (no title) · medium'
// Needs:  slides "Destructuring is unpacking" and "Destructuring, more shapes"; template strings `${x}` (cheat sheet).
export function ticketLabel(ticket) {
  throw new Error('TODO: step 3');
}

// Step 4 (core): toggle a status filter
// What:   `filters` looks like { statuses: ['open', 'blocked'], search: 'login' }.
//         Return new filters where `status` is added to `statuses` if it is missing, or removed if it is there.
//         Neither `filters` nor `filters.statuses` may change.
// Result: toggleStatus({ statuses: ['open'], search: '' }, 'closed') → { statuses: ['open', 'closed'], search: '' }
//         toggleStatus({ statuses: ['open'], search: '' }, 'open')   → { statuses: [], search: '' }
// Needs:  items.includes(x) (cheat sheet), [...items, x] and filter (slide "Update without changing").
//         filter gets its own lesson in 01-js/02; the one line on that slide is all you need here.
export function toggleStatus(filters, status) {
  throw new Error('TODO: step 4');
}

// Step 5 (core): replace one ticket
// What:   Return a new array where the ticket with the same id as `updated` is replaced by `updated`.
//         Every other ticket must be the very same object as before (not a copy).
// Result: replaceTicket([t1, t2], { ...t2, status: 'closed' }) → [t1 (the same object), the closed t2]
// Needs:  map with `cond ? a : b`, as on slide "Update without changing".
export function replaceTicket(tickets, updated) {
  throw new Error('TODO: step 5');
}

// Step 6 (core): remove one ticket
// What:   Return a new array without the ticket whose id is `id`.
// Result: removeTicket([t1, t2, t3], 't2') → [t1, t3], and the input still has three tickets.
// Needs:  filter (slide "Update without changing").
export function removeTicket(tickets, id) {
  throw new Error('TODO: step 6');
}

// Step 7 (stretch): compare contents
// What:   Return true if a and b have the same content: the same primitives, or arrays / plain objects
//         whose items have the same content, at any depth. Like Python's == on lists and dicts.
// Result: sameContent({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }) → true
//         sameContent([1, 2], [2, 1]) → false,  sameContent({ a: 1 }, { a: 1, b: 2 }) → false
// Needs:  typeof, Array.isArray and Object.keys (cheat sheet, "Checking values at run time"),
//         and a function that calls itself for the items inside, as you would in Python.
export function sameContent(a, b) {
  throw new Error('TODO: step 7');
}

// Step 8 (stretch): freeze every level
// What:   Freeze `value` and every object or array inside it, at any depth. Return `value`.
// Result: after deepFreeze(ticket), changing ticket.tags or ticket.owner.name throws.
// Needs:  Object.freeze and Object.values (cheat sheet). Object.freeze is shallow, like spread,
//         so call deepFreeze on each value inside, as in step 7.
export function deepFreeze(value) {
  throw new Error('TODO: step 8');
}
