// 01-js/04 Async
//
// What you build: the async helpers that load tickets from the API: wait, load one, load many, survive failures.
// Finished when:  `yarn verify 01-js/04` shows ✓ for steps 1 to 6. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or the
// Python to JavaScript cheat sheet in 00-setup/python-to-js.md). Nothing else is expected.
//
// Check your work with:  yarn verify 01-js/04
//
// Steps 3 to 6 receive `client`, an axios instance already pointed at the ticket API:
//   const response = await client.get('/tickets/t1');   // GET /api/tickets/t1
//   response.data                                        // the parsed JSON
// When the server answers with an error status (404, 500...), axios throws.
// The error has error.response.status.

// Step 1 (core): wait
// What:   Return a promise that resolves (with no value) after `ms` milliseconds. Use setTimeout.
// Result: await wait(100) carries on about 100 ms later.
// Needs:  new Promise((resolve) => ...) and setTimeout (slides "A promise is a value that arrives later" and "Feel the difference").
export function wait(ms) {
  throw new Error('TODO: step 1');
}

// Step 2 (core): predict the order
// What:   What does this print, in order? Return the letters as an array, for example ['A', 'B', 'C', 'D'].
//
//           console.log('A');
//           setTimeout(() => console.log('B'), 0);
//           Promise.resolve().then(() => console.log('C'));
//           console.log('D');
//
// Result: an array of the four letters in the order they print.
// Needs:  slide "The event loop".
export function predictOrder() {
  throw new Error('TODO: step 2');
}

// Step 3 (core): fetch one title
// What:   Fetch one ticket and return its title. Use async / await.
// Result: await fetchTitle(client, 't1') → 'Login page shows blank screen'
// Needs:  slide "async / await reads like normal code", and response.data (top of this file).
export async function fetchTitle(client, id) {
  throw new Error('TODO: step 3');
}

// Step 4 (core): fetch, or null on 404
// What:   Like fetchTitle, but return the whole ticket, or null if the server says 404.
//         Any other error must still be thrown.
// Result: 't1' → the ticket object;  an unknown id → null;  a 500 from the server → throws.
// Needs:  slide "Errors: try / catch around await"; error.response?.status (?. is in the cheat sheet:
//         error.response is missing when the server cannot be reached).
export async function fetchTicketOrNull(client, id) {
  throw new Error('TODO: step 4');
}

// Step 5 (core): fetch many at once
// What:   Fetch several tickets at the same time (not one after the other) and return them in the
//         same order as `ids`. If one request fails, the whole call fails.
// Result: fetchMany(client, ['t2', 't1']) → [ticket t2, ticket t1], with both requests sent together.
// Needs:  Promise.all with map (slide "One after another, or all at once?").
export async function fetchMany(client, ids) {
  throw new Error('TODO: step 5');
}

// Step 6 (core): fetch some, survive failures
// What:   Fetch several tickets at the same time, but do not fail if some are missing.
//         Return { found: [tickets that loaded, in order], failed: [ids that did not load, in order] }.
// Result: fetchSome(client, ['t1', 'nope', 't2']) → { found: [t1, t2], failed: ['nope'] }
// Needs:  Promise.allSettled (slide "all or allSettled?").
export async function fetchSome(client, ids) {
  throw new Error('TODO: step 6');
}

// Step 7 (stretch): time out
// What:   Return a promise that settles like `promise`, or rejects with new Error('Timed out')
//         if `promise` takes longer than `ms`.
// Result: withTimeout(fast, 100) → fast's value;  withTimeout(wait(500), 100) → rejects with 'Timed out'.
// Needs:  new Promise((resolve, reject) => ...) as in step 1. Only the first resolve or reject call
//         counts; later calls do nothing. (Promise.race does this in one line, if you want to look it up.)
export function withTimeout(promise, ms) {
  throw new Error('TODO: step 7');
}

// Step 8 (stretch): retry
// What:   Call `fn` (it returns a promise). If it rejects, try again, up to `times` attempts in total.
//         Resolve with the first success, or reject with the last error.
// Result: fn fails twice, then works: retry(fn, 3) → the value, after 3 calls. Fails 3 times: rejects with the third error.
// Needs:  a for loop with try / catch around await (slide "Errors: try / catch around await").
export async function retry(fn, times) {
  throw new Error('TODO: step 8');
}
