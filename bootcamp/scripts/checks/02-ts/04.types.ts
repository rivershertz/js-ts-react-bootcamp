// Type-level checks for 02-ts/04. The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import {
  assertTicket,
  isAssignee,
  isPriority,
  isRecord,
  isTicket,
  type Assignee,
  type Priority,
  type Ticket,
} from '../../../02-ts/04-type-guards/exercises.ts';

// @step 1
// isPriority should be a type guard: (value: unknown) => value is Priority
export type S1 = Expect<Equal<typeof isPriority, (value: unknown) => value is Priority>>;

// @step 2
// isRecord should be a type guard: (value: unknown) => value is Record<string, unknown>
export type S2 = Expect<Equal<typeof isRecord, (value: unknown) => value is Record<string, unknown>>>;

// @step 3
// isAssignee should be a type guard: (value: unknown) => value is Assignee
export type S3 = Expect<Equal<typeof isAssignee, (value: unknown) => value is Assignee>>;

// @step 4
// isTicket should be a type guard: (value: unknown) => value is Ticket
export type S4 = Expect<Equal<typeof isTicket, (value: unknown) => value is Ticket>>;

// @step 5
// assertTicket should be an assertion function: (value: unknown) => asserts value is Ticket
export type S5 = Expect<Equal<typeof assertTicket, (value: unknown) => asserts value is Ticket>>;
