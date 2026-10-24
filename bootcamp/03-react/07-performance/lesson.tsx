import {
  Code,
  Deck,
  PredictSlide,
  RecapSlide,
  RenderSlide,
  Slide,
  TitleSlide,
  type DeckMeta,
  type LessonProps,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '03-react/07',
  title: 'Performance: memo, useMemo, useCallback',
  time: '25 min lesson · 35 min exercises',
  subtitle: 'Most renders are cheap. Find the ones that are not, measure them, and only then memoize.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Measure first, then fix', "Three of the final project's checks are about this"]} />

      <Slide title="When is a React app slow?" eyebrow="The usual causes">
        <ul>
          <li>
            <strong>Slow work in a render</strong> that runs again when its inputs did not change: filtering or sorting
            thousands of rows because a checkbox was ticked.
          </li>
          <li>
            <strong>Too many renders</strong>: a parent renders, and a hundred children render with it although nothing
            changed for them.
          </li>
          <li>
            <strong>Work on every key press</strong> that could wait until typing stops: debounce it (module 04).
          </li>
        </ul>
        <div className="k-note">
          Do less work first (debounce, fewer rows on screen). Then remember work you already did: that is what memoizing means.
        </div>
      </Slide>

      <Slide title="Measure: count the renders" eyebrow="Measuring">
        <Code
          lang="tsx"
          code={`
function TicketRow({ ticket }: Props) {
  console.count('TicketRow');   // a quick, temporary measurement
  ...
}`}
        />
        <ul>
          <li>Do one thing in the app (one click, one key), then read the console: how many renders did it cost?</li>
          <li>
            StrictMode renders everything twice in development. Halve the numbers, or compare before and after a change.
          </li>
          <li>Remove the counter when you are done: it changes the outside while rendering (module 02).</li>
        </ul>
      </Slide>

      <Slide title="Measure: the Performance tab" eyebrow="Browser DevTools">
        <ol>
          <li>F12, then the Performance tab. Click record (the round button).</li>
          <li>Do the slow thing in the page, then stop recording.</li>
          <li>
            In the Main track, look for long bars with a red corner: tasks over 50 ms, which the user feels as lag.
          </li>
          <li>Click one. The Bottom-Up tab lists the functions that took the time, with your file names.</li>
        </ol>
        <div className="k-note">
          A development build is slower than production. Compare the same action before and after your fix rather than trusting
          the absolute numbers.
        </div>
      </Slide>

      <Slide title="useMemo: remember a result" eyebrow="useMemo">
        <Code
          lang="tsx"
          code={`
// Every render: filters again, even when only "compact" changed
const shown = filterByTitle(tickets, search);

// Filters again only when tickets or search change
const shown = useMemo(() => filterByTitle(tickets, search), [tickets, search]);`}
        />
        <ul>
          <li>React keeps the last result and its dependencies. If every dependency is the same (Object.is), it reuses it.</li>
          <li>The dependencies are the inputs of the work. ESLint&apos;s exhaustive-deps rule checks the list.</li>
        </ul>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
const filters = { status, search };
const rows = useMemo(
  () => filterTickets(tickets, filters),
  [tickets, filters],
);`}
        question="The user ticks an unrelated checkbox. Does filterTickets run again?"
        answer="Yes, on every render"
        explanation={
          <>
            <code>filters</code> is a new object each render, so the dependency always looks changed. Depend on{' '}
            <code>status</code> and <code>search</code> instead, and build the object inside the function.
          </>
        }
      />

      <Slide title="memo: skip a render when props are the same" eyebrow="memo">
        <Code
          lang="tsx"
          code={`
const TicketRow = memo(function TicketRow({ ticket, selected, onSelect }: RowProps) {
  ...
});`}
        />
        <ul>
          <li>Without memo, a component renders whenever its parent does.</li>
          <li>With memo, React first compares each prop with the last ones (Object.is). All the same: it skips the render.</li>
          <li>One new prop, even a function that does the same thing, and the comparison fails.</li>
        </ul>
      </Slide>

      <RenderSlide
        title="Why memo alone often does nothing"
        eyebrow="useCallback · press → to step"
        code={`
function TicketPicker({ tickets }: Props) {
  const [sel, setSel] = useState('');
  const select = useCallback(
    (id: string) => setSel(id), []);
  return tickets.map((t) => (
    <TicketRow
      key={t.id}
      ticket={t}
      selected={t.id === sel}
      onSelect={select}
    />
  ));
}`}
        tree={{ name: 'TicketPicker', children: [{ name: 't1' }, { name: 't2' }, { name: 't3' }, { name: 't4' }] }}
        steps={[
          {
            note: 'Picture it first without useCallback: onSelect={(id) => setSel(id)}. A click on t2 renders TicketPicker, which makes a new function for every row.',
            rendered: ['TicketPicker', 't1', 't2', 't3', 't4'],
            log: ['click t2', 'onSelect is new: memo fails', 'render all 4 rows'],
          },
          {
            note: 'With useCallback, React gives back the same function on every render, until a dependency changes. Here there are none: setters never change.',
            rendered: [],
            line: 3,
            log: ['select: same function'],
          },
          {
            note: 'Now a click on t3 renders only the rows whose props changed: t2 (no longer selected) and t3.',
            rendered: ['TicketPicker', 't2', 't3'],
            line: 10,
            log: ['click t3', 'render t2, t3', 'skip t1, t4: same props'],
          },
        ]}
      />

      <Slide title="When not to memoize" eyebrow="It is not free">
        <table className="k-table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Why it does not help</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>useMemo(() =&gt; tickets.length, ...)</code>
              </td>
              <td>The work is cheaper than comparing the dependencies.</td>
            </tr>
            <tr>
              <td>
                <code>useCallback</code> for a plain <code>&lt;button&gt;</code>
              </td>
              <td>DOM elements do not compare props. Nothing is skipped.</td>
            </tr>
            <tr>
              <td>
                <code>memo</code> with <code>style=&#123;&#123; ... &#125;&#125;</code> or children
              </td>
              <td>A new object or element every render: the comparison always fails.</td>
            </tr>
            <tr>
              <td>Everything, just in case</td>
              <td>Harder to read, more memory, and a missed dependency becomes a stale-value bug.</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          A newer build tool, React Compiler, adds this memoization for you. Until a project uses it, deciding is your job.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'Measure before you fix: count renders, and record the Performance tab while doing the slow thing.',
          'Do less work first: debounce input, show fewer rows.',
          'useMemo keeps a slow result until its inputs change. Depend on values, not objects made during render.',
          'memo skips a render when every prop is the same. useCallback keeps a function the same, so memo can work.',
          'Do not memoize cheap work, plain elements, or components that always get new objects.',
        ]}
        next="Module 08: routing between the list and the form."
      />
    </Deck>
  );
}
