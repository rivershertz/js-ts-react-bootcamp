import { Code, Deck, PredictSlide, RecapSlide, Reveal, Slide, TitleSlide, type DeckMeta, type LessonProps } from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '03-react/02',
  title: 'Rules of React',
  time: '15 min lesson · 40 min exercises',
  subtitle: 'Three rules that React assumes you follow. Break one and the bug shows up somewhere else, later.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['ESLint checks two of the three for you']} />

      <Slide title="The three rules" eyebrow="Overview" steps={3}>
        <ul>
          <li>
            <strong>1. Rendering is pure.</strong> Same props and state, same JSX. A render changes nothing outside itself.
          </li>
        </ul>
        <Reveal at={1}>
          <ul>
            <li>
              <strong>2. Never mutate.</strong> Not state, not props, not data you got from somewhere else. Make a new object or
              array instead.
            </li>
          </ul>
        </Reveal>
        <Reveal at={2}>
          <ul>
            <li>
              <strong>3. Hooks at the top level.</strong> Call every hook on every render, in the same order: never inside an{' '}
              <code>if</code>, a loop, or after an early <code>return</code>.
            </li>
          </ul>
        </Reveal>
        <Reveal at={3}>
          <div className="k-note">
            React does not check rules 1 and 2 while it runs. It trusts you, and when the trust is broken you get stale screens,
            lost updates, and data that changes &ldquo;by itself&rdquo;.
          </div>
        </Reveal>
      </Slide>

      <Slide title="Rule 1: rendering is pure" eyebrow="Pure render">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Impure</div>
            <Code
              lang="tsx"
              small
              code={`
let rowNumber = 0;

function Rows({ tickets }: Props) {
  return tickets.map((t) => {
    rowNumber++;   // changes the outside
    return <li key={t.id}>{rowNumber}</li>;
  });
}`}
            />
          </div>
          <div>
            <div className="k-col-label">Pure</div>
            <Code
              lang="tsx"
              small
              code={`
function Rows({ tickets }: Props) {
  return tickets.map((t, i) => (
    <li key={t.id}>{i + 1}</li>
  ));
}`}
            />
          </div>
        </div>
        <div className="k-note">
          React may render a component more often than you expect: in development, <code>StrictMode</code> renders everything
          twice on purpose to expose this. Side effects belong in event handlers, or in effects (module 03).
        </div>
      </Slide>

      <Slide title="Rule 2: React compares state by identity" eyebrow="Never mutate state">
        <Code
          lang="tsx"
          code={`
function add() {
  tags.push(draft);       // same array, now longer
  setTags(tags);          // Object.is(old, new) is true: React skips the render
}

function add() {
  setTags([...tags, draft]);   // a new array: React renders
}`}
        />
        <div className="k-note">
          The first version sometimes seems to work: if anything else re-renders the component, the pushed tag appears. That is
          the worst kind of bug, the one that depends on timing.
        </div>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
const [ticket, setTicket] = useState(initial);

function assign() {
  ticket.assignee = 'a3';
  setTicket(ticket);
}`}
        question="assign() runs on a click. What does the user see, and what happened to initial?"
        answer="The screen does not change, and initial (the parent's object) now has assignee a3"
        explanation={
          <>
            <code>useState(initial)</code> does not copy: <code>ticket</code> is the parent&apos;s object. Write{' '}
            <code>{"setTicket({ ...ticket, assignee: 'a3' })"}</code>.
          </>
        }
      />

      <Slide title="A new value for every change" eyebrow="Cheat sheet">
        <table className="k-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Not this (mutates)</th>
              <th>This (new value)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>add</td>
              <td className="mono">list.push(x)</td>
              <td className="mono">[...list, x]</td>
            </tr>
            <tr>
              <td>remove</td>
              <td className="mono">list.splice(i, 1)</td>
              <td className="mono">list.filter((t) =&gt; t.id !== id)</td>
            </tr>
            <tr>
              <td>change one item</td>
              <td className="mono">list[i].done = true</td>
              <td className="mono">list.map((t) =&gt; t.id === id ? {'{ ...t, done: true }'} : t)</td>
            </tr>
            <tr>
              <td>sort</td>
              <td className="mono">list.sort(compare)</td>
              <td className="mono">list.toSorted(compare)</td>
            </tr>
            <tr>
              <td>change a field</td>
              <td className="mono">ticket.title = x</td>
              <td className="mono">{'{ ...ticket, title: x }'}</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          A spread copies one level. <code>[...items]</code> is a new array holding the same item objects, so changing an item
          still mutates.
        </div>
      </Slide>

      <Slide title="Props are read-only too" eyebrow="Never mutate props">
        <Code
          lang="tsx"
          code={`
