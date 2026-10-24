// 03-react/05 Server data with React Query
// Start the API first:    python server/server.py
// Check your work with:   yarn verify 03-react/05
// See it in the browser:  yarn dev 03-react/05
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { Ticket } from '../tickets';
import { client } from './client';

// Step 1 (core)
export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => client.get<Ticket[]>('/tickets').then((response) => response.data),
  });
}

// Step 2 (core)
export function TicketsView(): ReactNode {
  const { data, isPending, isError, refetch } = useTickets();
  if (isPending) return <p>Loading tickets...</p>;
  if (isError) {
    return (
      <div>
        <p>Could not load tickets</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  return <ul>{data.map((ticket) => <li key={ticket.id}>{ticket.title}</li>)}</ul>;
}

// Step 3 (core), and step 5 (stretch): initialData
export function useTicket(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => client.get<Ticket>(`/tickets/${id}`).then((response) => response.data),
    enabled: id !== undefined,
    initialData: () => queryClient.getQueryData<Ticket[]>(['tickets'])?.find((ticket) => ticket.id === id),
  });
}

// Step 4 (core)
export function useCloseTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticket: Ticket) =>
      client.put<Ticket>(`/tickets/${ticket.id}`, { ...ticket, status: 'closed' }).then((response) => response.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
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
