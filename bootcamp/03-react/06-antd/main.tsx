// Playground for this module. Run: yarn dev 03-react/06
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Step } from '../../playground/Step';
import { sampleTickets } from '../tickets';
import { antdMajorVersion, PriorityTag, ThemedApp, TicketForm, TicketTable, type TicketFormValues } from './exercises';

function FormDemo() {
  const [saved, setSaved] = useState<TicketFormValues[]>([]);
  const [editing, setEditing] = useState(sampleTickets[0]);
  const save = (values: TicketFormValues) => setSaved((list) => [...list, values]);
  return (
    <div>
      <h3>New ticket</h3>
      <TicketForm onSave={save} />
      <h3>Edit a ticket</h3>
      <p>
        {sampleTickets.map((t) => (
          <button key={t.id} onClick={() => setEditing(t)}>
            {t.id}
          </button>
        ))}
      </p>
      {/* The key gives each ticket a fresh form: initialValues are only read when the form mounts. */}
      <TicketForm key={editing.id} ticket={editing} onSave={save} />
      <p>onSave got: {saved.map((v) => JSON.stringify(v)).join(', ') || 'nothing yet'}</p>
    </div>
  );
}

function VersionDemo() {
  const projects = { 'old-admin': { antd: '~3.26.20' }, reports: { antd: '^4.24.0' }, 'this bootcamp': { antd: '5.29.3' } };
  return (
    <ul>
      {Object.entries(projects).map(([name, dependencies]) => (
        <li key={name}>
          {name}: antd {antdMajorVersion(dependencies)}
        </li>
      ))}
    </ul>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemedApp>
    <main style={{ fontFamily: 'system-ui', maxWidth: 760, margin: '40px auto' }}>
      <h1>Ant Design playground</h1>
      <Step title="Step 1: PriorityTag">
        <PriorityTag priority="low" /> <PriorityTag priority="medium" /> <PriorityTag priority="high" /> <PriorityTag priority="urgent" />
      </Step>
      <Step title="Steps 2, 3 and 8: TicketTable">
        <TicketTable tickets={sampleTickets} />
      </Step>
      <Step title="Steps 4 and 5: TicketForm">
        <FormDemo />
      </Step>
      <Step title="Step 6: the whole page is inside ThemedApp. Primary buttons and the page numbers turn teal.">
        <p>Look at the Create button above.</p>
      </Step>
      <Step title="Step 7: antdMajorVersion">
        <VersionDemo />
      </Step>
    </main>
  </ThemedApp>,
);
