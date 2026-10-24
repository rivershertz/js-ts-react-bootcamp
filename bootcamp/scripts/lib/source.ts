import { readFileSync } from 'node:fs';
import ts from 'typescript';

/** A file's code without comments, so example lines in comments do not count. */
export function codeOnly(file: string): string {
  return readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/** The code between `// @step n` and the next `// @step` marker (or the end of the file). */
export function stepSource(file: string, n: number): string {
  const text = readFileSync(file, 'utf8');
  const start = text.search(new RegExp(`//\\s*@step\\s+${n}\\b`));
  if (start < 0) throw new Error(`The "// @step ${n}" marker is missing from ${file}. Put it back above step ${n}.`);
  const rest = text.slice(start + 1);
  const next = rest.search(/\/\/\s*@step\s+\d+/);
  return next < 0 ? text.slice(start) : text.slice(start, start + 1 + next);
}

export type Shortcut = { kind: 'any' | 'as' | 'non-null' | 'ts-ignore'; line: number; text: string };

/**
 * Type-safety shortcuts in TypeScript source: `any`, `as` casts (not `as const`),
 * non-null `!` assertions, and @ts-ignore / @ts-expect-error / @ts-nocheck comments.
 */
export function findShortcuts(source: string, fileName = 'file.ts'): Shortcut[] {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, fileName.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const found: Shortcut[] = [];
  const add = (kind: Shortcut['kind'], node: ts.Node) =>
    found.push({ kind, line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, text: node.getText().slice(0, 60) });
  const visit = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.AnyKeyword) add('any', node);
    if (ts.isNonNullExpression(node)) add('non-null', node);
    if ((ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) && !(ts.isTypeReferenceNode(node.type) && node.type.getText() === 'const')) {
      add('as', node);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  source.split(/\r?\n/).forEach((text, i) => {
    if (/@ts-(ignore|expect-error|nocheck)/.test(text)) found.push({ kind: 'ts-ignore', line: i + 1, text: text.trim() });
  });
  return found;
}
