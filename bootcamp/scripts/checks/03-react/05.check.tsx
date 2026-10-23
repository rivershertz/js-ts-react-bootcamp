// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ComponentType, ReactNode } from 'react';
import { beforeEach, vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { sampleTickets } from '../../../03-react/tickets';

type Ticket = (typeof sampleTickets)[number];
type Query<T> = { data?: T };
type Exercises = {
  useTickets: () => Query<Ticket[]>;
  TicketsView: ComponentType;
  useTicket: (id: string | undefined) => Query<Ticket>;
  TicketBoard: ComponentType;
};

// The checks own the API: the module's client is replaced by an in-memory one.
const api = vi.hoisted(() => ({
  tickets: [] as { id: string; status: string }[],
  fail: false,
  hold: new Set<string>(),
  gets: [] as string[],
  puts: [] as string[],
}));
vi.mock('../../../03-react/05-server-data/client', () => {
  const ok = (data: unknown) => Promise.resolve({ data: structuredClone(data) });
  const fail = (status: number, url: string) =>
    Promise.reject(Object.assign(new Error(`Request failed with status code ${status}: ${url}`), { response: { status } }));
  return {
    client: {
      get: (url: string) => {
        api.gets.push(url);
        if (api.hold.has(url)) return new Promise(() => {});
        if (api.fail) return fail(500, url);
        if (url === '/tickets') return ok(api.tickets);
        const ticket = api.tickets.find((t) => url === `/tickets/${t.id}`);
        return ticket ? ok(ticket) : fail(404, url);
      },
      put: (url: string, input: { status: string }) => {
        api.puts.push(url);
        const i = api.tickets.findIndex((t) => url === `/tickets/${t.id}`);
        if (i === -1) return fail(404, url);
        api.tickets[i] = { ...api.tickets[i], ...input };
        return ok(api.tickets[i]);
      },
    },
  };
});

const step = defineSteps('03-react/05');
const ex = () => load<Exercises>('03-react/05-server-data/exercises');
const user = userEvent.setup();
const pause = (ms: number) => act(() => new Promise((resolve) => setTimeout(resolve, ms)));

let queryClient: QueryClient;
function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  // No automatic retries, so an error shows at once.
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  api.tickets = structuredClone(sampleTickets);
  api.fail = false;
  api.hold.clear();
  api.gets = [];
  api.puts = [];
});

step(1, async () => {
  const { useTickets } = await ex();
  const { result } = renderHook(() => [useTickets(), useTickets()], { wrapper });
  await waitFor(() => ensure(result.current[0].data?.length === 6, 'useTickets() should return the tickets from GET /tickets in `data`'));
  ensure(queryClient.getQueryData(['tickets']) !== undefined, "Load the tickets with useQuery, under the query key ['tickets']");
  const requests = api.gets.filter((url) => url === '/tickets').length;
  ensure(requests === 1, `Two components called useTickets() and the API got ${requests} requests. With useQuery and the same key they share one.`);
});

step(2, async () => {
  const { TicketsView } = await ex();
  api.fail = true;
  render(<TicketsView />, { wrapper });
  ensure(screen.queryByText(/Loading tickets/) !== null, 'While the tickets load, show "Loading tickets..."');
  await waitFor(() => ensure(screen.queryByText(/Could not load tickets/) !== null, 'When GET /tickets fails, show "Could not load tickets"'));
  const retry = screen.queryByRole('button', { name: 'Retry' });
  ensure(retry !== null, 'When GET /tickets fails, show a "Retry" button');
  api.fail = false;
  await user.click(retry as HTMLElement);
  await waitFor(() =>
    ensure(screen.queryAllByRole('listitem').length === 6, 'After a click on Retry the server answers: list the 6 ticket titles, one <li> each'),
  );
  ensure(screen.queryByText(/Could not load tickets/) === null, 'Once the tickets load, the error message should go away');
});

step(3, async () => {
  const { useTicket } = await ex();
  const { result, rerender } = renderHook(({ id }) => useTicket(id), { wrapper, initialProps: { id: undefined as string | undefined } });
  await pause(50);
  ensure(api.gets.length === 0, `With no id yet, useTicket sent GET ${api.gets[0]}. Do not run the query until there is an id.`);
  rerender({ id: 't2' });
  await waitFor(() => ensure(result.current.data?.id === 't2', 'useTicket("t2") should return ticket t2 from GET /tickets/t2'));
  ensure(queryClient.getQueryData(['tickets', 't2']) !== undefined, "Keep the query key ['tickets', id]");
});

step(4, async () => {
  const { TicketBoard } = await ex();
  render(<TicketBoard />, { wrapper });
  const row = () => screen.queryAllByRole('listitem').find((li) => li.textContent?.startsWith('Login page shows blank screen'));
  await waitFor(() => ensure(row() !== undefined, 'TicketBoard should list the tickets. Finish step 1 first.'));
  await user.click(screen.getByRole('button', { name: 'Close Login page shows blank screen' }));
  await waitFor(() => ensure(api.puts.includes('/tickets/t1'), 'Close should send PUT /tickets/t1'));
  await waitFor(() =>
    ensure(
      row()?.textContent?.includes(': closed') === true,
      "The server saved t1 as closed, but the list still shows it as open. After a successful save, mark ['tickets'] out of date so it loads again.",
    ),
  );
});

step(5, async () => {
  const { useTicket } = await ex();
  queryClient.setQueryData(['tickets'], structuredClone(api.tickets));
  api.hold.add('/tickets/t2');
  const { result } = renderHook(() => useTicket('t2'), { wrapper });
  ensure(
    result.current.data?.title === 'Export to CSV drops last row',
    "The list is already in the cache, so useTicket('t2') should have t2 on its first render. Use initialData.",
  );
  await pause(20);
  ensure(api.gets.includes('/tickets/t2'), 'useTicket should still ask the server for the latest t2 (GET /tickets/t2)');
});
