import { Alert, Button, Flex, Typography } from 'antd';
import { computeStats, filterTickets, sortTickets } from '@tickets/logic';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssignees, useTickets } from '../api/tickets';
import StatsPanel from '../components/StatsPanel';
import TicketFilters from '../components/TicketFilters';
import TicketTable from '../components/TicketTable';

const newestFirst = (a, b) => b.createdAt.localeCompare(a.createdAt);

export default function TicketListPage() {
  const { data, isPending, isError, refetch } = useTickets();
  const { data: assignees = [] } = useAssignees();
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(null);

  const tickets = data ?? [];
  // Newest first until a column is picked.
  const ordered = sort ? sortTickets(tickets, sort) : tickets.sort(newestFirst);
  const rows = filterTickets(ordered, { ...filters, search });

  const count = tickets.length;
  useEffect(() => {
    document.title = `${count} tickets`;
  }, [count]);

  if (isError) {
    return (
      <Alert
        type="error"
        message="Could not load tickets. Is the Python server running?"
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={2} style={{ margin: 0 }}>
          Tickets
        </Typography.Title>
        <Link to="/tickets/new">
          <Button type="primary">New ticket</Button>
        </Link>
      </Flex>
      <StatsPanel stats={computeStats(tickets)} onRefresh={() => refetch()} />
      <TicketFilters filters={filters} onFiltersChange={setFilters} search={search} onSearchChange={setSearch} />
      <TicketTable tickets={rows} assignees={assignees} loading={isPending} sort={sort} onSortChange={setSort} />
    </Flex>
  );
}
