// Playground for this module. Run: yarn dev 03-react/02
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Step } from '../../playground/Step';
import { sampleTickets, type Ticket } from '../tickets';
import { AssigneePicker, Checklist, DocumentTitle, NumberedTitles, SortedTitles, TagEditor, TicketDetails } from './exercises';

function SortDemo() {
  const [tickets] = useState(() => sampleTickets.map((t) => ({ ...t })));
  return (
    <div>
      <SortedTitles tickets={tickets} />
      <p>The parent&apos;s order (should stay t1, t2, t3...): {tickets.map((t) => t.id).join(', ')}</p>
    </div>
  );
}

function NumberDemo() {
  const [renders, setRenders] = useState(0);
  return (
    <div>
      <NumberedTitles tickets={sampleTickets.slice(0, 3)} />
      <button onClick={() => setRenders(renders + 1)}>Render again ({renders})</button>
    </div>
  );
}

function PickDemo({ children }: { children: (ticket: Ticket | null) => ReactNode }) {
  const [picked, setPicked] = useState<Ticket | null>(null);
  return (
    <div>
      <button onClick={() => setPicked(null)}>None</button>{' '}
      {sampleTickets.slice(0, 3).map((t) => (
        <button key={t.id} onClick={() => setPicked(t)}>
          {t.id}
        </button>
      ))}
      {children(picked)}
    </div>
  );
}

function ChecklistDemo() {
  const [initial] = useState(() => [
    { text: 'Reproduce', done: false },
    { text: 'Fix', done: false },
  ]);
  const [, refresh] = useState(0);
  return (
    <div onClick={() => setTimeout(() => refresh((n) => n + 1))}>
      <Checklist initial={initial} />
      <p>The parent&apos;s copy (should stay all false): {initial.map((i) => `${i.text}: ${i.done}`).join(', ')}</p>
    </div>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <main style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '40px auto' }}>
    <h1>Rules of React playground</h1>
    <Step title="Step 1: TagEditor">
      <TagEditor />
    </Step>
    <Step title="Step 2: AssigneePicker">
      <AssigneePicker initial={sampleTickets[0]} />
    </Step>
    <Step title="Step 3: SortedTitles">
      <SortDemo />
    </Step>
    <Step title="Step 4: NumberedTitles">
      <NumberDemo />
    </Step>
    <Step title="Step 5: TicketDetails (pick None, then t1)">
      <PickDemo>{(t) => <TicketDetails ticket={t} />}</PickDemo>
    </Step>
    <Step title="Step 6: DocumentTitle (watch the browser tab)">
      <PickDemo>{(t) => (t ? <DocumentTitle ticket={t} /> : <p>Pick a ticket</p>)}</PickDemo>
    </Step>
    <Step title="Step 8 (stretch): Checklist">
      <ChecklistDemo />
    </Step>
  </main>,
);
