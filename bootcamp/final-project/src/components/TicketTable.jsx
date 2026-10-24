import { Table, Tag } from 'antd';
import { statusLabel } from '@tickets/logic';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PRIORITY_COLORS = { low: 'default', medium: 'blue', high: 'orange', urgent: 'red' };
const STATUS_COLORS = { open: 'blue', assigned: 'purple', blocked: 'red', closed: 'default' };
const SORT_FIELDS = ['title', 'priority', 'dueDate', 'createdAt'];

// The table shows what it is given. Sorting is done by the page, so the columns
// tell antd which column is sorted instead of sorting by themselves.
// sort: { by, direction } or null when no column is picked.
export default function TicketTable({ tickets, assignees, loading, sort, onSortChange }) {
  const [rows, setRows] = useState(tickets);

  // Keep the rows up to date with the tickets we are given.
  useEffect(() => {
    setRows(tickets);
  }, [tickets]);

  const names = new Map(assignees.map((a) => [a.id, a.name]));
  const order = (field) => (sort?.by === field ? (sort.direction === 'desc' ? 'descend' : 'ascend') : null);

  const columns = [
    { title: 'Title', key: 'title', sorter: true, sortOrder: order('title'), render: (_, t) => <Link to={`/tickets/${t.id}`}>{t.title}</Link> },
    {
      title: 'Status',
      key: 'status',
      render: (_, t) => (
        <Tag color={STATUS_COLORS[t.status]} title={statusLabel(t)}>
          {t.status}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      key: 'priority',
      sorter: true,
      sortOrder: order('priority'),
      render: (_, t) => <Tag color={PRIORITY_COLORS[t.priority]}>{t.priority}</Tag>,
    },
    { title: 'Assignee', key: 'assignee', render: (_, t) => (t.assignee ? (names.get(t.assignee) ?? t.assignee) : '') },
    { title: 'Due', key: 'dueDate', sorter: true, sortOrder: order('dueDate'), render: (_, t) => t.dueDate ?? '' },
    { title: 'Created', key: 'createdAt', sorter: true, sortOrder: order('createdAt'), render: (_, t) => t.createdAt.slice(0, 10) },
  ];

  function handleChange(_pagination, _filters, sorter) {
    const picked = Array.isArray(sorter) ? sorter[0] : sorter;
    if (picked && picked.order && SORT_FIELDS.includes(picked.columnKey)) {
      onSortChange({ by: picked.columnKey, direction: picked.order === 'descend' ? 'desc' : 'asc' });
    } else {
      onSortChange(null);
    }
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={rows}
      loading={loading}
      onChange={handleChange}
      pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => `${total} tickets` }}
    />
  );
}
