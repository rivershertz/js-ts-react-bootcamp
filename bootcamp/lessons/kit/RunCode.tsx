import { useRef, useState, type ReactNode } from 'react';
import { Slide } from './Slides';

type Line = { text: string; error?: boolean };

function show(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(value, (_k, v) => (v === undefined ? 'undefined' : typeof v === 'function' ? `[Function ${v.name}]` : v));
  } catch {
    return String(value);
  }
}

/** An editable JavaScript snippet with a Run button and its console output. Runs in this page only. */
export function RunSlide({ title, eyebrow = 'Try it', code, children }: { title: ReactNode; eyebrow?: ReactNode; code: string; children?: ReactNode }) {
  const [source, setSource] = useState(code.trim());
  const [lines, setLines] = useState<Line[]>([]);
  const runId = useRef(0);

  async function run() {
    const id = ++runId.current;
    setLines([]);
    const push = (line: Line) => {
      if (runId.current === id) setLines((l) => [...l, line]);
    };
    const console = {
      log: (...args: unknown[]) => push({ text: args.map(show).join(' ') }),
      error: (...args: unknown[]) => push({ text: args.map(show).join(' '), error: true }),
    };
    try {
      const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (...args: string[]) => (c: typeof console) => Promise<void>;
      await new AsyncFunction('console', source)(console);
    } catch (e) {
      push({ text: `${(e as Error).name}: ${(e as Error).message}`, error: true });
    }
  }

  return (
    <Slide title={title} eyebrow={eyebrow}>
      <div className="k-run">
        <textarea
          value={source}
          spellCheck={false}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              run();
            }
          }}
          aria-label="Code to run"
        />
        <div className="k-run-side">
          <div className="k-run-bar">
            <button className="k-btn" onClick={run}>
              Run ▶
            </button>
            <button
              className="k-btn ghost"
              onClick={() => {
                setSource(code.trim());
                setLines([]);
              }}
            >
              Reset
            </button>
            <span>Ctrl+Enter runs</span>
          </div>
          <div className="k-run-output" aria-live="polite">
            {lines.length === 0 ? (
              <span className="k-muted">Output appears here.</span>
            ) : (
              lines.map((l, i) => (
                <div key={i} className={l.error ? 'err' : ''}>
                  {l.text}
                </div>
              ))
            )}
          </div>
          {children && <div className="k-note" style={{ marginTop: 0, fontSize: 19 }}>{children}</div>}
        </div>
      </div>
    </Slide>
  );
}
