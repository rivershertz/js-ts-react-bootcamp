import type { ReactNode } from 'react';
import { Code } from './Code';
import { useStep } from './context';
import { Slide } from './Slides';

export type LoopStep = {
  line?: number;
  note: ReactNode;
  stack?: string[];
  /** Work the browser or Node is doing for us: timers, network requests. */
  waiting?: string[];
  /** Promise callbacks: they run before any timer callback. */
  microtasks?: string[];
  /** Timer and event callbacks. */
  tasks?: string[];
  output?: string[];
};

function Box({ title, items, tone }: { title: string; items?: string[]; tone: string }) {
  return (
    <div className="k-loop-box" style={{ borderTopColor: tone }}>
      <h4>{title}</h4>
      {(items ?? []).length === 0 ? <span className="k-muted">empty</span> : items!.map((it, i) => <div key={i} className="k-loop-item">{it}</div>)}
    </div>
  );
}

/** Step-through of the event loop: call stack, waiting work, the two queues, and the console. */
export function EventLoopSlide({ title, eyebrow, code, steps }: { title: ReactNode; eyebrow?: ReactNode; code: string; steps: LoopStep[] }) {
  const i = useStep();
  const now = steps[Math.min(i, steps.length - 1)];
  return (
    <Slide title={title} eyebrow={eyebrow}>
      <div className="k-walk">
        <Code code={code} active={now.line} small />
        <div className="k-walk-right" style={{ gridTemplateRows: '1fr auto' }}>
          <div className="k-loop-grid">
            <Box title="Call stack" items={[...(now.stack ?? [])].reverse()} tone="var(--accent)" />
            <Box title="Waiting (timers, network)" items={now.waiting} tone="var(--muted)" />
            <Box title="Microtask queue (promises)" items={now.microtasks} tone="var(--ref-3)" />
            <Box title="Task queue (timers, events)" items={now.tasks} tone="var(--ref-2)" />
          </div>
          <div>
            <div className="k-walk-note">{now.note}</div>
            <div className="k-console" style={{ marginTop: 10 }}>
              <div className="k-console-label">Console</div>
              {(now.output ?? []).join('\n')}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}
EventLoopSlide.stepsFor = (props: Record<string, unknown>) => (props.steps as LoopStep[]).length - 1;
