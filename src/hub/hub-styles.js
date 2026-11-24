import { css, unsafeCSS } from 'lit';
import { PALETTES, THEME_CSS, DEFAULT_THEME } from './themes.generated.js';

// Shared look of the hub (nav, sheet, pages). The ten colour themes (each with a dark and a light version) are generated
// from tools/gen-themes.mjs: they set the --hub-* tokens that every part of the hub, including Shopping and Meals, paints with.
export { PALETTES, DEFAULT_THEME };

// Themes saved by earlier betas, mapped to their nearest new theme
export const LEGACY_THEMES = { midnight: DEFAULT_THEME, slate: 'graphite', forest: 'fresh', dusk: 'lavender' };

export const themeId = saved => (PALETTES.some(p => p.id === saved) ? saved : LEGACY_THEMES[saved] || DEFAULT_THEME);

// unsafeCSS is fine here: the string is generated at build time from fixed colour values
export const hubTokens = css`${unsafeCSS(THEME_CSS)}`;
