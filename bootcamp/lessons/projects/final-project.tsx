// The final project, introduced as slides. The full brief is final-project/README.md.
import { Code, Deck, Slide, TitleSlide, type DeckMeta, type LessonProps } from '../kit';

export const meta: DeckMeta = {
  id: 'final-project',
  title: 'Final project: migrate, fix and extend the ticket app',
  time: 'about 4.5 h · project',
  subtitle: "A teammate's React app: move it to TypeScript, fix what breaks the Rules of React, make it fast, and add one feature.",
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['After Phase 3 and the Phase 2 project', 'Runs on your own Phase 2 code']} />

      <Slide
        title="What you build"
        eyebrow="The project"
        lead="A ticket tracker in React and antd that mostly works. Users report odd behaviour, and it lags with many tickets. This is the kind of ticket you will get in your first weeks."
      >
        <table className="k-table">
          <tbody>
            <tr>
              <td>
                <strong>Migrate</strong>
              </td>
              <td>Every file to strict TypeScript, with antd&apos;s types (Phase 2, module 03-react/06).</td>
            </tr>
            <tr>
              <td>
                <strong>Fix</strong>
              </td>
              <td>Six bugs that break the Rules of React, and three performance problems (modules 02, 03, 07).</td>
            </tr>
            <tr>
              <td>
                <strong>Extend</strong>
              </td>
              <td>An assignee filter that is kept in the URL (module 08).</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          The app imports your Phase 2 project as <code>@tickets/logic</code>. Its filters, sorting and stats are the ones you wrote.
        </div>
      </Slide>

      <Slide title="Definition of Done" eyebrow="The project" lead="You are done when a user can do all of this in the browser:">
        <ul style={{ fontSize: 22 }}>
          <li>See the tickets, a loading state, and an error with a Retry button when the server is down.</li>
          <li>Sort, page, and filter by status and priority. The search filters only after they stop typing.</li>
          <li>Filter by assignee, and keep that filter after a refresh or in a shared link.</li>
          <li>Create and edit a ticket in a validated form; the table updates without a refresh.</li>
          <li>Go back and forward between pages, and type in the search without lag, even with 2000 tickets.</li>
        </ul>
        <div className="k-note">
          And: every file is <code>.ts</code> or <code>.tsx</code>, strict TypeScript and ESLint pass, with no <code>any</code> and no
          disabled rules.
        </div>
      </Slide>

      <Slide title="How to run it" eyebrow="The project" lead="Two terminals again. This time your code runs in the browser, and the page reloads each time you save.">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Terminal 1: the API</div>
            <Code small lang="text" code={`python server/server.py\n\n--delay 1500    the loading state\n--fail tickets  the error state\n--many 2000     is the search slow?`} />
          </div>
          <div>
            <div className="k-col-label">Terminal 2: the app</div>
            <Code small lang="text" code={`yarn dev final-project\n\nthen open\nhttp://localhost:5173`} />
          </div>
        </div>
        <div className="k-note">Try each server mood before you change any code, and write down what looks wrong.</div>
      </Slide>

      <Slide
        title="How to test it"
        eyebrow="The project"
        lead="yarn verify runs thirteen steps. The bug steps drive the real app in a test browser and report what a user would see."
      >
        <table className="k-table">
          <tbody>
            <tr>
              <td className="mono">1 to 3</td>
              <td>All TypeScript, tsc strict passes, ESLint with the React Hooks rules passes</td>
            </tr>
            <tr>
              <td className="mono">4 to 9</td>
              <td>One Rules of React bug each</td>
            </tr>
            <tr>
              <td className="mono">10 to 12</td>
              <td>One performance problem each, measured while typing in the search</td>
            </tr>
            <tr>
              <td className="mono">13</td>
              <td>
                The new feature: <code>?assignee=a3</code>
              </td>
            </tr>
          </tbody>
        </table>
        <Code small lang="text" code={`yarn verify final-project      every step\nyarn verify final-project/7    only step 7`} />
      </Slide>

      <Slide title="What to expect" eyebrow="The project" lead="The app starts and looks finished. The problems show up when you use it, and yarn verify names each one as a symptom:">
        <Code
          small
          lang="text"
          code={`✗  4  Bug: sorting must not change the cached tickets
       The tickets in the React Query cache changed order.
✗  7  Bug: Previous / Next shows the right ticket in the form
       After going from t1 to t2, the form shows t1's title
✗ 11  Performance: the list is not filtered again on every render
       While typing 5 letters, the list was filtered 5 times

0 of 13 core steps pass. Next: step 1`}
        />
        <div className="k-note">
          Bug steps work on <code>.jsx</code> and <code>.tsx</code> alike: fix them before, during or after the migration.
        </div>
      </Slide>

      <Slide title="Start here" eyebrow="The project" lead="The README has all of this in full, with the antd types you will need for the migration.">
        <ol>
          <li>
            Open <code>final-project/README.md</code>.
          </li>
          <li>Run the app with each server mood. Note what looks wrong.</li>
          <li>
            Run <code>yarn verify final-project</code> and match each failing step to what you saw.
          </li>
          <li>
            Migrate one file at a time: <code>api/</code>, then <code>components/</code>, then <code>pages/</code>.
          </li>
        </ol>
        <div className="k-note">
          About 4.5 hours. At the end, walk your mentor through one bug: what the user saw, why, and which rule it broke.
        </div>
      </Slide>
    </Deck>
  );
}
