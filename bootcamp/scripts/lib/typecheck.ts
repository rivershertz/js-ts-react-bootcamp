import path from 'node:path';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { root } from './paths';

export type TypeError = { file: string; line: number; message: string };

const cache = new Map<string, TypeError[]>();

type Options = {
  /** Replace a file's text for this compile only (absolute path → source). Used to try a changed copy. */
  replace?: Record<string, string>;
  /** Extra compiler options, for example { allowJs: true, checkJs: true } for a JavaScript file. */
  compilerOptions?: ts.CompilerOptions;
};

/** Type-check the given files with the bootcamp tsconfig and return every error. */
export function typeErrors(files: string[], { replace = {}, compilerOptions = {} }: Options = {}): TypeError[] {
  const key = JSON.stringify([files, replace, compilerOptions]);
  if (cache.has(key)) return cache.get(key)!;
  const config = ts.getParsedCommandLineOfConfigFile(path.join(root, 'tsconfig.json'), {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: () => {},
  })!;
  const options = { ...config.options, ...compilerOptions };
  const host = ts.createCompilerHost(options);
  const replaced = new Map(Object.entries(replace).map(([file, text]) => [path.resolve(file), text]));
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, languageVersion, ...rest) => {
    const text = replaced.get(path.resolve(fileName));
    return text === undefined ? getSourceFile(fileName, languageVersion, ...rest) : ts.createSourceFile(fileName, text, languageVersion, true);
  };
  const program = ts.createProgram(files, options, host);
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
      // A @ts-expect-error that found nothing: the junior's types still allow something they should reject.
      if (/does not satisfy the constraint 'true'|Unused '@ts-expect-error' directive/.test(e.message)) {
        const above = readFileSync(e.file, 'utf8').split(/\r?\n/)[e.line - 2] ?? '';
        if (above.trim().startsWith('//')) return above.trim().replace(/^\/\/\s*/, '');
      }
      return `${path.relative(root, e.file).replaceAll('\\', '/')}:${e.line}  ${e.message}`;
    });
}
