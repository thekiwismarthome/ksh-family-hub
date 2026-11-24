// The kids' view: a big, colourful card for one child, for a bedside display or a tablet on the wall (Kiosk Satellite,
// Fully Kiosk, a dashboard). It shows only that child's chores, routines and points.
//
//   type: custom:ksh-family-hub-kids-card
//   person: Mia            # the name (or id) of the person, as set up in People & guests
//   style: galaxy          # optional: galaxy | candy | ocean | jungle (default: from the person's colour)
//   height: 100vh          # optional: the height of the screen (default: the dashboard's height)
//
// Everything it does is done as that person. A child with a PIN is asked for it once on a device that is not
// signed in as them (the card remembers it).
import { LitElement, html, css, nothing } from 'lit';
import { celebrate, DEFAULT_CELEBRATION } from '../hub/celebrate.js';
import { avatar, avatarCss } from '../hub/avatar.js';
import { money } from '../hub/money.js';
import { hassMatters } from '../hub/hass-util.js';
import { loadPeople } from '../hub/people-api.js';

import { setTimeZone, todayIso, todayWeekday as weekday } from '../hub/clock.js';
const TOKEN_KEY = id => `ksh_kids_token_${id}`;
const readToken = id => { try { return localStorage.getItem(TOKEN_KEY(id)) || null; } catch { return null; } };
const saveToken = (id, t) => { try { if (t) localStorage.setItem(TOKEN_KEY(id), t); else localStorage.removeItem(TOKEN_KEY(id)); } catch { /* ignore */ } };

const STYLES = {
  galaxy: { a: '#7c5cff', b: '#ff5db1', bg: '#120a30' },
  candy:  { a: '#ff5db1', b: '#ffb020', bg: '#2b0f2b' },
  ocean:  { a: '#22c1d9', b: '#4f7cff', bg: '#07213a' },
  jungle: { a: '#3ed17e', b: '#e8d93a', bg: '#082a1c' },
};
const TABS = [['chores', '🧹', 'Chores'], ['routines', '☀️', 'Routines'], ['points', '⭐', 'Points']];

class KshKidsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _people: { state: true },
    _state: { state: true },
    _tab: { state: true },
    _run: { state: true },        // the routine that is open
    _pin: { state: true },
    _error: { state: true },
    _toast: { state: true },
    _busy: { state: true },
  };

  constructor() {
    super();
    this._config = {};
    this._people = [];
    this._state = null;
    this._tab = 'chores';
    this._run = null;
    this._pin = null;
    this._error = null;
    this._toast = null;
    this._busy = false;
    this._day = todayIso();
  }

  static getStubConfig() { return { person: '' }; }

  setConfig(config) {
    if (!config || !config.person) throw new Error('Set "person" to the name of the child');
    this._config = { ...config };
    if (config.height) this.style.setProperty('--kids-height', String(config.height));
    if (this.hass) this._load();
  }

  getCardSize() { return 8; }

  connectedCallback() {
    super.connectedCallback();
    this._tick = setInterval(() => {
      const today = todayIso();
      if (today !== this._day) { this._day = today; this._load(); }
      this.requestUpdate();           // the greeting follows the time of day
    }, 60000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._tick);
    clearTimeout(this._debounce);
    this._unsub?.();
    this._unsub = null;
    this._started = false;
  }

  // A bedside screen is on all day: do not redraw for every unrelated Home Assistant change (see hub/hass-util.js)
  shouldUpdate(changed) {
    if (changed.size === 1 && changed.has('hass') && this._started) return hassMatters(changed.get('hass'), this.hass, (this._hassMemo ||= {}));
    return true;
  }

  updated(changed) {
    if (changed.has('hass') && this.hass) { setTimeZone(this.hass.config?.time_zone); if (!this._started) this._day = todayIso(); }
    if (changed.has('hass') && this.hass && !this._started) { this._started = true; this._start(); }
  }

  async _start() {
    await this._load();
    try {
      this._unsub = await this.hass.connection.subscribeMessage(() => {
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => this._load(), 250);
      }, { type: 'ksh_chores/subscribe' });
    } catch { /* live updates are a bonus */ }
  }

  async _load() {
    try {
      const [people, state] = await Promise.all([
        loadPeople(this.hass),
        this.hass.callWS({ type: 'ksh_chores/get_state', date: this._day }),
      ]);
      this._people = people.people;
      this._state = state;
      this._error = this._me ? null : `I cannot find “${this._config.person}”. Add them under People & guests, then check the name.`;
    } catch (err) {
      this._error = err?.message || 'Could not load';
    }
  }

  // ---- who -------------------------------------------------------------------

  get _me() {
    const want = String(this._config.person || '').trim().toLowerCase();
    return this._people.find(p => p.id === this._config.person)
      || this._people.find(p => p.name.toLowerCase() === want || (p.full_name || '').toLowerCase() === want) || null;
  }

  _msg(extra = {}) {
    const me = this._me;
    const token = me ? readToken(me.id) : null;
    return { ...extra, as_person: me?.id, ...(token ? { pin_token: token } : {}) };
  }

  async _call(type, extra = {}) {
    try {
      return await this.hass.callWS({ type: `ksh_chores/${type}`, ...this._msg(extra) });
    } catch (err) {
      if (err?.code === 'pin_required') { this._pin = { text: '', wrong: false }; return null; }
      this._say(err?.code === 'unauthorized' ? 'This screen is not allowed to do that' : (err?.message || 'That did not work'));
      return null;
    } finally {
      // one reload (the live-update event asks for the same one), never two
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => this._load(), 250);
    }
  }

  _say(text) {
    this._toast = text;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { this._toast = null; }, 3500);
  }

  // ---- numbers ----------------------------------------------------------------

  get _style() { return STYLES[this._config.style] || null; }
  get _color() { return this._style?.a || this._me?.color || STYLES.galaxy.a; }

  _mine(chore) {
    const a = chore.assignees || [];
    return a.length ? a.includes(this._me?.id) : true;
  }

  _chore(id) { return this._state?.chores.find(c => c.id === id); }

  get _chores() {
    const s = this._state;
    const map = i => ({ ...i, chore: this._chore(i.chore_id) });
    const keep = i => i.chore && this._mine(i.chore);
    const today = (s?.items || []).map(map).filter(keep);
    const late = (s?.overdue || []).map(map).filter(keep);
    return {
      todo: [...late.map(i => ({ ...i, late: true })), ...today.filter(i => ['open', 'rejected'].includes(i.status))],
      done: today.filter(i => ['done', 'approved'].includes(i.status)),
    };
  }

  get _balance() { return this._state?.balances?.[this._me?.id] || 0; }

  get _free() {
    const held = (this._state?.redemptions || []).filter(r => r.person_id === this._me?.id && r.status === 'requested').reduce((n, r) => n + r.cost, 0);
    return this._balance - held;
  }

  _steps(r) { return r.steps.filter(st => !(st.days || []).length || st.days.includes(weekday())); }

  get _routines() {
    return (this._state?.routines || [])
      .filter(r => r.active !== false && ((r.assignees || []).length ? r.assignees.includes(this._me?.id) : true) && this._steps(r).length);
  }

  _prog(r) {
    const run = this._state?.runs?.[`${r.id}:${this._me?.id}`] || { steps: [], completed: false };
    const steps = this._steps(r);
    return { run, steps, done: steps.filter(st => run.steps.includes(st.id)).length };
  }

  // ---- actions ----------------------------------------------------------------

  async _complete(item) {
    if (this._busy) return;
    this._busy = true;
    const left = this._chores.todo.length;
    // show it at once; the reload that follows puts the truth back
    const mark = i => (i.chore_id === item.chore_id && i.date === item.date ? { ...i, status: 'done', done_by: this._me.id } : i);
    this._state = { ...this._state, items: this._state.items.map(mark), overdue: (this._state.overdue || []).filter(i => !(i.chore_id === item.chore_id && i.date === item.date)) };
    const res = await this._call('complete', { chore_id: item.chore_id, date: item.date });
    this._busy = false;
    if (!res) return;
    celebrate(this, res.celebration || DEFAULT_CELEBRATION, { big: left <= 1 });
    this._say(res.awarded ? `+${item.chore.points} ⭐  Amazing!` : 'Done! A grown-up will check it ✨');
  }

  async _undo(item) {
    await this._call('reopen', { chore_id: item.chore_id, date: item.date });
  }

  async _step(r, stepId, done) {
    const key = `${r.id}:${this._me.id}`;
    const run = this._state.runs?.[key] || { steps: [], completed: false };
    const steps = done ? [...new Set([...run.steps, stepId])] : run.steps.filter(x => x !== stepId);
    this._state = { ...this._state, runs: { ...this._state.runs, [key]: { ...run, steps } } };
    const res = await this._call('routines/step', { routine_id: r.id, step_id: stepId, done });
    if (res?.awarded) {
      celebrate(this, res.celebration || DEFAULT_CELEBRATION, { big: true });
      this._say(`${r.name} done! +${r.points} ⭐`);
    }
  }

  async _redeem(reward) {
    const res = await this._call('redeem', { reward_id: reward.id });
    if (res?.status === 'approved') { celebrate(this, this._state?.celebrations?.[this._me?.id], { big: false }); this._say(`Enjoy! ${reward.emoji} ${reward.name}`); }
    else if (res) this._say('Asked! Now wait for a yes 🤞');
  }

  async _submitPin() {
    const me = this._me;
    const pin = this._pin?.text || '';
    if (!me || pin.length < 4) return;
    try {
      const res = await this.hass.callWS({ type: 'ksh_family_hub/people/verify_pin', person_id: me.id, pin });
      if (!res.ok) { this._pin = { text: '', wrong: true }; return; }
      saveToken(me.id, res.token);
      this._pin = null;
      this._load();
    } catch (err) {
      this._pin = { text: '', wrong: true, message: err?.message };
    }
  }

  _key(d) {
    const cur = this._pin?.text || '';
    const text = d === 'back' ? cur.slice(0, -1) : (cur + d).slice(0, 4);
    this._pin = { text, wrong: false };
    if (text.length === 4) this._submitPin();
  }

  // ---- render ------------------------------------------------------------------

  _greeting() {
    const h = new Date().getHours();
    const g = h < 5 ? 'Sleepy time' : h < 12 ? 'Good morning' : h < 17 ? 'Hello' : h < 21 ? 'Good evening' : 'Sleepy time';
    return `${g}, ${this._me?.name || ''}!`;
  }

  render() {
    const me = this._me;
    const st = this._style;
    const style = `--k:${this._color};--k2:${st?.b || `color-mix(in srgb, ${this._color} 55%, #ffb020)`};--bg:${st?.bg || `color-mix(in srgb, ${this._color} 18%, #0c0a22)`}`;
    if (this._error || !this._state || !me) {
      return html`<div class="root" style=${style}><div class="sky"></div>
        <div class="msg"><div class="big">${this._error ? '🙈' : '✨'}</div><p>${this._error || 'Getting ready…'}</p></div></div>`;
    }
    const { todo, done } = this._chores;
    const total = todo.length + done.length;
    return html`
      <div class="root" style=${style}>
        <div class="sky"></div>
        <header>
          <div class="who">${avatar(this.hass, me, 76)}</div>
          <div class="hello"><h1>${this._greeting()}</h1>
            <p>${total ? (todo.length ? `${todo.length} to go today` : 'All done today! 🎉') : 'No chores today 🎈'}</p></div>
          <div class="stars" title="Your stars"><span class="s">⭐</span><b>${this._balance}</b></div>
        </header>
        <main>
          ${this._tab === 'chores' ? this._choresView(todo, done) : nothing}
          ${this._tab === 'routines' ? this._routinesView() : nothing}
          ${this._tab === 'points' ? this._pointsView() : nothing}
        </main>
        <nav>${TABS.map(([id, icon, label]) => html`
          <button class=${this._tab === id ? 'on' : ''} @click=${() => { this._tab = id; this._run = null; }}><span>${icon}</span>${label}
            ${id === 'chores' && todo.length ? html`<i>${todo.length}</i>` : nothing}</button>`)}</nav>
        ${this._run ? this._runView() : nothing}
        ${this._pin ? this._pinView() : nothing}
        ${this._toast ? html`<div class="toast">${this._toast}</div>` : nothing}
      </div>`;
  }

  _choresView(todo, done) {
    if (!todo.length && !done.length) return html`<div class="empty"><div class="big">🎈</div><p>No chores today. Go and play!</p></div>`;
    return html`
      ${todo.length ? html`<div class="grid">${todo.map(i => html`
        <button class="tile ${i.late ? 'late' : ''}" ?disabled=${this._busy} @click=${() => this._complete(i)} aria-label="Done: ${i.chore.name}">
          <span class="em">${i.chore.emoji}</span>
          <b>${i.chore.name}</b>
          <small>${i.late ? 'Still to do!' : i.chore.due_time ? `by ${i.chore.due_time}` : ''}</small>
          ${i.chore.points ? html`<span class="pts">+${i.chore.points} ⭐</span>` : nothing}
          ${i.status === 'rejected' ? html`<small class="back">Try again 💪</small>` : nothing}
        </button>`)}</div>`
        : html`<div class="empty"><div class="big">🎉</div><p>Everything is done. You are a star!</p></div>`}
      ${done.length ? html`<h2>Done ✔</h2>
        <div class="grid small">${done.map(i => html`
          <button class="tile done" @click=${() => i.status === 'done' && i.done_by === this._me.id && this._undo(i)}
            title=${i.status === 'done' ? 'Waiting for a grown-up' : 'Approved'}>
            <span class="em">${i.chore.emoji}</span>
            <b>${i.chore.name}</b>
            <small>${i.status === 'approved' ? `+${i.points ?? i.chore.points} ⭐ earned` : 'A grown-up will check ✨'}</small>
          </button>`)}</div>` : nothing}`;
  }

  _routinesView() {
    const list = this._routines;
    if (!list.length) return html`<div class="empty"><div class="big">☀️</div><p>No routines today.</p></div>`;
    return html`<div class="routines">${list.map(r => {
      const { run, steps, done } = this._prog(r);
      return html`
        <button class="routine ${run.completed ? 'complete' : ''}" @click=${() => { this._run = r.id; }}>
          <span class="em">${r.emoji}</span>
          <span class="rt"><b>${r.name}</b>
            <span class="dots">${steps.map(st => html`<i class=${run.steps.includes(st.id) ? 'on' : ''}></i>`)}</span></span>
          <span class="go">${run.completed ? '🏆' : done ? `${done}/${steps.length}` : 'Start!'}</span>
        </button>`; })}</div>`;
  }

  _runView() {
    const r = (this._state.routines || []).find(x => x.id === this._run);
    if (!r) { this._run = null; return nothing; }
    const { run, steps, done } = this._prog(r);
    const next = steps.find(st => !run.steps.includes(st.id));
    return html`
      <div class="overlay" @click=${e => { if (e.target === e.currentTarget) this._run = null; }}>
        <div class="panel">
          <button class="close" aria-label="Close" @click=${() => { this._run = null; }}>✕</button>
          <h2>${r.emoji} ${r.name}</h2>
          <div class="dots big">${steps.map(st => html`<i class=${run.steps.includes(st.id) ? 'on' : ''}></i>`)}</div>
          ${next ? html`
            <div class="focus"><div class="fe">${next.emoji || '👉'}</div><div class="ft">${next.text}</div></div>
            <button class="donebtn" @click=${() => this._step(r, next.id, true)}>✔ Done!</button>`
            : html`<div class="focus"><div class="fe">🏆</div><div class="ft">All finished!</div></div>
              <button class="donebtn alt" @click=${() => { this._run = null; }}>Yay!</button>`}
          <div class="steplist">${steps.map(st => html`
            <button class=${run.steps.includes(st.id) ? 'on' : ''} @click=${() => this._step(r, st.id, !run.steps.includes(st.id))}>
              <span>${run.steps.includes(st.id) ? '✅' : '⭕'}</span>${st.emoji || ''} ${st.text}</button>`)}</div>
          <small class="count">${done} of ${steps.length} done</small>
        </div>
      </div>`;
  }

  _pointsView() {
    const s = this._state;
    const me = this._me;
    const cfg = s.pocket?.[me.id];
    const rewards = (s.rewards || []).filter(r => r.active !== false);
    const recent = (s.history || []).filter(h => h.person_id === me.id).slice(0, 5);
    const waiting = (s.redemptions || []).filter(r => r.person_id === me.id && r.status === 'requested');
    const free = this._free;
    return html`
      <div class="bank"><div class="bigstar">⭐</div><div><b>${this._balance}</b><span>stars</span></div></div>
      ${cfg?.enabled ? html`<div class="pocket">
        <h3>💰 Pocket money</h3>
        <div class="meter"><i style="width:${Math.min(100, cfg.points ? (cfg.earned / cfg.points) * 100 : 0)}%"></i></div>
        <p>${cfg.starts_next ? `Starts next ${cfg.period}!`
          : cfg.earned >= cfg.points ? `${money(this.hass, cfg.amount)} is on its way! 🎉`
          : `${cfg.earned} of ${cfg.points} ⭐ this ${cfg.period}. ${cfg.points - cfg.earned} more for ${money(this.hass, cfg.amount)}`}</p></div>` : nothing}
      ${rewards.length ? html`<h2>Spend your stars</h2>
        <div class="grid small">${rewards.map(r => {
          const can = free >= r.cost;
          const pct = Math.min(100, r.cost ? (free / r.cost) * 100 : 100);
          return html`<button class="tile reward ${can ? '' : 'locked'}" ?disabled=${!can} @click=${() => this._redeem(r)}>
            <span class="em">${r.emoji}</span><b>${r.name}</b>
            <span class="pts">${r.cost} ⭐</span>
            <span class="mini"><i style="width:${pct}%"></i></span>
            <small>${can ? 'Ask for it!' : `${r.cost - free} more to go`}</small></button>`; })}</div>` : nothing}
      ${waiting.length ? html`<p class="note">⏳ Waiting for a yes: ${waiting.map(r => `${r.emoji} ${r.name}`).join(', ')}</p>` : nothing}
      ${recent.length ? html`<h2>Lately</h2><div class="lately">${recent.map(h => html`
        <div><span>${h.points > 0 ? '⭐' : '🎁'}</span><b>${h.reason}</b><em>${h.points > 0 ? '+' : ''}${h.points}</em></div>`)}</div>` : nothing}`;
  }

  _pinView() {
    const me = this._me;
    const p = this._pin;
    return html`
      <div class="overlay">
        <div class="panel pin">
          <button class="close" aria-label="Close" @click=${() => { this._pin = null; }}>✕</button>
          <div class="who">${avatar(this.hass, me, 64)}</div>
          <h2>${me.name}'s secret number</h2>
          <div class="pins ${p.wrong ? 'wrong' : ''}">${[0, 1, 2, 3].map(i => html`<i class=${i < p.text.length ? 'on' : ''}></i>`)}</div>
          ${p.wrong ? html`<small class="count">${p.message || 'Not quite. Try again!'}</small>` : nothing}
          <div class="keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => html`<button @click=${() => this._key(d)}>${d}</button>`)}
            <span></span><button @click=${() => this._key('0')}>0</button><button @click=${() => this._key('back')} aria-label="Back">⌫</button></div>
        </div>
      </div>`;
  }

  static styles = [avatarCss, css`
    :host { display: block; position: relative; overflow: hidden; border-radius: var(--ha-card-border-radius, 24px);
      font-family: ui-rounded, 'SF Pro Rounded', 'Nunito', 'Quicksand', 'Segoe UI', system-ui, sans-serif; }
    * { box-sizing: border-box; }
    button { font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    .root { position: relative; display: flex; flex-direction: column; min-height: 480px; height: var(--kids-height, calc(100dvh - var(--header-height, 56px) - 16px)); color: #fff; padding: 18px 18px 14px;
      background: radial-gradient(120% 90% at 15% 0%, color-mix(in srgb, var(--k) 42%, var(--bg)) 0%, var(--bg) 62%); overflow: hidden; }
    .sky { position: absolute; inset: 0; pointer-events: none; opacity: .9;
      background:
        radial-gradient(2px 2px at 12% 18%, #fff 50%, transparent 52%), radial-gradient(2px 2px at 78% 12%, #fff 50%, transparent 52%),
        radial-gradient(3px 3px at 88% 44%, #ffe9a8 50%, transparent 52%), radial-gradient(2px 2px at 30% 62%, #fff 50%, transparent 52%),
        radial-gradient(3px 3px at 6% 80%, #ffe9a8 50%, transparent 52%), radial-gradient(2px 2px at 60% 88%, #fff 50%, transparent 52%),
        radial-gradient(2px 2px at 46% 30%, #fff 50%, transparent 52%), radial-gradient(3px 3px at 94% 90%, #fff 50%, transparent 52%);
      animation: twinkle 4s ease-in-out infinite alternate; }
    @keyframes twinkle { from { opacity: .35; } to { opacity: 1; } }
    header, main, nav { position: relative; z-index: 1; }
    main { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 2px 2px 14px; margin: 0 -2px; scrollbar-width: none; }
    main::-webkit-scrollbar { display: none; }
    header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .who { flex: none; display: inline-flex; filter: drop-shadow(0 0 14px var(--k)); }
    .who .av { border-width: 4px; }
    .hello { flex: 1; min-width: 0; }
    h1 { margin: 0; font-size: clamp(22px, 5vw, 38px); font-weight: 900; line-height: 1.1; text-shadow: 0 2px 12px rgba(0,0,0,.35); }
    .hello p { margin: 4px 0 0; font-size: clamp(14px, 2.6vw, 19px); opacity: .85; font-weight: 700; }
    .stars { flex: none; display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 999px; font-size: clamp(22px, 4.5vw, 34px); font-weight: 900;
      background: linear-gradient(135deg, #ffcf4a, #ff9f1c); color: #4a2b00; box-shadow: 0 6px 20px rgba(255,170,30,.45); }
    .stars .s { animation: spin 5s ease-in-out infinite; }
    @keyframes spin { 0%, 80%, 100% { transform: rotate(0) scale(1); } 90% { transform: rotate(20deg) scale(1.25); } }
    h2 { margin: 20px 4px 10px; font-size: clamp(18px, 3.4vw, 24px); font-weight: 900; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
    .grid.small { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
    .tile { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; text-align: center;
      min-height: 150px; padding: 14px 10px; border-radius: 28px; border: 2px solid color-mix(in srgb, var(--k) 60%, transparent);
      background: linear-gradient(160deg, color-mix(in srgb, var(--k) 30%, rgba(255,255,255,.06)), rgba(255,255,255,.07));
      box-shadow: 0 8px 24px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.18); transition: transform .12s; }
    .tile:active:not([disabled]) { transform: scale(.94) rotate(-1deg); }
    .tile .em { font-size: clamp(44px, 9vw, 64px); line-height: 1; filter: drop-shadow(0 4px 6px rgba(0,0,0,.3)); }
    .tile b { font-size: clamp(15px, 2.8vw, 19px); font-weight: 800; line-height: 1.15; overflow-wrap: anywhere; }
    .tile.reward b { font-size: 15px; }
    .tile small { opacity: .8; font-size: 13px; font-weight: 700; }
    .pts { margin-top: 2px; padding: 3px 12px; border-radius: 999px; background: rgba(0,0,0,.28); font-weight: 900; font-size: 15px; }
    .tile.late { border-color: #ff6b6b; animation: wiggle 2.4s ease-in-out infinite; }
    .tile.late small { color: #ffb4b4; opacity: 1; }
    @keyframes wiggle { 0%, 88%, 100% { transform: rotate(0); } 92% { transform: rotate(-2.5deg); } 96% { transform: rotate(2.5deg); } }
    .tile .back { color: #ffe08a; opacity: 1; }
    .tile.done { min-height: 110px; border-color: #3ed17e; background: linear-gradient(160deg, rgba(62,209,126,.35), rgba(255,255,255,.05)); }
    .tile.done .em { font-size: 38px; }
    .tile.done::after { content: '✔'; position: absolute; top: 8px; right: 12px; font-size: 20px; color: #7dffb0; font-weight: 900; }
    .tile.locked { opacity: .78; }
    .tile.reward { min-height: 170px; }
    .mini { width: 86%; height: 8px; border-radius: 99px; background: rgba(0,0,0,.3); overflow: hidden; margin-top: 4px; }
    .mini i, .meter i { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, #ffcf4a, #ff7eb3); }

    .routines { display: grid; gap: 14px; }
    .routine { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 30px; text-align: left; width: 100%;
      border: 2px solid color-mix(in srgb, var(--k) 60%, transparent);
      background: linear-gradient(160deg, color-mix(in srgb, var(--k) 28%, rgba(255,255,255,.06)), rgba(255,255,255,.07)); box-shadow: 0 8px 24px rgba(0,0,0,.28); }
    .routine .em { font-size: 54px; line-height: 1; }
    .routine .rt { flex: 1; min-width: 0; display: grid; gap: 8px; }
    .routine b { font-size: clamp(18px, 3.4vw, 26px); font-weight: 900; }
    .routine .go { flex: none; padding: 10px 20px; border-radius: 999px; font-weight: 900; font-size: 18px; background: linear-gradient(135deg, var(--k), var(--k2)); box-shadow: 0 4px 14px rgba(0,0,0,.3); }
    .routine.complete { border-color: #3ed17e; }
    .dots { display: flex; gap: 6px; flex-wrap: wrap; }
    .dots i { width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,.22); transition: background .2s, transform .2s; }
    .dots i.on { background: #ffcf4a; box-shadow: 0 0 10px #ffcf4a; transform: scale(1.15); }
    .dots.big { justify-content: center; margin: 6px 0 10px; } .dots.big i { width: 18px; height: 18px; }

    .bank { display: flex; align-items: center; justify-content: center; gap: 18px; padding: 22px; border-radius: 32px; margin-bottom: 14px;
      background: linear-gradient(135deg, rgba(255,207,74,.28), rgba(255,126,179,.22)); border: 2px solid rgba(255,207,74,.5); }
    .bigstar { font-size: clamp(60px, 14vw, 96px); line-height: 1; animation: spin 5s ease-in-out infinite; filter: drop-shadow(0 6px 14px rgba(255,170,30,.6)); }
    .bank b { display: block; font-size: clamp(48px, 11vw, 84px); font-weight: 900; line-height: 1; }
    .bank span { font-size: 20px; font-weight: 800; opacity: .85; }
    .pocket { padding: 16px 20px; border-radius: 26px; background: rgba(255,255,255,.08); border: 2px solid rgba(255,255,255,.14); margin-bottom: 8px; }
    .pocket h3 { margin: 0 0 10px; font-size: 20px; font-weight: 900; }
    .meter { height: 20px; border-radius: 99px; background: rgba(0,0,0,.35); overflow: hidden; }
    .pocket p { margin: 10px 0 0; font-weight: 800; }
    .note { margin: 12px 4px; font-weight: 800; opacity: .9; }
    .lately { display: grid; gap: 6px; }
    .lately div { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 18px; background: rgba(255,255,255,.07); font-weight: 700; }
    .lately b { flex: 1; font-weight: 700; } .lately em { font-style: normal; font-weight: 900; color: #ffcf4a; }

    nav { flex: none; z-index: 5; display: flex; gap: 8px; padding: 8px; border-radius: 999px;
      background: rgba(10,8,30,.72); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.14); }
    nav button { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 8px; border: none; border-radius: 999px;
      background: transparent; font-weight: 900; font-size: clamp(14px, 2.8vw, 19px); opacity: .75; }
    nav button span { font-size: 24px; }
    nav button.on { opacity: 1; background: linear-gradient(135deg, var(--k), var(--k2)); box-shadow: 0 4px 16px rgba(0,0,0,.35); }
    @media (max-width: 480px) { nav { padding: 6px; gap: 4px; } nav button { gap: 4px; padding: 10px 4px; font-size: 14px; } nav button span { font-size: 20px; } }
    nav i { font-style: normal; min-width: 22px; padding: 1px 6px; border-radius: 999px; background: #ff5d73; font-size: 13px; }

    .empty, .msg { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; padding: 50px 20px; position: relative; z-index: 1; }
    .big { font-size: 72px; } .empty p, .msg p { margin: 0; font-size: 20px; font-weight: 800; max-width: 30ch; }

    .overlay { position: absolute; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(6,4,24,.7); backdrop-filter: blur(6px); }
    .panel { position: relative; width: min(560px, 100%); max-height: 100%; overflow: auto; padding: 22px 20px 20px; border-radius: 34px; text-align: center;
      background: linear-gradient(160deg, color-mix(in srgb, var(--k) 34%, #1a1346), #161038); border: 2px solid color-mix(in srgb, var(--k) 70%, transparent); box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    .panel h2 { margin: 0 0 6px; }
    .close { position: absolute; top: 12px; right: 14px; width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,.14); font-size: 18px; }
    .focus { padding: 10px 0 14px; } .fe { font-size: clamp(80px, 22vw, 130px); line-height: 1.05; animation: bob 2.2s ease-in-out infinite; }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .ft { font-size: clamp(24px, 6vw, 34px); font-weight: 900; }
    .donebtn { width: 100%; padding: 20px; border: none; border-radius: 28px; font-size: 28px; font-weight: 900; color: #06361c;
      background: linear-gradient(135deg, #7dffb0, #3ed17e); box-shadow: 0 8px 22px rgba(62,209,126,.45); }
    .donebtn:active { transform: scale(.97); } .donebtn.alt { color: #4a2b00; background: linear-gradient(135deg, #ffe08a, #ffb020); }
    .steplist { display: grid; gap: 6px; margin-top: 16px; text-align: left; }
    .steplist button { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 18px; border: none; background: rgba(255,255,255,.08); font-size: 17px; font-weight: 700; }
    .steplist button.on { opacity: .6; text-decoration: line-through; }
    .count { display: block; margin-top: 10px; opacity: .8; font-weight: 700; }
    .pins { display: flex; gap: 14px; justify-content: center; margin: 14px 0; }
    .pins i { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,.22); } .pins i.on { background: #ffcf4a; box-shadow: 0 0 12px #ffcf4a; }
    .pins.wrong { animation: shake .4s; } @keyframes shake { 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
    .keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 320px; margin: 14px auto 0; }
    .keys button { padding: 16px 0; border: none; border-radius: 22px; background: rgba(255,255,255,.12); font-size: 28px; font-weight: 900; }
    .keys button:active { background: var(--k); }
    .toast { position: absolute; left: 50%; bottom: 96px; transform: translateX(-50%); z-index: 40; padding: 14px 26px; border-radius: 999px; font-size: 19px; font-weight: 900;
      background: #fff; color: #2a1a60; box-shadow: 0 10px 30px rgba(0,0,0,.4); animation: pop .3s cubic-bezier(.2,1.6,.4,1); white-space: nowrap; max-width: 92%; overflow: hidden; text-overflow: ellipsis; }
    @keyframes pop { from { transform: translateX(-50%) scale(.6); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
  `];
}

// The dashboard card <ksh-family-hub-kids-card> is a small shell (src/loader.js) around this element
if (!customElements.get('ksh-family-hub-kids-core')) customElements.define('ksh-family-hub-kids-core', KshKidsCard);
