import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const bootcampRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadCatalog(root = bootcampRoot) {
  return JSON.parse(readFileSync(path.join(root, 'scripts', 'catalog.json'), 'utf8'));
}

/**
 * Turn what the junior typed into a module and optional step.
 * Accepts `01-js/03`, `01-js\03`, `01-js/03/`, `01-js/03-scope-closures`, `01-js/03/4`, `final-project`.
 */
export function resolveTarget(input, catalog = loadCatalog()) {
  const parts = String(input ?? '')
    .replaceAll('\\', '/')
    .split('/')
    .filter(Boolean);
  const find = (p) => catalog.modules.find((m) => m.id === p.join('/') || m.dir === p.join('/'));
  let module = find(parts);
  let step;
  if (!module && parts.length > 1 && /^\d+$/.test(parts.at(-1))) {
    step = Number(parts.at(-1));
    module = find(parts.slice(0, -1));
  }
  if (!module) return { error: `Unknown exercise "${input ?? ''}".` };
  if (step !== undefined && !module.steps.some((s) => s.n === step)) {
    return { error: `${module.id} has no step ${step}. Its steps are ${module.steps.map((s) => s.n).join(', ')}.` };
  }
  return { module, step };
}
