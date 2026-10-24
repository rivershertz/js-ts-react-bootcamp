import type { ReactNode } from 'react';
import { Code } from './Code';
import { useStep } from './context';
import { Slide } from './Slides';

export type TreeNode = { name: string; children?: TreeNode[] };
export type RenderStep = {
  note: ReactNode;
  /** Components that rendered in this step. */
  rendered?: string[];
  /** What React did, in order: 'render App', 'commit', 'effect: fetch tickets'... */
  log?: string[];
  line?: number;
};

function Node({ node, rendered }: { node: TreeNode; rendered: string[] }) {
  return (
    <li>
      <span className={`k-tree-node${rendered.includes(node.name) ? ' on' : ''}`}>&lt;{node.name} /&gt;</span>
      {node.children && (
        <ul>
          {node.children.map((c) => (
            <Node key={c.name} node={c} rendered={rendered} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Which components re-render, and what React does, one build step at a time. */
export function RenderSlide({ title, eyebrow, code, tree, steps }: { title: ReactNode; eyebrow?: ReactNode; code?: string; tree: TreeNode; steps: RenderStep[] }) {
  const i = useStep();
  const now = steps[Math.min(i, steps.length - 1)];
  // Keep the newest lines; older ones scroll away like a terminal.
  const log = steps
    .slice(0, i + 1)
    .flatMap((s) => s.log ?? [])
    .slice(-9);
  return (
    <Slide title={title} eyebrow={eyebrow}>
      <div className="k-walk" style={code ? undefined : { gridTemplateColumns: '1fr' }}>
        {code ? <Code code={code} active={now.line} small /> : null}
        <div className="k-walk-right" style={{ gridTemplateRows: '1fr auto' }}>
          <div className="k-render-top">
            <ul className="k-tree">
              <Node node={tree} rendered={now.rendered ?? []} />
            </ul>
            <ol className="k-render-log">
              {log.map((l, n) => (
                <li key={n} className={n >= log.length - (now.log?.length ?? 0) ? 'new' : ''}>
                  {l}
                </li>
              ))}
            </ol>
          </div>
          <div className="k-walk-note">{now.note}</div>
        </div>
      </div>
    </Slide>
  );
}
RenderSlide.stepsFor = (props: Record<string, unknown>) => (props.steps as RenderStep[]).length - 1;
