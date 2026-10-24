import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const reporter = fileURLToPath(new URL('./reporter.mjs', import.meta.url));

/**
 * Run one module's checks (optionally one step) in the given bootcamp folder.
 * Returns [{ n, state: 'pass' | 'fail' | 'skip', message? }].
 */
export function runChecks({ root, module, step, env = {} }) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'bootcamp-verify-'));
  const out = path.join(dir, 'results.json');
  const args = [
    path.join(root, 'node_modules', 'vitest', 'vitest.mjs'),
    'run',
    module.check,
    '--config',
    'vitest.config.ts',
    `--reporter=${reporter}`,
  ];
  if (step !== undefined) args.push('-t', `^step ${step}$`);
  const child = spawnSync(process.execPath, args, {
    cwd: root,
    env: { ...process.env, ...env, VERIFY_OUT: out, FORCE_COLOR: '0' },
    encoding: 'utf8',
  });
  try {
    const results = JSON.parse(readFileSync(out, 'utf8'));
    return step === undefined ? results : results.filter((r) => r.n === step || r.n === 0);
  } catch {
    const output = `${child.stdout ?? ''}${child.stderr ?? ''}`.trim();
    return [{ n: 0, state: 'fail', message: `The checks could not run.\n${output.split('\n').slice(-15).join('\n')}` }];
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
