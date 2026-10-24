// 01-js/05 Modules, step 1
// Make PRIORITIES and comparePriority importable from other files (named exports).

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Most urgent first:  tickets.toSorted(comparePriority)
export function comparePriority(a, b) {
  return PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority);
}
