// @vitest-environment jsdom
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button, theme } from 'antd';
import type { ComponentType, ReactNode } from 'react';
import { expect, vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import { PRIORITIES, sampleTickets } from '../../../03-react/tickets';

type Ticket = (typeof sampleTickets)[number];
type Values = { title: string; priority: string };
type Exercises = {
  PriorityTag: ComponentType<{ priority: string }>;
  TicketTable: ComponentType<{ tickets: Ticket[] }>;
  TicketForm: ComponentType<{ ticket?: Ticket; onSave: (values: Values) => void }>;
  ThemedApp: ComponentType<{ children: ReactNode }>;
  antdMajorVersion: (dependencies: Record<string, string>) => number | undefined;
};

const step = defineSteps('03-react/06');
const ex = () => load<Exercises>('03-react/06-antd/exercises');
const user = userEvent.setup({ pointerEventsCheck: 0 });
const COLORS: Record<string, string> = { low: 'green', medium: 'blue', high: 'orange', urgent: 'red' };

/** The text of one column for every body row on the current page. */
function column(header: string): string[] {
  const headers = screen.getAllByRole('columnheader').map((th) => th.textContent?.trim());
  const index = headers.indexOf(header);
  return screen
    .getAllByRole('row')
    .filter((tr) => tr.classList.contains('ant-table-row'))
    .map((tr) => tr.querySelectorAll('td')[index]?.textContent?.trim() ?? '');
}

step(1, async () => {
  const { PriorityTag } = await ex();
  for (const priority of PRIORITIES) {
    const { container, unmount } = render(<PriorityTag priority={priority} />);
    const tag = container.querySelector('.ant-tag');
    ensure(tag !== null, `PriorityTag should render an antd <Tag> (for "${priority}")`);
    ensure(tag?.textContent === priority, `The tag for "${priority}" should say "${priority}"`);
    ensure(tag?.classList.contains(`ant-tag-${COLORS[priority]}`) === true, `The tag for "${priority}" should be ${COLORS[priority]}: <Tag color="${COLORS[priority]}">`);
    unmount();
  }
});

step(2, async () => {
  const { TicketTable } = await ex();
  const warn = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const { container } = render(<TicketTable tickets={sampleTickets} />);
    const headers = screen.getAllByRole('columnheader').map((th) => th.textContent?.trim());
    ensure(
      ['Title', 'Status', 'Priority'].every((h) => headers.includes(h)) && headers.length === 3,
      `The table should have the columns Title, Status, Priority, not: ${headers.join(', ')}`,
    );
    ensure(column('Title').length === 5, `Show 5 tickets per page; the first page has ${column('Title').length}`);
    ensure(container.querySelector('tr[data-row-key="t1"]') !== null, 'Each row should use the ticket id as its key: rowKey="id"');
    const tag = within(container.querySelector('tr[data-row-key="t4"]') as HTMLElement).queryByText('urgent');
    ensure(tag?.closest('.ant-tag') !== null && tag !== null, 'The Priority column should show a <PriorityTag> for each ticket');
  } finally {
    warn.mockRestore();
  }
});

step(3, async () => {
  const { TicketTable } = await ex();
  render(<TicketTable tickets={sampleTickets} />);
  const header = screen.getAllByRole('columnheader').find((th) => th.textContent?.trim() === 'Priority');
  ensure(header !== undefined, 'The table needs a Priority column (step 2)');
  await user.click(header as HTMLElement);
  const shown = column('Priority');
  const expected = sampleTickets.map((t) => t.priority).sort((a, b) => PRIORITIES.indexOf(a) - PRIORITIES.indexOf(b)).slice(0, shown.length);
  ensure(
    JSON.stringify(shown) === JSON.stringify(expected),
    `After a click on Priority the page should go ${expected.join(', ')}, not ${shown.join(', ')}`,
  );
});

