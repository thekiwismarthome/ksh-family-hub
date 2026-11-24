// Generates src/hub/themes.generated.js: the hub's ten colour themes, each in light and dark.
// The palettes are ten of the 32 mobile app palettes on https://paletadecolores.org/en/mobile-app-color-palette.html
// (Background, Surface, Primary, Accent, Text, light mode). Dark mode is derived from the light palette in OKLab the way that
// site does it, with the tint of the background and surface toned down so the dark themes stay calm.
// Run with: node tools/gen-themes.mjs
import { writeFileSync } from 'fs';

const PALETTES = [{"id": "graphite", "label": "Graphite", "note": "Cool grays and a soft black that let the content speak.", "light": ["#FAFAFA", "#F0F0F1", "#18181B", "#71717A", "#09090B"]}, {"id": "fintech", "label": "Fintech blue and green", "note": "Blue for trust and green for balances and successful transactions.", "light": ["#F7F9FC", "#E3EAF5", "#2563EB", "#00C48C", "#0B1B3F"]}, {"id": "indigo", "label": "Indigo calendar", "note": "Serene indigo with a mint accent for events.", "light": ["#F8F9FE", "#E8EBFA", "#4353FF", "#4FD1C5", "#141A3C"]}, {"id": "fresh", "label": "Fresh food green", "note": "For grocery, recipe or nutrition apps.", "light": ["#FFFFFF", "#EFF8E8", "#2F8F3A", "#A8D672", "#1E3A1F"]}, {"id": "wellness", "label": "Health and wellness", "note": "Calm; for doctor appointments, habits or tracking.", "light": ["#F7FBFA", "#DDF3EE", "#2A7F75", "#5CC8B0", "#17363A"]}, {"id": "delivery", "label": "Delivery orange", "note": "Orange makes order buttons and promotions stand out.", "light": ["#FFFFFF", "#FFF1E6", "#E04E0C", "#FF7A00", "#1F1F1F"]}, {"id": "coral", "label": "Coral dating", "note": "A warm coral that invites you to swipe.", "light": ["#FFF7F5", "#FFE3DC", "#FF5A5F", "#FFB4A2", "#2D1716"]}, {"id": "social", "label": "Social pink and purple", "note": "For social networks, dating or content creators.", "light": ["#FFF0F6", "#FBDDEA", "#C13584", "#FF6FA5", "#1C1530"]}, {"id": "cafe", "label": "Roasted café", "note": "Warm browns and cream, like a good coffee.", "light": ["#FBF7F2", "#F1E6D8", "#6F4E37", "#D9A066", "#2B1D14"]}, {"id": "lavender", "label": "Lavender meditation", "note": "Soft and calm; for sleep, meditation or journaling.", "light": ["#FBF9FF", "#ECE6FB", "#8E7CD9", "#C9BDF2", "#3D3566"]}];
export const DEFAULT_THEME = 'fintech';

const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
const hex = c => '#' + c.map(v => ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2)).join('').toUpperCase();
const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
const gam = v => { v = v <= .0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - .055; return v * 255; };
const toOk = c => { const r = lin(c[0]), g = lin(c[1]), b = lin(c[2]), l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b); return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s]; };
const fromOk = o => { const l = Math.pow(o[0] + .3963377774 * o[1] + .2158037573 * o[2], 3), m = Math.pow(o[0] - .1055613458 * o[1] - .0638541728 * o[2], 3), s = Math.pow(o[0] - .0894841775 * o[1] - 1.291485548 * o[2], 3); return [gam(4.0767416621 * l - 3.3077115913 * m + .2309699292 * s), gam(-1.2684380046 * l + 2.6097574011 * m - .3413193965 * s), gam(-.0041960863 * l - .7034186147 * m + 1.707614701 * s)]; };
const adj = (h, L, k, ref) => { const o = toOk(rgb(h)), r = ref ? toOk(rgb(ref)) : o; return hex(fromOk([L == null ? o[0] : L, (ref ? r[1] : o[1]) * k, (ref ? r[2] : o[2]) * k])); };
const chroma = h => { const o = toOk(rgb(h)); return Math.hypot(o[1], o[2]); };
const lum = h => { const c = rgb(h); return .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2]); };
const onC = h => lum(h) > .36 ? '#141416' : '#FFFFFF';
const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return hex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]); };

function dark(c) {
  const pr = c[2], ac = c[3], neutral = chroma(pr) < .04;
  return [adj(c[4], .18, .035, pr), adj(c[4], .235, .045, pr),
    neutral ? adj(pr, .93, 1) : toOk(rgb(pr))[0] < .62 ? adj(pr, .72, .85) : adj(pr, null, .85),
    toOk(rgb(ac))[0] < .62 ? adj(ac, .74, .85) : adj(ac, null, .85), adj(c[0], .94, .07, pr)];
}

function tokens(c, isDark) {
  const [bg, sf, pr, ac0, tx] = c;
  const ac = chroma(ac0) < .04 ? pr : ac0;
  const surface = isDark ? sf : '#FFFFFF';
  return `--hub-bg: ${bg}; --hub-surface: ${surface}; --hub-surface-2: ${isDark ? mix(sf, tx, .07) : sf}; --hub-nav: ${surface}; --hub-sheet: ${surface};
    --hub-text: ${tx}; --hub-muted: ${mix(tx, bg, isDark ? .42 : .45)}; --hub-border: ${isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(20, 20, 30, 0.10)'};
    --hub-accent: ${pr}; --hub-accent-ink: ${onC(pr)}; --hub-accent-2: ${ac}; --hub-accent-2-ink: ${onC(ac)};
    --hub-shadow: ${isDark ? '0 10px 30px rgba(0, 0, 0, 0.45)' : '0 10px 30px rgba(20, 30, 50, 0.16)'}; --hub-m-main: ${bg};`;
}

let css = '';
const list = [];
for (const p of PALETTES) {
  const L = p.light, D = dark(L);
  list.push({ id: p.id, label: p.label, note: p.note, swatch: [D[0], D[2]], light: L, dark: D });
  if (p.id === DEFAULT_THEME) css = `:host { ${tokens(D, true)} color: var(--hub-text); }\n:host([data-mode="light"]) { ${tokens(L, false)} }\n` + css;
  css += `:host([data-theme="${p.id}"]) { ${tokens(D, true)} }\n:host([data-theme="${p.id}"][data-mode="light"]) { ${tokens(L, false)} }\n`;
}
const src = `// GENERATED by tools/gen-themes.mjs. Do not edit by hand.
export const DEFAULT_THEME = ${JSON.stringify(DEFAULT_THEME)};
export const PALETTES = ${JSON.stringify(list.map(({ id, label, note, swatch }) => ({ id, label, note, swatch })), null, 2)};
export const THEME_CSS = ${JSON.stringify(css)};
`;
writeFileSync(new URL('../src/hub/themes.generated.js', import.meta.url), src);
console.log('wrote', list.length, 'themes');
