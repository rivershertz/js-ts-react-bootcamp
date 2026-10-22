// 03-react/02 Rules of React: solution
import { useEffect, useState } from 'react';
import type { Ticket } from '../tickets';

// Never mutate state: give React a new array.
export function TagEditor() {
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  function add() {
    setTags([...tags, draft]);
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

// Never mutate state: give React a new object.
export function AssigneePicker({ initial }: { initial: Ticket }) {
  const [ticket, setTicket] = useState(initial);

  function assignTo(id: string) {
    setTicket({ ...ticket, assignee: id });
  }

  return (
    <div>
      <p>{ticket.assignee ? `Assigned to ${ticket.assignee}` : 'Nobody yet'}</p>
      <button onClick={() => assignTo('a3')}>Assign to Noa</button>
    </div>
  );
}

// Props are read-only: sort a copy.
export function SortedTitles({ tickets }: { tickets: Ticket[] }) {
  const sorted = tickets.toSorted((a, b) => a.title.localeCompare(b.title));
  return (
    <ol>
      {sorted.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ol>
  );
}

// Rendering is pure: same props, same output, no outside variable changed.
export function NumberedTitles({ tickets }: { tickets: Ticket[] }) {
  return (
    <ul>
      {tickets.map((t, i) => (
        <li key={t.id}>{`${i + 1}. ${t.title}`}</li>
      ))}
    </ul>
  );
}

// Hooks at the top level, before any early return.
export function TicketDetails({ ticket }: { ticket: Ticket | null }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  if (!ticket) {
    return <p>Pick a ticket</p>;
  }
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

// Every value the effect reads is a dependency.
export function DocumentTitle({ ticket }: { ticket: Ticket }) {
  useEffect(() => {
    document.title = ticket.title;
  }, [ticket.title]);
  return <p>Viewing {ticket.id}</p>;
}

type Item = { text: string; done: boolean };

// A new array and a new object for the item that changed; the others are shared, untouched.
export function Checklist({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);

  function toggle(index: number) {
    setItems(items.map((item, i) => (i === index ? { ...item, done: !item.done } : item)));
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
