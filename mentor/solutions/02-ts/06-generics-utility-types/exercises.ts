// 02-ts/06 Generics and utility types (solution)

export type Ticket = {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'blocked' | 'closed';
  createdAt: string;
  dueDate: string | null;
};

// @step 1 (core)
export function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

// @step 2 (core)
export function indexBy<T>(items: readonly T[], keyOf: (item: T) => string): Record<string, T> {
  return Object.fromEntries(items.map((item) => [keyOf(item), item]));
}

// @step 3 (core)
export type TicketDraft = Omit<Ticket, 'id' | 'createdAt'>;
export type TicketChanges = Partial<TicketDraft>;
export type TicketSummary = Pick<Ticket, 'id' | 'title'>;

// @step 4 (core)
export function updateTicket(ticket: Ticket, changes: TicketChanges): Ticket {
  return { ...ticket, ...changes, id: ticket.id, createdAt: ticket.createdAt };
}

// @step 5 (stretch)
export function summarize(ticket: Ticket): TicketSummary {
  return { id: ticket.id, title: ticket.title };
}

// @step 6 (core)
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
export function unwrap<T>(result: Result<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}

// @step 7 (stretch)
export function countBy<T, K extends string>(items: readonly T[], keyOf: (item: T) => K): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
