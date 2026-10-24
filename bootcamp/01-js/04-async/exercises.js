// 01-js/04 Async
// Check your work with:  yarn verify 01-js/04
//
// Steps 3 to 6 receive `client`, an axios instance already pointed at the ticket API:
//   const response = await client.get('/tickets/t1');   // GET /api/tickets/t1
//   response.data                                        // the parsed JSON
// When the server answers with an error status (404, 500...), axios throws.
// The error has error.response.status.

// Step 1 (core)
// Return a promise that resolves (with no value) after `ms` milliseconds. Use setTimeout.
export function wait(ms) {
  throw new Error('TODO: step 1');
}

// Step 2 (core)
// What does this print, in order? Return the letters as an array, for example ['A', 'B', 'C', 'D'].
//
//   console.log('A');
//   setTimeout(() => console.log('B'), 0);
//   Promise.resolve().then(() => console.log('C'));
//   console.log('D');
//
export function predictOrder() {
  throw new Error('TODO: step 2');
}

// Step 3 (core)
// Fetch one ticket and return its title. Use async / await.
export async function fetchTitle(client, id) {
  throw new Error('TODO: step 3');
}

// Step 4 (core)
// Like fetchTitle, but return the whole ticket, or null if the server says 404.
// Any other error must still be thrown.
export async function fetchTicketOrNull(client, id) {
  throw new Error('TODO: step 4');
}

// Step 5 (core)
// Fetch several tickets at the same time (not one after the other) and return them in the
// same order as `ids`. If one request fails, the whole call fails.
export async function fetchMany(client, ids) {
  throw new Error('TODO: step 5');
}

// Step 6 (core)
// Fetch several tickets at the same time, but do not fail if some are missing.
// Return { found: [tickets that loaded, in order], failed: [ids that did not load, in order] }.
export async function fetchSome(client, ids) {
  throw new Error('TODO: step 6');
}

// Step 7 (stretch)
// Return a promise that settles like `promise`, or rejects with new Error('Timed out')
// if `promise` takes longer than `ms`.
export function withTimeout(promise, ms) {
  throw new Error('TODO: step 7');
}

// Step 8 (stretch)
// Call `fn` (it returns a promise). If it rejects, try again, up to `times` attempts in total.
// Resolve with the first success, or reject with the last error.
export async function retry(fn, times) {
  throw new Error('TODO: step 8');
}
