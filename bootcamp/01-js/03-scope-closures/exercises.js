// 01-js/03 Scope and closures
//
// What you build: small function factories that remember things between calls, using closures.
// Finished when:  `yarn verify 01-js/03` shows ✓ for steps 1 to 4. Stretch steps are optional.
//
// Fill in each function. Check your work with:  yarn verify 01-js/03
// Check one step with:                          yarn verify 01-js/03/2

/**
 * Step 1 (core): a counter
 * Return an object with two functions:
 *   increment() adds 1 to the count and returns the new count
 *   current()   returns the count without changing it
 * Two counters made by two calls must not share their count.
 *
 * @example
 * const a = makeCounter();
 * a.increment();  // returns 1
 * a.increment();  // returns 2
 * a.current();    // returns 2
 * const b = makeCounter();
 * b.current();    // returns 0: b has its own count
 *
 * @returns {{ increment: () => number, current: () => number }}
 */
export function makeCounter() {
  throw new Error('TODO: step 1');
}

/**
 * Step 2 (core): once
 * Return a new function that calls fn the first time it is called,
 * and after that returns the first result again without calling fn.
 *
 * @example
 * const load = once(() => { console.log('loading'); return 42; });
 * load();  // logs 'loading', returns 42
 * load();  // returns 42, logs nothing
 *
 * @template T
 * @param {() => T} fn
 * @returns {() => T}
 */
export function once(fn) {
  throw new Error('TODO: step 2');
}

/**
 * Step 3 (core): memoize
 * Return a new function that takes one argument. The first time it sees an argument it calls
 * fn(argument) and remembers the result. Next time it sees the same argument it returns the
 * remembered result without calling fn.
 *
 * @example
 * const square = memoize((n) => { console.log('computing', n); return n * n; });
 * square(4);  // logs 'computing 4', returns 16
 * square(4);  // returns 16, logs nothing
 * square(5);  // logs 'computing 5', returns 25
 *
 * @template A, R
 * @param {(arg: A) => R} fn
 * @returns {(arg: A) => R}
 */
export function memoize(fn) {
  throw new Error('TODO: step 3');
}

/**
 * Step 4 (core): id generator
 * Return a function that produces ids: the prefix, a dash, and a number counting from 1.
 *
 * @example
 * const nextId = createIdGenerator('T');
 * nextId();  // returns 'T-1'
 * nextId();  // returns 'T-2'
 * createIdGenerator('T')();  // returns 'T-1': a new generator starts again
 *
 * @param {string} prefix
 * @returns {() => string}
 */
export function createIdGenerator(prefix) {
  throw new Error('TODO: step 4');
}

/**
 * Step 5 (stretch): debounce
 * Return a new function. Each call restarts a timer of `ms` milliseconds.
 * fn runs only when the timer finishes, with the arguments of the last call.
 * New here: timers are taught in 01-js/04. The cheat sheet row "run something later" is all you need.
 *
 * @example
 * const save = debounce((text) => console.log('saved', text), 300);
 * save('a');
 * save('ab');
 * save('abc');
 * // 300 ms after the last call, logs 'saved abc' once
 *
 * @param {(...args: any[]) => void} fn
 * @param {number} ms
 * @returns {(...args: any[]) => void}
 */
export function debounce(fn, ms) {
  throw new Error('TODO: step 5');
}
