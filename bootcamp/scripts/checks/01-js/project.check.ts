import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load, root } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import { startFixtureServer } from '../../fixtures/fixture-server';
import fixtures from '../../fixtures/tickets.json';
import assigneeFixtures from '../../fixtures/assignees.json';

type Ticket = (typeof fixtures)[number] & { assignee?: string };
type Client = { get: (url: string) => Promise<{ data: unknown }>; defaults: { baseURL?: string } };
type Loaded = { tickets: Ticket[]; assignees: unknown[]; warnings: string[] };
type Filters = { status?: string; priority?: string; assignee?: string; search?: string };
type Sort = { by: string; direction: 'asc' | 'desc' };
type Stats = { total: number; open: number; overdue: number; averageAgeDays: number };
type Validation = { valid: boolean; errors: { field: string; message: string }[] };

type Api = {
  createClient: (baseURL?: string) => Client;
  fetchTickets: (client: Client) => Promise<Ticket[]>;
  fetchAssignees: (client: Client) => Promise<unknown[]>;
  loadAll: (client: Client) => Promise<Loaded>;
};
type FiltersModule = {
  filterTickets: (tickets: Ticket[], filters?: Filters) => Ticket[];
  sortTickets: (tickets: Ticket[], sort?: Sort) => Ticket[];
};
type StatsModule = {
  groupByStatus: (tickets: Ticket[]) => Record<string, Ticket[]>;
  computeStats: (tickets: Ticket[], now?: Date) => Stats;
};
type ValidationModule = { validateTicket: (draft: Record<string, unknown>, now?: Date) => Validation };

const step = defineSteps('01-js/project');
const src = '01-js/project/src';
const api = () => load<Api>(`${src}/api`);
const filters = () => load<FiltersModule>(`${src}/filters`);
const stats = () => load<StatsModule>(`${src}/stats`);
const validation = () => load<ValidationModule>(`${src}/validation`);

const tickets = fixtures as Ticket[];
const ids = (list: Ticket[]) => list.map((t) => t.id);
const NOW = new Date('2026-10-20T12:00:00Z');

/** Run `fn` with a fixture API, and always shut it down. */
async function withServer<T>(options: Parameters<typeof startFixtureServer>[0], fn: (server: Awaited<ReturnType<typeof startFixtureServer>>) => Promise<T>) {
  const server = await startFixtureServer(options);
  try {
    return await fn(server);
  } finally {
    await server.close();
  }
}

step(1, async () => {
  const { createClient, fetchTickets, fetchAssignees } = await api();
  expect(createClient().defaults.baseURL, 'createClient() without an argument should use API_URL').toBe('http://localhost:8000/api');
  await withServer({}, async (server) => {
    const client = createClient(server.baseURL);
    expect(client.defaults.baseURL).toBe(server.baseURL);
    expect(ids(await fetchTickets(client))).toEqual(ids(tickets));
    expect(await fetchAssignees(client)).toEqual(assigneeFixtures);
  });
});

step(2, async () => {
  const { createClient, loadAll } = await api();
  // Start a server and stop it again: now nothing answers on that port.
  const server = await startFixtureServer();
  await server.close();
  const result = await loadAll(createClient(server.baseURL)).catch((error: Error) => {
    throw new Error(`loadAll threw "${error.message}" when the server was down. It should return warnings instead.`);
  });
  expect(result.tickets).toEqual([]);
  expect(result.assignees).toEqual([]);
  expect(result.warnings, 'one warning per failed request').toHaveLength(2);
  expect(result.warnings.join(' | '), 'the warnings should say which request failed').toMatch(/tickets[\s\S]*assignees/i);
});

step(3, async () => {
  const { createClient, loadAll } = await api();
  await withServer({ fail: 'assignees', delayMs: 150 }, async (server) => {
    const result = await loadAll(createClient(server.baseURL));
    expect(ids(result.tickets), 'tickets still load when assignees fail').toEqual(ids(tickets));
    expect(result.assignees).toEqual([]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0], 'the warning should say it was the assignees that failed').toMatch(/assignee/i);
    expect(server.stats.maxInFlight, 'both requests should be in flight at the same time (Promise.allSettled), not one after the other').toBe(2);
  });
});

