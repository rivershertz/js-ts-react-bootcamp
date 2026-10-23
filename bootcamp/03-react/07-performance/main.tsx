// Playground for this module. Run: yarn dev 03-react/07
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Step } from '../../playground/Step';
import { sampleTickets } from '../tickets';
import { TicketPicker, TicketSearch, useChangedProps } from './exercises';
import { renderCount } from './renders';

// Reads the counter from outside the picker, so it does not cause renders in it.
function RowCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(renderCount('TicketRow')), 250);
    return () => clearInterval(id);
  }, []);
  return <p>TicketRow has rendered {count} times so far. Click a ticket: how many more?</p>;
}

function ChangedPropsDemo() {
  const [count, setCount] = useState(0);
  const changed = useChangedProps({ label: 'Votes', onClick: () => setCount((c) => c + 1) });
  return (
    <p>
      <button onClick={() => setCount((c) => c + 1)}>Votes: {count}</button> Changed since the last render:{' '}
      {changed.join(', ') || 'nothing'}
    </p>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto' }}>
    <h1>Performance playground</h1>
    <p>Each filter call takes 60 ms on purpose. Record a Performance profile while you tick Compact to see where time goes.</p>
    <Step title="Step 1: TicketSearch (tick Compact: does it feel slow?)">
      <TicketSearch tickets={sampleTickets} />
    </Step>
    <Step title="Steps 2 and 3: TicketPicker">
      <RowCounter />
      <TicketPicker tickets={sampleTickets} />
    </Step>
    <Step title="Step 5 (stretch): useChangedProps">
      <ChangedPropsDemo />
    </Step>
  </main>,
);
