import { LitElement, html, css, nothing } from 'lit';
import { enableSwipeClose } from './swipe.js';
import { getActing, actingMsg, resolveActing } from './actor.js';
import { EMOJIS } from '../modules/chores/templates.js';

const LANGUAGES = [
  ['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['de', 'Deutsch'],
  ['pt', 'Português'], ['nl', 'Nederlands'], ['it', 'Italiano'],
];

// Quick add entries. `module` = the part of the hub that has to be on; `soon` = not built yet.
const QUICK = [
  { id: 'shopping',  label: 'Shopping List', icon: 'mdi:cart-outline',        color: '#4fd1a1', module: 'shopping' },
  { id: 'meals',     label: 'Recipes',       icon: 'mdi:silverware-fork-knife', color: '#f59a4d', module: 'recipes' },
  { id: 'chores',    label: 'Chores',        icon: 'mdi:check-circle-outline', color: '#3db6cc', module: 'chores' },
  { id: 'event',     label: 'Event',         icon: 'mdi:calendar-plus',       color: '#8f7cf0', module: 'calendar' },
  { id: 'reminders', label: 'Reminders',     icon: 'mdi:bell-outline',        color: '#6f80f2', module: 'calendar' },
  { id: 'birthdays', label: 'Birthdays',     icon: 'mdi:cake-variant-outline', color: '#cf6fb6', module: 'calendar' },
];

/** The bottom sheets opened from the top bar: menu, quick add, invite member, region and language. */
class KshHubSheets extends LitElement {
  static properties = {
    hass: { type: Object },
    sheet: { type: String, reflect: true },            // 'menu' | 'quick' | 'invite' | 'region'
    households: { type: Array },
    activeId: { type: String },
    modules: { type: Object },
    hidden: { type: Array },
    panel: { type: Boolean },
    language: { type: String },
    _switcher: { state: true },
    _newName: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _quick: { state: true },
    _itemName: { state: true },
    _toast: { state: true },
    _regions: { state: true },
    _country: { state: true },
    _people: { state: true },
    _logins: { state: true },
    _me: { state: true },
    _edit: { state: true },
    _form: { state: true },
  };

  constructor() {
    super();
    this.households = [];
    this._switcher = false;
    this._newName = '';
    this._busy = false;
    this._error = null;
    this._quick = null;
    this._itemName = '';
    this._toast = null;
    this._regions = null;
    this._country = '';
    this._people = [];
    this._logins = [];
    this._me = null;
    this._edit = null;
    this._form = null;
  }

  get _active() { return this.households.find(h => h.id === this.activeId) || this.households[0]; }

  get _haPeople() {
    return Object.values(this.hass?.states || {})
      .filter(s => s.entity_id.startsWith('person.') && s.attributes?.user_id)
      .map(s => ({ user_id: s.attributes.user_id, name: s.attributes.friendly_name || s.entity_id }));
  }

  _emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true })); }
  _close() { this._emit('hub-close'); }
  _open(sheet) { this._error = null; this._emit('hub-sheet', { sheet }); }

  updated(changed) {
    if (changed.has('sheet')) {
      this._error = null; this._quick = null; this._itemName = ''; this._toast = null;
      if (this.sheet === 'menu') this._switcher = false;
      if (this.sheet === 'region' && !this._regions) this._loadRegions();
      if (this.sheet === 'people') { this._edit = null; this._loadPeople(); }
    }
    const sheet = this.renderRoot.querySelector('.sheet');
    if (sheet && !sheet._swipe) { sheet._swipe = true; enableSwipeClose(sheet, () => this._close()); }
    if (this._quick === 'shopping' && changed.has('_quick')) this.renderRoot.querySelector('.field input')?.focus();
  }

  // ---- households -----------------------------------------------------------

  async _ws(msg) {
    this._busy = true; this._error = null;
    try { return await this.hass.callWS(msg); }
    catch (err) { this._error = err?.message || 'Something went wrong'; return null; }
    finally { this._busy = false; }
  }

  async _createHousehold() {
    const name = this._newName.trim();
    if (!name) return;
    const res = await this._ws({ type: 'ksh_family_hub/households/create', name });
    if (!res) return;
    this._newName = '';
    this._emit('hub-households-changed', { select: res.household.id });
    this._switcher = false;
  }

  async _addMember(userId) {
    const h = this._active;
    const res = await this._ws({ type: 'ksh_family_hub/households/add_member', household_id: h.id, user_id: userId });
    if (res) this._emit('hub-households-changed', {});
  }

  async _removeMember(userId) {
    const h = this._active;
    const res = await this._ws({ type: 'ksh_family_hub/households/remove_member', household_id: h.id, user_id: userId });
    if (res) this._emit('hub-households-changed', {});
  }

  async _deleteHousehold() {
    const h = this._active;
    if (!confirm(`Delete the household "${h.name}"? Its members lose access to it.`)) return;
    const res = await this._ws({ type: 'ksh_family_hub/households/delete', household_id: h.id });
    if (res) { this._emit('hub-households-changed', {}); this._open('menu'); }
  }

  async _renameHousehold() {
    const h = this._active;
    const name = prompt('Household name', h.name);
    if (!name || !name.trim() || name.trim() === h.name) return;
    const res = await this._ws({ type: 'ksh_family_hub/households/update', household_id: h.id, name: name.trim() });
    if (res) this._emit('hub-households-changed', {});
  }

  // ---- quick add ------------------------------------------------------------

  async _addShoppingItem(e) {
    e?.preventDefault();
    const name = this._itemName.trim();
    if (!name) return;
    const lists = await this._ws({ type: 'ksh_shopping/lists/get_all' });
    if (!lists) return;
    const all = lists.lists || [];
    const list = all.find(l => l.active) || all[0];
    if (!list) { this._error = 'Create a shopping list first.'; return; }
    const res = await this._ws({ type: 'ksh_shopping/items/add', list_id: list.id, name, category_id: 'other' });
    if (!res) return;
    this._toast = `Added “${name}” to ${list.name}`;
    this._itemName = '';
    this.renderRoot.querySelector('.field input')?.focus();
  }

  _pickQuick(q) {
    if (q.soon) return;
    if (q.id === 'shopping') { this._quick = 'shopping'; return; }
    this._emit('hub-quick', { id: q.id });
  }

  // ---- people --------------------------------------------------------------

  async _loadPeople() {
    try {
      const res = await this.hass.callWS({ type: 'ksh_family_hub/people/list' });
      this._people = res.people;
      this._me = res.me;
    } catch (err) { this._error = err?.message || 'Could not load people'; }
    this._loadLogins();
  }

  // Home Assistant logins an adult can link to a person (only adults are allowed to ask)
  async _loadLogins() {
    try {
      const acting = resolveActing(this.hass, this._people, this._me);
      this._logins = (await this.hass.callWS({ type: 'ksh_family_hub/people/users', ...actingMsg(this.hass, acting) })).users;
    } catch { this._logins = []; }
  }

  get _iAmAdult() {
    const acting = this._people.find(p => p.id === resolveActing(this.hass, this._people, this._me));
    return acting ? acting.role === 'adult' : !!this.hass?.user?.is_admin;
  }

  _startPerson(p) {
    this._edit = p ? p.id : 'new';
    this._form = p
      ? { name: p.name, role: p.role, emoji: p.emoji, pin: '', clearPin: false, notify: p.notify || '', user_id: p.user_id || '' }
      : { name: '', role: 'child', emoji: '🙂', pin: '', clearPin: false, notify: '', user_id: '' };
    this._error = null;
  }

  async _savePerson() {
    const f = this._form;
    if (!f.name.trim()) { this._error = 'Give them a name'; return; }
    if (f.pin && !/^\d{4}$/.test(f.pin)) { this._error = 'A PIN is four digits'; return; }
    const acting = resolveActing(this.hass, this._people, this._me);
    const base = { name: f.name.trim(), role: f.role, emoji: f.emoji || '🙂', notify: f.notify.trim() || null, user_id: f.user_id || null, ...actingMsg(this.hass, acting) };
    let res;
    if (this._edit === 'new') res = await this._ws({ type: 'ksh_family_hub/people/add', ...base, ...(f.pin ? { pin: f.pin } : {}) });
    else res = await this._ws({ type: 'ksh_family_hub/people/update', person_id: this._edit, ...base, ...(f.pin ? { pin: f.pin } : f.clearPin ? { pin: null } : {}) });
    if (res) { this._edit = null; this._form = null; this._loadPeople(); }
  }

  async _deletePerson() {
    const p = this._people.find(x => x.id === this._edit);
    if (!confirm(`Remove ${p.name}? ${p.user_id ? 'Their Home Assistant login is not touched. ' : ''}Points they earned stay in the history.`)) return;
    const acting = resolveActing(this.hass, this._people, this._me);
    const res = await this._ws({ type: 'ksh_family_hub/people/delete', person_id: p.id, ...actingMsg(this.hass, acting) });
    if (res) { this._edit = null; this._form = null; this._loadPeople(); }
  }

  // ---- region and language --------------------------------------------------

  async _loadRegions() {
    if (!this.modules?.shopping) { this._regions = {}; return; }
    try {
      const res = await this.hass.callWS({ type: 'ksh_shopping/get_integration_settings' });
      const custom = Object.fromEntries(Object.entries(res.custom_regions || {})
        .map(([c, v]) => [c, typeof v === 'string' ? v : v?.name || c]));
      this._regions = { ...(res.available_countries || {}), ...custom };
      this._country = res.country || '';
    } catch (err) { this._regions = {}; this._error = 'Could not load the regions.'; }
  }

  async _setRegion(code) {
    if (!code || code === this._country) return;
    const name = this._regions[code] || code;
    if (!confirm(`Switch the shopping catalogue to ${name}?\n\nThe built-in products are replaced with ${name} products. Products you created yourself are kept.`)) {
      this.requestUpdate(); return;
    }
    const res = await this._ws({ type: 'ksh_shopping/set_country', country: code });
    if (res) { this._country = res.country; this._toast = `Region set to ${name}`; this._emit('hub-region-changed', { country: res.country }); }
  }

  // ---- render ---------------------------------------------------------------

  render() {
    if (!this.sheet) return nothing;
    return html`
      <div class="scrim" @click=${this._close}></div>
      <section class="sheet" role="dialog" aria-label=${this._label}
  >
        <div class="grabber"></div>
        ${this.sheet === 'menu' ? this._menu() : nothing}
        ${this.sheet === 'quick' ? this._quickSheet() : nothing}
        ${this.sheet === 'invite' ? this._invite() : nothing}
        ${this.sheet === 'region' ? this._region() : nothing}
        ${this.sheet === 'people' ? this._peopleSheet() : nothing}
      </section>`;
  }

  get _label() {
    return { menu: 'Menu', quick: 'Quick add', invite: 'Invite member', region: 'Region and language', people: 'People and guests' }[this.sheet] || '';
  }

  _head(title, back, onBack) {
    return html`
      <div class="head">
        ${back || onBack ? html`<button class="back" aria-label="Back" @click=${onBack || (() => this._open('menu'))}><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : nothing}
        <h2>${title}</h2>
      </div>`;
  }

  _row(icon, label, onClick, { sub = '', color = 'var(--hub-accent)', chevron = false, disabled = false, pill = '' } = {}) {
    return html`
      <button class="row" ?disabled=${disabled} @click=${onClick} style="--c:${color}">
        <span class="ico"><ha-icon icon=${icon}></ha-icon></span>
        <span class="txt"><b>${label}</b>${sub ? html`<small>${sub}</small>` : nothing}</span>
        ${pill ? html`<span class="pill">${pill}</span>` : nothing}
        ${chevron ? html`<ha-icon class="chev" icon=${chevron === true ? 'mdi:chevron-right' : chevron}></ha-icon>` : nothing}
      </button>`;
  }

  _menu() {
    const h = this._active;
    const many = this.households.length > 1;
    return html`
      ${this._row('mdi:home-heart', h?.name || 'Household', () => { this._switcher = !this._switcher; },
        { sub: h?.everyone ? 'Everyone on this Home Assistant' : `${h?.members?.length ?? 0} member${h?.members?.length === 1 ? '' : 's'}`,
          chevron: this._switcher ? 'mdi:chevron-up' : 'mdi:chevron-down', color: 'var(--hub-accent)' })}
      ${this._switcher ? html`
        <div class="switcher">
          ${this.households.map(x => html`
            <button class="opt ${x.id === h?.id ? 'on' : ''}" @click=${() => { this._emit('hub-household-select', { id: x.id }); this._switcher = false; }}>
              <ha-icon icon=${x.id === h?.id ? 'mdi:check-circle' : 'mdi:circle-outline'}></ha-icon>
              <span>${x.name}</span>
            </button>`)}
          <form class="new" @submit=${e => { e.preventDefault(); this._createHousehold(); }}>
            <input placeholder="New household name" .value=${this._newName} maxlength="60"
              @input=${e => { this._newName = e.target.value; }}>
            <button type="submit" ?disabled=${!this._newName.trim() || this._busy}>Create</button>
          </form>
          ${!many ? html`<p class="hint">Make another household to share with a flat, friends or other family.</p>` : nothing}
        </div>` : nothing}
      ${this._error ? html`<p class="err">${this._error}</p>` : nothing}
      <div class="divider"></div>
      ${this._row('mdi:account-plus-outline', 'Invite member', () => this._open('invite'), { color: '#6f80f2' })}
      ${this._row('mdi:account-child-outline', 'People & guests', () => this._open('people'), { color: '#e2ac3f' })}
      ${this._row('mdi:cog-outline', 'Settings', () => this._emit('hub-open-settings'), { color: '#9fb2c5' })}
      ${this._row('mdi:translate', 'Change Region/Language', () => this._open('region'), { color: '#4a86f0' })}
      ${this.panel ? html`
        <div class="divider"></div>
        ${this._row('mdi:menu', 'Home Assistant menu', () => { this._close(); this._emit('hass-toggle-menu'); }, { color: '#9fb2c5' })}` : nothing}`;
  }

  _quickSheet() {
    if (this._quick === 'shopping') {
      return html`
        ${this._head('Add to shopping list', true)}
        <form class="field" @submit=${this._addShoppingItem}>
          <input placeholder="e.g. Milk" .value=${this._itemName} @input=${e => { this._itemName = e.target.value; }} enterkeyhint="done">
          <button type="submit" ?disabled=${!this._itemName.trim() || this._busy}>Add</button>
        </form>
        ${this._toast ? html`<p class="ok"><ha-icon icon="mdi:check-circle"></ha-icon>${this._toast}</p>` : nothing}
        ${this._error ? html`<p class="err">${this._error}</p>` : nothing}`;
    }
    const hidden = this.hidden || [];
    const list = QUICK.filter(q => (!q.module || this.modules?.[q.module]) && !hidden.includes(q.id));
    return html`
      ${this._head('Quick add')}
      ${list.map(q => this._row(q.icon, q.label, () => this._pickQuick(q),
        { color: q.color, disabled: !!q.soon, pill: q.soon ? 'Soon' : '', chevron: !q.soon }))}`;
  }

  _invite() {
    const h = this._active;
    if (!h) return html`${this._head('Invite member', true)}<p class="hint">No household yet.</p>`;
    const people = this._haPeople;
    const nameOf = id => people.find(p => p.user_id === id)?.name || 'Unknown user';
    const canAdd = people.filter(p => !h.members.includes(p.user_id));
    return html`
      ${this._head(`Invite to ${h.name}`, true)}
      ${h.everyone ? html`
        <p class="hint">Everyone who has a login on this Home Assistant is already in <b>${h.name}</b>.
          To share with only some people (a flat, friends, grandparents), make a separate household and invite them to it.</p>
        ${this._row('mdi:plus-circle-outline', 'New household', () => { this._open('menu'); this._switcher = true; }, { color: '#4fd1a1', chevron: true })}`
      : html`
        <h3>Members</h3>
        ${h.members.map(id => html`
          <div class="member">
            <span class="ico"><ha-icon icon="mdi:account-outline"></ha-icon></span>
            <span class="txt"><b>${nameOf(id)}</b>${id === h.owner_id ? html`<small>Owner</small>` : nothing}</span>
            ${h.can_manage && id !== h.owner_id ? html`
              <button class="mini" @click=${() => this._removeMember(id)} ?disabled=${this._busy}>Remove</button>` : nothing}
          </div>`)}
        ${h.can_manage ? html`
          <h3>Add someone</h3>
          ${canAdd.length ? canAdd.map(p => html`
            <div class="member">
              <span class="ico"><ha-icon icon="mdi:account-plus-outline"></ha-icon></span>
              <span class="txt"><b>${p.name}</b></span>
              <button class="mini add" @click=${() => this._addMember(p.user_id)} ?disabled=${this._busy}>Add</button>
            </div>`) : html`<p class="hint">Everyone with a login is already a member.
              People need their own Home Assistant login (and a Person) before they can be added.</p>`}
          <div class="divider"></div>
          ${this._row('mdi:pencil-outline', 'Rename household', () => this._renameHousehold(), { color: '#9fb2c5' })}
          ${this._row('mdi:trash-can-outline', 'Delete household', () => this._deleteHousehold(), { color: '#e46d5e' })}`
          : html`<p class="hint">Only the owner can add people.</p>`}`}
      ${this._row('mdi:account-child-outline', 'Add someone without a login', () => this._open('people'), { color: '#e2ac3f', sub: 'Children and guests', chevron: true })}
      ${this._error ? html`<p class="err">${this._error}</p>` : nothing}`;
  }

  _peopleSheet() {
    const label = { adult: 'Adult', child: 'Child', guest: 'Guest' };
    if (this._edit) {
      const f = this._form;
      const person = this._people.find(p => p.id === this._edit);
      const set = patch => { this._form = { ...this._form, ...patch }; };
      return html`
        ${this._head(this._edit === 'new' ? 'Add a person' : `Edit ${person?.name || ''}`, false, () => { this._edit = null; this._error = null; })}
        <div class="pform">
          <label>Name<input maxlength="40" .value=${f.name} @input=${e => set({ name: e.target.value })} placeholder="e.g. Leo"></label>
          <label>Role</label>
          <div class="seg">${Object.entries(label).map(([v, l]) => html`<button type="button" class=${f.role === v ? 'on' : ''} @click=${() => set({ role: v })}>${l}</button>`)}</div>
          <p class="hint">${{
            adult: 'Adults manage chores, approve them and look after people.',
            child: 'Children do chores and routines. An adult approves them.',
            guest: 'Guests only see chores that are assigned to them.' }[f.role]}</p>
          <label>Home Assistant login <small>(optional)</small>
            <select .value=${f.user_id} @change=${e => set({ user_id: e.target.value })}>
              <option value="" ?selected=${!f.user_id}>No login (picked on a shared tablet)</option>
              ${this._logins.filter(u => !u.linked_to || u.linked_to === person?.id).map(u => html`
                <option value=${u.id} ?selected=${f.user_id === u.id}>${u.name}${u.is_admin ? ' (administrator)' : ''}</option>`)}
            </select></label>
          <p class="hint">${f.user_id ? `That login is always ${f.name.trim() || 'this person'}: chores are done as them on any device they sign in to, with no PIN needed.`
            : 'Children, grandparents and guests do not need a login. Pick one only if this person has their own Home Assistant account.'}</p>
          <label>Picture</label>
          <div class="emojis"><input class="emoji-in" maxlength="8" .value=${f.emoji} @input=${e => set({ emoji: e.target.value })}>
            ${EMOJIS.map(e => html`<button type="button" class=${e === f.emoji ? 'on' : ''} @click=${() => set({ emoji: e })}>${e}</button>`)}</div>
          <label>PIN <small>(4 digits)</small>
            <input type="password" inputmode="numeric" maxlength="4" autocomplete="off" .value=${f.pin} placeholder=${person?.has_pin ? 'Type a new PIN to change it' : '4 digits'}
              @input=${e => set({ pin: e.target.value.replace(/\D/g, ''), clearPin: false })}></label>
          ${person?.has_pin ? html`<button type="button" class="linkbtn" @click=${() => set({ pin: '', clearPin: !f.clearPin })}>${f.clearPin ? 'The PIN will be removed. Undo' : 'Remove the PIN'}</button>` : nothing}
          <p class="hint">With a PIN, ${f.name.trim() || 'they'} can pick their own name on any device and tick off their own chores and routines by typing it.
            It also stops someone else switching to this profile. On a shared login, adults must have a PIN.</p>
          <label>Phone notifications <small>(optional)</small>
            <input .value=${f.notify} placeholder="notify.mobile_app_their_phone" @input=${e => set({ notify: e.target.value })}></label>
          <p class="hint">The notify service of their phone in Home Assistant, used for chore reminders.</p>
          ${this._error ? html`<p class="err">${this._error}</p>` : nothing}
          <div class="actions">
            ${this._edit !== 'new' ? html`<button class="danger" @click=${() => this._deletePerson()} ?disabled=${this._busy}>Remove</button>` : nothing}
            <button class="save" @click=${() => this._savePerson()} ?disabled=${this._busy}>Save</button>
          </div>
        </div>`;
    }
    return html`
      ${this._head('People & guests', true)}
      <p class="hint">Everyone who uses the hub. Nobody is added for you: an adult adds each person here, and can link them to a Home Assistant login
        if they have one. Children and guests do not need a login; they are picked on a shared tablet.</p>
      ${!this._people.length ? html`<p class="hint"><b>Start by adding yourself</b> and link your own login, then the children.</p>` : nothing}
      ${this._people.map(p => html`
        <button class="row" ?disabled=${!this._iAmAdult} @click=${() => this._startPerson(p)} style="--c:${p.color}">
          <span class="ico" style="font-size:22px">${p.emoji}</span>
          <span class="txt"><b>${p.name}</b><small>${label[p.role]}${p.user_id ? ` · ${this._logins.find(u => u.id === p.user_id)?.name || 'has a login'}` : ' · no login'}${p.has_pin ? ' · PIN' : ''}</small></span>
          ${this._iAmAdult ? html`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>` : nothing}
        </button>`)}
      ${this._iAmAdult ? this._row('mdi:account-plus-outline', 'Add a person', () => this._startPerson(null), { color: '#4fd1a1' })
        : html`<p class="hint">Only an adult can add or change people.</p>`}
      ${this._error ? html`<p class="err">${this._error}</p>` : nothing}`;
  }

  _region() {
    const regions = this._regions;
    return html`
      ${this._head('Region & language', true)}
      <label class="sel">
        <span>Language</span>
        <select @change=${e => this._emit('hub-set-language', { code: e.target.value })}>
          ${LANGUAGES.map(([c, n]) => html`<option value=${c} ?selected=${c === (this.language || 'en')}>${n}</option>`)}
        </select>
      </label>
      <p class="hint">Applies to the recipe book. More of the hub will be translated later.</p>
      ${this.modules?.shopping ? html`
        <label class="sel">
          <span>Region</span>
          <select @change=${e => this._setRegion(e.target.value)} ?disabled=${!regions || this._busy}>
            ${!regions ? html`<option>Loading…</option>` : Object.entries(regions).map(([c, n]) =>
              html`<option value=${c} ?selected=${c === this._country}>${n}</option>`)}
          </select>
        </label>
        <p class="hint">Sets the shopping catalogue, currency and supermarkets.</p>` : nothing}
      ${this._toast ? html`<p class="ok"><ha-icon icon="mdi:check-circle"></ha-icon>${this._toast}</p>` : nothing}
      ${this._error ? html`<p class="err">${this._error}</p>` : nothing}`;
  }

  static styles = [css`
    :host { position: absolute; inset: 0; z-index: 30; pointer-events: none; display: block; }
    :host([sheet]) { pointer-events: auto; }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    .scrim { position: absolute; inset: 0; background: rgba(4, 12, 20, 0.55); animation: fade .18s ease; }
    .sheet {
      position: absolute; left: 0; right: 0; bottom: 0; max-height: 88%; overflow-y: auto; overscroll-behavior: contain;
      max-width: 560px; margin: 0 auto;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px));
      box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1); color: var(--hub-text);
    }
    @media (min-width: 700px) { .sheet { bottom: 12px; border-radius: 28px; } }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160, 190, 215, .55); margin: 2px auto 14px; }
    .head { display: flex; align-items: center; gap: 8px; margin: 0 0 8px; }
    .head h2 { margin: 0; font-size: 18px; font-weight: 800; }
    .back { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface); cursor: pointer;
      display: flex; align-items: center; justify-content: center; color: var(--hub-muted); }
    h3 { margin: 16px 4px 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .row {
      width: 100%; display: flex; align-items: center; gap: 14px; padding: 11px 8px; border: none; background: none; cursor: pointer;
      border-radius: 16px; text-align: left; -webkit-tap-highlight-color: transparent;
    }
    .row:hover:not([disabled]) { background: var(--hub-surface-2); }
    .row[disabled] { cursor: default; opacity: .6; }
    .ico {
      width: 42px; height: 42px; border-radius: 14px; flex: none; display: inline-flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--c, var(--hub-accent)) 20%, transparent); color: var(--c, var(--hub-accent)); --mdc-icon-size: 24px;
    }
    .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .txt b { font-size: 15.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .txt small { color: var(--hub-muted); font-size: 12.5px; }
    .chev { color: var(--hub-muted); --mdc-icon-size: 22px; }
    .pill { font-size: 11px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px;
      background: var(--hub-surface-2); color: var(--hub-muted); }
    .divider { height: 1px; background: var(--hub-border); margin: 6px 8px; }
    .switcher { margin: 2px 8px 6px 64px; display: grid; gap: 2px; }
    .opt { display: flex; align-items: center; gap: 10px; padding: 8px 6px; border: none; background: none; cursor: pointer; border-radius: 12px; text-align: left; font-weight: 600; }
    .opt:hover { background: var(--hub-surface-2); }
    .opt ha-icon { --mdc-icon-size: 20px; color: var(--hub-muted); }
    .opt.on ha-icon { color: var(--hub-accent); }
    .new, .field { display: flex; gap: 8px; margin-top: 6px; }
    .field { margin: 8px 4px 0; }
    .new input, .field input, .sel select {
      flex: 1; min-width: 0; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border);
      background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px;
    }
    .new input:focus, .field input:focus, .sel select:focus { border-color: var(--hub-accent); }
    .new button, .field button, .mini {
      border: none; border-radius: 999px; padding: 0 18px; cursor: pointer; font-weight: 700;
      background: var(--hub-accent); color: var(--hub-accent-ink);
    }
    .new button, .field button { min-height: 42px; }
    .new button[disabled], .field button[disabled], .mini[disabled] { opacity: .45; cursor: default; }
    .member { display: flex; align-items: center; gap: 12px; padding: 7px 8px; }
    .member .ico { width: 38px; height: 38px; border-radius: 12px; --c: var(--hub-muted); }
    .mini { padding: 7px 14px; font-size: 13px; background: var(--hub-surface-2); color: var(--hub-text); border: 1px solid var(--hub-border); }
    .mini.add { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .sel { display: flex; align-items: center; gap: 12px; margin: 10px 4px 0; }
    .sel span { width: 84px; font-weight: 700; flex: none; }
    .hint { margin: 8px 6px 0; color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; }
    .err { margin: 8px 6px 0; color: #e8685a; font-size: 13.5px; }
    .ok { margin: 10px 6px 0; display: flex; align-items: center; gap: 6px; color: var(--hub-accent); font-size: 14px; font-weight: 600; }
    .ok ha-icon { --mdc-icon-size: 18px; }
    .pform { display: grid; gap: 8px; }
    .pform label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 4px; }
    .pform label small { color: var(--hub-muted); font-weight: 500; }
    .pform input { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .pform select { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .pform input:focus, .pform select:focus { border-color: var(--hub-accent); }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); cursor: pointer; }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .emojis { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
    .emojis button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); cursor: pointer; }
    .emojis button.on { border-color: var(--hub-accent); }
    .emoji-in { width: 64px !important; text-align: center; font-size: 22px !important; padding: 6px !important; }
    .linkbtn { background: none; border: none; color: var(--hub-accent); font-weight: 700; text-align: left; padding: 2px 0; cursor: pointer; }
    .actions { display: flex; gap: 10px; margin-top: 8px; }
    .save { flex: 1; border: none; border-radius: 999px; padding: 11px 18px; font-weight: 800; background: var(--hub-accent); color: var(--hub-accent-ink); cursor: pointer; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 11px 18px; font-weight: 700; cursor: pointer; }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }
  `];
}

customElements.define('ksh-hub-sheets', KshHubSheets);
