// Type-level checks for 02-ts/03. The comment above each check is what the junior sees when it fails.
import type { Equal, Expect } from '../../lib/type-utils';
import type { Priority } from '../../../02-ts/03-unions-narrowing/exercises.ts';

// @step 1
// Priority should be exactly 'low' | 'medium' | 'high' | 'urgent'.
export type S1 = Expect<Equal<Priority, 'low' | 'medium' | 'high' | 'urgent'>>;
