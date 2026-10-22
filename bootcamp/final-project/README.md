# Final project (POC slice)

> POC note: the full final project has a list page and a create / edit form, 6 Rules of React bugs and 3 performance problems. This slice has one of each kind, so you can see how the work and the checks feel.

## Definition of Done

In the browser, the user can:

- [ ] Open the ticket list and see an antd Table of tickets from the Python API, with an error message and a Retry button if the server is down.
- [ ] Sort by Newest or Priority without the list getting scrambled.
- [ ] Type in the search box without the table rebuilding on every key press (debounced).
- [ ] Filter by assignee, and keep that filter in the URL: refreshing the page or sharing the link keeps the same filter. *(new feature)*

Technical:

- [ ] Every file in `src` is `.ts` or `.tsx`; `tsc` passes with `strict: true` and no `any`.
- [ ] ESLint passes with the React Hooks rules turned on, with no disabled rules.
- [ ] The planted Rules of React bug is fixed (it has its own check).
- [ ] The planted performance problem is fixed (it has its own check).
- [ ] The debounced search uses your `useDebouncedValue` hook, in `src/hooks/useDebouncedValue.ts`.
- [ ] `yarn verify final-project` passes.

## Run it

Terminal 1:

```
python server/server.py
```

Terminal 2:

```
yarn dev final-project
```

Then check your work with `yarn verify final-project`. Each check names what is still wrong.
