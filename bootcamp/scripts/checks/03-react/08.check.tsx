// @vitest-environment jsdom
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ComponentType, ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation, type Location } from 'react-router-dom';
import { expect, vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { sampleTickets } from '../../../03-react/tickets';

type Exercises = {
  AppRoutes: ComponentType;
  TicketListPage: ComponentType;
  TicketPage: ComponentType;
  useStatusFilter: () => [string | undefined, (status: string | undefined) => void];
  NewTicketPage: ComponentType<{ onCreate: (title: string) => Promise<string> }>;
  BackButton: ComponentType;
};

const step = defineSteps('03-react/08');
const ex = () => load<Exercises>('03-react/08-routing/exercises');
const user = userEvent.setup();

let location: Location;
function LocationSpy() {
  location = useLocation();
  return null;
}
const at = () => location.pathname + location.search;

function Router({ entries, index, children }: { entries: string[]; index?: number; children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={entries} initialIndex={index}>
      <LocationSpy />
      {children}
    </MemoryRouter>
  );
}

step(1, async () => {
  const { AppRoutes } = await ex();
  const page = (url: string) => {
    const view = render(
      <Router entries={[url]}>
        <AppRoutes />
      </Router>,
    );
    const heading = screen.queryByRole('heading')?.textContent;
    return { heading, unmount: view.unmount, hasTicket: view.container.querySelector('article') !== null };
  };

  let shown = page('/tickets');
  ensure(shown.heading === 'Tickets', '/tickets should show TicketListPage');
  shown.unmount();
  shown = page('/tickets/new');
  ensure(shown.heading === 'New ticket', '/tickets/new should show NewTicketPage');
  shown.unmount();
  shown = page('/tickets/t2');
  ensure(shown.hasTicket, '/tickets/t2 should show TicketPage');
  shown.unmount();
  page('/nowhere');
  ensure(location.pathname === '/tickets', `An unknown URL should send the user to /tickets, but it stayed on ${location.pathname}`);
});

step(2, async () => {
  const { TicketListPage } = await ex();
  // A plain <a href> makes jsdom complain that it cannot load pages; that is expected here.
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
  const list = () =>
    render(
      <Router entries={['/tickets']}>
        <Routes>
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="*" element={<p>Somewhere else</p>} />
        </Routes>
      </Router>,
    );
  try {
    const view = list();
    await user.click(screen.getByText(sampleTickets[1].title));
    ensure(location.pathname === '/tickets/t2', `Clicking "${sampleTickets[1].title}" should go to /tickets/t2 inside the app, with <Link>`);
    view.unmount();
    list();
    await user.click(screen.getByText('New ticket'));
    ensure(location.pathname === '/tickets/new', '"New ticket" should go to /tickets/new inside the app, with <Link>');
  } finally {
    quiet.mockRestore();
  }
});

step(3, async () => {
  const { TicketPage } = await ex();
  const view = render(
    <Router entries={['/tickets/t3']}>
      <Routes>
        <Route path="/tickets/:id" element={<TicketPage />} />
      </Routes>
    </Router>,
  );
  const heading = screen.queryByRole('heading')?.textContent;
  ensure(heading === sampleTickets[2].title, `/tickets/t3 should show "${sampleTickets[2].title}", not "${heading}"`);
  view.unmount();
  render(
    <Router entries={['/tickets/t99']}>
      <Routes>
        <Route path="/tickets/:id" element={<TicketPage />} />
      </Routes>
    </Router>,
  );
  ensure(screen.queryByText('No ticket t99') !== null, '/tickets/t99 should say "No ticket t99"');
});

step(4, async () => {
  const { useStatusFilter } = await ex();
  const wrapper = (entry: string) =>
    function Wrapper({ children }: { children: ReactNode }) {
      return <Router entries={[entry]}>{children}</Router>;
    };
  const { result } = renderHook(() => useStatusFilter(), { wrapper: wrapper('/tickets?status=open') });
  ensure(result.current[0] === 'open', `At /tickets?status=open the filter should be "open", not ${JSON.stringify(result.current[0])}`);
  act(() => result.current[1]('closed'));
  ensure(at() === '/tickets?status=closed', `Setting "closed" should change the URL to /tickets?status=closed, not ${at()}`);
  ensure(result.current[0] === 'closed', 'After setting "closed" the filter should be "closed"');
  act(() => result.current[1](undefined));
  ensure(at() === '/tickets', `Clearing the filter should remove ?status from the URL, but it is ${at()}`);

  const banana = renderHook(() => useStatusFilter(), { wrapper: wrapper('/tickets?status=banana') });
  ensure(banana.result.current[0] === undefined, '?status=banana is not a status: the filter should be undefined');
});

step(5, async () => {
  const { NewTicketPage } = await ex();
  const onCreate = vi.fn(async () => 't42');
  render(
    <Router entries={['/tickets/new']}>
      <Routes>
        <Route path="/tickets/new" element={<NewTicketPage onCreate={onCreate} />} />
        <Route path="/tickets/:id" element={<p>Ticket page</p>} />
      </Routes>
    </Router>,
  );
  await user.type(screen.getByLabelText('Title'), 'Printer is on fire');
  await user.click(screen.getByRole('button', { name: 'Create' }));
  expect(onCreate, 'Create should call onCreate with the title').toHaveBeenCalledWith('Printer is on fire');
  await waitFor(() => ensure(location.pathname === '/tickets/t42', `After the ticket is created, go to its page, /tickets/t42 (still on ${location.pathname})`));
});

step(6, async () => {
  const { BackButton } = await ex();
  render(
    <Router entries={['/tickets?status=open', '/tickets/t1']} index={1}>
      <Routes>
        <Route path="/tickets" element={<p>The list</p>} />
        <Route path="/tickets/:id" element={<BackButton />} />
      </Routes>
    </Router>,
  );
  await user.click(screen.getByText('Back'));
  ensure(at() === '/tickets?status=open', `Back should return to the previous page, /tickets?status=open, not ${at()}`);
});
