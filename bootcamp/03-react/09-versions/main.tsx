// Playground for this module. Run: yarn dev 03-react/09
// This page is started by your mount() from step 1. Open the console: until step 1 is done,
// React warns that ReactDOM.render is no longer supported.
import { useState } from 'react';
import { Step } from '../../playground/Step';
import { buildTool, envAccess, mount } from './exercises';

// Two setters inside a setTimeout: one render on React 18 with createRoot, two in "React 17 mode".
function BatchingDemo() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [renders] = useState(() => ({ count: 0 }));
  renders.count++; // measuring only, like console.count (module 07)
  function save() {
    setTimeout(() => {
      setSaving((s) => !s);
      setMessage(`saved at ${new Date().toLocaleTimeString()}`);
    }, 100);
  }
  return (
    <p>
      <button onClick={save}>Save later</button> {saving ? 'saving' : 'idle'} {message} (rendered {renders.count} times)
    </p>
  );
}

function ToolDemo() {
  return (
    <ul>
      <li>{envAccess('vite', 'API_URL')}</li>
      <li>{envAccess('cra', 'API_URL')}</li>
      <li>react-scripts start: {buildTool({ scripts: { start: 'react-scripts start' } })}</li>
      <li>vite: {buildTool({ scripts: { dev: 'vite' } })}</li>
    </ul>
  );
}

mount(
  document.getElementById('root') as HTMLElement,
  <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto' }}>
    <h1>Versions and tooling playground</h1>
    <Step title="Steps 1 and 2: click Save later. Each click should add 1 render, not 2.">
      <BatchingDemo />
    </Step>
    <Step title="Steps 3 and 6">
      <ToolDemo />
    </Step>
  </main>,
);
