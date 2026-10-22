import path from 'node:path';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { root } from './paths';

type TypeError = { file: string; line: number; message: string };

const cache = new Map<string, TypeError[]>();

/** Type-check the given files with the bootcamp tsconfig and return every error. */
export function typeErrors(files: string[]): TypeError[] {
  const key = files.join('|');
  if (cache.has(key)) return cache.get(key)!;
  const config = ts.getParsedCommandLineOfConfigFile(path.join(root, 'tsconfig.json'), {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: () => {},
  })!;
  const program = ts.createProgram(files, config.options);
  const errors = ts.getPreEmitDiagnostics(program).flatMap((d) => {
    if (!d.file || d.start === undefined) return [];
    const { line } = d.file.getLineAndCharacterOfPosition(d.start);
    return [{ file: path.resolve(d.file.fileName), line: line + 1, message: ts.flattenDiagnosticMessageText(d.messageText, '\n') }];
  });
  cache.set(key, errors);
  return errors;
}

/**
 * The step a line belongs to, from `// @step N` markers in the file.
 * Lines before the first marker belong to every step (returns undefined).
 */
function stepAt(file: string, line: number): number | undefined {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let current: number | undefined;
  for (let i = 0; i < line && i < lines.length; i++) {
    const marker = /\/\/\s*@step\s+(\d+)/.exec(lines[i]);
    if (marker) current = Number(marker[1]);
  }
  return current;
}

/** Type errors that belong to step n, formatted for the junior. */
export function typeErrorsForStep(files: string[], n: number): string[] {
  return typeErrors(files)
    .filter((e) => {
      const s = stepAt(e.file, e.line);
      return s === undefined || s === n;
    })
    .map((e) => {
      // A failed Expect<Equal<...>> in a check file: show the explanation written above it.
      if (/does not satisfy the constraint 'true'/.test(e.message)) {
        const above = readFileSync(e.file, 'utf8').split(/\r?\n/)[e.line - 2] ?? '';
        if (above.trim().startsWith('//')) return above.trim().replace(/^\/\/\s*/, '');
      }
      return `${path.relative(root, e.file).replaceAll('\\', '/')}:${e.line}  ${e.message}`;
    });
}
