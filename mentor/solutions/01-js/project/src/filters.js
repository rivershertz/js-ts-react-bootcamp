import { PRIORITIES } from './constants.js';

// Keep the tickets that match every filter that is set. A filter that is
// missing or empty does not filter anything. search matches the title, ignoring case.
export function filterTickets(tickets, filters = {}) {
  const { status, priority, assignee, search = '' } = filters;
  const text = search.trim().toLowerCase();
  return tickets.filter(
    (t) =>
      (!status || t.status === status) &&
      (!priority || t.priority === priority) &&
      (!assignee || t.assignee === assignee) &&
      (!text || t.title.toLowerCase().includes(text)),
  );
}

const compareBy = {
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
  priority: (a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority),
  title: (a, b) => a.title.localeCompare(b.title),
};

// Return a sorted copy. Ascending priority means low first.
export function sortTickets(tickets, { by = 'createdAt', direction = 'asc' } = {}) {
  const sign = direction === 'desc' ? -1 : 1;
  if (by === 'dueDate') {
    // Stretch: tickets without a due date go last, whatever the direction.
    return tickets.toSorted((a, b) => {
      if (a.dueDate == null || b.dueDate == null) return Number(a.dueDate == null) - Number(b.dueDate == null);
      return sign * a.dueDate.localeCompare(b.dueDate);
    });
  }
  const compare = compareBy[by];
  return tickets.toSorted((a, b) => sign * compare(a, b));
}
