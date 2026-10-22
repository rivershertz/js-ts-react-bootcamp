// Run this file with:  node 02-ts/01-why-ts/run-me.ts
// VS Code underlines a type error below. Run it anyway and see what happens.

const estimates: number[] = [3, 4, '5'];

const total = estimates.reduce((sum, hours) => sum + hours, 0);
console.log('Total hours:', total);
