import { Button, Card, Flex, Statistic } from 'antd';
import type { TicketStats } from '@tickets/logic';
import { memo } from 'react';

type Props = { stats: TicketStats; onRefresh: () => void };

// memo: the panel only re-renders when stats or onRefresh change, so the page must keep both stable.
const StatsPanel = memo(function StatsPanel({ stats, onRefresh }: Props) {
  return (
    <Card size="small">
      <Flex gap={48} align="center" wrap>
        <Statistic title="Total" value={stats.total} />
        <Statistic title="Open" value={stats.open} />
        <Statistic title="Overdue" value={stats.overdue} />
        <Statistic title="Average age of open tickets" value={stats.averageAgeDays} suffix="days" />
        <Button onClick={onRefresh}>
          Refresh
        </Button>
      </Flex>
    </Card>
  );
});

export default StatsPanel;
