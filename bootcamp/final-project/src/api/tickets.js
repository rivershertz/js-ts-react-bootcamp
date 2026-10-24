import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAssignees, fetchTickets, isTicket } from '@tickets/logic';
import { client } from './client';

export function useTickets() {
  return useQuery({ queryKey: ['tickets'], queryFn: () => fetchTickets(client) });
}

export function useAssignees() {
  return useQuery({ queryKey: ['assignees'], queryFn: () => fetchAssignees(client) });
}

async function fetchTicket(id) {
  const response = await client.get(`/tickets/${id}`);
  if (!isTicket(response.data)) throw new Error(`The server sent a malformed ticket for ${id}`);
  return response.data;
}

// One ticket for the form. Coming from the list, it shows at once from the cached list while it refreshes.
export function useTicket(id) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => fetchTicket(id),
    enabled: id !== undefined,
    initialData: () => queryClient.getQueryData(['tickets'])?.find((t) => t.id === id),
  });
}

// Create (no id) or replace (with id) a ticket, then refresh every ticket query.
// input: { title, description, priority, status, dueDate, assignee?, blockedReason? }
export function useSaveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }) => {
      const response = id ? await client.put(`/tickets/${id}`, input) : await client.post('/tickets', input);
      if (!isTicket(response.data)) throw new Error('The server answered with a malformed ticket');
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}
