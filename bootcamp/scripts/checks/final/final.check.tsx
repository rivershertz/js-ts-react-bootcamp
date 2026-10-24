// @vitest-environment jsdom
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { App as AntApp } from 'antd';
import { Component, type ComponentType, type ReactNode } from 'react';
import { MemoryRouter, useLocation, useNavigate, type NavigateFunction } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load, root } from '../../lib/paths';
import { findShortcuts } from '../../lib/source';
import fixtures from '../../fixtures/tickets.json';

const step = defineSteps('final-project');
const app = path.join(root, 'final-project');
const src = path.join(app, 'src');
const PRIORITY_ORDER = ['low', 'medium', 'high', 'urgent'];

type Row = { id: string; title: string; status: string; priority: string; assignee?: string };

// The checks own the API: the app's client is replaced by an in-memory one that starts from the fixtures.
const api = vi.hoisted(() => ({ tickets: [] as Row[], assignees: [] as { id: string; name: string }[] }));
vi.mock('../../../final-project/src/api/client', () => {
  const ok = (data: unknown) => Promise.resolve({ data: structuredClone(data) });
  return {
    client: {
      get: (url: string) => {
        if (url === '/tickets') return ok(api.tickets);
        if (url === '/assignees') return ok(api.assignees);
        const ticket = api.tickets.find((t) => url === `/tickets/${t.id}`);
        return ticket ? ok(ticket) : Promise.reject(new Error(`404 ${url}`));
      },
      post: (_url: string, input: Omit<Row, 'id'>) => {
        const ticket = { ...input, id: `t-new${api.tickets.length}`, createdAt: '2026-10-22T09:00:00Z' };
        api.tickets.push(ticket);
        return ok(ticket);
      },
      put: (url: string, input: Omit<Row, 'id'>) => {
        const i = api.tickets.findIndex((t) => url === `/tickets/${t.id}`);
        api.tickets[i] = { ...api.tickets[i], ...input };
        return ok(api.tickets[i]);
      },
    },
  };
});

// Count what the app hands to antd: every Table render's rows, and every Statistic render.
const seen = vi.hoisted(() => ({ tableRows: [] as unknown[], statistics: 0, filterCalls: 0, sortCalls: 0, searches: [] as unknown[] }));
vi.mock('antd', async (importOriginal) => {
  const antd = await importOriginal<typeof import('antd')>();
  const Table = Object.assign((props: { dataSource?: unknown }) => {
    seen.tableRows.push(props.dataSource);
    return <antd.Table {...(props as object)} />;
  }, antd.Table);
  const Statistic = Object.assign((props: object) => {
    seen.statistics++;
    return <antd.Statistic {...props} />;
  }, antd.Statistic);
  return { ...antd, Table, Statistic };
});

// Count calls into the junior's Phase 2 logic.
vi.mock('@tickets/logic', async (importOriginal) => {
  const logic = await importOriginal<Record<string, (...args: unknown[]) => unknown>>();
  return {
    ...logic,
    filterTickets: (tickets: unknown, filters?: { search?: unknown }) => {
      seen.filterCalls++;
      seen.searches.push(filters?.search ?? '');
      return logic.filterTickets(tickets, filters);
    },
    sortTickets: (...args: unknown[]) => {
      seen.sortCalls++;
      return logic.sortTickets(...args);
    },
  };
});

let queryClient: QueryClient;
let currentSearch = '';
let navigate: NavigateFunction;
let crash: Error | null = null;

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  api.tickets = structuredClone(fixtures);
  api.assignees = [
    { id: 'a1', name: 'Dana Levi' },
    { id: 'a2', name: 'Omar Haddad' },
    { id: 'a3', name: 'Noa Cohen' },
    { id: 'a4', name: 'Yossi Mizrahi' },
    { id: 'a5', name: 'Lior Ben-David' },
  ];
  resetCounts();
  crash = null;
});

function resetCounts() {
  seen.tableRows = [];
  seen.statistics = 0;
  seen.filterCalls = 0;
  seen.sortCalls = 0;
  seen.searches = [];
}

function RouterSpy() {
  currentSearch = useLocation().search;
  navigate = useNavigate();
  return null;
}

class CatchCrash extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    crash = error;
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

