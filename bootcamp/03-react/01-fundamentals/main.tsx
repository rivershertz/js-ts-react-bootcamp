// Playground for this module. Run: yarn dev 03-react/01
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Step } from '../../playground/Step';
import { sampleTickets } from '../tickets';
import { EstimateCounter, NewTicketForm, PriorityBadge, SearchableTicketList, TicketCard, TicketList } from './exercises';

function AddDemo() {
  const [titles, setTitles] = useState<string[]>([]);
  return (
    <div>
      <NewTicketForm onAdd={(title) => setTitles((t) => [...t, title])} />
      <p>Added so far: {titles.length ? titles.join(', ') : 'nothing'}</p>
    </div>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <main style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '40px auto' }}>
    <h1>React fundamentals playground</h1>
    <Step title="Step 1: PriorityBadge">
      <PriorityBadge priority="urgent" />
    </Step>
    <Step title="Step 2: TicketCard">
      <TicketCard ticket={sampleTickets[1]} />
    </Step>
    <Step title="Step 3: TicketList">
      <TicketList tickets={sampleTickets.slice(0, 3)} />
    </Step>
    <Step title="Step 4: EstimateCounter">
      <EstimateCounter />
    </Step>
    <Step title="Step 5: NewTicketForm">
      <AddDemo />
    </Step>
    <Step title="Step 6 (stretch): SearchableTicketList">
      <SearchableTicketList tickets={sampleTickets} />
    </Step>
  </main>,
);
