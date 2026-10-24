// Every kit component on one deck, for lesson authors: open #/kit-gallery in `yarn lessons`.
// It is not listed on the lessons page.
import { Deck } from './Deck';
import { EventLoopSlide } from './EventLoop';
import { RenderSlide } from './RenderTree';
import type { LessonProps } from './index';

export const meta = { id: 'kit-gallery', title: 'Lesson kit gallery', time: 'for authors' };

export default function Gallery(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <EventLoopSlide
        title="Timers wait behind promises"
        eyebrow="EventLoopSlide"
        code={`console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');`}
        steps={[
          { line: 1, note: 'Synchronous code runs first, line by line.', stack: ['global'], output: ['A'] },
          { line: 2, note: 'setTimeout hands the callback to the timer system and moves on at once.', stack: ['global'], waiting: ['timer 0 ms → log B'], output: ['A'] },
          { line: 2, note: 'Zero ms later the timer fires; its callback joins the task queue.', stack: ['global'], tasks: ['log B'], output: ['A'] },
          { line: 3, note: 'The resolved promise queues its .then callback as a microtask.', stack: ['global'], tasks: ['log B'], microtasks: ['log C'], output: ['A'] },
          { line: 4, note: 'D logs. The script is done and the call stack is empty.', stack: [], tasks: ['log B'], microtasks: ['log C'], output: ['A', 'D'] },
          { note: 'With an empty stack, all microtasks run first.', stack: ['log C'], tasks: ['log B'], output: ['A', 'D', 'C'] },
          { note: 'Only then does the loop take the next task.', stack: ['log B'], output: ['A', 'D', 'C', 'B'] },
        ]}
      />
      <RenderSlide
        title="Who re-renders when state changes"
        eyebrow="RenderSlide"
        tree={{ name: 'TicketListPage', children: [{ name: 'SearchBox' }, { name: 'TicketTable', children: [{ name: 'Row' }] }, { name: 'StatsPanel' }] }}
        steps={[
          { note: 'First render: every component renders once.', rendered: ['TicketListPage', 'SearchBox', 'TicketTable', 'Row', 'StatsPanel'], log: ['render TicketListPage', 'render children', 'commit to the DOM', 'run effects'] },
          { note: 'You type a letter. setSearch runs in TicketListPage, so it and all its children render again.', rendered: ['TicketListPage', 'SearchBox', 'TicketTable', 'Row', 'StatsPanel'], log: ['event: type "l"', 'render TicketListPage + children', 'commit'] },
          { note: 'With StatsPanel wrapped in memo and stable props, React skips it.', rendered: ['TicketListPage', 'SearchBox', 'TicketTable', 'Row'], log: ['event: type "o"', 'render (StatsPanel skipped)', 'commit'] },
        ]}
      />
    </Deck>
  );
}
