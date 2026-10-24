import {
  Code,
  Deck,
  PredictSlide,
  RecapSlide,
  Reveal,
  Slide,
  TitleSlide,
  type DeckMeta,
  type LessonProps,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '02-ts/08',
  title: 'Migrating JavaScript to TypeScript',
  time: '10 min lesson · 20 min exercises',
  subtitle: 'From working JavaScript to strict TypeScript in small, safe steps, without ever switching the checker off.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: like adding mypy to an old codebase, one module at a time']} />

      <Slide title="The ladder" lead={<>Migrating a file is five small steps. After each one the code still runs, so you can stop at any point and ship.</>} eyebrow="The workflow" steps={4}>
        <ol>
          <li>
            <code>// @ts-check</code> on the <code>.js</code> file: loose checking, finds real bugs.
          </li>
          <Reveal at={1}>
            <li>
              Rename to <code>.ts</code>. The code still runs exactly as before.
            </li>
          </Reveal>
          <Reveal at={2}>
            <li>Strict mode asks for types: type the parameters, import shared types.</li>
          </Reveal>
          <Reveal at={3}>
            <li>
              Remove every shortcut: <code>any</code>, <code>as</code>, <code>!</code>, <code>@ts-ignore</code>.
            </li>
          </Reveal>
          <Reveal at={4}>
            <li>Check data at the edges: API answers become unknown and go through a guard.</li>
          </Reveal>
        </ol>
      </Slide>

      <PredictSlide
        title="What does @ts-check find?" lead={<>The first step only adds one comment. Here is the kind of bug it finds in old JavaScript.</>}
        question="Python habits die hard. What is wrong here? Decide before you press →"
        code={`// @ts-check\nexport function averageWeight(tickets) {\n  const total = tickets.reduce((sum, t) => sum + weight(t), 0);\n  return Math.round(total / tickets.length, 1);\n}`}
        answer="Expected 1 arguments, but got 2"
        surprising
        explanation={
          <>
            <code>Math.round</code> takes one number and always rounds to a whole number. The <code>1</code> was silently ignored for
            years. For one decimal: <code>Math.round(x * 10) / 10</code>.
          </>
        }
      />

      <Slide title="allowJs, checkJs and strict" lead={<>Four settings in tsconfig.json decide how much TypeScript checks while a project is half migrated.</>} eyebrow="The knobs in tsconfig.json">
        <table className="k-table">
          <tbody>
            <tr>
              <td className="mono">allowJs</td>
              <td>.js and .ts files can import each other while you migrate</td>
            </tr>
            <tr>
              <td className="mono">checkJs</td>
              <td>check every .js file, like // @ts-check on all of them</td>
            </tr>
            <tr>
              <td className="mono">strict</td>
              <td>the full set: no implicit any, strict null checks, and more</td>
            </tr>
            <tr>
              <td className="mono">noImplicitAny</td>
              <td>one piece of strict: every parameter needs a type</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          A big project raises these one at a time. Your bootcamp files are small, so they go straight to strict.
        </div>
      </Slide>

      <Slide title="Typing a migrated file" lead={<>After the rename, strict mode asks you to type each parameter. Shared types come in through imports.</>} eyebrow="Step 3">
        <Code
          lang="ts"
          small
          code={`import type { AxiosInstance } from 'axios';\nimport { isTicket, type Ticket } from './types.ts';\n\nexport function reportLines(tickets: readonly Ticket[], today: string): string[] {\n  ...\n}`}
        />
        <div className="k-note">
          <code>import type</code> (or <code>{'{ type X }'}</code>) imports only a type; it disappears when types are deleted. Our
          tsconfig requires it for types, so Node and Vite never look for a value that does not exist.
        </div>
      </Slide>

      <Slide title="Four ways to switch the checker off" lead={<>When the red underlines pile up, these four look like quick fixes. Each one hides the problem instead.</>} eyebrow="Do not" steps={1}>
        <Code
          lang="ts"
          small
          code={`function weight(ticket: any) { ... }               // any: anything goes\nconst t = data as Ticket;                          // as: "trust me"\nconst due = ticket.dueDate!.slice(0, 4);           // !: "it is not null, trust me"\n// @ts-ignore                                      // ignore the next error`}
        />
        <Reveal at={1}>
          <div className="k-note backpack">
            Each one makes the red underline disappear and keeps the bug. The checker for your project rejects all four; answer
            the question with a type, a check or a guard.
          </div>
        </Reveal>
      </Slide>

      <Slide title="The edge: axios data is any" lead={<>The last step is where data comes into your code. Ask axios for unknown, then check it with a guard.</>} eyebrow="Step 5">
        <Code
          lang="ts"
          code={`const response = await client.get<unknown>('/tickets');\nconst data = Array.isArray(response.data) ? response.data : [];\nconst tickets = data.filter(isTicket);   // Ticket[], checked`}
        />
        <div className="k-note">
          Without the <code>{'<unknown>'}</code>, <code>response.data</code> is <code>any</code> and flows everywhere unchecked.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'Migrate in small steps; the code keeps working after each one.',
          '// @ts-check on a .js file finds real bugs before any renaming.',
          'Rename to .ts, then type parameters and import shared types with import type.',
          'No any, as, ! or @ts-ignore: each hides a question.',
          'API data enters as unknown and goes through a type guard.',
        ]}
        next={
          <>
            Next: this module&apos;s exercises (<code>yarn verify 02-ts/08</code>). Then Phase 2 ends with its project: open the lesson{' '}
            <a href="#/02-ts/project">02-ts/project</a> for what you build, how to run and test it, and what to expect.
          </>
        }
      />
    </Deck>
  );
}
