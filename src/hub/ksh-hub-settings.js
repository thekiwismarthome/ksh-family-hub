import { LitElement, html, css, nothing } from 'lit';
import { hubTokens } from './hub-styles.js';
import { ITEMS } from './modules.js';

const DESCRIPTIONS = {
  shopping: 'Lists, product catalogue and supermarkets',
  meals: 'Recipe book, meal planner and cooking timers',
  cards: 'Loyalty cards (needs Shopping)',
};

class KshHubSettings extends LitElement {
  static properties = {
    hass: { type: Object },
    info: { type: Object },
    theme: { type: String },
    cardVersion: { type: String },
    applying: { type: Boolean },
    applyError: { type: String },
    _error: { state: true },
  };

  constructor() {
    super();
    this._error = null;
  }

  get _isAdmin() { return !!this.hass?.user?.is_admin; }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  _isOn(item) {
    const hidden = this.info?.hidden || [];
    if (item.module && !this.info?.modules?.[item.module]) return false;
    // Shopping and Meals are the parts themselves; everything else is a menu entry
    return item.id === 'shopping' || item.id === 'meals' ? true : !hidden.includes(item.id);
  }

  _toggle(item, value) {
    this._error = null;
    const modules = this.info?.modules || {};
    // Shopping and Meals switch a whole part of the integration on or off
    if (item.id === 'shopping' || item.id === 'meals') {
      const key = item.module;
      const others = Object.entries(modules).filter(([k]) => k !== key);
      if (!value && others.every(([, v]) => !v)) {
        this._error = 'Keep at least one of Shopping and Meals switched on.';
        return;
      }
      this._emit('hub-config', { modules: { [key]: value } });
      return;
    }
    this._emit('hub-config', { items: { [item.id]: value } });
  }

  render() {
    const admin = this._isAdmin;
    const row = item => {
      const partOff = item.module && !this.info?.modules?.[item.module] && item.id !== 'shopping' && item.id !== 'meals';
      const on = this._isOn(item);
      return html`
        <div class="row" style="--c:${item.color}">
          <span class="dot"><ha-icon icon=${item.icon}></ha-icon></span>
          <div class="txt">
            <div class="name">${item.label}</div>
            <div class="desc">${DESCRIPTIONS[item.id] || 'Coming soon'}</div>
          </div>
          <button class="switch ${on ? 'on' : ''}" role="switch" aria-checked=${on ? 'true' : 'false'}
            aria-label=${item.label} ?disabled=${!admin || partOff}
            @click=${() => this._toggle(item, !on)}><i></i></button>
        </div>`;
    };
    const items = ITEMS.filter(i => !i.home);
    return html`
      <div class="page">
        <header>
          <button class="back" @click=${() => this._emit('hub-back')} aria-label="Back"><ha-icon icon="mdi:arrow-left"></ha-icon></button>
          <h1>Hub settings</h1>
          ${this.applying ? html`<span class="spin" title="Saving"></span>` : nothing}
        </header>

        <h3>Parts of the hub</h3>
        <section class="card">${items.map(row)}</section>
        ${!admin ? html`<p class="note">Only a Home Assistant administrator can switch parts on or off.</p>` : nothing}
        ${this._error || this.applyError ? html`<p class="note err">${this._error || this.applyError}</p>` : nothing}
        <p class="note">Shopping and Meals load or unload that part of the integration (this takes a few seconds in the background).
          The other entries only show or hide their menu item. Nothing is ever deleted: switching a part back on restores everything.</p>

        <h3>Appearance</h3>
        <section class="card">
          <div class="seg" role="radiogroup" aria-label="Colour mode">
            ${[['dark', 'Dark'], ['light', 'Light'], ['auto', 'Match Home Assistant']].map(([val, label]) => html`
              <button role="radio" aria-checked=${this.theme === val ? 'true' : 'false'}
                class=${this.theme === val ? 'sel' : ''} @click=${() => this._emit('hub-theme', { theme: val })}>${label}</button>`)}
          </div>
        </section>

        <h3>About</h3>
        <section class="card about">
          <div><span>Integration</span><b>${this.info?.version ?? '—'}</b></div>
          <div><span>Card</span><b>${this.cardVersion ?? '—'}</b></div>
          ${Object.entries(this.info?.imported || {}).map(([part, files]) => html`
            <div><span>Imported ${part === 'recipes' ? 'recipes' : 'shopping'} data</span><b>${files.length ? `${files.length} file${files.length === 1 ? '' : 's'}` : 'none found'}</b></div>`)}
        </section>
        <p class="note">On first start the hub copies your existing Recipe Manager and Shopping List Manager data.
          The originals are left untouched, so the standalone integrations keep working side by side.</p>
      </div>`;
  }

  static styles = [hubTokens, css`
    :host { display: block; flex: 1; min-height: 0; overflow-y: auto; }
    * { box-sizing: border-box; }
    button { font: inherit; color: inherit; }
    .page { max-width: 640px; margin: 0 auto; padding: 18px 18px 32px; }
    header { display: flex; align-items: center; gap: 10px; }
    h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .back {
      width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--hub-border); cursor: pointer;
      background: var(--hub-surface); display: flex; align-items: center; justify-content: center;
    }
    h3 { margin: 26px 2px 10px; font-size: 12.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .card { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; overflow: hidden; }
    .row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
    .row + .row { border-top: 1px solid var(--hub-border); }
    .dot {
      width: 40px; height: 40px; border-radius: 13px; flex: none; display: inline-flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--c) 20%, transparent); color: var(--c); --mdc-icon-size: 22px;
    }
    .txt { flex: 1; min-width: 0; }
    .name { font-weight: 700; font-size: 15px; }
    .desc { color: var(--hub-muted); font-size: 12.5px; margin-top: 2px; }
    .switch {
      width: 48px; height: 28px; border-radius: 999px; border: none; padding: 3px; cursor: pointer; flex: none;
      background: rgba(150, 170, 190, .35); transition: background .15s; display: flex; align-items: center;
    }
    .switch i { width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: transform .15s; box-shadow: 0 1px 3px rgba(0,0,0,.35); }
    .switch.on { background: var(--hub-accent); }
    .switch.on i { transform: translateX(20px); }
    .switch:disabled { opacity: .5; cursor: default; }
    .spin { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--hub-border); border-top-color: var(--hub-accent); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .note { margin: 8px 4px 0; font-size: 12.5px; color: var(--hub-muted); }
    .note.err { color: #f0a050; }
    .seg { display: flex; gap: 6px; padding: 8px; }
    .seg button {
      flex: 1; border: none; border-radius: 13px; padding: 10px 6px; cursor: pointer; font-weight: 700; font-size: 13px;
      background: transparent; color: var(--hub-muted);
    }
    .seg button.sel { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .about div { display: flex; justify-content: space-between; padding: 13px 16px; font-size: 14px; }
    .about div + div { border-top: 1px solid var(--hub-border); }
    .about span { color: var(--hub-muted); }
  `];
}

customElements.define('ksh-hub-settings', KshHubSettings);
