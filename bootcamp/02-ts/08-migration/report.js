// An old JavaScript module that builds the weekly overdue report.
// Move it to strict TypeScript one step at a time: follow README.md.

const PRIORITY_WEIGHT = { low: 1, medium: 2, high: 3, urgent: 5 };

// today looks like '2026-10-20'
export function isOverdue(ticket, today) {
  return ticket.status !== 'closed' && ticket.dueDate !== null && ticket.dueDate < today;
}

export function weight(ticket) {
  return PRIORITY_WEIGHT[ticket.priority];
}

// One line per overdue ticket, heaviest first: 't2 Export to CSV drops last row (due 2026-10-02)'
export function reportLines(tickets, today) {
  return tickets
    .filter((t) => isOverdue(t, today))
    .toSorted((a, b) => weight(b) - weight(a))
    .map((t) => `${t.id} ${t.title} (due ${t.dueDate})`);
}

// Average weight, rounded to one decimal: 2.7
export function averageWeight(tickets) {
  if (tickets.length === 0) return 0;
  const total = tickets.reduce((sum, t) => sum + weight(t), 0);
  return Math.round(total / tickets.length, 1);
}

// client is an axios instance pointed at the API
export async function fetchReport(client, today) {
  const response = await client.get('/tickets');
  return reportLines(response.data, today);
}
