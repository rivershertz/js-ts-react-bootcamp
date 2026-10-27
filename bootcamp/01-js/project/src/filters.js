// Filtering and sorting. Lessons: 01-js/01 (values and references) and 01-js/02 (array methods).
/* eslint-disable @typescript-eslint/no-unused-vars -- the imports are used once you write the functions */
import { PRIORITIES } from './constants.js';

// Keep the tickets that match every filter that is set:
//   filters = { status: 'open', priority: 'high', assignee: 'a1', search: 'login' }
// A filter that is missing or empty ('') does not filter anything.
// search matches part of the title, ignoring upper / lower case and spaces around it
// (trim, toLowerCase and includes are in the cheat sheet, "Strings and numbers").
export function filterTickets(tickets, filters = {}) {
  throw new Error('TODO: filterTickets');
}

// Return a sorted copy of `tickets`. The original array must not change.
//   by:        'createdAt' | 'priority' | 'title'
//   direction: 'asc' | 'desc'
// Priority order comes from PRIORITIES: ascending means low first, descending means urgent first.
// Stretch: also support by: 'dueDate', with tickets that have no due date always last.
export function sortTickets(tickets, { by = 'createdAt', direction = 'asc' } = {}) {
  throw new Error('TODO: sortTickets');
}
