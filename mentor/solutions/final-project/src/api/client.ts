import { createClient } from '@tickets/logic';

// Every request goes to /api/... on the dev server, which proxies it to the Python API.
export const client = createClient('/api');
