import axios from 'axios';

// Every request goes to /api/... on the dev server, which proxies it to the Python API.
export const http = axios.create({ baseURL: '/api' });
