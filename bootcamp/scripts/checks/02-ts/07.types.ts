// Type-level checks for 02-ts/07. Each `@step` section only reports errors for that step.
// The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import {
  PRIORITY_LABELS,
  STATUSES,
  statusOptions,
  type PriorityLabel,
  type Status,
  type TicketField,
} from '../../../02-ts/07-deriving-types/exercises.ts';

type AllStatuses = 'open' | 'assigned' | 'blocked' | 'closed';

// @step 1
// Status should be exactly 'open' | 'assigned' | 'blocked' | 'closed', but it is a different type.
export type S1 = Expect<Equal<Status, AllStatuses>>;
// STATUSES should be readonly ['open', 'assigned', 'blocked', 'closed'], but TypeScript sees string[].
export type S1b = Expect<Equal<typeof STATUSES, readonly ['open', 'assigned', 'blocked', 'closed']>>;

// @step 2
// PriorityLabel should be exactly 'Low' | 'Medium' | 'High' | 'Urgent', but it is a different type.
export type S2 = Expect<Equal<PriorityLabel, 'Low' | 'Medium' | 'High' | 'Urgent'>>;
// PRIORITY_LABELS should have exactly the keys low, medium, high, urgent.
export type S2b = Expect<Equal<keyof typeof PRIORITY_LABELS, 'low' | 'medium' | 'high' | 'urgent'>>;

// @step 3
// statusOptions() should return options whose value is a Status, not any string.
export type S3 = Expect<Equal<ReturnType<typeof statusOptions>[number]['value'], AllStatuses>>;

// @step 4
// TicketField should be exactly 'id' | 'title' | 'status' | 'priority'.
export type S4 = Expect<Equal<TicketField, 'id' | 'title' | 'status' | 'priority'>>;
