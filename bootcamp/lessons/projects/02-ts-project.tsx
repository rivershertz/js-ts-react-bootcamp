// The Phase 2 project, introduced as slides. The full brief is 02-ts/project/README.md.
import { Code, Deck, Slide, TitleSlide, type DeckMeta, type LessonProps } from '../kit';

export const meta: DeckMeta = {
  id: '02-ts/project',
  title: 'Phase 2 project: the same logic, in strict TypeScript',
  time: 'about 2 to 2.5 h · project',
  subtitle: 'Migrate your own Phase 1 code to strict TypeScript, check what the API sends, and give every ticket state its own type.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['After the Phase 1 project and modules 02-ts/01 to 02-ts/08']} />

      <Slide
        title="What you build"
        eyebrow="The project"
        lead="Your Phase 1 code, copied and renamed to .ts, until strict TypeScript has no more questions. For the user nothing changes: yarn tickets prints the same thing."
      >
        <ul>
          <li>Statuses and priorities written once, with their types derived from them (module 07).</li>
          <li>A ticket type with one member per status, and an exhaustive switch over it (module 05).</li>
          <li>The API&apos;s answer treated as unknown and checked by a type guard, so a bad ticket is reported, not trusted (module 04).</li>
          <li>
            No shortcuts: no <code>any</code>, <code>as</code>, <code>!</code> or <code>@ts-ignore</code> (module 08).
          </li>
        </ul>
        <div className="k-note">The final project&apos;s React app imports this code, so keep every function name exactly as it is.</div>
      </Slide>

      <Slide title="Definition of Done" eyebrow="The project" lead="You are done when all of this is true:">
        <ul style={{ fontSize: 23 }}>
          <li>
            Every file is <code>.ts</code>, and strict TypeScript finds no errors in it.
          </li>
          <li>
            <code>STATUSES</code> and <code>PRIORITIES</code> are <code>as const</code>, and <code>Status</code> and <code>Priority</code>{' '}
            come from them.
          </li>
          <li>
            <code>Ticket</code> is a discriminated union on <code>status</code>, and every switch on it ends in a{' '}
            <code>never</code> check.
          </li>
          <li>
            API data arrives as <code>unknown</code> and goes through <code>isTicket</code>. A bad ticket is named in a warning.
          </li>
          <li>Everything Phase 1 checked still passes.</li>
        </ul>
      </Slide>

      <Slide title="How to run it" eyebrow="The project" lead="The same two terminals as Phase 1. One new command, once, to start.">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Terminal 1: the API</div>
            <Code small lang="text" code={`python server/server.py\n\n# to see a bad ticket:\npython server/server.py --bad-data`} />
          </div>
          <div>
            <div className="k-col-label">Terminal 2: your code</div>
            <Code small lang="text" code={`yarn copy-project    once, to start\nyarn tickets         as often as you like`} />
          </div>
        </div>
        <div className="k-note">
          <code>yarn copy-project</code> copies your Phase 1 <code>src</code> folder. Once <code>index.ts</code> exists,{' '}
          <code>yarn tickets</code> runs your TypeScript version and says so on its first line.
        </div>
      </Slide>

      <Slide title="How to test it" eyebrow="The project" lead="yarn verify runs nine steps. The type checker is one of them, and VS Code shows the same errors as you type.">
        <Code small lang="text" code={`yarn verify 02-ts/project      every step\nyarn verify 02-ts/project/2    only the type check`} />
        <ul style={{ fontSize: 23, marginTop: 18 }}>
          <li>Step 2 runs the TypeScript checker on your project only.</li>
          <li>Step 8 runs the Phase 1 checks again, on your TypeScript code.</li>
        </ul>
      </Slide>

      <Slide title="What to expect" eyebrow="The project" lead="After the renames, expect a screen full of red underlines. That is the work. When you are done:">
        <Code
          small
          lang="text"
          code={`Using 02-ts/project/src/index.ts (TypeScript)

Loading tickets and assignees (loadAll)
  40 tickets, 6 assignees
  Warning: Skipped 1 malformed ticket(s): t-bad     (with --bad-data)

One ticket per status (statusLabel)
  t2     Assigned to a1
  t3     Blocked: Waiting for design`}
        />
      </Slide>

      <Slide title="Start here" eyebrow="The project" lead="The README has the order to work in, and fixes for the TypeScript errors you are most likely to hit.">
        <ol>
          <li>
            Open <code>02-ts/project/README.md</code>.
          </li>
          <li>
            Run <code>yarn copy-project</code>, then rename every file to <code>.ts</code>.
          </li>
          <li>Fix one file at a time, in the README&apos;s order. Run yarn tickets and yarn verify after each.</li>
        </ol>
        <div className="k-note">About 2 to 2.5 hours. Stuck for 20 minutes on one error? Ask your mentor.</div>
      </Slide>
    </Deck>
  );
}
