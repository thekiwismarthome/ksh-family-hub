import { LitElement, html, css, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { CARD_VERSION } from 'virtual:card-version';
import { enableSwipeClose } from './hub/swipe.js';
import { SUB_TABS, visibleItems, orderItems, itemById, BAR_SLOTS } from './hub/modules.js';
import { resolveActing, ACTING_EVENT } from './hub/actor.js';
import { hubTokens, themeId } from './hub/hub-styles.js';
import { hassMatters } from './hub/hass-util.js';
import { loadPeople } from './hub/people-api.js';
import { setTimeZone } from './hub/clock.js';
import './hub/ksh-hub-home.js';
import './hub/ksh-hub-settings.js';
import './hub/ksh-hub-placeholder.js';
import './hub/ksh-hub-sheets.js';
import './kids/ksh-kids-card.js';                      // <ksh-family-hub-kids-core>, the kids' screen

// Each part of the hub is its own file that loads the first time it is opened, so opening the hub is quick on a slow link.
// The files are cached by the browser (their names change with their content).
const MODULE_LOADERS = {
  shopping: () => import('./modules/shopping/shopping-list-manager-card.js'),    // <ksh-shopping-module>
  recipes: () => import('./modules/recipes/recipe-manager-card.js'),             // <ksh-recipes-module>
  chores: () => import('./modules/chores/ksh-chores-module.js'),                 // <ksh-chores-module>
  calendar: () => import('./modules/calendar/ksh-calendar-module.js'),           // <ksh-calendar-module>
  finance: () => import('./modules/finance/ksh-finance-module.js'),              // <ksh-finance-module>
};
const ROUTE_MODULE = { shopping: 'shopping', cards: 'shopping', meals: 'recipes', chores: 'chores', calendar: 'calendar', finance: 'finance' };
const loaded = new Map();
function loadModule(key) {
  if (!MODULE_LOADERS[key]) return Promise.resolve();
  if (!loaded.has(key)) loaded.set(key, MODULE_LOADERS[key]().catch(err => { loaded.delete(key); console.warn('KSH Family Hub: could not load', key, err); }));
  return loaded.get(key);
}

const ROUTE_KEY = 'ksh_hub_route';
const THEME_KEY = 'ksh_hub_theme';
const PALETTE_KEY = 'ksh_hub_palette';
const HOUSEHOLD_KEY = 'ksh_hub_household';
const RAIL_MIN_WIDTH = 700;
// next to the app's files (this file is in chunks/), so it works behind a sub-path proxy and in the website demo too
const LOGO_URL = `${new URL('../ksh-logo.png', import.meta.url).href}?v=${CARD_VERSION}`;

// Menu entries backed by a real module element
const MODULE_ELEMENT = { shopping: 'ksh-shopping-module', cards: 'ksh-shopping-module', meals: 'ksh-recipes-module', chores: 'ksh-chores-module', calendar: 'ksh-calendar-module', finance: 'ksh-finance-module' };
const MODULE_DEFAULT_VIEW = { shopping: 'shopping', meals: 'grid', chores: 'today', calendar: 'month', finance: 'overview' };
// Sub views that take over the whole module (the module's own header has a back button)
const HIDE_TABS_IN = { meals: ['detail', 'add'] };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

export class KshFamilyHubCard extends LitElement {
  static properties = {
    hass: { type: Object },
    narrow: { type: Boolean },          // set by the HA panel; unused, width is measured instead
    _config: { state: true },
    _info: { state: true },
    _error: { state: true },
    _route: { state: true },
    _rail: { state: true },
    _moreOpen: { state: true },
    _theme: { state: true },
    _palette: { state: true },
    _households: { state: true },
    _householdId: { state: true },
    _sheet: { state: true },
    _language: { state: true },
    _subView: { state: true },
    _prefs: { state: true },
    _people: { state: true },
    _actingId: { state: true },
    _gen: { state: true },
    _applying: { state: true },
    _applyError: { state: true },
  };

  constructor() {
    super();
    this._config = {};
    this._info = null;
    this._error = null;
    this._route = store.get(ROUTE_KEY) || 'home';
    this._rail = false;
    this._moreOpen = false;
    this._theme = store.get(THEME_KEY) || 'dark';
    this._palette = themeId(store.get(PALETTE_KEY));
    this._households = [];
    this._householdId = null;
    this._sheet = null;
    this._language = this._readLanguage();
    this._subView = {};
    this._prefs = { order: [], blocked: {} };
    this._people = [];
    this._me = null;
    this._actingId = null;
    this._gen = 0;
    this._visited = new Set();
    if (!['home', 'settings'].includes(this._route)) this._visited.add(this._route === 'cards' ? 'shopping' : this._route);
    this._infoRequested = false;
    this._pending = null;
    this._applying = false;
    this._applyError = null;
    this._isPanel = false;
  }

  setConfig(config) { this._config = config || {}; }
  getCardSize() { return 10; }
  static getStubConfig() { return {}; }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('data-theme', this._palette);
    this._ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width ?? 0;
      if (w) this._rail = w >= RAIL_MIN_WIDTH;
    });
    this._ro.observe(this);
    this._onKey = e => { if (e.key === 'Escape' && this._moreOpen) this._moreOpen = false; };
    window.addEventListener('keydown', this._onKey);
    this._onActing = () => this._refreshActing();
    window.addEventListener(ACTING_EVENT, this._onActing);
    this._onVisible = () => { if (!document.hidden && this._infoRequested) this._loadPrefs(); };
    document.addEventListener('visibilitychange', this._onVisible);
    this._onResize = () => this._updateHeight();
    window.addEventListener('resize', this._onResize);
    window.visualViewport?.addEventListener('resize', this._onResize);
    this._isPanel = this.localName === 'ksh-family-hub-panel';
    // Fill the screen below whatever Home Assistant puts above us. The companion app on a phone does not always give a
    // panel a height, which left the menu at the very end of a long list; the sizes are checked again once the page settles.
    this._updateHeight();
    this._settle = [400, 1500].map(ms => setTimeout(() => this._updateHeight(), ms));
    if (ROUTE_MODULE[this._route]) loadModule(ROUTE_MODULE[this._route]);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    window.removeEventListener('keydown', this._onKey);
    window.removeEventListener(ACTING_EVENT, this._onActing);
    document.removeEventListener('visibilitychange', this._onVisible);
    window.removeEventListener('resize', this._onResize);
    window.visualViewport?.removeEventListener('resize', this._onResize);
    (this._settle || []).forEach(clearTimeout);
  }

  _updateHeight() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const top = this.getBoundingClientRect().top;
      const viewport = window.visualViewport?.height || window.innerHeight;
      // the top is measured from the page, so a page that has scrolled still gives the right height
      const available = Math.min(window.innerHeight, viewport) - Math.max(top, 0);
      if (available > 200) this.style.height = `${Math.round(available)}px`;
    }));
  }

  // Ignore the constant stream of unrelated Home Assistant changes: see hub/hass-util.js
  shouldUpdate(changed) {
    if (changed.size === 1 && changed.has('hass') && this._infoRequested) {
      return hassMatters(changed.get('hass'), this.hass, (this._hassMemo ||= {}));
    }
    return true;
  }

  willUpdate(changed) {
    if (changed.has('hass') && this.hass) setTimeZone(this.hass.config?.time_zone);
    if (changed.has('hass') && this.hass && !this._infoRequested) {
      this._infoRequested = true;
      this._loadInfo();
      this._loadHouseholds();
      this._loadPrefs();
    }
  }

  // Once the hub is showing, quietly fetch the small parts so they open at once. Not on a slow or metered connection
  // (data saver, 2G/3G), and never the two big ones (Shopping, Meals): those load when they are opened.
  _prefetchModules() {
    const net = navigator.connection;
    if (net && (net.saveData || /(^|-)[23]g$/.test(net.effectiveType || ''))) return;
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1500));
    idle(async () => {
      for (const key of ['chores', 'calendar', 'finance']) if (this._info?.modules?.[key]) await loadModule(key);
    });
  }

  updated(changed) {
    const more = this.renderRoot.querySelector('.sheet');
    if (more && !more._swipe) { more._swipe = true; enableSwipeClose(more, () => { this._moreOpen = false; }); }
    if (changed.has('_theme') || changed.has('hass')) this._applyMode();
    if (changed.has('_palette')) this.setAttribute('data-theme', this._palette);
    if (changed.has('_route') || changed.has('_gen') || changed.has('_info')) this._syncShoppingView();
    if (changed.has('_info') && this._info && !this._prefetched) { this._prefetched = true; this._prefetchModules(); }
  }

  // Cards (loyalty cards) is its own menu entry but lives inside the shopping module
  _syncShoppingView() {
    const el = this.renderRoot?.querySelector('#mod-shopping');
    if (!el) return;
    if (this._route === 'cards' && el.currentView !== 'loyalty') el.currentView = 'loyalty';
    else if (this._route === 'shopping' && el.currentView === 'loyalty') el.currentView = 'shopping';
  }

  // ---- data ---------------------------------------------------------------

  async _loadInfo() {
    try {
      const info = await this.hass.callWS({ type: 'ksh_family_hub/get_info' });
      if (this._pending) return;
      this._info = info;
      this._error = null;
      // A route may point at a module that has since been switched off
      if (!this._available(this._route)) this._setRoute('home');
    } catch (err) {
      this._error = err?.message || 'unknown_error';
    }
  }

  // ---- menu preferences: each login's order, and what each person is not shown ------------

  async _loadPrefs() {
    try {
      const [prefs, people] = await Promise.all([
        this.hass.callWS({ type: 'ksh_family_hub/prefs/get' }),
        loadPeople(this.hass),
      ]);
      this._prefs = { order: prefs.order || [], blocked: prefs.blocked || {} };
      this._people = people.people;
      this._me = people.me;
      this._refreshActing();
    } catch { /* the menu simply stays in its default order */ }
  }

  _refreshActing() {
    this._actingId = resolveActing(this.hass, this._people, this._me);
    if (this._info && !this._available(this._route)) this._setRoute('home');
  }

  /** Menu entries the person using this device may not see */
  get _blocked() { return this._prefs.blocked[this._actingId] || []; }

  /** Hidden for everyone by an administrator, plus hidden from the person using this device */
  get _hiddenAll() { return [...new Set([...(this._info?.hidden || []), ...this._blocked])]; }

  /** What the menus show: available, not hidden from this person, in this login's order */
  get _menuItems() {
    return orderItems(visibleItems(this._info?.modules, this._hiddenAll), this._prefs.order);
  }

  async _saveOrder(order) {
    this._prefs = { ...this._prefs, order };
    try { await this.hass.callWS({ type: 'ksh_family_hub/prefs/set_order', order }); } catch { /* keeps the local order */ }
  }

  async _saveAccess(personId, hidden) {
    const before = this._prefs.blocked;
    this._prefs = { ...this._prefs, blocked: { ...before, [personId]: hidden } };
    if (!hidden.length) { const { [personId]: _gone, ...rest } = this._prefs.blocked; this._prefs = { ...this._prefs, blocked: rest }; }
    try { await this.hass.callWS({ type: 'ksh_family_hub/prefs/set_access', person_id: personId, hidden }); }
    catch { this._prefs = { ...this._prefs, blocked: before }; }
  }

  /**
   * Apply a change from Hub settings. The menus update straight away; the backend is told
   * in the background, one request at a time, so several switches can be flipped in a row
   * without waiting for Home Assistant to reload.
   */
  _applyConfig(patch) {
    const info = this._info;
    // `items` is a delta ({id: shown}) so quick successive clicks never overwrite each other
    let hidden = info.hidden || [];
    if (patch.items) {
      const set = new Set(hidden);
      for (const [id, shown] of Object.entries(patch.items)) { if (shown) set.delete(id); else set.add(id); }
      hidden = [...set];
    }
    const next = { ...info, modules: { ...info.modules, ...(patch.modules || {}) }, hidden };
    const reloads = Object.keys(patch.modules || {}).some(k => !!patch.modules[k] !== !!info.modules[k]);
    this._info = next;
    if (reloads) { this._gen += 1; this._visited = new Set(); }
    if (!this._available(this._route)) this._setRoute('home');

    const send = { ...(patch.modules || {}) };
    if (patch.items) send.hidden = hidden;
    this._pending = { ...(this._pending || {}), ...send };
    if (!this._applying) this._flush();
  }

  async _flush() {
    this._applying = true;
    this._applyError = null;
    try {
      while (this._pending) {
        const patch = this._pending;
        this._pending = null;
        const res = await this.hass.callWS({ type: 'ksh_family_hub/set_modules', ...patch });
        const moduleChange = ['recipes', 'shopping', 'chores', 'calendar', 'finance'].some(k => k in patch);
        if (moduleChange) await this._waitForModules(res.modules);
      }
      if (!this._pending) await this._loadInfo();
    } catch (err) {
      this._applyError = err?.message || 'Could not save';
      await this._loadInfo();
    }
    this._applying = false;
    this.requestUpdate();
  }

  // The integration reloads itself after a part is switched; wait until it answers again
  async _waitForModules(want) {
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 800));
      try {
        const info = await this.hass.callWS({ type: 'ksh_family_hub/get_info' });
        if (Object.entries(want).every(([k, v]) => !!info.modules?.[k] === !!v)) return;
      } catch { /* still reloading */ }
    }
  }

  // ---- routing ------------------------------------------------------------

  _available(id) {
    if (id === 'settings') return true;
    return visibleItems(this._info?.modules, this._hiddenAll).some(i => i.id === id);
  }

  _setRoute(id) {
    if (ROUTE_MODULE[id]) loadModule(ROUTE_MODULE[id]);
    if (id === 'settings') { this._route = 'settings'; this._moreOpen = false; return; }
    this._route = id;
    this._moreOpen = false;
    if (id !== 'home') this._visited.add(id === 'cards' ? 'shopping' : id);
    store.set(ROUTE_KEY, id);
  }

  _onNavigate(e) { this._setRoute(e.detail.id); }

  _setTheme(theme) { this._theme = theme; store.set(THEME_KEY, theme); }

  get _dark() {
    if (this._theme === 'light') return false;
    if (this._theme === 'dark') return true;
    const ha = this.hass?.themes?.darkMode;
    return typeof ha === 'boolean' ? ha : window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  }

  _applyMode() { this.setAttribute('data-mode', this._dark ? 'dark' : 'light'); }

  _tabSelect(view) {
    const el = this.renderRoot.querySelector(`#mod-${this._route}`);
    this._subView = { ...this._subView, [this._route]: view };
    if (!el) return;
    if (this._route === 'shopping') el.currentView = view;
    else if (['meals', 'chores', 'calendar', 'finance'].includes(this._route)) el.setHubView(view);
  }

  // ---- households -----------------------------------------------------------

  async _loadHouseholds(select) {
    try {
      const { households } = await this.hass.callWS({ type: 'ksh_family_hub/households/list' });
      this._households = households;
      const key = `${HOUSEHOLD_KEY}_${this.hass.user?.id || ''}`;
      const want = select || this._householdId || store.get(key);
      this._householdId = (households.find(h => h.id === want) || households[0])?.id || null;
      if (this._householdId) store.set(key, this._householdId);
    } catch { /* the hub still works without households */ }
  }

  get _household() { return this._households.find(h => h.id === this._householdId) || this._households[0]; }

  _selectHousehold(id) {
    this._householdId = id;
    store.set(`${HOUSEHOLD_KEY}_${this.hass.user?.id || ''}`, id);
  }

  // ---- sheets ----------------------------------------------------------------

  _readLanguage() {
    try { return JSON.parse(localStorage.getItem('rm_settings') || '{}').language || 'en'; } catch { return 'en'; }
  }

  async _setLanguage(code) {
    this._language = code;
    if (!this._info?.modules?.recipes) {
      try { localStorage.setItem('rm_settings', JSON.stringify({ ...JSON.parse(localStorage.getItem('rm_settings') || '{}'), language: code })); } catch { /* ignore */ }
      return;
    }
    this._visited.add('meals');
    this.requestUpdate();
    await this.updateComplete;
    this.renderRoot.querySelector('#mod-meals')?.setLanguage?.(code);
  }

  // Quick add > Recipes: open the new-recipe form
  async _quickRecipe() {
    this._sheet = null;
    this._setRoute('meals');
    for (let i = 0; i < 20; i++) {
      await this.updateComplete;
      const el = this.renderRoot.querySelector('#mod-meals');
      if (el?.setHubView) { el.setHubView('add'); this._subView = { ...this._subView, meals: 'add' }; return; }
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Quick add > Chores: open the add-a-chore picker
  async _quickChore() {
    this._sheet = null;
    this._setRoute('chores');
    for (let i = 0; i < 20; i++) {
      await this.updateComplete;
      const el = this.renderRoot.querySelector('#mod-chores');
      if (el?.openAdd) { el.openAdd(); this._subView = { ...this._subView, chores: 'chores' }; return; }
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Quick add > Event / Reminders / Birthdays: open the new-event form on the calendar
  async _quickEvent(kind) {
    this._sheet = null;
    this._setRoute('calendar');
    for (let i = 0; i < 20; i++) {
      await this.updateComplete;
      const el = this.renderRoot.querySelector('#mod-calendar');
      if (el?.openAdd) { el.openAdd(kind); return; }
      await new Promise(r => setTimeout(r, 100));
    }
  }

  _topbar() {
    const route = this._route;
    const home = route === 'home';
    const title = home ? (this._household?.name || 'Home') : route === 'settings' ? 'Settings' : (itemById(route)?.label || '');
    return html`
      <header class="topbar">
        <button class="logo" title="KSH Family Hub" aria-label="KSH Family Hub, go to Home" @click=${() => this._setRoute('home')}>
          <img src=${LOGO_URL} alt="KSH" draggable="false">
        </button>
        ${home ? html`
          <button class="who" @click=${() => { this._sheet = 'menu'; }} aria-label="Household: ${title}">
            <span class="page-title">${title}</span>
          </button>` : html`<h1 class="page-title">${title}</h1>`}
        <span class="spacer"></span>
        <button class="icon-btn" title="Quick add" aria-label="Quick add" @click=${() => { this._sheet = 'quick'; }}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
        <button class="icon-btn" title="Menu" aria-label="Menu" aria-haspopup="dialog" @click=${() => { this._sheet = 'menu'; }}>
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>
      </header>`;
  }

  _onModuleView(id, e) {
    this._subView = { ...this._subView, [id]: e.detail.view };
  }

  // ---- render -------------------------------------------------------------

  render() {
    if (this._error) return this._renderError();
    if (!this._info) return html`<div class="center"><div class="spinner"></div></div>`;

    const items = this._menuItems;
    return html`
      <div class="shell">
        ${this._topbar()}
        <div class="body ${this._rail ? 'rail-layout' : 'bar-layout'}">
          ${this._rail ? this._renderRail(items) : nothing}
          <main class="stage">
            ${this._renderStage()}
          </main>
          ${!this._rail ? this._renderBar(items) : nothing}
        </div>
      </div>
      ${this._moreOpen ? this._renderMore(items) : nothing}
      <ksh-hub-sheets .hass=${this.hass} .sheet=${this._sheet} .households=${this._households} .activeId=${this._householdId}
        .modules=${this._info.modules} .hidden=${this._hiddenAll} .panel=${this._isPanel} .language=${this._language}
        @hub-close=${() => { this._sheet = null; }}
        @hub-sheet=${e => { this._sheet = e.detail.sheet; }}
        @hub-household-select=${e => this._selectHousehold(e.detail.id)}
        @hub-households-changed=${e => this._loadHouseholds(e.detail.select)}
        @hub-open-settings=${() => { this._sheet = null; this._setRoute('settings'); }}
        @hub-set-language=${e => this._setLanguage(e.detail.code)}
        @hub-quick=${e => { const id = e.detail.id; if (id === 'meals') this._quickRecipe(); else if (id === 'chores') this._quickChore(); else if (['event', 'reminders', 'birthdays'].includes(id)) this._quickEvent(id); }}
        @hub-region-changed=${() => { this._gen++; }}
        @hass-toggle-menu=${() => { this._sheet = null; }}></ksh-hub-sheets>
    `;
  }

  _renderError() {
    return html`
      <div class="center">
        <div class="error-card">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <h3>KSH Family Hub isn't ready</h3>
          <p>The integration did not answer. Check that <b>KSH Family Hub</b> is added under
             Settings → Devices &amp; services, then refresh this page.</p>
          <code>${this._error}</code>
          <button class="btn" @click=${() => { this._infoRequested = false; this._error = null; this.requestUpdate(); }}>Retry</button>
        </div>
      </div>
    `;
  }

  _renderStage() {
    const route = this._route;
    const mod = MODULE_ELEMENT[route];
    const tabs = SUB_TABS[route];
    const sub = this._subView[route] || MODULE_DEFAULT_VIEW[route];
    const showTabs = tabs && !(HIDE_TABS_IN[route] || []).includes(sub);
    const dark = this._dark;
    const ui = 'compact';

    return html`
      ${route === 'home' ? html`
        <ksh-hub-home .hass=${this.hass} .modules=${this._info.modules} .hidden=${this._hiddenAll} .dark=${dark} .panel=${this._isPanel}
          @hub-navigate=${this._onNavigate}
          @hub-open-settings=${() => this._setRoute('settings')}></ksh-hub-home>` : nothing}

      ${route === 'settings' ? html`
        <ksh-hub-settings .hass=${this.hass} .info=${this._info} .theme=${this._theme} .palette=${this._palette}
          .cardVersion=${CARD_VERSION} .applying=${this._applying} .applyError=${this._applyError}
          .prefs=${this._prefs} .people=${this._people} .order=${this._menuItems.map(i => i.id)}
          @hub-order=${e => this._saveOrder(e.detail.order)}
          @hub-access=${e => this._saveAccess(e.detail.person, e.detail.hidden)}
          @hub-theme=${e => this._setTheme(e.detail.theme)}
          @hub-palette=${e => { this._palette = e.detail.palette; store.set(PALETTE_KEY, this._palette); }}
          @hub-config=${e => this._applyConfig(e.detail)}
          @hub-back=${() => this._setRoute('home')}></ksh-hub-settings>` : nothing}

      ${!mod && route !== 'home' && route !== 'settings' ? html`
        <ksh-hub-placeholder .item=${itemById(route)}
          @hub-navigate=${this._onNavigate}></ksh-hub-placeholder>` : nothing}

      ${showTabs ? html`
        <nav class="subtabs" aria-label="Sections">
          <div class="subtab-list">
            ${tabs.filter(t => t.view !== 'settings').map(t => html`
              <button class="subtab ${sub === t.view ? 'active' : ''}" @click=${() => this._tabSelect(t.view)}>
                <ha-icon icon=${t.icon}></ha-icon><span>${t.label}</span>
              </button>`)}
          </div>
          ${tabs.some(t => t.view === 'settings') ? html`
            <button class="subtab gear ${sub === 'settings' ? 'active' : ''}" title="Settings" aria-label="Settings"
              @click=${() => this._tabSelect('settings')}><ha-icon icon="mdi:cog-outline"></ha-icon></button>` : nothing}
        </nav>` : nothing}

      ${keyed(this._gen, html`
        ${this._visited.has('shopping') && this._info.modules.shopping ? html`
          <div class="module" ?hidden=${route !== 'shopping' && route !== 'cards'}>
            <ksh-shopping-module id="mod-shopping" hub-mode
              .hass=${this.hass} .hostUi=${ui} .hostDark=${dark}
              @module-view-changed=${e => this._onModuleView('shopping', e)}></ksh-shopping-module>
          </div>` : nothing}
        ${this._visited.has('meals') && this._info.modules.recipes ? html`
          <div class="module" ?hidden=${route !== 'meals'}>
            <ksh-recipes-module id="mod-meals" hub-mode
              .hass=${this.hass} .hostUi=${ui} .hostDark=${dark}
              @module-view-changed=${e => this._onModuleView('meals', e)}></ksh-recipes-module>
          </div>` : nothing}
        ${this._visited.has('chores') && this._info.modules.chores ? html`
          <div class="module" ?hidden=${route !== 'chores'}>
            <ksh-chores-module id="mod-chores" hub-mode .hass=${this.hass} .modules=${this._info.modules}
              @hub-sheet=${e => { this._sheet = e.detail.sheet; }}
              @hub-navigate=${this._onNavigate}
              @module-view-changed=${e => this._onModuleView('chores', e)}></ksh-chores-module>
          </div>` : nothing}
        ${this._visited.has('calendar') && this._info.modules.calendar ? html`
          <div class="module" ?hidden=${route !== 'calendar'}>
            <ksh-calendar-module id="mod-calendar" hub-mode .hass=${this.hass} .modules=${this._info.modules}
              @hub-sheet=${e => { this._sheet = e.detail.sheet; }}
              @hub-navigate=${this._onNavigate}
              @module-view-changed=${e => this._onModuleView('calendar', e)}></ksh-calendar-module>
          </div>` : nothing}
        ${this._visited.has('finance') && this._info.modules.finance ? html`
          <div class="module" ?hidden=${route !== 'finance'}>
            <ksh-finance-module id="mod-finance" hub-mode .hass=${this.hass} .modules=${this._info.modules}
              @module-view-changed=${e => this._onModuleView('finance', e)}></ksh-finance-module>
          </div>` : nothing}
      `)}
    `;
  }

  _tile(item, { active = false, size = '' } = {}) {
    return html`
      <span class="tile ${active ? 'active' : ''} ${size}" style="--c:${item.color}">
        <ha-icon icon=${item.icon}></ha-icon>
      </span>`;
  }

  _renderBar(items) {
    const primary = [...items.filter(i => i.home), ...items.filter(i => !i.home).slice(0, BAR_SLOTS)];
    const moreActive = !primary.some(i => i.id === this._route) && this._route !== 'settings';
    return html`
      <nav class="bar" aria-label="Main">
        ${primary.map(i => html`
          <button class="bar-item ${this._route === i.id ? 'active' : ''}" @click=${() => this._setRoute(i.id)}
            aria-current=${this._route === i.id ? 'page' : 'false'}>
            ${this._tile(i, { active: this._route === i.id })}
            <span class="label">${i.label}</span>
          </button>`)}
        <button class="bar-item ${moreActive || this._moreOpen ? 'active' : ''}" @click=${() => { this._moreOpen = !this._moreOpen; }}
          aria-haspopup="dialog" aria-expanded=${this._moreOpen ? 'true' : 'false'}>
          <span class="tile more ${moreActive ? 'active' : ''}"><ha-icon icon="mdi:dots-grid"></ha-icon></span>
          <span class="label">More</span>
        </button>
      </nav>`;
  }

  _renderRail(items) {
    return html`
      <nav class="rail" aria-label="Main">
        ${items.map(i => html`
          <button class="rail-item ${this._route === i.id ? 'active' : ''}" title=${i.label}
            @click=${() => this._setRoute(i.id)} aria-label=${i.label}
            aria-current=${this._route === i.id ? 'page' : 'false'}>
            ${this._tile(i, { active: this._route === i.id })}
            ${this._route === i.id ? html`<span class="label">${i.label}</span>` : nothing}
          </button>`)}
      </nav>`;
  }

  _renderMore(items) {
    const list = items.filter(i => !i.home);
    return html`
      <div class="scrim" @click=${() => { this._moreOpen = false; }}></div>
      <section class="sheet" role="dialog" aria-label="All sections"
>
        <div class="grabber"></div>
        <div class="grid">
          ${list.map(i => html`
            <button class="grid-item" @click=${() => this._setRoute(i.id)}>
              ${this._tile(i, { size: 'lg' })}
              <span class="label">${i.label}</span>
            </button>`)}
        </div>
      </section>`;
  }

  static styles = [hubTokens, css`
    :host {
      display: block;
      height: 100%;
      min-height: 420px;
      position: relative;
      overflow: hidden;
      background: var(--hub-bg);
      font-family: var(--paper-font-body1_-_font-family, 'Roboto', system-ui, sans-serif);
      box-sizing: border-box;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    :host(.panel), :host([panel]) { border-radius: 0; }
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    button { font: inherit; color: inherit; }

    .shell { height: 100%; display: flex; flex-direction: column; min-height: 0; }
    .body { flex: 1; min-height: 0; display: flex; }
    .body.bar-layout { flex-direction: column; }
    .body.rail-layout { flex-direction: row; }
    .stage { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; position: relative; }
    .module { flex: 1; min-height: 0; display: block; position: relative; }
    .module > * { display: block; height: 100%; }

    /* ---- top bar: logo (phone), page title, settings gear ---- */
    .topbar { flex: none; display: flex; align-items: center; gap: 10px; padding: 10px 14px 4px 10px; min-height: 70px; }
    .page-title { min-width: 0; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--hub-text); }
    .spacer { flex: 1; }
    .who { min-width: 0; display: flex; align-items: center; background: none; border: none; color: inherit;
      padding: 4px 8px; margin-left: -4px; cursor: pointer; border-radius: 10px; text-align: left; }
    .who:hover { background: var(--hub-surface-2); }
    .who .page-title { max-width: 100%; }
    .icon-btn {
      flex: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--hub-border); cursor: pointer;
      background: var(--hub-surface); color: var(--hub-muted); display: flex; align-items: center; justify-content: center;
      --mdc-icon-size: 22px; transition: background .15s, color .15s;
    }
    .icon-btn:hover { color: var(--hub-text); }
    .icon-btn.active { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .logo { flex: none; width: 58px; height: 58px; padding: 0; border: none; background: none; cursor: pointer; border-radius: 17px; line-height: 0; }
    .logo img { width: 100%; height: 100%; display: block; border-radius: 17px; }

    /* ---- sub tabs ---- */
    .subtabs { display: flex; align-items: center; gap: 8px; padding: 6px 12px; flex: none; }
    .subtab-list { flex: 1; min-width: 0; display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
    .subtab-list::-webkit-scrollbar { display: none; }
    @media (max-width: 460px) { .subtab:not(.gear) ha-icon { display: none; } .subtab { padding: 7px 12px; } }
    .subtab.gear { padding: 0; width: 38px; height: 38px; justify-content: center; border-radius: 50%; }
    .subtab.gear ha-icon { --mdc-icon-size: 22px; }
    .subtab {
      display: inline-flex; align-items: center; gap: 6px; flex: none;
      padding: 7px 14px; border-radius: 999px; border: 1px solid var(--hub-border);
      background: transparent; color: var(--hub-muted); cursor: pointer; font-size: 13.5px; font-weight: 600;
    }
    .subtab ha-icon { --mdc-icon-size: 18px; }
    .subtab.active { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    /* ---- tiles (shared by bar, rail and sheet) ---- */
    .tile {
      position: relative; display: inline-flex; align-items: center; justify-content: center;
      width: 42px; height: 42px; border-radius: 14px; flex: none;
      background: var(--hub-surface-2);
      color: var(--hub-muted);
      transition: background .15s, color .15s, transform .15s;
      --mdc-icon-size: 24px;
    }
    .tile.lg { width: 54px; height: 54px; border-radius: 17px; --mdc-icon-size: 28px; }
    .tile.active { background: var(--hub-accent); color: var(--hub-accent-ink); }
    :host([data-mode="light"]) .tile.more { background: rgba(60, 80, 100, 0.1); }
    .tile.more.active { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .label { font-size: 12px; font-weight: 600; color: var(--hub-muted); line-height: 1.15; }

    /* ---- bottom bar (phone) ---- */
    .bar {
      flex: none; display: flex; justify-content: space-around; align-items: flex-start;
      margin: 6px 10px calc(10px + env(safe-area-inset-bottom, 0px)); padding: 10px 6px 9px;
      background: var(--hub-nav); border: 1px solid var(--hub-border); border-radius: 28px;
      box-shadow: var(--hub-shadow); backdrop-filter: blur(14px);
    }
    .bar-item {
      flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 0; -webkit-tap-highlight-color: transparent;
    }
    .bar-item.active .label { color: var(--hub-text); font-weight: 800; }
    .bar-item:active .tile { transform: scale(.94); }

    /* ---- rail (tablet) ---- */
    .rail {
      flex: none; width: 76px; margin: 4px 0 10px 10px; padding: 12px 0;
      display: flex; flex-direction: column; align-items: center; gap: 6px; overflow-y: auto; scrollbar-width: none;
      background: var(--hub-nav); border: 1px solid var(--hub-border); border-radius: 28px; box-shadow: var(--hub-shadow);
    }
    .rail::-webkit-scrollbar { display: none; }
    .rail-item {
      background: none; border: none; cursor: pointer; padding: 3px 0; width: 100%;
      display: flex; flex-direction: column; align-items: center; gap: 3px;
    }
    .rail-item.active .label { color: var(--hub-text); font-weight: 800; }
    .rail-item:hover .tile:not(.active) { background: color-mix(in srgb, var(--hub-accent) 16%, var(--hub-surface-2)); color: var(--hub-text); }

    /* ---- more sheet ---- */
    .scrim { position: absolute; inset: 0; background: rgba(4, 12, 20, 0.55); z-index: 20; animation: fade .18s ease; }
    .sheet {
      position: absolute; left: 0; right: 0; bottom: 0; z-index: 21; max-height: 88%; overflow-y: auto;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(28px + env(safe-area-inset-bottom, 0px));
      box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1);
      overscroll-behavior: contain;
    }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160, 190, 215, .55); margin: 2px auto 22px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px 4px; }
    .grid-item {
      background: none; border: none; cursor: pointer; padding: 0;
      display: flex; flex-direction: column; align-items: center; gap: 9px; min-width: 0;
    }
    .grid-item .label { color: var(--hub-text); font-weight: 700; font-size: 12.5px; }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }

    /* ---- states ---- */
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner {
      width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border);
      border-top-color: var(--hub-accent); animation: spin .8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-card {
      max-width: 420px; text-align: center; padding: 28px; border-radius: 22px;
      background: var(--hub-surface); border: 1px solid var(--hub-border); display: grid; gap: 10px; justify-items: center;
    }
    .error-card ha-icon { --mdc-icon-size: 40px; color: #e8a04a; }
    .error-card h3 { margin: 0; }
    .error-card p { margin: 0; color: var(--hub-muted); font-size: 14px; }
    .error-card code { font-size: 12px; color: var(--hub-muted); }
    .btn {
      border: none; border-radius: 999px; padding: 9px 20px; cursor: pointer; font-weight: 700;
      background: var(--hub-accent); color: var(--hub-accent-ink);
    }
  `];
}

// One class per custom element: the dashboard card and the sidebar panel share all behaviour.
class KshFamilyHubPanel extends KshFamilyHubCard {
  connectedCallback() { this.setAttribute('panel', ''); super.connectedCallback(); }

  // /ksh-family-hub?kids=Mia opens the kids' screen for that child instead of the hub, full screen, with no dashboard card needed
  render() {
    const params = new URLSearchParams(window.location.search);
    const kid = params.get('kids');
    if (!kid) return super.render();
    if (!this._kidsEl || this._kidsFor !== kid) {
      this._kidsFor = kid;
      this._kidsEl = document.createElement('ksh-family-hub-kids-core');
      this._kidsEl.setConfig({ person: kid, style: params.get('style') || undefined, height: '100dvh' });
    }
    this._kidsEl.hass = this.hass;
    return html`${this._kidsEl}`;
  }
}

// The dashboard card is a small shell (src/loader.js) that loads this file and puts <ksh-family-hub-core> inside itself.
// The sidebar panel loads this file directly.
if (!customElements.get('ksh-family-hub-core')) customElements.define('ksh-family-hub-core', KshFamilyHubCard);
if (!customElements.get('ksh-family-hub-panel')) customElements.define('ksh-family-hub-panel', KshFamilyHubPanel);
