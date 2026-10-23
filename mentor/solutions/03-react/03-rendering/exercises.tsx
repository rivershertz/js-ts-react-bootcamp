// 03-react/03 Rendering: solution
import { useEffect, useReducer, useState } from 'react';
import { STATUSES, type Status, type Ticket } from '../tickets';

// State is a snapshot: `votes` is the same in all three calls. An updater gets the latest value.
export function TripleVote() {
  const [votes, setVotes] = useState(0);

  function addThree() {
    setVotes((v) => v + 1);
    setVotes((v) => v + 1);
    setVotes((v) => v + 1);
  }

  return (
    <div>
      <p>Votes: {votes}</p>
      <button onClick={addThree}>+3</button>
    </div>
  );
}

// The state lives in the closest common parent; children get it through props.
export function StatusTabs({ selected, onSelect }: { selected: Status; onSelect: (status: Status) => void }) {
  return (
    <div>
      {STATUSES.map((s) => (
        <button key={s} aria-pressed={s === selected} onClick={() => onSelect(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}

export function StatusTicketList({ tickets, status }: { tickets: Ticket[]; status: Status }) {
  return (
    <ul>
      {tickets
        .filter((t) => t.status === status)
        .map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
    </ul>
  );
}

export function TicketBoard({ tickets }: { tickets: Ticket[] }) {
  const [status, setStatus] = useState<Status>('open');
  return (
    <div>
      <StatusTabs selected={status} onSelect={setStatus} />
      <StatusTicketList tickets={tickets} status={status} />
    </div>
  );
}

export function NoteEditor({ ticketId }: { ticketId: string }) {
  const [draft, setDraft] = useState('');
  return (
    <label>
      Note for {ticketId} <input value={draft} onChange={(e) => setDraft(e.target.value)} />
    </label>
  );
}

// A different key is a different component to React: its state starts fresh.
export function NotesPanel({ ticket }: { ticket: Ticket }) {
  return <NoteEditor key={ticket.id} ticketId={ticket.id} />;
}

// The cleanup undoes what the effect did. React runs it before the next run and on unmount.
export function OpenTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return <p>Open for {seconds} s</p>;
}

// Derived from props during render: no state to keep in sync, no extra render.
export function OpenCount({ tickets }: { tickets: Ticket[] }) {
  const count = tickets.filter((t) => t.status !== 'closed').length;
  return <p>{count} open</p>;
}

export type WorkflowState = { status: Status; assignee?: string; blockedReason?: string };
export type WorkflowAction =
  | { type: 'assign'; assignee: string }
  | { type: 'block'; reason: string }
  | { type: 'close' }
  | { type: 'reopen' };

export function ticketReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'assign':
      return { status: 'assigned', assignee: action.assignee };
    case 'block':
      return { status: 'blocked', assignee: state.assignee, blockedReason: action.reason };
    case 'close':
      return { status: 'closed', assignee: state.assignee };
    case 'reopen':
      return { status: 'open' };
  }
}

export function TicketWorkflow({ initial }: { initial: WorkflowState }) {
  const [state, dispatch] = useReducer(ticketReducer, initial);
  return (
    <div>
      <p>{state.status}</p>
      <button onClick={() => dispatch({ type: 'assign', assignee: 'me' })}>Assign to me</button>
      <button onClick={() => dispatch({ type: 'block', reason: 'Waiting' })}>Block</button>
      <button onClick={() => dispatch({ type: 'close' })}>Close</button>
      <button onClick={() => dispatch({ type: 'reopen' })}>Reopen</button>
    </div>
  );
}
