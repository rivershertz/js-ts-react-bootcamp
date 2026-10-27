// 03-react/06 Ant Design: Table, Form, theming, versions
//
// What you build: a ticket table and form with Ant Design, themed in the team's colours.
// Finished when:  `yarn verify 03-react/06` shows ✓ for steps 1 to 7. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Check your work with:   yarn verify 03-react/06
// See it in the browser:  yarn dev 03-react/06
// The antd docs for version 5 are your friend here: Table, Form, Select, Tag, ConfigProvider.
import { Button, Form, Input, Table, type TableColumnsType } from 'antd';
import type { ReactNode } from 'react';
import type { Priority, Ticket } from '../tickets';

// Step 1 (core): PriorityTag
// What:   PriorityTag shows a priority as an antd <Tag> with one colour per priority:
//         low: green, medium: blue, high: orange, urgent: red.
//         Keep the colours in a Record<Priority, string>, so TypeScript tells you if one is missing.
// Result: <PriorityTag priority="urgent" /> is a red Tag reading "urgent".
// Needs:  slide "A component library is props all the way down"; Record (02-ts/06).
export function PriorityTag({ priority }: { priority: Priority }): ReactNode {
  return <span>{priority}</span>;
}

// Step 2 (core): TicketTable
// What:   TicketTable shows the tickets in an antd <Table> with three columns: Title, Status, Priority.
//         The Priority column shows a <PriorityTag>. Show 5 tickets per page.
//         Right now the Priority column is missing, and the console warns about keys:
//         tell the Table which field of a ticket is the row's key.
// Result: three columns, 5 rows per page, a coloured tag per priority, no key warning.
// Needs:  slide "Table: typed columns".
//
// Step 3 (core): sort by priority
// What:   A click on the Priority header should sort the tickets from low to urgent: the real order
//         of priorities, not alphabetical. Give the Priority column a sorter, a compare function.
//         PRIORITIES (in ../tickets) lists the priorities in order.
// Result: one click on the header → low, medium, high, urgent.
// Needs:  slide "Sorting and filtering"; a compare function (01-js/02).
//
// Step 8 (stretch): filter by status
// What:   Let the user filter the Status column: one checkbox per status (STATUSES in ../tickets).
// Result: ticking "open" in the Status header shows only open tickets.
// Needs:  the column options `filters` and `onFilter` (slide "Sorting and filtering").
const columns: TableColumnsType<Ticket> = [
  { title: 'Title', dataIndex: 'title' },
  { title: 'Status', dataIndex: 'status' },
];

export function TicketTable({ tickets }: { tickets: Ticket[] }): ReactNode {
  return <Table columns={columns} dataSource={tickets} />;
}

// Step 4 (core): TicketForm
// What:   TicketForm is an antd <Form> with two fields and a submit button, "Create":
//         - Title: an <Input>, required, with the message "Title is required"
//         - Priority: a <Select> of the four priorities, required, with the message "Pick a priority"
//         When the user submits valid values, it calls onSave({ title, priority }).
//         Use Form.Item's name, label and rules, and the Form's onFinish: antd validates before it calls it.
// Result: Create with an empty title shows "Title is required" and does not call onSave;
//         with both fields filled, onSave({ title: 'Export', priority: 'high' }) is called once.
// Needs:  slide "Form: fields, rules, onFinish".
//
// Step 5 (core): edit with the same form
// What:   The same form edits a ticket. When `ticket` is given, the fields start with its title and
//         priority, and the button says "Save" instead of "Create".
// Result: <TicketForm ticket={t1} ... /> opens filled with t1's title and priority, and a "Save" button.
// Needs:  the Form's initialValues (slide "Form.useForm: the form from the outside").
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
// What:   The team's apps use teal as the main colour, #0f766e, and less rounded corners, 4 px.
//         Wrap the children in antd's <ConfigProvider> with a theme whose tokens set colorPrimary and borderRadius.
// Result: a primary <Button> inside ThemedApp is teal with 4 px corners.
// Needs:  slide "Theming in version 5: tokens".
export function ThemedApp({ children }: { children: ReactNode }): ReactNode {
  return <>{children}</>;
}

// Step 7 (core): which antd?
// What:   Given the dependencies from a project's package.json, which major version of antd does it use?
// Result: "^4.24.0" gives 4, "~3.26.20" gives 3, "5.29.3" gives 5. No antd gives undefined.
// Needs:  slide "Which antd is this project on?"; replace, split and Number (cheat sheet, "Strings and numbers").
export function antdMajorVersion(dependencies: Record<string, string>): number | undefined {
  throw new Error('TODO: step 7');
}
