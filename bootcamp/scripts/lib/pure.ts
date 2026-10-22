/** Freeze a value and everything inside it, so any mutation throws. */
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value)) deepFreeze(v);
  }
  return value;
}

/**
 * Call a junior's function with frozen copies of its arguments.
 * If it tries to change them, explain that instead of showing a cryptic TypeError.
 */
export function callPure<A extends unknown[], R>(fn: (...args: A) => R, ...args: A): R {
  // Functions (like a keyFn) cannot be cloned, and freezing them is pointless: pass them through.
  const frozen = args.map((a) => (typeof a === 'function' ? a : deepFreeze(structuredClone(a)))) as A;
  try {
    return fn(...frozen);
  } catch (e) {
    if (e instanceof TypeError && /read only|read-only|not extensible|Cannot (add|delete|assign)|object is not extensible/i.test(e.message)) {
      throw new Error(`Your function changed one of its inputs (${e.message}). Build and return a new object or array instead.`);
    }
    throw e;
  }
}
