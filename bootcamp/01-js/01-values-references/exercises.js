// 01-js/01 Values and references
//
// What you build: the helpers a ticket app uses to change data without changing the original.
// Finished when:  `yarn verify 01-js/01` shows ✓ for steps 1 to 6. Stretch steps are optional.
//
// Check your work with:  yarn verify 01-js/01
// Check one step with:   yarn verify 01-js/01/3
//
// Rule for every step: never change the objects or arrays you are given.
// The checker freezes them, so changing one makes the step fail.
//
// A ticket looks like: { id: 't1', title: 'Login page shows blank screen', status: 'open', priority: 'low' }

/**
 * The types below are only for your editor: hover a parameter to see what it is.
 * @typedef {'open' | 'assigned' | 'blocked' | 'closed'} Status
 * @typedef {'low' | 'medium' | 'high' | 'urgent'} Priority
 * @typedef {{ id: string, title: string, status: Status, priority: Priority }} Ticket
 * @typedef {{ statuses: Status[], search: string }} Filters
 */

/**
 * Step 1 (core): copy a ticket
 * Return a new ticket object with the same fields as `ticket`.
 * Changing the copy must not change the original.
 *
 * @example
 * const copy = copyTicket(ticket);
 * copy === ticket;              // false: a different object
 * copy.title === ticket.title;  // true: the same fields
 * copy.status = 'closed';       // ticket.status is still 'open'
 *
 * @param {Ticket} ticket
 * @returns {Ticket}
 */
export function copyTicket(ticket) {
  throw new Error('TODO: step 1');
}

/**
 * Step 2 (core): close a ticket
 * Return a new ticket like `ticket`, but with status 'closed' and a `closedAt` field set to `closedAt`.
 *
 * @example
 * closeTicket({ id: 't1', title: 'Login', status: 'open', priority: 'low' }, '2026-10-28');
 * // returns { id: 't1', title: 'Login', status: 'closed', priority: 'low', closedAt: '2026-10-28' }
 *
 * @param {Ticket} ticket
 * @param {string} closedAt  a date, for example '2026-10-28'
 * @returns {Ticket & { closedAt: string }}
 */
export function closeTicket(ticket, closedAt) {
  throw new Error('TODO: step 2');
}

/**
 * Step 3 (core): a one-line label
 * Return the label shown for a ticket in a list: its id, title and priority, joined with ' · '.
 * If the ticket has no title, use '(no title)'. If it has no priority, use 'medium'.
 * Use destructuring with default values.
 *
 * @example
 * ticketLabel({ id: 't1', title: 'Login page shows blank screen', priority: 'low' });
 * // returns 't1 · Login page shows blank screen · low'
 *
 * ticketLabel({ id: 't2' });
 * // returns 't2 · (no title) · medium'
 *
 * @param {{ id: string, title?: string, priority?: Priority }} ticket
 * @returns {string}
 */
export function ticketLabel(ticket) {
  throw new Error('TODO: step 3');
}

/**
 * Step 4 (core): toggle a status filter
 * Return new filters where `status` is added to `filters.statuses` if it is missing,
 * or removed if it is there. Neither `filters` nor `filters.statuses` may change.
 *
 * @example
 * toggleStatus({ statuses: ['open'], search: 'login' }, 'closed');
 * // returns { statuses: ['open', 'closed'], search: 'login' }
 *
 * toggleStatus({ statuses: ['open'], search: 'login' }, 'open');
 * // returns { statuses: [], search: 'login' }
 *
 * @param {Filters} filters
 * @param {Status} status
 * @returns {Filters}
 */
export function toggleStatus(filters, status) {
  throw new Error('TODO: step 4');
}

/**
 * Step 5 (core): replace one ticket
 * Return a new array where the ticket with the same id as `updated` is replaced by `updated`.
 * Every other ticket must be the very same object as before (not a copy).
 *
 * @example
 * const result = replaceTicket([t1, t2, t3], { ...t2, status: 'closed' });
 * // result is [t1, <the closed t2>, t3]
 * result[0] === t1;  // true: untouched tickets are the same objects
 *
 * @param {Ticket[]} tickets
 * @param {Ticket} updated
 * @returns {Ticket[]}
 */
export function replaceTicket(tickets, updated) {
  throw new Error('TODO: step 5');
}

/**
 * Step 6 (core): remove one ticket
 * Return a new array without the ticket whose id is `id`.
 *
 * @example
 * removeTicket([t1, t2, t3], 't2');
 * // returns [t1, t3], and the array you passed in still has three tickets
 *
 * @param {Ticket[]} tickets
 * @param {string} id
 * @returns {Ticket[]}
 */
export function removeTicket(tickets, id) {
  throw new Error('TODO: step 6');
}

/**
 * Step 7 (stretch): compare contents
 * Return true if a and b have the same content: the same primitives, or arrays / plain objects
 * whose items have the same content, at any depth. Like Python's == on lists and dicts.
 * New here: typeof, Array.isArray and Object.keys are in the cheat sheet (00-setup/python-to-js.md).
 *
 * @example
 * sameContent({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] });  // true
 * sameContent([1, 2], [2, 1]);                              // false: different order
 * sameContent({ a: 1 }, { a: 1, b: 2 });                    // false: b is extra
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function sameContent(a, b) {
  throw new Error('TODO: step 7');
}

/**
 * Step 8 (stretch): freeze every level
 * Freeze `value` and every object or array inside it, at any depth. Return `value`.
 * New here: Object.freeze and Object.values are in the cheat sheet. Object.freeze is shallow, like spread.
 *
 * @example
 * const t = deepFreeze({ id: 't1', tags: ['ui'], owner: { name: 'Dana' } });
 * t.tags.push('bug');       // throws: the inner array is frozen too
 * t.owner.name = 'Noa';     // throws
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function deepFreeze(value) {
  throw new Error('TODO: step 8');
}
