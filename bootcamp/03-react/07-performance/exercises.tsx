// 03-react/07 Performance: memo, useMemo, useCallback
//
// What you build: faster versions of a slow search and a ticket picker, measured before and after.
// Finished when:  `yarn verify 03-react/07` shows ✓ for steps 1 to 4. Stretch steps are optional.
//
// Check your work with:   yarn verify 03-react/07
// See it in the browser:  yarn dev 03-react/07
// Measure first: the playground shows render counts, and DevTools has a Performance tab.
import { useState, type ReactNode } from 'react';
import type { Ticket } from '../tickets';
import { countRender } from './renders';
import { filterByTitle } from './slow';

// Step 1 (core): keep the filtered list
// TicketSearch filters with filterByTitle, which is slow (see slow.ts). Ticking "Compact"
// only changes the spacing, yet every tick runs the filter again: a full render does all the work again.
// Keep the filtered list between renders, and filter again only when its inputs change.
//
// Example: tick "Compact" → filterByTitle does not run; type in the search → it runs.
export function TicketSearch({ tickets }: { tickets: Ticket[] }): ReactNode {
  const [search, setSearch] = useState('');
  const [compact, setCompact] = useState(false);
  const shown = filterByTitle(tickets, search);
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

// Step 2 (core): skip unchanged rows
// Clicking a ticket in TicketPicker renders every TicketRow again, though only two rows change:
// the one that was selected and the one that is now. Make TicketRow skip a render when its props
// are the same as last time.
//
// Step 3 (core): keep one onSelect
// Step 2 alone does not help yet: watch the counter in the playground. Every TicketPicker render
// passes each row a brand-new onSelect function, so a row's props are never "the same as last time".
// Keep one onSelect function across renders.
//
// Example (steps 2 and 3 together): 20 rows, click one → only 2 rows render again, not 20.
type RowProps = { ticket: Ticket; selected: boolean; onSelect: (id: string) => void };

export function TicketRow({ ticket, selected, onSelect }: RowProps): ReactNode {
  countRender('TicketRow');
  return (
    <li>
      <button aria-pressed={selected} onClick={() => onSelect(ticket.id)}>
        {ticket.title}
      </button>
    </li>
  );
}

export function TicketPicker({ tickets }: { tickets: Ticket[] }): ReactNode {
  const [selectedId, setSelectedId] = useState<string>();
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <div>
      <ul>
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            selected={ticket.id === selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setPicked((list) => [...list, id]);
            }}
          />
        ))}
      </ul>
      <p>Picked so far: {picked.join(', ') || 'nothing'}</p>
    </div>
  );
}

// Step 4 (core): worth it?
// Memoizing is not free: every render compares the dependencies, the old value stays in memory,
// and the code is harder to read. For each case, is it worth it? Replace undefined with true or false.
//
// When done: no undefined is left; each letter A to E is true or false.
export const worthIt: Record<'A' | 'B' | 'C' | 'D' | 'E', boolean | undefined> = {
  // A: const count = useMemo(() => tickets.length, [tickets]);
  A: undefined,
  // B: useMemo around filtering 2000 tickets, in a page that renders again on every key press
  //    in an unrelated input
  B: undefined,
  // C: useCallback around an onClick that is passed to a plain <button>
  C: undefined,
  // D: useCallback around onRefresh, passed to a StatsPanel that is wrapped in memo
  D: undefined,
  // E: memo around a component that is always given style={{ padding: 8 }}
  E: undefined,
};

// Step 5 (stretch): useChangedProps
// A debugging hook: useChangedProps(props) returns the names of the props that are not the
// same (Object.is) as on the previous render. On the first render, it returns [].
// Put it in a component that renders too often, and log what it returns.
//
// Example: renders with { a: 1, b: list }, then { a: 2, b: list } → [] the first time, ['a'] the second.
export function useChangedProps(props: Record<string, unknown>): string[] {
  throw new Error('TODO: step 5');
}
