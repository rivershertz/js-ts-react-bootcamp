// Playground for this module. Run: yarn dev 03-react/08
// Edit exercises.tsx and this page updates. Errors from unfinished steps show in red.
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Step } from '../../playground/Step';
import { AppRoutes } from './exercises';

// Shows the URL inside the page too, so you can watch it change.
function CurrentUrl() {
  const location = useLocation();
  return (
    <p style={{ fontFamily: 'monospace', background: '#f6f8fa', padding: 8 }}>
      URL: {location.pathname}
      {location.search}
    </p>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto' }}>
      <h1>Routing playground</h1>
      <p>
        Start at <a href="/tickets">/tickets</a>. Try the browser's back and forward buttons, refresh on a filtered list, and
        type a URL that does not exist.
      </p>
      <CurrentUrl />
      <Step title="The app">
        <AppRoutes />
      </Step>
    </main>
  </BrowserRouter>,
);
