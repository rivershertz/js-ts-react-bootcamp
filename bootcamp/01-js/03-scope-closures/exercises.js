// 01-js/03 Scope and closures
//
// What you build: small function factories that remember things between calls, using closures.
// The steps climb slowly: a function that returns a function, then one that remembers a value,
// then several functions sharing one backpack, then wrappers around other functions.
// Finished when:  `yarn verify 01-js/03` shows ✓ for steps 1 to 11. Stretch steps are optional.
//
// Fill in each function. Check your work with:  yarn verify 01-js/03
// Check one step with:                          yarn verify 01-js/03/2

/**
 * Step 1 (core): a greeter
 * Return a function. When that function is called with a name, it returns the greeting,
 * a comma, a space, the name and an exclamation mark.
 *
 * @example
 * const hello = makeGreeter('Hello');
 * hello('Dana');               // returns 'Hello, Dana!'
 * hello('Avi');                // returns 'Hello, Avi!'
 * makeGreeter('Hi')('Noa');    // returns 'Hi, Noa!'
 *
 * @param {string} greeting
 * @returns {(name: string) => string}
 */
export function makeGreeter(greeting) {
  throw new Error('TODO: step 1');
}

/**
 * Step 2 (core): a filter made to order
 * Return a function that takes a ticket and returns true when its status is `status`.
 * The result is ready to hand to .filter() or .some().
 *
 * @example
 * const tickets = [{ id: 't1', status: 'open' }, { id: 't2', status: 'closed' }, { id: 't3', status: 'open' }];
 * tickets.filter(byStatus('open'));     // returns [{ id: 't1', ... }, { id: 't3', ... }]
 * tickets.some(byStatus('blocked'));    // returns false
 *
 * @param {string} status
 * @returns {(ticket: { status: string }) => boolean}
 */
export function byStatus(status) {
  throw new Error('TODO: step 2');
}

/**
 * Step 3 (core): a ticker
 * Return a function that returns 1 the first time it is called, then 2, then 3, and so on.
 * Each ticker made by a new call starts again at 1.
 *
 * @example
 * const tick = makeTicker();
 * tick();          // returns 1
 * tick();          // returns 2
 * tick();          // returns 3
 * makeTicker()();  // returns 1: a new ticker has its own count
 *
 * @returns {() => number}
 */
export function makeTicker() {
  throw new Error('TODO: step 3');
}

/**
 * Step 4 (core): a counter
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
  throw new Error('TODO: step 4');
}

/**
 * Step 5 (core): a private queue
 * Return an object with three functions that share one list of ticket titles:
 *   add(title)  puts the title at the end and returns how many titles are waiting
 *   next()      removes the first title and returns it, or returns undefined when none are waiting
 *   size()      returns how many titles are waiting
 * The list itself must not be on the object: the only way to change it is through these three functions.
 *
 * @example
 * const queue = makeTicketQueue();
 * queue.add('Login bug');     // returns 1
 * queue.add('Slow search');   // returns 2
 * queue.next();               // returns 'Login bug'
 * queue.size();               // returns 1
 * queue.next();               // returns 'Slow search'
 * queue.next();               // returns undefined
 * Object.keys(queue);         // returns ['add', 'next', 'size']: no list to reach from outside
 *
 * @returns {{ add: (title: string) => number, next: () => string | undefined, size: () => number }}
 */
export function makeTicketQueue() {
  throw new Error('TODO: step 5');
}

/**
 * Step 6 (core): predict what the closures return
 * Read the code below without running it. What do A, B, C and D return?
 * Return the four answers as an array of strings, in order.
 *
 *   let status = 'open';
 *   const readStatus = () => status;
 *   const saved = status;
 *   status = 'closed';
 *   readStatus();              // A
 *   saved;                     // B
 *
 *   function makeReader(ticket) {
 *     return () => ticket.title;
 *   }
 *   const ticket = { title: 'Login bug' };
 *   const readTitle = makeReader(ticket);
 *   ticket.title = 'Login page is blank';
 *   readTitle();               // C
 *
 *   function makeLabel(title) {
 *     const label = () => title;
 *     title = title.toUpperCase();
 *     return label;
 *   }
 *   makeLabel('bug')();        // D
 *
 * @example
 * predictClosures();
 * // returns four strings, for example ['open', 'open', 'Login bug', 'bug'] (that one is wrong)
 *
 * @returns {string[]}
 */
export function predictClosures() {
  throw new Error('TODO: step 6');
}

/**
 * Step 7 (core): fix the loop
 * This function is already written, and it has a bug. It should return one function per label,
 * and each function should return its own position and label. Instead, every function returns
 * the same wrong text. Fix it by changing as little as possible.
 *
 * @example
 * const handlers = makeHandlers(['Login bug', 'Slow search']);
 * handlers[0]();  // should return '1. Login bug'
 * handlers[1]();  // should return '2. Slow search'
 *
 * @param {string[]} labels
 * @returns {(() => string)[]}
 */
export function makeHandlers(labels) {
  var handlers = [];
  for (var i = 0; i < labels.length; i++) {
    handlers.push(() => `${i + 1}. ${labels[i]}`);
  }
  return handlers;
}

/**
 * Step 8 (core): count the calls
 * Return an object with two functions:
 *   call(...args)  calls fn with the same arguments and returns what fn returned
 *   count()        returns how many times call has been used so far
 *
 * @example
 * const add = countCalls((a, b) => a + b);
 * add.count();      // returns 0
 * add.call(2, 3);   // returns 5
 * add.call(1, 1);   // returns 2
 * add.count();      // returns 2
 *
 * @template R
 * @param {(...args: any[]) => R} fn
 * @returns {{ call: (...args: any[]) => R, count: () => number }}
 */
export function countCalls(fn) {
  throw new Error('TODO: step 8');
}

/**
 * Step 9 (core): once
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
  throw new Error('TODO: step 9');
}

/**
 * Step 10 (core): memoize
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
  throw new Error('TODO: step 10');
}

/**
 * Step 11 (core): id generator
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
  throw new Error('TODO: step 11');
}

/**
 * Step 12 (stretch): debounce
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
  throw new Error('TODO: step 12');
}

/**
 * Step 13 (stretch): a tiny store
 * Return an object that keeps one value and tells listeners when it changes:
 *   getState()          returns the current value
 *   setState(next)      replaces the value, then calls every listener with the new value
 *   subscribe(listener) adds a listener and returns a function that removes that listener again
 * This is the idea behind the state libraries you will meet in React apps.
 *
 * @example
 * const store = createStore(0);
 * const stop = store.subscribe((value) => console.log('now', value));
 * store.setState(1);   // logs 'now 1'
 * store.getState();    // returns 1
 * stop();
 * store.setState(2);   // logs nothing: the listener was removed
 *
 * @template T
 * @param {T} initial
 * @returns {{ getState: () => T, setState: (next: T) => void, subscribe: (listener: (value: T) => void) => () => void }}
 */
export function createStore(initial) {
  throw new Error('TODO: step 13');
}
