import axios, { type AxiosInstance } from 'axios';
import { afterAll, beforeAll, expect, vi } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { startFixtureServer, type FixtureServer } from '../../fixtures/fixture-server';

type Ticket = { id: string; title: string };
type Exercises = {
  wait: (ms: number) => Promise<void>;
  predictOrder: () => string[];
  predictAwait: () => string[];
  doubleLater: (getNumber: () => Promise<number>) => Promise<number>;
  addOneWithThen: (getNumber: () => Promise<number>) => Promise<number>;
  loadOr: <T>(load: () => Promise<T>, fallback: T) => Promise<T>;
  fetchTitle: (c: AxiosInstance, id: string) => Promise<string>;
  fetchTicketOrNull: (c: AxiosInstance, id: string) => Promise<Ticket | null>;
  fetchOneByOne: (c: AxiosInstance, ids: string[]) => Promise<Ticket[]>;
  fetchMany: (c: AxiosInstance, ids: string[]) => Promise<Ticket[]>;
  fetchSome: (c: AxiosInstance, ids: string[]) => Promise<{ found: Ticket[]; failed: string[] }>;
  withTimeout: <T>(p: Promise<T>, ms: number) => Promise<T>;
  retry: <T>(fn: () => Promise<T>, times: number) => Promise<T>;
};

const step = defineSteps('01-js/04');
const ex = () => load<Exercises>('01-js/04-async/exercises');
let api: FixtureServer;
let slow: FixtureServer;
let client: AxiosInstance;
let slowClient: AxiosInstance;

beforeAll(async () => {
  api = await startFixtureServer();
  slow = await startFixtureServer({ delayMs: 150 });
  client = axios.create({ baseURL: api.baseURL });
  slowClient = axios.create({ baseURL: slow.baseURL });
});
afterAll(async () => {
  await api.close();
  await slow.close();
});

step(1, async () => {
  const { wait } = await ex();
  vi.useFakeTimers();
  try {
    let done = false;
    const p = wait(500).then(() => (done = true));
    expect(p, 'wait must return a promise').toBeInstanceOf(Promise);
    await vi.advanceTimersByTimeAsync(499);
    expect(done, 'resolved too early').toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(done, 'did not resolve after the time passed').toBe(true);
  } finally {
    vi.useRealTimers();
  }
});

step(2, async () => {
  const { predictOrder } = await ex();
  const answer = predictOrder();
  expect(answer.slice(0, 2), 'which two lines run before anything that waits?').toEqual(['A', 'D']);
  expect(answer, 'promise callbacks (microtasks) run before timer callbacks, even 0 ms ones').toEqual(['A', 'D', 'C', 'B']);
});

step(3, async () => {
  const { predictAwait } = await ex();
  const answer = predictAwait();
  expect(answer.slice(0, 2), 'A prints first, and calling load() runs its body straight away, up to the first await').toEqual(['A', 'B']);
  expect(answer, 'await pauses only load(): the rest of it waits as a microtask while the plain code carries on').toEqual(['A', 'B', 'D', 'C']);
});

step(4, async () => {
  const { doubleLater } = await ex();
  const result = doubleLater(() => Promise.resolve(21));
  expect(result, 'an async function always returns a promise').toBeInstanceOf(Promise);
  expect(await result, 'await the number before doubling it: a promise times 2 is NaN').toBe(42);
  expect(await doubleLater(() => new Promise((r) => setTimeout(() => r(5), 20)))).toBe(10);
});

step(5, async () => {
  const { addOneWithThen } = await ex();
  const source = addOneWithThen.toString();
  expect(source.startsWith('async') || /\bawait\b/.test(source), 'this step is about .then: no async and no await').toBe(false);
  const result = addOneWithThen(() => Promise.resolve(41));
  expect(result, 'return the promise that .then gives you').toBeInstanceOf(Promise);
  expect(await result).toBe(42);
});

