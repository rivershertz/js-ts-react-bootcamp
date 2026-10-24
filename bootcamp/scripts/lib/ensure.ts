/**
 * A check with a plain message for the junior. Vitest drops custom messages from the
 * Testing Library matchers (toBeInTheDocument, toHaveValue...), so DOM checks use this instead.
 */
export function ensure(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}
