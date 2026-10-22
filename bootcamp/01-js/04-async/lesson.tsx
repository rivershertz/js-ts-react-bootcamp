import {
  Code,
  CompareSlide,
  Deck,
  EventLoopSlide,
  PredictSlide,
  RecapSlide,
  Reveal,
  RunSlide,
  Slide,
  TitleSlide,
  type DeckMeta,
  type LessonProps,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '01-js/04',
  title: 'Async',
  time: '45 min lesson · 50 min exercises',
  subtitle: 'One thread, many things waiting: the event loop, promises, async / await, and calling the API with axios.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: like asyncio, but everything is async']} />

      <Slide title="One thread that never waits" eyebrow="Mental model" steps={2}>
        <ul>
          <li>JavaScript runs your code on one thread. While it runs, nothing else happens: no clicks, no redraws.</li>
          <Reveal at={1}>
            <li>
              So slow things (timers, network) are handed off. JavaScript says “call me back when you are done” and carries on.
            </li>
          </Reveal>
          <Reveal at={2}>
            <li>
              When the thread is free, the <strong>event loop</strong> picks the next waiting callback and runs it. Python’s{' '}
              <code>asyncio</code> works the same way; in the browser it is the only way.
            </li>
          </Reveal>
        </ul>
      </Slide>

      <EventLoopSlide
        title="The event loop"
        eyebrow="Walkthrough · press → to step"
        code={`console.log('start');\nsetTimeout(() => console.log('timer'), 0);\naxios.get('/api/tickets')\n  .then(() => console.log('tickets'));\nconsole.log('end');`}
        steps={[
          { line: 1, note: 'Plain code runs first, line by line.', stack: ['global'], output: ['start'] },
          { line: 2, note: 'setTimeout hands the callback to the timer system. Even with 0 ms, it will not run now.', stack: ['global'], waiting: ['timer 0 ms'], output: ['start'] },
          { line: 3, note: 'axios starts a network request and immediately returns a promise. The request waits outside JavaScript.', stack: ['global'], waiting: ['timer 0 ms', 'GET /api/tickets'], output: ['start'] },
          { line: 5, note: 'The last line runs. The script is finished.', stack: [], waiting: ['GET /api/tickets'], tasks: ['log timer'], output: ['start', 'end'] },
          { note: 'The stack is empty, so the loop runs the timer callback from the task queue.', stack: ['log timer'], waiting: ['GET /api/tickets'], output: ['start', 'end', 'timer'] },
          { note: 'Some time later the response arrives. The promise resolves and its .then callback joins the microtask queue.', stack: [], microtasks: ['log tickets'], output: ['start', 'end', 'timer'] },
          { note: 'Microtasks run as soon as the stack is empty, before any other task.', stack: ['log tickets'], output: ['start', 'end', 'timer', 'tickets'] },
        ]}
      />

      <Slide title="A promise is a value that arrives later" eyebrow="Mental model" steps={1}>
        <Code
          code={`const promise = axios.get('/api/tickets'); // pending\n\npromise\n  .then((response) => console.log(response.data)) // fulfilled\n  .catch((error) => console.log(error.message));  // rejected`}
        />
        <Reveal at={1}>
          <div className="k-note">
            A promise is <strong>pending</strong>, then either <strong>fulfilled</strong> with a value or <strong>rejected</strong> with
            an error. It settles once and never changes again.
          </div>
        </Reveal>
      </Slide>

      <CompareSlide
        title="async / await reads like normal code"
        python={`async def first_title():\n    tickets = await fetch_tickets()\n    return tickets[0]["title"]`}
        js={`async function firstTitle() {\n  const res = await axios.get('/api/tickets');\n  return res.data[0].title;\n}`}
        note={
          <>
            <code>await</code> pauses only this function, and only until the promise settles. An <code>async</code> function always
            returns a promise, even when you <code>return</code> a plain value.
          </>
        }
      />

      <PredictSlide
        code={`async function firstTitle() {\n  const response = await axios.get('/api/tickets');\n  return response.data[0].title;\n}\n\nconst title = firstTitle();\nconsole.log(title);`}
        answer="Promise { <pending> }"
        explanation={
          <>
            Calling an async function gives you a promise, not its result. You need <code>await firstTitle()</code> inside another
            async function. A missing <code>await</code> is the most common async bug.
          </>
        }
      />

      <Slide title="Errors: try / catch around await" eyebrow="Reference">
        <Code
          small
          code={`try {\n  const { data } = await client.get(\`/tickets/\${id}\`);\n  return data;\n} catch (error) {\n  if (error.response?.status === 404) return null; // the server said "not found"\n  throw error;                                     // anything else: let it go up\n}`}
        />
        <div className="k-note">
          axios throws for every 4xx and 5xx answer. <code>error.response</code> is missing when there was no answer at all (server
          down, network error), which is why the <code>?.</code> matters.
        </div>
      </Slide>

      <Slide title="One after another, or all at once?" eyebrow="Mental model" steps={1}>
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label" style={{ color: 'var(--bad)' }}>
              Sequential: 3 × 200 ms = 600 ms
            </div>
            <Code small code={`const a = await get('t1');\nconst b = await get('t2');\nconst c = await get('t3');`} />
          </div>
          <div>
            <div className="k-col-label" style={{ color: 'var(--good)' }}>
              Parallel: about 200 ms
            </div>
            <Code small code={`const [a, b, c] = await Promise.all([\n  get('t1'), get('t2'), get('t3'),\n]);`} />
          </div>
        </div>
        <Reveal at={1}>
          <div className="k-note">
            Start all the promises first, then wait for them together. <code>Promise.all</code> keeps the order of the list you gave
            it, not the order the answers arrived.
          </div>
        </Reveal>
      </Slide>

      <Slide title="all or allSettled?" eyebrow="Reference">
        <table className="k-table">
          <thead>
            <tr>
              <th></th>
              <th>Promise.all</th>
              <th>Promise.allSettled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>If one fails</td>
              <td>rejects at once with that error</td>
              <td>waits for all of them anyway</td>
            </tr>
            <tr>
              <td>Gives you</td>
              <td className="mono">[a, b, c]</td>
              <td className="mono" style={{ fontSize: 17 }}>
                {"[{ status: 'fulfilled', value }, { status: 'rejected', reason }]"}
              </td>
            </tr>
            <tr>
              <td>Use when</td>
              <td>you need every result</td>
              <td>partial results are useful</td>
            </tr>
          </tbody>
        </table>
      </Slide>

      <Slide title="axios in one slide" eyebrow="Reference">
        <Code
          small
          code={`import axios from 'axios';\n\nconst client = axios.create({ baseURL: '/api' });\n\nconst { data: tickets } = await client.get('/tickets');           // GET\nconst { data: created } = await client.post('/tickets', draft);   // POST with JSON body\nawait client.put(\`/tickets/\${id}\`, ticket);                        // PUT`}
        />
        <div className="k-note">
          Like <code>requests</code>, but every call returns a promise and the JSON is already parsed in <code>response.data</code>.
        </div>
      </Slide>

      <RunSlide
        title="Feel the difference"
        code={`const job = async (name) => {\n  await new Promise((r) => setTimeout(r, 300));\n  return name;\n};\n\nlet start = Date.now();\nawait job('a');\nawait job('b');\nawait job('c');\nconsole.log('one by one', Date.now() - start, 'ms');\n\nstart = Date.now();\nconst all = await Promise.all([\n  job('a'), job('b'), job('c'),\n]);\nconsole.log('together', Date.now() - start, 'ms', all);`}
      >
        Run it. Then make job('b') throw and compare Promise.all with Promise.allSettled.
      </RunSlide>

      <RecapSlide
        points={[
          'One thread. Slow work waits outside; callbacks come back through the event loop.',
          'Microtasks (promise callbacks) run before tasks (timers, events).',
          'An async function returns a promise. Forgetting await is the most common bug.',
          'try / catch around await. axios throws for 4xx and 5xx; error.response may be missing.',
          'Start promises together and await Promise.all; use allSettled when partial results help.',
        ]}
      />
    </Deck>
  );
}
