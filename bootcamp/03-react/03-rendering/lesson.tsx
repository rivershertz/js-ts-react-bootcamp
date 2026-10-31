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
  id: '03-react/03',
  title: 'Rendering: snapshots, lifting state, keys, effects',
  time: '15 min lesson · 40 min exercises',
  subtitle: 'When React renders, what a render can see, where state should live, and what effects are for.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['The final project has a bug for most slides in this deck']} />

      <Slide title="What makes a component render again" lead={<>A render is React calling your component function again to see what changed. Only a few things cause one.</>} eyebrow="Triggers">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Renders again when</div>
            <ul>
              <li>its own state is set to a new value</li>
              <li>its parent renders (even if the props are the same)</li>
              <li>a context it reads changes</li>
            </ul>
          </div>
          <div>
            <div className="k-col-label">Does not render when</div>
            <ul>
              <li>a plain variable changes</li>
              <li>an object or array in state is mutated</li>
              <li>a ref changes</li>
              <li>state is set to the same value (<code>Object.is</code>)</li>
            </ul>
          </div>
        </div>
        <div className="k-note">
          A render is just React calling your function. It is cheap until it is not; module 07 shows how to measure.
        </div>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
const [votes, setVotes] = useState(0);

function addThree() {
  setVotes(votes + 1);
  setVotes(votes + 1);
  setVotes(votes + 1);
}`}
        question="votes is 0 and addThree runs once. What is votes on the next render?"
        answer="1"
        explanation={
          <>
            In this render <code>votes</code> is 0, so all three calls say &ldquo;set it to 1&rdquo;. To build on the latest
            value, pass an updater: <code>setVotes((v) =&gt; v + 1)</code>. React runs the updaters in order: 0, 1, 2, 3.
          </>
        }
      />

      <Slide title="State is a snapshot; updates are batched" lead={<>Inside one render, state never changes. Setting it asks for the next render, and React groups the requests.</>} eyebrow="One event, one render">
        <Code
          lang="tsx"
          code={`