async function renderApp(url = '/tickets') {
  if (!existsSync(path.join(root, '02-ts/project/src/index.ts'))) {
    throw new Error('The final project uses your Phase 2 logic, and 02-ts/project/src/index.ts is missing. Finish Phase 2 (or ask your mentor).');
  }
  const { default: App } = await load<{ default: ComponentType }>('final-project/src/App');
  const view = render(
    <QueryClientProvider client={queryClient}>
      <AntApp>
        <MemoryRouter initialEntries={[url]}>
          <CatchCrash>
            <App />
          </CatchCrash>
          <RouterSpy />
        </MemoryRouter>
      </AntApp>
    </QueryClientProvider>,
  );
  if (url === '/tickets' || url.startsWith('/tickets?')) {
    await waitFor(
      () => {
        ensure(queryClient.getQueryData(['tickets']) !== undefined, 'The ticket list never loaded');
        ensure(document.querySelector('.ant-table-placeholder') === null, 'The ticket table never showed the tickets');
      },
      { timeout: 5000 },
    );
    await wait(20);
  }
  return view;
}

async function go(to: string) {
  await act(async () => {
    navigate(to);
  });
}

const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));
const bodyRows = () => screen.getAllByRole('row').slice(1);
const cachedIds = () => (queryClient.getQueryData(['tickets']) as Row[]).map((t) => t.id);
const titleOf = (id: string) => fixtures.find((t) => t.id === id)?.title;

// antd sets pointer-events: none on parts of a table while it animates; a person would just click again.
const user = userEvent.setup({ pointerEventsCheck: 0 });

async function clickColumn(name: string) {
  await user.click(within(screen.getByRole('columnheader', { name: new RegExp(name) })).getByText(name));
}

async function choose(selectLabel: string, option: string) {
  await user.click(screen.getByRole('combobox', { name: selectLabel }));
  await user.click(await screen.findByTitle(option));
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const full = path.join(dir, n);
    return statSync(full).isDirectory() ? files(full) : [full];
  });
}

/** A failed check with a plain message (no "expected 1 to be 0" tail). */
function ensure(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const rel = (f: string) => path.relative(app, f).replaceAll('\\', '/');

function run(bin: string, args: string[]) {
  const res = spawnSync(process.execPath, [path.join(root, 'node_modules', bin), ...args], { cwd: root, encoding: 'utf8' });
  const output = `${res.stdout}${res.stderr}`.trim().replaceAll(root + path.sep, '').replaceAll(root, '.');
  return { ok: res.status === 0, output };
}

function requireTypeScript() {
  const js = files(src).filter((f) => /\.jsx?$/.test(f));
  if (js.length) throw new Error(`Finish step 1 first. Still JavaScript: ${js.map(rel).join(', ')}`);
}

step(1, () => {
  const js = files(src).filter((f) => /\.jsx?$/.test(f)).map(rel);
  if (js.length) throw new Error(`Still JavaScript:\n${js.join('\n')}`);
});

step(2, () => {
  requireTypeScript();
  const { ok, output } = run('typescript/bin/tsc', ['-p', 'final-project/tsconfig.json', '--pretty', 'false']);
  if (!ok) throw new Error(output.split('\n').slice(0, 8).join('\n'));
  const shortcuts = files(src).flatMap((f) =>
    findShortcuts(readFileSync(f, 'utf8'), f)
      .filter((s) => s.kind === 'any' || s.kind === 'ts-ignore')
      .map((s) => `${rel(f)}:${s.line}  ${s.text}`),
  );
  if (shortcuts.length) throw new Error(`Remove every any and @ts-ignore:\n${shortcuts.join('\n')}`);
});

step(3, () => {
  const { ok, output } = run('eslint/bin/eslint.js', ['final-project', '--no-inline-config', '--max-warnings', '0']);
  if (!ok) throw new Error(output.split('\n').slice(0, 8).join('\n'));
});

step(4, async () => {
  await renderApp();
  await clickColumn('Priority');
  ensure(
    cachedIds().join() === fixtures.map((t) => t.id).join(),
    `The tickets in the React Query cache changed order (now ${cachedIds().slice(0, 4).join(', ')}, ...). Something sorted them in place.`,
  );
});

step(5, async () => {
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await renderApp('/tickets/new');
    await screen.findByLabelText('Title');
    await go('/tickets/t1');
    await wait(50);
    if (crash) throw new Error(`Going from New ticket to /tickets/t1 (what happens after Create ticket) crashed:\n${crash.message.split('\n')[0]}`);
    ensure(screen.queryByLabelText('Title') !== null, 'After going from New ticket to /tickets/t1, the form should still show');
  } finally {
    quiet.mockRestore();
  }
});

step(6, async () => {
  const listeners = new Set<unknown>();
  for (const target of [window, document]) {
    const add = target.addEventListener.bind(target);
    const remove = target.removeEventListener.bind(target);
    vi.spyOn(target, 'addEventListener').mockImplementation((type, fn, options) => {
      if (type === 'keydown') listeners.add(fn);
      add(type, fn, options);
    });
    vi.spyOn(target, 'removeEventListener').mockImplementation((type, fn, options) => {
      if (type === 'keydown') listeners.delete(fn);
      remove(type, fn, options);
    });
  }
  try {
    const view = await renderApp();
    view.unmount();
    ensure(listeners.size === 0, `After leaving the ticket list, ${listeners.size} keydown listener(s) are still attached to the page.`);
  } finally {
    vi.restoreAllMocks();
  }
});

