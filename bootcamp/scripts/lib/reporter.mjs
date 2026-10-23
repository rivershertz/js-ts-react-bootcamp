import { writeFileSync } from 'node:fs';

/** Vitest reporter used by `yarn verify`: writes plain results for the runner to print. */
export default class VerifyReporter {
  onFinished(files = []) {
    const results = [];
    for (const file of files) {
      const fileError = file.result?.errors?.[0];
      for (const task of walk(file)) {
        const match = /^step (\d+)$/.exec(task.name);
        if (!match) continue;
        const state = task.result?.state ?? (task.mode === 'skip' ? 'skip' : 'fail');
        const error = task.result?.errors?.[0] ?? (state === 'fail' ? fileError : undefined);
        results.push({ n: Number(match[1]), state, message: error ? clean(error.message) : undefined });
      }
      if (fileError && results.length === 0) results.push({ n: 0, state: 'fail', message: clean(fileError.message) });
    }
    writeFileSync(process.env.VERIFY_OUT, JSON.stringify(results));
  }
}

function* walk(task) {
  for (const child of task.tasks ?? []) {
    if (child.type === 'test') yield child;
    else yield* walk(child);
  }
}

const MAX_LINES = 10;

function clean(message = '') {
  const lines = message
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split(/\n\s*Ignored nodes:/)[0]
    .trim()
    .split('\n');
  if (lines.length <= MAX_LINES) return lines.join('\n');
  // Say how much was left out, so a long list never looks shorter than it is.
  const more = lines.length - MAX_LINES;
  return [...lines.slice(0, MAX_LINES), `... and ${more} more line${more === 1 ? '' : 's'}. Fix these first, then run it again.`].join('\n');
}