step(4, async () => {
  const { filterTickets } = await filters();
  const run = (f: Filters) => ids(callPure(filterTickets, tickets, f));
  expect(run({ status: 'blocked' })).toEqual(['t3', 't7']);
  expect(run({ priority: 'high' })).toEqual(['t3', 't7', 't9', 't12']);
  expect(run({ assignee: 'a3' })).toEqual(['t7', 't9', 't12']);
  expect(run({ search: 'csv' }), 'search ignores upper / lower case').toEqual(['t2']);
});

step(5, async () => {
  const { filterTickets } = await filters();
  const run = (f: Filters) => ids(callPure(filterTickets, tickets, f));
  expect(run({ status: 'closed', priority: 'high', search: 's' }), 'every filter that is set must match').toEqual(['t9', 't12']);
  expect(run({}), 'no filters keeps every ticket').toEqual(ids(tickets));
  expect(run({ status: '', priority: '', assignee: '', search: '' }), 'empty filters keep every ticket').toEqual(ids(tickets));
  expect(run({ search: '  PAGE ' }), 'search ignores spaces around the text').toEqual(['t1']);
  expect(run({ status: 'open', assignee: 'a1' })).toEqual([]);
});

step(6, async () => {
  const { sortTickets } = await filters();
  const run = (sort: Sort) => callPure(sortTickets, tickets, sort);
  expect(ids(run({ by: 'createdAt', direction: 'asc' }))).toEqual(['t4', 't11', 't2', 't5', 't7', 't1', 't6', 't10', 't9', 't12', 't8', 't3']);
  expect(ids(run({ by: 'createdAt', direction: 'desc' }))).toEqual(['t3', 't8', 't12', 't9', 't10', 't6', 't1', 't7', 't5', 't2', 't11', 't4']);
  expect(ids(run({ by: 'title', direction: 'asc' }))).toEqual(['t10', 't8', 't4', 't9', 't2', 't1', 't11', 't6', 't3', 't12', 't7', 't5']);
  expect(ids(run({ by: 'title', direction: 'desc' }))).toEqual(['t5', 't7', 't12', 't3', 't6', 't11', 't1', 't2', 't9', 't4', 't8', 't10']);
  const priorities = (sort: Sort) => run(sort).map((t) => t.priority);
  expect(priorities({ by: 'priority', direction: 'asc' }), 'ascending priority is low first, in PRIORITIES order (not alphabetical)').toEqual(
    ['low', 'low', 'low', 'medium', 'medium', 'high', 'high', 'high', 'high', 'urgent', 'urgent', 'urgent'],
  );
  expect(priorities({ by: 'priority', direction: 'desc' })).toEqual(
    ['urgent', 'urgent', 'urgent', 'high', 'high', 'high', 'high', 'medium', 'medium', 'low', 'low', 'low'],
  );
});

step(7, async () => {
  const { groupByStatus } = await stats();
  const groups = callPure(groupByStatus, tickets);
  expect(Object.keys(groups).sort()).toEqual(['assigned', 'blocked', 'closed', 'open']);
  expect(ids(groups.open)).toEqual(['t1', 't5']);
  expect(ids(groups.assigned)).toEqual(['t2', 't6', 't10']);
  expect(ids(groups.blocked)).toEqual(['t3', 't7']);
  expect(ids(groups.closed)).toEqual(['t4', 't8', 't9', 't11', 't12']);
  const onlyClosed = callPure(groupByStatus, tickets.filter((t) => t.status === 'closed'));
  expect(onlyClosed.open, 'every status needs a key, even with no tickets: open: []').toEqual([]);
  expect(onlyClosed.blocked).toEqual([]);
});

