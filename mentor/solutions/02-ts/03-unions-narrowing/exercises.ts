// 02-ts/03 Unions and narrowing (solution)

export type Ticket = { id: string; title: string };
export type Assignee = { id: string; name: string };

// @step 1 (core)
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export const DEFAULT_PRIORITY: Priority = 'medium';

// @step 2 (core)
export function assigneeName(assigneeId: string | undefined, assignees: Assignee[]): string {
  if (assigneeId === undefined) return 'Unassigned';
  const found = assignees.find((a) => a.id === assigneeId);
  return found ? found.name : `Unknown (${assigneeId})`;
}

// @step 3 (core)
export function toTicketId(id: string | number): string {
  return typeof id === 'number' ? `t${id}` : id;
}

// @step 4 (core)
export type ApiError = { error: string };
export function describeResult(result: Ticket | ApiError): string {
  return 'error' in result ? `Error: ${result.error}` : result.title;
}

// @step 5 (stretch)
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Something went wrong';
}

// @step 6 (core)
export function priorityRank(priority: Priority): number {
  switch (priority) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
    case 'urgent':
      return 4;
  }
}

// @step 7 (stretch)
export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];
export function parsePriority(text: string): Priority | undefined {
  const wanted = text.trim().toLowerCase();
  return PRIORITIES.find((p) => p === wanted);
}
