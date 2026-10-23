import { Code, Deck, PredictSlide, RecapSlide, Slide, TitleSlide, type DeckMeta, type LessonProps } from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '03-react/09',
  title: 'Versions and tooling: React 16 / 18 / 19, CRA and Vite',
  time: '10 min lesson · 30 min exercises',
  subtitle: "You learned today's React. The team's older apps differ in a few places. Learn to spot them.",
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['React 16, 18 and 19 side by side', 'Create React App and Vite side by side']} />

      <Slide title="Which React is this app on?" eyebrow="30-second check">
        <ol>
          <li>
            <code>package.json</code>: <code>&quot;react&quot;: &quot;^16.14.0&quot;</code>. Same rules as antd (module 06):
            the first number is the major version.
          </li>
          <li>The entry file, usually <code>src/index.js</code> or <code>src/main.tsx</code>: how does it start the app?</li>
          <li>
            Hooks arrived in React 16.8. Older code uses class components; the team&apos;s apps have none, so you will not need
            them.
          </li>
        </ol>
      </Slide>

      <Slide title="Starting the app: render versus createRoot" eyebrow="Entry point">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">React 16 and 17</div>
            <Code
              lang="tsx"
              small
              code={`
import ReactDOM from 'react-dom';

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);`}
            />
          </div>
          <div>
            <div className="k-col-label">React 18 and 19</div>
            <Code
              lang="tsx"
              small
              code={`
import { createRoot }
  from 'react-dom/client';
const root = createRoot(
  document.getElementById('root')!,
);
root.render(<App />);`}
            />
          </div>
        </div>
        <div className="k-note">
          On React 18, <code>ReactDOM.render</code> still works but runs the app as React 17 would, with a console warning. React
          19 removed it.
        </div>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
async function save() {
  const saved = await api.save(ticket);
  setSaving(false);
  setMessage('Saved ' + saved.id);
}`}
        question="After the await, how many renders do the two setters cause on React 17? On React 18?"
        answer="React 17: two. React 18: one."
        explanation={
          <>
            React 17 batched only inside its own event handlers. After an <code>await</code> or in a <code>setTimeout</code>,
            each setter rendered at once. React 18 batches everywhere (&ldquo;automatic batching&rdquo;), but only with{' '}
            <code>createRoot</code>.
          </>
        }
      />

      <Slide title="React 19: what changed" eyebrow="React 19">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Removed</div>
            <ul>
              <li>
                <code>ReactDOM.render</code>, <code>hydrate</code>, <code>unmountComponentAtNode</code>
              </li>
              <li>
                <code>defaultProps</code> on function components: use a default when destructuring
              </li>
              <li>
                <code>propTypes</code> checks: TypeScript does that job
              </li>
            </ul>
          </div>
          <div>
            <div className="k-col-label">New, and optional</div>
            <ul>
              <li>
                <code>ref</code> is a normal prop; <code>forwardRef</code> still works
              </li>
              <li>
                Actions: <code>useActionState</code>, <code>useFormStatus</code> for forms
              </li>
              <li>
                <code>use(promise)</code> to read async data while rendering
              </li>
            </ul>
          </div>
        </div>
        <div className="k-note">
          Everything in this bootcamp works the same on 18 and 19. The Rules of React did not change.
        </div>
      </Slide>

      <Slide title="Create React App and Vite" eyebrow="Tooling">
        <table className="k-table">
          <thead>
            <tr>
              <th></th>
              <th>Create React App</th>
              <th>Vite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Scripts</td>
              <td className="mono">react-scripts start / build</td>
              <td className="mono">vite / vite build</td>
            </tr>
            <tr>
              <td>index.html</td>
              <td className="mono">public/index.html</td>
              <td className="mono">index.html, at the root</td>
            </tr>
            <tr>
              <td>Env variables</td>
              <td className="mono">process.env.REACT_APP_X</td>
              <td className="mono">import.meta.env.VITE_X</td>
            </tr>
            <tr>
              <td>API proxy</td>
              <td className="mono">&quot;proxy&quot; in package.json</td>
              <td className="mono">server.proxy in vite.config.ts</td>
            </tr>
            <tr>
              <td>yarn build writes</td>
              <td className="mono">build/</td>
              <td className="mono">dist/</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          CRA has been deprecated since 2025, so new apps use Vite. A CRA app can also proxy from <code>src/setupProxy.js</code>.
        </div>
      </Slide>

      <PredictSlide
        lang="ts"
        code={`
// .env in a Vite app
API_URL=http://localhost:8000

// src/api/client.ts
const baseURL = import.meta.env.API_URL;`}
        question="What is baseURL?"
        answer="undefined"
        explanation={
          <>
            Vite only gives the browser code variables that start with <code>VITE_</code>, and CRA only those that start with{' '}
            <code>REACT_APP_</code>. The prefix keeps the rest of your machine&apos;s environment out of the page.
          </>
        }
      />

      <Slide title="What yarn build makes" eyebrow="Builds">
        <Code
          lang="text"
          lineNumbers={false}
          code={`
dist/
  index.html
  assets/
    index-B4x9kq2D.js     your code and every library, in one file
    index-Cq81Lm0a.css`}
        />
        <ul>
          <li>Static files: any web server can serve them. No Node is running when a user opens the page.</li>
          <li>
            So env variables are copied into the JavaScript at build time. Change <code>.env</code>, and you must build again.
          </li>
          <li>Anyone can read those files in DevTools. Never put a secret in a front-end env variable.</li>
        </ul>
      </Slide>

      <RecapSlide
        points={[
          'package.json gives the React version. ReactDOM.render: 16 or 17. createRoot: 18 or 19.',
          'React 18 batches state updates everywhere; React 17 only inside its event handlers.',
          'React 19 removed defaultProps on function components and propTypes checks; forwardRef still works.',
          'CRA: REACT_APP_, "proxy" in package.json, build/. Vite: VITE_, vite.config.ts, dist/.',
          'A build is static files with env variables baked in. No secrets in the front end.',
        ]}
        next="Next: the final project. Read its README first."
      />
    </Deck>
  );
}
