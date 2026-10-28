// 01-js/04 Async
//
// What you build: the async helpers that load tickets from the API: wait, load one, load many, survive failures.
// Finished when:  `yarn verify 01-js/04` shows ✓ for steps 1 to 6. Stretch steps are optional.
//
// Check your work with:  yarn verify 01-js/04
//
// Steps 3 to 6 receive `client`, an axios instance already pointed at the ticket API:
//   const response = await client.get('/tickets/t1');   // GET /api/tickets/t1
//   response.data                                        // the parsed JSON
// When the server answers with an error status (404, 500...), axios throws.
// The error has error.response.status.

/**
 * The types below are only for your editor: hover a parameter to see what it is.
 * @typedef {{ id: string, title: string, status: string, priority: string }} Ticket
 * @typedef {import('axios').AxiosInstance} Client
 */

/**
 * Step 1 (core): wait
 * Return a promise that resolves (with no value) after `ms` milliseconds. Use setTimeout.
 *
 * @example
 * await wait(100);  // carries on about 100 ms later
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function wait(ms) {
  throw new Error('TODO: step 1');
}

/**
 * Step 2 (core): predict the order
 * What does this print, in order? Return the letters as an array.
 *
 *   console.log('A');
 *   setTimeout(() => console.log('B'), 0);
 *   Promise.resolve().then(() => console.log('C'));
 *   console.log('D');
 *
 * @example
 * predictOrder();
 * // returns the four letters in the order they print, for example ['A', 'B', 'C', 'D'] (that one is wrong)
 *
 * @returns {string[]}
 */
export function predictOrder() {
  throw new Error('TODO: step 2');
}

/**
 * Step 3 (core): fetch one title
 * Fetch one ticket (GET /tickets/<id>) and return its title. Use async / await.
 *
 * @example
 * await fetchTitle(client, 't1');
 * // returns 'Login page shows blank screen'
 *
 * @param {Client} client
 * @param {string} id
 * @returns {Promise<string>}
 */
export async function fetchTitle(client, id) {
  throw new Error('TODO: step 3');
}

/**
 * Step 4 (core): fetch, or null on 404
 * Like fetchTitle, but return the whole ticket, or null if the server says 404.
 * Any other error must still be thrown.
 *
 * @example
 * await fetchTicketOrNull(client, 't1');    // returns { id: 't1', title: 'Login page shows blank screen', ... }
 * await fetchTicketOrNull(client, 'nope');  // returns null (the server said 404)
 * // if the server answers 500, the call throws
 *
 * @param {Client} client
 * @param {string} id
 * @returns {Promise<Ticket | null>}
 */
export async function fetchTicketOrNull(client, id) {
  throw new Error('TODO: step 4');
}

/**
 * Step 5 (core): fetch many at once
 * Fetch several tickets at the same time (not one after the other) and return them in the
 * same order as `ids`. If one request fails, the whole call fails.
 *
 * @example
 * await fetchMany(client, ['t2', 't1']);
 * // returns [<ticket t2>, <ticket t1>]
 * await fetchMany(client, ['t1', 'nope']);
 * // throws
 *
 * @param {Client} client
 * @param {string[]} ids
 * @returns {Promise<Ticket[]>}
 */
export async function fetchMany(client, ids) {
  throw new Error('TODO: step 5');
}

/**
 * Step 6 (core): fetch some, survive failures
 * Fetch several tickets at the same time, but do not fail if some are missing.
 * Return the tickets that loaded and the ids that did not, both in the order of `ids`.
 *
 * @example
 * await fetchSome(client, ['t1', 'nope', 't2']);
 * // returns { found: [<ticket t1>, <ticket t2>], failed: ['nope'] }
 *
 * @param {Client} client
 * @param {string[]} ids
 * @returns {Promise<{ found: Ticket[], failed: string[] }>}
 */
export async function fetchSome(client, ids) {
  throw new Error('TODO: step 6');
}

/**
 * Step 7 (stretch): time out
 * Return a promise that settles like `promise`, or rejects with new Error('Timed out')
 * if `promise` takes longer than `ms`.
 *
 * @example
 * await withTimeout(wait(50).then(() => 'done'), 100);  // returns 'done'
 * await withTimeout(wait(500), 100);                     // throws Error('Timed out') after 100 ms
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms
 * @returns {Promise<T>}
 */
export function withTimeout(promise, ms) {
  throw new Error('TODO: step 7');
}

/**
 * Step 8 (stretch): retry
 * Call `fn` (it returns a promise). If it rejects, try again, up to `times` attempts in total.
 * Resolve with the first success, or reject with the last error.
 *
 * @example
 * // fn fails twice, then returns 'ok'
 * await retry(fn, 3);  // returns 'ok' (fn was called 3 times)
 * await retry(fn, 2);  // throws the second error
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {number} times
 * @returns {Promise<T>}
 */
export async function retry(fn, times) {
  throw new Error('TODO: step 8');
}
