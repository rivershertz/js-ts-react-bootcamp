// 01-js/04 Async
//
// What you build: the async helpers that load tickets from the API: wait, load one, load many, survive failures.
// The steps climb slowly: promises without a network first (steps 1 to 6), then one request,
// then many requests, one after another and then all at once.
// Finished when:  `yarn verify 01-js/04` shows ✓ for steps 1 to 11. Stretch steps are optional.
//
// Check your work with:  yarn verify 01-js/04
//
// Steps 7 to 11 receive `client`, an axios instance already pointed at the ticket API:
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
 * Step 3 (core): predict the order with await
 * What does this print, in order? Return the letters as an array.
 *
 *   async function load() {
 *     console.log('B');
 *     await null;
 *     console.log('C');
 *   }
 *   console.log('A');
 *   load();
 *   console.log('D');
 *
 * @example
 * predictAwait();
 * // returns the four letters in the order they print, for example ['A', 'B', 'C', 'D'] (that one is wrong)
 *
 * @returns {string[]}
 */
export function predictAwait() {
  throw new Error('TODO: step 3');
}

/**
 * Step 4 (core): await a value
 * getNumber is a function that returns a promise of a number. Wait for that number and
 * return it doubled. Use async / await.
 *
 * @example
 * const getNumber = () => Promise.resolve(21);
 * await doubleLater(getNumber);   // returns 42
 * doubleLater(getNumber);         // without await: a promise, not 42
 *
 * @param {() => Promise<number>} getNumber
 * @returns {Promise<number>}
 */
export async function doubleLater(getNumber) {
  throw new Error('TODO: step 4');
}

/**
 * Step 5 (core): the same with .then
 * Older code chains .then instead of using await. Return a promise of getNumber's number plus 1,
 * using .then. Do not use async or await in this step.
 *
 * @example
 * const getNumber = () => Promise.resolve(41);
 * await addOneWithThen(getNumber);   // returns 42
 *
 * @param {() => Promise<number>} getNumber
 * @returns {Promise<number>}
 */
export function addOneWithThen(getNumber) {
  throw new Error('TODO: step 5');
}

/**
 * Step 6 (core): a fallback when a promise fails
 * Call load (it returns a promise) and return what it resolves with. If the promise rejects,
 * return `fallback` instead of throwing.
 *
 * @example
 * await loadOr(() => Promise.resolve(['t1']), []);                     // returns ['t1']
 * await loadOr(() => Promise.reject(new Error('Server down')), []);    // returns []
 *
 * @template T
 * @param {() => Promise<T>} load
 * @param {T} fallback
 * @returns {Promise<T>}
 */
export async function loadOr(load, fallback) {
  throw new Error('TODO: step 6');
}

/**
 * Step 7 (core): fetch one title
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
  throw new Error('TODO: step 7');
}

/**
 * Step 8 (core): fetch, or null on 404
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
  throw new Error('TODO: step 8');
}

/**
 * Step 9 (core): fetch many, one after another
 * Fetch several tickets one at a time: start the next request only when the previous one has
 * answered. Return them in the same order as `ids`. If one request fails, the whole call fails.
 * Requests sometimes must not overlap, for example when each one changes data on the server.
 * Step 10 does the same with all the requests at once.
 *
 * @example
 * await fetchOneByOne(client, ['t2', 't1']);
 * // returns [<ticket t2>, <ticket t1>], and the server never had two requests at the same time
 *
 * @param {Client} client
 * @param {string[]} ids
 * @returns {Promise<Ticket[]>}
 */
export async function fetchOneByOne(client, ids) {
  throw new Error('TODO: step 9');
}

/**
 * Step 10 (core): fetch many at once
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
  throw new Error('TODO: step 10');
}

/**
 * Step 11 (core): fetch some, survive failures
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
  throw new Error('TODO: step 11');
}

/**
 * Step 12 (stretch): time out
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
  throw new Error('TODO: step 12');
}

/**
 * Step 13 (stretch): retry
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
  throw new Error('TODO: step 13');
}
