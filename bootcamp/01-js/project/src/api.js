// Talking to the ticket API. Lessons: 01-js/04 (async) and 01-js/05 (modules).
/* eslint-disable @typescript-eslint/no-unused-vars -- the imports are used once you write the functions */
// Rules for every file in src/: no console.log, and never change the arrays or objects you are given.
import axios from 'axios';
import { API_URL } from './constants.js';

// Return an axios instance whose baseURL is `baseURL` (default: API_URL).
// Tip: axios.create({ baseURL })
export function createClient(baseURL = API_URL) {
  throw new Error('TODO: createClient');
}

// GET /tickets with `client` and return the list of tickets.
export async function fetchTickets(client) {
  throw new Error('TODO: fetchTickets');
}

// GET /assignees with `client` and return the list of assignees: [{ id: 'a1', name: 'Dana Levi' }, ...]
export async function fetchAssignees(client) {
  throw new Error('TODO: fetchAssignees');
}

// Load tickets and assignees at the same time, and never throw.
// Return { tickets, assignees, warnings }:
//   - a request that failed gives an empty list instead of its data
//   - warnings has one string per failed request. Say which one failed and why, for example
//     'Could not load assignees: the server answered 500'
//     'Could not load tickets: the server is not running'   (axios sets error.code to 'ECONNREFUSED')
export async function loadAll(client) {
  throw new Error('TODO: loadAll');
}
