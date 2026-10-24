import { test } from 'vitest';
import catalog from '../catalog.json';

/**
 * Register checks for one module. The step titles, levels and hints live in catalog.json,
 * so a check file only says how each step is tested.
 *
 *   const step = defineSteps('01-js/03');
 *   step(1, async () => { ... });
 */
export function defineSteps(moduleId: string) {
  const module = catalog.modules.find((m) => m.id === moduleId);
  if (!module) throw new Error(`No module ${moduleId} in catalog.json`);
  return (n: number, fn: () => unknown | Promise<unknown>) => {
    if (!module.steps.some((s) => s.n === n)) throw new Error(`${moduleId} has no step ${n} in catalog.json`);
    test(`step ${n}`, fn);
  };
}
