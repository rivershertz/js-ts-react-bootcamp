import axios from 'axios';
import { API_URL } from './constants.js';

// An axios instance pointed at the ticket API.
export function createClient(baseURL = API_URL) {
  return axios.create({ baseURL, timeout: 5000 });
}

// GET /tickets and return the list.
export async function fetchTickets(client) {
  const response = await client.get('/tickets');
  return response.data;
}

// GET /assignees and return the list.
export async function fetchAssignees(client) {
  const response = await client.get('/assignees');
  return response.data;
}

// Load tickets and assignees at the same time. Never throws: a failed request
// gives an empty list and a warning that says what went wrong.
export async function loadAll(client) {
  const [tickets, assignees] = await Promise.allSettled([fetchTickets(client), fetchAssignees(client)]);
  const warnings = [];
  if (tickets.status === 'rejected') warnings.push(`Could not load tickets: ${describeError(tickets.reason)}`);
  if (assignees.status === 'rejected') warnings.push(`Could not load assignees: ${describeError(assignees.reason)}`);
  return {
    tickets: tickets.status === 'fulfilled' ? tickets.value : [],
    assignees: assignees.status === 'fulfilled' ? assignees.value : [],
    warnings,
  };
}

function describeError(error) {
  if (error.response) return `the server answered ${error.response.status}`;
  if (error.code === 'ECONNREFUSED') return 'the server is not running';
  return error.message;
}
