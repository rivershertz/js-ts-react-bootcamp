// 03-react/01 React fundamentals in TypeScript: solution
import { useState, type FormEvent } from 'react';
import type { Priority, Ticket } from '../tickets';

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span>{priority.toUpperCase()}</span>;
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <article>
      <h3>{ticket.title}</h3>
      <PriorityBadge priority={ticket.priority} />
      {ticket.dueDate ? <p>Due {ticket.dueDate}</p> : <p>No due date</p>}
    </article>
  );
}

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) return <p>No tickets</p>;
  return (
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketCard ticket={ticket} />
        </li>
      ))}
    </ul>
  );
}

export function EstimateCounter() {
  const [hours, setHours] = useState(0);
  return (
    <div>
      <p>Estimate: {hours} h</p>
      <button onClick={() => setHours((h) => Math.max(0, h - 1))}>-</button>
      <button onClick={() => setHours((h) => h + 1)}>+</button>
    </div>
  );
}

export function NewTicketForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim() === '') return;
    onAdd(title.trim());
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <button type="submit" disabled={title.trim() === ''}>
        Add
      </button>
    </form>
  );
}

export function SearchableTicketList({ tickets }: { tickets: Ticket[] }) {
  const [search, setSearch] = useState('');
  const text = search.trim().toLowerCase();
  const shown = tickets.filter((t) => t.title.toLowerCase().includes(text));
  return (
    <div>
      <label>
        Search <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>
      <TicketList tickets={shown} />
    </div>
  );
}
