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
} from '../lessons/kit';

export const meta: DeckMeta = {
  id: '00-setup',
  title: 'Setup and tools',
  time: '20 min lesson',
  subtitle: 'What each tool does, and what happens between your browser, Vite and the Python API.',
};

const tools: [string, string, string][] = [
  ['Node', 'Runs JavaScript outside the browser', 'python'],
  ['Yarn', 'Installs packages, runs scripts', 'pip'],
  ['package.json', 'Dependencies and script names', 'requirements.txt + pyproject'],
  ['node_modules/', 'Installed packages, per project', 'a virtualenv’s site-packages'],
  ['Vite', 'Dev server: serves and transforms your code', 'flask run --reload'],
  ['TypeScript (tsc)', 'Type checker', 'mypy'],
  ['ESLint', 'Finds bugs and bad patterns', 'ruff / flake8'],
  ['Prettier', 'Formats code', 'black'],
];

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: a map of familiar tools']} />

      <Slide title="Where frontend code runs" lead={<>The biggest change from backend work: your code leaves the server and runs on someone else's computer.</>} eyebrow="Mental model" steps={2}>
        <ul>
          <li>Your Python code runs on a server. It answers requests with data.</li>
          <Reveal at={1}>
            <li>
              Frontend code is <strong>downloaded by the browser and runs there</strong>, on the user’s machine. It asks the
              server for data and draws the page.
            </li>
          </Reveal>
          <Reveal at={2}>
            <li>
              So a bug in the frontend shows up in the <strong>browser’s</strong> console, not in your server’s terminal.
            </li>
          </Reveal>
        </ul>
      </Slide>

      <Slide title="Your tools, mapped to Python" lead={<>Each tool has a Python cousin you already know. You run all of them through yarn.</>} eyebrow="Coming from Python">
        <table className="k-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>What it does</th>
              <th>Closest Python thing</th>
            </tr>
          </thead>
          <tbody>
            {tools.map(([tool, does, py]) => (
              <tr key={tool}>
                <td className="mono">{tool}</td>
                <td>{does}</td>
                <td className="k-muted">{py}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Slide>

      <CompareSlide
        title="package.json is requirements and scripts in one" lead={<>One file lists the packages a project needs and names the commands you run on it.</>}
        python={`# requirements.txt\nrequests==2.32.3\n\n# you run things by hand\npython manage.py test`}
        jsLang="json"
        js={`{\n  "scripts": {\n    "verify": "node scripts/verify.mjs"\n  },\n  "dependencies": {\n    "axios": "1.20.0"\n  }\n}`}
        note={
          <>
            <code>yarn verify</code> runs the <code>verify</code> script. <code>yarn.lock</code> pins the exact version of every
            package, including the ones your packages depend on.
          </>
        }
      />

      <SequenceSlide
        title="What happens when you open the app" lead={<>Press → to follow one page load from the browser, through Vite, to the Python API and back.</>}
        eyebrow="Walkthrough · press → to step"
        actors={[
          { id: 'browser', label: 'Browser', detail: 'localhost:5173' },
          { id: 'vite', label: 'Vite dev server', detail: 'yarn dev' },
          { id: 'api', label: 'Python API', detail: 'localhost:8000' },
        ]}
        messages={[
          { from: 'browser', to: 'vite', label: 'GET /', note: 'You open http://localhost:5173. The browser asks the Vite dev server for the page.' },
          { from: 'vite', to: 'browser', label: 'index.html', reply: true, note: 'Vite sends a nearly empty HTML page with one <script> tag.' },
          {
            from: 'browser',
            to: 'vite',
            label: 'GET /src/main.tsx',
            note: 'The browser asks for the script. Browsers cannot run TypeScript or JSX, so Vite converts the file to plain JavaScript as it sends it.',
          },
          { from: 'vite', to: 'browser', label: 'JavaScript', reply: true, note: 'Your code now runs in the browser. React draws the page.' },
          {
            from: 'browser',
            to: 'vite',
            label: 'GET /api/tickets',
            note: 'Your code asks for /api/tickets. It asks the same server the page came from: Vite.',
          },
          {
            from: 'vite',
            to: 'api',
            label: 'GET /api/tickets',
            note: 'Vite does not know any tickets. Its proxy rule says “anything under /api goes to localhost:8000”, so it forwards the request.',
          },
          { from: 'api', to: 'vite', label: '200 JSON', reply: true, note: 'Python answers with JSON, as you are used to.' },
          { from: 'vite', to: 'browser', label: '200 JSON', reply: true, note: 'Vite passes the answer back. The browser never talks to Python directly.' },
        ]}
      />

      <Slide title="Why a proxy?" eyebrow="Mental model">
        <p>
          A page may only call the server it came from, unless the other server opts in (CORS). The proxy makes it all look
          like one server.
        </p>
        <Code
          small
          lang="ts"
          code={`// final-project/vite.config.ts\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      '/api': 'http://localhost:8000',\n    },\n  },\n});`}
        />
        <div className="k-note" style={{ marginTop: 14 }}>
          Older Create React App (CRA) projects do this with a <code>"proxy"</code> line in <code>package.json</code>.
        </div>
      </Slide>

      <Slide title="DevTools is your debugger" lead={<>Everything the browser does with your code is visible in DevTools. Keep it open while you work.</>} eyebrow="Tools" steps={2}>
        <p>
          Press <code>F12</code> in the browser.
        </p>
        <ul>
          <li>
            <strong>Console</strong>: errors from your code, and anything you <code>console.log</code>.
          </li>
          <Reveal at={1}>
            <li>
              <strong>Sources</strong>: click a line number to set a breakpoint, or write <code>debugger;</code> in your code.
              It is Python’s <code>breakpoint()</code>.
            </li>
          </Reveal>
          <Reveal at={2}>
            <li>
              <strong>Network</strong>: every request, its status and its JSON. Restart the API with <code>--delay 1500</code> or{' '}
              <code>--fail tickets</code> and watch what changes.
            </li>
          </Reveal>
        </ul>
      </Slide>

      <Slide title="ESLint and Prettier" lead={<>Two tools that read your code without running it: one fixes how it looks, the other finds bugs.</>} eyebrow="Tools">
        <ul>
          <li>
            <strong>Prettier</strong> formats your code, like <code>black</code>. Never argue about commas again.
          </li>
          <li>
            <strong>ESLint</strong> finds mistakes before you run the code. In React it enforces the Rules of Hooks, which you will
            meet in Phase 3.
          </li>
          <li>
            In VS Code they show as red and yellow underlines. Hover to read the rule. Run them by hand with{' '}
            <code>yarn eslint &lt;folder&gt;</code>.
          </li>
        </ul>
        <div className="k-note">The final project must pass ESLint with no rules turned off.</div>
      </Slide>

      <PredictSlide
        title="Check yourself"
        lang="js"
        code={`// yarn dev final-project is running.\n// The page shows: "Could not load tickets."\n// The Network tab shows: GET /api/tickets  500\n// Vite's terminal shows: http proxy error: /api/tickets\n//                        connect ECONNREFUSED 127.0.0.1:8000`}
        question="What is the most likely cause?"
        answer="The Python API is not running"
        explanation={
          <>
            Vite is up (it served the page) but its proxy could not reach <code>localhost:8000</code>. Start the API in a second
            terminal with <code>python server/server.py</code>.
          </>
        }
      />

      <RecapSlide
        points={[
          'Frontend code runs in the browser; look for its errors in DevTools.',
          'Vite serves your code, converts TypeScript on the fly, and proxies /api to Python.',
          'Yarn installs and runs things; package.json says what and yarn.lock pins exact versions.',
          'ESLint finds bugs, Prettier formats, tsc checks types.',
        ]}
        next={
          <>
            Next: run <code>yarn verify 00-setup</code> until all four steps are green, then start <code>01-js</code>.
          </>
        }
      />
    </Deck>
  );
}
