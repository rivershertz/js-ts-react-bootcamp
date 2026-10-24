import { Button, Card, Flex, Statistic } from 'antd';
import { memo } from 'react';

// memo: the panel only re-renders when stats or onRefresh change.
const StatsPanel = memo(function StatsPanel({ stats, onRefresh }) {
  return (
    <Card size="small">
      <Flex gap={48} align="center" wrap>
        <Statistic title="Total" value={stats.total} />
        <Statistic title="Open" value={stats.open} />
        <Statistic title="Overdue" value={stats.overdue} />
        <Statistic title="Average age of open tickets" value={stats.averageAgeDays} suffix="days" />
        <Button onClick={onRefresh}>Refresh</Button>
      </Flex>
    </Card>
  );
});

export default StatsPanel;
