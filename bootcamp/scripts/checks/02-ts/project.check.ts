import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load, root } from '../../lib/paths';
import { findShortcuts } from '../../lib/source';
import { typeErrors, typeErrorsForStep } from '../../lib/typecheck';
import { startFixtureServer } from '../../fixtures/fixture-server';
import fixtures from '../../fixtures/tickets.json';
import { phase1Steps } from '../01-js/project.steps';

type Client = { get: (url: string) => Promise<{ data: unknown }> };
type Project = {
  createClient: (baseURL?: string) => Client;
  fetchTickets: (client: Client) => Promise<{ id: string }[]>;
  loadAll: (client: Client) => Promise<{ tickets: { id: string }[]; warnings: string[] }>;
  isTicket: (value: unknown) => boolean;
  statusLabel: (ticket: unknown) => string;
};

const step = defineSteps('02-ts/project');
const src = '02-ts/project/src';
const srcDir = path.join(root, src);
const MODULES = ['constants', 'api', 'filters', 'stats', 'validation', 'index'];

function requireSrc() {
  expect(existsSync(srcDir), 'There is no 02-ts/project/src yet. Run `yarn copy-project` first.').toBe(true);
}

/** The later steps check the TypeScript version, so they wait for step 1. */
function requireTs() {
  requireSrc();
  const missing = MODULES.filter((name) => !existsSync(path.join(srcDir, `${name}.ts`)));
  if (missing.length) throw new Error(`Finish step 1 first. Not .ts yet: ${missing.map((name) => `src/${name}`).join(', ')}`);
}

/** Every .ts file in the junior's src folder. */
function sourceFiles(): string[] {
  return readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith('.ts'))
    .map((f) => path.join(srcDir, f));
}

const project = () => load<Project>(`${src}/index`);
const typesFile = path.join(__dirname, 'project.types.ts');

function expectNoTypeErrors(n: number) {
  const errors = typeErrorsForStep([typesFile, path.join(srcDir, 'index.ts')], n).filter((e) => !e.includes('02-ts/project/src/'));
  if (errors.length) throw new Error(errors.join('\n'));
}

step(1, () => {
  requireSrc();
  const files = readdirSync(srcDir, { recursive: true, encoding: 'utf8' });
  const js = files.filter((f) => /\.jsx?$/.test(f));
  expect(js, 'Rename every .js file in 02-ts/project/src to .ts').toEqual([]);
  for (const name of MODULES) expect(existsSync(path.join(srcDir, `${name}.ts`)), `src/${name}.ts is missing`).toBe(true);
});

step(2, () => {
  requireTs();
  const errors = typeErrors(sourceFiles());
  const own = errors.filter((e) => e.file.startsWith(srcDir));
  if (own.length) {
    throw new Error(own.map((e) => `${path.relative(root, e.file).replaceAll('\\', '/')}:${e.line}  ${e.message}`).join('\n'));
  }
});

step(3, () => {
  requireTs();
  const found = sourceFiles().flatMap((file) =>
    findShortcuts(readFileSync(file, 'utf8'), file).map((s) => `src/${path.relative(srcDir, file).replaceAll('\\', '/')}:${s.line}  ${s.kind}  ${s.text}`),
  );
  expect(found, 'Remove every any, as cast (as const is fine), ! assertion and @ts-ignore / @ts-expect-error').toEqual([]);
});

step(4, () => {
  requireTs();
  expectNoTypeErrors(4);
});

step(5, () => {
  requireTs();
  expectNoTypeErrors(5);
});

step(6, async () => {
  requireTs();
  const { statusLabel } = await project();
  expect(typeof statusLabel, 'export a statusLabel(ticket) function (stats.ts is a good home for it)').toBe('function');
  const [open, assigned, blocked, closed] = [fixtures[0], fixtures[1], fixtures[2], fixtures[7]];
  expect([open, assigned, blocked, closed].map((t) => statusLabel(t))).toEqual([
    'Open',
    'Assigned to a1',
    'Blocked: Waiting for design',
    'Closed on 2026-10-28',
  ]);
  // Add a fifth state to a copy of the Ticket type: the project must stop compiling somewhere.
  const files = sourceFiles();
  const withTicket = files.find((f) => /export type Ticket\s*=/.test(readFileSync(f, 'utf8')));
  expect(withTicket, 'Keep the Ticket union in one line starting with `export type Ticket =`').toBeDefined();
  const file = withTicket as string;
  const archived = "{ status: 'archived'; id: string; title: string; description: string; priority: 'low'; createdAt: string; dueDate: null } |";
  const changed = readFileSync(file, 'utf8').replace(/export type Ticket\s*=\s*\|?/, `export type Ticket = ${archived}`);
  const before = typeErrors(files).length;
  const after = typeErrors(files, { replace: { [file]: changed } }).length;
  expect(
    after,
    "With an extra 'archived' state, everything still compiles. statusLabel's switch needs a never check in default (module 02-ts/05).",
  ).toBeGreaterThan(before);
});

step(7, async () => {
  requireTs();
  expectNoTypeErrors(7);
  const api = readFileSync(path.join(srcDir, 'api.ts'), 'utf8');
  const gets = [...api.matchAll(/\.get\s*(<[^>(]*>)?\s*\(/g)];
  expect(gets.length, 'api.ts should call client.get').toBeGreaterThan(0);
  for (const g of gets) {
    if (g[1] !== '<unknown>') throw new Error(`Ask axios for unknown and check the data: client.get<unknown>(...), not ${g[0]}...)`);
  }

  const { isTicket, createClient, fetchTickets, loadAll } = await project();
  for (const t of fixtures) expect(isTicket(t), `fixture ticket ${t.id}`).toBe(true);
  expect(isTicket({ ...fixtures[1], assignee: undefined }), 'an assigned ticket needs an assignee').toBe(false);
  const server = await startFixtureServer({ badData: true });
  try {
    const client = createClient(server.baseURL);
    expect((await fetchTickets(client)).map((t) => t.id), 'fetchTickets should leave out the malformed ticket').toEqual(fixtures.map((t) => t.id));
    const loaded = await loadAll(client);
    expect(loaded.tickets).toHaveLength(fixtures.length);
    expect(loaded.warnings.join(' '), 'loadAll should warn about the malformed ticket and name it (t-bad)').toContain('t-bad');
  } finally {
    await server.close();
  }
});

// Step 8: everything Phase 1 checked must still work on the TypeScript version.
const phase1 = phase1Steps(src);

step(8, async () => {
  requireTs();
  for (let n = 1; n <= 10; n++) {
    try {
      await phase1[n]();
    } catch (error) {
      throw new Error(`Phase 1 project step ${n} no longer passes (yarn verify 01-js/project/${n} explains that step):\n${(error as Error).message}`);
    }
  }
});

step(9, async () => {
  requireTs();
  await phase1[11]();
});
