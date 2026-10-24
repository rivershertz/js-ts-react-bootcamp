// Type-level checks for 03-react/01. The comment above each check is what the junior sees when it fails.
import type { ComponentProps } from 'react';
import type { Equal, Expect } from '../../lib/type-utils';
import type { Priority } from '../../../03-react/tickets.ts';
import { PriorityBadge } from '../../../03-react/01-fundamentals/exercises.tsx';

// @step 1
// PriorityBadge's props should be typed as { priority: Priority }.
export type S1 = Expect<Equal<ComponentProps<typeof PriorityBadge>, { priority: Priority }>>;
