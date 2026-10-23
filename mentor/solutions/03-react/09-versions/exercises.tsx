// 03-react/09 Versions and tooling: React 16 / 18 / 19, CRA and Vite
// Check your work with:   yarn verify 03-react/09
// See it in the browser:  yarn dev 03-react/09
// Most steps are questions about code you will meet in the team's older apps.
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

// Step 1 (core)
export function mount(container: HTMLElement, app: ReactNode): () => void {
  const root = createRoot(container);
  root.render(app);
  return () => root.unmount();
}

// Step 2 (core): React 18 batches updates everywhere; React 17 only inside React's own event handlers.
export const rendersAfterTwoSetters = {
  clickOnReact17: 1 as number | undefined,
  clickOnReact18: 1 as number | undefined,
  timeoutOnReact17: 2 as number | undefined,
  timeoutOnReact18: 1 as number | undefined,
};

// Step 3 (core)
export function envAccess(tool: 'cra' | 'vite', name: string): string {
  return tool === 'cra' ? `process.env.REACT_APP_${name}` : `import.meta.env.VITE_${name}`;
}

// Step 4 (core)
export const tooling = {
  buildFolder: { cra: 'build' as string | undefined, vite: 'dist' as string | undefined },
  proxyFile: { cra: 'package.json' as string | undefined, vite: 'vite.config.ts' as string | undefined },
  envReadAt: 'build' as string | undefined,
};

// Step 5 (core)
export const breaksInReact19: Record<'A' | 'B' | 'C' | 'D', boolean | undefined> = {
  // removed in 19
  A: true,
  // the way since 18
  B: false,
  // defaultProps on function components were removed in 19: use a default value when destructuring
  C: true,
  // still works in 19 (ref can now also be a normal prop)
  D: false,
};

// Step 6 (stretch)
export function buildTool(packageJson: { scripts?: Record<string, string> }): 'cra' | 'vite' | 'unknown' {
  const scripts = Object.values(packageJson.scripts ?? {}).join(' ');
  if (scripts.includes('react-scripts')) return 'cra';
  if (/\bvite\b/.test(scripts)) return 'vite';
  return 'unknown';
}
