import { LitElement, html, css, nothing } from 'lit';
import { avatar, avatarCss, faceContent } from '../../hub/avatar.js';
import { enableSwipeClose } from '../../hub/swipe.js';
import { resolveActing, actingMsg, setToken } from '../../hub/actor.js';
import { money, parseMoney, moneyInput } from '../../hub/money.js';

const SPEND_EMOJIS = ['🛍️', '🧸', '🧱', '🎮', '📚', '🍬', '🎁', '👕', '⚽', '🎧', '🎨', '🍦'];
const ACCOUNTS = [['cash', '💵', 'Cash'], ['bank', '🏦', 'Bank']];

/** Pocket money: every child has a Cash account and a Bank account. Adults put money in and record what was spent. */
class KshFinanceModule extends LitElement {
  static properties = {
    hass: { type: Object },
    modules: { type: Object },
    hubMode: { type: Boolean, attribute: 'hub-mode' },
    _view: { state: true },
    _people: { state: true },
    _me: { state: true },
    _acting: { state: true },
    _data: { state: true },
    _pocket: { state: true },
    _who: { state: true },
    _sheet: { state: true },
    _draft: { state: true },
    _toast: { state: true },
    _loaded: { state: true },
    _pin: { state: true },
  };

  constructor() {
    super();
    this._view = 'overview';
    this._people = [];
    this._me = null;
    this._acting = null;
    this._data = { balances: {}, transactions: [] };
    this._pocket = {};
    this._who = 'all';
    this._sheet = null;
    this._draft = null;
    this._toast = null;
    this._loaded = false;
    this._pin = '';
    this._initDone = false;
  }

  setHubView(view) {
    this._view = view;
    this._sheet = null;
    this.dispatchEvent(new CustomEvent('module-view-changed', { detail: { view }, bubbles: true, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    this._vis = () => { if (!document.hidden && this._initDone) this._load(); };
    document.addEventListener('visibilitychange', this._vis);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('visibilitychange', this._vis);
    this._unsub?.();
    this._unsub = null;
    this._initDone = false;
  }

  updated(changed) {
    if (changed.has('hass') && this.hass && !this._initDone) { this._initDone = true; this._init(); }
    const sheet = this.renderRoot.querySelector('.sheet');
    if (sheet && !sheet._swipe) { sheet._swipe = true; enableSwipeClose(sheet, () => this._closeSheet()); }
  }

  // ---- data ---------------------------------------------------------------------

  async _init() {
    await this._load();
    try {
      this._unsub = await this.hass.connection.subscribeMessage(() => this._scheduleLoad(), { type: 'ksh_finance/subscribe' });
    } catch { /* live updates are a bonus */ }
  }

  _scheduleLoad() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this._load(), 250);
  }

  async _load() {
    try {
      const people = await this.hass.callWS({ type: 'ksh_family_hub/people/list' });
      this._people = people.people;
      this._me = people.me;
      this._acting = resolveActing(this.hass, this._people, this._me);
      this._data = await this.hass.callWS({ type: 'ksh_finance/get_state', ...actingMsg(this.hass, this._acting) });
      // the points progress towards pocket money lives with Chores
      if (this.modules?.chores) {
        try { this._pocket = (await this.hass.callWS({ type: 'ksh_chores/get_state' })).pocket || {}; } catch { this._pocket = {}; }
      }
    } catch (err) {
      if (err?.code === 'pin_required' && this._actor?.has_pin) { this._sheet = { type: 'pin' }; this._pin = ''; }
      else this._say(err?.message || 'Could not load the money');
    }
    this._loaded = true;
  }

  get _actor() { return this._people.find(p => p.id === this._acting) || null; }
  get _isAdult() { return this._actor ? this._actor.role === 'adult' : !!this.hass?.user?.is_admin; }
  _person(id) { return this._people.find(p => p.id === id); }
  _bal(id) { return this._data.balances[id] || { cash: 0, bank: 0 }; }
  _m(cents, opts) { return money(this.hass, cents, opts); }

  /** Whose accounts are shown: children (and anyone who already has money), a child only their own */
  get _owners() {
    const list = this._people.filter(p => p.role !== 'guest' && (p.role === 'child' || this._data.balances[p.id]));
    return this._isAdult ? list : list.filter(p => p.id === this._acting);
  }

  /** Who an adult can put money in for: the children */
  get _kids() { return this._people.filter(p => p.role === 'child'); }

  async _call(type, extra = {}) {
    try {
      const res = await this.hass.callWS({ type: `ksh_finance/${type}`, ...extra, ...actingMsg(this.hass, this._acting) });
      return res;
    } catch (err) {
      if (err?.code === 'pin_required' && this._actor?.has_pin) { this._sheet = { type: 'pin' }; this._pin = ''; }
      this._say(err?.message || 'That did not work');
      return null;
    } finally {
      this._load();
    }
  }

  _say(text) {
    this._toast = text;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { this._toast = null; }, 3500);
  }

