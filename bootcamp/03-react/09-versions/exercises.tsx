// 03-react/09 Versions and tooling: React 16 / 18 / 19, CRA and Vite
// Check your work with:   yarn verify 03-react/09
// See it in the browser:  yarn dev 03-react/09
// Most steps are questions about code you will meet in the team's older apps.
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';

// Step 1 (core)
// mount() starts an app the React 16 and 17 way. On React 18 it still works, but it runs the app
// in "React 17 mode" (no automatic batching) and the console warns about it.
// Start the app the React 18 way instead, and return a function that unmounts it.
export function mount(container: HTMLElement, app: ReactNode): () => void {
  ReactDOM.render(<>{app}</>, container);
  return () => {
    ReactDOM.unmountComponentAtNode(container);
  };
}

// Step 2 (core)
// A handler calls two state setters:  setSaving(false); setError(message);
// How many renders follow? Replace each undefined with a number.
export const rendersAfterTwoSetters = {
  // the two calls run inside a click handler
  clickOnReact17: undefined as number | undefined,
  clickOnReact18: undefined as number | undefined,
  // the two calls run later, inside a setTimeout or after an await
  timeoutOnReact17: undefined as number | undefined,
  timeoutOnReact18: undefined as number | undefined,
};

// Step 3 (core)
// How does code read an environment variable called name (for example "API_URL")?
// Return the expression as a string. CRA: process.env with the REACT_APP_ prefix.
// Vite: import.meta.env with the VITE_ prefix.
// envAccess('vite', 'API_URL') gives 'import.meta.env.VITE_API_URL'.
export function envAccess(tool: 'cra' | 'vite', name: string): string {
  throw new Error('TODO: step 3');
}

// Step 4 (core)
// Where things are in each tool. Fill in each undefined from the lesson's table.
export const tooling = {
  // the folder that `yarn build` writes: 'build' or 'dist'
  buildFolder: { cra: undefined as string | undefined, vite: undefined as string | undefined },
  // the file that sets up the /api proxy: 'package.json' or 'vite.config.ts'
  proxyFile: { cra: undefined as string | undefined, vite: undefined as string | undefined },
  // env variables are put into the code when you run... 'yarn build', or each time a user opens the page?
  // Answer 'build' or 'page load'.
  envReadAt: undefined as string | undefined,
};

// Step 5 (core)
// You upgrade an app from React 18 to React 19. Which of these stop working? true or false.
export const breaksInReact19: Record<'A' | 'B' | 'C' | 'D', boolean | undefined> = {
  // A: ReactDOM.render(<App />, document.getElementById('root'))
  A: undefined,
  // B: createRoot(document.getElementById('root')!).render(<App />)
  B: undefined,
  // C: function Badge({ size }) { ... }  with  Badge.defaultProps = { size: 'small' }
  C: undefined,
  // D: const Input = forwardRef((props, ref) => <input ref={ref} {...props} />)
  D: undefined,
};

// Step 6 (stretch)
// Given a package.json, which tool builds the app? Look at the "start" or "dev" script:
// react-scripts means 'cra', vite means 'vite', anything else 'unknown'.
export function buildTool(packageJson: { scripts?: Record<string, string> }): 'cra' | 'vite' | 'unknown' {
  throw new Error('TODO: step 6');
}
