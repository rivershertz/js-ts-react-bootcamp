// 03-react/03 Rendering: snapshots, lifting state, keys, effects
//
// What you build: seven small fixes to when and what React renders, plus a reducer as stretch.
// Steps 1 and 2 are the same idea (state is a snapshot), and so are steps 5 and 6 (clean up an effect),
// so the second of each pair is practice in a new setting.
// Finished when:  `yarn verify 03-react/03` shows ✓ for steps 1 to 7. Stretch steps are optional.
//
// Check your work with:  yarn verify 03-react/03
// See it in the browser:  yarn dev 03-react/03
import { useEffect, useState, type ReactNode } from 'react';
import { STATUSES, type Status, type Ticket } from '../tickets';

// Step 1 (core): TripleVote
// "+3" should add three votes per click. It adds one. Keep the three setVotes calls.
//
// Example: from 0, click "+3" → 3; click again → 6.
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

// Step 2 (core): DelayedLike
// "Like" saves after one second (pretend it waits for the server). Three quick clicks should
// give 3 likes once the saves are done. They give 1. Keep the setTimeout.
//
// Example: from 0, click "Like" three times quickly → one second later it shows "Likes: 3".
export function DelayedLike() {
  const [likes, setLikes] = useState(0);

  function like() {
    setTimeout(() => setLikes(likes + 1), 1000);
  }

  return (
    <div>
      <p>Likes: {likes}</p>
      <button onClick={like}>Like</button>
    </div>
  );
}

// Step 3 (core): lift the state up
// Clicking a status tab should filter the list next to it. Right now each component keeps
// its own state, so the list never hears about the click. Lift the selected status up into
// TicketBoard and pass it down:
//   StatusTabs({ selected, onSelect })    shows a button per status; the selected one has aria-pressed={true}
//   StatusTicketList({ tickets, status }) shows only the tickets with that status
//
// Example: click "blocked" → that button has aria-pressed="true" and the list shows only blocked tickets.
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

// Step 4 (core): reset with a key
// Type a note for one ticket, then switch to another: the note should start empty.
// Right now the draft stays. Do not change NoteEditor; change how NotesPanel renders it.
//
// Example: on t1 type "call Dana", switch to t2 → the note is empty.
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

// Step 5 (core): clean up the timer
// Shows "Open for 0 s" and counts up once a second. In development it counts two seconds
// per second, and it keeps a timer running after it is gone. Fix the effect.
//
// Example: after 3 seconds it shows "Open for 3 s"; once removed, no timer is left running.
export function OpenTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);
  return <p>Open for {seconds} s</p>;
}

// Step 6 (core): EscapeToClose
// Pressing Escape should call onClose once. In development it calls it twice, and after the
// component is gone, Escape still calls it. Fix the effect.
//
// Example: press Escape → onClose is called once; remove the component, press Escape → nothing happens.
export function EscapeToClose({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
  }, [onClose]);
  return <p>Press Escape to close</p>;
}

// Step 7 (core): no effect needed
// Shows how many tickets are not closed. It renders twice whenever the tickets change,
// and the first of those renders shows the old count. Remove the state and the effect.
//
// Example: tickets change from 2 open to 3 open → the very next render shows 3.
export function OpenCount({ tickets }: { tickets: Ticket[] }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(tickets.filter((t) => t.status !== 'closed').length);
  }, [tickets]);
  return <p>{count} open</p>;
}

// Step 8 (stretch): useReducer
// A reducer puts every way a ticket's workflow can change in one pure function.
// ticketReducer(state, action) returns the new state:
//   { type: 'assign', assignee }  -> status 'assigned', that assignee, no blockedReason
//   { type: 'block', reason }     -> status 'blocked', keeps the assignee, that blockedReason
//   { type: 'close' }             -> status 'closed', keeps the assignee, no blockedReason
//   { type: 'reopen' }            -> status 'open', nothing else
// Then make TicketWorkflow use it with useReducer: buttons "Assign to me" (assignee 'me'),
// "Block" (reason 'Waiting'), "Close" and "Reopen", and a <p> showing the status.
//
// Example:
//   ticketReducer({ status: 'assigned', assignee: 'a1' }, { type: 'block', reason: 'Waiting' })
//   // { status: 'blocked', assignee: 'a1', blockedReason: 'Waiting' }
export type WorkflowState = { status: Status; assignee?: string; blockedReason?: string };
export type WorkflowAction =
  | { type: 'assign'; assignee: string }
  | { type: 'block'; reason: string }
  | { type: 'close' }
  | { type: 'reopen' };

export function ticketReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  throw new Error('TODO: step 8');
}

export function TicketWorkflow({ initial }: { initial: WorkflowState }): ReactNode {
  throw new Error('TODO: step 8');
}
