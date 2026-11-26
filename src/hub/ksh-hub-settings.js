import { LitElement, html, css, nothing } from 'lit';
import { PALETTES } from './hub-styles.js';
import { avatar, avatarCss } from './avatar.js';
import { ITEMS, orderItems } from './modules.js';

const PARTS = ['shopping', 'meals', 'chores', 'calendar', 'finance'];

const DESCRIPTIONS = {
  chores: 'Chores, routines and points for the family',
  finance: 'Pocket money: a Cash and a Bank account for each child',
  calendar: 'Family calendar, school, sport, appointments and your Home Assistant calendars',
  shopping: 'Lists, product catalogue and supermarkets',
  meals: 'Recipe book, meal planner and cooking timers',
  cards: 'Loyalty cards (needs Shopping)',
};

class KshHubSettings extends LitElement {
  static properties = {
    hass: { type: Object },
    info: { type: Object },
    theme: { type: String },
    palette: { type: String },
    cardVersion: { type: String },
    prefs: { type: Object },
    people: { type: Array },
    order: { type: Array },
    applying: { type: Boolean },
    applyError: { type: String },
    _error: { state: true },
    _who: { state: true },
  };

  constructor() {
    super();
    this._error = null;
    this._who = null;
  }

  get _isAdmin() { return !!this.hass?.user?.is_admin; }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  _isOn(item) {
    const hidden = this.info?.hidden || [];
    if (item.module && !this.info?.modules?.[item.module]) return false;
    // Shopping, Meals, Chores, Calendar and Finance are the parts themselves; everything else is a menu entry
    return PARTS.includes(item.id) ? true : !hidden.includes(item.id);
  }

  _toggle(item, value) {
    this._error = null;
    const modules = this.info?.modules || {};
    // Shopping, Meals, Chores, Calendar and Finance switch a whole part of the integration on or off
    if (PARTS.includes(item.id)) {
      const key = item.module;
      const others = Object.entries(modules).filter(([k]) => k !== key);
      if (!value && others.every(([, v]) => !v)) {
        this._error = 'Keep at least one of Shopping, Meals, Chores, Calendar and Finance switched on.';
        return;
      }
      this._emit('hub-config', { modules: { [key]: value } });
      return;
    }
    this._emit('hub-config', { items: { [item.id]: value } });
  }

  /** Every entry except Home, in this login's order */
  _sorted() { return orderItems(ITEMS.filter(i => !i.home), this.prefs?.order || []); }

  _move(id, dir) {
    const ids = this._sorted().map(i => i.id);
    const at = ids.indexOf(id);
    const to = at + dir;
    if (at < 0 || to < 0 || to >= ids.length) return;
    [ids[at], ids[to]] = [ids[to], ids[at]];
    this._emit('hub-order', { order: ids });
  }

  // Administrators choose what each person is shown
  _access() {
    const people = this.people || [];
    if (!people.length) return nothing;
    const who = people.find(p => p.id === this._who) || people[0];
    const blocked = this.prefs?.blocked?.[who.id] || [];
    const items = ITEMS.filter(i => !i.home && !i.soon && (!i.module || this.info?.modules?.[i.module]));
    const toggle = (item, show) => this._emit('hub-access', {
      person: who.id, hidden: show ? blocked.filter(x => x !== item.id) : [...new Set([...blocked, item.id])],
    });
    return html`
      <h3>Who can see what</h3>
      <section class="card">
        <div class="chips">
          ${people.map(p => html`<button class="chip ${p.id === who.id ? 'on' : ''}" @click=${() => { this._who = p.id; }}>${avatar(this.hass, p, 22)}${p.name}</button>`)}
        </div>
        ${items.map(item => {
          const on = !blocked.includes(item.id);
          return html`
            <div class="row slim ${on ? 'on' : ''}">
              <span class="dot sm"><ha-icon icon=${item.icon}></ha-icon></span>
              <div class="txt"><div class="name">${item.label}</div></div>
              <button class="switch ${on ? 'on' : ''}" role="switch" aria-checked=${on ? 'true' : 'false'}
                aria-label="${who.name} can see ${item.label}" @click=${() => toggle(item, !on)}><i></i></button>
            </div>`;
        })}
      </section>
      <p class="note">Hides these entries from ${who.name}'s menu wherever they use the hub, including a shared tablet
        while ${who.name} is picked. It keeps the menu tidy; it is not a lock, so someone who knows Home Assistant can still reach the data.</p>`;
  }

