// Type-level checks for the Phase 2 project. The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import {
  isTicket,
  PRIORITIES,
  STATUSES,
  type Priority,
  type Status,
  type Ticket,
} from '../../../02-ts/project/src/index.ts';

// @step 4
// STATUSES should be a readonly tuple of the exact strings: add `as const`.
export type S4 = Expect<Equal<typeof STATUSES, readonly ['open', 'assigned', 'blocked', 'closed']>>;
// PRIORITIES should be a readonly tuple of the exact strings: add `as const`.
export type S4b = Expect<Equal<typeof PRIORITIES, readonly ['low', 'medium', 'high', 'urgent']>>;
// Status should be derived from STATUSES: (typeof STATUSES)[number], exported from your project.
export type S4c = Expect<Equal<Status, (typeof STATUSES)[number]>>;
// Priority should be derived from PRIORITIES: (typeof PRIORITIES)[number], exported from your project.
export type S4d = Expect<Equal<Priority, (typeof PRIORITIES)[number]>>;

// @step 5
const base = { id: 't1', title: 'Login page', description: '', priority: 'low', createdAt: '2026-09-05T14:00:00Z', dueDate: null } as const;
// Ticket['status'] should be exactly the four statuses.
export type S5 = Expect<Equal<Ticket['status'], Status>>;
// A closed ticket should have closedAt: string.
export type S5b = Expect<Equal<Extract<Ticket, { status: 'closed' }>['closedAt'], string>>;
// An open ticket must not be allowed to have closedAt.
// @ts-expect-error
export const openWithClosedAt: Ticket = { id: 't1', title: 'x', description: '', priority: 'low', createdAt: '', dueDate: null, status: 'open', closedAt: '2026-10-28T12:00:00Z' };
// An assigned ticket must not be allowed without an assignee.
// @ts-expect-error
export const assignedWithoutAssignee: Ticket = { ...base, status: 'assigned' };
// A blocked ticket must not be allowed without a blockedReason.
// @ts-expect-error
export const blockedWithoutReason: Ticket = { ...base, status: 'blocked', assignee: 'a1' };

// @step 7
// isTicket should be a type guard: (value: unknown) => value is Ticket
export type S7 = Expect<Equal<typeof isTicket, (value: unknown) => value is Ticket>>;
