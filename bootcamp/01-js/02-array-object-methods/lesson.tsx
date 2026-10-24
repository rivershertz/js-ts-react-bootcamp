import {
  Code,
  CompareSlide,
  Deck,
  PredictSlide,
  RecapSlide,
  Reveal,
  RunSlide,
  Slide,
  TitleSlide,
  useStep,
  type DeckMeta,
  type LessonProps,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '01-js/02',
  title: 'Array and object methods',
  time: '15 min lesson · 45 min exercises',
  subtitle: 'map, filter, reduce and friends: the JavaScript version of list comprehensions, plus the sort() trap.',
};

const toolbox: [string, string, string][] = [
  ['map(fn)', 'new array, same length', '[f(x) for x in xs]'],
  ['filter(fn)', 'new array, fewer items', '[x for x in xs if f(x)]'],
  ['find(fn)', 'first match or undefined', 'next((x for x in xs if f(x)), None)'],
  ['some(fn) / every(fn)', 'true or false', 'any(...) / all(...)'],
  ['includes(x)', 'true or false', 'x in xs'],
  ['reduce(fn, start)', 'one value built from all items', 'functools.reduce'],
  ['toSorted(cmp)', 'new sorted array', 'sorted(xs, key=...)'],
  ['slice(a, b)', 'new array, a part of it', 'xs[a:b]'],
];

const reduceRows: [string, string, string][] = [
  ['start', '—', '{ open: 0, closed: 0 }'],
  ["{ status: 'open' }", '{ open: 0, closed: 0 }', '{ open: 1, closed: 0 }'],
  ["{ status: 'closed' }", '{ open: 1, closed: 0 }', '{ open: 1, closed: 1 }'],
  ["{ status: 'open' }", '{ open: 1, closed: 1 }', '{ open: 2, closed: 1 }'],
];

