import { PRIORITIES } from './constants.js';

// Check a new ticket before sending it. Collect every error, not just the first.
export function validateTicket(draft, now = new Date()) {
  const errors = [];
  if (typeof draft.title !== 'string' || draft.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  }
  if (!PRIORITIES.includes(draft.priority)) {
    errors.push({ field: 'priority', message: `Priority must be one of ${PRIORITIES.join(', ')}` });
  }
  if (draft.dueDate != null && draft.dueDate !== '') {
    const today = now.toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate)) {
      errors.push({ field: 'dueDate', message: 'Due date must look like 2026-12-31' });
    } else if (draft.dueDate < today) {
      errors.push({ field: 'dueDate', message: 'Due date cannot be in the past' });
    }
  }
  return { valid: errors.length === 0, errors };
}
