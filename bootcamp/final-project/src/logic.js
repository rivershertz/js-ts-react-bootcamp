// In the full bootcamp this comes from your own Phase 2 code. The POC keeps a small copy here.
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export function filterTickets(tickets, { search = '', assignee } = {}) {
  const text = search.trim().toLowerCase();
  return tickets.filter(
    (t) => (!text || t.title.toLowerCase().includes(text)) && (!assignee || t.assignee === assignee),
  );
}

export function compareTickets(by) {
  if (by === 'priority') return (a, b) => PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority);
  return (a, b) => b.createdAt.localeCompare(a.createdAt);
}