function ReduceTable() {
  const step = useStep();
  return (
    <table className="k-table" style={{ marginTop: 18 }}>
      <thead>
        <tr>
          <th>item</th>
          <th>counts (before)</th>
          <th>returned → next counts</th>
        </tr>
      </thead>
      <tbody>
        {reduceRows.slice(0, step + 1).map(([item, before, after]) => (
          <tr key={item + after} style={{ animation: 'k-in 250ms ease' }}>
            <td className="mono">{item}</td>
            <td className="mono k-muted">{before}</td>
            <td className="mono">{after}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: comprehensions become method chains']} />

      <CompareSlide
        title="Comprehensions become methods"
        python={`titles = [t["title"] for t in tickets]\n\nurgent = [t for t in tickets\n          if t["priority"] == "urgent"]`}
        js={`const titles = tickets.map((t) => t.title);\n\nconst urgent = tickets.filter(\n  (t) => t.priority === 'urgent',\n);`}
        note={
          <>
            <code>(t) =&gt; t.title</code> is an arrow function: a short <code>lambda</code>. With one expression after the arrow,
            its value is returned automatically.
          </>
        }
      />

      <Slide title="The toolbox" eyebrow="Reference">
        <table className="k-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Gives you</th>
              <th>Python</th>
            </tr>
          </thead>
          <tbody>
            {toolbox.map(([m, gives, py]) => (
              <tr key={m}>
                <td className="mono">{m}</td>
                <td>{gives}</td>
                <td className="mono k-muted" style={{ fontSize: 17 }}>
                  {py}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Slide>

      <Slide title="How reduce builds one value" eyebrow="Walkthrough · press → to step" steps={reduceRows.length - 1}>
        <Code
          small
          code={`const counts = tickets.reduce(\n  (counts, t) => ({ ...counts, [t.status]: counts[t.status] + 1 }),\n  { open: 0, closed: 0 },\n);`}
        />
        <ReduceTable />
      </Slide>

      <PredictSlide
        code={`console.log([10, 9, 1].sort());`}
        answer="[1, 10, 9]"
        surprising
        explanation={
          <>
            Without a compare function, <code>sort</code> compares items <strong>as text</strong>, and “10” comes before “9”. Always
            pass one: <code>(a, b) =&gt; a - b</code> for numbers, <code>(a, b) =&gt; a.localeCompare(b)</code> for strings.
          </>
        }
      />

      <PredictSlide
        code={`const tickets = [{ id: 't2' }, { id: 't1' }];\nconst sorted = tickets.sort((a, b) => a.id.localeCompare(b.id));\n\nconsole.log(tickets[0].id);\nconsole.log(sorted === tickets);`}
        answer="'t1', then true"
        surprising
        explanation={
          <>
            <code>sort()</code> sorts the array <strong>in place</strong> and returns the same array. Python’s <code>list.sort()</code>{' '}
            does this too, but returns <code>None</code> so you notice. Use <code>toSorted()</code>, which returns a new array. In
            React, sorting data in place is a real bug you will fix on day 2.
          </>
        }
      />

      <Slide title="Writing a compare function" eyebrow="Reference" steps={1}>
        <p>
          <code>compare(a, b)</code> returns a negative number if <code>a</code> goes first, positive if <code>b</code> goes first, 0 if
          equal.
        </p>
        <Code
          small
          code={`nums.toSorted((a, b) => a - b);                 // 1, 2, 10\nnums.toSorted((a, b) => b - a);                 // 10, 2, 1\nnames.toSorted((a, b) => a.localeCompare(b));   // A to Z\n\n// ISO dates like '2026-10-14T09:15:00Z' sort correctly as text\ntickets.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first`}
        />
        <Reveal at={1}>
          <div className="k-note">
            Sorting by a fixed order, like priorities? Compare positions in a list:{' '}
            <code>ORDER.indexOf(a.priority) - ORDER.indexOf(b.priority)</code>.
          </div>
        </Reveal>
      </Slide>

      <CompareSlide
        title="Objects as dictionaries"
        python={`for key, value in d.items():\n    ...\nlist(d.keys())\nlist(d.values())\n\ndict(pairs)`}
        js={`for (const [key, value] of\n     Object.entries(d)) {}\nObject.keys(d)\nObject.values(d)\n\nObject.fromEntries(pairs)`}
        note={
          <>
            <code>Object.entries</code> → change the pairs with <code>map</code> / <code>filter</code> → <code>Object.fromEntries</code>{' '}
            is how you transform an object.
          </>
        }
      />

      <Slide title="Chaining" eyebrow="Putting it together">
        <p>Each method returns a new array, so you can call the next one on it. Read it top to bottom like a pipeline.</p>
        <Code
          code={`const busyPeople = tickets\n  .filter((t) => t.status !== 'closed')   // still open\n  .map((t) => t.assignee)                  // who has them\n  .filter(Boolean)                         // drop missing\n  .filter((a, i, all) => all.indexOf(a) === i); // unique`}
        />
      </Slide>

      <RunSlide
        title="Practise on real-looking data"
        code={`const tickets = [\n  { id: 't1', priority: 'low', status: 'open' },\n  { id: 't2', priority: 'urgent', status: 'closed' },\n  { id: 't3', priority: 'urgent', status: 'open' },\n];\n\n// 1. The ids of open tickets\n// 2. How many are urgent?\n// 3. Ids, urgent first, without changing tickets\nconsole.log(tickets.map((t) => t.id));`}
      >
        Solve the three comments, one <code>console.log</code> each. Check <code>tickets</code> is unchanged at the end.
      </RunSlide>

      <RecapSlide
        points={[
          'map, filter, find, some, every replace most loops, and return new arrays.',
          'reduce builds one value: a sum, a count, an object.',
          'sort() changes the array and sorts as text by default. Use toSorted with a compare function.',
          'Object.entries and Object.fromEntries turn objects into lists and back.',
        ]}
      />
    </Deck>
  );
}
