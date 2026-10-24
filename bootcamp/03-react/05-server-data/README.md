# 03-react/05 Server data with React Query

**Time:** 15 min lesson, 25 min exercises (core), plus 10 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/05 Server data with React Query**.

## 2. Quick recap

- Data from the server goes in the React Query cache, not in `useState`. The app gets one `QueryClient`, given once by `<QueryClientProvider>` in `main.tsx`.
- `useQuery({ queryKey, queryFn })`: the key names the data in the cache, the function returns a Promise of it. Components that use the same key share one request and one copy.
- Wrap each query in a custom hook (`useTickets`, `useTicket`), so the key is written once.
- Handle the states in order: `isPending` (no data yet), then `isError` (with a Retry button that calls `refetch()`), then the data. A failed query retries 3 times before `isError` is true.
- The key holds every value the query uses: `['tickets', id]`. `enabled: id !== undefined` holds a query until its input is ready.
- `useMutation({ mutationFn, onSuccess })` changes data on the server. In `onSuccess`, `queryClient.invalidateQueries({ queryKey: ['tickets'] })` marks the data stale, so what is on screen loads again. It covers every key that starts with `['tickets']`.
- The browser's Network tab shows every request: use it to see what your queries do.

## 3. Exercises

Start the API in a second terminal first:

```
python server/server.py
```

Open [`exercises.tsx`](exercises.tsx). The axios client is in [`client.ts`](client.ts), done for you. (It is not called `api.ts`: the dev server sends every path that starts with `/api` to Python, and that would include `/api.ts`.)

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `useTickets`: replace a hand-written `useEffect` fetch with `useQuery` |
| 2 | core | `TicketsView`: loading and error states, with Retry |
| 3 | core | `useTicket`: do not ask for `/tickets/undefined` |
| 4 | core | `useCloseTicket`: the list should show the new status after a save |
| 5 | stretch | `useTicket`: start from the ticket already in the list cache |

See them in the browser, with DevTools open on the Network tab:

```
yarn dev 03-react/05
```

Restart the server with `--delay 1500` to see the loading state, and with `--fail tickets` to see the error state. Step 4 closes real tickets on the server; restart it to reopen them.

Check them:

```
yarn verify 03-react/05
```

The final project's `api/tickets.js` has the same hooks. You will migrate it to TypeScript.
