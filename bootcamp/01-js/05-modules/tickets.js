// 01-js/05 Modules, step 3
// Move isOverdue into a new file next to this one, dates.js, and export it from there.
// Then import it here, so overdueTickets keeps working.

// Not closed, and the due date is before today. Dates look like '2026-10-15', so they compare as text.
function isOverdue(ticket, now) {
  const today = now.toISOString().slice(0, 10);
  // != null is the one accepted use of loose equality: it matches both null and undefined.
  return ticket.status !== 'closed' && ticket.dueDate != null && ticket.dueDate < today;
}

export function overdueTickets(tickets, now = new Date()) {
  return tickets.filter((t) => isOverdue(t, now));
}
