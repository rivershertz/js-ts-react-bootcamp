// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Profiler, StrictMode, type ComponentType } from 'react';
import { expect, vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import { sampleTickets } from '../../../03-react/tickets';

type Ticket = (typeof sampleTickets)[number];
type State = { status: string; assignee?: string; blockedReason?: string };
type Exercises = {
  TripleVote: ComponentType;
  StatusTabs: ComponentType<{ selected: string; onSelect: (s: string) => void }>;
  TicketBoard: ComponentType<{ tickets: Ticket[] }>;
  NotesPanel: ComponentType<{ ticket: Ticket }>;
  OpenTimer: ComponentType;
  OpenCount: ComponentType<{ tickets: Ticket[] }>;
  ticketReducer: (state: State, action: object) => State;
  TicketWorkflow: ComponentType<{ initial: State }>;
};

const step = defineSteps('03-react/03');
const ex = () => load<Exercises>('03-react/03-rendering/exercises');
const user = userEvent.setup();

step(1, async () => {
  const { TripleVote } = await ex();
  render(<TripleVote />);
  await user.click(screen.getByRole('button', { name: '+3' }));
  ensure(screen.getByText(/^Votes:/).textContent === 'Votes: 3', `One click on +3 should show "Votes: 3", not "${screen.getByText(/^Votes:/).textContent}"`);
  await user.click(screen.getByRole('button', { name: '+3' }));
  expect(screen.getByText(/^Votes:/)).toHaveTextContent('Votes: 6');
});

step(2, async () => {
  const { StatusTabs, TicketBoard } = await ex();
  const onSelect = vi.fn();
  const { unmount } = render(<StatusTabs selected="blocked" onSelect={onSelect} />);
  ensure(screen.getByRole('button', { name: 'blocked' }).getAttribute('aria-pressed') === 'true', 'StatusTabs should mark the `selected` prop\'s button with aria-pressed={true}');
  await user.click(screen.getByRole('button', { name: 'closed' }));
  expect(onSelect, 'clicking a tab should call onSelect with its status').toHaveBeenCalledWith('closed');
  unmount();

  render(<TicketBoard tickets={sampleTickets} />);
  const titles = () => screen.queryAllByRole('listitem').map((li) => li.textContent);
  const of = (status: string) => sampleTickets.filter((t) => t.status === status).map((t) => t.title);
  expect(titles(), 'TicketBoard starts on "open": show only the open tickets').toEqual(of('open'));
  await user.click(screen.getByRole('button', { name: 'closed' }));
  expect(titles(), 'after clicking "closed", the list should show only closed tickets').toEqual(of('closed'));
  expect(screen.getByRole('button', { name: 'closed' })).toHaveAttribute('aria-pressed', 'true');
});

step(3, async () => {
  const { NotesPanel } = await ex();
  const [t1, t2] = sampleTickets;
  const { rerender } = render(<NotesPanel ticket={t1} />);
  await user.type(screen.getByLabelText(/Note for/), 'call the customer');
  rerender(<NotesPanel ticket={t2} />);
  ensure((screen.getByLabelText(/Note for/) as HTMLInputElement).value === '', 'After switching to another ticket, the note should start empty');
  expect(screen.getByText(/Note for/)).toHaveTextContent(`Note for ${t2.id}`);
});

step(4, async () => {
  const { OpenTimer } = await ex();
  vi.useFakeTimers();
  const cleared = vi.spyOn(globalThis, 'clearInterval');
  try {
    const { unmount } = render(
      <StrictMode>
        <OpenTimer />
      </StrictMode>,
    );
    act(() => vi.advanceTimersByTime(3000));
    const shown = screen.getByText(/^Open for/).textContent;
    ensure(shown === 'Open for 3 s', `After 3 seconds it should show "Open for 3 s", not "${shown}" (checked in StrictMode, as in development)`);
    unmount();
    expect(cleared, 'stop the interval when the component goes away: return a cleanup from the effect').toHaveBeenCalled();
  } finally {
    cleared.mockRestore();
    vi.useRealTimers();
  }
});

step(5, async () => {
  const { OpenCount } = await ex();
  const commits: string[] = [];
  const view = (tickets: Ticket[]) => (
    <Profiler id="count" onRender={() => commits.push(document.body.textContent ?? '')}>
      <OpenCount tickets={tickets} />
    </Profiler>
  );
  const { rerender } = render(view(sampleTickets));
  const open = sampleTickets.filter((t) => t.status !== 'closed').length;
  expect(screen.getByText(/open$/)).toHaveTextContent(`${open} open`);
  commits.length = 0;
  rerender(view(sampleTickets.slice(0, 2)));
  expect(screen.getByText(/open$/)).toHaveTextContent('2 open');
  ensure(commits.length === 1, `New tickets took ${commits.length} renders, and the first one showed the old count. It should take one.`);
});

step(6, async () => {
  const { ticketReducer, TicketWorkflow } = await ex();
  const reduce = (state: State, action: object) => callPure(ticketReducer, state, action);
  expect(reduce({ status: 'open' }, { type: 'assign', assignee: 'a1' })).toEqual({ status: 'assigned', assignee: 'a1' });
  expect(reduce({ status: 'assigned', assignee: 'a1' }, { type: 'block', reason: 'Waiting' })).toEqual({ status: 'blocked', assignee: 'a1', blockedReason: 'Waiting' });
  expect(reduce({ status: 'blocked', assignee: 'a1', blockedReason: 'Waiting' }, { type: 'close' }), 'closing keeps the assignee and drops the blockedReason').toEqual({ status: 'closed', assignee: 'a1' });
  expect(reduce({ status: 'closed', assignee: 'a1' }, { type: 'reopen' })).toEqual({ status: 'open' });

  render(<TicketWorkflow initial={{ status: 'open' }} />);
  await user.click(screen.getByRole('button', { name: 'Assign to me' }));
  expect(screen.getByText('assigned')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Close' }));
  expect(screen.getByText('closed')).toBeInTheDocument();
});
