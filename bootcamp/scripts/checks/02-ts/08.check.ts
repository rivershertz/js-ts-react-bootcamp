import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';
import { defineSteps } from '../../lib/steps';
import { junior, load, root } from '../../lib/paths';
import { callPure } from '../../lib/pure';
import { findShortcuts } from '../../lib/source';
import { typeErrors, typeErrorsForStep } from '../../lib/typecheck';
import fixtures from '../../fixtures/tickets.json';

type Ticket = (typeof fixtures)[number];
type Report = {
  isOverdue: (t: Ticket, today: string) => boolean;
  weight: (t: Ticket) => number;
  reportLines: (tickets: Ticket[], today: string) => string[];
  averageWeight: (tickets: Ticket[]) => number;
  fetchReport: (client: { get: (url: string) => Promise<{ data: unknown }> }, today: string) => Promise<string[]>;
};

const step = defineSteps('02-ts/08');
const dir = '02-ts/08-migration';
const jsFile = path.join(root, dir, 'report.js');
const tsFile = path.join(root, dir, 'report.ts');
const report = () => load<Report>(`${dir}/report`);
const tickets = fixtures as Ticket[];
const TODAY = '2026-10-20';
const EXPECTED_LINES = [
  't2 Export to CSV drops last row (due 2026-10-02)',
  't6 Password reset email not sent (due 2026-10-12)',
  't5 Wrong timezone on due dates (due 2026-09-19)',
];

function requireTs() {
  expect(existsSync(tsFile), `Rename ${dir}/report.js to report.ts first (step 2).`).toBe(true);
}

step(1, async () => {
  if (!existsSync(tsFile)) {
    const js = readFileSync(jsFile, 'utf8');
    expect(js, 'Add the comment // @ts-check as the first line of report.js').toMatch(/^\s*\/\/\s*@ts-check/);
    // Loose settings, like a real first step: only real bugs, no "implicit any" yet.
    const errors = typeErrors([jsFile], { compilerOptions: { allowJs: true, checkJs: false, strict: false } });
    if (errors.length) throw new Error(errors.map((e) => `report.js:${e.line}  ${e.message}`).join('\n'));
  }
  const { averageWeight } = await report();
  const three = [tickets[1], tickets[2], tickets[3]]; // medium 2, high 3, urgent 5
  expect(callPure(averageWeight, three), 'average of 2, 3 and 5 is 3.333…, rounded to one decimal').toBe(3.3);
});

step(2, async () => {
  requireTs();
  expect(existsSync(jsFile), 'report.js should be gone: rename it, do not copy it').toBe(false);
  const { isOverdue, weight, reportLines, averageWeight } = await report();
  expect(callPure(isOverdue, tickets[1], TODAY)).toBe(true);
  expect(callPure(weight, tickets[3])).toBe(5);
  expect(callPure(reportLines, tickets, TODAY)).toEqual(EXPECTED_LINES);
  expect(callPure(averageWeight, [])).toBe(0);
});

step(3, () => {
  requireTs();
  const errors = typeErrors([tsFile]);
  if (errors.length) throw new Error(errors.map((e) => `report.ts:${e.line}  ${e.message}`).join('\n'));
});

step(4, () => {
  requireTs();
  const shortcuts = findShortcuts(readFileSync(tsFile, 'utf8'), 'report.ts');
  const listed = shortcuts.map((s) => `line ${s.line}: ${s.kind}  ${s.text}`);
  expect(listed, 'Remove every any, as cast, ! assertion and @ts-ignore: give real types instead').toEqual([]);
});

step(5, async () => {
  requireTs();
  const errors = typeErrorsForStep([path.join(__dirname, '08.types.ts'), junior(`${dir}/report`)], 5);
  if (errors.length) throw new Error(errors.join('\n'));
  const { fetchReport } = await report();
  const malformed = { id: 't-bad', dueDate: '2026-01-01', status: 'open' };
  const client = { get: async () => ({ data: [...tickets, malformed] }) };
  expect(await fetchReport(client, TODAY), 'the API answer should go through isTicket, so the malformed ticket is skipped').toEqual(EXPECTED_LINES);
  const broken = { get: async () => ({ data: { error: 'oops' } }) };
  expect(await fetchReport(broken, TODAY), 'an answer that is not a list gives no lines, not a crash').toEqual([]);
});

step(6, () => {
  requireTs();
  const errors = typeErrorsForStep([path.join(__dirname, '08.types.ts'), junior(`${dir}/report`)], 6);
  if (errors.length) throw new Error(errors.join('\n'));
});
