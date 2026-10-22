// 01-js/05 Modules, step 4
// Re-export everything from one place, so the rest of the code can write
//   import { PRIORITIES, formatTicket, isOverdue } from './index.js';
export { PRIORITIES, comparePriority } from './priorities.js';
export { default as formatTicket } from './format.js';
export { isOverdue } from './dates.js';
export { overdueTickets } from './tickets.js';
