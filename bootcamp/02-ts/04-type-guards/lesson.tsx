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
  id: '02-ts/04',
  title: 'Type guards: checking unknown data',
  time: '30 min lesson · 35 min exercises',
  subtitle: 'Types vanish at run time. A type guard is the run-time check that earns the type back.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: like validating with pydantic, written by hand']} />

      <Slide title="The type says Ticket. The server disagrees." eyebrow="The problem">
        <Code
          lang="ts"
          code={`const response = await client.get<Ticket[]>('/tickets');\nconst tickets = response.data;          // TypeScript: Ticket[]\n\n// what --bad-data actually sends as the last item:\n{ id: 't-bad', title: 'Imported…', priority: 3, status: 'open' }`}
        />
        <div className="k-note">
          <code>{'get<Ticket[]>'}</code> is a promise, not a check. Nothing verified it. Later, <code>priority.toUpperCase()</code>{' '}
          crashes far away from the real cause.
        </div>
      </Slide>

      <Slide title="unknown in, checked type out" eyebrow="Mental model" steps={1}>
        <Code
          lang="ts"
          code={`function isPriority(value: unknown): value is Priority {\n  return PRIORITIES.some((p) => p === value);\n}\n\nconst input: unknown = form.priority;\nif (isPriority(input)) {\n  input;   // Priority here\n}`}
          focus={[1, 6, 7]}
        />
        <Reveal at={1}>
          <div className="k-note">
            <code>value is Priority</code> is a promise you make: &ldquo;when I return true, it really is a Priority&rdquo;. TypeScript
            trusts it, so the check inside must be honest.
          </div>
        </Reveal>
      </Slide>

      <CompareSlide
        title="Checking a shape"
        python={`def is_assignee(\n    value: object,\n) -> TypeGuard[Assignee]:\n    return (\n        isinstance(value, dict)\n        and isinstance(value.get("id"), str)\n        and isinstance(value.get("name"), str)\n    )`}
        js={`function isAssignee(\n  value: unknown,\n): value is Assignee {\n  return (\n    isRecord(value) &&\n    typeof value.id === 'string' &&\n    typeof value.name === 'string'\n  );\n}`}
        jsLang="ts"
        note={
          <>
            <code>isRecord</code> (object, not null, not an array) comes first. After it, TypeScript lets you read any field as{' '}
            <code>unknown</code>, and each <code>typeof</code> narrows one field.
          </>
        }
      />

      <PredictSlide
        title="A JavaScript classic"
        code={`console.log(typeof null);\nconsole.log(typeof []);\nconsole.log(Array.isArray([]));`}
        answer="'object', 'object', true"
        surprising
        explanation={
          <>
            <code>typeof null</code> is <code>&apos;object&apos;</code> (a bug from 1995 that can never be fixed). That is why{' '}
            <code>isRecord</code> needs <code>value !== null</code> and <code>!Array.isArray(value)</code>.
          </>
        }
      />

      <Slide title="Guard or assert?" eyebrow="Two shapes of the same check">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">Guard: you decide what to do</div>
            <Code lang="ts" small code={`if (isTicket(data)) {\n  show(data);\n} else {\n  warn('bad ticket');\n}`} />
          </div>
          <div>
            <div className="k-col-label">Assert: throw if wrong</div>
            <Code lang="ts" small code={`assertTicket(data);\n// below this line,\n// data is a Ticket\nshow(data);`} />
          </div>
        </div>
        <div className="k-note">
          Use a guard when bad data is expected and you can skip it (a list from the API). Use an assertion when bad data means
          the program cannot go on.
        </div>
      </Slide>

      <Slide title="Guards are filter callbacks" eyebrow="The pattern your project uses">
        <Code
          lang="ts"
          code={`function parseTickets(data: unknown) {\n  if (!Array.isArray(data)) throw new Error('Expected a list of tickets');\n  const tickets = data.filter(isTicket);    // Ticket[]\n  return { tickets, invalid: data.length - tickets.length };\n}`}
        />
        <div className="k-note">The API&apos;s answer enters as unknown, leaves as Ticket[], and every bad item is counted, not trusted.</div>
      </Slide>

      <RecapSlide
        points={[
          'Data from outside is unknown, whatever its annotation says.',
          'A type guard (value is T) is a run-time check that TypeScript understands.',
          'Start with isRecord, then one typeof per field. typeof null is "object".',
          'An assertion function (asserts value is T) throws instead of returning false.',
          'data.filter(isTicket) turns an unknown list into Ticket[].',
        ]}
      />
    </Deck>
  );
}
