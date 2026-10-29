import {
  CompareSlide,
  Code,
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
  id: '01-js/03',
  title: 'Scope and closures',
  time: '20 min lesson · 50 min exercises',
  subtitle: 'How JavaScript decides where a variable lives, and how a function can carry variables with it.',
};

const callCode = `
const vat = 17;
function withVat(price) {
  const total = price + price * vat / 100;
  return total;
}
const final = withVat(100);
console.log(final);
`;

const callSteps: WalkStep[] = [
  {
    line: 1,
    note: 'JavaScript creates the global execution context: memory for variables, and a thread that runs one line at a time.',
    stack: [{ name: 'global', vars: { vat: '17' } }],
  },
  {
    line: 2,
    note: 'A function definition is stored in memory, like any value. Its body does not run yet.',
    stack: [{ name: 'global', vars: { vat: '17', withVat: { ref: 'f' } } }],
    heap: [{ id: 'f', label: 'function withVat' }],
  },
  {
    line: 6,
    note: 'Calling withVat(100) creates a new execution context and pushes it on the call stack. price is 100 in its local memory.',
    stack: [
      { name: 'global', vars: { vat: '17', withVat: { ref: 'f' }, final: '…waiting' } },
      { name: 'withVat(100)', vars: { price: '100' } },
    ],
    heap: [{ id: 'f', label: 'function withVat' }],
  },
  {
    line: 3,
    note: 'vat is not in withVat’s memory, so JavaScript looks outward, in the scope where withVat was written, and finds it in global.',
    stack: [
      { name: 'global', vars: { vat: '17', withVat: { ref: 'f' }, final: '…waiting' } },
      { name: 'withVat(100)', vars: { price: '100', total: '117' } },
    ],
    heap: [{ id: 'f', label: 'function withVat' }],
  },
  {
    line: 4,
    note: 'return hands 117 back. The context is popped off the stack and its local memory (price, total) is thrown away.',
    stack: [{ name: 'global', vars: { vat: '17', withVat: { ref: 'f' }, final: '117' } }],
    heap: [{ id: 'f', label: 'function withVat' }],
  },
  {
    line: 7,
    note: 'Back in global, the thread carries on.',
    stack: [{ name: 'global', vars: { vat: '17', withVat: { ref: 'f' }, final: '117' } }],
    heap: [{ id: 'f', label: 'function withVat' }],
    output: ['117'],
  },
];

const backpackCode = `
function outer() {
  let calls = 0;
  function inner() {
    calls = calls + 1;
    return calls;
  }
  return inner;
}
const track = outer();
console.log(track());
console.log(track());
`;

