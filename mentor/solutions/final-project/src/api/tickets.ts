import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAssignees, fetchTickets, isTicket, type Priority, type Status, type Ticket } from '@tickets/logic';
import { client } from './client';

// What the form sends. The server fills in id, createdAt and closedAt.
export type TicketInput = {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  assignee?: string;
  blockedReason?: string;
};

export function useTickets() {
  return useQuery({ queryKey: ['tickets'], queryFn: () => fetchTickets(client) });
}

export function useAssignees() {
  return useQuery({ queryKey: ['assignees'], queryFn: () => fetchAssignees(client) });
}

async function fetchTicket(id: string): Promise<Ticket> {
  const response = await client.get<unknown>(`/tickets/${id}`);
  if (!isTicket(response.data)) throw new Error(`The server sent a malformed ticket for ${id}`);
  return response.data;
}

// One ticket for the form. Coming from the list, it shows at once from the cached list while it refreshes.
export function useTicket(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => fetchTicket(id ?? ''),
    enabled: id !== undefined,
    initialData: () => queryClient.getQueryData<Ticket[]>(['tickets'])?.find((t) => t.id === id),
  });
}

// Create (no id) or replace (with id) a ticket, then refresh every ticket query.
export function useSaveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: TicketInput }): Promise<Ticket> => {
      const response = id ? await client.put<unknown>(`/tickets/${id}`, input) : await client.post<unknown>('/tickets', input);
      if (!isTicket(response.data)) throw new Error('The server answered with a malformed ticket');
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}