  render() {
    const admin = this._isAdmin;
    const row = (item, n, all) => {
      const partOff = item.module && !this.info?.modules?.[item.module] && !PARTS.includes(item.id);
      const on = this._isOn(item);
      return html`
        <div class="row ${on ? 'on' : ''}">
          <span class="dot"><ha-icon icon=${item.icon}></ha-icon></span>
          <div class="txt">
            <div class="name">${item.label}</div>
            <div class="desc">${DESCRIPTIONS[item.id] || 'Coming soon'}</div>
          </div>
          <button class="mv" ?disabled=${n === 0} aria-label="Move ${item.label} up" @click=${() => this._move(item.id, -1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
          <button class="mv" ?disabled=${n === all.length - 1} aria-label="Move ${item.label} down" @click=${() => this._move(item.id, 1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          <button class="switch ${on ? 'on' : ''}" role="switch" aria-checked=${on ? 'true' : 'false'}
            aria-label=${item.label} ?disabled=${!admin || partOff}
            @click=${() => this._toggle(item, !on)}><i></i></button>
        </div>`;
    };
    const items = this._sorted();
    return html`
      <div class="page">
        <header>
          <button class="back" @click=${() => this._emit('hub-back')} aria-label="Back"><ha-icon icon="mdi:arrow-left"></ha-icon></button>
          <h1>Settings</h1>
          ${this.applying ? html`<span class="spin" title="Saving"></span>` : nothing}
        </header>

        <h3>Menu</h3>
        <section class="card">${items.map(row)}</section>
        ${!admin ? html`<p class="note">Only a Home Assistant administrator can switch parts on or off.</p>` : nothing}
        ${this._error || this.applyError ? html`<p class="note err">${this._error || this.applyError}</p>` : nothing}
        <p class="note">Use the arrows to put the menu in the order you like (Home is always first). On a phone the first three go in the bottom bar and the rest are under More.
          Your order is kept for your login, on every device.
          <button class="linkbtn" @click=${() => this._emit('hub-order', { order: [] })}>Back to the standard order</button></p>
        <p class="note">The switches turn things on or off for everyone. Shopping, Meals, Chores, Calendar and Finance load or unload that part of the integration (this takes a few seconds in the background).
          The other entries only show or hide their menu item. Nothing is ever deleted: switching a part back on restores everything.</p>

        ${admin ? this._access() : nothing}

        <h3>Appearance</h3>
        <section class="card">
          <div class="seg" role="radiogroup" aria-label="Colour mode">
            ${[['dark', 'Dark'], ['light', 'Light'], ['auto', 'Match Home Assistant']].map(([val, label]) => html`
              <button role="radio" aria-checked=${this.theme === val ? 'true' : 'false'}
                class=${this.theme === val ? 'sel' : ''} @click=${() => this._emit('hub-theme', { theme: val })}>${label}</button>`)}
          </div>
        </section>
        <h3>Theme</h3>
        <section class="card themes" role="radiogroup" aria-label="Theme">
          ${PALETTES.map(p => html`
            <button role="radio" aria-checked=${this.palette === p.id ? 'true' : 'false'} class="theme ${this.palette === p.id ? 'sel' : ''}"
              @click=${() => this._emit('hub-palette', { palette: p.id })}>
              <span class="sw" style="background:linear-gradient(135deg, ${p.swatch[0]} 0 55%, ${p.swatch[1]} 55% 100%)"></span>
              <span>${p.label}</span>
            </button>`)}
        </section>
        <p class="note">Each theme has a light and a dark version. Dark or Light above (or Match Home Assistant) decides which one you see.</p>

        <h3>About</h3>
        <section class="card about">
          <div><span>Integration</span><b>${this.info?.version ?? '—'}</b></div>
          <div><span>Card</span><b>${this.cardVersion ?? '—'}</b></div>
          ${Object.entries(this.info?.imported || {}).map(([part, files]) => html`
            <div><span>Imported ${part === 'recipes' ? 'recipes' : 'shopping'} data</span><b>${files.length ? `${files.length} file${files.length === 1 ? '' : 's'}` : 'none found'}</b></div>`)}
          ${Object.entries(this.info?.pictures || {}).map(([part, done]) => html`
            <div><span>${part === 'recipes' ? 'Recipe' : 'Shopping'} pictures copied</span><b>${done.copied}</b></div>`)}
        </section>
        <p class="note">On first start the hub copies your existing Recipe Manager and Shopping List Manager data.
          The originals are left untouched, so the standalone integrations keep working side by side.</p>
        <p class="note">Pictures are kept in <b>config/www/images/ksh-family-hub/</b>, in a <b>shopping</b> and a <b>recipes</b> folder.
          Pictures from the older folders are copied there once. Put new pictures of your own in the new folder.</p>
      </div>`;
  }

  static styles = [avatarCss, css`
    .chips { display: flex; gap: 6px; flex-wrap: wrap; padding: 12px 12px 6px; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; cursor: pointer; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .row.slim { padding: 8px 14px; }
    .dot.sm { width: 34px; height: 34px; border-radius: 11px; --mdc-icon-size: 19px; }
    .row .mv { margin-right: -4px; }
    .mv { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface-2); cursor: pointer; display: flex; align-items: center; justify-content: center; --mdc-icon-size: 19px; flex: none; }
    .mv[disabled] { opacity: .35; cursor: default; }
    .linkbtn { background: none; border: none; color: var(--hub-accent); font-weight: 700; cursor: pointer; padding: 0 0 0 6px; }
    .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; padding: 12px; }
    .theme { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 8px; border-radius: 16px; cursor: pointer;
      border: 2px solid var(--hub-border); background: var(--hub-surface-2); font: inherit; font-weight: 700; color: var(--hub-text); }
    .theme.sel { border-color: var(--hub-accent); }
    .theme .sw { width: 56px; height: 56px; border-radius: 16px; border: 1px solid var(--hub-border); }
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
      background: var(--hub-surface-2); color: var(--hub-muted); --mdc-icon-size: 22px; transition: background .15s, color .15s;
    }
    .row.on .dot { background: color-mix(in srgb, var(--hub-accent) 18%, transparent); color: var(--hub-accent); }
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