const outerFn = { id: 'o', label: 'function outer' };
const backpackSteps: WalkStep[] = [
  {
    line: 1,
    note: 'outer is stored. Nothing runs yet.',
    stack: [{ name: 'global', vars: { outer: { ref: 'o' } } }],
    heap: [outerFn],
  },
  {
    line: 9,
    note: 'Calling outer() pushes a new context.',
    stack: [
      { name: 'global', vars: { outer: { ref: 'o' }, track: '…waiting' } },
      { name: 'outer()', vars: {} },
    ],
    heap: [outerFn],
  },
  {
    line: 2,
    note: 'calls is created in outer’s local memory.',
    stack: [
      { name: 'global', vars: { outer: { ref: 'o' }, track: '…waiting' } },
      { name: 'outer()', vars: { calls: '0' } },
    ],
    heap: [outerFn],
  },
  {
    line: 3,
    note: 'inner is created inside outer. It gets a hidden link to the variables around it. We call that link its backpack.',
    stack: [
      { name: 'global', vars: { outer: { ref: 'o' }, track: '…waiting' } },
      { name: 'outer()', vars: { calls: '0', inner: { ref: 'i' } } },
    ],
    heap: [outerFn, { id: 'i', label: 'function inner', backpack: { calls: '0' } }],
  },
  {
    line: 7,
    note: 'outer returns inner and its context is popped. Its local memory is gone, but inner’s backpack still holds calls.',
    stack: [{ name: 'global', vars: { outer: { ref: 'o' }, track: { ref: 'i' } } }],
    heap: [outerFn, { id: 'i', label: 'function inner', backpack: { calls: '0' } }],
  },
  {
    line: 10,
    note: 'track is inner. Calling it pushes a new context with no local calls.',
    stack: [
      { name: 'global', vars: { outer: { ref: 'o' }, track: { ref: 'i' } } },
      { name: 'track()', vars: {} },
    ],
    heap: [outerFn, { id: 'i', label: 'function inner', backpack: { calls: '0' } }],
  },
  {
    line: 4,
    note: 'calls is not local, so JavaScript looks in the backpack, finds it, and updates it there.',
    stack: [
      { name: 'global', vars: { outer: { ref: 'o' }, track: { ref: 'i' } } },
      { name: 'track()', vars: {} },
    ],
    heap: [outerFn, { id: 'i', label: 'function inner', backpack: { calls: '1' } }],
  },
  {
    line: 10,
    note: 'track() returns 1 and its context is popped. The backpack stays.',
    stack: [{ name: 'global', vars: { outer: { ref: 'o' }, track: { ref: 'i' } } }],
    heap: [outerFn, { id: 'i', label: 'function inner', backpack: { calls: '1' } }],
    output: ['1'],
  },
  {
    line: 11,
    note: 'The second call finds calls = 1 in the same backpack and makes it 2. The backpack lives as long as track does.',
    stack: [{ name: 'global', vars: { outer: { ref: 'o' }, track: { ref: 'i' } } }],
    heap: [outerFn, { id: 'i', label: 'function inner', backpack: { calls: '2' } }],
    output: ['1', '2'],
  },
];

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: nested def + nonlocal']} />

      <Slide title="Two things happen when code runs" lead={<>To understand closures you need a picture of what the engine keeps track of while it runs your code.</>} eyebrow="Mental model" steps={2}>
        <ul>
          <li>
            A <strong>thread of execution</strong> goes through the code one line at a time.
          </li>
          <Reveal at={1}>
            <li>
              A <strong>memory</strong> holds the variables for the code that is running. Together they are an{' '}
              <strong>execution context</strong>.
            </li>
          </Reveal>
          <Reveal at={2}>
            <li>
              Each function call gets a fresh one, pushed on the <strong>call stack</strong>. When it returns, it is popped and
              its memory is gone.
            </li>
          </Reveal>
        </ul>
      </Slide>

      <WalkthroughSlide title="Calling a function" lead={<>Same diagram as in module 01. Watch the call stack: calling a function adds a box with its own variables on top, and returning removes it.</>} eyebrow="Walkthrough · press → to step" code={callCode} steps={callSteps} />

      <CompareSlide
        title="Blocks have their own scope" lead={<>In Python a variable belongs to its whole function. In JavaScript, let and const belong to the nearest pair of curly braces.</>}
        python={`if True:\n    label = "urgent"\n\nprint(label)  # urgent`}
        js={`if (true) {\n  const label = 'urgent';\n}\nconsole.log(label); // ReferenceError`}
        note={
          <>
            In JavaScript, <code>let</code> and <code>const</code> exist only inside their <code>{'{ }'}</code>. Use{' '}
            <code>const</code> by default and <code>let</code> when you must reassign.
          </>
        }
      />

      <PredictSlide
        code={`for (var i = 0; i < 3; i++) {}\nconsole.log(i);\n\nfor (let j = 0; j < 3; j++) {}\nconsole.log(j);`}
        answer="3, then ReferenceError: j is not defined"
        surprising
        explanation={
          <>
            <code>var</code> ignores blocks and belongs to the whole function, like a Python variable. <code>let</code> lives only
            inside its loop. You will only see <code>var</code> in old code, but it causes real bugs there.
          </>
        }
      />

      <Slide title="Functions are values" lead={<>A function is a value like a number or an object. That is what makes closures possible.</>} eyebrow="Mental model">
        <p>You can store a function in a variable, pass it to another function, and return it. Python works the same way.</p>
        <Code
          code={`const shout = (text) => text.toUpperCase() + '!';\n\nfunction applyTo(fn, value) {\n  return fn(value);\n}\n\napplyTo(shout, 'ship it'); // 'SHIP IT!'`}
        />
        <div className="k-note">
          Returning a function from a function is where it gets interesting. What happens to the variables around it?
        </div>
      </Slide>

      <WalkthroughSlide title="The backpack" lead={<>When a function is created inside another function, it takes the variables around it along. Watch the 🎒 Backpack box on the heap.</>} eyebrow="Walkthrough · press → to step" code={backpackCode} steps={backpackSteps} />

      <PredictSlide
        code={`const a = outer();\nconst b = outer();\na();\na();\nconsole.log(b());`}
        answer="1"
        explanation={
          <>
            Each call to <code>outer()</code> runs its body again: a new <code>calls</code> and a new backpack. <code>a</code> and{' '}
            <code>b</code> never share. You will need this from exercise step 3 on.
          </>
        }
      />

      <CompareSlide
        title="The same closure in Python" lead={<>If you have written a nested def in Python, you have already used a closure.</>}
        python={`def outer():\n    calls = 0\n    def inner():\n        nonlocal calls\n        calls += 1\n        return calls\n    return inner`}
        js={`function outer() {\n  let calls = 0;\n  function inner() {\n    calls = calls + 1;\n    return calls;\n  }\n  return inner;\n}`}
        note={
          <>
            Python needs <code>nonlocal</code> to change an outer variable. JavaScript does not: <code>inner</code> updates{' '}
            <code>calls</code> directly.
          </>
        }
      />

      <RunSlide
        title="Change the backpack" lead={<>The code runs in your browser. Change it as much as you like: nothing is saved.</>}
        code={`function outer(start) {\n  let calls = start;\n  return function inner() {\n    calls = calls + 1;\n    return calls;\n  };\n}\n\nconst fromTen = outer(10);\nconsole.log(fromTen());\nconsole.log(fromTen());\n\n// Make a second tracker that starts at 0.\n// Does it change fromTen?`}
      >
        Edit the code and press Run. Parameters go into the backpack too: <code>start</code> is remembered as well.
      </RunSlide>

      <PredictSlide
        code={`const readers = [];\nfor (var i = 0; i < 3; i++) {\n  readers.push(() => i);\n}\nconsole.log(readers[0]());`}
        answer="3"
        surprising
        explanation={
          <>
            The backpack holds the variable, not a copy of its value. With <code>var</code> there is one <code>i</code> for the
            whole loop, and by the time <code>readers[0]</code> runs it is 3. With <code>let</code> every turn of the loop gets its
            own <code>i</code>, so <code>readers[0]()</code> returns 0. Exercise steps 6 and 7 are about exactly this.
          </>
        }
      />

      <Slide title="What goes in the backpack" lead={<>Every exercise in this module keeps something in a backpack. Here is what each one remembers between calls.</>} eyebrow="Patterns you will build" steps={1}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 24 }}>
          <tbody>
            {[
              ["makeGreeter('Hello')", 'the greeting'],
              ['makeTicker()', 'the last number it returned'],
              ['makeTicketQueue()', 'the list of waiting titles, shared by add, next and size'],
              ['once(fn)', 'whether fn already ran, and its result'],
              ['memoize(fn)', 'a Map from each argument to its result'],
              ["createIdGenerator('T')", 'the prefix and the last number used'],
              ['debounce(fn, ms)', 'the id of the timer that is waiting'],
            ].map(([name, keeps]) => (
              <tr key={name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 0', fontFamily: 'var(--font-mono)', fontSize: 22, width: '42%' }}>{name}</td>
                <td style={{ padding: '9px 0' }}>{keeps}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Reveal at={1}>
          <div className="k-note backpack">
            In React, every event handler is a closure over the props and state of the render that created it. That is why
            you will meet “stale” values in Phase 3.
          </div>
        </Reveal>
      </Slide>

      <RecapSlide
        points={[
          'Each call gets its own execution context on the call stack, and loses its memory when it returns.',
          'let and const live inside their block. var does not, so avoid it.',
          'A function remembers the variables around where it was written: its backpack, or closure.',
          'Each call of the outer function makes a new backpack.',
        ]}
      />
    </Deck>
  );
}
