# 03-react/09 Versions and tooling: React 16 / 18 / 19, CRA and Vite

**Time:** 10 min lesson, 30 min exercises (core), plus 5 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/09 Versions and tooling**.

## 2. Quick recap

- `package.json` tells you the React version: the first number of `"react"`. The entry file tells you how the app starts.
- React 16 and 17: `ReactDOM.render(<App />, el)`. React 18 and 19: `createRoot(el).render(<App />)`. On 18, the old call still works but runs the app like React 17, with a warning. React 19 removed it.
- React 18 batches every state update into one render, also after `await` and in timeouts. React 17 batched only inside its own event handlers.
- React 19 removed `defaultProps` on function components and `propTypes` checks. `forwardRef` still works, and `ref` can now be a normal prop.
- Create React App and Vite differ in a few places:

  | | Create React App | Vite |
  | --- | --- | --- |
  | Scripts | `react-scripts start` / `build` | `vite` / `vite build` |
  | `index.html` | `public/index.html` | at the root |
  | Env variables | `process.env.REACT_APP_X` | `import.meta.env.VITE_X` |
  | API proxy | `"proxy"` in `package.json` (or `src/setupProxy.js`) | `server.proxy` in `vite.config.ts` |
  | `yarn build` writes | `build/` | `dist/` |

- A build is static files. Env variables are copied in at build time, and anyone can read them: no secrets in the front end.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx). Most steps are questions; step 1 is code.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `mount`: start an app with `createRoot` |
| 2 | core | How many renders? Batching in React 17 and 18 |
| 3 | core | `envAccess`: read an env variable in CRA and Vite |
| 4 | core | Where things are: build folder, proxy, env |
| 5 | core | What breaks in React 19? |
| 6 | stretch | `buildTool`: CRA or Vite, from a `package.json` |

See them in the browser. The page itself is started by your `mount`, so watch the console:

```
yarn dev 03-react/09
```

Check them:

```
yarn verify 03-react/09
```

That is the last module. Next: the [final project](../../final-project/README.md).
