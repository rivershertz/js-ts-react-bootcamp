import { Table, Tag, type TableColumnsType } from 'antd';
import type { Priority, Ticket } from '../logic';

const PRIORITY_COLORS: Record<Priority, string> = { low: 'default', medium: 'blue', high: 'orange', urgent: 'red' };

const columns: TableColumnsType<Ticket> = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority: Priority) => <Tag color={PRIORITY_COLORS[priority]}>{priority}</Tag>,
  },
  { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => d.slice(0, 10) },
];

export default function TicketTable({ tickets, loading }: { tickets: Ticket[]; loading: boolean }) {
  return <Table rowKey="id" columns={columns} dataSource={tickets} loading={loading} pagination={{ pageSize: 10 }} />;
}
