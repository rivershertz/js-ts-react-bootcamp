// @vitest-environment jsdom
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { StrictMode, type ComponentType } from 'react';
import { expect, vi } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load, root } from '../../lib/paths';
import { sampleTickets } from '../../../03-react/tickets';

type Ticket = (typeof sampleTickets)[number];
type Item = { text: string; done: boolean };
type Exercises = {
  TagEditor: ComponentType;
  AssigneePicker: ComponentType<{ initial: Ticket }>;
  SortedTitles: ComponentType<{ tickets: Ticket[] }>;
  NumberedTitles: ComponentType<{ tickets: Ticket[] }>;
  TicketDetails: ComponentType<{ ticket: Ticket | null }>;
  DocumentTitle: ComponentType<{ ticket: Ticket }>;
  Checklist: ComponentType<{ initial: Item[] }>;
};

const step = defineSteps('03-react/02');
const dir = '03-react/02-rules-of-react';
const ex = () => load<Exercises>(`${dir}/exercises`);
const user = userEvent.setup();

/** Deep-freeze test data, so changing it throws instead of silently working. */
function frozen<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) frozen(v);
    Object.freeze(value);
  }
  return value;
}

/** Run fn; turn "Cannot assign to read only property" into a message about mutation. */
async function noMutation(what: string, fn: () => unknown) {
  try {
    await fn();
  } catch (error) {
    if (error instanceof TypeError && /read.only|not extensible|Cannot (assign|add)/.test(error.message)) {
      throw new Error(`${what} (${error.message})`);
    }
    throw error;
  }
}

step(1, async () => {
  const { TagEditor } = await ex();
  render(<TagEditor />);
  await user.type(screen.getByLabelText('Tag'), 'frontend');
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.clear(screen.getByLabelText('Tag'));
  await user.type(screen.getByLabelText('Tag'), 'urgent');
  await user.click(screen.getByRole('button', { name: 'Add' }));
  expect(screen.queryAllByRole('listitem').map((li) => li.textContent), 'after adding two tags, both should be listed').toEqual(['frontend', 'urgent']);
});

step(2, async () => {
  const { AssigneePicker } = await ex();
  const initial = { ...sampleTickets[0] };
  render(<AssigneePicker initial={initial} />);
  await user.click(screen.getByRole('button', { name: 'Assign to Noa' }));
  expect(screen.getByText('Assigned to a3'), 'after the click, the text should read "Assigned to a3"').toBeInTheDocument();
  expect(initial.assignee, 'AssigneePicker changed the ticket object it was given. Make a new object instead.').toBeUndefined();
});

step(3, async () => {
  const { SortedTitles } = await ex();
  const tickets = frozen(sampleTickets.map((t) => ({ ...t })));
  await noMutation('SortedTitles changed the order of the tickets array it was given (its props).', () => render(<SortedTitles tickets={tickets} />));
  const titles = screen.getAllByRole('listitem').map((li) => li.textContent);
  expect(titles, 'the titles should be shown A to Z').toEqual(sampleTickets.map((t) => t.title).toSorted((a, b) => a.localeCompare(b)));
});

step(4, async () => {
  const { NumberedTitles } = await ex();
  const tickets = sampleTickets.slice(0, 3);
  const expected = tickets.map((t, i) => `${i + 1}. ${t.title}`);
  const { rerender } = render(
    <StrictMode>
      <NumberedTitles tickets={tickets} />
    </StrictMode>,
  );
  expect(screen.getAllByRole('listitem').map((li) => li.textContent), 'the first render should number the rows 1, 2, 3').toEqual(expected);
  rerender(
    <StrictMode>
      <NumberedTitles tickets={tickets} />
    </StrictMode>,
  );
  expect(screen.getAllByRole('listitem').map((li) => li.textContent), 'rendering again with the same tickets should show the same numbers').toEqual(expected);
});

step(5, async () => {
  const { TicketDetails } = await ex();
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const { rerender } = render(<TicketDetails ticket={sampleTickets[2]} />);
    try {
      rerender(<TicketDetails ticket={null} />);
      rerender(<TicketDetails ticket={sampleTickets[2]} />);
    } catch (error) {
      throw new Error(`Going from a ticket to none crashed: ${(error as Error).message.split('\n')[0]}`);
    }
    await user.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByText('Priority: high')).toBeInTheDocument();
  } finally {
    quiet.mockRestore();
  }
});

step(6, async () => {
  const { DocumentTitle } = await ex();
  const { rerender } = render(<DocumentTitle ticket={sampleTickets[0]} />);
  expect(document.title).toBe(sampleTickets[0].title);
  rerender(<DocumentTitle ticket={sampleTickets[1]} />);
  expect(document.title, 'after switching to another ticket, the tab title should follow').toBe(sampleTickets[1].title);
});

step(7, () => {
  const res = spawnSync(process.execPath, [path.join(root, 'node_modules/eslint/bin/eslint.js'), dir, '--no-inline-config', '--max-warnings', '0'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (res.status !== 0) {
    const out = `${res.stdout}${res.stderr}`.trim().replaceAll(root + path.sep, '');
    throw new Error(out.split('\n').slice(0, 8).join('\n'));
  }
});

step(8, async () => {
  const { Checklist } = await ex();
  const initial = [
    { text: 'Reproduce', done: false },
    { text: 'Fix', done: false },
  ];
  render(<Checklist initial={initial} />);
  await user.click(screen.getByLabelText('Fix'));
  expect(screen.getByLabelText('Fix')).toBeChecked();
  expect(screen.getByLabelText('Reproduce')).not.toBeChecked();
  expect(initial[1].done, 'Checklist changed an item object that the parent still holds. Make a new object for the item that changes.').toBe(false);
});
