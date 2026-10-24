import { Alert, Button, Flex, Typography } from 'antd';
import { computeStats, filterTickets, sortTickets, type Ticket, type TicketSort } from '@tickets/logic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAssignees, useTickets } from '../api/tickets';
import StatsPanel from '../components/StatsPanel';
import TicketFilters, { type StatusPriorityFilters } from '../components/TicketFilters';
import TicketTable from '../components/TicketTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const NO_TICKETS: Ticket[] = [];
const NEWEST_FIRST: TicketSort = { by: 'createdAt', direction: 'desc' };

export default function TicketListPage() {
  const { data, isPending, isError, refetch } = useTickets();
  const { data: assignees = [] } = useAssignees();
  const [filters, setFilters] = useState<StatusPriorityFilters>({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TicketSort>(NEWEST_FIRST);
  const [searchParams, setSearchParams] = useSearchParams();
  const assignee = searchParams.get('assignee') ?? undefined;
  const debouncedSearch = useDebouncedValue(search, 300);
  const tickets = data ?? NO_TICKETS;

  // Derived during render, never copied into state. useMemo skips the work while only `search` changes.
  const rows = useMemo(
    () => sortTickets(filterTickets(tickets, { ...filters, assignee, search: debouncedSearch }), sort),
    [tickets, filters, assignee, debouncedSearch, sort],
  );
  const stats = useMemo(() => computeStats(tickets), [tickets]);
  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const count = tickets.length;
  useEffect(() => {
    document.title = `${count} tickets`;
  }, [count]);

  function changeAssignee(value: string | undefined) {
    setSearchParams((params) => {
      if (value) params.set('assignee', value);
      else params.delete('assignee');
      return params;
    });
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message="Could not load tickets. Is the Python server running?"
        action={<Button onClick={refresh}>Retry</Button>}
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
      <StatsPanel stats={stats} onRefresh={refresh} />
      <TicketFilters
        filters={filters}
        onFiltersChange={setFilters}
        search={search}
        onSearchChange={setSearch}
        assignee={assignee}
        onAssigneeChange={changeAssignee}
        assignees={assignees}
      />
      <TicketTable tickets={rows} assignees={assignees} loading={isPending} sort={sort} onSortChange={setSort} />
    </Flex>
  );
}