step(4, async () => {
  const { TicketForm } = await ex();
  const onSave = vi.fn();
  render(<TicketForm onSave={onSave} />);
  await user.click(screen.getByRole('button', { name: 'Create' }));
  await waitFor(() => ensure(screen.queryByText('Title is required') !== null, 'Submitting an empty form should show "Title is required" under the title'));
  ensure(screen.queryByText('Pick a priority') !== null, 'Submitting an empty form should show "Pick a priority"');
  expect(onSave, 'onSave must not run while the form has errors').not.toHaveBeenCalled();

  await user.type(screen.getByLabelText('Title'), 'Printer is on fire');
  const priority = screen.queryByRole('combobox', { name: 'Priority' });
  ensure(priority !== null, 'The form needs a Priority <Select>, inside <Form.Item label="Priority" name="priority">');
  await user.click(priority as HTMLElement);
  await user.click(await screen.findByTitle('urgent'));
  await user.click(screen.getByRole('button', { name: 'Create' }));
  await waitFor(() => expect(onSave, 'A valid submit should call onSave once').toHaveBeenCalledTimes(1));
  expect(onSave, 'onSave gets the form values').toHaveBeenCalledWith({ title: 'Printer is on fire', priority: 'urgent' });
});

step(5, async () => {
  const { TicketForm } = await ex();
  const onSave = vi.fn();
  const ticket = sampleTickets[2];
  render(<TicketForm ticket={ticket} onSave={onSave} />);
  ensure(
    (screen.getByLabelText('Title') as HTMLInputElement).value === ticket.title,
    `Editing ${ticket.id}, the Title field should start with "${ticket.title}"`,
  );
  const save = screen.queryByRole('button', { name: 'Save' });
  ensure(save !== null, 'When a ticket is given, the button should say "Save"');
  await user.type(screen.getByLabelText('Title'), ' (again)');
  await user.click(save as HTMLElement);
  await waitFor(() => expect(onSave, 'Save should call onSave').toHaveBeenCalledTimes(1));
  expect(onSave, 'Both fields should start with the ticket\'s values').toHaveBeenCalledWith({ title: `${ticket.title} (again)`, priority: ticket.priority });
});

step(6, async () => {
  const { ThemedApp } = await ex();
  let token: ReturnType<typeof theme.useToken>['token'] | undefined;
  function Probe() {
    token = theme.useToken().token;
    return <Button type="primary">Save</Button>;
  }
  render(
    <ThemedApp>
      <Probe />
    </ThemedApp>,
  );
  ensure(token?.colorPrimary.toLowerCase() === '#0f766e', `colorPrimary should be #0f766e, not ${token?.colorPrimary}. Set it in <ConfigProvider theme={{ token: ... }}>`);
  ensure(token?.borderRadius === 4, `borderRadius should be 4, not ${token?.borderRadius}`);
  ensure(screen.queryByRole('button', { name: 'Save' }) !== null, 'ThemedApp should render its children');
});

step(7, async () => {
  const { antdMajorVersion } = await ex();
  const cases: [Record<string, string>, number | undefined][] = [
    [{ react: '^18.3.1', antd: '^4.24.0' }, 4],
    [{ antd: '~3.26.20', moment: '^2.29.4' }, 3],
    [{ antd: '5.29.3' }, 5],
    [{ react: '^16.14.0' }, undefined],
  ];
  for (const [dependencies, expected] of cases) {
    const got = callPure(antdMajorVersion, dependencies);
    ensure(got === expected, `antdMajorVersion(${JSON.stringify(dependencies)}) should be ${expected}, not ${JSON.stringify(got)}`);
  }
});

step(8, async () => {
  const { TicketTable } = await ex();
  render(<TicketTable tickets={sampleTickets} />);
  const statusHeader = screen.getAllByRole('columnheader').find((th) => th.textContent?.trim() === 'Status');
  const trigger = statusHeader?.querySelector('.ant-table-filter-trigger');
  ensure(trigger != null, 'The Status column should have a filter (the funnel icon in its header)');
  await user.click(trigger as HTMLElement);
  await user.click(await screen.findByText('closed', { selector: '.ant-dropdown span' }));
  await user.click(screen.getByRole('button', { name: 'OK' }));
  await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
  const shown = column('Status');
  ensure(shown.length === 1 && shown[0] === 'closed', `Filtering on "closed" should leave the one closed ticket, not: ${shown.join(', ')}`);
});
