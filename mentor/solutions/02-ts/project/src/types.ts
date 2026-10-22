import type { Priority, Status } from './constants.ts';

// Fields every ticket has, whatever its status.
export type TicketBase = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: string;
  dueDate: string | null;
};

export type OpenTicket = TicketBase & { status: 'open' };
export type AssignedTicket = TicketBase & { status: 'assigned'; assignee: string };
export type BlockedTicket = TicketBase & { status: 'blocked'; assignee: string; blockedReason: string };
export type ClosedTicket = TicketBase & { status: 'closed'; closedAt: string; assignee?: string };
export type Ticket = OpenTicket | AssignedTicket | BlockedTicket | ClosedTicket;

export type Assignee = { id: string; name: string };

export type TicketFilters = { status?: Status | ''; priority?: Priority | ''; assignee?: string; search?: string };
export type SortField = 'createdAt' | 'priority' | 'title' | 'dueDate';
export type TicketSort = { by?: SortField; direction?: 'asc' | 'desc' };

export type TicketStats = { total: number; open: number; overdue: number; averageAgeDays: number };

// What a form sends: no id or createdAt yet, and nothing is trusted.
export type TicketDraft = { title?: unknown; priority?: unknown; dueDate?: unknown };
export type FieldError = { field: 'title' | 'priority' | 'dueDate'; message: string };
export type ValidationResult = { valid: boolean; errors: FieldError[] };

export type LoadResult = { tickets: Ticket[]; assignees: Assignee[]; warnings: string[] };
