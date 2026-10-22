// yarn copy-project: start Phase 2 by copying your Phase 1 project into 02-ts/project.
// Never overwrites: if 02-ts/project/src already exists, it stops.
import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';
import { bootcampRoot } from './lib/catalog.mjs';

const from = path.join(bootcampRoot, '01-js', 'project', 'src');
const to = path.join(bootcampRoot, '02-ts', 'project', 'src');

if (existsSync(to)) {
  console.log('02-ts/project/src already exists, so nothing was copied (your Phase 2 work is safe).');
  console.log('To start over, rename or delete that folder yourself, then run yarn copy-project again.');
  process.exit(1);
}
cpSync(from, to, { recursive: true });
console.log('Copied 01-js/project/src to 02-ts/project/src.');
console.log('Next: follow 02-ts/project/README.md. Your Phase 1 files are unchanged.');
