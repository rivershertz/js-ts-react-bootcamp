// 01-js/05 Modules, step 3
// Move isOverdue into a new file next to this one, dates.js, and export it from there.
// Then import it here, so overdueTickets keeps working.
import { isOverdue } from './dates.js';

export function overdueTickets(tickets, now = new Date()) {
  return tickets.filter((t) => isOverdue(t, now));
}
