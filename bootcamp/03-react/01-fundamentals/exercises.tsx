// 03-react/01 React fundamentals in TypeScript
//
// What you build: the pieces of a ticket list: a badge, a card, a list, a counter and a small form.
// Finished when:  `yarn verify 03-react/01` shows ✓ for steps 1 to 5. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Check your work with:  yarn verify 03-react/01
// See it in the browser:  yarn dev 03-react/01
import type { ReactNode } from 'react';
import type { Ticket } from '../tickets';

// Step 1 (core): PriorityBadge
// What:   PriorityBadge shows the priority in capitals inside a <span>: <span>HIGH</span>.
//         Its prop is typed as any string, so <PriorityBadge priority="critical" /> compiles.
//         Type it as Priority instead (import the type from '../tickets'), and destructure it.
// Result: <PriorityBadge priority="high" /> shows <span>HIGH</span>;  priority="critical" is a compile error.
// Needs:  slide "Props are the function's arguments, typed"; destructuring in parameters (01-js/01).
export function PriorityBadge(props: { priority: string }): ReactNode {
  throw new Error('TODO: step 1');
}

// Step 2 (core): TicketCard
// What:   TicketCard shows one ticket:
//           <article>
//             <h3>{title}</h3>
//             <PriorityBadge ... />
//             <p>Due {dueDate}</p>        or <p>No due date</p> when dueDate is null
//           </article>
// Result: a ticket due 2026-10-01 shows its title, its badge and "Due 2026-10-01".
// Needs:  slide "JSX is not HTML"; cond ? a : b in JSX.
export function TicketCard({ ticket }: { ticket: Ticket }): ReactNode {
  throw new Error('TODO: step 2');
}

// Step 3 (core): TicketList
// What:   TicketList shows a <ul> with one <li> per ticket, containing a TicketCard.
//         Give every <li> a key that stays the same for the same ticket.
//         With no tickets, show <p>No tickets</p> instead of the list.
// Result: 3 tickets → a <ul> with 3 <li>, no key warning in the console;  [] → <p>No tickets</p>
// Needs:  slide "Lists need keys".
export function TicketList({ tickets }: { tickets: Ticket[] }): ReactNode {
  throw new Error('TODO: step 3');
}

// Step 4 (core): EstimateCounter
// What:   EstimateCounter shows <p>Estimate: 0 h</p> and two buttons, "-" and "+".
//         "+" adds one hour, "-" removes one, but never below 0. Import useState from 'react'.
// Result: click "+" twice → "Estimate: 2 h";  click "-" at 0 → still "Estimate: 0 h"
// Needs:  slides "State: values a component remembers" and "Events: pass the function, do not call it".
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
// What:   NewTicketForm is a <form> with a controlled input labelled "Title" and an "Add" button.
//         Label it by wrapping it: <label>Title <input ... /></label>, as in the other steps.
//         - The button is disabled while the title is empty or only spaces.
//         - Submitting (the button or Enter) calls onAdd with the trimmed title, then clears the input.
//         - The page must not reload: call event.preventDefault() in the submit handler.
// Result: type "  Export  " and press Enter → onAdd('Export') once, the input is empty, the page did not reload.
// Needs:  slide "Controlled inputs: React owns the value"; trim (cheat sheet).
export function NewTicketForm({ onAdd }: { onAdd: (title: string) => void }): ReactNode {
  throw new Error('TODO: step 5');
}

// Step 6 (stretch): SearchableTicketList
// What:   SearchableTicketList: an input labelled "Search" above a TicketList.
//         Only tickets whose title contains the search text (ignoring case) are shown.
// Result: typing "LOGIN" shows only the tickets with "login" in their title.
// Needs:  a controlled input (step 5), filter, toLowerCase and includes (cheat sheet).
export function SearchableTicketList({ tickets }: { tickets: Ticket[] }): ReactNode {
  throw new Error('TODO: step 6');
}
