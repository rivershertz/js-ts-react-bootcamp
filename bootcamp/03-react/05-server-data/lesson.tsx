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
  id: '03-react/05',
  title: 'Server data with React Query',
  time: '15 min lesson · 25 min exercises',
  subtitle: 'Data from the server lives in a shared cache, not in component state. React Query owns that cache.',
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={["The final project's api/tickets.js is built from what this deck shows"]} />

      <Slide title="Server data is not like other state" eyebrow="Why a library">
        <div className="k-cols" style={{ height: 'auto' }}>
          <div>
            <div className="k-col-label">With useState and useEffect, you write</div>
            <ul>
              <li>a loading flag and an error flag, in every component</li>
              <li>one request per component that needs the data</li>
              <li>a way to load again after a save</li>
              <li>retries when the network blinks</li>
            </ul>
          </div>
          <div>
            <div className="k-col-label">With React Query, you get</div>
            <ul>
              <li>one cache for the app, shared by key</li>
              <li>
                <code>isPending</code>, <code>isError</code>, <code>refetch</code> from one hook
              </li>
              <li>one request for many components</li>
              <li>retries and refreshing for free</li>
            </ul>
          </div>
        </div>
        <div className="k-note">
          The server owns this data. Your app holds a copy that can go out of date. React Query&apos;s job is keeping that copy
          fresh.
        </div>
      </Slide>

      <Slide title="useQuery: a key and a function" eyebrow="Queries">
        <Code
          lang="tsx"
          code={`
function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => client.get<Ticket[]>('/tickets').then((r) => r.data),
  });
}
const { data, isPending, isError, refetch } = useTickets();`}
        />
        <ul>
          <li>The key names the data in the cache, like a dict key. The function returns a Promise.</li>
          <li>
            One custom hook per query (module 04). The cache comes from <code>&lt;QueryClientProvider&gt;</code> in{' '}
            <code>main.tsx</code>.
          </li>
        </ul>
      </Slide>

      <SequenceSlide
        title="Two components, one request"
        eyebrow="The cache · press → to step"
        actors={[
          { id: 'count', label: 'TicketCount', detail: 'useTickets()' },
          { id: 'list', label: 'TicketList', detail: 'useTickets()' },
          { id: 'cache', label: 'QueryClient', detail: 'the cache' },
          { id: 'api', label: 'Python API', detail: '/api/tickets' },
        ]}
        messages={[
          { from: 'count', to: 'cache', label: "['tickets']?", note: "Nothing is stored under ['tickets'] yet. TicketCount renders with isPending: true." },
          { from: 'cache', to: 'api', label: 'GET /api/tickets', note: 'React Query calls queryFn once.' },
          { from: 'list', to: 'cache', label: "['tickets']?", note: 'TicketList asks for the same key while the request runs. No second request: it waits for the same one.' },
          { from: 'api', to: 'cache', label: '200 JSON', reply: true, note: "The answer is stored under ['tickets']." },
          { from: 'cache', to: 'count', label: 'data', reply: true, note: 'Every component that uses the key renders again, with the data.' },
          { from: 'cache', to: 'list', label: 'data', reply: true, note: 'Same data, same object. Do not mutate it (module 02): every reader shares it.' },
          {
            from: 'cache',
            to: 'api',
            label: 'GET /api/tickets',
            note: 'Later you switch back to this browser tab. Cached data counts as stale at once, so React Query loads it again in the background, and the page keeps showing the old data until the answer arrives.',
          },
        ]}
      />

      <Slide title="Three states, in this order" eyebrow="Loading and errors">
        <Code
          lang="tsx"
          code={`
const { data, isPending, isError, refetch } = useAssignees();

if (isPending) return <Spin />;
if (isError) {
  const retry = <Button onClick={() => refetch()}>Retry</Button>;
  return <Alert type="error" message="Could not load people" action={retry} />;
}
// Here data is Assignee[], not undefined
return <AssigneeList assignees={data} />;`}
        />
        <ul>
          <li>
            <code>isPending</code>: no data yet. <code>isFetching</code>: any request running, background ones too.
          </li>
          <li>
            A failed query retries 3 times first, so with <code>--fail tickets</code> the error takes a few seconds to show.
          </li>
        </ul>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => client.get<Ticket>(\`/tickets/\${id}\`).then((r) => r.data),
  });
}

// The New ticket page has no id, so it calls useTicket(undefined)`}
        question="What does the Network tab show when the New ticket page opens?"
        answer="GET /api/tickets/undefined, answered with 404"
        explanation={
          <>
            A query runs as soon as its component mounts. <code>enabled: id !== undefined</code> holds it until there is an id. Do
            not wrap the hook in an <code>if</code> instead: hooks run on every render (module 02).
          </>
        }
      />

      <Slide title="Query keys are arrays, matched by prefix" eyebrow="Keys">
        <table className="k-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Holds</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">[&apos;tickets&apos;]</td>
              <td>the list</td>
            </tr>
            <tr>
              <td className="mono">[&apos;tickets&apos;, &apos;t2&apos;]</td>
              <td>one ticket</td>
            </tr>
            <tr>
              <td className="mono">[&apos;tickets&apos;, {'{ status: \'open\' }'}]</td>
              <td>a list the server filtered</td>
            </tr>
          </tbody>
        </table>
        <ul>
          <li>
            The key holds every value the query function uses, like an effect&apos;s dependencies. A new id is a new cache entry.
          </li>
          <li>
            Telling React Query that <code>[&apos;tickets&apos;]</code> is out of date also covers every key that starts with it:
            all three rows above.
          </li>
        </ul>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
