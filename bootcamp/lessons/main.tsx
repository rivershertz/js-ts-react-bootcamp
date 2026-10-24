// The lessons app: a list of decks, and one deck at a time. Run with: yarn lessons
import { StrictMode, useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import type { DeckMeta } from './kit';
import * as galleryModule from './kit/Gallery';
import './kit/tokens.css';
import './kit/kit.css';

type DeckModule = { meta: DeckMeta; default: ComponentType<{ initialSlide?: number; onSlideChange?: (i: number) => void }> };

// Every module folder may have a lesson.tsx. They are found automatically.
const decks = Object.values(import.meta.glob<DeckModule>('../0*/**/lesson.tsx', { eager: true })).sort((a, b) =>
  a.meta.id.localeCompare(b.meta.id),
);

const gallery: DeckModule = galleryModule;

const PHASES: Record<string, string> = {
  '00': 'Phase 0 · Setup',
  '01': 'Phase 1 · JavaScript',
  '02': 'Phase 2 · TypeScript',
  '03': 'Phase 3 · React and antd',
};

try {
  const saved = localStorage.getItem('bootcamp-theme');
  if (saved) document.documentElement.dataset.theme = saved;
} catch {
  // Storage can be blocked; the system theme is used instead.
}

function parseHash() {
  // #/01-js/03 opens a deck; #/01-js/03/5 opens it at slide 5. Same for single-part ids like #/00-setup/5.
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const last = parts.at(-1) ?? '';
  if (/^\d+$/.test(last) && ![...decks, gallery].some((d) => d.meta.id === parts.join('/'))) {
    return { id: parts.slice(0, -1).join('/'), slide: Number(last) - 1 };
  }
  return { id: parts.join('/'), slide: 0 };
}

function App() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const deck = [...decks, gallery].find((d) => d.meta.id === route.id);
  if (!deck) return <Index />;
  const Lesson = deck.default;
  return (
    <Lesson
      key={deck.meta.id}
      initialSlide={route.slide}
      onSlideChange={(i) => history.replaceState(null, '', `#/${deck.meta.id}/${i + 1}`)}
    />
  );
}

function Index() {
  useEffect(() => {
    document.title = 'Bootcamp lessons';
  }, []);
  const byPhase = Object.groupBy(decks, (d) => d.meta.id.slice(0, 2));
  return (
    <main className="k-index">
      <h1>Lessons</h1>
      <p className="k-muted">Open a lesson, then use → and ← to move. Press ? inside a lesson for all keys.</p>
      {Object.entries(byPhase).map(([phase, list]) => (
        <section key={phase}>
          <h2>{PHASES[phase] ?? phase}</h2>
          {list?.map((d) => (
            <a key={d.meta.id} className="k-card" href={`#/${d.meta.id}`}>
              <span className="k-card-id">{d.meta.id}</span>
              <span>{d.meta.title}</span>
              <span className="k-card-time">{d.meta.time}</span>
            </a>
          ))}
        </section>
      ))}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
