// 01-js/05 Modules, steps 6 and 7
import { comparePriority, formatTicket, overdueTickets } from './index.js';

// Step 6 (core)
export function overdueReport(tickets, now = new Date()) {
  return overdueTickets(tickets, now).toSorted(comparePriority).map(formatTicket);
}

// Step 7 (stretch)
export async function loadFormatter() {
  const module = await import('./format.js');
  return module.default;
}
