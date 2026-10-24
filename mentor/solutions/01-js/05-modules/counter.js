// 01-js/05 Modules, step 5
// Every file that imports `count` sees the current value: imports are live bindings.
export let count = 0;

export function increment() {
  count += 1;
}
