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

function clean(message = '') {
  // eslint-disable-next-line no-control-regex
  return message
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split(/\n\s*Ignored nodes:/)[0]
    .trim()
    .split('\n')
    .slice(0, 8)
    .join('\n');
}
