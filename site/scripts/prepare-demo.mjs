// Copies the built hub (the files Home Assistant serves) into the demo folder, so the live demo always runs the real app,
// and writes the current version for the site to show.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const root = resolve(site, '..');
const built = resolve(root, 'custom_components/ksh_family_hub/www');
const app = resolve(site, 'public/sandbox/app');

if (!existsSync(resolve(built, 'ksh-family-hub-card.js'))) {
  console.error('The built hub is missing. Run "npm run build" in the repository root first.');
  process.exit(1);
}
rmSync(app, { recursive: true, force: true });
mkdirSync(app, { recursive: true });
cpSync(built, app, { recursive: true });

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
writeFileSync(resolve(site, 'public/version.json'), JSON.stringify({ version: pkg.version }));
console.log(`demo ready: KSH Family Hub ${pkg.version}`);
