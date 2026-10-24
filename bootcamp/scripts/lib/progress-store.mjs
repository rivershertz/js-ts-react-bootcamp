import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const file = (root) => path.join(root, '.progress.json');

export function readProgress(root) {
  try {
    return JSON.parse(readFileSync(file(root), 'utf8'));
  } catch {
    return {};
  }
}

export function recordProgress(root, moduleId, results) {
  const progress = readProgress(root);
  progress[moduleId] ??= {};
  for (const r of results) if (r.n > 0 && r.state !== 'skip') progress[moduleId][r.n] = r.state;
  writeFileSync(file(root), JSON.stringify(progress, null, 2));
}
