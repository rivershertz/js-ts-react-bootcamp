// Checking a new ticket before it is sent. Lesson: 01-js/02.
/* eslint-disable @typescript-eslint/no-unused-vars -- the imports are used once you write the functions */
import { PRIORITIES } from './constants.js';

// Return { valid, errors }, where errors lists every problem, not just the first:
//   [{ field: 'title', message: 'Title is required' }, ...]
// Rules:
//   title     required: a string that is not empty or only spaces
//   priority  one of PRIORITIES
//   dueDate   optional (null, undefined or ''). If set, it must look like '2026-12-31'
//             and must not be before today's date.
// Write your own messages; the checker only looks at the field names.
// Needs: trim, a regular expression for the date format, and comparing ISO dates as text
//        (cheat sheet, "Strings and numbers" and "Dates and timers").
export function validateTicket(draft, now = new Date()) {
  throw new Error('TODO: validateTicket');
}
