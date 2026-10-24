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
  WalkthroughSlide,
  type DeckMeta,
  type LessonProps,
  type WalkStep,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '01-js/01',
  title: 'Values and references',
  time: '15 min lesson · 35 min exercises',
  subtitle: 'What a variable really holds, why === surprises Python developers, and how to update data without changing it.',
};

const refCode = `
let count = 1;
let other = count;
other = 2;

const ticket = { title: 'Login', status: 'open' };
const same = ticket;
same.status = 'closed';
const copy = { ...ticket };
copy.status = 'open';
`;

const t = { id: 't', label: 'object' };
const c = { id: 'c', label: 'object (copy)' };
const refSteps: WalkStep[] = [
  {
    line: 1,
    note: 'count is declared at the top level of the file, so it lands in the global box. A number is a primitive (like strings, booleans, null and undefined): the value itself sits in the variable.',
    stack: [{ name: 'global', vars: { count: '1' } }],
  },
  { line: 2, note: 'Assigning a primitive copies the value. other gets its own 1.', stack: [{ name: 'global', vars: { count: '1', other: '1' } }] },
  { line: 3, note: 'Changing other does not touch count.', stack: [{ name: 'global', vars: { count: '1', other: '2' } }] },
  {
    line: 5,
    note: 'An object is stored on the heap. The variable only holds a reference: an arrow to it.',
    stack: [{ name: 'global', vars: { count: '1', other: '2', ticket: { ref: 't' } } }],
    heap: [{ ...t, fields: { title: "'Login'", status: "'open'" } }],
  },
  {
    line: 6,
    note: 'Assigning an object copies the arrow, not the object. Both names point at the same thing.',
    stack: [{ name: 'global', vars: { count: '1', other: '2', ticket: { ref: 't' }, same: { ref: 't' } } }],
    heap: [{ ...t, fields: { title: "'Login'", status: "'open'" } }],
  },
  {
    line: 7,
    note: 'So changing it through same changes what ticket sees too. Python lists and dicts behave exactly like this.',
    stack: [{ name: 'global', vars: { count: '1', other: '2', ticket: { ref: 't' }, same: { ref: 't' } } }],
    heap: [{ ...t, fields: { title: "'Login'", status: "'closed'" } }],
  },
  {
    line: 8,
    note: 'Spread { ...ticket } builds a new object with the same fields. Now there are two objects.',
    stack: [{ name: 'global', vars: { count: '1', other: '2', ticket: { ref: 't' }, same: { ref: 't' }, copy: { ref: 'c' } } }],
    heap: [
      { ...t, fields: { title: "'Login'", status: "'closed'" } },
      { ...c, fields: { title: "'Login'", status: "'closed'" } },
    ],
  },
  {
    line: 9,
    note: 'Changing the copy leaves the original alone.',
    stack: [{ name: 'global', vars: { count: '1', other: '2', ticket: { ref: 't' }, same: { ref: 't' }, copy: { ref: 'c' } } }],
    heap: [
      { ...t, fields: { title: "'Login'", status: "'closed'" } },
      { ...c, fields: { title: "'Login'", status: "'open'" } },
    ],
  },
];

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: like lists and dicts, except ===']} />

      <Slide
        title="How to read a memory diagram"
        eyebrow="Before the walkthrough"
        lead="The next slide runs code one line at a time and draws what is in memory after each line. This is what each part shows."
      >
        <ul>
          <li>
            <strong>Code, on the left.</strong> The highlighted line is the one that just ran.
          </li>
          <li>
            <strong>Variables · call stack.</strong> Every variable that exists right now, in boxes by where it was declared. The{' '}
            <code>global</code> box holds variables declared at the top level of the file, outside any function. Each function call
            adds its own box on top (module 03).
          </li>
          <li>
            <strong>Objects · heap.</strong> Objects and arrays live here. A variable never holds an object, only an arrow to it:{' '}
            <span className="k-ref" style={{ background: 'var(--ref-1)' }}>→ object</span>
          </li>
          <li>
            <strong>Below them</strong>, a sentence explains the step. A value that just changed is highlighted.
          </li>
        </ul>
      </Slide>

      <WalkthroughSlide
        title="Values and arrows"
        eyebrow="Walkthrough · press → to step"
        lead="Watch where each value ends up: numbers sit inside the variable, objects get an arrow."
        code={refCode}
        steps={refSteps}
      />

      <PredictSlide
        code={`const a = { id: 't1' };\nconst b = { id: 't1' };\nconst c = a;\n\nconsole.log(a === b);\nconsole.log(a === c);`}
        answer="false, then true"
        surprising
        explanation={
          <>
            For objects and arrays, <code>===</code> asks “is this the same object?”, like Python’s <code>is</code>. It never
            compares contents. Python’s <code>==</code> on dicts compares contents; JavaScript has no built-in operator for that.
          </>
        }
      />

      <CompareSlide
        title="Equality, side by side"
        lead="Python has two questions: == (same contents?) and is (same object?). JavaScript's === on objects only asks the second one."
        python={`[1, 2] == [1, 2]   # True  (contents)\n[1, 2] is [1, 2]   # False (identity)\n1 == "1"           # False`}
        js={`[1, 2] === [1, 2]  // false (identity)\n// no operator compares contents\n1 === '1'          // false\n1 == '1'           // true!  never use ==`}
        note={
          <>
            Always use <code>===</code> and <code>!==</code>. To compare objects, compare a field you trust, usually{' '}
            <code>a.id === b.id</code>.
          </>
        }
      />

      <PredictSlide
        code={`const ticket = { status: 'open' };\nticket.status = 'closed';\nconsole.log(ticket.status);\n\nticket = { status: 'open' };`}
        answer="'closed', then TypeError: Assignment to constant variable"
        explanation={
          <>
            <code>const</code> fixes the <strong>arrow</strong>, not the object. You can change what is inside, but not point the
            name somewhere else.
          </>
        }
      />

      <Slide
        title="Spread copies one level"
        eyebrow="Mental model"
        lead="{ ...obj } makes a new outer object, but any object or array inside it is still shared with the original."
        steps={1}
      >
        <Code
          code={`const filters = { search: 'login', statuses: ['open'] };\nconst next = { ...filters, search: 'export' };\n\nnext.statuses.push('closed');\nconsole.log(filters.statuses); // ['open', 'closed'] !`}
          focus={[2, 4, 5]}
        />
        <Reveal at={1}>
          <div className="k-note backpack">
            The copy is new, but <code>statuses</code> inside it is still an arrow to the <strong>same</strong> array. Copy every
            level you change: <code>{'{ ...filters, statuses: [...filters.statuses, \'closed\'] }'}</code>.
          </div>
        </Reveal>
      </Slide>

      <CompareSlide
        title="Destructuring is unpacking"
        lead="Take values out of an array by position, or out of an object by field name, in one line. You will see it in every React component."
        python={`title, status = ("Login", "open")\n\nt = {"id": "t1", "title": "Login"}\nid_ = t["id"]\nprio = t.get("priority", "medium")`}
        js={`const [title, status] = ['Login', 'open'];\n\nconst t = { id: 't1', title: 'Login' };\nconst { id, priority = 'medium' } = t;\n// rename: const { id: ticketId } = t;`}
        note={
          <>
            A default in <code>{'{ priority = \'medium\' }'}</code> is used only when the field is <code>undefined</code> (missing),
            not when it is <code>null</code> or <code>''</code>.
          </>
        }
      />

      <Slide title="Update without changing" eyebrow="The pattern you will use all day">
        <p>Return new objects and arrays instead of changing the ones you were given. React depends on it: it only notices a change when it gets a new object.</p>
        <Code
          small
          code={`// change a field\nconst closed = { ...ticket, status: 'closed' };\n\n// add, replace, remove in a list\nconst added    = [...tickets, newTicket];\nconst replaced = tickets.map((t) => (t.id === updated.id ? updated : t));\nconst removed  = tickets.filter((t) => t.id !== id);`}
        />
      </Slide>

      <RunSlide
        title="Break it on purpose"
        lead="The code runs in your browser. Change it as much as you like: nothing is saved."
        code={`const original = { id: 't1', tags: ['ui'] };\nconst copy = { ...original };\n\ncopy.id = 't2';\ncopy.tags.push('bug');\n\nconsole.log(original);\nconsole.log(original === copy);\nconsole.log(original.tags === copy.tags);`}
      >
        Predict each line, then Run. Fix the copy so <code>original.tags</code> stays <code>['ui']</code>.
      </RunSlide>

      <RecapSlide
        points={[
          'Primitives are copied. Objects and arrays are shared through references (arrows).',
          '=== on objects means “same object”, never “same contents”. Never use ==.',
          'const stops reassignment, not changes inside the object.',
          'Spread copies one level. Copy every level you change.',
          'Return new objects and arrays instead of changing the ones you were given.',
        ]}
      />
    </Deck>
  );
}
