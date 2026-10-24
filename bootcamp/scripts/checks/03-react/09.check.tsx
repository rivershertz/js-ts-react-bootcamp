// @vitest-environment jsdom
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import { ensure } from '../../lib/ensure';
import { defineSteps } from '../../lib/steps';
import { load } from '../../lib/paths';
import { callPure } from '../../lib/pure';

type Answers<T> = Record<string, T | undefined>;
type Exercises = {
  mount: (container: HTMLElement, app: unknown) => () => void;
  rendersAfterTwoSetters: Answers<number>;
  envAccess: (tool: 'cra' | 'vite', name: string) => string;
  tooling: { buildFolder: Answers<string>; proxyFile: Answers<string>; envReadAt?: string };
  breaksInReact19: Answers<boolean>;
  buildTool: (packageJson: { scripts?: Record<string, string> }) => string;
};

const step = defineSteps('03-react/09');
const ex = () => load<Exercises>('03-react/09-versions/exercises');

function answer<T>(value: T | undefined, expected: T, name: string, why: string) {
  ensure(value !== undefined, `Answer ${name}`);
  ensure(value === expected, `${name}: think again. ${why}`);
}

step(1, async () => {
  const { mount } = await ex();
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const container = document.createElement('div');
    let unmount: () => void = () => {};
    // React's act() expects this flag in a test environment.
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    act(() => {
      unmount = mount(container, <p>Hello from the app</p>);
    });
    ensure(container.textContent === 'Hello from the app', 'mount should render the app into the container');
    const legacy = errors.mock.calls.some((args) => String(args[0]).includes('ReactDOM.render is no longer supported'));
    ensure(!legacy, 'React warns: "ReactDOM.render is no longer supported in React 18". Use createRoot from react-dom/client.');
    ensure(typeof unmount === 'function', 'mount should return a function that unmounts the app');
    act(() => unmount());
    ensure(container.textContent === '', 'Calling the returned function should unmount the app (root.unmount())');
  } finally {
    errors.mockRestore();
  }
});

step(2, async () => {
  const { rendersAfterTwoSetters: r } = await ex();
  answer(r.clickOnReact17, 1, 'clickOnReact17', 'Did React 17 already batch updates inside its own event handlers?');
  answer(r.clickOnReact18, 1, 'clickOnReact18', 'Does React 18 batch updates in a click handler?');
  answer(r.timeoutOnReact17, 2, 'timeoutOnReact17', 'Outside React event handlers, did React 17 batch?');
  answer(r.timeoutOnReact18, 1, 'timeoutOnReact18', 'What does "automatic batching" in React 18 mean?');
});

step(3, async () => {
  const { envAccess } = await ex();
  const cases: [('cra' | 'vite'), string, string][] = [
    ['vite', 'API_URL', 'import.meta.env.VITE_API_URL'],
    ['cra', 'API_URL', 'process.env.REACT_APP_API_URL'],
    ['vite', 'MAP_KEY', 'import.meta.env.VITE_MAP_KEY'],
    ['cra', 'VERSION', 'process.env.REACT_APP_VERSION'],
  ];
  for (const [tool, name, expected] of cases) {
    const got = callPure(envAccess, tool, name);
    ensure(got === expected, `envAccess('${tool}', '${name}') should be '${expected}', not ${JSON.stringify(got)}`);
  }
});

step(4, async () => {
  const { tooling } = await ex();
  answer(tooling.buildFolder.cra, 'build', 'buildFolder.cra', 'Where does react-scripts build write its files?');
  answer(tooling.buildFolder.vite, 'dist', 'buildFolder.vite', 'Where does vite build write its files?');
  answer(tooling.proxyFile.cra, 'package.json', 'proxyFile.cra', 'Where does a CRA app usually say "proxy": "http://localhost:8000"?');
  answer(tooling.proxyFile.vite, 'vite.config.ts', 'proxyFile.vite', 'Where is server.proxy set in a Vite app?');
  answer(tooling.envReadAt, 'build', 'envReadAt', 'Is there a Node process reading .env when a user opens the built page?');
});

step(5, async () => {
  const { breaksInReact19: b } = await ex();
  answer(b.A, true, 'A', 'Which entry point API was removed in React 19?');
  answer(b.B, false, 'B', 'Which entry point has React used since version 18?');
  answer(b.C, true, 'C', 'What happened to defaultProps on function components in React 19?');
  answer(b.D, false, 'D', 'Was forwardRef removed, or is there just a new, simpler way?');
});

step(6, async () => {
  const { buildTool } = await ex();
  const cases: [{ scripts?: Record<string, string> }, string][] = [
    [{ scripts: { start: 'react-scripts start', build: 'react-scripts build' } }, 'cra'],
    [{ scripts: { dev: 'vite', build: 'tsc -b && vite build' } }, 'vite'],
    [{ scripts: { start: 'webpack serve' } }, 'unknown'],
    [{}, 'unknown'],
  ];
  for (const [packageJson, expected] of cases) {
    const got = callPure(buildTool, packageJson);
    ensure(got === expected, `buildTool(${JSON.stringify(packageJson)}) should be '${expected}', not ${JSON.stringify(got)}`);
  }
});
