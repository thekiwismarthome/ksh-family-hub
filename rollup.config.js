import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { readFileSync, rmSync, readdirSync, statSync, writeFileSync } from 'fs';
import { gzipSync, brotliCompressSync, constants } from 'zlib';
import { join } from 'path';

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

// Home Assistant serves a file.js.gz / file.js.br next to file.js when the browser accepts it, so a phone on a slow
// connection downloads about a quarter of the size.
function precompress() {
  const walk = dir => readdirSync(dir).flatMap(f => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
  return {
    name: 'precompress',
    writeBundle() {
      for (const file of walk(OUT).filter(f => f.endsWith('.js'))) {
        const data = readFileSync(file);
        writeFileSync(`${file}.gz`, gzipSync(data, { level: 9 }));
        writeFileSync(`${file}.br`, brotliCompressSync(data, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: data.length } }));
      }
    },
  };
}

function clean() {
  return { name: 'clean', buildStart() { rmSync(OUT, { recursive: true, force: true }); } };
}

export default {
  // ksh-family-hub-card.js is the small loader Home Assistant puts on every page; ksh-family-hub-app.js is the app itself
  input: { 'ksh-family-hub-card': 'src/loader.js', 'ksh-family-hub-app': 'src/ksh-family-hub-card.js', ...locales },
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
    precompress(),
  ],
};
