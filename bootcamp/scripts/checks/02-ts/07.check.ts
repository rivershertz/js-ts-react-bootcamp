import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { typeErrorsForStep } from '../../lib/typecheck';

const step = defineSteps('02-ts/07');
const exercise = '02-ts/07-deriving-types/exercises';
const files = () => [path.join(__dirname, '07.types.ts'), junior(exercise)];

function expectNoTypeErrors(n: number) {
  const errors = typeErrorsForStep(files(), n);
  if (errors.length) throw new Error(errors.join('\n'));
}

step(1, async () => {
  expectNoTypeErrors(1);
});

step(2, async () => {
  expectNoTypeErrors(2);
  const { PRIORITY_LABELS } = await load<{ PRIORITY_LABELS: Record<string, string> }>(exercise);
  expect(PRIORITY_LABELS).toEqual({ low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' });
});

step(3, async () => {
  expectNoTypeErrors(3);
  const { statusOptions } = await load<{ statusOptions: () => unknown }>(exercise);
  expect(statusOptions()).toEqual([
    { value: 'open', label: 'Open' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'closed', label: 'Closed' },
  ]);
});

step(4, async () => {
  expectNoTypeErrors(4);
});
