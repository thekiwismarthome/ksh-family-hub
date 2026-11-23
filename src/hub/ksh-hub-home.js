import { LitElement, html, css, nothing } from 'lit';
import { ITEMS, visibleItems } from './modules.js';

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];

const isoToday = () => {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

class KshHubHome extends LitElement {
  static properties = {
    hass: { type: Object },
    modules: { type: Object },
    hidden: { type: Array },
    dark: { type: Boolean },
    panel: { type: Boolean },     // running as a Home Assistant sidebar panel
    _shopping: { state: true },   // { list, open } | null
    _chores: { state: true },     // {open, waiting} | null
    _meals: { state: true },      // [{meal_type, recipe_name}] | null
    _loaded: { state: true },
  };

  constructor() {
    super();
    this._shopping = null;
    this._meals = null;
    this._chores = null;
    this._loaded = false;
    this._requested = false;
  }

  willUpdate(changed) {
    if ((changed.has('hass') || changed.has('modules')) && this.hass && this.modules && !this._requested) {
      this._requested = true;
      this._load();
    }
  }

  async _load() {
    const jobs = [];
    if (this.modules.shopping) jobs.push(this._loadShopping());
    if (this.modules.recipes) jobs.push(this._loadMeals());
    if (this.modules.chores) jobs.push(this._loadChores());
    await Promise.allSettled(jobs);
    this._loaded = true;
  }

  async _loadShopping() {
    try {
      const { lists = [] } = await this.hass.callWS({ type: 'ksh_shopping/lists/get_all' });
      const list = lists.find(l => l.active) || lists[0];
      if (!list) { this._shopping = { list: null, open: 0 }; return; }
      const { items = [] } = await this.hass.callWS({ type: 'ksh_shopping/items/get', list_id: list.id });
      this._shopping = { list, open: items.filter(i => !i.checked).length };
    } catch { this._shopping = null; }
  }

  async _loadChores() {
    try {
      const st = await this.hass.callWS({ type: 'ksh_chores/get_state', date: isoToday() });
      this._chores = {
        open: st.items.filter(i => ['open', 'rejected'].includes(i.status)).length,
        done: st.items.filter(i => ['done', 'approved'].includes(i.status)).length,
        waiting: st.pending.length,
      };
    } catch { this._chores = null; }
  }

  async _loadMeals() {
    try {
      const { entries = [] } = await this.hass.callWS({ type: 'ksh_recipes/meal_plan/get' });
      const today = isoToday();
      this._meals = entries
        .filter(e => e.date === today)
        .sort((a, b) => MEAL_ORDER.indexOf(a.meal_type) - MEAL_ORDER.indexOf(b.meal_type));
    } catch { this._meals = null; }
  }

  _go(id) {
    this.dispatchEvent(new CustomEvent('hub-navigate', { detail: { id }, bubbles: true, composed: true }));
  }

  get _greeting() {
    const h = new Date().getHours();
    const part = h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const first = (this.hass?.user?.name || '').split(' ')[0];
    return first ? `${part}, ${first}` : part;
  }

  render() {
    const today = new Date().toLocaleDateString(this.hass?.locale?.language || undefined, {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    const items = visibleItems(this.modules, this.hidden).filter(i => !i.home);
    return html`
      <div class="page">
        <header>
          <div class="greet">
            <h1>${this._greeting}</h1>
            <p class="date">${today}</p>
          </div>
        </header>

        <div class="cards">
          ${this.modules?.shopping ? this._shoppingCard() : nothing}
          ${this.modules?.recipes ? this._mealsCard() : nothing}
          ${this.modules?.chores ? this._choresCard() : nothing}
          ${!this.modules?.shopping && !this.modules?.recipes && !this.modules?.chores ? html`
            <section class="card wide">
              <h2>Nothing switched on</h2>
              <p class="muted">Turn on Shopping or Recipes in the hub settings to get started.</p>
            </section>` : nothing}
        </div>

        <h3 class="section">Your hub</h3>
        <div class="grid">
          ${items.map(i => html`
            <button class="grid-item" @click=${() => this._go(i.id)}>
              <span class="tile" style="--c:${i.color}">
                <ha-icon icon=${i.icon}></ha-icon>
              </span>
              <span class="label">${i.label}</span>
            </button>`)}
        </div>
      </div>`;
  }

  _shoppingCard() {
    const s = this._shopping;
    const color = ITEMS.find(i => i.id === 'shopping').color;
    return html`
      <section class="card" style="--c:${color}">
        <div class="card-head"><span class="dot"><ha-icon icon="mdi:cart-outline"></ha-icon></span><h2>Shopping</h2></div>
        ${!this._loaded && !s ? html`<p class="muted">Loading…</p>`
          : !s ? html`<p class="muted">Couldn't load your lists.</p>`
          : !s.list ? html`<p class="muted">Add your shopping list to get started.</p>`
          : html`
            <p class="big">${s.open}<span> ${s.open === 1 ? 'item' : 'items'} to buy</span></p>
            <p class="muted">${s.list.name}</p>`}
        <button class="link" @click=${() => this._go('shopping')}>Open shopping <ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </section>`;
  }

  _choresCard() {
    const c = this._chores;
    const color = ITEMS.find(i => i.id === 'chores').color;
    return html`
      <section class="card" style="--c:${color}">
        <div class="card-head"><span class="dot"><ha-icon icon="mdi:check-circle-outline"></ha-icon></span><h2>Chores today</h2></div>
        ${!this._loaded && !c ? html`<p class="muted">Loading…</p>`
          : !c ? html`<p class="muted">Couldn't load the chores.</p>`
          : html`<p class="big">${c.open}<span> to do</span></p>
              <p class="muted">${c.done} done${c.waiting ? ` · ${c.waiting} waiting for approval` : ''}</p>`}
        <button class="link" @click=${() => this._go('chores')}>Open chores <ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </section>`;
  }

  _mealsCard() {
    const m = this._meals;
    const color = ITEMS.find(i => i.id === 'meals').color;
    return html`
      <section class="card" style="--c:${color}">
        <div class="card-head"><span class="dot"><ha-icon icon="mdi:silverware-fork-knife"></ha-icon></span><h2>Today's meals</h2></div>
        ${!this._loaded && !m ? html`<p class="muted">Loading…</p>`
          : !m ? html`<p class="muted">Couldn't load the meal plan.</p>`
          : !m.length ? html`<p class="muted">Nothing planned for today.</p>`
          : html`<ul>${m.map(e => html`
              <li><span class="kind">${e.meal_type}</span><span class="name">${e.recipe_name || 'Recipe'}</span></li>`)}</ul>`}
        <button class="link" @click=${() => this._go('meals')}>Open meals <ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </section>`;
  }

  static styles = [css`
    :host { display: block; flex: 1; min-height: 0; overflow-y: auto; }
    * { box-sizing: border-box; }
    button { font: inherit; color: inherit; }
    .page { max-width: 980px; margin: 0 auto; padding: 22px 18px 28px; }
    header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.01em; }
    .date { margin: 4px 0 0; color: var(--hub-muted); font-size: 14px; }
    .gear {
      width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--hub-border); cursor: pointer;
      background: var(--hub-surface); color: var(--hub-muted); display: flex; align-items: center; justify-content: center;
    }
    .greet { flex: 1; min-width: 0; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 20px; }
    .card {
      padding: 18px; border-radius: 22px; background: var(--hub-surface); border: 1px solid var(--hub-border);
      display: flex; flex-direction: column; gap: 6px; min-height: 150px;
    }
    .card.wide { grid-column: 1 / -1; }
    .card-head { display: flex; align-items: center; gap: 10px; }
    .card h2 { margin: 0; font-size: 15px; font-weight: 700; }
    .dot {
      width: 34px; height: 34px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--c) 20%, transparent); color: var(--c); --mdc-icon-size: 20px;
    }
    .big { margin: 8px 0 0; font-size: 34px; font-weight: 800; line-height: 1; }
    .big span { font-size: 15px; font-weight: 600; color: var(--hub-muted); }
    .muted { margin: 4px 0 0; color: var(--hub-muted); font-size: 14px; }
    ul { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 6px; }
    li { display: flex; gap: 10px; align-items: baseline; font-size: 14.5px; }
    .kind { width: 74px; flex: none; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--c); }
    .name { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .link {
      margin-top: auto; align-self: flex-start; display: inline-flex; align-items: center; background: none; border: none;
      cursor: pointer; padding: 6px 0 0; font-weight: 700; font-size: 13.5px; color: var(--c);
    }
    .link ha-icon { --mdc-icon-size: 18px; }
    .section { margin: 28px 2px 12px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(86px, 1fr)); gap: 20px 6px; }
    .grid-item { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0; }
    .tile {
      position: relative; width: 54px; height: 54px; border-radius: 17px; display: inline-flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--c) 20%, transparent); color: var(--c); --mdc-icon-size: 28px;
    }
    .label { font-size: 12.5px; font-weight: 700; }
  `];
}

customElements.define('ksh-hub-home', KshHubHome);
