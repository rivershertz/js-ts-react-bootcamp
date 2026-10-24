// Playground for this module. Run: yarn dev 03-react/05 (and, in a second terminal, python server/server.py)
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Step } from '../../playground/Step';
import { TicketBoard, TicketsView, useTicket, useTickets } from './exercises';

function TicketCount({ name }: { name: string }) {
  const { data } = useTickets();
  return (
    <p>
      {name}: {data ? `${data.length} tickets` : 'nothing yet'}
    </p>
  );
}

function TicketPicker() {
  const { data } = useTickets();
  const [id, setId] = useState<string>();
  const ticket = useTicket(id);
  return (
    <div>
      <select aria-label="Ticket" value={id ?? ''} onChange={(e) => setId(e.target.value || undefined)}>
        <option value="">Pick a ticket</option>
        {data?.map((t) => (
          <option key={t.id} value={t.id}>
            {t.id}
          </option>
        ))}
      </select>
      <p>{id === undefined ? 'No ticket picked' : ticket.data ? ticket.data.title : 'Loading...'}</p>
    </div>
  );
}

// One cache for the whole page, as in a real app.
const queryClient = new QueryClient();

createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto' }}>
      <h1>Server data playground</h1>
      <p>Open DevTools, Network tab, and filter on "api" to see each request.</p>
      <Step title="Step 1: two components call useTickets(). How many requests?">
        <TicketCount name="First" />
        <TicketCount name="Second" />
      </Step>
      <Step title="Step 2: loading and error states (try python server/server.py --delay 1500, or --fail tickets)">
        <TicketsView />
      </Step>
      <Step title="Step 3: useTicket(id)">
        <TicketPicker />
      </Step>
      <Step title="Step 4: close a ticket (restart the server to reopen them)">
        <TicketBoard />
      </Step>
    </main>
  </QueryClientProvider>,
);
