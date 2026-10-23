// 03-react/08 Routing with React Router
// Check your work with:   yarn verify 03-react/08
// See it in the browser:  yarn dev 03-react/08
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { sampleTickets, STATUSES, type Status, type Ticket } from '../tickets';

// Done for you: the tickets, and a pretend server call that creates one.
const tickets: Ticket[] = [...sampleTickets];

export async function createTicket(title: string): Promise<string> {
  const id = `t${tickets.length + 1}`;
  tickets.push({ id, title, status: 'open', priority: 'medium', dueDate: null, createdAt: new Date().toISOString() });
  return id;
}

export function isStatus(value: unknown): value is Status {
  return STATUSES.some((status) => status === value);
}

// Step 1 (core)
export function AppRoutes(): ReactNode {
  return (
    <Routes>
      <Route path="/tickets" element={<TicketListPage />} />
      <Route path="/tickets/new" element={<NewTicketPage onCreate={createTicket} />} />
      <Route path="/tickets/:id" element={<TicketPage />} />
      <Route path="*" element={<Navigate to="/tickets" replace />} />
    </Routes>
  );
}

// Step 2 (core)
export function TicketListPage(): ReactNode {
  const [status, setStatus] = useStatusFilter();
  const shown = status ? tickets.filter((t) => t.status === status) : tickets;
  return (
    <div>
      <h2>Tickets</h2>
      <label>
        Status{' '}
        <select value={status ?? ''} onChange={(e) => setStatus(isStatus(e.target.value) ? e.target.value : undefined)}>
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <ul>
        {shown.map((ticket) => (
          <li key={ticket.id}>
            <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/tickets/new">New ticket</Link>
    </div>
  );
}

// Step 3 (core)
export function TicketPage(): ReactNode {
  const { id } = useParams();
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return <p>No ticket {id}</p>;
  return (
    <article>
      <h2>{ticket.title}</h2>
      <p>Status: {ticket.status}</p>
      <BackButton />
    </article>
  );
}

// Step 4 (core)
export function useStatusFilter(): [Status | undefined, (status: Status | undefined) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get('status');
  const status = isStatus(value) ? value : undefined;

  function setStatus(next: Status | undefined) {
    setSearchParams((params) => {
      if (next === undefined) params.delete('status');
      else params.set('status', next);
      return params;
    });
  }

  return [status, setStatus];
}

// Step 5 (stretch)
export function NewTicketPage({ onCreate }: { onCreate: (title: string) => Promise<string> }): ReactNode {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = await onCreate(title.trim());
    navigate(`/tickets/${id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>New ticket</h2>
      <label>
        Title <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <button type="submit" disabled={!title.trim()}>
        Create
      </button>
    </form>
  );
}

// Step 6 (stretch)
export function BackButton(): ReactNode {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Back</button>;
}