step(6, async () => {
  const { loadOr } = await ex();
  expect(await loadOr(() => Promise.resolve(['t1']), [])).toEqual(['t1']);
  const failing = loadOr(() => Promise.reject(new Error('Server down')), []);
  await expect(failing, 'a rejected promise should give the fallback, not an error. Did you await inside try?').resolves.toEqual([]);
  expect(await loadOr(() => new Promise((_, reject) => setTimeout(() => reject(new Error('late')), 20)), 'fallback')).toBe('fallback');
});

step(7, async () => {
  const { fetchTitle } = await ex();
  const title = fetchTitle(client, 't3');
  expect(title, 'an async function always returns a promise').toBeInstanceOf(Promise);
  expect(await title).toBe('Search ignores Hebrew characters');
});

step(8, async () => {
  const { fetchTicketOrNull } = await ex();
  expect((await fetchTicketOrNull(client, 't2'))?.id).toBe('t2');
  expect(await fetchTicketOrNull(client, 'nope'), '404 should give null').toBeNull();
  const broken = await startFixtureServer({ failOne: true });
  try {
    await expect(fetchTicketOrNull(axios.create({ baseURL: broken.baseURL }), 't1'), 'a 500 is not a 404: throw it').rejects.toThrow();
  } finally {
    await broken.close();
  }
  const offline = axios.create({ baseURL: 'http://127.0.0.1:1/api' });
  await expect(fetchTicketOrNull(offline, 't1'), 'no server at all is not a 404 either: throw it').rejects.toThrow();
});

step(9, async () => {
  const { fetchOneByOne } = await ex();
  const server = await startFixtureServer({ delayMs: 50 });
  try {
    const c = axios.create({ baseURL: server.baseURL });
    const result = await fetchOneByOne(c, ['t5', 't1', 't9']);
    expect(result.map((t) => t.id), 'keep the order of ids').toEqual(['t5', 't1', 't9']);
    expect(server.stats.requests).toHaveLength(3);
    expect(server.stats.maxInFlight, `the server had ${server.stats.maxInFlight} requests at the same time: wait for each answer before sending the next`).toBe(1);
    await expect(fetchOneByOne(c, ['t1', 'nope']), 'if one request fails, fetchOneByOne fails').rejects.toThrow();
  } finally {
    await server.close();
  }
});

step(10, async () => {
  const { fetchMany } = await ex();
  const before = slow.stats.requests.length;
  const start = Date.now();
  const result = await fetchMany(slowClient, ['t5', 't1', 't9']);
  const took = Date.now() - start;
  expect(result.map((t) => t.id), 'keep the order of ids').toEqual(['t5', 't1', 't9']);
  expect(slow.stats.requests.length - before).toBe(3);
  expect(took, `3 requests of 150 ms took ${took} ms: they ran one after another, not at the same time`).toBeLessThan(400);
  await expect(fetchMany(client, ['t1', 'nope']), 'if one request fails, fetchMany fails').rejects.toThrow();
});

step(11, async () => {
  const { fetchSome } = await ex();
  const start = Date.now();
  const result = await fetchSome(slowClient, ['t2', 'nope', 't4', 'missing']);
  expect(result.found.map((t) => t.id)).toEqual(['t2', 't4']);
  expect(result.failed).toEqual(['nope', 'missing']);
  expect(Date.now() - start, 'the requests should run at the same time').toBeLessThan(500);
});

step(12, async () => {
  const { withTimeout } = await ex();
  await expect(withTimeout(new Promise((r) => setTimeout(() => r('fast'), 20)), 200)).resolves.toBe('fast');
  await expect(withTimeout(new Promise((r) => setTimeout(() => r('slow'), 300)), 50)).rejects.toThrow('Timed out');
  await expect(withTimeout(Promise.reject(new Error('own error')), 100)).rejects.toThrow('own error');
});

step(13, async () => {
  const { retry } = await ex();
  let calls = 0;
  const flaky = () => (++calls < 3 ? Promise.reject(new Error(`fail ${calls}`)) : Promise.resolve('ok'));
  await expect(retry(flaky, 3)).resolves.toBe('ok');
  expect(calls).toBe(3);
  calls = 0;
  await expect(retry(flaky, 2), 'reject with the last error').rejects.toThrow('fail 2');
});
