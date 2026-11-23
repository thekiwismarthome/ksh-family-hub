import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { readFileSync, rmSync } from 'fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'));
const OUT = 'custom_components/ksh_family_hub/www';

function injectVersion() {
  const id = 'virtual:card-version';
  return {
    name: 'inject-version',
    resolveId(src) { return src === id ? id : null; },
    load(id_) { return id_ === id ? `export const CARD_VERSION = '${version}';` : null; },
  };
}

// The recipes module loads its translations lazily from ./locales/<code>.js
// (next to the bundle), so they are emitted as separate entry points.
const locales = Object.fromEntries(
  ['de', 'es', 'fr', 'it', 'nl', 'pt'].map(l => [`locales/${l}`, `src/modules/recipes/locales/${l}.js`])
);

// Static assets served next to the bundle
function copyAssets() {
  return {
    name: 'copy-assets',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'ksh-logo.png', source: readFileSync('src/assets/ksh-logo.png') });
    },
  };
}

function clean() {
  return { name: 'clean', buildStart() { rmSync(OUT, { recursive: true, force: true }); } };
}

export default {
  input: { 'ksh-family-hub-card': 'src/ksh-family-hub-card.js', ...locales },
  output: {
    dir: OUT,
    format: 'es',
    entryFileNames: '[name].js',
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
  plugins: [
    clean(),
    copyAssets(),
    injectVersion(),
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    terser({ ecma: 2021, module: true }),
  ],
};
