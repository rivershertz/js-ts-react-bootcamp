// @vitest-environment jsdom
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, expect, vi } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load, root } from '../../lib/paths';

const step = defineSteps('final-project');
const app = path.join(root, 'final-project');
const src = path.join(app, 'src');

// The checks own the API: the app's http client is replaced by one that answers from fixtures.
vi.mock('../../../final-project/src/api/client', async () => {
  const tickets = (await import('../../fixtures/tickets.json')).default;
  const assignees = (await import('../../fixtures/assignees.json')).default;
  return {
    http: {
      get: async (url: string) => ({ data: structuredClone(url.startsWith('/tickets') ? tickets : assignees) }),
    },
  };
});

// Record every dataSource the app hands to antd's Table, to see how often the rows are rebuilt.
const tableRenders = vi.hoisted(() => ({ dataSources: [] as unknown[] }));
vi.mock('antd', async (importOriginal) => {
  const antd = await importOriginal<typeof import('antd')>();
  const Table = (props: { dataSource?: unknown }) => {
    tableRenders.dataSources.push(props.dataSource);
    return <antd.Table {...(props as object)} />;
  };
  return { ...antd, Table };
});

let queryClient: QueryClient;
let currentSearch = '';
beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  tableRenders.dataSources = [];
});

function LocationSpy() {
  currentSearch = useLocation().search;
  return null;
}

async function renderApp(url = '/tickets') {
  const { default: App } = await load<{ default: ComponentType }>('final-project/src/App');
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[url]}>
        <App />
        <LocationSpy />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  await waitFor(() => expect(queryClient.getQueryData(['tickets']), 'the ticket list never loaded').toBeDefined(), {
    timeout: 5000,
  });
  await screen.findAllByRole('cell');
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const full = path.join(dir, n);
    return statSync(full).isDirectory() ? files(full) : [full];
  });
}

function run(bin: string, args: string[]) {
  const res = spawnSync(process.execPath, [path.join(root, 'node_modules', bin), ...args], { cwd: root, encoding: 'utf8' });
  const output = `${res.stdout}${res.stderr}`.trim().replaceAll(root + path.sep, '').replaceAll(root, '.');
  return { ok: res.status === 0, output };
}

step(1, () => {
  const js = files(src).filter((f) => /\.jsx?$/.test(f)).map((f) => path.relative(app, f).replaceAll('\\', '/'));
  if (js.length) throw new Error(`Still JavaScript:\n${js.join('\n')}`);
});

step(2, () => {
  const { ok, output } = run('typescript/bin/tsc', ['-p', 'final-project/tsconfig.json', '--pretty', 'false']);
  if (!ok) throw new Error(output.split('\n').slice(0, 8).join('\n'));
  const anyUse = files(src).filter((f) => /:\s*any\b|as any\b|<any>/.test(readFileSync(f, 'utf8')));
  if (anyUse.length) throw new Error(`Uses any: ${anyUse.map((f) => path.relative(app, f)).join(', ')}`);
});

step(3, () => {
  const { ok, output } = run('eslint/bin/eslint.js', ['final-project', '--no-inline-config', '--max-warnings', '0']);
  if (!ok) throw new Error(output.split('\n').slice(0, 8).join('\n'));
});

step(4, async () => {
  await renderApp();
  const before = (queryClient.getQueryData(['tickets']) as { id: string }[]).map((t) => t.id);
  await userEvent.click(screen.getByText('Priority', { selector: 'span' }));
  const rows = screen.getAllByRole('row').slice(1);
  expect(within(rows[0]).getByText('urgent'), 'after choosing Priority, the first row should be urgent').toBeInTheDocument();
  const after = (queryClient.getQueryData(['tickets']) as { id: string }[]).map((t) => t.id);
  expect(after, 'the tickets in the React Query cache changed order: something sorted them in place').toEqual(before);
});

step(5, async () => {
  const hook = path.join(src, 'hooks');
  const hookFile = ['useDebouncedValue.ts', 'useDebouncedValue.tsx'].map((f) => path.join(hook, f)).find(existsSync);
  if (!hookFile) throw new Error('Add your useDebouncedValue hook as final-project/src/hooks/useDebouncedValue.ts');
  await renderApp();
  tableRenders.dataSources = [];
  await userEvent.type(screen.getByLabelText('Search'), 'login');
  await act(() => new Promise((r) => setTimeout(r, 500)));
  const rows = screen.getAllByRole('row').slice(1);
  expect(rows.map((r) => r.textContent).join(' | ')).toContain('Login page shows blank screen');
  expect(rows, 'the search should filter the table').toHaveLength(1);
  const distinct = new Set(tableRenders.dataSources).size;
  expect(distinct, `the table's rows were rebuilt ${distinct} times while typing 5 letters; expected at most 2`).toBeLessThanOrEqual(2);
});

step(6, async () => {
  await renderApp('/tickets?assignee=a3');
  const tickets = (await import('../../fixtures/tickets.json')).default;
  const expected = tickets.filter((t) => t.assignee === 'a3').map((t) => t.title);
  await waitFor(() => expect(screen.getAllByRole('row').slice(1), 'only the tickets of assignee a3 should show for ?assignee=a3').toHaveLength(expected.length));
  await userEvent.click(screen.getByRole('combobox', { name: 'Assignee' }));
  await userEvent.click(await screen.findByTitle('Dana Levi'));
  expect(currentSearch, 'picking an assignee should update the URL').toBe('?assignee=a1');
});
