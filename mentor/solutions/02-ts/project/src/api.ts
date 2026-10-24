import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { API_URL } from './constants.ts';
import type { Assignee, LoadResult, Ticket } from './types.ts';
import { isAssignee, parseTickets } from './validation.ts';

// An axios instance pointed at the ticket API.
export function createClient(baseURL: string = API_URL): AxiosInstance {
  return axios.create({ baseURL, timeout: 5000 });
}

// GET /tickets, checked: malformed tickets are left out and their ids returned separately.
async function fetchCheckedTickets(client: AxiosInstance): Promise<{ tickets: Ticket[]; invalidIds: string[] }> {
  const response = await client.get<unknown>('/tickets');
  return parseTickets(response.data);
}

// GET /tickets and return the valid tickets.
export async function fetchTickets(client: AxiosInstance): Promise<Ticket[]> {
  return (await fetchCheckedTickets(client)).tickets;
}

// GET /assignees and return the valid assignees.
export async function fetchAssignees(client: AxiosInstance): Promise<Assignee[]> {
  const response = await client.get<unknown>('/assignees');
  return Array.isArray(response.data) ? response.data.filter(isAssignee) : [];
}

// Load tickets and assignees at the same time. Never throws: a failed request
// gives an empty list and a warning, and malformed tickets are reported, not trusted.
export async function loadAll(client: AxiosInstance): Promise<LoadResult> {
  const [tickets, assignees] = await Promise.allSettled([fetchCheckedTickets(client), fetchAssignees(client)]);
  const warnings: string[] = [];
  if (tickets.status === 'rejected') warnings.push(`Could not load tickets: ${describeError(tickets.reason)}`);
  else if (tickets.value.invalidIds.length > 0) {
    warnings.push(`Skipped ${tickets.value.invalidIds.length} malformed ticket(s): ${tickets.value.invalidIds.join(', ')}`);
  }
  if (assignees.status === 'rejected') warnings.push(`Could not load assignees: ${describeError(assignees.reason)}`);
  return {
    tickets: tickets.status === 'fulfilled' ? tickets.value.tickets : [],
    assignees: assignees.status === 'fulfilled' ? assignees.value : [],
    warnings,
  };
}

function describeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) return `the server answered ${error.response.status}`;
    if (error.code === 'ECONNREFUSED') return 'the server is not running';
  }
  return error instanceof Error ? error.message : String(error);
}
