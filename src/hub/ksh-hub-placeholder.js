import { LitElement, html, css } from 'lit';

class KshHubPlaceholder extends LitElement {
  static properties = { item: { type: Object } };

  render() {
    const i = this.item;
    if (!i) return html``;
    return html`
      <div class="wrap" style="--c:${i.color}">
        <span class="tile"><ha-icon icon=${i.icon}></ha-icon></span>
        <h2>${i.label}</h2>
        <p>This part of the hub is coming soon.</p>
        <button @click=${() => this.dispatchEvent(new CustomEvent('hub-navigate', { detail: { id: 'home' }, bubbles: true, composed: true }))}>
          Back to Home
        </button>
      </div>`;
  }

  static styles = [css`
    :host { display: flex; flex: 1; min-height: 0; align-items: center; justify-content: center; }
    .wrap { text-align: center; padding: 24px; max-width: 360px; display: grid; gap: 10px; justify-items: center; }
    .tile {
      width: 76px; height: 76px; border-radius: 24px; display: flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--c) 20%, transparent); color: var(--c); --mdc-icon-size: 40px;
    }
    h2 { margin: 8px 0 0; font-size: 22px; }
    p { margin: 0; color: var(--hub-muted); font-size: 14.5px; }
    button {
      margin-top: 10px; border: none; border-radius: 999px; padding: 10px 22px; cursor: pointer; font: inherit; font-weight: 700;
      background: var(--hub-accent); color: var(--hub-accent-ink);
    }
  `];
}

customElements.define('ksh-hub-placeholder', KshHubPlaceholder);
