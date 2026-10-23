// 01-js/02 Array and object methods
// Check your work with:  yarn verify 01-js/02
//
// Use array methods (map, filter, find, some, every, reduce, toSorted, slice) instead of for loops.
// Never change the arrays you are given: the checker freezes them.
//
// A ticket: { id: 't1', title: 'Login page shows blank screen', status: 'open',
//             priority: 'low', createdAt: '2026-09-05T14:00:00Z', assignee: 'a1' }
// status is one of 'open' | 'assigned' | 'blocked' | 'closed'
// priority is one of 'low' | 'medium' | 'high' | 'urgent'

// Step 1 (core)
// Return the titles of all tickets, in the same order.
export function titles(tickets) {
  throw new Error('TODO: step 1');
}

// Step 2 (core)
// Return only the tickets that are not closed.
export function notClosed(tickets) {
  throw new Error('TODO: step 2');
}

// Step 3 (core)
// Return the ticket with this id, or undefined if there is none.
export function findById(tickets, id) {
  throw new Error('TODO: step 3');
}

// Step 4 (stretch)
// Return an object: { anyUrgent, allAssigned }
//   anyUrgent:   true if at least one ticket has priority 'urgent'
//   allAssigned: true if every ticket has an assignee
export function checkTickets(tickets) {
  throw new Error('TODO: step 4');
}

// Step 5 (core)
// Count tickets per priority. Every priority must be in the result, even with 0:
//   { low: 1, medium: 0, high: 2, urgent: 1 }
// Use reduce.
export function countByPriority(tickets) {
  throw new Error('TODO: step 5');
}

// Step 6 (core)
// Return a new array sorted by createdAt, newest first. The input must not change.
export function newestFirst(tickets) {
  throw new Error('TODO: step 6');
}

// Step 7 (stretch)
// Return an object from id to ticket: { t1: {...}, t2: {...} }.
// Use Object.fromEntries.
export function indexById(tickets) {
  throw new Error('TODO: step 7');
}

// Step 8 (core)
// The titles of the `n` newest tickets that are urgent or high priority and not closed.
// Chain the methods: filter, sort, slice, map.
export function hotList(tickets, n) {
  throw new Error('TODO: step 8');
}

// Step 9 (stretch)
// groupBy(items, keyFn) returns an object from key to the list of items with that key.
//   groupBy(tickets, (t) => t.status) // { open: [...], closed: [...] }
// Write it with reduce (do not use Object.groupBy).
export function groupBy(items, keyFn) {
  throw new Error('TODO: step 9');
}

// Step 10 (stretch)
// pipe(f, g, h) returns a function x => h(g(f(x))).
export function pipe(...fns) {
  throw new Error('TODO: step 10');
}
