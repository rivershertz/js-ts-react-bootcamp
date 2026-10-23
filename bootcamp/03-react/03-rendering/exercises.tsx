// 03-react/03 Rendering: snapshots, lifting state, keys, effects
// Check your work with:  yarn verify 03-react/03
// See it in the browser:  yarn dev 03-react/03
import { useEffect, useState, type ReactNode } from 'react';
import { STATUSES, type Status, type Ticket } from '../tickets';

// Step 1 (stretch)
// "+3" should add three votes per click. It adds one. Keep the three setVotes calls.
export function TripleVote() {
  const [votes, setVotes] = useState(0);

  function addThree() {
    setVotes(votes + 1);
    setVotes(votes + 1);
    setVotes(votes + 1);
  }

  return (
    <div>
      <p>Votes: {votes}</p>
      <button onClick={addThree}>+3</button>
    </div>
  );
}

// Step 2 (core)
// Clicking a status tab should filter the list next to it. Right now each component keeps
// its own state, so the list never hears about the click. Lift the selected status up into
// TicketBoard and pass it down:
//   StatusTabs({ selected, onSelect })    shows a button per status; the selected one has aria-pressed={true}
//   StatusTicketList({ tickets, status }) shows only the tickets with that status
export function StatusTabs() {
  const [selected, setSelected] = useState<Status>('open');
  return (
    <div>
      {STATUSES.map((s) => (
        <button key={s} aria-pressed={s === selected} onClick={() => setSelected(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}

export function StatusTicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <ul>
      {tickets.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  );
}

export function TicketBoard({ tickets }: { tickets: Ticket[] }) {
  return (
    <div>
      <StatusTabs />
      <StatusTicketList tickets={tickets} />
    </div>
  );
}

// Step 3 (core)
// Type a note for one ticket, then switch to another: the note should start empty.
// Right now the draft stays. Do not change NoteEditor; change how NotesPanel renders it.
export function NoteEditor({ ticketId }: { ticketId: string }) {
  const [draft, setDraft] = useState('');
  return (
    <label>
      Note for {ticketId} <input value={draft} onChange={(e) => setDraft(e.target.value)} />
    </label>
  );
}

export function NotesPanel({ ticket }: { ticket: Ticket }) {
  return <NoteEditor ticketId={ticket.id} />;
}

// Step 4 (core)
// Shows "Open for 0 s" and counts up once a second. In development it counts two seconds
// per second, and it keeps a timer running after it is gone. Fix the effect.
export function OpenTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);
  return <p>Open for {seconds} s</p>;
}

// Step 5 (core)
// Shows how many tickets are not closed. It renders twice whenever the tickets change,
// and the first of those renders shows the old count. Remove the state and the effect.
export function OpenCount({ tickets }: { tickets: Ticket[] }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(tickets.filter((t) => t.status !== 'closed').length);
  }, [tickets]);
  return <p>{count} open</p>;
}

// Step 6 (stretch)
// A reducer puts every way a ticket's workflow can change in one pure function.
// ticketReducer(state, action) returns the new state:
//   { type: 'assign', assignee }  -> status 'assigned', that assignee, no blockedReason
//   { type: 'block', reason }     -> status 'blocked', keeps the assignee, that blockedReason
//   { type: 'close' }             -> status 'closed', keeps the assignee, no blockedReason
//   { type: 'reopen' }            -> status 'open', nothing else
// Then make TicketWorkflow use it with useReducer: buttons "Assign to me" (assignee 'me'),
// "Block" (reason 'Waiting'), "Close" and "Reopen", and a <p> showing the status.
export type WorkflowState = { status: Status; assignee?: string; blockedReason?: string };
export type WorkflowAction =
  | { type: 'assign'; assignee: string }
  | { type: 'block'; reason: string }
  | { type: 'close' }
  | { type: 'reopen' };

export function ticketReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  throw new Error('TODO: step 6');
}

export function TicketWorkflow({ initial }: { initial: WorkflowState }): ReactNode {
  throw new Error('TODO: step 6');
}
