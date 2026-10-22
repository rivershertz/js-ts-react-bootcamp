import { Flex, Input, Select, type InputRef } from 'antd';
import { PRIORITIES, STATUSES, type Assignee, type TicketFilters as Filters } from '@tickets/logic';
import { useEffect, useRef } from 'react';

export type StatusPriorityFilters = Pick<Filters, 'status' | 'priority'>;

type Props = {
  filters: StatusPriorityFilters;
  onFiltersChange: (filters: StatusPriorityFilters) => void;
  search: string;
  onSearchChange: (search: string) => void;
  assignee: string | undefined;
  onAssigneeChange: (assignee: string | undefined) => void;
  assignees: Assignee[];
};

export default function TicketFilters({ filters, onFiltersChange, search, onSearchChange, assignee, onAssigneeChange, assignees }: Props) {
  const searchRef = useRef<InputRef>(null);

  // Press / anywhere (outside a text field) to jump to the search box.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea');
      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <Flex gap={12} wrap>
      <Input
        ref={searchRef}
        aria-label="Search"
        placeholder="Search titles (press /)"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: 260 }}
        allowClear
      />
      <Select
        aria-label="Status"
        placeholder="Any status"
        allowClear
        value={filters.status || undefined}
        onChange={(status) => onFiltersChange({ ...filters, status })}
        options={STATUSES.map((s) => ({ value: s, label: s }))}
        style={{ width: 150 }}
      />
      <Select
        aria-label="Priority"
        placeholder="Any priority"
        allowClear
        value={filters.priority || undefined}
        onChange={(priority) => onFiltersChange({ ...filters, priority })}
        options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        style={{ width: 150 }}
      />
      <Select
        aria-label="Assignee"
        placeholder="Any assignee"
        allowClear
        value={assignee}
        onChange={onAssigneeChange}
        options={assignees.map((a) => ({ value: a.id, label: a.name }))}
        style={{ width: 200 }}
      />
    </Flex>
  );
}
