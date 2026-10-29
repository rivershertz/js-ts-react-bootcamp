import { Code, Deck, PredictSlide, RecapSlide, RenderSlide, Slide, TitleSlide, type DeckMeta, type LessonProps } from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '03-react/04',
  title: 'Custom hooks',
  time: '10 min lesson · 30 min exercises',
  subtitle: 'Move stateful logic out of a component into a function you can reuse. Each caller gets its own state.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['You will use the hook from this module in the final project']} />

      <Slide title="The same logic, twice" lead={<>Two search boxes both wait until the user stops typing. The waiting logic is copied, and it uses hooks.</>} eyebrow="Why">
        <Code
          lang="tsx"
          code={`
function TicketSearch() {
  const [text, setText] = useState('');
  const [debounced, setDebounced] = useState(text);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(text), 300);
    return () => clearTimeout(id);
  }, [text]);
  ...   // AssigneeSearch has the same eight lines
}`}
        />
        <div className="k-note">
          A regular helper function cannot hold this: it uses <code>useState</code> and <code>useEffect</code>, and hooks only
          work inside components or other hooks.
        </div>
      </Slide>

      <Slide title="A custom hook is a function that calls hooks" lead={<>Move the hooks into a function whose name starts with use. Each component calls it in one line.</>} eyebrow="Extract">
        <Code
          lang="tsx"
          code={`
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
// in both components: const debounced = useDebouncedValue(text);`}
        />
        <div className="k-note">
          The <code>use</code> prefix tells ESLint to apply the Rules of Hooks inside it. The generic <code>&lt;T&gt;</code> makes
          it work for any value.
        </div>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
function useToggle(initial: boolean): [boolean, () => void] {
  const [on, setOn] = useState(initial);
  return [on, () => setOn((v) => !v)];
}

function Row() {
  const [open, toggle] = useToggle(false);
}`}
        question="The page shows two <Row />. You click the first one's toggle. Does the second open too?"
        answer="No"
        explanation={
          <>
            A custom hook shares logic, not state: each caller gets its own <code>useState</code>. To share state, lift it up.
          </>
        }
      />

      <RenderSlide
        title="Debouncing, step by step" lead={<>Debouncing means waiting until the user pauses before acting on the text. Watch the log: every key press cancels the last timer.</>}
        eyebrow="useDebouncedValue · press → to step"
        tree={{ name: 'TicketSearch', children: [{ name: 'TicketTable' }] }}
        steps={[
          { note: 'You type "l". text is "l"; the effect starts a 300 ms timer. debounced is still "".', rendered: ['TicketSearch', 'TicketTable'], log: ['type "l"', 'render (text "l", debounced "")', 'effect: timer 1'] },
          { note: '80 ms later you type "o". Before the effect runs again, React calls its cleanup: timer 1 is cancelled.', rendered: ['TicketSearch', 'TicketTable'], log: ['type "o"', 'render (text "lo", debounced "")', 'cleanup: clear timer 1', 'effect: timer 2'] },
          { note: 'Same for "g". The table has not been filtered once yet.', rendered: ['TicketSearch', 'TicketTable'], log: ['type "g"', 'render (text "log", debounced "")', 'cleanup: clear timer 2', 'effect: timer 3'] },
          { note: 'You stop. 300 ms later timer 3 fires and sets debounced to "log": one filter, for the text you meant.', rendered: ['TicketSearch', 'TicketTable'], log: ['timer 3 fires', 'setDebounced("log")', 'render (debounced "log")'] },
        ]}
      />

      <Slide title="What to return" lead={<>A hook can return whatever its callers need. Three shapes cover almost every case.</>} eyebrow="Hook design">
        <table className="k-table">
          <thead>
            <tr>
              <th>Return</th>
              <th>When</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>a value</td>
              <td>the caller only reads</td>
              <td className="mono">const q = useDebouncedValue(text)</td>
            </tr>
            <tr>
              <td>a tuple</td>
              <td>a value and its setter, like useState; callers rename freely</td>
              <td className="mono">const [open, toggle] = useToggle(false)</td>
            </tr>
            <tr>
              <td>an object</td>
              <td>three or more things</td>
              <td className="mono">const {'{ data, isPending, error }'} = useTickets()</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          Type a tuple return explicitly (<code>[boolean, () =&gt; void]</code>). Without it, TypeScript infers an array of
          &ldquo;boolean or function&rdquo;, and every caller has to narrow.
        </div>
      </Slide>

      <Slide title="Stretch: refs remember without rendering" lead={<>useRef keeps a value between renders like state does, but changing it does not render the component again.</>} eyebrow="useRef">
        <Code
          lang="tsx"
          code={`
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    // runs after the render, so this render still returns the old value
    ref.current = value;
  }, [value]);
  return ref.current;
}`}
        />
        <div className="k-note">
          A ref is a box that survives renders. Changing <code>ref.current</code> does not cause a render, which is exactly why it
          suits values the screen does not show directly.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'A custom hook is a function named useSomething that calls other hooks.',
          'It shares logic, not state: every caller gets its own.',
          'The Rules of Hooks apply inside it. ESLint checks it because of the use prefix.',
          'Return a value, a typed tuple, or an object. Use generics when it works for any type.',
          'useDebouncedValue: an effect with a timer and a cleanup. The final project search needs it.',
        ]}
      />
    </Deck>
  );
}
