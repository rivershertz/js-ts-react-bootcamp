// Type-level checks for 02-ts/08. The comment above each check is what the junior sees when it fails.
import type { AxiosInstance } from 'axios';
import type { Equal, Expect } from '../../lib/type-utils';
import { fetchReport } from '../../../02-ts/08-migration/report.ts';

// @step 5
// fetchReport should take (client: AxiosInstance, today: string).
export type S5 = Expect<Equal<Parameters<typeof fetchReport>, [client: AxiosInstance, today: string]>>;
// fetchReport should return Promise<string[]>.
export type S5b = Expect<Equal<ReturnType<typeof fetchReport>, Promise<string[]>>>;
