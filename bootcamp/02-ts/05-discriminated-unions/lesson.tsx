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
  id: '02-ts/05',
  title: 'Discriminated unions: ticket states',
  time: '10 min lesson · 15 min exercises',
  subtitle: 'Make impossible tickets impossible to write: one type per state, and a switch that must handle them all.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: like match on a Literal tag, checked by the compiler']} />

      <Slide title="The bag of optionals" eyebrow="The problem" steps={1}>
        <Code
          lang="ts"
          code={`type Ticket = {\n  status: 'open' | 'assigned' | 'blocked' | 'closed';\n  assignee?: string;\n  blockedReason?: string;\n  closedAt?: string;\n};`}
        />
        <Reveal at={1}>
          <Code lang="ts" small code={`const t: Ticket = { status: 'open', closedAt: '2026-10-28' };   // allowed!\nt.blockedReason.length;   // error even when status is 'blocked'`} />
          <div className="k-note">The type allows tickets that make no sense, and still cannot tell you what a blocked ticket has.</div>
        </Reveal>
      </Slide>

      <Slide title="One type per state" eyebrow="Mental model">
        <Code
          lang="ts"
          small
          code={`type OpenTicket     = TicketBase & { status: 'open' };\ntype AssignedTicket = TicketBase & { status: 'assigned'; assignee: string };\ntype BlockedTicket  = TicketBase & { status: 'blocked'; assignee: string;\n                                     blockedReason: string };\ntype ClosedTicket   = TicketBase & { status: 'closed'; closedAt: string;\n                                     assignee?: string };\n\ntype Ticket = OpenTicket | AssignedTicket | BlockedTicket | ClosedTicket;`}
        />
        <div className="k-note">
          <code>status</code> is the <strong>discriminant</strong>: a literal that is different in every member. Our ticket API sends
          exactly these shapes.
        </div>
      </Slide>

      <CompareSlide
        title="Switching on the tag"
        python={`match ticket["status"]:\n    case "blocked":\n        return ticket["blocked_reason"]\n    case "closed":\n        return ticket["closed_at"]`}
        js={`switch (ticket.status) {\n  case 'blocked':  // BlockedTicket\n    return ticket.blockedReason;\n  case 'closed':   // ClosedTicket\n    return ticket.closedAt;\n}`}
        jsLang="ts"
        note={<>Inside each case TypeScript has narrowed the union to one member, so the fields of that state are allowed.</>}
      />

      <Slide title="never: the case you forgot" eyebrow="Exhaustiveness" steps={1}>
        <Code
          lang="ts"
          small
          code={`function assertNever(value: never): never {\n  throw new Error('Unexpected value');\n}\nswitch (ticket.status) {\n  case 'open': ...\n  case 'assigned': ...\n  case 'blocked': ...\n  case 'closed': ...\n  default: return assertNever(ticket);   // ticket is never here\n}`}
          focus={[9]}
        />
        <Reveal at={1}>
          <div className="k-note backpack">
            Add <code>&apos;archived&apos;</code> to the union and forget its case: in <code>default</code>, ticket is now an
            ArchivedTicket, not <code>never</code>. Compile error, at every switch you missed.
          </div>
        </Reveal>
      </Slide>

      <PredictSlide
        lang="ts"
        title="Changing state"
        question="Does this compile? What does the result contain? Decide before you press →"
        code={`function close(ticket: BlockedTicket, closedAt: string): ClosedTicket {\n  return { ...ticket, status: 'closed', closedAt };\n}`}
        answer="It compiles, and the closed ticket still has blockedReason"
        surprising
        explanation={
          <>
            Extra fields that come from a spread are not checked. Build the new state from the base fields on purpose:{' '}
            <code>{'const { id, title, priority, createdAt, dueDate } = ticket;'}</code>
          </>
        }
      />

      <RecapSlide
        points={[
          'One type per state, each with a literal discriminant like status.',
          'The union of the states makes impossible combinations a compile error.',
          'switch on the discriminant narrows to one state per case.',
          'default: assertNever(x) turns a forgotten case into a compile error.',
          'Changing state: build the new object from the base fields, not by spreading the old state.',
        ]}
      />
    </Deck>
  );
}
