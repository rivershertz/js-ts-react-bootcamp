import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Code, type Lang } from './Code';
import { useMeta, useStep } from './context';

type SlideProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  /** One or two sentences under the title that say the slide's idea in words. */
  lead?: ReactNode;
  /** Number of build steps on this slide; use <Reveal at={n}> inside it. */
  steps?: number;
  children?: ReactNode;
  className?: string;
};

/** The general slide: a title and free content. */
export function Slide({ title, eyebrow, lead, children, className = '' }: SlideProps) {
  return (
    <section className={`k-slide ${className}`}>
      <header className="k-slide-header">
        <div>
          {eyebrow && <p className="k-eyebrow">{eyebrow}</p>}
          <h1 className="k-title">{title}</h1>
          {lead && <p className="k-lead">{lead}</p>}
        </div>
      </header>
      <FitBody>{children}</FitBody>
    </section>
  );
}

/** Smallest scale a slide body may shrink to. Below this the slide has too much on it: split it. */
const MIN_FIT = 0.8;

/**
 * The slide body. When its content is taller than the space left under the title, it is scaled down
 * (never below MIN_FIT) instead of running into the footer. It only ever shrinks while a slide is shown,
 * so text does not jump back and forth between build steps.
 */
function FitBody({ children }: { children?: ReactNode }) {
  const step = useStep();
  const fit = useRef<HTMLDivElement>(null);
  const scale = useRef(1);
  useLayoutEffect(() => {
    const el = fit.current;
    if (!el) return;
    const apply = (s: number) => {
      scale.current = s;
      el.style.transform = s === 1 ? '' : `scale(${s})`;
      el.style.width = el.style.height = s === 1 ? '' : `${100 / s}%`;
    };
    const shrink = () => {
      while (el.scrollHeight > el.clientHeight + 1 && scale.current > MIN_FIT) {
        apply(Math.max(MIN_FIT, Math.round((scale.current - 0.02) * 100) / 100));
      }
    };
    shrink();
    // Web fonts can arrive after the first layout and change line breaks.
    void document.fonts?.ready.then(shrink);
  }, [step]);
  return (
    <div className="k-body">
      <div ref={fit} className="k-fit">
        {children}
      </div>
    </div>
  );
}

/** Shows its children from build step `at` onwards. */
export function Reveal({ at, children }: { at: number; children: ReactNode }) {
  const step = useStep();
  return step >= at ? <div style={{ animation: 'k-in 250ms ease' }}>{children}</div> : null;
}

/** First slide of every deck: module id, title, time guide. */
export function TitleSlide({ chips = [] }: { chips?: string[] }) {
  const meta = useMeta();
  return (
    <section className="k-slide k-titleslide">
      <p className="k-eyebrow">Lesson {meta.id}</p>
      <h1 className="k-title">{meta.title}</h1>
      {meta.subtitle && <p className="k-subtitle">{meta.subtitle}</p>}
      <div className="k-chips">
        <span className="k-chip">⏱ {meta.time}</span>
        {chips.map((c) => (
          <span key={c} className="k-chip">
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}

/** Python on the left, JavaScript or TypeScript on the right. */
export function CompareSlide({
  title,
  eyebrow = 'Coming from Python',
  python,
  js,
  jsLang = 'js',
  note,
  lead,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  python: string;
  js: string;
  jsLang?: Lang;
  note?: ReactNode;
}) {
  return (
    <Slide title={title} eyebrow={eyebrow} lead={lead}>
      <div className="k-cols" style={{ height: 'auto' }}>
        <div>
          <div className="k-col-label" style={{ color: 'var(--python)' }}>
            Python
          </div>
          <Code code={python} lang="python" small />
        </div>
        <div>
          <div className="k-col-label" style={{ color: 'var(--js)' }}>
            {jsLang.startsWith('t') ? 'TypeScript' : 'JavaScript'}
          </div>
          <Code code={js} lang={jsLang} small />
        </div>
      </div>
      {note && <div className="k-note">{note}</div>}
    </Slide>
  );
}

/** "What does this print?" Step 0 asks, step 1 reveals the answer. */
export function PredictSlide({
  title = 'Predict the output',
  code,
  lang = 'js',
  question = 'What does this print? Decide before you press →',
  answer,
  explanation,
  surprising = false,
  lead,
}: {
  title?: ReactNode;
  lead?: ReactNode;
  code: string;
  lang?: Lang;
  question?: ReactNode;
  answer: ReactNode;
  explanation: ReactNode;
  /** Flags an answer where JavaScript behaves differently from Python. */
  surprising?: boolean;
}) {
  const step = useStep();
  return (
    <Slide title={title} eyebrow="Your turn" lead={lead}>
      <Code code={code} lang={lang} />
      {step === 0 ? (
        <>
          <p className="k-predict-q">{question}</p>
          <p className="k-hidden-hint">Press → to see the answer.</p>
        </>
      ) : (
        <div className="k-answer">
          {surprising && <div className="k-eyebrow" style={{ color: 'var(--backpack)' }}>Different from Python</div>}
          <div>
            Answer: <strong>{answer}</strong>
          </div>
          <div style={{ marginTop: 6 }}>{explanation}</div>
        </div>
      )}
    </Slide>
  );
}
PredictSlide.stepsFor = () => 1;

/** Last slide: what to remember and which exercises come next. */
export function RecapSlide({ points, next }: { points: ReactNode[]; next?: ReactNode }) {
  const meta = useMeta();
  return (
    <Slide title="Recap" eyebrow={meta.title}>
      <ul>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <div className="k-note">
        {next ?? (
          <>
            Next: the exercises in this module's <code>README.md</code>. Check your work with <code>yarn verify {meta.id}</code>.
          </>
        )}
      </div>
    </Slide>
  );
}
