# 03-react/07 Performance: memo, useMemo, useCallback

**Time:** 25 min lesson, 35 min exercises (core), plus 10 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/07 Performance: memo, useMemo, useCallback**.

## 2. Quick recap

- Most renders are cheap. Things get slow when slow work runs again with the same inputs, when many components render though nothing changed for them, or when work runs on every key press.
- Measure first. Count renders (`console.count`, or `countRender` here), and record the browser's Performance tab while you do the slow thing: long tasks have a red corner, and Bottom-Up shows which functions took the time.
- Do less work first: debounce input (module 04), show fewer rows.
- `useMemo(() => work(a, b), [a, b])` keeps the result until `a` or `b` changes. Depend on values, not on objects made during the render.
- `memo(Component)` skips a render when every prop is the same as last time (`Object.is`).
- `useCallback(fn, deps)` keeps the same function across renders, so a `memo` child sees an unchanged prop.
- Do not memoize cheap work, props of plain DOM elements, or components that always get a new object.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx). [`slow.ts`](slow.ts) and [`renders.ts`](renders.ts) are done for you.

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `TicketSearch`: do not run the slow filter when only "Compact" changes |
| 2 | core | `TicketRow`: skip renders with `memo` |
| 3 | core | `TicketPicker`: one `onSelect` function for every render |
| 4 | core | `worthIt`: when is memoizing worth it? |
| 5 | stretch | `useChangedProps`: a hook that tells you which props changed |

See them in the browser, and try the Performance tab while you tick "Compact":

```
yarn dev 03-react/07
```

Check them:

```
yarn verify 03-react/07
```

The final project has three performance checks (steps 10 to 12). Measure them the same way.
