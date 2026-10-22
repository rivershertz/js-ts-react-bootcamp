import { useQuery } from '@tanstack/react-query';
import type { Assignee, Ticket } from '../logic';
import { http } from './client';

export async function fetchTickets(): Promise<Ticket[]> {
  const response = await http.get<Ticket[]>('/tickets');
  return response.data;
}

export async function fetchAssignees(): Promise<Assignee[]> {
  const response = await http.get<Assignee[]>('/assignees');
  return response.data;
}

export function useTickets() {
  return useQuery({ queryKey: ['tickets'], queryFn: fetchTickets });
}

export function useAssignees() {
  return useQuery({ queryKey: ['assignees'], queryFn: fetchAssignees });
}
