import { Table, Tag } from 'antd';

const PRIORITY_COLORS = { low: 'default', medium: 'blue', high: 'orange', urgent: 'red' };

const columns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority) => <Tag color={PRIORITY_COLORS[priority]}>{priority}</Tag>,
  },
  { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (d) => d.slice(0, 10) },
];

export default function TicketTable({ tickets, loading }) {
  return <Table rowKey="id" columns={columns} dataSource={tickets} loading={loading} pagination={{ pageSize: 10 }} />;
}
