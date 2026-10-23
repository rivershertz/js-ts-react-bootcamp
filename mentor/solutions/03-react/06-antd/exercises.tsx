// 03-react/06 Ant Design: Table, Form, theming, versions
// Check your work with:   yarn verify 03-react/06
// See it in the browser:  yarn dev 03-react/06
// The antd docs for version 5 are your friend here: Table, Form, Select, Tag, ConfigProvider.
import { Button, ConfigProvider, Form, Input, Select, Table, Tag, type TableColumnsType } from 'antd';
import type { ReactNode } from 'react';
import { PRIORITIES, STATUSES, type Priority, type Ticket } from '../tickets';

// Step 1 (core)
const PRIORITY_COLORS: Record<Priority, string> = { low: 'green', medium: 'blue', high: 'orange', urgent: 'red' };

export function PriorityTag({ priority }: { priority: Priority }): ReactNode {
  return <Tag color={PRIORITY_COLORS[priority]}>{priority}</Tag>;
}

// Steps 2, 3 and 8
const columns: TableColumnsType<Ticket> = [
  { title: 'Title', dataIndex: 'title' },
  {
    title: 'Status',
    dataIndex: 'status',
    filters: STATUSES.map((status) => ({ text: status, value: status })),
    onFilter: (value, ticket) => ticket.status === value,
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    render: (priority: Priority) => <PriorityTag priority={priority} />,
    sorter: (a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority),
  },
];

export function TicketTable({ tickets }: { tickets: Ticket[] }): ReactNode {
  return <Table columns={columns} dataSource={tickets} rowKey="id" pagination={{ pageSize: 5 }} />;
}

// Steps 4 and 5
export type TicketFormValues = { title: string; priority: Priority };

export function TicketForm({ ticket, onSave }: { ticket?: Ticket; onSave: (values: TicketFormValues) => void }): ReactNode {
  const initialValues = ticket ? { title: ticket.title, priority: ticket.priority } : undefined;
  return (
    <Form<TicketFormValues> layout="vertical" initialValues={initialValues} onFinish={onSave}>
      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Pick a priority' }]}>
        <Select options={PRIORITIES.map((p) => ({ value: p, label: p }))} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {ticket ? 'Save' : 'Create'}
      </Button>
    </Form>
  );
}

// Step 6 (core)
export function ThemedApp({ children }: { children: ReactNode }): ReactNode {
  return <ConfigProvider theme={{ token: { colorPrimary: '#0f766e', borderRadius: 4 } }}>{children}</ConfigProvider>;
}

// Step 7 (core)
export function antdMajorVersion(dependencies: Record<string, string>): number | undefined {
  const range = dependencies.antd;
  if (range === undefined) return undefined;
  const match = range.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}
