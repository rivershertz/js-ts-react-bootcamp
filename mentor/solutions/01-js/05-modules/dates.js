// Not closed, and the due date is before today. Dates look like '2026-10-15', so they compare as text.
export function isOverdue(ticket, now) {
  const today = now.toISOString().slice(0, 10);
  // != null is the one accepted use of loose equality: it matches both null and undefined.
  return ticket.status !== 'closed' && ticket.dueDate != null && ticket.dueDate < today;
}
