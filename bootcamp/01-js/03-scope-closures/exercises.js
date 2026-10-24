// 01-js/03 Scope and closures
// Fill in each function. Check your work with:  yarn verify 01-js/03
// Check one step with:                          yarn verify 01-js/03/2

// Step 1 (core)
// makeCounter() returns an object with two functions:
//   increment() adds 1 to the count and returns the new count
//   current()   returns the count without changing it
// Two counters made by two calls must not share their count.
export function makeCounter() {
  throw new Error('TODO: step 1');
}

// Step 2 (core)
// once(fn) returns a new function that calls fn the first time it is called,
// and after that returns the first result again without calling fn.
export function once(fn) {
  throw new Error('TODO: step 2');
}

// Step 3 (core)
// memoize(fn) returns a new function that takes one argument.
// The first time it sees an argument it calls fn(argument) and remembers the result.
// Next time it sees the same argument it returns the remembered result without calling fn.
export function memoize(fn) {
  throw new Error('TODO: step 3');
}

// Step 4 (core)
// createIdGenerator(prefix) returns a function that produces ids:
//   const nextId = createIdGenerator('T');
//   nextId(); // 'T-1'
//   nextId(); // 'T-2'
export function createIdGenerator(prefix) {
  throw new Error('TODO: step 4');
}

// Step 5 (stretch)
// debounce(fn, ms) returns a new function. Each call restarts a timer of `ms` milliseconds.
// fn runs only when the timer finishes, with the arguments of the last call.
export function debounce(fn, ms) {
  throw new Error('TODO: step 5');
}
