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
  id: '01-js/05',
  title: 'Modules',
  time: '25 min lesson · 35 min exercises',
  subtitle: 'One file, one module: export what others may use, import it with a path, and split a big file into small ones.',
};

const loadOrder: Message[] = [
  { from: 'main', to: 'index', label: 'import', note: 'main.js starts. Before any of its code runs, JavaScript follows its imports.' },
  { from: 'index', to: 'prio', label: 'import', note: 'index.js imports priorities.js first, so that file is loaded next.' },
  {
    from: 'prio',
    to: 'index',
    label: 'runs once',
    reply: true,
    note: 'priorities.js has no imports, so its code runs now, top to bottom. Its exports are ready.',
  },
  { from: 'index', to: 'format', label: 'import', note: 'Next import in index.js: format.js.' },
  {
    from: 'format',
    to: 'prio',
    label: 'import',
    note: 'format.js also imports priorities.js. It already ran, so JavaScript hands back the same module. It never runs twice.',
  },
  { from: 'format', to: 'index', label: 'runs once', reply: true, note: 'Now format.js runs. Then index.js, then finally main.js.' },
  {
    from: 'index',
    to: 'main',
    label: 'ready',
    reply: true,
    note: 'Python does the same: a module runs on its first import and is cached (sys.modules). Every importer shares one copy.',
  },
];

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: a file is a module, like a .py file']} />

      <CompareSlide
        title="Importing, side by side"
        python={`# stats.py\ndef compute(tickets): ...\n_helper = 1   # private by convention only\n\n# main.py\nfrom stats import compute\nimport stats`}
        js={`// stats.js\nexport function compute(tickets) {}\nconst helper = 1; // not exported\n\n// main.js\nimport { compute } from './stats.js';\nimport * as stats from './stats.js';`}
        note={
          <>
            In JavaScript nothing leaves a file unless you write <code>export</code>. Importing a name that was not exported
            gives an error, not a quiet <code>undefined</code>.
          </>
        }
      />

      <Slide title="Paths, not package names" eyebrow="Rules" steps={1}>
        <Code
          code={`import { compute } from './stats.js';      // same folder\nimport { STATUSES } from '../constants.js'; // one folder up\nimport axios from 'axios';                   // a package in node_modules`}
        />
        <ul>
          <li>
            Your own files start with <code>./</code> or <code>../</code>. A bare name like <code>'axios'</code> means a
            package.
          </li>
          <li>
            Write the whole file name, <code>.js</code> included. Vite lets you leave it out; Node does not, and the error is
            confusing.
          </li>
        </ul>
        <Reveal at={1}>
          <div className="k-note">
            No <code>__init__.py</code>, no <code>sys.path</code>. The path in the import is exactly where the file is.
          </div>
        </Reveal>
      </Slide>

      <Slide title="Named or default" eyebrow="Two kinds of export">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Named: many per file</div>
            <Code
              small
              code={`// priorities.js\nexport const PRIORITIES = [...];\nexport function comparePriority(a, b) {}\n\n// elsewhere: same names, in braces\nimport { PRIORITIES, comparePriority }\n  from './priorities.js';`}
            />
          </div>
          <div>
            <div className="k-col-label">Default: at most one per file</div>
            <Code
              small
              code={`// format.js\nexport default function formatTicket(t) {}\n\n\n\n// elsewhere: no braces, any name\nimport formatTicket from './format.js';`}
            />
          </div>
        </div>
        <div className="k-note">
          Prefer named exports: the name is checked and your editor can find every use. React components are often default
          exports, so you will see both.
        </div>
      </Slide>

      <SequenceSlide
        title="A module runs once"
        eyebrow="Walkthrough · press → to step"
        actors={[
          { id: 'main', label: 'main.js', detail: 'the entry' },
          { id: 'index', label: 'index.js' },
          { id: 'prio', label: 'priorities.js' },
          { id: 'format', label: 'format.js' },
        ]}
        messages={loadOrder}
      />

      <PredictSlide
        title="Imports are live"
        code={`// counter.js\nexport let count = 0;\nexport function increment() { count += 1; }\n// main.js\nimport { count, increment } from './counter.js';\nincrement();\nconsole.log(count);`}
        answer="1"
        surprising
        explanation={
          <>
            An import is a live link to the other module&apos;s variable, not a copy. Python&apos;s{' '}
            <code>from counter import count</code> copies the value and would print 0.
          </>
        }
      />

      <Slide title="One front door: index.js" eyebrow="Pattern">
        <p>Collect a folder&apos;s public names in one file. The rest of the code imports from there and does not care how the folder is split.</p>
        <Code
          small
          code={`// index.js: re-export without importing first\nexport { PRIORITIES, comparePriority } from './priorities.js';\nexport { default as formatTicket } from './format.js';\nexport * from './dates.js';\n\n// anywhere else\nimport { formatTicket, isOverdue } from './index.js';`}
        />
        <div className="k-note">
          Like the imports in a Python package&apos;s <code>__init__.py</code>. Your Phase 1 project uses exactly this layout.
        </div>
      </Slide>

      <Slide title="Splitting a file" eyebrow="The everyday move" steps={2}>
        <ol>
          <li>Create the new file and move the function into it, unchanged.</li>
          <li>
            Put <code>export</code> in front of it.
          </li>
          <li>
            In the old file, <code>import</code> it from the new one.
          </li>
        </ol>
        <Reveal at={1}>
          <Code small code={`// dates.js\nexport function isOverdue(ticket, now) { ... }\n\n// tickets.js\nimport { isOverdue } from './dates.js';`} />
        </Reveal>
        <Reveal at={2}>
          <div className="k-note">
            Two files that import each other (a cycle) can see a name before it is ready. If that happens, move the shared code
            to a third file.
          </div>
        </Reveal>
      </Slide>

      <Slide title="import() loads on demand" eyebrow="Reference">
        <Code
          small
          code={`// at the top of a file: loaded before the file runs\nimport formatTicket from './format.js';\n\n// inside a function: loaded when this line runs, returns a promise\nasync function showReport() {\n  const module = await import('./format.js');\n  const formatTicket = module.default;\n}`}
        />
        <div className="k-note">
          Normal imports go at the top of the file only, never inside an <code>if</code>. React uses <code>import()</code> to load
          a page only when the user opens it.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'One file is one module. Only exported names can be imported.',
          "Import your own files with a path: './name.js', with the .js.",
          'Named exports use braces and the exact name. A default export has no braces and any name.',
          'A module runs once, on its first import. Every importer shares it, and imports are live.',
          'index.js can re-export a folder’s public names: one front door.',
        ]}
      />
    </Deck>
  );
}
