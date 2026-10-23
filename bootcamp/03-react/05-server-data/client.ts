// The axios client for this module. Done for you.
// In the browser, /api goes through the Vite dev server to the Python API (python server/server.py).
import axios from 'axios';

export const client = axios.create({ baseURL: '/api' });
