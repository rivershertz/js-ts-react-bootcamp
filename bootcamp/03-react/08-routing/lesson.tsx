import {
  Code,
  Deck,
  PredictSlide,
  RecapSlide,
  SequenceSlide,
  Slide,
  TitleSlide,
  type DeckMeta,
  type LessonProps,
} from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '03-react/08',
  title: 'Routing with React Router',
  time: '20 min lesson · 30 min exercises',
  subtitle: 'One HTML page, many URLs. The router reads the URL and picks the page component.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={['The final project has a list page and a create / edit page', 'React Router 6']} />

      <Slide title="The URL is state the user can keep" eyebrow="Why a router">
        <ul>
          <li>The server sends one HTML page. After that, the app changes what is on screen without loading pages.</li>
          <li>
            The router keeps the URL in step with the screen, so the user can bookmark it, share it, refresh it, and use the
            back button.
          </li>
          <li>
            Refreshing <code>/tickets/t2</code> asks the server for that path. Vite&apos;s dev server answers with the same{' '}
            <code>index.html</code>; in production, the web server must be set up to do the same.
          </li>
        </ul>
        <div className="k-note">Like Flask or Django URL patterns, except they run in the browser and pick a component.</div>
      </Slide>

      <Slide title="Routes: a URL pattern per page" eyebrow="Routes">
        <Code
          lang="tsx"
          code={`
// main.tsx: <BrowserRouter> around the whole app, once
<Routes>
  <Route path="/tickets" element={<TicketListPage />} />
  <Route path="/tickets/new" element={<TicketFormPage />} />
  <Route path="/tickets/:id" element={<TicketFormPage />} />
  <Route path="*" element={<Navigate to="/tickets" replace />} />
</Routes>`}
        />
        <ul>
          <li>
            <code>:id</code> matches any one segment. <code>/tickets/new</code> wins over it: React Router picks the most
            specific pattern, not the first one listed.
          </li>
          <li>
            <code>*</code> catches every other URL. <code>replace</code> swaps the bad URL out of the history.
          </li>
        </ul>
      </Slide>

      <SequenceSlide
        title="Link versus a plain <a href>"
        eyebrow="Navigation · press → to step"
        actors={[
          { id: 'user', label: 'User' },
          { id: 'app', label: 'React app', detail: 'router + cache' },
          { id: 'server', label: 'Server', detail: 'Vite / web server' },
        ]}
        messages={[
          { from: 'user', to: 'app', label: 'click <Link>', note: 'Link stops the browser from loading a page, and tells the router about the new URL.' },
          { from: 'app', to: 'user', label: 'TicketPage', reply: true, note: 'The router renders the matching page. Everything in memory stays: state, the React Query cache.' },
          { from: 'user', to: 'server', label: 'click <a href>', note: 'A plain link makes the browser ask the server for a whole new page.' },
          { from: 'server', to: 'user', label: 'index.html', reply: true, note: 'The app starts again from nothing. Every query fetches again, and anything typed is lost.' },
        ]}
      />

      <Slide title="useParams: the parts of the URL" eyebrow="Parameters">
        <Code
          lang="tsx"
          code={`
// Route: /tickets/:id    URL: /tickets/t2
function TicketFormPage() {
  const { id } = useParams();    // 't2', or undefined on /tickets/new
  const ticket = useTicket(id);  // module 05: enabled: id !== undefined
  ...
}`}
        />
        <div className="k-note">
          From <code>/tickets/t1</code> to <code>/tickets/t2</code> the page stays mounted: same route, same component, new{' '}
          <code>id</code>. State and <code>[]</code> effects from t1 are still there (module 03: a key, or the right
          dependencies).
        </div>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
function TicketListPage() {
  const [status, setStatus] = useState<Status>();
  ...
}

// The user picks status "blocked", then presses F5`}
        question="What does the list show after the refresh?"
        answer="All tickets: the filter is gone"
        explanation={
          <>
            State lives in memory, and a refresh starts the app again. Keep what a user would want to refresh, share or bookmark in
            the URL: <code>/tickets?status=blocked</code>.
          </>
        }
      />

      <Slide title="useSearchParams: state in the URL" eyebrow="Search parameters">
        <Code
          lang="tsx"
          code={`
const [searchParams, setSearchParams] = useSearchParams();
const value = searchParams.get('status');  // string | null
// Check it: anyone can type a URL
const status = isStatus(value) ? value : undefined;

setSearchParams((params) => {
  params.set('status', 'blocked');  // keeps ?sort=... and the rest
  return params;
});`}
        />
        <ul>
          <li>Good for filters, sorting, the page number, the open tab: anything worth a link.</li>
          <li>Values are always strings. Narrow them with a type guard (Phase 2, module 04).</li>
        </ul>
      </Slide>

      <Slide title="useNavigate: go somewhere from code" eyebrow="After a save">
        <Code
          lang="tsx"
          code={`
const navigate = useNavigate();

async function handleSave(values: TicketInput) {
  const saved = await save.mutateAsync(values);
  navigate(\`/tickets/\${saved.id}\`);              // a new entry in the history
}

navigate('/tickets', { replace: true });          // replace this entry instead
navigate(-1);                                      // back, like the browser button`}
        />
        <div className="k-note">
          Use <code>&lt;Link&gt;</code> for things the user clicks to go somewhere, and <code>navigate</code> for &ldquo;after this
          finishes, go there&rdquo;.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'One HTML page; the router maps URL patterns to page components.',
          'Specific patterns beat :params; * catches the rest, with <Navigate replace>.',
          '<Link> changes the URL without reloading. <a href> restarts the app and loses the cache.',
          'useParams reads :id. The same page stays mounted when only the id changes.',
          'Filters a user would share or refresh belong in the URL: useSearchParams, with a type guard.',
          'useNavigate after a save; navigate(-1) to go back.',
        ]}
        next="Module 09: the React and tooling versions you will meet in the team's apps."
      />
    </Deck>
  );
}
