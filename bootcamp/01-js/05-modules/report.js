// 01-js/05 Modules, steps 6 and 7

// Step 6 (core)
// Import what you need from './index.js' only (not from the other files directly).
// Return the overdue tickets as formatted lines, most urgent first:
//   ['[P1] t10 Avatar upload fails over 2MB', '[P3] t2 Export to CSV drops last row', ...]
// Tickets with the same priority keep their original order.
export function overdueReport(tickets, now = new Date()) {
  throw new Error('TODO: step 6');
}

// Step 7 (stretch)
// Load format.js only when this function is called, with import('./format.js').
// Return its default export (the formatTicket function).
export async function loadFormatter() {
  throw new Error('TODO: step 7');
}
