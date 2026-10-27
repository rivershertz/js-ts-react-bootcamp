// 03-react/06 Ant Design: Table, Form, theming, versions
//
// What you build: a ticket table and form with Ant Design, themed in the team's colours.
// Finished when:  `yarn verify 03-react/06` shows ✓ for steps 1 to 7. Stretch steps are optional.
//
// Check your work with:   yarn verify 03-react/06
// See it in the browser:  yarn dev 03-react/06
// The antd docs for version 5 are your friend here: Table, Form, Select, Tag, ConfigProvider.
import { Button, Form, Input, Table, type TableColumnsType } from 'antd';
import type { ReactNode } from 'react';
import type { Priority, Ticket } from '../tickets';

// Step 1 (core): PriorityTag
// PriorityTag shows a priority as an antd <Tag> with one colour per priority:
// low: green, medium: blue, high: orange, urgent: red.
// Keep the colours in a Record<Priority, string>, so TypeScript tells you if one is missing.
//
// Example: <PriorityTag priority="urgent" /> shows <Tag color="red">urgent</Tag>.
export function PriorityTag({ priority }: { priority: Priority }): ReactNode {
  return <span>{priority}</span>;
}

// Step 2 (core): TicketTable
// TicketTable shows the tickets in an antd <Table> with three columns: Title, Status, Priority.
// The Priority column shows a <PriorityTag>. Show 5 tickets per page.
// Right now the Priority column is missing, and the console warns about keys:
// tell the Table which field of a ticket is the row's key.
//
// Example: 12 tickets → columns Title, Status, Priority; 5 rows on page 1; no key warning.
//
// Step 3 (core): sort by priority
// A click on the Priority header should sort the tickets from low to urgent: the real order
// of priorities, not alphabetical. Give the Priority column a sorter, a compare function.
// PRIORITIES (in ../tickets) lists the priorities in order.
//
// Example: click the Priority header once → low, medium, high, urgent (not high, low, medium, urgent).
//
// Step 8 (stretch): filter by status
// Let the user filter the Status column: one checkbox per status (STATUSES in ../tickets).
// Look up the column options `filters` and `onFilter`.
//
// Example: tick "open" in the Status header → only open tickets show.
const columns: TableColumnsType<Ticket> = [
  { title: 'Title', dataIndex: 'title' },
  { title: 'Status', dataIndex: 'status' },
];

export function TicketTable({ tickets }: { tickets: Ticket[] }): ReactNode {
  return <Table columns={columns} dataSource={tickets} />;
}

// Step 4 (core): TicketForm
// TicketForm is an antd <Form> with two fields and a submit button, "Create":
// - Title: an <Input>, required, with the message "Title is required"
// - Priority: a <Select> of the four priorities, required, with the message "Pick a priority"
// When the user submits valid values, it calls onSave({ title, priority }).
// Use Form.Item's name, label and rules, and the Form's onFinish: antd validates before it calls it.
//
// Example:
//   click Create with nothing filled in → "Title is required" and "Pick a priority" show; onSave is not called
//   fill in "Export" and high, click Create → onSave({ title: 'Export', priority: 'high' })
//
// Step 5 (core): edit with the same form
// The same form edits a ticket. When `ticket` is given, the fields start with its title and
// priority, and the button says "Save" instead of "Create". Look up the Form's initialValues.
//
// Example: <TicketForm ticket={t1} onSave={...} /> opens with t1's title and priority filled in, and a "Save" button.
export type TicketFormValues = { title: string; priority: Priority };

export function TicketForm({ onSave }: { ticket?: Ticket; onSave: (values: TicketFormValues) => void }): ReactNode {
  return (
    <Form layout="vertical" onFinish={onSave}>
      <Form.Item label="Title" name="title">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Create
      </Button>
    </Form>
  );
}

// Step 6 (core): ThemedApp
// The team's apps use teal as the main colour, #0f766e, and less rounded corners, 4 px.
// Wrap the children in antd's <ConfigProvider> with a theme whose tokens set colorPrimary and borderRadius.
//
// Example: <ThemedApp><Button type="primary">Go</Button></ThemedApp> shows a teal button with 4 px corners.
export function ThemedApp({ children }: { children: ReactNode }): ReactNode {
  return <>{children}</>;
}

// Step 7 (core): which antd?
// Given the dependencies from a project's package.json, which major version of antd does it use?
//
// Example:
//   antdMajorVersion({ antd: '^4.24.0' })    // 4
//   antdMajorVersion({ antd: '~3.26.20' })   // 3
//   antdMajorVersion({ antd: '5.29.3' })     // 5
//   antdMajorVersion({ react: '18.3.1' })    // undefined
export function antdMajorVersion(dependencies: Record<string, string>): number | undefined {
  throw new Error('TODO: step 7');
}
