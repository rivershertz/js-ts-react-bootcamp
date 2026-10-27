// 03-react/01 React fundamentals in TypeScript
//
// What you build: the pieces of a ticket list: a badge, a card, a list, a counter and a small form.
// Finished when:  `yarn verify 03-react/01` shows ✓ for steps 1 to 5. Stretch steps are optional.
//
// Check your work with:  yarn verify 03-react/01
// See it in the browser:  yarn dev 03-react/01
import type { ReactNode } from 'react';
import type { Ticket } from '../tickets';

// Step 1 (core): PriorityBadge
// PriorityBadge shows the priority in capitals inside a <span>.
// Its prop is typed as any string, so <PriorityBadge priority="critical" /> compiles.
// Type it as Priority instead (import the type from '../tickets'), and destructure it.
//
// Example:
//   <PriorityBadge priority="high" />       shows  <span>HIGH</span>
//   <PriorityBadge priority="critical" />   is a compile error
export function PriorityBadge(props: { priority: string }): ReactNode {
  throw new Error('TODO: step 1');
}

// Step 2 (core): TicketCard
// TicketCard shows one ticket as an <article>: its title, its badge, and its due date.
//
// Example:
//   <TicketCard ticket={{ ...t1, title: 'Login', priority: 'high', dueDate: '2026-10-01' }} />  shows
//     <article>
//       <h3>Login</h3>
//       <span>HIGH</span>
//       <p>Due 2026-10-01</p>
//     </article>
//   With dueDate: null, the last line is <p>No due date</p>.
export function TicketCard({ ticket }: { ticket: Ticket }): ReactNode {
  throw new Error('TODO: step 2');
}

// Step 3 (core): TicketList
// TicketList shows a <ul> with one <li> per ticket, containing a TicketCard.
// Give every <li> a key that stays the same for the same ticket.
// With no tickets, show <p>No tickets</p> instead of the list.
//
// Example:
//   <TicketList tickets={[t1, t2]} />   shows  <ul><li><article>t1…</article></li><li><article>t2…</article></li></ul>
//   <TicketList tickets={[]} />         shows  <p>No tickets</p>
export function TicketList({ tickets }: { tickets: Ticket[] }): ReactNode {
  throw new Error('TODO: step 3');
}

// Step 4 (core): EstimateCounter
// EstimateCounter shows <p>Estimate: 0 h</p> and two buttons, "-" and "+".
// "+" adds one hour, "-" removes one, but never below 0. Import useState from 'react'.
//
// Example:
//   click "+" twice   → <p>Estimate: 2 h</p>
//   then "-" three times → <p>Estimate: 0 h</p>
export function EstimateCounter() {
  return (
    <div>
      <p>Estimate: 0 h</p>
      <button>-</button>
      <button>+</button>
    </div>
  );
}

// Step 5 (core): NewTicketForm
// NewTicketForm is a <form> with a controlled input labelled "Title" and an "Add" button.
// Label it by wrapping it: <label>Title <input ... /></label>, as in the other steps.
// - The button is disabled while the title is empty or only spaces.
// - Submitting (the button or Enter) calls onAdd with the trimmed title, then clears the input.
// - The page must not reload: call event.preventDefault() in the submit handler.
//
// Example:
//   empty input, or "   "        → the Add button is disabled
//   type "  Export  ", press Enter → onAdd('Export') is called once, and the input is empty again
export function NewTicketForm({ onAdd }: { onAdd: (title: string) => void }): ReactNode {
  throw new Error('TODO: step 5');
}

// Step 6 (stretch): SearchableTicketList
// SearchableTicketList: an input labelled "Search" above a TicketList.
// Only tickets whose title contains the search text (ignoring case) are shown.
//
// Example:
//   tickets 'Login page', 'Export CSV', 'Login button'; type "LOGIN"
//   → the list shows 'Login page' and 'Login button'
export function SearchableTicketList({ tickets }: { tickets: Ticket[] }): ReactNode {
  throw new Error('TODO: step 6');
}
