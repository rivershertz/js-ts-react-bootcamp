// 01-js/02 Array and object methods
//
// What you build: the list helpers behind a ticket table: pick, filter, find, count, sort and index.
// Finished when:  `yarn verify 01-js/02` shows ✓ for steps 1 to 8. Stretch steps are optional.
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

/**
 * The types below are only for your editor: hover a parameter to see what it is.
 * @typedef {'open' | 'assigned' | 'blocked' | 'closed'} Status
 * @typedef {'low' | 'medium' | 'high' | 'urgent'} Priority
 * @typedef {{ id: string, title: string, status: Status, priority: Priority, createdAt: string, assignee?: string }} Ticket
 */

/**
 * Step 1 (core): titles
 * Return the titles of all tickets, in the same order.
 *
 * @example
 * titles([t1, t2]);
 * // returns ['Login page shows blank screen', 'Export to CSV drops last row']
 *
 * @param {Ticket[]} tickets
 * @returns {string[]}
 */
export function titles(tickets) {
  throw new Error('TODO: step 1');
}

/**
 * Step 2 (core): not closed
 * Return only the tickets that are not closed, in the same order.
 *
 * @example
 * notClosed([openTicket, closedTicket, blockedTicket]);
 * // returns [openTicket, blockedTicket]
 *
 * @param {Ticket[]} tickets
 * @returns {Ticket[]}
 */
export function notClosed(tickets) {
  throw new Error('TODO: step 2');
}

/**
 * Step 3 (core): find by id
 * Return the ticket with this id, or undefined if there is none.
 *
 * @example
 * findById([t1, t2], 't2');    // returns t2 (the same object)
 * findById([t1, t2], 'nope');  // returns undefined
 *
 * @param {Ticket[]} tickets
 * @param {string} id
 * @returns {Ticket | undefined}
 */
export function findById(tickets, id) {
  throw new Error('TODO: step 3');
}

/**
 * Step 4 (core): any urgent, all assigned
 * Return an object with two booleans:
 *   anyUrgent:   true if at least one ticket has priority 'urgent'
 *   allAssigned: true if every ticket has an assignee
 *
 * @example
 * checkTickets([
 *   { id: 't1', priority: 'urgent', assignee: 'a1', ... },
 *   { id: 't2', priority: 'low', ... },             // no assignee
 * ]);
 * // returns { anyUrgent: true, allAssigned: false }
 *
 * @param {Ticket[]} tickets
 * @returns {{ anyUrgent: boolean, allAssigned: boolean }}
 */
export function checkTickets(tickets) {
  throw new Error('TODO: step 4');
}

/**
 * Step 5 (core): count per priority
 * Count the tickets of each priority. Every priority must be in the result, even with 0. Use reduce.
 *
 * @example
 * countByPriority([lowTicket, highTicket, highTicket, urgentTicket]);
 * // returns { low: 1, medium: 0, high: 2, urgent: 1 }
 *
 * @param {Ticket[]} tickets
 * @returns {Record<Priority, number>}
 */
export function countByPriority(tickets) {
  throw new Error('TODO: step 5');
}

/**
 * Step 6 (core): newest first
 * Return a new array sorted by createdAt, newest first. The input must not change.
 *
 * @example
 * newestFirst([createdSep1, createdSep5, createdSep3]);
 * // returns [createdSep5, createdSep3, createdSep1]
 *
 * @param {Ticket[]} tickets
 * @returns {Ticket[]}
 */
export function newestFirst(tickets) {
  throw new Error('TODO: step 6');
}

/**
 * Step 7 (core): index by id
 * Return an object from id to ticket. Use Object.fromEntries.
 *
 * @example
 * indexById([t1, t2]);
 * // returns { t1: t1, t2: t2 }
 *
 * @param {Ticket[]} tickets
 * @returns {Record<string, Ticket>}
 */
export function indexById(tickets) {
  throw new Error('TODO: step 7');
}

/**
 * Step 8 (core): the hot list
 * Return the titles of the `n` newest tickets that are urgent or high priority and not closed.
 * Chain the methods: filter, toSorted, slice, map.
 *
 * @example
 * hotList([
 *   { title: 'A', priority: 'urgent', status: 'open',   createdAt: '2026-09-01T10:00:00Z', ... },
 *   { title: 'B', priority: 'high',   status: 'closed', createdAt: '2026-09-05T10:00:00Z', ... },
 *   { title: 'C', priority: 'high',   status: 'open',   createdAt: '2026-09-03T10:00:00Z', ... },
 *   { title: 'D', priority: 'low',    status: 'open',   createdAt: '2026-09-04T10:00:00Z', ... },
 * ], 2);
 * // returns ['C', 'A']: B is closed, D is low; C is newer than A
 *
 * @param {Ticket[]} tickets
 * @param {number} n
 * @returns {string[]}
 */
export function hotList(tickets, n) {
  throw new Error('TODO: step 8');
}

/**
 * Step 9 (stretch): groupBy
 * Return an object from key to the list of items with that key. keyFn gives each item's key.
 * Write it with reduce (do not use Object.groupBy).
 *
 * @example
 * groupBy([open1, closed1, open2], (t) => t.status);
 * // returns { open: [open1, open2], closed: [closed1] }
 *
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string} keyFn
 * @returns {Record<string, T[]>}
 */
export function groupBy(items, keyFn) {
  throw new Error('TODO: step 9');
}

/**
 * Step 10 (stretch): pipe
 * Return a function that passes its argument through every function in `fns`, left to right:
 * pipe(f, g, h) returns x => h(g(f(x))).
 *
 * @example
 * const addOneThenDouble = pipe((x) => x + 1, (x) => x * 2);
 * addOneThenDouble(3);  // returns 8
 * pipe()(3);            // returns 3
 *
 * @param {...((value: unknown) => unknown)} fns
 * @returns {(value: unknown) => unknown}
 */
export function pipe(...fns) {
  throw new Error('TODO: step 10');
}