const close = useMutation({
  mutationFn: (t: Ticket) =>
    client.put(\`/tickets/\${t.id}\`, { ...t, status: 'closed' }),
});

<button onClick={() => close.mutate(ticket)}>Close</button>
// The list on the same page comes from useTickets()`}
        question="The PUT answers 200. What does the list show for that ticket?"
        answer="Still the old status, until something loads ['tickets'] again"
        explanation={
          <>
            React Query cannot know that this PUT changed the data under <code>[&apos;tickets&apos;]</code>. You tell it, after the
            save succeeds.
          </>
        }
      />

      <Slide title="useMutation: change data, then mark it stale" eyebrow="Mutations">
        <Code
          lang="tsx"
          code={`
function useSaveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (t: Ticket) => client.put(\`/tickets/\${t.id}\`, t),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}
const save = useSaveTicket();
<Button loading={save.isPending} onClick={() => save.mutate(t)}>Save</Button>`}
        />
        <div className="k-note">
          <code>invalidateQueries</code> marks the data stale: queries on screen load again at once.
        </div>
      </Slide>

      <Slide title="Stretch: start from data you already have" eyebrow="initialData">
        <Code
          lang="tsx"
          code={`
const queryClient = useQueryClient();
return useQuery({
  queryKey: ['tickets', id],
  queryFn: ...,
  enabled: id !== undefined,
  initialData: () =>
    queryClient.getQueryData<Ticket[]>(['tickets'])?.find((t) => t.id === id),
});`}
        />
        <div className="k-note">
          Opening a ticket from the list shows it at once, with no loading state, and the request still runs to get the latest
          version.
        </div>
      </Slide>

      <RecapSlide
        points={[
          'Server data goes in the React Query cache, not useState. One custom hook per query.',
          'useQuery takes a key and a function. The same key means one request and one copy.',
          'Handle isPending, then isError (with a Retry that calls refetch), then the data.',
          'enabled holds a query until its input is ready. Never put the hook inside an if.',
          'After a mutation succeeds, invalidateQueries marks the data stale, and the screen loads it again.',
          'The Network tab shows every request your queries make.',
        ]}
        next="Module 06: antd's Table and Form, filled from these hooks."
      />
    </Deck>
  );
}
