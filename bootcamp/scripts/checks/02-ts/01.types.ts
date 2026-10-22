// Type-level checks for 02-ts/01. The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import { daysOpen } from '../../../02-ts/01-why-ts/exercises.ts';

// @step 1
// daysOpen should take (createdAt: string, now: Date).
export type S1 = Expect<Equal<Parameters<typeof daysOpen>, [createdAt: string, now: Date]>>;
// daysOpen should say it returns a number.
export type S1b = Expect<Equal<ReturnType<typeof daysOpen>, number>>;
