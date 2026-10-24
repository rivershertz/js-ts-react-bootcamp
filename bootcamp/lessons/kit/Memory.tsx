import type { ReactNode } from 'react';
import { Code } from './Code';
import { useStep } from './context';
import { Slide } from './Slides';

/** A value in memory: a primitive written as code ('0', "'T'", 'undefined') or a reference to a heap object. */
export type Val = string | { ref: string };
export type StackFrame = { name: string; vars: Record<string, Val> };
export type HeapObject = {
  id: string;
  /** What the object is, for example 'function inner' or 'object'. */
  label: string;
  fields?: Record<string, Val>;
  /** Variables a function carries with it: its closure. */
  backpack?: Record<string, Val>;
};
export type WalkStep = {
  /** 1-based line that is running. */
  line?: number;
  note: ReactNode;
  /** Bottom of the stack first. */
  stack: StackFrame[];
  heap?: HeapObject[];
  output?: string[];
};

const REF_COLORS = ['var(--ref-1)', 'var(--ref-2)', 'var(--ref-3)', 'var(--ref-4)'];

/**
 * Step-through of how code runs: the running line, the call stack, the heap,
 * and the closure "backpack". Each build step of the slide shows one WalkStep.
 */
export function WalkthroughSlide({ title, eyebrow, lead, code, steps }: { title: ReactNode; eyebrow?: ReactNode; lead?: ReactNode; code: string; steps: WalkStep[] }) {
  const i = useStep();
  const now = steps[Math.min(i, steps.length - 1)];
  const before = i > 0 ? steps[i - 1] : undefined;
  const allIds = [...new Set(steps.flatMap((s) => (s.heap ?? []).map((h) => h.id)))];
  const color = (id: string) => REF_COLORS[allIds.indexOf(id) % REF_COLORS.length];

  const renderVal = (v: Val) =>
    typeof v === 'string' ? (
      v
    ) : (
      <span className="k-ref" style={{ background: color(v.ref) }}>
        → {(steps.flatMap((s) => s.heap ?? []).find((h) => h.id === v.ref)?.label ?? v.ref).split(' ').at(-1)}
      </span>
    );

  const changed = (scope: string, name: string, v: Val) => {
    if (!before) return false;
    const prevFrame = before.stack.find((f) => f.name === scope);
    const prevObj = before.heap?.find((h) => h.id === scope);
    const prev = prevFrame?.vars[name] ?? prevObj?.backpack?.[name] ?? prevObj?.fields?.[name];
    return prev !== undefined && JSON.stringify(prev) !== JSON.stringify(v);
  };

  return (
    <Slide title={title} eyebrow={eyebrow} lead={lead}>
      <div className="k-walk">
        <div style={{ minHeight: 0 }}>
          <Code code={code} active={now.line} small />
        </div>
        <div className="k-walk-right">
          <div className="k-stepdots" aria-label={`Step ${i + 1} of ${steps.length}`}>
            {steps.map((_, n) => (
              <span key={n} className={n <= i ? 'on' : ''} />
            ))}
            <span style={{ background: 'none', width: 'auto', marginLeft: 6 }}>
              {i + 1} / {steps.length}
            </span>
          </div>
          <div className="k-mem">
            <div className="k-mem-col">
              <h4>Variables · call stack</h4>
              <div className="k-stack">
                {now.stack.map((f, n) => (
                  <div key={f.name + n} className={`k-frame${n === now.stack.length - 1 ? ' top' : ''}`}>
                    <div className="k-frame-name">{f.name}</div>
                    {Object.entries(f.vars).map(([k, v]) => (
                      <div key={k} className={`k-var${changed(f.name, k, v) ? ' changed' : ''}`}>
                        <span className="k-var-name">{k}</span>
                        <span className="k-var-value">{renderVal(v)}</span>
                      </div>
                    ))}
                    {Object.keys(f.vars).length === 0 && <div className="k-muted" style={{ fontSize: 14 }}>no variables yet</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="k-mem-col">
              <h4>Objects · heap</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(now.heap ?? []).map((h) => (
                  <div key={h.id} className="k-obj" style={{ borderLeftColor: color(h.id) }}>
                    <div className="k-obj-name">{h.label}</div>
                    {Object.entries(h.fields ?? {}).map(([k, v]) => (
                      <div key={k} className={`k-var${changed(h.id, k, v) ? ' changed' : ''}`}>
                        <span className="k-var-name">{k}</span>
                        <span className="k-var-value">{renderVal(v)}</span>
                      </div>
                    ))}
                    {h.backpack && (
                      <div className="k-backpack">
                        <div className="k-backpack-label">🎒 Backpack</div>
                        {Object.entries(h.backpack).map(([k, v]) => (
                          <div key={k} className={`k-var${changed(h.id, k, v) ? ' changed' : ''}`}>
                            <span className="k-var-name">{k}</span>
                            <span className="k-var-value">{renderVal(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {(now.heap ?? []).length === 0 && <div className="k-muted" style={{ fontSize: 14 }}>empty</div>}
              </div>
            </div>
          </div>
          <div>
            <div className="k-walk-note">{now.note}</div>
            <div className="k-console" style={{ marginTop: 10 }}>
              <div className="k-console-label">Console</div>
              {(now.output ?? []).join('\n') || <span className="k-muted"> </span>}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}
WalkthroughSlide.stepsFor = (props: Record<string, unknown>) => (props.steps as WalkStep[]).length - 1;
