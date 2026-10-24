import { Children, isValidElement, useCallback, useEffect, useLayoutEffect, useState, type ReactElement, type ReactNode } from 'react';
import { DeckContext, type DeckMeta } from './context';

/** A slide component can declare how many build steps it has from its props. */
type StepsFor = { stepsFor?: (props: Record<string, unknown>) => number };

function stepsOf(slide: ReactElement): number {
  const props = slide.props as { steps?: number };
  if (typeof props.steps === 'number') return props.steps;
  const type = slide.type as StepsFor;
  return type.stepsFor ? type.stepsFor(slide.props as Record<string, unknown>) : 0;
}

type Props = {
  meta: DeckMeta;
  children: ReactNode;
  /** 0-based slide to start on (from the URL). */
  initialSlide?: number;
  onSlideChange?: (index: number) => void;
};

export function Deck({ meta, children, initialSlide = 0, onSlideChange }: Props) {
  const slides = Children.toArray(children).filter(isValidElement);
  const [index, setIndex] = useState(Math.min(initialSlide, slides.length - 1));
  const [step, setStep] = useState(0);
  const [help, setHelp] = useState(false);
  const scale = useFitScale();
  const maxStep = stepsOf(slides[index]);

  const go = useCallback(
    (nextIndex: number, nextStep = 0) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, nextIndex));
      setIndex(clamped);
      setStep(nextStep);
      onSlideChange?.(clamped);
    },
    [slides.length, onSlideChange],
  );

  const next = useCallback(() => {
    if (step < maxStep) setStep(step + 1);
    else if (index < slides.length - 1) go(index + 1);
  }, [step, maxStep, index, slides.length, go]);

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1);
    else if (index > 0) go(index - 1, stepsOf(slides[index - 1]));
  }, [step, index, slides, go]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof Element && e.target.closest('textarea, input')) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') next();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(slides.length - 1);
      else if (e.key === '?') setHelp((h) => !h);
      else if (e.key === 'Escape' && help) setHelp(false);
      else if (e.key === 'Escape') location.hash = '#/';
      else if (e.key === 'd') toggleTheme();
      else return;
      e.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, go, help, slides.length]);

  useEffect(() => {
    document.title = `${meta.id} ${meta.title}`;
  }, [meta]);

  const progress = (index + (maxStep ? step / (maxStep + 1) : 0)) / Math.max(1, slides.length - 1);

  return (
    <DeckContext.Provider value={{ meta, step }}>
      <div className="k-viewport">
        <div className="k-stage" style={{ transform: `scale(${scale})` }}>
          {slides[index]}
          <div className="k-footer">
            <a href="#/" style={{ color: 'inherit' }} title="All lessons (Esc)">
              {meta.id}
            </a>
            <span>{meta.title}</span>
            <div className="k-progress" aria-hidden>
              <div style={{ width: `${Math.min(1, progress) * 100}%` }} />
            </div>
            <span>
              {index + 1} / {slides.length}
            </span>
            <button className="k-navbtn" onClick={prev} aria-label="Previous">
              ‹
            </button>
            <button className="k-navbtn" onClick={next} aria-label="Next">
              ›
            </button>
            <button className="k-navbtn" onClick={() => setHelp(true)} aria-label="Keyboard help">
              ?
            </button>
          </div>
        </div>
      </div>
      {help && <Help onClose={() => setHelp(false)} />}
    </DeckContext.Provider>
  );
}

function Help({ onClose }: { onClose: () => void }) {
  return (
    <div className="k-help" onClick={onClose}>
      <div>
        <div><kbd>→</kbd>or <kbd>Space</kbd> next step or slide</div>
        <div><kbd>←</kbd>previous</div>
        <div><kbd>Home</kbd><kbd>End</kbd> first or last slide</div>
        <div><kbd>d</kbd>switch light and dark</div>
        <div><kbd>Esc</kbd>back to all lessons</div>
        <div className="k-muted" style={{ marginTop: 12, fontSize: 15 }}>Click anywhere to close.</div>
      </div>
    </div>
  );
}

function useFitScale() {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1320, window.innerHeight / 760));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return scale;
}

export function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try {
    localStorage.setItem('bootcamp-theme', root.dataset.theme);
  } catch {
    // Storage can be blocked; the theme still switches for this page.
  }
}
