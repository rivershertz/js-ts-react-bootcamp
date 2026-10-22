// Not closed, and the due date is before today. Dates look like '2026-10-15', so they compare as text.
export function isOverdue(ticket, now) {
  const today = now.toISOString().slice(0, 10);
  return ticket.status !== 'closed' && ticket.dueDate != null && ticket.dueDate < today;
}
