import {
  Code,
  CompareSlide,
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
  id: '02-ts/03',
  title: 'Unions and narrowing',
  time: '10 min lesson · 25 min exercises',
  subtitle: 'Values that can be one of several things, and the checks that tell TypeScript which one you have.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: Union and Literal, plus isinstance']} />

      <CompareSlide
        title="Unions and literals" lead={<>A union means "one of these types". With literal values, it becomes a closed list, like Literal in Python.</>}
        python={`Priority = Literal[\n    "low", "medium", "high", "urgent"\n]\n\ndef label(due: str | None) -> str:\n    ...`}
        js={`type Priority =\n  'low' | 'medium' | 'high' | 'urgent';\n\n\nfunction label(due: string | null) {\n  ...\n}`}
        jsLang="ts"
        note={
          <>
            A literal type allows exactly one value. A union of four literals allows exactly four, so <code>&apos;meduim&apos;</code>{' '}
            is a compile error instead of a ticket that never shows up in any filter.
          </>
        }
      />

      <Slide title="On a union, only what all members share" lead={<>TypeScript only lets you use what every member of a union has. A check in your code tells it which member you have.</>} eyebrow="Mental model" steps={1}>
        <Code
          lang="ts"
          code={`function label(due: string | null) {\n  return due.slice(0, 4);   // error: 'due' is possibly 'null'\n}`}
        />
        <Reveal at={1}>
          <Code
            lang="ts"
            code={`function label(due: string | null) {\n  if (due === null) return 'no due date';\n  return due.slice(0, 4);   // fine: due is a string here\n}`}
          />
          <div className="k-note">
            TypeScript reads your <code>if</code> like you do. After the early return, <code>null</code> is no longer possible. This is
            called <strong>narrowing</strong>.
          </div>
        </Reveal>
      </Slide>

      <Slide title="Four ways to narrow" lead={<>Each of these checks tells TypeScript which member of a union you have inside the branch.</>} eyebrow="Reference">
        <Code
          lang="ts"
          small
          code={`if (due === null) { ... }                 // equality (also: if (!due))\nif (typeof id === 'number') { ... }       // primitives: like isinstance(id, int)\nif ('error' in result) { ... }            // objects with different fields\nif (error instanceof Error) { ... }       // classes: Error, Date\n\nswitch (priority) { case 'low': ... }     // one branch per literal`}
        />
        <div className="k-note">Hover the variable inside each branch in VS Code: its type changes from line to line.</div>
      </Slide>

      <Slide title="unknown, any and as" lead={<>Three ways to say "I do not know the type". Only one of them still protects you.</>} eyebrow="Three escape hatches, one safe" steps={2}>
        <Code lang="ts" small code={`function message(error: unknown) {\n  return error.message;   // error: 'error' is of type 'unknown'\n}`} />
        <Reveal at={1}>
          <Code lang="ts" small code={`function message(error: any) {\n  return error.message;   // compiles, crashes when someone throws a string\n}`} />
        </Reveal>
        <Reveal at={2}>
          <div className="k-note">
            <code>unknown</code> forces a check before use: safe. <code>any</code> and <code>as</code> switch the checker off: the bug
            moves to run time. In this bootcamp the checker rejects both.
          </div>
        </Reveal>
      </Slide>

      <PredictSlide
        lang="ts"
        title="Does this compile?" lead={<>A switch over a union of four literals, with three cases. What does TypeScript say?</>}
        question="Is there an error, and where? Decide before you press →"
        code={`function rank(p: Priority): number {\n  switch (p) {\n    case 'low': return 1;\n    case 'medium': return 2;\n    case 'high': return 3;\n  }\n}`}
        answer="Yes: Function lacks ending return statement"
        explanation={
          <>
            TypeScript sees that <code>&apos;urgent&apos;</code> falls through the switch and returns nothing. Add the missing case and the
            error goes away: the switch is now <strong>exhaustive</strong>.
          </>
        }
      />

      <Slide title="Narrowing with find" lead={<>When you need to turn a string into a Priority, look it up in the list of priorities instead of forcing it with as.</>} eyebrow="A common pattern">
        <Code
          lang="ts"
          code={`const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];\n\nfunction parsePriority(text: string): Priority | undefined {\n  const wanted = text.trim().toLowerCase();\n  return PRIORITIES.find((p) => p === wanted);\n}`}
        />
        <div className="k-note">
          No <code>as Priority</code> needed: the result comes out of a list of Priority values, so it already is one.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'A union is one of several types. A union of literals is a closed list of allowed values.',
          'You can only use what every member has, until you narrow.',
          'Narrow with ===, typeof, in, instanceof, or a switch on a literal.',
          'unknown is safe because it must be narrowed. Avoid any and as.',
          'A switch that covers every member is exhaustive, and TypeScript knows it.',
        ]}
      />
    </Deck>
  );
}
