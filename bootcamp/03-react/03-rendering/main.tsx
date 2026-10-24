// Playground for this module. Run: yarn dev 03-react/03
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Step } from '../../playground/Step';
import { sampleTickets } from '../tickets';
import { NotesPanel, OpenCount, OpenTimer, TicketBoard, TicketWorkflow, TripleVote } from './exercises';

function NotesDemo() {
  const [index, setIndex] = useState(0);
  return (
    <div>
      {sampleTickets.slice(0, 3).map((t, i) => (
        <button key={t.id} onClick={() => setIndex(i)}>
          {t.id}
        </button>
      ))}
      <p>
        <NotesPanel ticket={sampleTickets[index]} />
      </p>
    </div>
  );
}

function TimerDemo() {
  const [shown, setShown] = useState(true);
  return (
    <div>
      <button onClick={() => setShown(!shown)}>{shown ? 'Hide' : 'Show'} the timer</button>
      {shown && <OpenTimer />}
    </div>
  );
}

function CountDemo() {
  const [count, setCount] = useState(sampleTickets.length);
  return (
    <div>
      <button onClick={() => setCount(Math.max(0, count - 1))}>One ticket fewer</button>
      <OpenCount tickets={sampleTickets.slice(0, count)} />
    </div>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <main style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '40px auto' }}>
      <h1>Rendering playground</h1>
      <Step title="Step 1: TripleVote">
        <TripleVote />
      </Step>
      <Step title="Step 2: TicketBoard">
        <TicketBoard tickets={sampleTickets} />
      </Step>
      <Step title="Step 3: NotesPanel (type a note, then switch ticket)">
        <NotesDemo />
      </Step>
      <Step title="Step 4: OpenTimer (this page runs in StrictMode, like a new Vite app)">
        <TimerDemo />
      </Step>
      <Step title="Step 5: OpenCount">
        <CountDemo />
      </Step>
      <Step title="Step 6 (stretch): TicketWorkflow">
        <TicketWorkflow initial={{ status: 'open' }} />
      </Step>
    </main>
  </StrictMode>,
);
