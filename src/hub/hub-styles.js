import { css } from 'lit';

// Shared look of the hub (nav, sheet, pages). Dark is the default.
// Colour themes offered in Settings > Appearance. Midnight is the default (tokens below); the others only override
// the surface and accent tokens, for dark and light mode.
export const PALETTES = [
  { id: 'midnight', label: 'Midnight', swatch: ['#17293c', '#bff3e4'] },
  { id: 'slate',    label: 'Slate',    swatch: ['#23282e', '#d4dbe3'] },
  { id: 'forest',   label: 'Forest',   swatch: ['#16291f', '#c4f0b8'] },
  { id: 'dusk',     label: 'Dusk',     swatch: ['#251c36', '#e3d0ff'] },
];

export const hubTokens = css`
  :host {
    --hub-bg: linear-gradient(180deg, #17293c 0%, #0f1c2a 100%);
    --hub-surface: #162b41;
    --hub-surface-2: #1c354e;
    --hub-nav: rgba(24, 44, 66, 0.94);
    --hub-sheet: #142a3f;
    --hub-text: #eaf1f8;
    --hub-muted: #9fb2c5;
    --hub-border: rgba(255, 255, 255, 0.09);
    --hub-accent: #bff3e4;
    --hub-accent-ink: #0b3a35;
    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    --hub-m-main: #111f2f;
    color: var(--hub-text);
  }
  :host([data-mode="light"]) {
    --hub-bg: linear-gradient(180deg, #f1f5f9 0%, #e6edf3 100%);
    --hub-surface: #ffffff;
    --hub-surface-2: #f3f7fa;
    --hub-nav: rgba(255, 255, 255, 0.96);
    --hub-sheet: #ffffff;
    --hub-text: #152638;
    --hub-muted: #5d7186;
    --hub-border: rgba(20, 40, 60, 0.1);
    --hub-accent: #1f9d7c;
    --hub-accent-ink: #ffffff;
    --hub-shadow: 0 10px 30px rgba(20, 40, 60, 0.18);
    --hub-m-main: #eef3f7;
  }

  /* ---- other colour themes ---- */
  :host([data-theme="slate"]) {
    --hub-bg: linear-gradient(180deg, #23282e 0%, #15181c 100%); --hub-surface: #262b31; --hub-surface-2: #2f353c;
    --hub-nav: rgba(38, 43, 49, 0.94); --hub-sheet: #23282e; --hub-text: #eceff2; --hub-muted: #a2abb5;
    --hub-accent: #d4dbe3; --hub-accent-ink: #1b2026; --hub-m-main: #1a1e23;
  }
  :host([data-theme="slate"][data-mode="light"]) {
    --hub-bg: linear-gradient(180deg, #f4f5f7 0%, #e9ecef 100%); --hub-surface: #ffffff; --hub-surface-2: #f4f6f8;
    --hub-nav: rgba(255, 255, 255, 0.96); --hub-sheet: #ffffff; --hub-text: #1c242d; --hub-muted: #637080;
    --hub-accent: #4b5a6b; --hub-accent-ink: #ffffff; --hub-m-main: #f0f2f4;
  }
  :host([data-theme="forest"]) {
    --hub-bg: linear-gradient(180deg, #17301f 0%, #0e1b14 100%); --hub-surface: #183024; --hub-surface-2: #1f3c2d;
    --hub-nav: rgba(24, 48, 36, 0.94); --hub-sheet: #162b20; --hub-text: #e9f3ec; --hub-muted: #9db8a6;
    --hub-accent: #c4f0b8; --hub-accent-ink: #14340f; --hub-m-main: #112119;
  }
  :host([data-theme="forest"][data-mode="light"]) {
    --hub-bg: linear-gradient(180deg, #f1f6f1 0%, #e4ede5 100%); --hub-surface: #ffffff; --hub-surface-2: #f3f8f3;
    --hub-nav: rgba(255, 255, 255, 0.96); --hub-sheet: #ffffff; --hub-text: #14281a; --hub-muted: #5a7260;
    --hub-accent: #2f8a4a; --hub-accent-ink: #ffffff; --hub-m-main: #edf3ee;
  }
  :host([data-theme="dusk"]) {
    --hub-bg: linear-gradient(180deg, #2a2040 0%, #181224 100%); --hub-surface: #2a2040; --hub-surface-2: #342852;
    --hub-nav: rgba(42, 32, 64, 0.94); --hub-sheet: #261d3b; --hub-text: #f0eaf9; --hub-muted: #b3a5cc;
    --hub-accent: #e3d0ff; --hub-accent-ink: #2d1457; --hub-m-main: #1e1630;
  }
  :host([data-theme="dusk"][data-mode="light"]) {
    --hub-bg: linear-gradient(180deg, #f6f2fb 0%, #ece5f5 100%); --hub-surface: #ffffff; --hub-surface-2: #f7f3fb;
    --hub-nav: rgba(255, 255, 255, 0.96); --hub-sheet: #ffffff; --hub-text: #251a38; --hub-muted: #70628a;
    --hub-accent: #7b4fc4; --hub-accent-ink: #ffffff; --hub-m-main: #f3eef9;
  }
`;
