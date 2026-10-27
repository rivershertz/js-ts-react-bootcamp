// 01-js/03 Scope and closures
//
// What you build: small function factories that remember things between calls, using closures.
// Finished when:  `yarn verify 01-js/03` shows ✓ for steps 1 to 4. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or the
// Python to JavaScript cheat sheet in 00-setup/python-to-js.md). Nothing else is expected.
//
// Fill in each function. Check your work with:  yarn verify 01-js/03
// Check one step with:                          yarn verify 01-js/03/2

// Step 1 (core): a counter
// What:   makeCounter() returns an object with two functions:
//           increment() adds 1 to the count and returns the new count
//           current()   returns the count without changing it
//         Two counters made by two calls must not share their count.
// Result: const c = makeCounter(); c.increment(); c.increment() → 2; c.current() → 2;
//         a second makeCounter() starts again at 0.
// Needs:  slide "The backpack".
export function makeCounter() {
  throw new Error('TODO: step 1');
}

// Step 2 (core): once
// What:   once(fn) returns a new function that calls fn the first time it is called,
//         and after that returns the first result again without calling fn.
// Result: const load = once(() => 42); load() → 42; load() → 42, and fn ran one time only.
// Needs:  slide "Change the backpack".
export function once(fn) {
  throw new Error('TODO: step 2');
}

// Step 3 (core): memoize
// What:   memoize(fn) returns a new function that takes one argument.
//         The first time it sees an argument it calls fn(argument) and remembers the result.
//         Next time it sees the same argument it returns the remembered result without calling fn.
// Result: const sq = memoize((n) => n * n); sq(4) → 16 (fn called); sq(4) → 16 (fn not called again).
// Needs:  slide "What goes in the backpack"; a Map to remember results: map.has, map.get, map.set (cheat sheet).
export function memoize(fn) {
  throw new Error('TODO: step 3');
}

// Step 4 (core): id generator
// What:   createIdGenerator(prefix) returns a function that produces ids, counting from 1.
// Result: const nextId = createIdGenerator('T');
//           nextId(); // 'T-1'
//           nextId(); // 'T-2'
//         A second generator starts again at 1.
// Needs:  slide "The backpack".
export function createIdGenerator(prefix) {
  throw new Error('TODO: step 4');
}

// Step 5 (stretch): debounce
// What:   debounce(fn, ms) returns a new function. Each call restarts a timer of `ms` milliseconds.
//         fn runs only when the timer finishes, with the arguments of the last call.
// Result: calling d('a'), d('b'), d('c') less than ms apart runs fn('c') once, ms after the last call.
// Needs:  timers are taught in 01-js/04. All you need now: const id = setTimeout(fn, ms) and
//         clearTimeout(id) (cheat sheet, "Dates and timers"), and (...args) => fn(...args) to pass every argument on.
export function debounce(fn, ms) {
  throw new Error('TODO: step 5');
}
