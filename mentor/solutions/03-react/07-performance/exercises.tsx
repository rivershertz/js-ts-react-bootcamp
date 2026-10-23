// 03-react/07 Performance: memo, useMemo, useCallback
// Check your work with:   yarn verify 03-react/07
// See it in the browser:  yarn dev 03-react/07
// Measure first: the playground shows render counts, and DevTools has a Performance tab.
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Ticket } from '../tickets';
import { countRender } from './renders';
import { filterByTitle } from './slow';

// Step 1 (core)
export function TicketSearch({ tickets }: { tickets: Ticket[] }): ReactNode {
  const [search, setSearch] = useState('');
  const [compact, setCompact] = useState(false);
  const shown = useMemo(() => filterByTitle(tickets, search), [tickets, search]);
  return (
    <div>
      <label>
        Search <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>
      <label>
        <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /> Compact
      </label>
      <ul style={{ lineHeight: compact ? 1.1 : 1.8 }}>
        {shown.map((ticket) => (
          <li key={ticket.id}>{ticket.title}</li>
        ))}
      </ul>
    </div>
  );
}

// Steps 2 and 3
type RowProps = { ticket: Ticket; selected: boolean; onSelect: (id: string) => void };

export const TicketRow = memo(function TicketRow({ ticket, selected, onSelect }: RowProps): ReactNode {
  countRender('TicketRow');
  return (
    <li>
      <button aria-pressed={selected} onClick={() => onSelect(ticket.id)}>
        {ticket.title}
      </button>
    </li>
  );
});

export function TicketPicker({ tickets }: { tickets: Ticket[] }): ReactNode {
  const [selectedId, setSelectedId] = useState<string>();
  const [picked, setPicked] = useState<string[]>([]);
  // Only setters inside, and React keeps setters the same across renders: no dependencies.
  const select = useCallback((id: string) => {
    setSelectedId(id);
    setPicked((list) => [...list, id]);
  }, []);
  return (
    <div>
      <ul>
        {tickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} selected={ticket.id === selectedId} onSelect={select} />
        ))}
      </ul>
      <p>Picked so far: {picked.join(', ') || 'nothing'}</p>
    </div>
  );
}

// Step 4 (core)
export const worthIt: Record<'A' | 'B' | 'C' | 'D' | 'E', boolean | undefined> = {
  // A: counting is cheaper than comparing the dependencies
  A: false,
  // B: slow work, repeated on renders that do not change its inputs
  B: true,
  // C: a plain <button> renders whatever its props are; nothing compares onClick
  C: false,
  // D: memo compares props, so a stable onRefresh lets StatsPanel skip renders
  D: true,
  // E: a new style object on every render: memo compares, finds a difference, renders anyway
  E: false,
};

// Step 5 (stretch)
export function useChangedProps(props: Record<string, unknown>): string[] {
  const previous = useRef<Record<string, unknown> | undefined>(undefined);
  useEffect(() => {
    previous.current = props;
  });
  const before = previous.current;
  if (before === undefined) return [];
  return Object.keys(props).filter((name) => !Object.is(props[name], before[name]));
}
