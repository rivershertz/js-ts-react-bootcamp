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
  id: '02-ts/02',
  title: 'Basics: object types and functions',
  time: '10 min lesson · 25 min exercises',
  subtitle: 'Describe the shape of your data once, then let the checker hold every function to it.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: like a TypedDict or a dataclass, without the class']} />

      <CompareSlide
        title="Describing a shape"
        python={`class Assignee(TypedDict):\n    id: str\n    name: str\n\ndef greet(a: Assignee) -> str:\n    return f"Hi {a['name']}"`}
        js={`type Assignee = {\n  id: string;\n  name: string;\n};\n\nfunction greet(a: Assignee): string {\n  return \`Hi \${a.name}\`;\n}`}
        jsLang="ts"
        note={
          <>
            A type is only a description. It creates nothing at run time; the objects are still plain <code>{'{ }'}</code>{' '}
            literals.
          </>
        }
      />

      <Slide title="Three kinds of maybe" eyebrow="Mental model" steps={2}>
        <Code
          lang="ts"
          code={`type Ticket = {\n  readonly id: string;     // always there, never reassigned\n  description?: string;    // may be missing entirely\n  dueDate: string | null;  // always there, may be null\n};`}
        />
        <Reveal at={1}>
          <Code lang="ts" small code={`ticket.id = 't2';             // error: id is read-only\nticket.description.length;    // error: possibly undefined\nticket.dueDate.slice(0, 4);   // error: possibly null`} />
        </Reveal>
        <Reveal at={2}>
          <div className="k-note">
            Optional (<code>?</code>) means <code>undefined</code> when absent. Use <code>| null</code> when the API always sends the
            field, like our ticket API does with <code>dueDate</code>.
          </div>
        </Reveal>
      </Slide>

      <Slide title="type or interface?" eyebrow="Reference">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">type: any shape</div>
            <Code lang="ts" small code={`type Status = 'open' | 'closed';\ntype ClosedTicket = Ticket & {\n  closedAt: string;\n};`} />
          </div>
          <div>
            <div className="k-col-label">interface: objects only</div>
            <Code lang="ts" small code={`interface ClosedTicket\n  extends Ticket {\n  closedAt: string;\n}`} />
          </div>
        </div>
        <div className="k-note">
          For objects they are nearly the same. Pick one per project and stay consistent; unions like <code>Status</code> need{' '}
          <code>type</code>.
        </div>
      </Slide>

      <Slide title="Typing functions" eyebrow="The everyday part">
        <Code
          lang="ts"
          code={`function createTicket(id: string, title: string, priority = 'medium'): Ticket {\n  // priority: string, optional, because it has a default\n}\n\ntype TicketFilter = (ticket: Ticket) => boolean;\nconst isOpen: TicketFilter = (ticket) => ticket.status !== 'closed';\n// (ticket) needs no annotation: its type comes from TicketFilter`}
        />
      </Slide>

      <PredictSlide
        lang="ts"
        title="Does this compile?"
        question="Does TypeScript accept this? Decide before you press →"
        code={`function addTicket(tickets: readonly Ticket[], t: Ticket) {\n  tickets.push(t);\n  return tickets;\n}`}
        answer="No: Property 'push' does not exist on type 'readonly Ticket[]'"
        explanation={
          <>
            <code>readonly</code> arrays have no methods that change them (<code>push</code>, <code>sort</code>,{' '}
            <code>splice</code>). It is the module 01-js/01 rule, now enforced: return <code>[...tickets, t]</code>.
          </>
        }
      />

      <PredictSlide
        lang="ts"
        title="Extra fields"
        question="Which line is an error? Decide before you press →"
        code={`const a: Assignee = { id: 'a1', name: 'Dana', team: 'web' };\n\nconst raw = { id: 'a1', name: 'Dana', team: 'web' };\nconst b: Assignee = raw;`}
        answer="Only the first"
        explanation={
          <>
            An object literal written straight into a typed variable is checked for unknown fields, to catch typos. An existing
            object with extra fields is fine: it still has everything an <code>Assignee</code> needs.
          </>
        }
      />

      <RecapSlide
        points={[
          'An object type lists fields and their types. It exists only for the checker.',
          'readonly: cannot reassign. ?: may be missing. | null: present but maybe empty.',
          'interface extends adds fields; type works for every kind of type.',
          'Type every parameter. Defaults make a parameter optional.',
          'readonly arrays forbid push and sort, so mutation bugs become type errors.',
        ]}
      />
    </Deck>
  );
}
