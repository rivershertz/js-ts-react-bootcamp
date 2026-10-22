import { Alert, Button, Flex, Input, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { useTickets } from '../api/tickets';
import TicketTable from '../components/TicketTable';
import { compareTickets, filterTickets } from '../logic';

export default function TicketListPage() {
  const { data, isPending, isError, refetch } = useTickets();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const tickets = data ?? [];
  const sorted = tickets.sort(compareTickets(sortBy));
  const rows = filterTickets(sorted, { search });

  useEffect(() => {
    document.title = `${tickets.length} tickets`;
  }, []);

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
        <Radio.Group value={sortBy} onChange={(e) => setSortBy(e.target.value)} optionType="button">
          <Radio.Button value="newest">Newest</Radio.Button>
          <Radio.Button value="priority">Priority</Radio.Button>
        </Radio.Group>
      </Flex>
      <TicketTable tickets={rows} loading={isPending} />
    </Flex>
  );
}
