import {
  Code,
  CompareSlide,
  Deck,
  PredictSlide,
  RecapSlide,
  Reveal,
  SequenceSlide,
  Slide,
  TitleSlide,
  type DeckMeta,
  type LessonProps,
  type Message,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '02-ts/01',
  title: 'Why TypeScript, and how it runs',
  time: '10 min lesson · 20 min exercises',
  subtitle: 'JavaScript with type annotations that are checked while you write and deleted before the code runs.',
};

const flow: Message[] = [
  { from: 'you', to: 'tsc', label: 'every keystroke', note: 'VS Code runs the TypeScript checker as you type. Errors become red underlines.' },
  { from: 'tsc', to: 'you', label: 'red underlines', reply: true, note: 'The checker only reports. It never changes or runs your code.' },
  { from: 'you', to: 'vite', label: 'save', note: 'Vite (in the browser app) or Node (for scripts) takes the .ts file as it is.' },
  {
    from: 'vite',
    to: 'run',
    label: 'types deleted',
    note: 'It deletes the type annotations and runs what is left: plain JavaScript. It does not check anything, so code with type errors still runs.',
  },
];

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: type hints plus mypy, always on']} />

      <CompareSlide
        title="Type hints, side by side"
        python={`def days_open(created_at: str,\n              now: datetime) -> int:\n    ...\n\ntitles: list[str] = []\ndue: str | None = None`}
        js={`function daysOpen(createdAt: string,\n                   now: Date): number {\n  ...\n}\nconst titles: string[] = [];\nlet due: string | null = null;`}
        jsLang="ts"
        note={
          <>
            Same idea, same place: after the name, with a colon. The difference is that in TypeScript the checker is part of the
            daily workflow, not an optional extra like mypy.
          </>
        }
      />

      <Slide title="What it catches before you run anything" eyebrow="Why bother">
        <Code
          lang="ts"
          small
          code={`ticket.titel.toUpperCase();\n// Property 'titel' does not exist. Did you mean 'title'?\n\nconst found = tickets.find((t) => t.id === id);\nfound.title;\n// 'found' is possibly 'undefined'.\n\nformatDate(ticket.dueDate);\n// Argument of type 'string | null' is not assignable to 'string'.`}
        />
        <div className="k-note">
          Each one is a bug that would otherwise show up in the browser, maybe only for some tickets. You fix all three in the
          exercises.
        </div>
      </Slide>

      <Slide title="Types disappear when the code runs" eyebrow="Mental model">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">What you write (.ts)</div>
            <Code lang="ts" small code={`function age(t: Ticket, now: Date): number {\n  const ms: number = now.getTime();\n  return ms;\n}`} />
          </div>
          <div>
            <div className="k-col-label">What runs (JavaScript)</div>
            <Code small code={`function age(t, now) {\n  const ms = now.getTime();\n  return ms;\n}`} />
          </div>
        </div>
        <div className="k-note">
          Types are only for the checker. At run time there are no types, so nothing stops a wrong value: the check happens in
          your editor, not in the program.
        </div>
      </Slide>

      <SequenceSlide
        title="Who checks, who runs"
        eyebrow="Walkthrough · press → to step"
        actors={[
          { id: 'you', label: 'You', detail: 'VS Code' },
          { id: 'tsc', label: 'TypeScript', detail: 'the checker' },
          { id: 'vite', label: 'Vite or Node', detail: 'strips types' },
          { id: 'run', label: 'Browser or Node', detail: 'runs JS' },
        ]}
        messages={flow}
      />

      <PredictSlide
        lang="ts"
        code={`const estimates: number[] = JSON.parse('[3, 4, "5"]');\nconst total = estimates.reduce((sum, n) => sum + n, 0);\nconsole.log(total);`}
        answer="'75', with no error at all"
        surprising
        explanation={
          <>
            JSON.parse returns <code>any</code>, so TypeScript believes the annotation. At run time 3 + 4 is 7, then 7 + &apos;5&apos; joins
            text. Data from outside (an API, JSON, a form) must be checked by code: that is module 04.
          </>
        }
      />

      <Slide title="tsc and Vite have different jobs" eyebrow="Reference">
        <table className="k-table">
          <thead>
            <tr>
              <th></th>
              <th>Checks types</th>
              <th>Runs or builds the code</th>
              <th>Python cousin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">tsc --noEmit</td>
              <td>yes</td>
              <td>no</td>
              <td className="mono">mypy</td>
            </tr>
            <tr>
              <td>VS Code</td>
              <td>yes, as you type</td>
              <td>no</td>
              <td>Pylance</td>
            </tr>
            <tr>
              <td>Vite, Node</td>
              <td>no</td>
              <td>yes: deletes types, then runs</td>
              <td className="mono">python</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          So a page can load in the browser while the project has type errors. Your team&apos;s CI runs <code>tsc --noEmit</code>{' '}
          to stop them from being merged.
        </div>
      </Slide>

      <Slide title="You write fewer types than you think" eyebrow="Inference" steps={1}>
        <Code
          lang="ts"
          code={`const count = 3;                         // number\nconst titles = tickets.map((t) => t.title); // string[]\n\nfunction isUrgent(t: Ticket) {           // parameters: always typed\n  return t.priority === 'urgent';        // result: boolean, inferred\n}`}
        />
        <Reveal at={1}>
          <div className="k-note">
            Type the parameters of every function and let TypeScript infer the rest. Hover any name in VS Code to see what it
            inferred.
          </div>
        </Reveal>
      </Slide>

      <Slide title="Strict mode is on" eyebrow="The settings you work with">
        <ul>
          <li>
            <strong>No implicit any:</strong> a parameter without a type is an error, not a silent &ldquo;anything&rdquo;.
          </li>
          <li>
            <strong>Strict null checks:</strong> <code>null</code> and <code>undefined</code> are only allowed where the type says
            so, and you must check before using a value that may be missing.
          </li>
          <li>
            Both are switched on by <code>&quot;strict&quot;: true</code> in <code>tsconfig.json</code>, as in your team&apos;s apps.
          </li>
        </ul>
      </Slide>

      <RecapSlide
        points={[
          'TypeScript is JavaScript plus type annotations, written like Python type hints.',
          'The checker runs in your editor and in tsc. It only reports; it never runs code.',
          'Vite and Node delete the types and run plain JavaScript, even when there are type errors.',
          'Type every function parameter; let inference do the rest.',
          'Data from outside is not checked by types. You will write that check in module 04.',
        ]}
      />
    </Deck>
  );
}
