// Type-level checks for 02-ts/06. The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import {
  countBy,
  first,
  indexBy,
  type Result,
  type Ticket,
  type TicketChanges,
  type TicketDraft,
  type TicketSummary,
} from '../../../02-ts/06-generics-utility-types/exercises.ts';

declare const tickets: Ticket[];

// @step 1
// first(tickets) should be Ticket | undefined. Add a type parameter: function first<T>(items: readonly T[]): T | undefined
export type S1 = Expect<Equal<ReturnType<typeof first<Ticket>>, Ticket | undefined>>;
const firstNumber = first([1, 2]);
// first([1, 2]) should be number | undefined.
export type S1b = Expect<Equal<typeof firstNumber, number | undefined>>;

// @step 2
const byId = indexBy(tickets, (t) => t.id);
// indexBy(tickets, (t) => t.id) should be Record<string, Ticket>, and t in the callback should be a Ticket.
export type S2 = Expect<Equal<typeof byId, Record<string, Ticket>>>;

// @step 3
// TicketDraft should be Ticket without id and createdAt.
export type S3 = Expect<Equal<TicketDraft, Omit<Ticket, 'id' | 'createdAt'>>>;
// TicketChanges should be TicketDraft with every field optional.
export type S3b = Expect<Equal<TicketChanges, Partial<TicketDraft>>>;
// TicketSummary should have only id and title.
export type S3c = Expect<Equal<TicketSummary, Pick<Ticket, 'id' | 'title'>>>;

// @step 6
// Result<T> should be { ok: true; data: T } | { ok: false; error: string }.
export type S6 = Expect<Equal<Result<number>, { ok: true; data: number } | { ok: false; error: string }>>;
// A failed result must not be allowed to carry data.
// @ts-expect-error
export const failedWithData: Result<number> = { ok: false, error: 'x', data: 1 };

// @step 7
const counts = countBy(tickets, (t) => t.status);
// countBy(tickets, (t) => t.status) should be Partial<Record<'open' | 'assigned' | 'blocked' | 'closed', number>>.
export type S7 = Expect<Equal<typeof counts, Partial<Record<Ticket['status'], number>>>>;
