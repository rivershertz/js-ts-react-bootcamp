// Done for you: a render counter for measuring, like console.count.
// Changing something outside the component while it renders breaks rule 1 of module 02,
// so use this only to measure, never for what the app shows.
const counts = new Map<string, number>();

export function countRender(name: string): void {
  counts.set(name, (counts.get(name) ?? 0) + 1);
  console.log(`render ${name} #${counts.get(name)}`);
}

export function renderCount(name: string): number {
  return counts.get(name) ?? 0;
}
