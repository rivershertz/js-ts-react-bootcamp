// Grouping and summary numbers. Lesson: 01-js/02 (array methods, reduce).
/* eslint-disable @typescript-eslint/no-unused-vars -- the imports are used once you write the functions */
import { STATUSES } from './constants.js';

// Return { open: [...], assigned: [...], blocked: [...], closed: [...] }.
// Every status must be there, even with an empty list.
export function groupByStatus(tickets) {
  throw new Error('TODO: groupByStatus');
}

// Return { total, open, overdue, averageAgeDays }:
//   total           number of tickets
//   open            tickets that are not closed
//   overdue         tickets that are not closed and whose dueDate is before today's date
//                   (dates look like '2026-10-15'; today is now.toISOString().slice(0, 10))
//   averageAgeDays  average age of the tickets that are not closed, in days, rounded to 1 decimal.
//                   A ticket's age is the number of whole days between createdAt and now.
//                   0 when there are no such tickets.
// `now` is a parameter so the result does not depend on the day you run it.
export function computeStats(tickets, now = new Date()) {
  throw new Error('TODO: computeStats');
}
