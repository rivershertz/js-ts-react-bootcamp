// 03-react/08 Routing with React Router
//
// What you build: the routes of a small ticket app: list, ticket page, new ticket form, filter in the URL.
// Finished when:  `yarn verify 03-react/08` shows ✓ for steps 1 to 5. Stretch steps are optional.
//
// Check your work with:   yarn verify 03-react/08
// See it in the browser:  yarn dev 03-react/08
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
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

// Step 1 (core): the routes
// AppRoutes decides which page each URL shows:
// - /tickets       <TicketListPage />
// - /tickets/new   <NewTicketPage onCreate={createTicket} />
// - /tickets/:id   <TicketPage />
// - anything else  sends the user to /tickets (use <Navigate>)
// Only the list has a route so far.
//
// Example: /tickets/new → the form;  /tickets/t3 → ticket t3;  /nope → ends up on /tickets.
export function AppRoutes(): ReactNode {
  return (
    <Routes>
      <Route path="/tickets" element={<TicketListPage />} />
    </Routes>
  );
}

// Step 2 (core): Link
// Each title should open its ticket's page, and "New ticket" the form. A plain <a href> asks the
// server for a whole new page: the app starts again from nothing. Use React Router's <Link> instead.
//
// Example: click "Login page" → the URL is /tickets/t1, and the page did not reload.
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
            <a href={`/tickets/${ticket.id}`}>{ticket.title}</a>
          </li>
        ))}
      </ul>
      <a href="/tickets/new">New ticket</a>
    </div>
  );
}

// Step 3 (core): read the id
// TicketPage should show the ticket whose id is in the URL (/tickets/t3 shows t3).
// It always shows t1. Read the :id parameter from the route. For an unknown id, show "No ticket <id>".
//
// Example: /tickets/t3 → ticket t3;  /tickets/t99 → "No ticket t99".
export function TicketPage(): ReactNode {
  const id = 't1';
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

// Step 4 (core): filter in the URL
// The list's status filter lives in useState, so a refresh or a shared link loses it.
// Keep it in the URL instead, as ?status=open, with useSearchParams. Ignore a value that is
// not a status (?status=banana gives undefined), and remove the parameter for undefined.
//
// Example:
//   pick "open"              → the URL is /tickets?status=open, and a refresh keeps the filter
//   open /tickets?status=banana → no filter
//   pick "all" (undefined)   → the URL is /tickets
export function useStatusFilter(): [Status | undefined, (status: Status | undefined) => void] {
  return useState<Status>();
}

// Step 5 (core): go to the new ticket
// After a successful create, the user should land on the new ticket's page.
// Right now the form only says "Saved". Use useNavigate.
//
// Example: create "Export", onCreate resolves to 't13' → the URL is /tickets/t13.
export function NewTicketPage({ onCreate }: { onCreate: (title: string) => Promise<string> }): ReactNode {
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onCreate(title.trim());
    setSaved(true);
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
      {saved && <p>Saved</p>}
    </form>
  );
}

// Step 6 (stretch): back one step
// Back goes to /tickets, which drops the list's ?status filter. Make it go back one step
// in the history instead, like the browser's back button.
//
// Example: /tickets?status=open → open t3 → click Back → /tickets?status=open.
export function BackButton(): ReactNode {
  return <Link to="/tickets">Back</Link>;
}
