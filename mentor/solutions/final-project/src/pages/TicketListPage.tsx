import { Alert, Button, Flex, Input, Radio, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAssignees, useTickets } from '../api/tickets';
import TicketTable from '../components/TicketTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { compareTickets, filterTickets, type SortBy } from '../logic';

export default function TicketListPage() {
  const { data, isPending, isError, refetch } = useTickets();
  const { data: assignees = [] } = useAssignees();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [searchParams, setSearchParams] = useSearchParams();
  const assignee = searchParams.get('assignee') ?? undefined;
  const debouncedSearch = useDebouncedValue(search, 300);

  const rows = useMemo(
    () => filterTickets(data ?? [], { search: debouncedSearch, assignee }).toSorted(compareTickets(sortBy)),
    [data, debouncedSearch, assignee, sortBy],
  );

  const count = data?.length ?? 0;
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
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <Flex vertical gap={16}>
      <Flex gap={16} wrap>
        <Input
          aria-label="Search"
          placeholder="Search titles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
          allowClear
        />
        <Select
          aria-label="Assignee"
          placeholder="Any assignee"
          allowClear
          value={assignee}
          onChange={changeAssignee}
          options={assignees.map((a) => ({ value: a.id, label: a.name }))}
          style={{ minWidth: 200 }}
        />
        <Radio.Group value={sortBy} onChange={(e) => setSortBy(e.target.value)} optionType="button">
          <Radio.Button value="newest">Newest</Radio.Button>
          <Radio.Button value="priority">Priority</Radio.Button>
        </Radio.Group>
      </Flex>
      <TicketTable tickets={rows} loading={isPending} />
    </Flex>
  );
}
