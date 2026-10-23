import { Table, Tag, type TableColumnsType, type TableProps } from 'antd';
import { statusLabel, type Assignee, type Priority, type SortField, type Status, type Ticket, type TicketSort } from '@tickets/logic';
import { Link } from 'react-router-dom';

const PRIORITY_COLORS: Record<Priority, string> = { low: 'default', medium: 'blue', high: 'orange', urgent: 'red' };
const STATUS_COLORS: Record<Status, string> = { open: 'blue', assigned: 'purple', blocked: 'red', closed: 'default' };
const SORT_FIELDS: readonly SortField[] = ['title', 'priority', 'createdAt'];

function isSortField(value: unknown): value is SortField {
  return SORT_FIELDS.some((field) => field === value);
}

type Props = {
  tickets: Ticket[];
  assignees: Assignee[];
  loading: boolean;
  sort: TicketSort;
  onSortChange: (sort: TicketSort) => void;
};

// The table only shows what it is given. Sorting is done by the page (sortTickets), so the
// columns tell antd which column is sorted instead of sorting by themselves.
export default function TicketTable({ tickets, assignees, loading, sort, onSortChange }: Props) {
  const names = new Map(assignees.map((a) => [a.id, a.name]));
  const order = (field: SortField) => (sort.by === field ? (sort.direction === 'desc' ? 'descend' : 'ascend') : null);

  const columns: TableColumnsType<Ticket> = [
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
    { title: 'Assignee', key: 'assignee', render: (_, t) => ('assignee' in t && t.assignee ? (names.get(t.assignee) ?? t.assignee) : '') },
    { title: 'Due', key: 'dueDate', render: (_, t) => t.dueDate ?? '' },
    { title: 'Created', key: 'createdAt', sorter: true, sortOrder: order('createdAt'), render: (_, t) => t.createdAt.slice(0, 10) },
  ];

  const handleChange: TableProps<Ticket>['onChange'] = (_pagination, _filters, sorter) => {
    const picked = Array.isArray(sorter) ? sorter[0] : sorter;
    if (picked && picked.order && isSortField(picked.columnKey)) {
      onSortChange({ by: picked.columnKey, direction: picked.order === 'descend' ? 'desc' : 'asc' });
    } else {
      onSortChange({ by: 'createdAt', direction: 'desc' });
    }
  };

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tickets}
      loading={loading}
      onChange={handleChange}
      pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => `${total} tickets` }}
    />
  );
}
