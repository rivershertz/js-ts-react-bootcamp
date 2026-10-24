// @vitest-environment jsdom
import path from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { expect, vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { junior, load } from '../../lib/paths';
import { typeErrorsForStep } from '../../lib/typecheck';
import { sampleTickets } from '../../../03-react/tickets';

type Ticket = (typeof sampleTickets)[number];
type Exercises = {
  PriorityBadge: ComponentType<{ priority: string }>;
  TicketCard: ComponentType<{ ticket: Ticket }>;
  TicketList: ComponentType<{ tickets: Ticket[] }>;
  EstimateCounter: ComponentType;
  NewTicketForm: ComponentType<{ onAdd: (title: string) => void }>;
  SearchableTicketList: ComponentType<{ tickets: Ticket[] }>;
};

const step = defineSteps('03-react/01');
const exercise = '03-react/01-fundamentals/exercises';
const ex = () => load<Exercises>(exercise);
const user = userEvent.setup();

step(1, async () => {
  const errors = typeErrorsForStep([path.join(__dirname, '01.types.ts'), junior(exercise)], 1);
  if (errors.length) throw new Error(errors.join('\n'));
  const { PriorityBadge } = await ex();
  const { container } = render(<PriorityBadge priority="high" />);
  expect(container.innerHTML).toBe('<span>HIGH</span>');
});

step(2, async () => {
  const { TicketCard } = await ex();
  const [t1, t2] = sampleTickets;
  const { container, rerender } = render(<TicketCard ticket={t2} />);
  expect(container.querySelector('article'), 'TicketCard should render an <article>').not.toBeNull();
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(t2.title);
  ensure(screen.queryByText('MEDIUM') !== null, 'Show the priority with PriorityBadge (MEDIUM)');
  expect(screen.getByText(`Due ${t2.dueDate}`)).toBeInTheDocument();
  rerender(<TicketCard ticket={t1} />);
  ensure(screen.queryByText('No due date') !== null, 'A ticket with dueDate null shows "No due date"');
});

step(3, async () => {
  const { TicketList } = await ex();
  const warnings = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const { rerender } = render(<TicketList tickets={sampleTickets} />);
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items, 'one <li> per ticket').toHaveLength(sampleTickets.length);
    expect(items[2]).toHaveTextContent(sampleTickets[2].title);
    const keyWarning = warnings.mock.calls.find((c) => String(c[0]).includes('unique "key"'));
    expect(keyWarning, 'React warns: each <li> needs a unique key. Use the ticket id.').toBeUndefined();
    rerender(<TicketList tickets={[]} />);
    expect(screen.getByText('No tickets')).toBeInTheDocument();
    expect(screen.queryByRole('list'), 'with no tickets, show "No tickets" instead of an empty list').toBeNull();
  } finally {
    warnings.mockRestore();
  }
});

step(4, async () => {
  const { EstimateCounter } = await ex();
  render(<EstimateCounter />);
  const plus = screen.getByRole('button', { name: '+' });
  const minus = screen.getByRole('button', { name: '-' });
  await user.click(plus);
  await user.click(plus);
  ensure(screen.queryByText('Estimate: 2 h') !== null, `Two clicks on + should show "Estimate: 2 h", not "${screen.queryByText(/^Estimate/)?.textContent}"`);
  await user.click(minus);
  await user.click(minus);
  await user.click(minus);
  ensure(screen.queryByText('Estimate: 0 h') !== null, `"-" must stop at 0, but it shows "${screen.queryByText(/^Estimate/)?.textContent}"`);
});

step(5, async () => {
  const { NewTicketForm } = await ex();
  const onAdd = vi.fn();
  render(<NewTicketForm onAdd={onAdd} />);
  const input = screen.getByLabelText('Title');
  const add = screen.getByRole('button', { name: 'Add' });
  ensure((add as HTMLButtonElement).disabled, 'Add should be disabled while the title is empty');
  await user.type(input, '   ');
  ensure((add as HTMLButtonElement).disabled, 'Add should be disabled while the title is only spaces');
  await user.clear(input);
  await user.type(input, '  Fix the export  ');
  expect(add).toBeEnabled();
  await user.click(add);
  expect(onAdd, 'onAdd should get the trimmed title').toHaveBeenCalledWith('Fix the export');
  ensure((input as HTMLInputElement).value === '', 'The input should be empty after adding');
  await user.type(input, 'Second one{Enter}');
  expect(onAdd, 'Enter submits the form too').toHaveBeenLastCalledWith('Second one');
  expect(onAdd).toHaveBeenCalledTimes(2);
  await user.type(input, 'Third');
  const reloads = fireEvent.submit(input.closest('form') as HTMLFormElement);
  expect(reloads, 'Call event.preventDefault() in the submit handler, or the browser reloads the page').toBe(false);
});

step(6, async () => {
  const { SearchableTicketList } = await ex();
  render(<SearchableTicketList tickets={sampleTickets} />);
  expect(screen.getAllByRole('listitem')).toHaveLength(sampleTickets.length);
  await user.type(screen.getByLabelText('Search'), 'PASSWORD');
  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([expect.stringContaining('Password reset email not sent')]);
  await user.clear(screen.getByLabelText('Search'));
  await user.type(screen.getByLabelText('Search'), 'nothing like this');
  expect(screen.getByText('No tickets')).toBeInTheDocument();
});
