import { defineSteps } from '../../lib/steps';
import { phase1Steps } from './project.steps';

// The steps live in project.steps.ts because the Phase 2 project re-runs them on the TypeScript version.
const step = defineSteps('01-js/project');
const steps = phase1Steps('01-js/project/src');

step(1, steps[1]);
step(2, steps[2]);
step(3, steps[3]);
step(4, steps[4]);
step(5, steps[5]);
step(6, steps[6]);
step(7, steps[7]);
step(8, steps[8]);
step(9, steps[9]);
step(10, steps[10]);
step(11, steps[11]);
