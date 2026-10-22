import { PRIORITIES, STATUSES, type Priority, type Status } from './constants.ts';
import type { Assignee, FieldError, Ticket, TicketDraft, ValidationResult } from './types.ts';

// Check a new ticket before sending it. Collect every error, not just the first.
export function validateTicket(draft: TicketDraft, now: Date = new Date()): ValidationResult {
  const errors: FieldError[] = [];
  if (typeof draft.title !== 'string' || draft.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  }
  if (!isPriority(draft.priority)) {
    errors.push({ field: 'priority', message: `Priority must be one of ${PRIORITIES.join(', ')}` });
  }
  if (draft.dueDate != null && draft.dueDate !== '') {
    const today = now.toISOString().slice(0, 10);
    if (typeof draft.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate)) {
      errors.push({ field: 'dueDate', message: 'Due date must look like 2026-12-31' });
    } else if (draft.dueDate < today) {
      errors.push({ field: 'dueDate', message: 'Due date cannot be in the past' });
    }
  }
  return { valid: errors.length === 0, errors };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isStatus(value: unknown): value is Status {
  return STATUSES.some((s) => s === value);
}

export function isPriority(value: unknown): value is Priority {
  return PRIORITIES.some((p) => p === value);
}

export function isAssignee(value: unknown): value is Assignee {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string';
}

// A ticket from the API, checked field by field, including the fields its status requires.
export function isTicket(value: unknown): value is Ticket {
  if (!isRecord(value)) return false;
  const baseOk =
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    isPriority(value.priority) &&
    typeof value.createdAt === 'string' &&
    (value.dueDate === null || typeof value.dueDate === 'string');
  if (!baseOk || !isStatus(value.status)) return false;
  switch (value.status) {
    case 'open':
      return true;
    case 'assigned':
      return typeof value.assignee === 'string';
    case 'blocked':
      return typeof value.assignee === 'string' && typeof value.blockedReason === 'string';
    case 'closed':
      return typeof value.closedAt === 'string' && (value.assignee === undefined || typeof value.assignee === 'string');
  }
}

// Keep the valid tickets from an API answer and report the ids of the others.
export function parseTickets(data: unknown): { tickets: Ticket[]; invalidIds: string[] } {
  if (!Array.isArray(data)) throw new Error('Expected a list of tickets');
  const tickets = data.filter(isTicket);
  const invalidIds = data.filter((item) => !isTicket(item)).map((item) => (isRecord(item) && typeof item.id === 'string' ? item.id : '?'));
  return { tickets, invalidIds };
}