function save() {
  setSaving(true);
  setError(null);
  setTitle(title.trim());
  console.log(saving);   // still the old value: this render's snapshot
}                        // React renders once, after the handler, with all three`}
        />
        <ul>
          <li>Setting state never changes the variable in the running code. It schedules the next render.</li>
          <li>
            React groups every update from one event into one render. Since React 18 this also happens in timeouts and promises
            (module 09).
          </li>
        </ul>
      </Slide>

      <RenderSlide
        title="Lifting state up" lead={<>When two components need the same value, it lives in their closest common parent.</>}
        eyebrow="Where state lives · press → to step"
        code={`
function TicketBoard({ tickets }: Props) {
  const [status, setStatus] =
    useState<Status>('open');
  return (
    <>
      <StatusTabs
        selected={status}
        onSelect={setStatus} />
      <StatusTicketList
        tickets={tickets}
        status={status} />
    </>
  );
}`}
        tree={{ name: 'TicketBoard', children: [{ name: 'StatusTabs' }, { name: 'StatusTicketList' }] }}
        steps={[
          { note: 'Two siblings need the same value: the tabs show it, the list filters by it. Neither can read the other’s state.', rendered: ['TicketBoard', 'StatusTabs', 'StatusTicketList'], line: 3, log: ['render TicketBoard', 'render both children'] },
          { note: 'So the state moves up to their closest common parent, which passes it down as props.', rendered: [], line: 7, log: ['status = "open"'] },
          { note: 'A click in StatusTabs calls onSelect, which is setStatus from the parent.', rendered: [], line: 8, log: ['click "closed"', 'setStatus("closed")'] },
          { note: 'The parent renders with the new status, and both children render with it. They can never disagree.', rendered: ['TicketBoard', 'StatusTabs', 'StatusTicketList'], line: 11, log: ['render TicketBoard', 'render both, with closed'] },
        ]}
      />

      <Slide title="State belongs to a position in the tree" lead={<>React keeps state for a component at its place in the tree. The key decides whether it is the same component as before.</>} eyebrow="Keys reset state">
        <Code
          lang="tsx"
          code={`
// Same component, same place: the draft survives a new ticket
<NoteEditor ticketId={ticket.id} />

// A new key is a new component: fresh state for each ticket
<NoteEditor key={ticket.id} ticketId={ticket.id} />`}
        />
        <ul>
          <li>A new prop value does not reset state. React keeps it while the same component stays in the same place.</li>
          <li>
            A different <code>key</code>: the old one unmounts, a new one mounts with fresh state. The same is true of a page whose
            route changes only its parameter.
          </li>
        </ul>
      </Slide>

      <RenderSlide
        title="An effect runs after the screen updates" lead={<>An effect is code React runs after a render has reached the screen. Press → to follow one from start to cleanup.</>}
        eyebrow="Effects · press → to step"
        code={`
function OpenTimer() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const tick = () => setSecs((s) => s + 1);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <p>Open for {secs} s</p>;
}`}
        tree={{ name: 'TicketPage', children: [{ name: 'OpenTimer' }] }}
        steps={[
          { note: 'React renders OpenTimer and puts "Open for 0 s" on the page.', rendered: ['OpenTimer'], line: 8, log: ['render OpenTimer', 'commit'] },
          { note: 'Then it runs the effect: the interval starts. Effects connect the component to something outside React.', rendered: [], line: 5, log: ['effect: setInterval'] },
          { note: 'Every second the interval sets state, and React renders again. The effect does not run again: its dependencies did not change.', rendered: ['OpenTimer'], line: 4, log: ['tick: setSecs', 'render OpenTimer', 'commit'] },
          { note: 'When OpenTimer leaves the page, React calls the cleanup. Without it the interval runs forever, setting state on nothing.', rendered: [], line: 6, log: ['unmount OpenTimer', 'cleanup: clearInterval'] },
        ]}
      />

      <PredictSlide
        lang="tsx"
        code={`
useEffect(() => {
  setInterval(() => setSeconds((s) => s + 1), 1000);
}, []);   // no cleanup

// main.tsx wraps the app in <StrictMode>, as Vite's template does`}
        question="In development, how fast does the counter go?"
        answer="Two seconds per second"
        explanation={
          <>
            In development, StrictMode mounts each component, cleans it up, and mounts it again, to prove the cleanup works. Without
            a cleanup, two intervals run. In production it would &ldquo;work&rdquo;, and leak when the component goes away.
          </>
        }
      />

      <Slide title="Every effect that starts something stops it" lead={<>If an effect starts something, it returns a function that stops it. React calls that function for you.</>} eyebrow="Cleanup patterns">
        <table className="k-table">
          <thead>
            <tr>
              <th>The effect does</th>
              <th>The cleanup does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">const id = setInterval(...)</td>
              <td className="mono">clearInterval(id)</td>
            </tr>
            <tr>
              <td className="mono">const id = setTimeout(...)</td>
              <td className="mono">clearTimeout(id)</td>
            </tr>
            <tr>
              <td className="mono">window.addEventListener(&apos;keydown&apos;, onKey)</td>
              <td className="mono">window.removeEventListener(&apos;keydown&apos;, onKey)</td>
            </tr>
            <tr>
              <td className="mono">const off = socket.subscribe(...)</td>
              <td className="mono">off()</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          React runs the cleanup before the effect runs again (dependencies changed) and when the component unmounts. To remove a
          listener you need the same function, so define it inside the effect.
        </div>
      </Slide>

      <Slide title="You might not need an effect" lead={<>Effects are for talking to things outside React. Many effects in real code should be a plain calculation instead.</>} eyebrow="Derived values">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Effect: two renders, one of them wrong</div>
            <Code
              lang="tsx"
              small
              code={`
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(tickets.filter(isOpen).length);
}, [tickets]);`}
            />
          </div>
          <div>
            <div className="k-col-label">Computed while rendering</div>
            <Code
              lang="tsx"
              small
              code={`
const count = tickets.filter(isOpen).length;`}
            />
          </div>
        </div>
        <ul>
          <li>Computable from props or state? Compute it; do not store a copy. To reset state, use a key.</li>
          <li>Caused by a user action? Do it in the event handler.</li>
          <li>Effects are for syncing with things outside React: timers, the DOM, subscriptions, the network.</li>
        </ul>
      </Slide>

      <Slide title="Stretch: useReducer" lead={<>When state changes by rules, put the rules in one function, a reducer, and send it actions.</>} eyebrow="When state has rules">
        <Code
          lang="tsx"
          code={`
function ticketReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'assign': return { status: 'assigned', assignee: action.assignee };
    case 'close':  return { status: 'closed', assignee: state.assignee };
    ...
  }
}

const [state, dispatch] = useReducer(ticketReducer, initial);
<button onClick={() => dispatch({ type: 'close' })}>Close</button>`}
        />
        <div className="k-note">
          All the ways the state can change live in one pure function you can test without React. A discriminated union for the
          actions (Phase 2, module 05) makes TypeScript check each case.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'A component renders when its state changes, its parent renders, or a context it reads changes.',
          'State is a snapshot. Several updates to one value: use an updater, setX((x) => ...).',
          'Two components need the same state: lift it to their closest common parent.',
          'State belongs to a position in the tree. A new key gives fresh state.',
          'Effects sync with the outside world, after the render. Each one that starts something returns a cleanup.',
          'A value you can compute from props or state is not state, and needs no effect.',
        ]}
      />
    </Deck>
  );
}
