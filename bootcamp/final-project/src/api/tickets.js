import { useQuery } from '@tanstack/react-query';
import { http } from './client';

export async function fetchTickets() {
  const response = await http.get('/tickets');
  return response.data;
}

export async function fetchAssignees() {
  const response = await http.get('/assignees');
  return response.data;
}

export function useTickets() {
  return useQuery({ queryKey: ['tickets'], queryFn: fetchTickets });
}

export function useAssignees() {
  return useQuery({ queryKey: ['assignees'], queryFn: fetchAssignees });
}
