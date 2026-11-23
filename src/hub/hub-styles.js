import { css } from 'lit';

// Shared look of the hub (nav, sheet, pages). Dark is the default.
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
  }
`;
