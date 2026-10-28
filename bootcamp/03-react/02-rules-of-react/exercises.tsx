// 03-react/02 Rules of React
//
// What you build: nothing new: six components that each break one rule of React. Find it and fix it.
// Finished when:  `yarn verify 03-react/02` shows ✓ for steps 1 to 7. Stretch steps are optional.
//
// Check your work with:  yarn verify 03-react/02
// See it in the browser:  yarn dev 03-react/02
//
// Every component below runs, and every one breaks a rule of React. Find the broken rule and fix it.
// Keep the names, the props and what each component shows the same.
import { useEffect, useState } from 'react';
import type { Ticket } from '../tickets';

// Step 1 (core): TagEditor
// Type a tag and press Add: the tag should appear in the list. It does not.
//
// Example: type "ui", press Add → "ui" appears in the list at once.
export function TagEditor() {
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  function add() {
    tags.push(draft);
    setTags(tags);
  }

  return (
    <div>
      <label>
        Tag <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <button onClick={add}>Add</button>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}

// Step 2 (core): AssigneePicker
// Click "Assign to Noa": the text should change to "Assigned to a3". It does not.
//
// Example: click "Assign to Noa" → the text reads "Assigned to a3".
export function AssigneePicker({ initial }: { initial: Ticket }) {
  const [ticket, setTicket] = useState(initial);

  function assignTo(id: string) {
    ticket.assignee = id;
    setTicket(ticket);
  }

  return (
    <div>
      <p>{ticket.assignee ? `Assigned to ${ticket.assignee}` : 'Nobody yet'}</p>
      <button onClick={() => assignTo('a3')}>Assign to Noa</button>
    </div>
  );
}

// Step 3 (core): SortedTitles
// Shows the titles A to Z. The parent's list changes order too, which it must not.
//
// Example: tickets ['Login', 'Export'] → shows Export, Login; the parent's array is still ['Login', 'Export'].
export function SortedTitles({ tickets }: { tickets: Ticket[] }) {
  const sorted = tickets.sort((a, b) => a.title.localeCompare(b.title));
  return (
    <ol>
      {sorted.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ol>
  );
}

// Step 4 (core): NumberedTitles
// Should show "1. Login page", "2. Export"... The numbers are wrong, and grow every time it renders.
//
// Example: three tickets show 1., 2., 3., and still 1., 2., 3. after any number of renders.
let rowNumber = 0;

export function NumberedTitles({ tickets }: { tickets: Ticket[] }) {
  return (
    <ul>
      {tickets.map((t) => {
        rowNumber++;
        return <li key={t.id}>{`${rowNumber}. ${t.title}`}</li>;
      })}
    </ul>
  );
}

// Step 5 (core): TicketDetails
// Works while a ticket is picked, and while none is. Crashes when you go from a ticket back to none.
//
// Example: pick t1, then none, then t2, then none → no crash at any point.
export function TicketDetails({ ticket }: { ticket: Ticket | null }) {
  const [expanded, setExpanded] = useState(false);
  if (!ticket) {
    return <p>Pick a ticket</p>;
  }
  const [note, setNote] = useState('');
  return (
    <div>
      <h3>{ticket.title}</h3>
      <button onClick={() => setExpanded(!expanded)}>{expanded ? 'Less' : 'More'}</button>
      {expanded && <p>Priority: {ticket.priority}</p>}
      <label>
        Note <input value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
    </div>
  );
}

// Step 6 (core): DocumentTitle
// Sets the browser tab's title to the ticket's title. Pick another ticket: the tab keeps the old one.
//
// Example: show t1, then t2 → the tab title is t2's title.
export function DocumentTitle({ ticket }: { ticket: Ticket }) {
  useEffect(() => {
    document.title = ticket.title;
  }, []);
  return <p>Viewing {ticket.id}</p>;
}

// Step 7 (core): ESLint
// Run ESLint on this file:  yarn eslint 03-react/02-rules-of-react
// Once steps 5 and 6 are fixed, it should report nothing. Never silence a rule with a comment.
//
// Example: the command prints no problems.

// Step 8 (stretch): Checklist
// Ticking an item works on screen, but it also changes the `initial` items the parent passed in.
// (The playground shows the parent's copy under the list.) Copying the array is not enough.
//
// Example: tick the first item → it is ticked on screen; the parent's copy still shows it unticked.
type Item = { text: string; done: boolean };

export function Checklist({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);

  function toggle(index: number) {
    const next = [...items];
    next[index].done = !next[index].done;
    setItems(next);
  }

  return (
    <ul>
      {items.map((item, i) => (
        <li key={item.text}>
          <label>
            <input type="checkbox" checked={item.done} onChange={() => toggle(i)} /> {item.text}
          </label>
        </li>
      ))}
    </ul>
  );
}
