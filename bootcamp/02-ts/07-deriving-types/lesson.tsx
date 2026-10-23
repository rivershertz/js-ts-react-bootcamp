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
  id: '02-ts/07',
  title: 'Deriving types from values',
  time: '10 min lesson · 10 min exercises',
  subtitle: 'Write the list of statuses once. Get the type, the dropdown options and the labels from it, so they can never drift apart.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['Coming from Python: like building a Literal from an Enum, without the Enum']} />

      <Slide title="Written twice, wrong once" eyebrow="The problem">
        <Code
          lang="ts"
          code={`export const STATUSES = ['open', 'assigned', 'blocked', 'closed'];\nexport type Status = 'open' | 'assigned' | 'blocked' | 'closed';\n\n// a month later someone adds 'archived' to the array…\n// …and forgets the type. Nothing complains.`}
        />
        <div className="k-note">The values exist at run time (for dropdowns and filters), the type for the checker. Write one, derive the other.</div>
      </Slide>

      <PredictSlide
        lang="ts"
        title="What type does TypeScript infer?"
        question="Hover STATUSES in your head. What is its type? Decide before you press →"
        code={`const STATUSES = ['open', 'assigned', 'blocked', 'closed'];`}
        answer="string[]"
        explanation={
          <>
            An array literal could be changed later (<code>push(&apos;anything&apos;)</code>), so TypeScript widens it to{' '}
            <code>string[]</code>. The exact strings are lost.
          </>
        }
      />

      <Slide title="as const keeps the exact values" eyebrow="Step 1" steps={2}>
        <Code lang="ts" code={`const STATUSES = ['open', 'assigned', 'blocked', 'closed'] as const;\n// readonly ['open', 'assigned', 'blocked', 'closed']`} />
        <Reveal at={1}>
          <Code lang="ts" code={`type Status = (typeof STATUSES)[number];\n// 'open' | 'assigned' | 'blocked' | 'closed'`} />
        </Reveal>
        <Reveal at={2}>
          <div className="k-note">
            Read it right to left: <code>typeof STATUSES</code> is the tuple type, <code>[number]</code> is &ldquo;the type of any item
            in it&rdquo;. Add <code>&apos;archived&apos;</code> to the array and <code>Status</code> includes it automatically.
          </div>
        </Reveal>
      </Slide>

      <Slide title="satisfies: check without widening" eyebrow="Step 2">
        <Code
          lang="ts"
          small
          code={`const PRIORITY_LABELS = {\n  low: 'Low',\n  medium: 'Medium',\n  high: 'High',\n  urgent: 'Urgent',\n} as const satisfies Record<Priority, string>;\n\ntype PriorityLabel = (typeof PRIORITY_LABELS)[Priority];   // 'Low' | 'Medium' | 'High' | 'Urgent'`}
        />
        <div className="k-note">
          <code>satisfies</code> makes TypeScript check every priority has a label (a missing or misspelled key is an error) but
          keeps the object&apos;s own exact type. An annotation <code>{': Record<Priority, string>'}</code> would forget the exact
          labels.
        </div>
      </Slide>

      <Slide title="From values to UI" eyebrow="Step 3: the payoff">
        <Code
          lang="ts"
          code={`function statusOptions(): { value: Status; label: string }[] {\n  return STATUSES.map((value) => ({\n    value,                                         // Status, not string\n    label: value[0].toUpperCase() + value.slice(1),\n  }));\n}`}
        />
        <div className="k-note">
          On day 2 this feeds an antd <code>Select</code>. One array drives the type, the filter options and the labels.
        </div>
      </Slide>

      <Slide title="The type operators" eyebrow="Reference">
        <table className="k-table">
          <tbody>
            <tr>
              <td className="mono">typeof value</td>
              <td>the type of a value (in a type position)</td>
            </tr>
            <tr>
              <td className="mono">keyof T</td>
              <td>union of the keys of T</td>
            </tr>
            <tr>
              <td className="mono">{"T['status']"}</td>
              <td>the type of one field</td>
            </tr>
            <tr>
              <td className="mono">(typeof ARR)[number]</td>
              <td>union of the items of an array</td>
            </tr>
            <tr>
              <td className="mono">as const</td>
              <td>keep exact literal values, readonly</td>
            </tr>
            <tr>
              <td className="mono">satisfies T</td>
              <td>check against T, keep the exact type</td>
            </tr>
          </tbody>
        </table>
      </Slide>

      <RecapSlide
        points={[
          'Write a list of values once; derive its type instead of writing it again.',
          'as const keeps exact strings; (typeof ARR)[number] turns them into a union.',
          'satisfies checks a value against a type without widening it.',
          'keyof and T[K] read keys and field types off an existing type.',
          'Your Phase 2 project defines STATUSES and PRIORITIES exactly this way.',
        ]}
      />
    </Deck>
  );
}
