// The first deck: how the bootcamp works and how to read a lesson. Shown first in the lesson list.
import type { CSSProperties, ReactNode } from 'react';
import { Code, Deck, Reveal, Slide, TitleSlide, type DeckMeta, type LessonProps } from './kit';

export const meta: DeckMeta = {
  id: '00-start',
  title: 'Making the most of this bootcamp',
  time: '10 min',
  subtitle: 'What you will learn, how a module works, how to read a lesson slide, and what to do when you are stuck.',
};

/** A numbered marker on the slide picture. */
function Pin({ n, style }: { n: number; style: CSSProperties }) {
  return (
    <span
      style={{
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: 13,
        background: 'var(--backpack)',
        color: 'white',
        fontSize: 15,
        fontWeight: 700,
        display: 'grid',
        placeItems: 'center',
        ...style,
      }}
    >
      {n}
    </span>
  );
}

function Bar({ w, h = 10, color = 'var(--border)', style }: { w: number | string; h?: number; color?: string; style?: CSSProperties }) {
  return <div style={{ width: w, height: h, borderRadius: 4, background: color, ...style }} />;
}

/** A small drawing of a lesson slide, with numbered parts. */
function SlidePicture() {
  return (
    <div
      style={{
        position: 'relative',
        width: 600,
        height: 340,
        border: '1px solid var(--border)',
        borderRadius: 12,
        background: 'var(--surface)',
        boxShadow: 'var(--shadow)',
        padding: '22px 26px',
        flex: 'none',
      }}
    >
      <Bar w={90} h={8} color="var(--accent)" />
      <Bar w={260} h={18} color="var(--text)" style={{ marginTop: 8 }} />
      <Bar w={400} h={9} color="var(--muted)" style={{ marginTop: 10, opacity: 0.6 }} />
      <div style={{ marginTop: 18, background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
        <Bar w={220} h={8} />
        <Bar w={300} h={8} style={{ marginTop: 6 }} />
        <Bar w={180} h={8} style={{ marginTop: 6 }} />
      </div>
      <div style={{ marginTop: 12, background: 'var(--accent-soft)', borderLeft: '4px solid var(--accent)', borderRadius: 6, padding: 9 }}>
        <Bar w={320} h={8} color="var(--accent)" style={{ opacity: 0.5 }} />
      </div>
      <div style={{ position: 'absolute', left: 26, right: 26, bottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ border: '1px solid var(--border)', borderRadius: 5, padding: '1px 6px', fontSize: 11, fontWeight: 600 }}>☰ All lessons</span>
        <Bar w={70} h={6} color="var(--muted)" style={{ opacity: 0.5 }} />
        <div style={{ flex: 1, height: 3, background: 'var(--surface-2)' }}>
          <div style={{ width: '40%', height: 3, background: 'var(--accent)' }} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>4 / 11 ‹ › ?</span>
      </div>
      <Pin n={1} style={{ left: -13, top: 14 }} />
      <Pin n={2} style={{ left: -13, top: 50 }} />
      <Pin n={3} style={{ left: -13, top: 112 }} />
      <Pin n={4} style={{ left: -13, top: 163 }} />
      <Pin n={5} style={{ left: 10, bottom: -13 }} />
      <Pin n={6} style={{ left: 280, bottom: -13 }} />
      <Pin n={7} style={{ right: 30, bottom: -13 }} />
    </div>
  );
}

function Part({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li style={{ listStyle: 'none', display: 'flex', gap: 10, marginBottom: 8 }}>
      <strong style={{ color: 'var(--backpack)', minWidth: 18 }}>{n}</strong>
      <span>{children}</span>
    </li>
  );
}

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Start here, before setup']} />

      <Slide
        title="What this bootcamp is for"
        eyebrow="The goal"
        lead="This bootcamp takes you from Python to picking up frontend tickets in the team's React apps, on your own."
      >
        <ul>
          <li>
            <strong>Read JavaScript</strong> the way it is written in the team&apos;s apps, and know where it differs from Python.
          </li>
          <li>
            <strong>Migrate JavaScript to TypeScript</strong> in strict mode, without cheating the type checker.
          </li>
          <li>
            <strong>Follow the Rules of React</strong>, and find and fix the bugs that come from breaking them.
          </li>
        </ul>
        <div className="k-note">
          It is self-paced. Every exercise checks itself, and a mentor is there when you are stuck.
        </div>
      </Slide>

      <Slide
        title="The path"
        eyebrow="The goal"
        lead="Four phases, in order. You build one app the whole way: a support-ticket tracker. Each phase ends with a project that uses what it taught."
      >
        <table className="k-table">
          <thead>
            <tr>
              <th>Phase</th>
              <th>You learn</th>
              <th>It ends with</th>
              <th>Core time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 · JavaScript</td>
              <td>values, arrays, closures, async, modules</td>
              <td>the ticket logic in JavaScript</td>
              <td style={{ whiteSpace: 'nowrap' }}>about 6 h</td>
            </tr>
            <tr>
              <td>2 · TypeScript</td>
              <td>types, unions, type guards, generics, migrating</td>
              <td>the same logic, in strict TypeScript</td>
              <td style={{ whiteSpace: 'nowrap' }}>about 6.5 h</td>
            </tr>
            <tr>
              <td>3 · React and antd</td>
              <td>components, Rules of React, hooks, React Query, antd</td>
              <td>(the final project)</td>
              <td style={{ whiteSpace: 'nowrap' }}>about 6.5 h</td>
            </tr>
            <tr>
              <td>Final project</td>
              <td>everything</td>
              <td>a React app on your own ticket logic</td>
              <td style={{ whiteSpace: 'nowrap' }}>about 4.5 h</td>
            </tr>
          </tbody>
        </table>
      </Slide>

      <Slide
        title="How a module works"
        eyebrow="Every module, the same five steps"
        lead="A module is one topic, about an hour. Each has a lesson (slides like these), a README and exercises that check themselves."
        steps={1}
      >
        <ol>
          <li>
            <strong>Watch the lesson</strong> in <code>yarn lessons</code>.
          </li>
          <li>
            <strong>Read the module&apos;s README</strong>: a short recap and a table of the exercise steps.
          </li>
          <li>
            <strong>Do the exercises</strong> in the starter file, one step at a time. A comment above each step says what to build.
          </li>
          <li>
            <strong>Check them</strong> with <code>yarn verify &lt;module&gt;</code>, for example <code>yarn verify 01-js/03</code>.
          </li>
          <li>
            <strong>Move on</strong> when every <em>core</em> step is green.
          </li>
        </ol>
        <Reveal at={1}>
          <div className="k-note backpack">
            <strong>Core</strong> steps are the path. <strong>Stretch</strong> steps are extra practice: skip them when you are behind,
            and come back when you have time.
          </div>
        </Reveal>
      </Slide>

      <Slide title="What each part of a slide shows" eyebrow="Reading a lesson" lead="Every slide has the same layout, so you always know where to look.">
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', marginTop: 6 }}>
          <SlidePicture />
          <ol style={{ margin: 0, padding: 0, fontSize: 20, lineHeight: 1.35 }}>
            <Part n={1}>
              <strong>Eyebrow</strong>: the kind of slide, for example “Your turn” or “Coming from Python”.
            </Part>
            <Part n={2}>
              <strong>Title and lead</strong>: the idea of the slide, in one sentence.
            </Part>
            <Part n={3}>
              <strong>Body</strong>: code, a diagram or a list. Code you can run has a Run button.
            </Part>
            <Part n={4}>
              <strong>Notes</strong>: blue is a rule or a tip, orange is a trap to watch for.
            </Part>
            <Part n={5}>
              <strong>All lessons</strong>: back to the list (or press Esc).
            </Part>
            <Part n={6}>
              <strong>Progress</strong> through the lesson, and the slide number.
            </Part>
            <Part n={7}>
              <strong>‹ ›</strong> previous and next, <strong>?</strong> all keys.
            </Part>
          </ol>
        </div>
      </Slide>

      <Slide title="Five kinds of slide" eyebrow="Reading a lesson" lead="The eyebrow above the title tells you which kind you are on, and what to do with it.">
        <table className="k-table">
          <tbody>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <strong>Your turn</strong>
              </td>
              <td>Some code and a question. Decide your answer, say it out loud, then press → to see if you were right.</td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <strong>Walkthrough</strong>
              </td>
              <td>Code that runs one step per press of →, with a diagram of what changes. The slide before explains the diagram.</td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <strong>Try it</strong>
              </td>
              <td>Code you can edit and run in the page (Run, or Ctrl+Enter). Nothing is saved, so break it freely.</td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <strong>Coming from Python</strong>
              </td>
              <td>Python on the left, JavaScript or TypeScript on the right, doing the same thing.</td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <strong>Recap</strong>
              </td>
              <td>The last slide: what to remember, and what to do next.</td>
            </tr>
          </tbody>
        </table>
      </Slide>

      <Slide title="Keys" eyebrow="Reading a lesson" lead="You can click the buttons at the bottom of every slide, or use the keyboard.">
        <table className="k-table">
          <tbody>
            <tr>
              <td className="mono">→ or Space</td>
              <td>next step, or next slide</td>
            </tr>
            <tr>
              <td className="mono">←</td>
              <td>back one step</td>
            </tr>
            <tr>
              <td className="mono">Home / End</td>
              <td>first or last slide</td>
            </tr>
            <tr>
              <td className="mono">Esc</td>
              <td>back to all lessons</td>
            </tr>
            <tr>
              <td className="mono">d</td>
              <td>switch between light and dark (or click ◐ at the bottom right)</td>
            </tr>
            <tr>
              <td className="mono">?</td>
              <td>show all keys</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">The address bar keeps your place: reload the page and you are on the same slide.</div>
      </Slide>

      <Slide
        title="Every working day"
        eyebrow="Your setup"
        lead="You opened this with yarn lessons, so the install from 00-setup/README.md worked. Each day starts the same way:"
      >
        <ol>
          <li>
            Open two terminals in the <code>bootcamp</code> folder.
          </li>
          <li>
            Terminal 1: start the ticket API and leave it open: <code>python server/server.py</code>.
          </li>
          <li>
            Terminal 2: everything else. <code>yarn progress</code> shows where you stopped and what is next.
          </li>
        </ol>
        <div className="k-note">
          Is <code>yarn verify 00-setup</code> not all green yet? Finish <code>00-setup/README.md</code> before module 01.
        </div>
      </Slide>

      <Slide
        title="Reading yarn verify"
        eyebrow="Checking your work"
        lead="yarn verify runs the checks for one module and tells you, step by step, what passes and what to do next."
      >
        <Code
          small
          lang="text"
          code={`✓  1 core    priorities.js: named exports
✗  2 core    format.js: a default export
              format.js has no default export yet.
              Hint: export default function formatTicket(...)
·  3 core    dates.js: split a file in two   (not started)

1 of 5 core steps pass. Next: step 2, format.js: a default export.`}
        />
        <ul style={{ fontSize: 22, marginTop: 16 }}>
          <li>
            <strong>✓</strong> passes, <strong>✗</strong> fails, <strong>·</strong> not started. The message says what the user would
            see, the hint where to look.
          </li>
          <li>
            <code>yarn verify 01-js/05/2</code> checks only step 2. <code>yarn progress</code> shows every module at once.
          </li>
        </ul>
      </Slide>

      <Slide title="When you are stuck" eyebrow="Getting help" lead="Being stuck is part of the work, and asking is not cheating.">
        <ol>
          <li>Read the step&apos;s message and hint again, slowly.</li>
          <li>Look at the lesson slide the hint names, or the README&apos;s recap.</li>
          <li>
            Give it about <strong>20 minutes</strong> on one step. Still stuck? Ask your mentor, and bring the module and step, the{' '}
            <code>yarn verify</code> output, and what you tried.
          </li>
        </ol>
        <div className="k-note backpack">
          Do not copy another junior&apos;s solution. Each project builds on your own code, so you would only move the problem.
        </div>
      </Slide>

      <Slide title="What done means" eyebrow="The finish line" lead="You are done when all four of these are true.">
        <ul>
          <li>
            Every core step of every module is green in <code>yarn progress</code>.
          </li>
          <li>The Phase 1 and Phase 2 projects meet their Definition of Done.</li>
          <li>
            The final project meets its Definition of Done, and <code>yarn verify final-project</code> passes.
          </li>
          <li>You show your mentor the final app running, and walk them through one bug you fixed.</li>
        </ul>
        <div className="k-note">
          Next: lesson <strong>00-setup</strong>, which explains the tools you just installed. The full guide is <code>START-HERE.md</code> in the{' '}
          <code>bootcamp</code> folder.
        </div>
      </Slide>
    </Deck>
  );
}
