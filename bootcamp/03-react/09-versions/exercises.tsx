// 03-react/09 Versions and tooling: React 16 / 18 / 19, CRA and Vite
//
// What you build: answers to the version questions you meet in the team's older apps, and one real fix.
// Finished when:  `yarn verify 03-react/09` shows ✓ for steps 1 to 5. Stretch steps are optional.
// Every step says What to do, the Result to expect, and what it Needs (a lesson slide, or an earlier module).
//
// Check your work with:   yarn verify 03-react/09
// See it in the browser:  yarn dev 03-react/09
// Most steps are questions about code you will meet in the team's older apps.
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';

// Step 1 (core): mount the React 18 way
// What:   mount() starts an app the React 16 and 17 way. On React 18 it still works, but it runs the app
//         in "React 17 mode" (no automatic batching) and the console warns about it.
//         Start the app the React 18 way instead, and return a function that unmounts it.
// Result: the app shows, the console has no warning, and calling the returned function removes it.
// Needs:  slide "Starting the app: render versus createRoot".
export function mount(container: HTMLElement, app: ReactNode): () => void {
  ReactDOM.render(<>{app}</>, container);
  return () => {
    ReactDOM.unmountComponentAtNode(container);
  };
}

// Step 2 (core): count the renders
// What:   A handler calls two state setters:  setSaving(false); setError(message);
//         How many renders follow? Replace each undefined with a number.
// Result: every undefined is a number.
// Needs:  slide "Starting the app: render versus createRoot" (automatic batching).
export const rendersAfterTwoSetters = {
  // the two calls run inside a click handler
  clickOnReact17: undefined as number | undefined,
  clickOnReact18: undefined as number | undefined,
  // the two calls run later, inside a setTimeout or after an await
  timeoutOnReact17: undefined as number | undefined,
  timeoutOnReact18: undefined as number | undefined,
};

// Step 3 (core): environment variables
// What:   How does code read an environment variable called name (for example "API_URL")?
//         Return the expression as a string. CRA: process.env with the REACT_APP_ prefix.
//         Vite: import.meta.env with the VITE_ prefix.
// Result: envAccess('vite', 'API_URL') → 'import.meta.env.VITE_API_URL';
//         envAccess('cra', 'API_URL') → 'process.env.REACT_APP_API_URL'
// Needs:  slide "Create React App and Vite".
export function envAccess(tool: 'cra' | 'vite', name: string): string {
  throw new Error('TODO: step 3');
}

// Step 4 (core): where things are
// What:   Where things are in each tool. Fill in each undefined from the lesson's table.
// Result: every undefined is one of the answers its comment offers.
// Needs:  slides "Create React App and Vite" and "What yarn build makes".
export const tooling = {
  // the folder that `yarn build` writes: 'build' or 'dist'
  buildFolder: { cra: undefined as string | undefined, vite: undefined as string | undefined },
  // the file that sets up the /api proxy: 'package.json' or 'vite.config.ts'
  proxyFile: { cra: undefined as string | undefined, vite: undefined as string | undefined },
  // env variables are put into the code when you run... 'yarn build', or each time a user opens the page?
  // Answer 'build' or 'page load'.
  envReadAt: undefined as string | undefined,
};

// Step 5 (core): what React 19 breaks
// What:   You upgrade an app from React 18 to React 19. Which of these stop working? true or false.
// Result: every letter is true or false.
// Needs:  slide "React 19: what changed".
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

// Step 6 (stretch): which tool builds it?
// What:   Given a package.json, which tool builds the app? Look at the "start" or "dev" script:
//         react-scripts means 'cra', vite means 'vite', anything else 'unknown'.
// Result: { scripts: { start: 'react-scripts start' } } → 'cra';  { scripts: { dev: 'vite' } } → 'vite';  {} → 'unknown'
// Needs:  ?. and includes (cheat sheet).
export function buildTool(packageJson: { scripts?: Record<string, string> }): 'cra' | 'vite' | 'unknown' {
  throw new Error('TODO: step 6');
}
