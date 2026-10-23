// @vitest-environment jsdom
import { render, renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { beforeEach, vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { sampleTickets } from '../../../03-react/tickets';

type Ticket = (typeof sampleTickets)[number];
type Exercises = {
  TicketSearch: ComponentType<{ tickets: Ticket[] }>;
  TicketRow: ComponentType<{ ticket: Ticket; selected: boolean; onSelect: (id: string) => void }> & { $$typeof?: symbol };
  TicketPicker: ComponentType<{ tickets: Ticket[] }>;
  worthIt: Record<string, boolean | undefined>;
  useChangedProps: (props: Record<string, unknown>) => string[];
};

// Count calls to the slow filter, and renders, without the 60 ms wait.
const seen = vi.hoisted(() => ({ filters: 0, renders: new Map<string, number>() }));
vi.mock('../../../03-react/07-performance/slow', () => ({
  filterByTitle: (tickets: { title: string }[], search: string) => {
    seen.filters++;
    return tickets.filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase()));
  },
}));
vi.mock('../../../03-react/07-performance/renders', () => ({
  countRender: (name: string) => seen.renders.set(name, (seen.renders.get(name) ?? 0) + 1),
  renderCount: (name: string) => seen.renders.get(name) ?? 0,
}));

const step = defineSteps('03-react/07');
const ex = () => load<Exercises>('03-react/07-performance/exercises');
const user = userEvent.setup();

beforeEach(() => {
  seen.filters = 0;
  seen.renders.clear();
});

step(1, async () => {
  const { TicketSearch } = await ex();
  render(<TicketSearch tickets={sampleTickets} />);
  await user.type(screen.getByLabelText('Search'), 'login');
  ensure(screen.queryAllByRole('listitem').length === 1, 'Searching "login" should still show the one matching ticket');
  seen.filters = 0;
  const compact = screen.getByLabelText('Compact');
  await user.click(compact);
  await user.click(compact);
  await user.click(compact);
  ensure(
    seen.filters === 0,
    `Ticking Compact 3 times ran filterByTitle ${seen.filters} times, though the tickets and the search did not change. Keep the result between renders.`,
  );
  await user.clear(screen.getByLabelText('Search'));
  ensure(seen.filters > 0 && screen.queryAllByRole('listitem').length === 6, 'When the search changes, the list should be filtered again');
});

step(2, async () => {
  const { TicketRow } = await ex();
  ensure(
    TicketRow.$$typeof === Symbol.for('react.memo'),
    'TicketRow should skip renders when its props are unchanged: wrap the component in memo(...)',
  );
});

step(3, async () => {
  const { TicketPicker } = await ex();
  render(<TicketPicker tickets={sampleTickets} />);
  await user.click(screen.getByRole('button', { name: sampleTickets[0].title }));
  seen.renders.clear();
  await user.click(screen.getByRole('button', { name: sampleTickets[1].title }));
  const rows = seen.renders.get('TicketRow') ?? 0;
  ensure(screen.getByText(/Picked so far/).textContent === 'Picked so far: t1, t2', 'Picking t1 then t2 should still list "t1, t2"');
  ensure(
    rows === 2,
    `Selecting the second ticket rendered ${rows} rows; only 2 changed. ${rows === 6 ? 'Is onSelect the same function on every render?' : ''}`,
  );
});

step(4, async () => {
  const { worthIt } = await ex();
  const expected: Record<string, boolean> = { A: false, B: true, C: false, D: true, E: false };
  const why: Record<string, string> = {
    A: 'What costs more: tickets.length, or comparing the dependencies every render?',
    B: 'Is the work slow, and does it run on renders where its inputs did not change?',
    C: 'Does a plain <button> compare its props and skip a render?',
    D: 'What does memo compare? Can StatsPanel skip a render if onRefresh is new each time?',
    E: 'Is { padding: 8 } the same object on the next render?',
  };
  for (const key of Object.keys(expected)) {
    ensure(worthIt[key] !== undefined, `Answer case ${key} with true or false`);
    ensure(worthIt[key] === expected[key], `Case ${key}: think again. ${why[key]}`);
  }
});

step(5, async () => {
  const { useChangedProps } = await ex();
  const onSelect = () => {};
  const { result, rerender } = renderHook((props: Record<string, unknown>) => useChangedProps(props), {
    initialProps: { id: 't1', onSelect },
  });
  ensure(Array.isArray(result.current) && result.current.length === 0, 'On the first render nothing has changed yet: return []');
  rerender({ id: 't1', onSelect });
  ensure(result.current.length === 0, `Same id, same function: nothing changed, but got ${JSON.stringify(result.current)}`);
  rerender({ id: 't1', onSelect: () => {} });
  ensure(JSON.stringify(result.current) === '["onSelect"]', `A new onSelect function should give ["onSelect"], not ${JSON.stringify(result.current)}`);
  rerender({ id: 't2', onSelect: () => {} });
  ensure(JSON.stringify(result.current) === '["id","onSelect"]', `A new id and a new function should give ["id","onSelect"], not ${JSON.stringify(result.current)}`);
});
