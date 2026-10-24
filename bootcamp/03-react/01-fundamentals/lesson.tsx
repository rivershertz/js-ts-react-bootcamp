import {
  Code,
  Deck,
  PredictSlide,
  RecapSlide,
  RenderSlide,
  Reveal,
  Slide,
  TitleSlide,
  type DeckMeta,
  type LessonProps,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '03-react/01',
  title: 'React fundamentals in TypeScript',
  time: '25 min lesson · 35 min exercises',
  subtitle: 'Components are functions of props and state. React calls them and puts what they return on the page.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: think of a component as a pure function that returns a template']} />

      <Slide title="A component is a function that returns markup" eyebrow="Components">
        <Code
          lang="tsx"
          code={`
function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <article>
      <h3>{ticket.title}</h3>
      <PriorityBadge priority={ticket.priority} />
    </article>
  );
}`}
        />
        <ul>
          <li>The name starts with a capital letter. Lowercase tags (<code>article</code>) are HTML; capitalised ones are your components.</li>
          <li>
            <code>{'{ }'}</code> inside JSX holds any JavaScript expression: a value, a call, a ternary. Not a statement like{' '}
            <code>if</code> or <code>for</code>.
          </li>
        </ul>
      </Slide>

      <Slide title="JSX is not HTML" eyebrow="The differences that bite">
        <table className="k-table">
          <thead>
            <tr>
              <th>HTML</th>
              <th>JSX</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">class=&quot;card&quot;</td>
              <td className="mono">className=&quot;card&quot;</td>
              <td>
                <code>class</code> is a JavaScript keyword
              </td>
            </tr>
            <tr>
              <td className="mono">onclick=&quot;save()&quot;</td>
              <td className="mono">{'onClick={save}'}</td>
              <td>camelCase, and you pass the function, not a call</td>
            </tr>
            <tr>
              <td className="mono">&lt;br&gt;</td>
              <td className="mono">&lt;br /&gt;</td>
              <td>every tag must be closed</td>
            </tr>
            <tr>
              <td>two tags side by side</td>
              <td className="mono">&lt;&gt;...&lt;/&gt;</td>
              <td>a component returns one thing; a fragment groups without adding a tag</td>
            </tr>
          </tbody>
        </table>
      </Slide>

      <Slide title="Props are the function's arguments, typed" eyebrow="Props">
        <Code
          lang="tsx"
          code={`
type Props = { priority: Priority; small?: boolean };

function PriorityBadge({ priority, small = false }: Props) {
  return <span className={small ? 'badge small' : 'badge'}>{priority}</span>;
}

<PriorityBadge priority="high" />          // ok
<PriorityBadge priority="critical" />      // error: not a Priority
<PriorityBadge />                          // error: priority is missing`}
        />
        <div className="k-note">
          Props are read-only. A component never changes its props; to show something different, the parent passes new ones.
        </div>
      </Slide>

      <Slide title="State: values a component remembers" eyebrow="useState" steps={1}>
        <Code
          lang="tsx"
          code={`
function EstimateCounter() {
  const [hours, setHours] = useState(0);
  return (
    <button onClick={() => setHours(hours + 1)}>
      Estimate: {hours} h
    </button>
  );
}`}
        />
        <Reveal at={1}>
          <ul>
            <li>
              <code>useState(0)</code> gives the current value and a setter. A plain <code>let hours = 0</code> would reset on every
              render and never update the screen.
            </li>
            <li>Calling the setter asks React to render the component again with the new value.</li>
          </ul>
        </Reveal>
      </Slide>

      <RenderSlide
        title="What happens when you click"
        eyebrow="Walkthrough · press → to step"
        tree={{ name: 'App', children: [{ name: 'EstimateCounter' }, { name: 'TicketList' }] }}
        steps={[
          { note: 'First render: React calls every component and puts the result on the page.', rendered: ['App', 'EstimateCounter', 'TicketList'], log: ['render App', 'render EstimateCounter', 'render TicketList', 'commit to the DOM'] },
          { note: 'Click: the handler calls setHours(1). Nothing changes yet; React schedules a render.', rendered: [], log: ['click', 'setHours(1) queued'] },
          {
            note: 'React calls EstimateCounter again. This time useState returns 1. Only the text that changed is updated in the DOM.',
            rendered: ['EstimateCounter'],
            log: ['render EstimateCounter (hours = 1)', 'commit: text "Estimate: 1 h"'],
          },
        ]}
      />

      <PredictSlide
        lang="tsx"
        code={`
const [hours, setHours] = useState(0);

function handleClick() {
  setHours(hours + 1);
  console.log(hours);
}`}
        question="The button is clicked once. What does the console show?"
        answer="0"
        explanation={
          <>
            The setter does not change <code>hours</code> in this render; it schedules the next render, where <code>hours</code> will be 1.
            Inside one render, state is a snapshot. Module 03 goes deeper.
          </>
        }
      />

      <Slide title="Events: pass the function, do not call it" eyebrow="Common mistake">
        <Code
          lang="tsx"
          code={`
// ok: React calls save on click
<button onClick={save}>Save</button>

// ok: a new function that calls remove on click
<button onClick={() => remove(ticket.id)}>Delete</button>

// wrong: calls remove while rendering
<button onClick={remove(ticket.id)}>Delete</button>`}
        />
        <div className="k-note">
          The last one deletes the ticket while the list renders, and if <code>remove</code> sets state, React renders again,
          forever. TypeScript often catches it: <code>void</code> is not a click handler.
        </div>
      </Slide>

      <Slide title="Lists need keys" eyebrow="Lists">
        <Code
          lang="tsx"
          code={`
<ul>
  {tickets.map((ticket) => (
    <li key={ticket.id}>
      <TicketCard ticket={ticket} />
    </li>
  ))}
</ul>`}
        />
        <ul>
          <li>The key tells React which item is which between renders, so it can keep each item&apos;s state and DOM node.</li>
          <li>
            Use an id from the data. The array index breaks when items are inserted, removed or sorted: state moves to the wrong
            row.
          </li>
        </ul>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
const tickets: Ticket[] = [];

return <div>{tickets.length && <TicketList tickets={tickets} />}</div>;`}
        question="What appears on the page?"
        answer="The digit 0"
        explanation={
          <>
            <code>0 && x</code> is <code>0</code>, and React renders numbers. Write <code>{'tickets.length > 0 && ...'}</code>, or a
            ternary, or return early.
          </>
        }
      />

      <Slide title="Controlled inputs: React owns the value" eyebrow="Forms">
        <Code
          lang="tsx"
          code={`
const [title, setTitle] = useState('');

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();          // no page reload
  onAdd(title.trim());
  setTitle('');                    // clearing works because React owns the value
}

<form onSubmit={handleSubmit}>
  <input value={title} onChange={(e) => setTitle(e.target.value)} />
</form>`}
        />
        <div className="k-note">
          Put submit logic in the form&apos;s <code>onSubmit</code>, not the button&apos;s <code>onClick</code>: then Enter in the input
          works too.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'A component is a function from props (and state) to JSX. Type its props.',
          'JSX: className, camelCase events, closed tags, one root (or a fragment).',
          'useState remembers a value; calling the setter schedules a new render. Inside a render, state does not change.',
          'Pass handlers, do not call them: onClick={save}, or onClick={() => remove(id)}.',
          'Lists: key={item.id}. Conditions: a ternary, or && with a real boolean.',
          'Controlled inputs: value plus onChange; submit logic in onSubmit with preventDefault().',
        ]}
      />
    </Deck>
  );
}
