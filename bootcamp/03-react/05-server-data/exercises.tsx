// 03-react/05 Server data with React Query
//
// What you build: ticket loading and saving with React Query, with loading and error states.
// Finished when:  `yarn verify 03-react/05` shows ✓ for steps 1 to 4. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Start the API first:    python server/server.py
// Check your work with:   yarn verify 03-react/05
// See it in the browser:  yarn dev 03-react/05
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import type { Ticket } from '../tickets';
import { client } from './client';

// Step 1 (core): useTickets with useQuery
// What:   useTickets() loads GET /tickets. It works, but it is written by hand with useEffect:
//         two components that call it send two requests, errors only reach the console,
//         and nothing else in the app can tell it to load again.
//         Rewrite it with useQuery under the query key ['tickets'], and return what useQuery returns.
// Result: two components using useTickets send one request between them (see the Network tab).
// Needs:  slides "useQuery: a key and a function" and "Two components, one request".
export function useTickets() {
  const [data, setData] = useState<Ticket[]>();
  useEffect(() => {
    client
      .get<Ticket[]>('/tickets')
      .then((response) => setData(response.data))
      .catch(console.error);
  }, []);
  return { data };
}

// Step 2 (core): loading and error states
// What:   TicketsView lists the ticket titles. While the tickets load it shows an empty page,
//         and when the server is down it shows the same empty page. Using what useTickets returns:
//         - while loading, show "Loading tickets..."
//         - on an error, show "Could not load tickets" and a "Retry" button that calls refetch()
//         - otherwise, a <ul> with one <li> per ticket title
// Result: stop the API and reload → "Could not load tickets" and Retry;  start it and click Retry → the list.
// Needs:  slide "Three states, in this order".
export function TicketsView(): ReactNode {
  const { data } = useTickets();
  return <ul>{data?.map((ticket) => <li key={ticket.id}>{ticket.title}</li>)}</ul>;
}

// Step 3 (core): wait for an id
// What:   useTicket(id) loads one ticket, GET /tickets/<id>, under the key ['tickets', id].
//         When no ticket is picked yet, id is undefined, and it still asks the server for
//         /tickets/undefined (look in the Network tab). Tell useQuery not to run until there is an id.
// Result: no request at all until a ticket is picked, then one GET /tickets/<id>.
// Needs:  slide "Query keys are arrays, matched by prefix".
export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => client.get<Ticket>(`/tickets/${id}`).then((response) => response.data),
  });
}

// Step 4 (core): refresh after a save
// What:   useCloseTicket() saves a ticket with status "closed" (PUT /tickets/<id>). The save works:
//         reload the page and the ticket is closed. But TicketBoard below keeps showing the old status.
//         After a successful save, tell React Query that the ['tickets'] data is out of date.
// Result: click Close → the board shows "closed" for that ticket without a page reload.
// Needs:  slide "useMutation: change data, then mark it stale".
export function useCloseTicket() {
  return useMutation({
    mutationFn: (ticket: Ticket) =>
      client.put<Ticket>(`/tickets/${ticket.id}`, { ...ticket, status: 'closed' }).then((response) => response.data),
  });
}

// Done for you: each ticket with its status and a Close button. Step 4 is checked through it.
export function TicketBoard(): ReactNode {
  const { data } = useTickets();
  const closeTicket = useCloseTicket();
  return (
    <ul>
      {data?.map((ticket) => (
        <li key={ticket.id}>
          {ticket.title}: {ticket.status}{' '}
          {ticket.status !== 'closed' && (
            <button aria-label={`Close ${ticket.title}`} disabled={closeTicket.isPending} onClick={() => closeTicket.mutate(ticket)}>
              Close
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

// Step 5 (stretch): start from the list
// What:   Picking a ticket that is already in the list still shows "Loading..." while GET /tickets/<id> runs.
//         Change useTicket (step 3) so it starts from the ticket in the ['tickets'] list cache when it is there,
//         and still asks the server for the latest version.
// Result: picking a listed ticket shows it at once, with no "Loading...".
// Needs:  slide "Stretch: start from data you already have" (initialData and queryClient.getQueryData).
