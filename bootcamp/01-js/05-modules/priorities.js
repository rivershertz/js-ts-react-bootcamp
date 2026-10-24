// 01-js/05 Modules, step 1
// Make PRIORITIES and comparePriority importable from other files (named exports).
/* eslint-disable @typescript-eslint/no-unused-vars -- step 1 is to export these */

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Most urgent first:  tickets.toSorted(comparePriority)
function comparePriority(a, b) {
  return PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority);
}
