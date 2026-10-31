// 01-js/03 Scope and closures: worked solutions

export function makeGreeter(greeting) {
  return (name) => `${greeting}, ${name}!`;
}

export function byStatus(status) {
  return (ticket) => ticket.status === status;
}

export function makeTicker() {
  let n = 0;
  return () => {
    n = n + 1;
    return n;
  };
}

export function makeCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    current: () => count,
  };
}

export function makeTicketQueue() {
  const titles = [];
  return {
    add: (title) => titles.push(title),
    next: () => titles.shift(),
    size: () => titles.length,
  };
}

export function predictClosures() {
  // A: readStatus reads the variable when it is called, after it changed.
  // B: saved copied the string before the change.
  // C: the backpack holds the same object, and the object was changed.
  // D: the backpack holds the variable title, and it was reassigned before label ran.
  return ['closed', 'open', 'Login page is blank', 'BUG'];
}

export function makeHandlers(labels) {
  const handlers = [];
  // let makes a new i for every turn of the loop; var shared one i that ended at labels.length.
  for (let i = 0; i < labels.length; i++) {
    handlers.push(() => `${i + 1}. ${labels[i]}`);
  }
  return handlers;
}

export function countCalls(fn) {
  let calls = 0;
  return {
    call: (...args) => {
      calls++;
      return fn(...args);
    },
    count: () => calls,
  };
}

export function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

export function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}

export function createIdGenerator(prefix) {
  let n = 0;
  return () => `${prefix}-${++n}`;
}

export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    getState: () => state,
    setState: (next) => {
      state = next;
      for (const listener of listeners) listener(state);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
