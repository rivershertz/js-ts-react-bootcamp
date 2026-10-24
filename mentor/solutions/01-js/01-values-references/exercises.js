// 01-js/01 Values and references: worked solutions

export function copyTicket(ticket) {
  return { ...ticket };
}

export function closeTicket(ticket, closedAt) {
  return { ...ticket, status: 'closed', closedAt };
}

export function ticketLabel(ticket) {
  const { id, title = '(no title)', priority = 'medium' } = ticket;
  return `${id} · ${title} · ${priority}`;
}

export function toggleStatus(filters, status) {
  const statuses = filters.statuses.includes(status)
    ? filters.statuses.filter((s) => s !== status)
    : [...filters.statuses, status];
  return { ...filters, statuses };
}

export function replaceTicket(tickets, updated) {
  return tickets.map((t) => (t.id === updated.id ? updated : t));
}

export function removeTicket(tickets, id) {
  return tickets.filter((t) => t.id !== id);
}

export function sameContent(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return keysA.length === keysB.length && keysA.every((k) => Object.hasOwn(b, k) && sameContent(a[k], b[k]));
}

export function deepFreeze(value) {
  if (value !== null && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}
