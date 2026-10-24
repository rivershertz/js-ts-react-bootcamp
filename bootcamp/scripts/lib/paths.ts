import path from 'node:path';
import { existsSync } from 'node:fs';

export const root = path.resolve(__dirname, '..', '..');

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Absolute path of a junior's file, given without an extension.
 * Works before and after a .js file is renamed to .ts.
 */
export function junior(relWithoutExt: string): string {
  for (const ext of ['', ...EXTENSIONS]) {
    const candidate = path.join(root, relWithoutExt + ext);
    if (existsSync(candidate) && (ext || path.extname(candidate))) return candidate;
  }
  throw new Error(`Could not find ${relWithoutExt}(.ts|.tsx|.js|.jsx). Did you rename or move it?`);
}

/** Import a junior's module by path relative to the bootcamp folder. */
export async function load<T = Record<string, unknown>>(relWithoutExt: string): Promise<T> {
  return (await import(/* @vite-ignore */ junior(relWithoutExt))) as T;
}