  async _checkPin() {
    try {
      const res = await this.hass.callWS({ type: 'ksh_family_hub/people/verify_pin', person_id: this._acting, pin: this._pin });
      if (!res.ok) { this._pin = ''; this._say('Wrong PIN'); return; }
      setToken(this.hass, res.token);
      this._closeSheet();
      this._load();
    } catch (err) { this._pin = ''; this._say(err?.message || 'Could not check the PIN'); }
  }

  _closeSheet() { this._sheet = null; this._draft = null; this._pin = ''; }

  _set(field, value) { this._draft = { ...this._draft, [field]: value }; }

  // ---- adult actions -------------------------------------------------------------

  _open(type, personId) {
    if (!this._isAdult) return;
    const who = personId || this._kids[0]?.id;
    if (!who) { this._say('Add a child under Chores → Manage people first'); return; }
    const base = { person: who };
    if (type === 'money') this._draft = { ...base, account: 'bank', amount: '', note: '' };
    if (type === 'spend') this._draft = { ...base, note: '', emoji: '🛍️', price: '', cash: '', bank: '' };
    if (type === 'move') this._draft = { ...base, from: 'cash', amount: '' };
    this._sheet = { type };
  }

  async _saveMoney() {
    const d = this._draft;
    const cents = parseMoney(d.amount);
    if (!(cents > 0)) { this._say('Enter an amount like 5 or 5.50'); return; }
    const res = await this._call('deposit', { person_id: d.person, account: d.account, amount: cents, note: d.note });
    if (res) { this._say(`${this._m(cents)} added to ${this._person(d.person)?.name}'s ${d.account === 'cash' ? 'Cash' : 'Bank'}`); this._closeSheet(); }
  }

  // split a price between the two accounts
  _autoSplit(mode) {
    const d = this._draft;
    const price = parseMoney(d.price);
    if (!(price > 0)) { this._say('Enter the price first'); return; }
    const have = this._bal(d.person);
    let cash = 0;
    if (mode === 'cash') cash = price;
    else if (mode === 'bank') cash = 0;
    else cash = Math.min(have.cash, price);                       // cash first, the rest from the bank
    this._draft = { ...d, cash: moneyInput(cash), bank: moneyInput(price - cash) };
  }

  async _saveSpend() {
    const d = this._draft;
    const cash = parseMoney(d.cash), bank = parseMoney(d.bank);
    if (Number.isNaN(cash) || Number.isNaN(bank)) { this._say('Check the amounts'); return; }
    if (!d.note.trim()) { this._say('Say what it was spent on'); return; }
    if (cash + bank <= 0) { this._say('Enter how much came out of Cash and Bank'); return; }
    const res = await this._call('spend', { person_id: d.person, cash, bank, note: d.note.trim(), emoji: d.emoji });
    if (res) { this._say(`${d.emoji} ${d.note.trim()}: ${this._m(cash + bank)}`); this._closeSheet(); }
  }

  async _saveMove() {
    const d = this._draft;
    const cents = parseMoney(d.amount);
    if (!(cents > 0)) { this._say('Enter an amount'); return; }
    const to = d.from === 'cash' ? 'bank' : 'cash';
    const res = await this._call('transfer', { person_id: d.person, from: d.from, to, amount: cents });
    if (res) this._closeSheet();
  }

  async _void(entry) {
    if (!confirm(`Undo “${entry.note}”? The money goes back to where it was.`)) return;
    const res = await this._call('void', { tx_id: entry.tx[0].id });
    if (res) this._closeSheet();
  }

  // ---- grouping: a purchase from Cash and Bank, or a move, is one entry ---------------

  _entries(personFilter) {
    const groups = new Map();
    for (const t of this._data.transactions) {
      if (personFilter && t.person_id !== personFilter) continue;
      if (!groups.has(t.group)) groups.set(t.group, { id: t.group, person_id: t.person_id, kind: t.kind, note: t.note, emoji: t.emoji, at: t.at, void: t.void, by: t.by, tx: [] });
      groups.get(t.group).tx.push(t);
    }
    return [...groups.values()];
  }

