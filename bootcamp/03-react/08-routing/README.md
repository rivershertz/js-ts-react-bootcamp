# 03-react/08 Routing with React Router

**Time:** 10 min lesson, 25 min exercises (core), plus 15 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/08 Routing with React Router**.

## 2. Quick recap

- The server sends one HTML page. React Router keeps the URL in step with what is on screen, so the user can bookmark, share, refresh and go back.
- `<BrowserRouter>` wraps the app once, in `main.tsx`. `<Routes>` holds one `<Route path element>` per page. The most specific pattern wins, so `/tickets/new` beats `/tickets/:id`. `path="*"` catches the rest; send it on with `<Navigate to="/tickets" replace />`.
- `<Link to>` changes the URL without reloading. A plain `<a href>` restarts the app and loses everything in memory, including the React Query cache.
- `useParams()` reads `:id`. Going from `/tickets/t1` to `/tickets/t2` keeps the same page mounted, with its state.
- `useSearchParams()` keeps state in the URL (`?status=blocked`), for anything worth refreshing or sharing. The values are strings: check them with a type guard.
- `useNavigate()` goes somewhere from code, such as after a save. `navigate(-1)` goes back.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx).

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `AppRoutes`: a route for each page, and a catch-all |
| 2 | core | `TicketListPage`: `<Link>` instead of `<a href>` |
| 3 | core | `TicketPage`: read `:id` from the URL |
| 4 | core | `useStatusFilter`: keep the status filter in `?status=` |
| 5 | stretch | `NewTicketPage`: go to the new ticket after saving |
| 6 | stretch | `BackButton`: back in the history, keeping the filter |

See the app in the browser, then try refresh and the back button:

```
yarn dev 03-react/08
```

Check them:

```
yarn verify 03-react/08
```

The final project's new feature, the assignee filter, is step 4 again.
