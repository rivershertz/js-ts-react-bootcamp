// 01-js/05 Modules, step 2
// 1. Import PRIORITIES from priorities.js (this file uses it but cannot see it yet).
// 2. Make formatTicket the default export of this file.
import { PRIORITIES } from './priorities.js';

// '[P1] t3 Search ignores Hebrew characters'   (P1 = urgent ... P4 = low)
export default function formatTicket(ticket) {
  const rank = PRIORITIES.length - PRIORITIES.indexOf(ticket.priority);
  return `[P${rank}] ${ticket.id} ${ticket.title}`;
}
