import { STATUSES } from './constants.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// { open: [...], assigned: [...], blocked: [...], closed: [...] }, every status present.
export function groupByStatus(tickets) {
  return Object.fromEntries(STATUSES.map((status) => [status, tickets.filter((t) => t.status === status)]));
}

export function computeStats(tickets, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const open = tickets.filter((t) => t.status !== 'closed');
  const overdue = open.filter((t) => t.dueDate != null && t.dueDate < today);
  const ages = open.map((t) => Math.floor((now.getTime() - new Date(t.createdAt).getTime()) / DAY_MS));
  const average = ages.length === 0 ? 0 : ages.reduce((sum, age) => sum + age, 0) / ages.length;
  return {
    total: tickets.length,
    open: open.length,
    overdue: overdue.length,
    averageAgeDays: Math.round(average * 10) / 10,
  };
}
