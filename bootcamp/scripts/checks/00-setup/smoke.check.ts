import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { root } from '../../lib/paths';

const step = defineSteps('00-setup');

step(1, () => {
  const major = Number(process.versions.node.split('.')[0]);
  expect(major, `You have Node ${process.versions.node}; the bootcamp needs 24 or newer`).toBeGreaterThanOrEqual(24);
});

step(2, () => {
  const agent = process.env.npm_config_user_agent ?? '';
  expect(agent, 'This check was not started by Yarn 1. Use: yarn verify 00-setup').toMatch(/^yarn\/1\./);
});

step(3, () => {
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  const missing = Object.entries({ ...pkg.dependencies, ...pkg.devDependencies }).filter(([name, version]) => {
    try {
      const installed = JSON.parse(readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8'));
      return installed.version !== version;
    } catch {
      return true;
    }
  });
  if (missing.length) {
    throw new Error(`Missing or the wrong version: ${missing.map(([n, v]) => `${n}@${v}`).join(', ')}`);
  }
});

step(4, async () => {
  const response = await fetch('http://localhost:8000/api/assignees').catch(() => undefined);
  if (!response) throw new Error('Nothing answered on http://localhost:8000. Is the Python server running?');
  expect(response.status, 'The server answered, but not with the ticket API').toBe(200);
});