function SortedTitles({ tickets }: { tickets: Ticket[] }) {
  const sorted = tickets.sort(byTitle);   // sorts the parent's array
  ...
}`}
        />
        <ul>
          <li>The array belongs to the parent. Sorting it in place reorders the parent&apos;s data without the parent knowing.</li>
          <li>
            The same goes for data from a library, such as the React Query cache: it is shared by every component that reads it.
          </li>
          <li>
            Rule of thumb: only change what you created in this render. Everything else, copy first (<code>toSorted</code>).
          </li>
        </ul>
      </Slide>

      <Slide title="Rule 3: hooks are matched by order" eyebrow="Rules of Hooks">
        <div className="k-cols" style={{ height: 'auto' }}>
          <Code
            lang="tsx"
            small
            code={`
function TicketDetails({ ticket }: Props) {
  const [open, setOpen] = useState(false);
  if (!ticket) {
    return <p>Pick a ticket</p>;
  }
  const [note, setNote] = useState('');
  ...
}`}
          />
          <div>
            <ul>
              <li>React does not know hooks by name. It keeps a list per component: slot 1, slot 2...</li>
              <li>With a ticket, the render uses two slots. Without one, only one.</li>
              <li>
                Switch between the two and React stops with{' '}
                <em>&ldquo;Rendered fewer hooks than expected&rdquo;</em> (or &ldquo;more&rdquo;).
              </li>
            </ul>
            <div className="k-note">Fix: call every hook first, then branch.</div>
          </div>
        </div>
      </Slide>

      <Slide title="Effects list everything they read" eyebrow="Dependencies">
        <Code
          lang="tsx"
          code={`
useEffect(() => {
  document.title = ticket.title;
}, []);              // runs once: the tab keeps the first ticket's title

useEffect(() => {
  document.title = ticket.title;
}, [ticket.title]);  // runs again whenever the title changes`}
        />
        <div className="k-note">
          The dependency array is not a list of &ldquo;when to run&rdquo;; it is the list of values the effect uses. Module 03
          covers effects in depth.
        </div>
      </Slide>

      <Slide title="ESLint checks rule 3 and dependencies" eyebrow="Tooling">
        <table className="k-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Catches</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">react-hooks/rules-of-hooks</td>
              <td>a hook inside a condition, a loop, a nested function, or after an early return</td>
            </tr>
            <tr>
              <td className="mono">react-hooks/exhaustive-deps</td>
              <td>a value an effect, useMemo or useCallback reads but does not list</td>
            </tr>
          </tbody>
        </table>
        <ul>
          <li>
            VS Code shows them as red underlines; <code>yarn eslint &lt;folder&gt;</code> lists them all.
          </li>
          <li>
            Never silence them with <code>eslint-disable</code>. The warning is almost always right, and the fix is in the code.
          </li>
          <li>ESLint cannot see mutation (rule 2) or most impure renders (rule 1). Those are on you.</li>
        </ul>
      </Slide>

      <RecapSlide
        points={[
          'Rendering is pure: no changes to anything outside the component while it renders.',
          'Never mutate state or props: new arrays and objects for every change (spread, map, filter, toSorted).',
          'A spread copies one level. Nested changes need a new object at every level that changes.',
          'Hooks at the top level, before any early return, in the same order every render.',
          'An effect lists every value it reads. ESLint finds missing ones; never disable the rule.',
        ]}
      />
    </Deck>
  );
}
