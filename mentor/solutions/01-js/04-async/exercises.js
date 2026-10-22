// 01-js/04 Async: worked solutions

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function predictOrder() {
  // Synchronous code first, then microtasks (promises), then tasks (timers).
  return ['A', 'D', 'C', 'B'];
}

export async function fetchTitle(client, id) {
  const response = await client.get(`/tickets/${id}`);
  return response.data.title;
}

export async function fetchTicketOrNull(client, id) {
  try {
    const response = await client.get(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

export async function fetchMany(client, ids) {
  const responses = await Promise.all(ids.map((id) => client.get(`/tickets/${id}`)));
  return responses.map((r) => r.data);
}

export async function fetchSome(client, ids) {
  const results = await Promise.allSettled(ids.map((id) => client.get(`/tickets/${id}`)));
  return {
    found: results.filter((r) => r.status === 'fulfilled').map((r) => r.value.data),
    failed: ids.filter((_, i) => results[i].status === 'rejected'),
  };
}

export function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function retry(fn, times) {
  let lastError;
  for (let attempt = 0; attempt < times; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