step(8, async () => {
  const { computeStats } = await stats();
  expect(callPure(computeStats, tickets, NOW)).toEqual({ total: 12, open: 7, overdue: 3, averageAgeDays: 55.1 });
  expect(callPure(computeStats, [], NOW), 'with no tickets, every number is 0').toEqual({ total: 0, open: 0, overdue: 0, averageAgeDays: 0 });
  // t6 is due 2026-10-12: due today is not overdue yet, the day after it is.
  const t6 = tickets.filter((t) => t.id === 't6');
  expect(callPure(computeStats, t6, new Date('2026-10-12T18:00:00Z')).overdue, 'a ticket due today is not overdue').toBe(0);
  expect(callPure(computeStats, t6, new Date('2026-10-13T08:00:00Z')).overdue).toBe(1);
});

step(9, async () => {
  const { validateTicket } = await validation();
  const fields = (draft: Record<string, unknown>) => callPure(validateTicket, draft, NOW).errors.map((e) => e.field);

  const bad = callPure(validateTicket, { title: '  ', priority: 'critical', dueDate: '2026-01-01' }, NOW);
  expect(bad.valid).toBe(false);
  expect(bad.errors.map((e) => e.field), 'collect every error, not just the first').toEqual(['title', 'priority', 'dueDate']);
  for (const error of bad.errors) expect(error.message, `the ${error.field} error needs a message`).toMatch(/\w/);

  const good = callPure(validateTicket, { title: 'Export fails', priority: 'high', dueDate: '2026-10-20' }, NOW);
  expect(good, 'a due date of today is fine').toEqual({ valid: true, errors: [] });
  expect(fields({ title: 'No due date', priority: 'low' })).toEqual([]);
  expect(fields({ title: 'Empty due date', priority: 'low', dueDate: '' })).toEqual([]);
  expect(fields({ priority: 'low' }), 'a missing title is an error too').toEqual(['title']);
  expect(fields({ title: 'Bad date', priority: 'low', dueDate: 'next friday' })).toEqual(['dueDate']);
});

step(10, async () => {
  // Static rules: no console output inside the logic, and imports Node can run.
  const dir = path.join(root, src);
  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((f) => /\.(js|ts)$/.test(f));
  for (const file of files) {
    const code = readFileSync(path.join(dir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code, `src/${file} uses console. Return values instead; yarn tickets does the printing.`).not.toMatch(/\bconsole\./);
    for (const [, p] of code.matchAll(/from\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
      expect(p, `src/${file} imports '${p}': write the whole file name, with the extension`).toMatch(/\.(js|ts)$/);
    }
  }
  // Everything works together through index.js, the way yarn tickets uses it.
  const index = await load<Api & FiltersModule & StatsModule & ValidationModule & { STATUSES: string[] }>(`${src}/index`);
  await withServer({}, async (server) => {
    const { tickets: loaded, warnings } = await index.loadAll(index.createClient(server.baseURL));
    expect(warnings).toEqual([]);
    const urgentFirst = index.sortTickets(index.filterTickets(loaded, { status: 'assigned' }), { by: 'priority', direction: 'desc' });
    expect(ids(urgentFirst)).toEqual(['t10', 't2', 't6']);
    expect(index.computeStats(urgentFirst, NOW).total).toBe(3);
    expect(Object.keys(index.groupByStatus(urgentFirst))).toHaveLength(index.STATUSES.length);
    expect(index.validateTicket({ title: 'x', priority: 'low' }, NOW).valid).toBe(true);
  });
});

step(11, async () => {
  const { sortTickets } = await filters();
  const run = (direction: 'asc' | 'desc') => ids(callPure(sortTickets, tickets, { by: 'dueDate', direction }));
  const noDueDate = ['t1', 't11', 't3', 't9']; // in .sort() text order
  const asc = run('asc');
  const desc = run('desc');
  expect(asc.slice(0, 8)).toEqual(['t12', 't5', 't2', 't8', 't6', 't10', 't4', 't7']);
  expect(desc.slice(0, 8)).toEqual(['t7', 't4', 't10', 't6', 't8', 't2', 't5', 't12']);
  expect(asc.slice(8).sort(), 'tickets without a due date go last').toEqual(noDueDate);
  expect(desc.slice(8).sort(), 'tickets without a due date go last, in both directions').toEqual(noDueDate);
});
