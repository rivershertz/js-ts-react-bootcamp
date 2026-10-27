// 01-js/02 Array and object methods
//
// What you build: the list helpers behind a ticket table: pick, filter, find, count, sort and index.
// Finished when:  `yarn verify 01-js/02` shows ✓ for steps 1 to 8. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or the
// Python to JavaScript cheat sheet in 00-setup/python-to-js.md). Nothing else is expected.
//
// Check your work with:  yarn verify 01-js/02
//
// Use array methods (map, filter, find, some, every, reduce, toSorted, slice) instead of for loops.
// Never change the arrays you are given: the checker freezes them.
//
// A ticket: { id: 't1', title: 'Login page shows blank screen', status: 'open',
//             priority: 'low', createdAt: '2026-09-05T14:00:00Z', assignee: 'a1' }
// status is one of 'open' | 'assigned' | 'blocked' | 'closed'
// priority is one of 'low' | 'medium' | 'high' | 'urgent'

// Step 1 (core): titles
// What:   Return the titles of all tickets, in the same order.
// Result: titles([t1, t2]) → ['Login page shows blank screen', 'Export to CSV drops last row']
// Needs:  map (slide "The toolbox").
export function titles(tickets) {
  throw new Error('TODO: step 1');
}

// Step 2 (core): not closed
// What:   Return only the tickets that are not closed.
// Result: 3 open tickets and 1 closed one → the 3 open ones, in their order.
// Needs:  filter (slide "The toolbox").
export function notClosed(tickets) {
  throw new Error('TODO: step 2');
}

// Step 3 (core): find by id
// What:   Return the ticket with this id, or undefined if there is none.
// Result: findById(tickets, 't2') → the t2 object itself;  findById(tickets, 'nope') → undefined
// Needs:  find (slide "The toolbox").
export function findById(tickets, id) {
  throw new Error('TODO: step 3');
}

// Step 4 (core): any urgent, all assigned
// What:   Return an object: { anyUrgent, allAssigned }
//           anyUrgent:   true if at least one ticket has priority 'urgent'
//           allAssigned: true if every ticket has an assignee
// Result: one urgent ticket and one without an assignee → { anyUrgent: true, allAssigned: false }
// Needs:  some and every (slide "The toolbox").
export function checkTickets(tickets) {
  throw new Error('TODO: step 4');
}

// Step 5 (core): count per priority
// What:   Count tickets per priority. Every priority must be in the result, even with 0. Use reduce.
// Result: { low: 1, medium: 0, high: 2, urgent: 1 }
// Needs:  reduce (slide "How reduce builds one value"). Start from { low: 0, medium: 0, high: 0, urgent: 0 }.
export function countByPriority(tickets) {
  throw new Error('TODO: step 5');
}

// Step 6 (core): newest first
// What:   Return a new array sorted by createdAt, newest first. The input must not change.
// Result: tickets created on 09-01, 09-05, 09-03 → 09-05, 09-03, 09-01. The input keeps its order.
// Needs:  toSorted with a compare function (slide "Writing a compare function").
//         ISO dates like '2026-09-05T14:00:00Z' compare correctly as text.
export function newestFirst(tickets) {
  throw new Error('TODO: step 6');
}

// Step 7 (core): index by id
// What:   Return an object from id to ticket. Use Object.fromEntries.
// Result: indexById([t1, t2]) → { t1: t1, t2: t2 }
// Needs:  Object.fromEntries on [id, ticket] pairs (slide "Objects as dictionaries").
export function indexById(tickets) {
  throw new Error('TODO: step 7');
}

// Step 8 (core): the hot list
// What:   The titles of the `n` newest tickets that are urgent or high priority and not closed.
//         Chain the methods: filter, toSorted, slice, map.
// Result: hotList(tickets, 2) → the 2 titles, newest first. Fewer matches than n gives just those.
// Needs:  slide "Chaining".
export function hotList(tickets, n) {
  throw new Error('TODO: step 8');
}

// Step 9 (stretch): groupBy
// What:   groupBy(items, keyFn) returns an object from key to the list of items with that key.
//         Write it with reduce (do not use Object.groupBy).
// Result: groupBy(tickets, (t) => t.status) → { open: [...], closed: [...] }
// Needs:  reduce, starting from {}.
export function groupBy(items, keyFn) {
  throw new Error('TODO: step 9');
}

// Step 10 (stretch): pipe
// What:   pipe(f, g, h) returns a function x => h(g(f(x))).
// Result: pipe((x) => x + 1, (x) => x * 2)(3) → 8;  pipe()(3) → 3
// Needs:  ...fns collects every argument into an array, like Python's *args (cheat sheet, "Functions").
//         Then reduce over the functions.
export function pipe(...fns) {
  throw new Error('TODO: step 10');
}
