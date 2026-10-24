import type { ReactNode } from 'react';
import { useStep } from './context';
import { Slide } from './Slides';

export type Actor = { id: string; label: string; detail?: string };
export type Message = { from: string; to: string; label: string; note: ReactNode; reply?: boolean };

/**
 * A sequence diagram that grows one message per build step:
 * who talks to whom, in order (browser → Vite → Python and back).
 */
export function SequenceSlide({ title, eyebrow, lead, actors, messages }: { title: ReactNode; eyebrow?: ReactNode; lead?: ReactNode; actors: Actor[]; messages: Message[] }) {
  const step = useStep();
  const x = (id: string) => ((actors.findIndex((a) => a.id === id) + 0.5) / actors.length) * 100;
  const shown = messages.slice(0, step + 1);
  return (
    <Slide title={title} eyebrow={eyebrow} lead={lead}>
      <div className="k-seq">
        <div className="k-seq-actors" style={{ gridTemplateColumns: `repeat(${actors.length}, 1fr)` }}>
          {actors.map((a) => (
            <div key={a.id} className="k-seq-actor">
              <strong>{a.label}</strong>
              {a.detail && <span>{a.detail}</span>}
            </div>
          ))}
        </div>
        <div className="k-seq-lanes">
          {actors.map((a) => (
            <div key={a.id} className="k-seq-lifeline" style={{ left: `${x(a.id)}%` }} />
          ))}
          {shown.map((m, i) => {
            const from = x(m.from);
            const to = x(m.to);
            const left = Math.min(from, to);
            const latest = i === shown.length - 1;
            return (
              <div
                key={i}
                className={`k-seq-msg${m.reply ? ' reply' : ''}${latest ? ' latest' : ''}`}
                style={{ left: `${left}%`, width: `${Math.abs(to - from)}%` }}
              >
                <span className="k-seq-label">{m.label}</span>
                <span className={`k-seq-arrow ${to > from ? 'right' : 'left'}`} />
              </div>
            );
          })}
        </div>
        <div className="k-walk-note">{shown.at(-1)?.note}</div>
      </div>
    </Slide>
  );
}
SequenceSlide.stepsFor = (props: Record<string, unknown>) => (props.messages as Message[]).length - 1;
