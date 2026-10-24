// Type-level check for 02-ts/08 step 6 (stretch), kept apart so a missing export does not fail step 5.
import type { Equal, Expect } from '../../lib/type-utils';
import { PRIORITY_WEIGHT } from '../../../02-ts/08-migration/report.ts';

// @step 6
// PRIORITY_WEIGHT should be exported, `as const satisfies Record<Priority, number>`.
export type S6 = Expect<Equal<typeof PRIORITY_WEIGHT, { readonly low: 1; readonly medium: 2; readonly high: 3; readonly urgent: 5 }>>;
