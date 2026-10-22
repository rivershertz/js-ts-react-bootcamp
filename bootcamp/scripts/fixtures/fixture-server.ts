// A stand-in for the Python API, used by checks so they never depend on the real server running.
// Same routes and answers as server/server.py, on a random free port.
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import tickets from './tickets.json';
import assignees from './assignees.json';

export type FixtureOptions = {
  /** Milliseconds to wait before each answer. */
  delayMs?: number;
  /** Answer 500 on this route. */
  fail?: 'tickets' | 'assignees';
  /** Add one malformed ticket, like --bad-data. */
  badData?: boolean;
  /** Answer 500 on /api/tickets/:id (the Python server has no such option; checks use it for error handling). */
  failOne?: boolean;
};

export type FixtureServer = {
  baseURL: string;
  close: () => Promise<void>;
  /** What the server saw: total requests, and the most that were in flight at once. */
  stats: { requests: string[]; maxInFlight: number };
};

export async function startFixtureServer(options: FixtureOptions = {}): Promise<FixtureServer> {
  const data = structuredClone(tickets) as Record<string, unknown>[];
  if (options.badData) data.push({ id: 't-bad', title: 'Imported from the old system', priority: 3, status: 'open' });
  const stats = { requests: [] as string[], maxInFlight: 0 };
  let inFlight = 0;

  const server = http.createServer(async (req, res) => {
    inFlight++;
    stats.maxInFlight = Math.max(stats.maxInFlight, inFlight);
    stats.requests.push(`${req.method} ${req.url}`);
    if (options.delayMs) await new Promise((r) => setTimeout(r, options.delayMs));
    const send = (status: number, body: unknown) => {
      inFlight--;
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };
    const path = (req.url ?? '').split('?')[0].replace(/\/$/, '');
    const one = /^\/api\/tickets\/([\w-]+)$/.exec(path);
    if (path === '/api/tickets') {
      if (options.fail === 'tickets') return send(500, { error: 'Simulated failure on /api/tickets' });
      return send(200, data);
    }
    if (path === '/api/assignees') {
      if (options.fail === 'assignees') return send(500, { error: 'Simulated failure on /api/assignees' });
      return send(200, assignees);
    }
    if (one && options.failOne) return send(500, { error: 'Simulated failure on one ticket' });
    if (one) {
      const ticket = data.find((t) => t.id === one[1]);
      return ticket ? send(200, ticket) : send(404, { error: `No ticket with id ${one[1]}` });
    }
    send(404, { error: `Unknown route ${path}` });
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    baseURL: `http://127.0.0.1:${port}/api`,
    stats,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
