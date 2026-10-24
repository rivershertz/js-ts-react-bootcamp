// yarn tickets: run your project's ticket logic against the Python API and print the results.
//
//   yarn tickets                                  everything
//   yarn tickets --status open --search login     filter the table
//   yarn tickets --sort priority --desc           sort the table
//
// Uses 02-ts/project if you have started Phase 2, otherwise 01-js/project.
// A function you have not written yet shows "not done yet" instead of stopping the whole run.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { bootcampRoot } from './lib/catalog.mjs';

const { values: args } = parseArgs({
  options: {
    status: { type: 'string' },
    priority: { type: 'string' },
    assignee: { type: 'string' },
    search: { type: 'string' },
    sort: { type: 'string', default: 'createdAt' },
    desc: { type: 'boolean', default: false },
    url: { type: 'string' },
  },
});

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

const ts = path.join(bootcampRoot, '02-ts', 'project', 'src', 'index.ts');
const js = path.join(bootcampRoot, '01-js', 'project', 'src', 'index.js');
const entry = existsSync(ts) ? ts : js;
console.log(dim(`Using ${path.relative(bootcampRoot, entry).replaceAll('\\', '/')}${entry === ts ? ' (TypeScript)' : ''}`));

let project;
try {
  project = await import(pathToFileURL(entry).href);
} catch (error) {
  console.log(red(`Could not load your project: ${error.message}`));
  console.log('Fix the error above (often a typo in an import path), then run yarn tickets again.');
  process.exit(1);
}

/** Run one part of the demo. A TODO or a bug in one function does not stop the others. */
async function section(title, fn) {
  console.log(`\n${bold(title)}`);
  try {
    await fn();
  } catch (error) {
    if (/TODO/.test(error.message)) console.log(dim(`  not done yet (${error.message})`));
    else console.log(red(`  ${error.name}: ${error.message}`));
  }
}

const pad = (value, width) => String(value ?? '').slice(0, width).padEnd(width);

function printTable(tickets, assignees) {
  const names = Object.fromEntries(assignees.map((a) => [a.id, a.name]));
  console.log(dim(`  ${pad('id', 6)} ${pad('status', 9)} ${pad('priority', 9)} ${pad('assignee', 15)} ${pad('due', 11)} title`));
  for (const t of tickets) {
    console.log(`  ${pad(t.id, 6)} ${pad(t.status, 9)} ${pad(t.priority, 9)} ${pad(names[t.assignee] ?? t.assignee ?? '', 15)} ${pad(t.dueDate ?? '', 11)} ${t.title}`);
  }
  console.log(dim(`  ${tickets.length} ticket(s)`));
}

let tickets = [];
let assignees = [];

await section('Loading tickets and assignees (loadAll)', async () => {
  const client = project.createClient(...(args.url ? [args.url] : []));
  const result = await project.loadAll(client);
  tickets = result.tickets;
  assignees = result.assignees;
  console.log(`  ${tickets.length} tickets, ${assignees.length} assignees`);
  for (const warning of result.warnings) console.log(yellow(`  Warning: ${warning}`));
  if (tickets.length === 0 && result.warnings.length > 0) {
    console.log('\n  Is the ticket API running? Start it in a second terminal and leave it open:');
    console.log('    python server/server.py');
  }
});

const filters = { status: args.status, priority: args.priority, assignee: args.assignee, search: args.search };
const sort = { by: args.sort, direction: args.desc ? 'desc' : 'asc' };
const active = Object.entries(filters).filter(([, v]) => v);

await section(
  `Tickets${active.length ? `, filtered by ${active.map(([k, v]) => `${k}=${v}`).join(' ')}` : ''}, sorted by ${sort.by} ${sort.direction}`,
  async () => {
    const shown = project.sortTickets(project.filterTickets(tickets, filters), sort);
    printTable(shown, assignees);
    if (!active.length) console.log(dim('  Try: yarn tickets --status open --search login --sort priority --desc'));
  },
);

await section('Grouped by status (groupByStatus)', async () => {
  for (const [status, list] of Object.entries(project.groupByStatus(tickets))) {
    console.log(`  ${pad(status, 9)} ${String(list.length).padStart(3)}  ${dim(list.map((t) => t.id).join(' '))}`);
  }
});

await section('Summary (computeStats)', async () => {
  const s = project.computeStats(tickets);
  console.log(`  total ${s.total}   open ${s.open}   overdue ${s.overdue}   average age of open tickets ${s.averageAgeDays} days`);
});

await section('Validating a bad new ticket (validateTicket)', async () => {
  const draft = { title: '   ', priority: 'critical', dueDate: '2020-01-01' };
  console.log(dim(`  ${JSON.stringify(draft)}`));
  const { valid, errors } = project.validateTicket(draft);
  console.log(`  valid: ${valid}`);
  for (const e of errors) console.log(`  - ${e.field}: ${e.message}`);
});

console.log(dim('\nTo see a partial failure, restart the server with: python server/server.py --fail assignees'));
