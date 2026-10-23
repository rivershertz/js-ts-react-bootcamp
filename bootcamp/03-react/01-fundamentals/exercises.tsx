// 03-react/01 React fundamentals in TypeScript
// Check your work with:  yarn verify 03-react/01
// See it in the browser:  yarn dev 03-react/01
import type { ReactNode } from 'react';
import type { Ticket } from '../tickets';

// Step 1 (core)
// PriorityBadge shows the priority in capitals inside a <span>: <span>HIGH</span>.
// Its prop is typed as any string, so <PriorityBadge priority="critical" /> compiles.
// Type it as Priority instead (import the type from '../tickets'), and destructure it.
export function PriorityBadge(props: { priority: string }): ReactNode {
  throw new Error('TODO: step 1');
}

// Step 2 (core)
// TicketCard shows one ticket:
//   <article>
//     <h3>{title}</h3>
//     <PriorityBadge ... />
//     <p>Due {dueDate}</p>        or <p>No due date</p> when dueDate is null
//   </article>
export function TicketCard({ ticket }: { ticket: Ticket }): ReactNode {
  throw new Error('TODO: step 2');
}

// Step 3 (core)
// TicketList shows a <ul> with one <li> per ticket, containing a TicketCard.
// Give every <li> a key that stays the same for the same ticket.
// With no tickets, show <p>No tickets</p> instead of the list.
export function TicketList({ tickets }: { tickets: Ticket[] }): ReactNode {
  throw new Error('TODO: step 3');
}

// Step 4 (stretch)
// EstimateCounter shows <p>Estimate: 0 h</p> and two buttons, "-" and "+".
// "+" adds one hour, "-" removes one, but never below 0. Import useState from 'react'.
export function EstimateCounter() {
  return (
    <div>
      <p>Estimate: 0 h</p>
      <button>-</button>
      <button>+</button>
    </div>
  );
}

// Step 5 (core)
// NewTicketForm is a <form> with a controlled input labelled "Title" and an "Add" button.
// Label it by wrapping it: <label>Title <input ... /></label>, as in the other steps.
// - The button is disabled while the title is empty or only spaces.
// - Submitting (the button or Enter) calls onAdd with the trimmed title, then clears the input.
// - The page must not reload: call event.preventDefault() in the submit handler.
export function NewTicketForm({ onAdd }: { onAdd: (title: string) => void }): ReactNode {
  throw new Error('TODO: step 5');
}

// Step 6 (stretch)
// SearchableTicketList: an input labelled "Search" above a TicketList.
// Only tickets whose title contains the search text (ignoring case) are shown.
export function SearchableTicketList({ tickets }: { tickets: Ticket[] }): ReactNode {
  throw new Error('TODO: step 6');
}
