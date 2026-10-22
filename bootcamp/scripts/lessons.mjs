import path from 'node:path';
import { styleText } from 'node:util';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { bootcampRoot } from './lib/catalog.mjs';

// Serves the lesson decks from this folder. Nothing is downloaded; it works offline.
const server = await createServer({
  root: path.join(bootcampRoot, 'lessons'),
  configFile: false,
  plugins: [react()],
  server: { port: 5174, open: false, fs: { allow: [bootcampRoot] } },
});
await server.listen();
console.log(`\n${styleText('bold', 'Bootcamp lessons')}\n`);
server.printUrls();
console.log(styleText('dim', '\n  Open the Local link in your browser. Press Ctrl+C to stop.\n'));
