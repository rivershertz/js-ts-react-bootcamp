import { Flex, Input, Select } from 'antd';
import { PRIORITIES, STATUSES } from '@tickets/logic';
import { useEffect, useRef } from 'react';

// filters: { status, priority }. An empty or missing value means "any".
export default function TicketFilters({ filters, onFiltersChange, search, onSearchChange }) {
  const searchRef = useRef(null);

  // Press / anywhere (outside a text field) to jump to the search box.
  useEffect(() => {
    function onKeyDown(event) {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea');
      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
  }, []);

  function change(field, value) {
    filters[field] = value;
    onFiltersChange(filters);
  }

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
        onChange={(status) => change('status', status)}
        options={STATUSES.map((s) => ({ value: s, label: s }))}
        style={{ width: 150 }}
      />
      <Select
        aria-label="Priority"
        placeholder="Any priority"
        allowClear
        value={filters.priority || undefined}
        onChange={(priority) => change('priority', priority)}
        options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        style={{ width: 150 }}
      />
    </Flex>
  );
}
