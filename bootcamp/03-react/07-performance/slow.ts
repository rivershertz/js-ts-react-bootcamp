// Done for you: a filter that is slow on purpose (about 60 ms per call), so wasted work
// is something you can feel in the playground and see in the Performance tab.
import type { Ticket } from '../tickets';

export function filterByTitle(tickets: Ticket[], search: string): Ticket[] {
  const until = performance.now() + 60;
  while (performance.now() < until) {
    // Pretend to work hard.
  }
  const text = search.trim().toLowerCase();
  return tickets.filter((ticket) => ticket.title.toLowerCase().includes(text));
}