step(7, async () => {
  await renderApp();
  await go('/tickets/t1');
  const title = () => (screen.queryByLabelText('Title') as HTMLInputElement | null)?.value;
  await waitFor(() => ensure(title() === titleOf('t1'), `The form for /tickets/t1 should show "${titleOf('t1')}", not "${title()}"`));
  await go('/tickets/t2');
  await wait(100);
  ensure(title() === titleOf('t2'), `After going from t1 to t2 (the Next button), the form shows "${title()}" instead of "${titleOf('t2')}"`);
});

step(8, async () => {
  await renderApp();
  resetCounts();
  await clickColumn('Priority');
  await wait(50);
  ensure(seen.tableRows.length > 0, 'Clicking the Priority column should re-render the table');
  const stale = seen.tableRows.filter((rows) => {
    const order = (rows as Row[]).map((t) => PRIORITY_ORDER.indexOf(t.priority));
    return order.some((p, i) => i > 0 && p < order[i - 1]);
  });
  ensure(stale.length === 0, `After sorting by Priority, the table rendered ${stale.length} time(s) with the rows still in the old order, before catching up.`);
});

step(9, async () => {
  await renderApp();
  await choose('Status', 'closed');
  const closed = fixtures.filter((t) => t.status === 'closed').length;
  await waitFor(() => ensure(bodyRows().length === closed, `Choosing Status: closed should show the ${closed} closed tickets, but the table shows ${bodyRows().length} rows`));
});

step(10, async () => {
  const hookFile = ['useDebouncedValue.ts', 'useDebouncedValue.tsx', 'useDebouncedValue.js'].map((f) => path.join(src, 'hooks', f)).find(existsSync);
  if (!hookFile) throw new Error('Add your useDebouncedValue hook as final-project/src/hooks/useDebouncedValue.ts');
  const users = files(src).filter((f) => /from\s+['"][./]+hooks\/useDebouncedValue(\.tsx?)?['"]/.test(readFileSync(f, 'utf8')));
  ensure(users.length > 0, 'Use useDebouncedValue from src/hooks/useDebouncedValue for the search');
  await renderApp();
  resetCounts();
  await user.type(screen.getByLabelText('Search'), 'login');
  await wait(500);
  ensure(bodyRows().length === 1 && bodyRows()[0].textContent?.includes(titleOf('t1') ?? '') === true, 'Searching for "login" should leave only "Login page shows blank screen"');
  const searched = new Set(seen.searches).size;
  ensure(searched <= 2, `While typing 5 letters, the list was filtered for ${searched} different search texts; expected at most 2 (before and after typing stops).`);
});

step(11, async () => {
  await renderApp();
  ensure(seen.filterCalls > 0, 'Filter the list with filterTickets from your Phase 2 logic (@tickets/logic)');
  resetCounts();
  await user.type(screen.getByLabelText('Search'), 'login');
  await wait(500);
  const calls = Math.max(seen.filterCalls, seen.sortCalls);
  ensure(calls <= 2, `While typing 5 letters, the whole list was filtered or sorted again ${calls} times; expected at most 2.`);
});

step(12, async () => {
  await renderApp();
  resetCounts();
  await user.type(screen.getByLabelText('Search'), 'login');
  await wait(500);
  ensure(seen.statistics === 0, `Typing in the search re-rendered the stats panel (${seen.statistics} Statistic renders), though the stats did not change.`);
});

step(13, async () => {
  await renderApp('/tickets?assignee=a3');
  const expected = fixtures.filter((t) => 'assignee' in t && t.assignee === 'a3');
  await waitFor(() =>
    ensure(bodyRows().length === expected.length, `For ?assignee=a3 the table should show a3's ${expected.length} tickets, but it shows ${bodyRows().length} rows`),
  );
  const select = screen.queryByRole('combobox', { name: 'Assignee' });
  ensure(select !== null, 'Add a Select with aria-label="Assignee" to the filters');
  ensure(select?.closest('.ant-select')?.textContent?.includes('Noa Cohen') === true, 'For ?assignee=a3 the Assignee select should show Noa Cohen');
  await choose('Assignee', 'Dana Levi');
  ensure(currentSearch === '?assignee=a1', `Picking Dana Levi should change the URL to ?assignee=a1, not "${currentSearch}"`);
});
