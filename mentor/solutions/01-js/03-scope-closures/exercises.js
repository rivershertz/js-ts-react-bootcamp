// 01-js/03 Scope and closures: worked solutions

export function makeCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    current: () => count,
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
