// The values every other file shares. The types are derived from them, so they cannot drift apart.
export const STATUSES = ['open', 'assigned', 'blocked', 'closed'] as const;
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const; // in order, lowest first
export const API_URL = 'http://localhost:8000/api';

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
