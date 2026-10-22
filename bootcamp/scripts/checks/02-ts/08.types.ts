// Type-level checks for 02-ts/08. The comment above each check is what the junior sees when it fails.
import type { AxiosInstance } from 'axios';
import type { Equal, Expect } from '../../lib/type-utils';
import { fetchReport, PRIORITY_WEIGHT } from '../../../02-ts/08-migration/report.ts';

// @step 5
// fetchReport should take (client: AxiosInstance, today: string).
export type S5 = Expect<Equal<Parameters<typeof fetchReport>, [client: AxiosInstance, today: string]>>;
// fetchReport should return Promise<string[]>.
export type S5b = Expect<Equal<ReturnType<typeof fetchReport>, Promise<string[]>>>;

// @step 6
// PRIORITY_WEIGHT should be exported, `as const satisfies Record<Priority, number>`.
export type S6 = Expect<Equal<typeof PRIORITY_WEIGHT, { readonly low: 1; readonly medium: 2; readonly high: 3; readonly urgent: 5 }>>;
