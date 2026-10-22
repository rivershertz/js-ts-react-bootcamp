// 01-js/02 Array and object methods: worked solutions

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export function titles(tickets) {
  return tickets.map((t) => t.title);
}

export function notClosed(tickets) {
  return tickets.filter((t) => t.status !== 'closed');
}

export function findById(tickets, id) {
  return tickets.find((t) => t.id === id);
}

export function checkTickets(tickets) {
  return {
    anyUrgent: tickets.some((t) => t.priority === 'urgent'),
    allAssigned: tickets.every((t) => Boolean(t.assignee)),
  };
}

export function countByPriority(tickets) {
  const empty = Object.fromEntries(PRIORITIES.map((p) => [p, 0]));
  return tickets.reduce((counts, t) => ({ ...counts, [t.priority]: counts[t.priority] + 1 }), empty);
}

export function newestFirst(tickets) {
  return tickets.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function indexById(tickets) {
  return Object.fromEntries(tickets.map((t) => [t.id, t]));
}

export function hotList(tickets, n) {
  return tickets
    .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'closed')
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, n)
    .map((t) => t.title);
}

export function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    return { ...groups, [key]: [...(groups[key] ?? []), item] };
  }, {});
}

export function pipe(...fns) {
  return (x) => fns.reduce((value, fn) => fn(value), x);
}
