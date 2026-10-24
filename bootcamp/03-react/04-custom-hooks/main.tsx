// Playground for this module. Run: yarn dev 03-react/04
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Step } from '../../playground/Step';
import { SearchBox, useDebouncedValue, useToggle } from './exercises';

function ToggleDemo() {
  const [on, toggle] = useToggle(false);
  return <button onClick={toggle}>The lamp is {on ? 'on' : 'off'}</button>;
}

function DebounceDemo() {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, 500);
  return (
    <div>
      <input placeholder="Type quickly" value={text} onChange={(e) => setText(e.target.value)} />
      <p>Now: {text}</p>
      <p>After 500 ms of quiet: {debounced}</p>
    </div>
  );
}

function SearchDemo() {
  const [log, setLog] = useState<string[]>([]);
  // useCallback keeps the same function across renders (module 07 explains why that matters here).
  const onSearch = useCallback((t: string) => setLog((l) => [...l, t]), []);
  return (
    <div>
      <SearchBox onSearch={onSearch} />
      <p>onSearch was called {log.length} times: {log.map((t) => JSON.stringify(t)).join(', ')}</p>
    </div>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto' }}>
    <h1>Custom hooks playground</h1>
    <Step title="Step 1: useToggle"><ToggleDemo /></Step>
    <Step title="Step 2: useDebouncedValue"><DebounceDemo /></Step>
    <Step title="Step 3: SearchBox"><SearchDemo /></Step>
  </main>,
);
