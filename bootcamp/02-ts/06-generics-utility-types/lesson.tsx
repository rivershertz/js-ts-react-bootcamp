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
  id: '02-ts/06',
  title: 'Generics and utility types',
  time: '10 min lesson · 20 min exercises',
  subtitle: 'Write a function once for any type without losing the type, and derive new types instead of copying fields.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: TypeVar and Generic, with less ceremony']} />

      <Slide title="unknown loses the type" eyebrow="The problem">
        <Code
          lang="ts"
          code={`function first(items: readonly unknown[]): unknown {\n  return items[0];\n}\n\nconst t = first(tickets);\nt.title;   // error: 't' is of type 'unknown'`}
        />
        <div className="k-note">
          The function works for every list, but the caller gets <code>unknown</code> back and has to check it again. We want
          &ldquo;whatever type went in comes out&rdquo;.
        </div>
      </Slide>

      <Slide title="A type parameter" eyebrow="Mental model" steps={1}>
        <Code
          lang="ts"
          code={`function first<T>(items: readonly T[]): T | undefined {\n  return items[0];\n}\n\nfirst(tickets);   // T = Ticket  → Ticket | undefined\nfirst([1, 2]);    // T = number  → number | undefined`}
          focus={[1, 5, 6]}
        />
        <Reveal at={1}>
          <div className="k-note">
            <code>T</code> is a parameter for a type, filled in at each call. TypeScript infers it from the arguments, so you
            almost never write <code>{'first<Ticket>(…)'}</code> yourself.
          </div>
        </Reveal>
      </Slide>

      <CompareSlide
        title="Generics, side by side"
        python={`T = TypeVar("T")\n\ndef first(items: list[T]) -> T | None:\n    return items[0] if items else None`}
        js={`function first<T>(\n  items: readonly T[],\n): T | undefined {\n  return items[0];\n}`}
        jsLang="ts"
        note={
          <>
            You have used generics already: <code>{'Array<Ticket>'}</code>, <code>{'Promise<Ticket[]>'}</code>,{' '}
            <code>{'Record<string, Ticket>'}</code>. Now you can write your own.
          </>
        }
      />

      <Slide title="Utility types" eyebrow="Reference">
        <Code
          lang="ts"
          small
          code={`type TicketDraft   = Omit<Ticket, 'id' | 'createdAt'>;  // what a form sends\ntype TicketChanges = Partial<TicketDraft>;              // every field optional\ntype TicketSummary = Pick<Ticket, 'id' | 'title'>;      // only these fields\ntype ById          = Record<string, Ticket>;            // dict[str, Ticket]\ntype Stats         = ReturnType<typeof computeStats>;   // whatever it returns`}
        />
        <div className="k-note">
          Derived types follow <code>Ticket</code> automatically. Add a field to Ticket and the form type has it too; nothing to
          keep in sync by hand.
        </div>
      </Slide>

      <PredictSlide
        lang="ts"
        title="Types do not touch values"
        code={`function summarize(t: Ticket): Pick<Ticket, 'id' | 'title'> {\n  return t;\n}\n\nconsole.log(Object.keys(summarize(ticket)).length);`}
        answer="7: every field of the ticket"
        explanation={
          <>
            A full Ticket is a valid <code>Pick</code> (it has id and title), so this compiles. But the object is unchanged at run
            time. To send only two fields, build the object: <code>{'{ id: t.id, title: t.title }'}</code>.
          </>
        }
      />

      <Slide title="Constraints and generic unions" eyebrow="Two more tools">
        <Code
          lang="ts"
          small
          code={`// K can only be a string type (like 'open' | 'closed')\nfunction countBy<T, K extends string>(items: readonly T[], keyOf: (item: T) => K) { ... }\n\n// data or error, for any T\ntype Result<T> = { ok: true; data: T } | { ok: false; error: string };\n\nfunction unwrap<T>(result: Result<T>, fallback: T): T {\n  return result.ok ? result.data : fallback;   // ok narrows, like status did\n}`}
        />
      </Slide>

      <RecapSlide
        points={[
          '<T> is a type parameter: one function, any type, nothing lost.',
          'TypeScript infers T from the arguments.',
          'Omit, Pick, Partial, Record and ReturnType derive types from types you already have.',
          'Types never change objects at run time; build the shape you mean to send.',
          'K extends string restricts a type parameter; Result<T> is a generic discriminated union.',
        ]}
      />
    </Deck>
  );
}