  _entryAmount(e) {
    if (e.kind === 'transfer') return nothing;
    const total = e.tx.reduce((n, t) => n + t.amount, 0);
    return html`<span class="amt ${total < 0 ? 'out' : 'in'}">${this._m(total, { sign: true })}</span>`;
  }

  _entryParts(e) {
    if (e.kind === 'transfer') {
      const from = e.tx.find(t => t.amount < 0), to = e.tx.find(t => t.amount > 0);
      return `${from.account === 'cash' ? 'Cash' : 'Bank'} → ${to.account === 'cash' ? 'Cash' : 'Bank'} · ${this._m(to.amount)}`;
    }
    return e.tx.map(t => `${t.account === 'cash' ? '💵 Cash' : '🏦 Bank'} ${this._m(t.amount)}`).join(' + ');
  }

  _when(at) {
    return new Date(at).toLocaleDateString(this.hass.locale?.language || undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ---- render -------------------------------------------------------------------

  render() {
    if (!this._loaded) return html`<div class="center"><div class="spinner"></div></div>`;
    return html`
      <div class="scroll"><div class="page">
        ${this._view === 'history' ? this._history() : this._overview()}
      </div></div>
      ${this._sheet ? this._renderSheet() : nothing}
      ${this._toast ? html`<div class="toast" role="status">${this._toast}</div>` : nothing}`;
  }

  _face(p) {
    return html`<span class="face" style="--p:${p.color}">${faceContent(this.hass, p)}</span>`;
  }

  _overview() {
    const owners = this._owners;
    if (!owners.length) {
      return html`<div class="empty"><span>🐷</span><p>${this._isAdult ? 'No children to show yet. Add them under Chores → Manage people.' : 'There is nothing here for you yet.'}</p></div>`;
    }
    return html`
      ${this._isAdult ? html`
        <div class="actions top">
          <button class="primary" @click=${() => this._open('money')}><ha-icon icon="mdi:plus"></ha-icon>Add money</button>
          <button class="primary alt" @click=${() => this._open('spend')}><ha-icon icon="mdi:shopping-outline"></ha-icon>Spent</button>
          <button class="primary alt" @click=${() => this._open('move')}><ha-icon icon="mdi:swap-horizontal"></ha-icon>Move</button>
        </div>` : nothing}
      ${owners.map(p => this._card(p))}`;
  }

  _card(p) {
    const b = this._bal(p.id);
    const total = b.cash + b.bank;
    const recent = this._entries(p.id).slice(0, 3);
    const pk = this._pocket[p.id];
    return html`
      <section class="kid" style="--p:${p.color}">
        <header>
          ${this._face(p)}
          <div class="who"><b>${p.name}</b><small>${this._isAdult && p.id !== this._acting ? 'Has' : 'You have'}</small></div>
          <div class="total">${this._m(total)}</div>
        </header>
        <div class="accts">
          <div class="acct"><span class="ai">💵</span><small>Cash</small><b>${this._m(b.cash)}</b></div>
          <div class="acct"><span class="ai">🏦</span><small>Bank</small><b>${this._m(b.bank)}</b></div>
        </div>
        ${pk?.enabled ? html`
          <div class="pk"><div class="pkbar"><i style="width:${Math.min(100, pk.points ? (pk.earned / pk.points) * 100 : 0)}%"></i></div>
            <small>${pk.starts_next ? `Pocket money starts next ${pk.period}` : `Pocket money: ${pk.earned} of ${pk.points} ★ this ${pk.period} → ${this._m(pk.amount)}`}</small></div>` : nothing}
        <h4>Recent</h4>
        ${recent.length ? html`<div class="list">${recent.map(e => this._row(e))}</div>` : html`<p class="none">Nothing yet.</p>`}
        ${this._isAdult ? html`
          <div class="mini-actions">
            <button @click=${() => this._open('money', p.id)}>+ Money</button>
            <button @click=${() => this._open('spend', p.id)}>Spent</button>
            <button @click=${() => this._open('move', p.id)}>Move</button>
          </div>` : nothing}
      </section>`;
  }

  _row(e, { withWho = false } = {}) {
    const p = withWho ? this._person(e.person_id) : null;
    return html`
      <button class="row ${e.void ? 'void' : ''}" @click=${() => { this._sheet = { type: 'detail', entry: e }; }}>
        <span class="em">${e.emoji || '💰'}</span>
        <span class="txt"><b>${e.note}</b><small>${p ? `${p.name} · ` : ''}${this._when(e.at)} · ${this._entryParts(e)}</small></span>
        ${e.void ? html`<span class="pill">Undone</span>` : this._entryAmount(e)}
      </button>`;
  }

  _history() {
    const people = this._owners;
    const filter = this._isAdult && this._who !== 'all' ? this._who : null;
    const list = this._entries(filter);
    return html`
      <h3 class="first">History</h3>
      ${this._isAdult && people.length > 1 ? html`
        <div class="chips" role="radiogroup" aria-label="Show for">
          <button class="chip ${this._who === 'all' ? 'on' : ''}" @click=${() => { this._who = 'all'; }}>Everyone</button>
          ${people.map(p => html`<button class="chip ${this._who === p.id ? 'on' : ''}" @click=${() => { this._who = p.id; }}>${avatar(this.hass, p, 22)}${p.name}</button>`)}
        </div>` : nothing}
      ${list.length ? html`<div class="list">${list.map(e => this._row(e, { withWho: this._isAdult && !filter }))}</div>`
        : html`<div class="empty"><span>🧾</span><p>No money in or out yet.</p></div>`}`;
  }

  // ---- sheets -------------------------------------------------------------------

  _renderSheet() {
    const t = this._sheet.type;
    return html`
      <div class="scrim" @click=${() => this._closeSheet()}></div>
      <section class="sheet" role="dialog" aria-label=${t}>
        <div class="grabber"></div>
        ${t === 'money' ? this._moneySheet() : nothing}
        ${t === 'spend' ? this._spendSheet() : nothing}
        ${t === 'move' ? this._moveSheet() : nothing}
        ${t === 'detail' ? this._detailSheet() : nothing}
        ${t === 'pin' ? this._pinSheet() : nothing}
      </section>`;
  }

  _title(text) { return html`<div class="head2"><h2>${text}</h2></div>`; }

  _whoChips(current) {
    return html`<div class="chips">${this._kids.map(p => html`
      <button type="button" class="chip ${current === p.id ? 'on' : ''}" @click=${() => this._set('person', p.id)}>${avatar(this.hass, p, 22)}${p.name}</button>`)}</div>`;
  }

  _acctSeg(current, field) {
    return html`<div class="seg">${ACCOUNTS.map(([v, i, l]) => html`<button type="button" class="${current === v ? 'on' : ''}" @click=${() => this._set(field, v)}>${i} ${l}</button>`)}</div>`;
  }

  _moneySheet() {
    const d = this._draft;
    return html`${this._title('Add money')}
      <div class="form">
        <label>For</label>${this._whoChips(d.person)}
        <label>Into</label>${this._acctSeg(d.account, 'account')}
        <label>Amount<input inputmode="decimal" .value=${d.amount} placeholder="5.00" @input=${e => this._set('amount', e.target.value)}></label>
        <label>What is it for <small class="hint inl">(optional)</small><input .value=${d.note} maxlength="80" placeholder="Birthday money" @input=${e => this._set('note', e.target.value)}></label>
        <div class="actions"><button class="primary grow" @click=${() => this._saveMoney()}>Add</button></div>
      </div>`;
  }

  _spendSheet() {
    const d = this._draft;
    const have = this._bal(d.person);
    const cash = parseMoney(d.cash) || 0, bank = parseMoney(d.bank) || 0;
    const over = cash > have.cash || bank > have.bank;
    return html`${this._title('Spent')}
      <div class="form">
        <label>Whose money</label>${this._whoChips(d.person)}
        <label>What was it spent on<input .value=${d.note} maxlength="80" placeholder="Lego set" @input=${e => this._set('note', e.target.value)}></label>
        <div class="emoji-list">${SPEND_EMOJIS.map(e => html`<button type="button" class="${e === d.emoji ? 'on' : ''}" @click=${() => this._set('emoji', e)}>${e}</button>`)}</div>
        <label>Price<input inputmode="decimal" .value=${d.price} placeholder="40.00" @input=${e => this._set('price', e.target.value)}></label>
        <div class="chips">
          <button type="button" class="chip" @click=${() => this._autoSplit('cash')}>All from Cash</button>
          <button type="button" class="chip" @click=${() => this._autoSplit('bank')}>All from Bank</button>
          <button type="button" class="chip" @click=${() => this._autoSplit('mix')}>Cash first, then Bank</button>
        </div>
        <div class="two">
          <label>💵 From Cash <small class="hint inl">has ${this._m(have.cash)}</small>
            <input inputmode="decimal" .value=${d.cash} placeholder="0" @input=${e => this._set('cash', e.target.value)}></label>
          <label>🏦 From Bank <small class="hint inl">has ${this._m(have.bank)}</small>
            <input inputmode="decimal" .value=${d.bank} placeholder="0" @input=${e => this._set('bank', e.target.value)}></label>
        </div>
        <p class="${over ? 'warn' : 'hint'}">${over ? 'That is more than they have in one of the accounts.'
          : `Comes to ${this._m(cash + bank)}. Left afterwards: Cash ${this._m(have.cash - cash)}, Bank ${this._m(have.bank - bank)}.`}</p>
        <div class="actions"><button class="primary grow" ?disabled=${over} @click=${() => this._saveSpend()}>Save</button></div>
      </div>`;
  }

  _moveSheet() {
    const d = this._draft;
    const have = this._bal(d.person);
    const to = d.from === 'cash' ? 'bank' : 'cash';
    return html`${this._title('Move money')}
      <div class="form">
        <label>For</label>${this._whoChips(d.person)}
        <label>Move from</label>${this._acctSeg(d.from, 'from')}
        <p class="hint">${d.from === 'cash' ? 'Cash' : 'Bank'} has ${this._m(have[d.from])}. It goes into ${to === 'cash' ? 'Cash' : 'Bank'}.</p>
        <label>Amount<input inputmode="decimal" .value=${d.amount} placeholder="10.00" @input=${e => this._set('amount', e.target.value)}></label>
        <div class="actions"><button class="primary grow" @click=${() => this._saveMove()}>Move</button></div>
      </div>`;
  }

  _detailSheet() {
    const e = this._sheet.entry;
    const p = this._person(e.person_id);
    const by = this._person(e.by);
    return html`
      <div class="detail">
        <div class="dh"><span class="em big">${e.emoji || '💰'}</span><div><h2>${e.note}</h2><p class="muted">${p?.name || ''} · ${this._when(e.at)}</p></div></div>
        <div class="facts">
          ${e.tx.map(t => html`<div class="fact"><span>${t.account === 'cash' ? '💵 Cash' : '🏦 Bank'}</span><b class="${t.amount < 0 ? 'out' : 'in'}">${this._m(t.amount, { sign: true })}</b></div>`)}
          ${by ? html`<div class="fact"><span>Entered by</span><b>${by.name}</b></div>` : e.by === 'system' ? html`<div class="fact"><span>Entered by</span><b>Pocket money</b></div>` : nothing}
        </div>
        ${e.void ? html`<p class="muted">This was undone, so it does not count.</p>`
          : this._isAdult ? html`<button class="danger" @click=${() => this._void(e)}>Undo this entry</button>` : nothing}
      </div>`;
  }

  _pinSheet() {
    const p = this._actor;
    return html`${this._title(`${p?.name || 'Your'} PIN`)}
      <form class="form" @submit=${e => { e.preventDefault(); this._checkPin(); }}>
        <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
          .value=${this._pin} @input=${e => { this._pin = e.target.value.replace(/\D/g, ''); }}>
        <button class="primary" type="submit" ?disabled=${this._pin.length !== 4}>Continue</button>
      </form>`;
  }

  static styles = [avatarCss, css`
    :host { display: block; position: relative; overflow: hidden; color: var(--hub-text); --fin: var(--hub-accent); }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    button { cursor: pointer; }
    button[disabled] { cursor: default; opacity: .55; }
    .scroll { height: 100%; overflow-y: auto; }
    .page { max-width: 760px; margin: 0 auto; padding: 6px 16px 28px; }
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border); border-top-color: var(--fin); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .muted { color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; margin: 4px 2px; }
    h3 { margin: 18px 4px 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    h3.first { margin-top: 10px; }
    h4 { margin: 14px 4px 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .empty { text-align: center; padding: 40px 10px; color: var(--hub-muted); } .empty span { font-size: 48px; }
    .none { color: var(--hub-muted); font-size: 13.5px; margin: 6px 4px; }

    .actions { display: flex; gap: 10px; margin-top: 10px; }
    .actions.top { margin: 8px 0 12px; flex-wrap: wrap; }
    .primary { border: none; background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 10px 18px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; justify-content: center; --mdc-icon-size: 20px; }
    .primary.alt { background: var(--hub-surface); color: var(--hub-text); border: 1px solid var(--hub-border); }
    .grow { flex: 1; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 10px 18px; font-weight: 700; width: 100%; }

    .kid { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 24px; padding: 14px; margin-bottom: 14px; border-top: 5px solid var(--p); }
    .kid header { display: flex; align-items: center; gap: 12px; }
    .face { width: 52px; height: 52px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; overflow: hidden;
      background: color-mix(in srgb, var(--p) 30%, var(--hub-surface-2)); border: 3px solid var(--p); }
    .face img { width: 100%; height: 100%; object-fit: cover; }
    .who { flex: 1; min-width: 0; display: flex; flex-direction: column; } .who b { font-size: 18px; } .who small { color: var(--hub-muted); }
    .total { font-size: 28px; font-weight: 800; letter-spacing: -.01em; white-space: nowrap; }
    .accts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0 4px; }
    .acct { background: var(--hub-surface-2); border-radius: 18px; padding: 12px; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 0 10px; }
    .acct .ai { font-size: 26px; grid-row: span 2; } .acct small { color: var(--hub-muted); font-weight: 700; } .acct b { font-size: 20px; }
    .pk { margin: 10px 2px 0; } .pk small { color: var(--hub-muted); font-size: 12.5px; }
    .pkbar { height: 6px; border-radius: 3px; background: var(--hub-surface-2); overflow: hidden; margin-bottom: 5px; } .pkbar i { display: block; height: 100%; background: #e2ac3f; }
    .mini-actions { display: flex; gap: 8px; margin-top: 12px; }
    .mini-actions button { flex: 1; border: 1px solid var(--hub-border); background: var(--hub-surface-2); border-radius: 999px; padding: 8px; font-weight: 700; font-size: 13px; }

    .list { display: grid; gap: 6px; }
    .row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 9px 10px; border: 1px solid var(--hub-border); border-radius: 14px; background: var(--hub-surface-2); }
    .row.void { opacity: .55; } .row.void b { text-decoration: line-through; }
    .row .em { font-size: 22px; width: 36px; height: 36px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--fin) 18%, transparent); flex: none; }
    .row .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; } .row .txt b { font-size: 14.5px; } .row .txt small { color: var(--hub-muted); font-size: 12.5px; }
    .amt { font-weight: 800; white-space: nowrap; } .amt.out, .out { color: #e8685a; } .amt.in, .in { color: #4fd1a1; }
    .pill { border: 1px solid var(--hub-border); border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 800; color: var(--hub-muted); }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 10px; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    .toast { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); background: var(--hub-sheet); color: var(--hub-text); border: 1px solid var(--hub-border);
      border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: 14px; box-shadow: var(--hub-shadow); z-index: 60; max-width: 92%; text-align: center; animation: pop .2s ease; }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, 10px); } }

    .scrim { position: absolute; inset: 0; background: rgba(4,12,20,.55); z-index: 40; animation: fade .18s ease; }
    .sheet { position: absolute; left: 0; right: 0; bottom: 0; z-index: 41; max-width: 600px; margin: 0 auto; max-height: 92%; overflow-y: auto; overscroll-behavior: contain;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px)); box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1); }
    @media (min-width: 700px) { .sheet { bottom: 12px; border-radius: 28px; } }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } } @keyframes fade { from { opacity: 0; } }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160,190,215,.55); margin: 2px auto 12px; }
    .head2 h2 { margin: 0 0 8px; font-size: 18px; font-weight: 800; }
    .form { display: grid; gap: 8px; }
    .form label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 6px; }
    .form input:not([type=checkbox]) { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .form input:focus { border-color: var(--hub-accent); }
    .hint { color: var(--hub-muted); font-size: 12.5px; font-weight: 500; margin: 0; } .hint.inl { margin-left: 4px; }
    .warn { color: #e8a04a; font-size: 13px; font-weight: 600; margin: 0; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .emoji-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .emoji-list button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); }
    .emoji-list button.on { border-color: var(--hub-accent); }
    .pin { text-align: center; font-size: 28px !important; letter-spacing: .4em; }
    .detail .dh { display: flex; align-items: center; gap: 12px; } .detail h2 { margin: 0; font-size: 20px; }
    .em.big { font-size: 38px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; border-radius: 18px; background: color-mix(in srgb, var(--fin) 20%, transparent); }
    .facts { display: grid; gap: 8px; margin: 14px 0; } .fact { display: flex; justify-content: space-between; padding: 10px 12px; background: var(--hub-surface-2); border-radius: 12px; }
  `];
}

customElements.define('ksh-finance-module', KshFinanceModule);
