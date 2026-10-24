// The Phase 1 project, introduced as slides. The full brief is 01-js/project/README.md.
import { Code, Deck, Slide, TitleSlide, type DeckMeta, type LessonProps } from '../kit';

export const meta: DeckMeta = {
  id: '01-js/project',
  title: 'Phase 1 project: ticket logic in JavaScript',
  time: 'about 1.5 h · project',
  subtitle: 'Everything from Phase 1 in one small program: load tickets from the API, filter, sort, count and validate them.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['After modules 01-js/01 to 01-js/05']} />

      <Slide
        title="What you build"
        eyebrow="The project"
        lead="The logic of a ticket tracker, with no UI yet. A command, yarn tickets, runs your functions against the real Python API and prints what they return."
      >
        <Code
          small
          lang="text"
          code={`src/
  constants.js    STATUSES, PRIORITIES, API_URL          (done for you)
  api.js          createClient, fetchTickets, fetchAssignees, loadAll
  filters.js      filterTickets, sortTickets
  stats.js        groupByStatus, computeStats
  validation.js   validateTicket
  index.js        re-exports everything                  (done for you)`}
        />
        <div className="k-note">
          This code goes the whole way with you: Phase 2 turns it into TypeScript, and the final project&apos;s React app runs on it.
          Keep the function names exactly as they are.
        </div>
      </Slide>

      <Slide title="Definition of Done" eyebrow="The project" lead="You are done when yarn tickets lets the user do all of this:">
        <ul style={{ fontSize: 23 }}>
          <li>See every ticket from the API, and a clear message (not a crash) when the server is down.</li>
          <li>Filter by status, priority, assignee and a search on the title. Sort by date, priority or title, both ways.</li>
          <li>See tickets grouped by status, and stats: total, open, overdue, average age.</li>
          <li>Get every error in a bad new ticket at once, not only the first.</li>
          <li>Still see the tickets when only the assignees fail to load, with a warning.</li>
        </ul>
        <div className="k-note">And no function changes the arrays or objects it is given.</div>
      </Slide>

      <Slide title="How to run it" eyebrow="The project" lead="Two terminals, both in the bootcamp folder. The API runs in one, your code in the other.">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Terminal 1: the API, leave it running</div>
            <Code small lang="text" code={`python server/server.py`} />
          </div>
          <div>
            <div className="k-col-label">Terminal 2: your code</div>
            <Code small lang="text" code={`yarn tickets\nyarn tickets --status open\nyarn tickets --sort priority --desc`} />
          </div>
        </div>
        <div className="k-note">
          Restart the API with <code>--fail assignees</code>, or stop it, to see how your code copes when the server misbehaves.
        </div>
      </Slide>

      <Slide title="How to test it" eyebrow="The project" lead="The same checker as the modules: yarn verify runs eleven steps against your files.">
        <Code small lang="text" code={`yarn verify 01-js/project      every step\nyarn verify 01-js/project/4    only step 4\nyarn progress                  every module and project`} />
        <ul style={{ fontSize: 23, marginTop: 18 }}>
          <li>A failing step says what the user would see, and gives a hint.</li>
          <li>The checker freezes everything it passes in. Changing an input fails with “Your function changed one of its inputs”.</li>
        </ul>
      </Slide>

      <Slide title="What to expect" eyebrow="The project" lead="At the start every section says “not done yet”. When you are done, the same command shows real tickets:">
        <Code
          small
          lang="text"
          code={`Loading tickets and assignees (loadAll)
  40 tickets, 6 assignees

Grouped by status (groupByStatus)
  open       13  t1 t5 t16 t19 t21 ...
  assigned   10  t2 t6 t10 t13 t15 ...

Validating a bad new ticket (validateTicket)
  valid: false
  - title: Title is required
  - priority: Priority must be one of low, medium, high, urgent`}
        />
      </Slide>

      <Slide title="Start here" eyebrow="The project" lead="The README has all of this in full, with the ticket shape and every step.">
        <ol>
          <li>
            Open <code>01-js/project/README.md</code>.
          </li>
          <li>
            Start with <code>api.js</code>, so <code>yarn tickets</code> has real data to show.
          </li>
          <li>
            Write one function, run <code>yarn tickets</code>, then <code>yarn verify 01-js/project</code>.
          </li>
        </ol>
        <div className="k-note">About 1.5 hours. Stuck for 20 minutes on one step? Ask your mentor.</div>
      </Slide>
    </Deck>
  );
}
