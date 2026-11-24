import { LitElement, html, css, nothing } from 'lit';
import { enableSwipeClose } from '../../hub/swipe.js';
import { setActing, setToken, resolveActing, actingMsg } from '../../hub/actor.js';
import { loadEvents, timeLabel, iso as isoOf } from '../calendar/data.js';
import { celebrate, CELEBRATIONS, DEFAULT_CELEBRATION } from '../../hub/celebrate.js';
import { CHORE_TEMPLATES, ROUTINE_TEMPLATES, REWARD_TEMPLATES, EMOJIS, DAY_NAMES } from './templates.js';
import { money, parseMoney, moneyInput } from '../../hub/money.js';

const ACCENT = '#3db6cc';

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const todayWeekday = () => (new Date().getDay() + 6) % 7;      // Monday = 0
const WEEKDAYS = [0, 1, 2, 3, 4];
const WEEKENDS = [5, 6];
const sameDays = (a = [], b = []) => a.length === b.length && a.every(x => b.includes(x));

const blankChore = () => ({
  name: '', emoji: '✅', points: 1, assignees: [], recurrence: { type: 'daily' }, start: todayIso(),
  due_time: '', remind: true, requires_approval: true, notes: '',
});

const blankRoutine = () => ({ name: '', emoji: '☀️', kind: 'custom', points: 3, assignees: [], steps: [{ text: '', emoji: '', days: [] }] });

/** Chores, routines and points. Used inside the hub shell only. */
class KshChoresModule extends LitElement {
  static properties = {
    hass: { type: Object },
    modules: { type: Object },
    hubMode: { type: Boolean, attribute: 'hub-mode' },
    _view: { state: true },
    _people: { state: true },
    _me: { state: true },
    _state: { state: true },
    _filter: { state: true },
    _sheet: { state: true },
    _draft: { state: true },
    _toast: { state: true },
    _loaded: { state: true },
    _search: { state: true },
    _pin: { state: true },
    _acting: { state: true },
    _seg: { state: true },
    _agenda: { state: true },
    _celFor: { state: true },
  };

  constructor() {
    super();
    this._view = 'today';
    this._people = [];
    this._me = null;
    this._state = null;
    this._filter = 'all';
    this._sheet = null;
    this._draft = null;
    this._toast = null;
    this._loaded = false;
    this._search = '';
    this._pin = '';
    this._acting = null;
    this._seg = this._readSeg();
    this._agenda = null;
    this._celFor = null;
    this._pin2 = '';
    this._initDone = false;
  }

  _readSeg() { try { return localStorage.getItem('ksh_chores_today') || 'all'; } catch { return 'all'; } }

  _setSeg(seg) {
    this._seg = seg;
    try { localStorage.setItem('ksh_chores_today', seg); } catch { /* ignore */ }
    if (seg === 'calendar' || seg === 'all') this._loadAgenda();
  }

  // ---- hub hooks -------------------------------------------------------------

  setHubView(view) {
    this._view = view;
    this._sheet = null;
    this.dispatchEvent(new CustomEvent('module-view-changed', { detail: { view }, bubbles: true, composed: true }));
  }

  /** Quick add > Chores */
  openAdd() {
    this.setHubView('chores');
    this._sheet = { type: 'pick' };
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick = setInterval(() => { if (this._state && this._state.today !== todayIso()) this._load(); }, 60000);
    this._vis = () => { if (!document.hidden && this._initDone) this._load(); };
    document.addEventListener('visibilitychange', this._vis);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._tick);
    document.removeEventListener('visibilitychange', this._vis);
    this._unsub?.();
    this._unsub = null;
    this._initDone = false;
  }

  updated(changed) {
    if (changed.has('hass') && this.hass && !this._initDone) {
      this._initDone = true;
      this._init();
    }
    const sheet = this.renderRoot.querySelector('.sheet');
    if (sheet && !sheet._swipe) { sheet._swipe = true; enableSwipeClose(sheet, () => this._closeSheet()); }
  }

  // ---- data ---------------------------------------------------------------------

  async _init() {
    await this._load();
    try {
      this._unsub = await this.hass.connection.subscribeMessage(() => this._scheduleLoad(), { type: 'ksh_chores/subscribe' });
    } catch { /* live updates are a bonus */ }
  }

  _scheduleLoad() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this._load(), 250);
  }

  async _load() {
    try {
      const [people, state] = await Promise.all([
        this.hass.callWS({ type: 'ksh_family_hub/people/list' }),
        this.hass.callWS({ type: 'ksh_chores/get_state', date: todayIso() }),
      ]);
      this._people = people.people;
      this._me = people.me;
      this._state = state;
      this._resolveActing();
      this._loaded = true;
      if (this._seg === 'calendar' || this._seg === 'all') this._loadAgenda();
    } catch (err) {
      this._loaded = true;
      this._say(err?.message || 'Could not load chores');
    }
  }

  _resolveActing() { this._acting = resolveActing(this.hass, this._people, this._me); }

  get _hasCalendar() { return !!this.modules?.calendar; }

  async _loadAgenda() {
    if (!this._hasCalendar) { this._agenda = null; return; }
    try {
      const day = todayIso();
      const res = await loadEvents(this.hass, day, day, { acting: this._actor, modules: this.modules, msg: actingMsg(this.hass, this._acting) });
      // chores are already on this page; the calendar part shows events
      this._agenda = res.events.filter(e => e.kind !== 'chore');
    } catch { this._agenda = []; }
  }

  get _actor() { return this._people.find(p => p.id === this._acting) || null; }
  get _role() { return this._actor?.role || (this.hass?.user?.is_admin ? 'adult' : null); }
  get _isAdult() { return this._role === 'adult'; }
  get _canSwitch() { return !!this.hass?.user?.is_admin || !this._me; }
  _person(id) { return this._people.find(p => p.id === id); }
  _chore(id) { return this._state?.chores.find(c => c.id === id); }

  async _call(type, extra = {}) {
    const msg = { type: `ksh_chores/${type}`, ...extra, ...actingMsg(this.hass, this._acting) };
    try {
      const res = await this.hass.callWS(msg);
      return res;
    } catch (err) {
      if (err?.code === 'pin_required' && this._actor?.has_pin) { this._sheet = { type: 'pin', person: this._actor, stay: true }; this._pin = ''; }
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

  // ---- rules, mirrored from the backend so the buttons make sense ---------------------

  _canDo(chore) {
    if (this._role === 'adult') return true;
    const a = chore.assignees || [];
    return a.length ? a.includes(this._acting) : this._role === 'child';
  }

  _visible(chore) {
    const a = chore.assignees || [];
    if (this._isAdult) {
      if (this._filter === 'all') return true;
      return !a.length || a.includes(this._filter);
    }
    return a.length ? a.includes(this._acting) : this._role === 'child';
  }

  _recurrenceText(rec = {}) {
    const days = (rec.days || []).map(d => DAY_NAMES[d]).join(', ');
    if (rec.type === 'weekly') return days ? `Weekly: ${days}` : 'Weekly';
    if (rec.type === 'once') return `Once, ${rec.date}`;
    if (rec.type === 'custom') {
      const unit = { day: 'day', week: 'week', month: 'month' }[rec.unit] || 'day';
      return `Every ${rec.every > 1 ? `${rec.every} ${unit}s` : unit}${rec.unit === 'week' && days ? `: ${days}` : ''}`;
    }
    return 'Daily';
  }

  // Late means: an earlier day that was not finished, or today and the due time has passed. A chore without a
  // due time is only late once its day is over, and never before it starts.
  _overdue(chore, item) {
    if (!['open', 'rejected'].includes(item.status)) return false;
    if (item.date < todayIso()) return true;
    if (!chore.due_time || item.date !== todayIso()) return false;
    const now = new Date();
    return chore.due_time < `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  /** The day before an ISO date (a period's end is the first day after it), in local time */
  _dayBefore(day) {
    const [y, m, d] = day.split('-').map(Number);
    return isoOf(new Date(y, m - 1, d - 1));
  }

  _dateLabel(day) {
    return new Date(`${day}T12:00:00`).toLocaleDateString(this.hass.locale?.language || undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // ---- actions ------------------------------------------------------------------------

  async _complete(item) {
    const chore = this._chore(item.chore_id);
    // the last thing on today's list earns the bigger celebration
    const left = this._state.items.filter(i => ['open', 'rejected'].includes(i.status) && this._chore(i.chore_id) && this._visible(this._chore(i.chore_id))).length;
    const res = await this._call('complete', { chore_id: item.chore_id, date: item.date });
    if (res) celebrate(this, res.celebration, { big: left <= 1 });
    if (res?.awarded) this._say(`+${chore.points} ★  ${chore.name}`);
    else if (res?.status === 'done') this._say('Done. Waiting for an adult to approve.');
  }

  async _undo(item) {
    if (item.status === 'approved' && !confirm('Undo this chore? The points are taken back.')) return;
    await this._call('reopen', { chore_id: item.chore_id, date: item.date });
  }

  async _approve(item) {
    const chore = this._chore(item.chore_id);
    const res = await this._call('approve', { chore_id: item.chore_id, date: item.date });
    if (res?.awarded) this._say(`Approved. ${this._person(item.done_by)?.name || 'They'} got +${chore.points} ★`);
  }

  async _reject(item) {
    const note = prompt('Send it back. What needs doing? (optional)', '') ?? null;
    if (note === null) return;
    await this._call('reject', { chore_id: item.chore_id, date: item.date, note });
  }

  _closeSheet() { this._sheet = null; this._draft = null; this._search = ''; this._pin = ''; }

  // ---- chore editor -----------------------------------------------------------------

  _newChoreFrom(template) {
    this._draft = { ...blankChore(), ...(template ? {
      name: template.name, emoji: template.emoji, points: template.points, recurrence: { ...template.recurrence },
    } : {}), start: todayIso() };
    this._sheet = { type: 'chore' };
  }

  _editChore(chore) {
    this._draft = { ...blankChore(), ...JSON.parse(JSON.stringify(chore)), due_time: chore.due_time || '', start: chore.start || todayIso() };
    if (chore.recurrence?.type === 'once') this._draft.start = chore.recurrence.date;
    this._sheet = { type: 'chore', id: chore.id };
  }

  _set(field, value) { this._draft = { ...this._draft, [field]: value }; }

  _setRec(patch) { this._draft = { ...this._draft, recurrence: { ...this._draft.recurrence, ...patch } }; }

  _toggleAssignee(id) {
    const cur = this._draft.assignees || [];
    this._set('assignees', cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  }

  _toggleDay(d) {
    const days = this._draft.recurrence.days || [];
    this._setRec({ days: days.includes(d) ? days.filter(x => x !== d) : [...days, d].sort() });
  }

  _setRecType(type) {
    const keep = { days: this._draft.recurrence.days || [] };
    if (type === 'daily' || type === 'once') this._draft = { ...this._draft, recurrence: { type } };
    else if (type === 'weekly') this._draft = { ...this._draft, recurrence: { type, ...keep } };
    else this._draft = { ...this._draft, recurrence: { type: 'custom', every: this._draft.recurrence.every || 2, unit: this._draft.recurrence.unit || 'day', start: this._draft.start || todayIso(), ...keep } };
  }

  async _saveChore() {
    const d = this._draft;
    if (!d.name.trim()) { this._say('Give the chore a name'); return; }
    const rec = { ...d.recurrence };
    const start = d.start || todayIso();
    if (rec.type === 'once') rec.date = start;
    if (rec.type === 'custom') rec.start = start;
    if (rec.type === 'weekly' && !(rec.days || []).length) rec.days = [((new Date().getDay() + 6) % 7)];
    if (rec.type === 'custom' && rec.unit === 'week' && !(rec.days || []).length) rec.days = [((new Date().getDay() + 6) % 7)];
    const fields = {
      name: d.name.trim(), emoji: d.emoji, points: Number(d.points) || 0, assignees: d.assignees, recurrence: rec, start,
      due_time: d.due_time || null, remind: !!d.remind && !!d.due_time, requires_approval: !!d.requires_approval, notes: d.notes || '',
    };
    const id = this._sheet?.id;
    const res = await this._call(id ? 'chores/update' : 'chores/add', id ? { chore_id: id, ...fields } : fields);
    if (res) this._closeSheet();
  }

  async _deleteChore() {
    if (!confirm(`Delete “${this._draft.name}”? Points already earned are kept.`)) return;
    const res = await this._call('chores/delete', { chore_id: this._sheet.id });
    if (res) this._closeSheet();
  }

  // ---- routine editor and runner -----------------------------------------------------

  _newRoutineFrom(template) {
    this._draft = { ...blankRoutine(), ...(template ? JSON.parse(JSON.stringify(template)) : {}) };
    this._sheet = { type: 'routine' };
  }

  _editRoutine(r) {
    this._draft = JSON.parse(JSON.stringify(r));
    this._sheet = { type: 'routine', id: r.id };
  }

  _setStep(i, patch) {
    const steps = this._draft.steps.map((s, n) => (n === i ? { ...s, ...patch } : s));
    this._set('steps', steps);
  }

  _moveStep(i, dir) {
    const steps = [...this._draft.steps];
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    [steps[i], steps[j]] = [steps[j], steps[i]];
    this._set('steps', steps);
  }

  async _saveRoutine() {
    const d = this._draft;
    if (!d.name.trim()) { this._say('Give the routine a name'); return; }
    const steps = d.steps.filter(st => st.text.trim()).map(st => ({ ...st, days: st.days || [] }));
    if (!steps.length) { this._say('Add at least one step'); return; }
    const fields = { name: d.name.trim(), emoji: d.emoji, kind: d.kind, points: Number(d.points) || 0, assignees: d.assignees, steps };
    const id = this._sheet?.id;
    const res = await this._call(id ? 'routines/update' : 'routines/add', id ? { routine_id: id, ...fields } : fields);
    if (res) this._closeSheet();
  }

  async _deleteRoutine() {
    if (!confirm(`Delete the routine “${this._draft.name}”?`)) return;
    const res = await this._call('routines/delete', { routine_id: this._sheet.id });
    if (res) this._closeSheet();
  }

  _run(routineId) { return this._state.runs[`${routineId}:${this._acting || `admin:${this.hass.user.id}`}`] || { steps: [], completed: false }; }

  async _toggleStep(routine, stepId, done) {
    const res = await this._call('routines/step', { routine_id: routine.id, step_id: stepId, done });
    if (res?.awarded) { this._sheet = { type: 'celebrate', routine }; celebrate(this, res.celebration, { big: true }); }
  }

  // ---- people ----------------------------------------------------------------------

  async _switchTo(person) {
    if (person.has_pin) { this._sheet = { type: 'pin', person }; this._pin = ''; return; }
    if (!this.hass.user?.is_admin && person.role === 'adult') {
      this._say(`${person.name} needs a PIN before this profile can be used on a shared login. An administrator can set one under Manage people.`);
      return;
    }
    this._applySwitch(person);
  }

  _applySwitch(person, token = null) {
    setActing(this.hass, person.id, token);
    this._acting = person.id;
    this._closeSheet();
    this._filter = 'all';
    this._agenda = null;
    this._load();
  }

  async _checkPin() {
    const { person, stay } = this._sheet;
    try {
      const res = await this.hass.callWS({ type: 'ksh_family_hub/people/verify_pin', person_id: person.id, pin: this._pin });
      if (!res.ok) { this._pin = ''; this._say('Wrong PIN'); return; }
      if (stay) { setToken(this.hass, res.token); this._closeSheet(); this._load(); }
      else this._applySwitch(person, res.token);
    } catch (err) { this._pin = ''; this._say(err?.message || 'Could not check the PIN'); }
  }

  // ---- celebration: each person chooses their own ------------------------------------------------

  _celebrationOf(personId) { return this._state?.celebrations?.[personId] || DEFAULT_CELEBRATION; }

  async _chooseCelebration(personId, style) {
    if (style !== 'off') celebrate(this, style, { big: true, force: true });
    if (this._state) this._state = { ...this._state, celebrations: { ...(this._state.celebrations || {}), [personId]: style } };
    await this._call('celebration/set', { person_id: personId, style });
  }

  _celebrationSection() {
    const a = this._actor;
    if (!a) return nothing;
    const who = (this._isAdult && this._people.find(p => p.id === this._celFor)) || a;
    const style = this._celebrationOf(who.id);
    return html`
      <h3>Celebration</h3>
      ${this._isAdult && this._people.length > 1 ? html`
        <div class="chips" role="radiogroup" aria-label="Choose for">
          ${this._people.filter(p => p.role !== 'guest').map(p => html`<button class="chip ${p.id === who.id ? 'on' : ''}" @click=${() => { this._celFor = p.id; }}>${p.emoji} ${p.name}</button>`)}
        </div>` : nothing}
      <div class="card cels" role="radiogroup" aria-label="Celebration for ${who.name}">
        ${CELEBRATIONS.map(c => html`
          <button role="radio" aria-checked=${style === c.id ? 'true' : 'false'} class="cel ${style === c.id ? 'sel' : ''}" @click=${() => this._chooseCelebration(who.id, c.id)}>
            <span class="ce">${c.icon}</span><b>${c.label}</b><small>${c.hint}</small>
          </button>`)}
        <button role="radio" aria-checked=${style === 'off' ? 'true' : 'false'} class="cel ${style === 'off' ? 'sel' : ''}" @click=${() => this._chooseCelebration(who.id, 'off')}>
          <span class="ce">🚫</span><b>Off</b><small>No animation</small>
        </button>
      </div>
      <p class="muted">Plays for ${who.name} when they finish a chore or routine: a short one for a chore, a bigger one for a whole routine or the last chore of the day.
        Tap one to choose it and see it.
        ${style !== 'off' ? html`<button class="link" @click=${() => celebrate(this, style, { big: true, force: true })}>Play again</button>` : nothing}
        It stays still on a device that asks for reduced motion.</p>`;
  }

  _startPin() { this._pin = ''; this._pin2 = ''; this._sheet = { type: 'setpin' }; }

  async _savePin(remove = false) {
    const a = this._actor;
    if (!a) return;
    if (!remove) {
      if (!/^\d{4}$/.test(this._pin)) { this._say('A PIN is four digits'); return; }
      if (this._pin !== this._pin2) { this._say('The two PINs are different'); return; }
    } else if (!confirm('Remove your PIN? Anyone using this device could switch to you.')) return;
    try {
      const res = await this.hass.callWS({ type: 'ksh_family_hub/people/set_pin', person_id: a.id, pin: remove ? null : this._pin, ...actingMsg(this.hass, this._acting) });
      setToken(this.hass, res.token);
      this._closeSheet();
      this._say(remove ? 'PIN removed' : 'PIN saved');
      this._load();
    } catch (err) { this._say(err?.message || 'Could not save the PIN'); }
  }

  async _adjust() {
    const { person } = this._sheet;
    const points = Number(this._draft.points);
    if (!points) { this._say('Enter a number of points'); return; }
    const res = await this._call('points/adjust', { person_id: person.id, points, reason: this._draft.reason || '' });
    if (res) this._closeSheet();
  }

  // ---- render ----------------------------------------------------------------------

  render() {
    if (!this._loaded) return html`<div class="center"><div class="spinner"></div></div>`;
    if (!this._state) return html`<div class="center"><p class="muted">Chores could not be loaded.</p></div>`;
    if (!this._actor && !this.hass.user?.is_admin) return this._whoAreYou();
    return html`
      <div class="scroll">
        <div class="page">
          ${this._header()}
          ${this._view === 'today' ? this._today() : nothing}
          ${this._view === 'chores' ? this._choresList() : nothing}
          ${this._view === 'routines' ? this._routines() : nothing}
          ${this._view === 'points' ? this._points() : nothing}
          ${this._view === 'settings' ? this._settings() : nothing}
        </div>
      </div>
      ${this._sheet ? this._renderSheet() : nothing}
      ${this._toast ? html`<div class="toast" role="status">${this._toast}</div>` : nothing}`;
  }

  _whoAreYou() {
    return html`
      <div class="scroll"><div class="page">
        <h2 class="big">Who are you?</h2>
        <p class="muted">Pick your name to see your chores.</p>
        ${this._people.map(p => this._personRow(p, () => this._switchTo(p)))}
        ${!this._people.length ? html`<p class="muted">No people yet. An adult can add them from the menu.</p>` : nothing}
      </div></div>
      ${this._sheet ? this._renderSheet() : nothing}
      ${this._toast ? html`<div class="toast">${this._toast}</div>` : nothing}`;
  }

  _avatar(p, size = '') {
    return html`<span class="avatar ${size}" style="--c:${p?.color || ACCENT}">${p?.emoji || '🙂'}</span>`;
  }

  _personRow(p, onClick, right = nothing) {
    return html`
      <button class="row" @click=${onClick}>
        ${this._avatar(p)}
        <span class="txt"><b>${p.name}</b><small>${p.role === 'adult' ? 'Adult' : p.role === 'child' ? 'Child' : 'Guest'}${p.has_pin ? ' · PIN' : ''}</small></span>
        ${right}
      </button>`;
  }

  _header() {
    const a = this._actor;
    const waiting = this._isAdult ? this._state.pending.length : 0;
    return html`
      <div class="who">
        <button class="chip-person" ?disabled=${!this._canSwitch} @click=${() => { this._sheet = { type: 'switch' }; }}
          aria-label="Switch person">
          ${a ? this._avatar(a) : html`<span class="avatar" style="--c:${ACCENT}">🙂</span>`}
          <span><b>${a?.name || this.hass.user?.name || 'You'}</b><small>${a ? { adult: 'Adult', child: 'Child', guest: 'Guest' }[a.role] : 'Adult'}${this._canSwitch ? ' · tap to switch' : ''}</small></span>
        </button>
        ${waiting ? html`<span class="badge" title="Waiting for approval">${waiting} to approve</span>` : nothing}
      </div>`;
  }

  // -- Today --

  _segments() {
    return [['all', 'All'], ['chores', 'Chores'], ['routines', 'Routines'], ...(this._hasCalendar ? [['calendar', 'Calendar']] : [])];
  }

  _today() {
    const s = this._state;
    const seg = this._segments().some(([k]) => k === this._seg) ? this._seg : 'all';
    const mapItem = i => ({ ...i, chore: this._chore(i.chore_id) });
    const items = s.items.map(mapItem).filter(i => i.chore && this._visible(i.chore));
    const late = (s.overdue || []).map(mapItem).filter(i => i.chore && this._visible(i.chore));
    const todo = items.filter(i => ['open', 'rejected'].includes(i.status));
    const done = items.filter(i => ['done', 'approved'].includes(i.status));
    const waiting = this._isAdult ? s.pending.map(p => ({ ...p, chore: this._chore(p.chore_id) })).filter(p => p.chore) : [];
    const date = new Date().toLocaleDateString(this.hass.locale?.language || undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    const showChores = seg === 'all' || seg === 'chores';
    const routines = this._routinesToday();
    return html`
      <p class="date">${date}</p>
      <div class="seg tabs" role="tablist" aria-label="Show">
        ${this._segments().map(([k, l]) => html`<button role="tab" aria-selected=${seg === k ? 'true' : 'false'} class=${seg === k ? 'on' : ''} @click=${() => this._setSeg(k)}>${l}</button>`)}
      </div>

      ${showChores && this._isAdult && this._people.length > 1 ? html`
        <div class="chips" role="radiogroup" aria-label="Show chores for">
          <button class="chip ${this._filter === 'all' ? 'on' : ''}" @click=${() => { this._filter = 'all'; }}>Everyone</button>
          ${this._people.map(p => html`<button class="chip ${this._filter === p.id ? 'on' : ''}" @click=${() => { this._filter = p.id; }}>${p.emoji} ${p.name}</button>`)}
        </div>` : nothing}

      ${showChores && waiting.length ? html`
        <h3>Waiting for approval</h3>
        <div class="card">${waiting.map(w => html`
          <div class="item">
            <span class="emoji">${w.chore.emoji}</span>
            <span class="txt"><b>${w.chore.name}</b><small>${this._person(w.done_by)?.name || 'Someone'} · ${w.date === s.today ? 'today' : w.date} · +${w.chore.points} ★</small></span>
            <button class="mini ok" @click=${() => this._approve(w)} aria-label="Approve"><ha-icon icon="mdi:check"></ha-icon>Approve</button>
            <button class="mini" @click=${() => this._reject(w)} aria-label="Send back"><ha-icon icon="mdi:undo"></ha-icon></button>
          </div>`)}</div>` : nothing}

      ${showChores && late.length ? html`
        <h3 class="lateh">Overdue <span class="count late">${late.length}</span></h3>
        <div class="card">${late.map(i => this._item(i))}</div>` : nothing}

      ${seg === 'routines' || seg === 'all' ? (routines.length ? html`
        <h3>Routines</h3>${routines.map(r => this._routineCard(r, { compact: true }))}`
        : seg === 'routines' ? html`<div class="empty"><span>☀️</span><p>No routines for you today.</p></div>` : nothing) : nothing}

      ${showChores ? html`
        <h3>To do ${todo.length ? html`<span class="count">${todo.length}</span>` : nothing}</h3>
        ${todo.length ? html`<div class="card">${todo.map(i => this._item(i))}</div>`
          : html`<div class="empty"><span>🎉</span><p>${items.length ? 'All done for today!' : 'No chores today.'}</p></div>`}` : nothing}

      ${seg === 'calendar' || seg === 'all' ? this._calendarToday(seg === 'calendar') : nothing}

      ${showChores && done.length ? html`<h3>Done</h3><div class="card">${done.map(i => this._item(i))}</div>` : nothing}`;
  }

  _calendarToday(full) {
    if (!this._hasCalendar) return nothing;
    const list = this._agenda;
    if (!list || (!list.length && !full)) return list && !list.length ? nothing : html`<h3>Calendar</h3><p class="muted">Loading…</p>`;
    return html`
      <h3>Calendar today</h3>
      ${list.length ? html`<div class="card">${list.map(e => html`
        <div class="item small">
          <span class="emoji" style="background:color-mix(in srgb, ${e.color} 22%, transparent)">${e.emoji}</span>
          <span class="txt"><b>${e.title}</b>
            <small>${timeLabel(e)}${e.location ? ` · ${e.location}` : ''}${(e.people || []).length ? ` · ${e.people.map(id => this._person(id)?.emoji || '').join(' ')}` : ''}</small></span>
        </div>`)}</div>`
        : html`<div class="empty"><span>🗓️</span><p>Nothing in the calendar today.</p></div>`}
      <button class="link" @click=${() => this.dispatchEvent(new CustomEvent('hub-navigate', { detail: { id: 'calendar' }, bubbles: true, composed: true }))}>
        <ha-icon icon="mdi:calendar-month-outline"></ha-icon>Open the calendar</button>`;
  }

  // Routines this person does today (a routine with no step today is left out)
  _routinesToday() {
    const mineOnly = r => this._isAdult || !(r.assignees || []).length ? (this._isAdult || this._role === 'child') : r.assignees.includes(this._acting);
    return this._state.routines.filter(r => r.active !== false && mineOnly(r) && this._stepsToday(r).length)
      .filter(r => !this._isAdult || this._filter === 'all' || !(r.assignees || []).length || r.assignees.includes(this._filter));
  }

  _stepsToday(r) { return r.steps.filter(st => !(st.days || []).length || st.days.includes(todayWeekday())); }

  _item(i) {
    const c = i.chore;
    const assignees = (c.assignees || []).map(id => this._person(id)).filter(Boolean);
    const overdue = this._overdue(c, i);
    const mine = i.done_by === this._acting;
    const canUndo = i.status === 'done' ? (this._isAdult || mine) : (i.status === 'approved' && this._isAdult);
    return html`
      <div class="item ${i.status}">
        <span class="emoji">${c.emoji}</span>
        <span class="txt">
          <b>${c.name}</b>
          <small>
            ${['done', 'approved'].includes(i.status) ? html`${this._person(i.done_by)?.emoji || ''} ${this._person(i.done_by)?.name || 'Someone'} did it`
              : assignees.length ? assignees.map(p => p.emoji).join(' ') + ' ' + assignees.map(p => p.name).join(', ') : 'Anyone'}
            ${i.date < todayIso() ? html` · <span class="late">${this._dateLabel(i.date)}</span>`
              : c.due_time ? html` · <span class=${overdue ? 'late' : ''}>${overdue ? 'Was due' : 'Due'} ${c.due_time}</span>` : nothing}
            ${c.points ? html` · +${c.points} ★` : nothing}
          </small>
          ${i.status === 'rejected' && i.note ? html`<small class="late">Sent back: ${i.note}</small>` : nothing}
        </span>
        ${['open', 'rejected'].includes(i.status) ? html`
          <button class="check" ?disabled=${!this._canDo(c)} @click=${() => this._complete(i)} aria-label="Mark ${c.name} as done"
            title=${this._canDo(c) ? 'Done' : 'Not assigned to you'}><ha-icon icon="mdi:check"></ha-icon></button>`
        : i.status === 'done' ? html`
          <button class="pill wait" ?disabled=${!canUndo} @click=${() => this._undo(i)} title=${canUndo ? 'Take it back' : 'Waiting for approval'}>Waiting</button>`
        : html`<button class="pill okp" ?disabled=${!canUndo} @click=${() => this._undo(i)} title=${canUndo ? 'Undo' : ''}>✓ ${i.points ? `+${i.points}` : 'Done'}</button>`}
      </div>`;
  }

  // -- Chores (library) --

  _choresList() {
    const chores = this._state.chores;
    return html`
      <div class="head">
        <h3 class="inline">All chores</h3>
        ${this._isAdult ? html`<button class="primary" @click=${() => { this._sheet = { type: 'pick' }; }}><ha-icon icon="mdi:plus"></ha-icon>Add chore</button>` : nothing}
      </div>
      ${chores.length ? html`<div class="card">${chores.map(c => {
        const who = (c.assignees || []).map(id => this._person(id)).filter(Boolean);
        return html`
          <button class="item btn" @click=${() => this._isAdult && this._editChore(c)} ?disabled=${!this._isAdult}>
            <span class="emoji">${c.emoji}</span>
            <span class="txt"><b>${c.name}</b>
              <small>${who.length ? who.map(p => p.emoji + ' ' + p.name).join(', ') : 'Anyone'} · ${this._recurrenceText(c.recurrence)}${c.due_time ? ` · ${c.due_time}` : ''}</small></span>
            <span class="pts">${c.points} ★</span>
            ${this._isAdult ? html`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>` : nothing}
          </button>`; })}</div>`
        : html`<div class="empty"><span>🧹</span><p>No chores yet.</p>${this._isAdult ? html`<button class="primary" @click=${() => { this._sheet = { type: 'pick' }; }}>Add the first one</button>` : nothing}</div>`}
      ${!this._isAdult ? html`<p class="muted">Only an adult can add or change chores.</p>` : nothing}`;
  }

  // -- Routines --

  _routineCard(r, { compact = false } = {}) {
    const run = this._run(r.id);
    const steps = this._stepsToday(r);
    const done = steps.filter(st => run.steps.includes(st.id)).length;
    const can = this._isAdult || !(r.assignees || []).length ? true : r.assignees.includes(this._acting);
    const who = (r.assignees || []).map(id => this._person(id)).filter(Boolean);
    const none = !steps.length;
    return html`
      <div class="card routine ${run.completed ? 'finished' : ''}">
        <button class="rhead" @click=${() => { this._sheet = { type: 'run', id: r.id }; }} ?disabled=${!can || none}>
          <span class="emoji big">${r.emoji}</span>
          <span class="txt"><b>${r.name}</b>
            <small>${none ? 'No steps today' : `${steps.length} step${steps.length === 1 ? '' : 's'} today`} · +${r.points} ★ · ${who.length ? who.map(p => p.emoji + ' ' + p.name).join(', ') : 'Anyone'}</small></span>
          <span class="pill ${run.completed ? 'okp' : ''}">${none ? '—' : run.completed ? '✓ Done' : done ? `${done}/${steps.length}` : 'Start'}</span>
        </button>
        <div class="bar"><i style="width:${steps.length ? (done / steps.length) * 100 : 0}%"></i></div>
        ${this._isAdult && !compact ? html`<button class="link" @click=${() => this._editRoutine(r)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit routine</button>` : nothing}
      </div>`;
  }

  _routines() {
    const all = this._state.routines;
    const mineOnly = r => this._isAdult || !(r.assignees || []).length ? (this._isAdult || this._role === 'child') : r.assignees.includes(this._acting);
    const list = all.filter(mineOnly);
    return html`
      <div class="head">
        <h3 class="inline">Routines</h3>
        ${this._isAdult ? html`<button class="primary" @click=${() => { this._sheet = { type: 'routine-pick' }; }}><ha-icon icon="mdi:plus"></ha-icon>Add routine</button>` : nothing}
      </div>
      ${list.length ? list.map(r => this._routineCard(r))
        : html`<div class="empty"><span>☀️</span><p>${this._isAdult ? 'No routines yet. Start from a morning or evening routine.' : 'No routines for you yet.'}</p></div>`}`;
  }

  // -- Points --

  /** Points a person can still spend: balance minus what they have already asked for */
  _free(personId) {
    const held = (this._state.redemptions || []).filter(r => r.person_id === personId && r.status === 'requested').reduce((n, r) => n + r.cost, 0);
    return (this._state.balances[personId] || 0) - held;
  }

  async _redeem(reward) {
    const res = await this._call('redeem', { reward_id: reward.id });
    if (res?.status === 'approved') { this._say(`Enjoy! ${reward.emoji} ${reward.name}`); celebrate(this, this._celebrationOf(this._acting), { big: false }); }
    else if (res?.status === 'requested') this._say('Asked! A grown-up will say yes.');
  }

  async _decide(red, yes) {
    const res = await this._call(yes ? 'redemptions/approve' : 'redemptions/decline', { redemption_id: red.id });
    if (res && yes) this._say(`${this._person(red.person_id)?.name || 'They'} spent ${red.cost} ★ on ${red.name}`);
  }

  async _addStandard(list) {
    for (const t of list) await this._call('rewards/add', { name: t.name, emoji: t.emoji, cost: t.cost });
  }

  _editReward(r) { this._draft = { ...r }; this._sheet = { type: 'reward', id: r.id }; }
  _newReward(t) { this._draft = { name: t?.name || '', emoji: t?.emoji || '🎁', cost: t?.cost || 20, active: true }; this._sheet = { type: 'reward' }; }

  async _saveReward() {
    const d = this._draft;
    if (!d.name.trim()) { this._say('Give the reward a name'); return; }
    const fields = { name: d.name.trim(), emoji: d.emoji, cost: Number(d.cost) || 0, active: !!d.active };
    const id = this._sheet?.id;
    const res = await this._call(id ? 'rewards/update' : 'rewards/add', id ? { reward_id: id, ...fields } : fields);
    if (res) this._closeSheet();
  }

  async _deleteReward() {
    if (!confirm(`Remove “${this._draft.name}”? Points already spent stay spent.`)) return;
    const res = await this._call('rewards/delete', { reward_id: this._sheet.id });
    if (res) this._closeSheet();
  }

  // pocket money rules, one child at a time
  _startPocket(p) {
    const cur = this._state.pocket?.[p.id] || {};
    this._draft = { enabled: cur.enabled ?? true, period: cur.period || 'week', points: cur.points ?? 20, amount: moneyInput(cur.amount ?? 500), account: cur.account || 'bank' };
    this._sheet = { type: 'pocket', person: p };
  }

  async _savePocket() {
    const d = this._draft;
    const amount = parseMoney(d.amount);
    if (Number.isNaN(amount) || amount < 0) { this._say('Enter the amount like 5 or 5.50'); return; }
    if (!(Number(d.points) >= 1)) { this._say('Enter how many points they need'); return; }
    const res = await this._call('pocket/set', { person_id: this._sheet.person.id, enabled: !!d.enabled, period: d.period, points: Number(d.points), amount, account: d.account });
    if (res) this._closeSheet();
  }

  _pocketText(cfg) {
    const per = cfg.period === 'week' ? 'week' : 'month';
    return `${cfg.points} ★ a ${per} earns ${money(this.hass, cfg.amount)} into ${cfg.account === 'cash' ? 'Cash' : 'Bank'}`;
  }

  _pocketBar(cfg) {
    const pct = Math.min(100, cfg.points ? (cfg.earned / cfg.points) * 100 : 0);
    const left = Math.max(0, cfg.points - cfg.earned);
    return html`
      <div class="bar"><i style="width:${pct}%"></i></div>
      <small class="muted pocketnote">${cfg.starts_next ? `Starts next ${cfg.period}.` : left ? `${cfg.earned} of ${cfg.points} ★ this ${cfg.period}. ${left} more to earn ${money(this.hass, cfg.amount)}.`
        : `${cfg.earned} ★ this ${cfg.period}: ${money(this.hass, cfg.amount)} pocket money is on its way!`}</small>`;
  }

  _rewardsSection() {
    const s = this._state;
    const rewards = (s.rewards || []).filter(r => r.active !== false);
    const me = this._actor;
    const free = me ? this._free(me.id) : 0;
    const waiting = this._isAdult ? (s.redemptions || []).filter(r => r.status === 'requested') : [];
    const mine = (s.redemptions || []).filter(r => r.person_id === this._acting).slice(-3).reverse();
    return html`
      <h3>Spend your points ${me ? html`<span class="count">${free} ★ to spend</span>` : nothing}</h3>

      ${waiting.length ? html`<div class="card">${waiting.map(r => html`
        <div class="item">
          <span class="emoji">${r.emoji}</span>
          <span class="txt"><b>${r.name}</b><small>${this._person(r.person_id)?.name || 'Someone'} · ${r.cost} ★</small></span>
          <button class="mini ok" @click=${() => this._decide(r, true)}><ha-icon icon="mdi:check"></ha-icon>Yes</button>
          <button class="mini" aria-label="Say no" @click=${() => this._decide(r, false)}><ha-icon icon="mdi:close"></ha-icon></button>
        </div>`)}</div><p class="muted">Waiting for a yes before the points are spent.</p>` : nothing}

      ${rewards.length ? html`<div class="rewards">${rewards.map(r => {
        const can = !!me && free >= r.cost && me.role !== 'guest';
        return html`
          <div class="reward ${can ? '' : 'locked'}">
            ${this._isAdult ? html`<button class="redit" aria-label="Edit ${r.name}" @click=${() => this._editReward(r)}><ha-icon icon="mdi:pencil-outline"></ha-icon></button>` : nothing}
            <span class="re">${r.emoji}</span><b>${r.name}</b>
            <span class="cost">${r.cost} ★</span>
            <button class="mini ${can ? 'ok' : ''}" ?disabled=${!can} @click=${() => this._redeem(r)}>${can ? (this._isAdult ? 'Spend' : 'Ask') : `${r.cost - free} more`}</button>
          </div>`; })}</div>`
        : html`<div class="empty"><span>🎁</span><p>${this._isAdult ? 'Nothing to spend points on yet.' : 'No rewards yet. Ask a grown-up to add some!'}</p>
          ${this._isAdult ? html`<button class="primary" @click=${() => this._addStandard(REWARD_TEMPLATES)}>Add the standard rewards</button>` : nothing}</div>`}

      ${this._isAdult ? html`<div class="head"><span></span><button class="link" @click=${() => { this._sheet = { type: 'reward-pick' }; }}><ha-icon icon="mdi:plus"></ha-icon>Add a reward</button></div>` : nothing}

      ${mine.length ? html`<h4>Your requests</h4><div class="card">${mine.map(r => html`
        <div class="item small">
          <span class="emoji">${r.emoji}</span>
          <span class="txt"><b>${r.name}</b><small>${r.cost} ★ · ${{ requested: 'waiting for a yes', approved: 'enjoy!', declined: 'not this time' }[r.status]}</small></span>
          ${r.status === 'requested' ? html`<button class="mini" @click=${() => this._call('redemptions/cancel', { redemption_id: r.id })}>Cancel</button>` : nothing}
        </div>`)}</div>` : nothing}`;
  }

  _pocketSection() {
    const s = this._state;
    const pocket = s.pocket || {};
    const kids = this._people.filter(p => p.role === 'child');
    const financeOn = !!this.modules?.finance;
    if (!this._isAdult) {
      const mine = this._actor && pocket[this._acting];
      if (!mine?.enabled) return nothing;
      return html`<h3>Pocket money</h3><div class="card pad">${this._pocketBar(mine)}
        <p class="muted">${this._pocketText(mine)}.</p></div>${this._pocketHistory(this._acting)}`;
    }
    return html`
      <h3>Pocket money</h3>
      <div class="card">${kids.length ? kids.map(p => {
        const cfg = pocket[p.id];
        return html`
          <div class="pk">
            <div class="item">
              ${this._avatar(p, 'lg')}
              <span class="txt"><b>${p.name}</b><small>${cfg?.enabled ? this._pocketText(cfg) : 'No pocket money set up'}</small></span>
              <button class="mini ${cfg?.enabled ? '' : 'ok'}" @click=${() => this._startPocket(p)}>${cfg?.enabled ? 'Change' : 'Set up'}</button>
            </div>
            ${cfg?.enabled ? html`<div class="pkbar">${this._pocketBar(cfg)}</div>` : nothing}
          </div>`; }) : html`<p class="muted pad">Add children under Manage people first.</p>`}</div>
      <p class="muted">When a ${'week or month'} finishes, a child who earned enough points is paid into their ${financeOn ? 'Finance account' : 'account'} automatically.
        Only chores and routines count (not bonuses), and an undone chore takes its points back.
        ${financeOn ? '' : html`<b>The Finance part is switched off, so nothing is paid until you switch it on (under Settings → Menu).</b>`}</p>
      ${this._pocketHistory(null)}`;
  }

  _pocketHistory(personId) {
    const list = (this._state.pocket_history || []).filter(h => !personId || h.person_id === personId).slice(-5).reverse();
    if (!list.length) return nothing;
    return html`<h4>Past ${personId ? 'weeks' : 'weeks and months'}</h4><div class="card">${list.map(h => {
      const p = this._person(h.person_id);
      return html`<div class="item small">${this._avatar(p)}
        <span class="txt"><b>${p?.name || 'Someone'}: ${h.earned} of ${h.target} ★</b><small>${this._dateLabel(h.start)} – ${this._dateLabel(this._dayBefore(h.end))}</small></span>
        <span class="pill ${h.paid ? 'okp' : ''}">${h.paid ? `+${money(this.hass, h.amount)}` : 'Not this time'}</span></div>`; })}</div>`;
  }

  _points() {
    const bal = this._state.balances;
    const people = [...this._people].sort((a, b) => (bal[b.id] || 0) - (bal[a.id] || 0));
    return html`
      <h3>Points</h3>
      <div class="card">${people.map(p => html`
        <div class="item">
          ${this._avatar(p, 'lg')}
          <span class="txt"><b>${p.name}</b><small>${p.role === 'adult' ? 'Adult' : p.role === 'child' ? 'Child' : 'Guest'}</small></span>
          <span class="score">${bal[p.id] || 0} ★</span>
          ${this._isAdult ? html`<button class="mini" aria-label="Adjust points for ${p.name}"
            @click=${() => { this._draft = { points: '', reason: '' }; this._sheet = { type: 'adjust', person: p }; }}><ha-icon icon="mdi:plus-minus-variant"></ha-icon></button>` : nothing}
        </div>`)}</div>
      ${this._rewardsSection()}
      ${this._pocketSection()}
      <h3>Recent</h3>
      ${this._state.history.length ? html`<div class="card">${this._state.history.map(e => {
        const p = this._person(e.person_id);
        return html`
          <div class="item small">
            ${this._avatar(p)}
            <span class="txt"><b>${e.reason}</b><small>${p?.name || 'Someone'} · ${new Date(e.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</small></span>
            <span class="score ${e.points < 0 ? 'neg' : ''}">${e.points > 0 ? '+' : ''}${e.points}</span>
          </div>`; })}</div>` : html`<p class="muted">Points appear here once chores are approved.</p>`}`;
  }

  // -- Settings --

  _settings() {
    const a = this._actor;
    return html`
      ${a ? html`
        <h3>Your PIN</h3>
        <div class="card">
          <div class="item">
            ${this._avatar(a, 'lg')}
            <span class="txt"><b>${a.has_pin ? 'PIN is on' : 'No PIN yet'}</b>
              <small>${a.has_pin ? `Needed to use ${a.name}'s profile on a shared login.` : `Set 4 digits so ${a.name} can sign in on any device.`}</small></span>
            <button class="mini ok" @click=${() => this._startPin()}>${a.has_pin ? 'Change' : 'Set PIN'}</button>
            ${a.has_pin ? html`<button class="mini" aria-label="Remove PIN" @click=${() => this._savePin(true)}><ha-icon icon="mdi:close"></ha-icon></button>` : nothing}
          </div>
        </div>
        <p class="muted">On a child's own device: tap your name at the top, pick yourself and type your PIN, then tick off your chores and routines.
          An adult can set or reset a child's PIN under <i>Manage people</i>.</p>` : html`
        <p class="muted">${this._canSwitch ? 'Tap the name at the top to say who is using this device.' : 'You are signed in as yourself, so chores are always done as you.'}</p>`}

      ${this._celebrationSection()}

      <h3>People</h3>
      <div class="card">
        ${this._people.map(p => html`<div class="item small">${this._avatar(p)}<span class="txt"><b>${p.name}</b><small>${{ adult: 'Adult', child: 'Child', guest: 'Guest' }[p.role]}${p.user_id ? '' : ' · no Home Assistant login'}${p.has_pin ? ' · PIN' : ''}</small></span></div>`)}
        ${this._isAdult ? html`<button class="item btn" @click=${() => this.dispatchEvent(new CustomEvent('hub-sheet', { detail: { sheet: 'people' }, bubbles: true, composed: true }))}>
          <span class="emoji"><ha-icon icon="mdi:account-multiple-plus-outline"></ha-icon></span>
          <span class="txt"><b>Manage people & guests</b><small>Add children and guests without a login, set roles and PINs</small></span>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>` : nothing}
      </div>

      <h3>How it works</h3>
      <div class="card info">
        <p><b>Children</b> mark a chore done and an adult approves it. Points are paid once, when it is approved.</p>
        <p><b>Adults</b> can do a chore themselves, and it counts straight away.</p>
        <p><b>Late</b> means an earlier day that was not finished, or today after the due time. A chore is never late before its starting day.</p>
        <p><b>Reminders</b> go out at a chore's own due time. Set a phone to notify under <i>Manage people</i>, otherwise the reminder shows in Home Assistant's notifications.</p>
        <p><b>Routines</b> are step by step, each step on the days you choose, and pay into the same points once the last step of the day is done.</p>
      </div>`;
  }

  // ---- sheets ----------------------------------------------------------------------

  _renderSheet() {
    const t = this._sheet.type;
    return html`
      <div class="scrim" @click=${() => this._closeSheet()}></div>
      <section class="sheet" role="dialog" aria-label=${t}>
        <div class="grabber"></div>
        ${t === 'switch' ? this._switchSheet() : nothing}
        ${t === 'pin' ? this._pinSheet() : nothing}
        ${t === 'setpin' ? this._setPinSheet() : nothing}
        ${t === 'pick' ? this._pickSheet() : nothing}
        ${t === 'chore' ? this._choreSheet() : nothing}
        ${t === 'routine-pick' ? this._routinePick() : nothing}
        ${t === 'routine' ? this._routineSheet() : nothing}
        ${t === 'run' ? this._runSheet() : nothing}
        ${t === 'celebrate' ? this._celebrate() : nothing}
        ${t === 'adjust' ? this._adjustSheet() : nothing}
        ${t === 'reward-pick' ? this._rewardPick() : nothing}
        ${t === 'reward' ? this._rewardSheet() : nothing}
        ${t === 'pocket' ? this._pocketSheet() : nothing}
      </section>`;
  }

  _title(text, back) {
    return html`<div class="head2">${back ? html`<button class="back" aria-label="Back" @click=${back}><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : nothing}<h2>${text}</h2></div>`;
  }

  _switchSheet() {
    return html`${this._title('Who is this?')}
      ${this._people.map(p => this._personRow(p, () => this._switchTo(p),
        p.id === this._acting ? html`<ha-icon class="chev" icon="mdi:check-circle"></ha-icon>` : nothing))}`;
  }

  _pinSheet() {
    const p = this._sheet.person;
    return html`${this._title(`${p.name}'s PIN`, this._sheet.stay ? null : () => { this._sheet = { type: 'switch' }; })}
      <form class="form" @submit=${e => { e.preventDefault(); this._checkPin(); }}>
        <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
          .value=${this._pin} @input=${e => { this._pin = e.target.value.replace(/\D/g, ''); }}>
        <button class="primary" type="submit" ?disabled=${this._pin.length !== 4}>Continue</button>
      </form>`;
  }

  _setPinSheet() {
    return html`${this._title(this._actor?.has_pin ? 'Change your PIN' : 'Set your PIN')}
      <form class="form" @submit=${e => { e.preventDefault(); this._savePin(); }}>
        <label>New PIN (4 digits)
          <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
            .value=${this._pin} @input=${e => { this._pin = e.target.value.replace(/\D/g, ''); }}></label>
        <label>Type it again
          <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••"
            .value=${this._pin2} @input=${e => { this._pin2 = e.target.value.replace(/\D/g, ''); }}></label>
        <button class="primary" type="submit" ?disabled=${this._pin.length !== 4 || this._pin2.length !== 4}>Save PIN</button>
      </form>`;
  }

  _rewardPick() {
    const have = new Set((this._state.rewards || []).map(r => r.name.toLowerCase()));
    return html`${this._title('Add a reward')}
      <button class="row" @click=${() => this._newReward(null)}>
        <span class="ico">✏️</span><span class="txt"><b>Create your own</b><small>Name it, pick an emoji and the points it costs</small></span><ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>
      <h3>Standard rewards</h3>
      ${REWARD_TEMPLATES.map(t => {
        const added = have.has(t.name.toLowerCase());
        return html`
          <button class="row" ?disabled=${added} @click=${() => this._call('rewards/add', { name: t.name, emoji: t.emoji, cost: t.cost })}>
            <span class="ico">${t.emoji}</span><span class="txt"><b>${t.name}</b><small>${t.cost} ★</small></span>
            ${added ? html`<ha-icon class="chev" icon="mdi:check-circle"></ha-icon>` : html`<ha-icon class="chev" icon="mdi:plus-circle-outline"></ha-icon>`}
          </button>`; })}
      <p class="muted">Tap one to add it. You can change what it costs afterwards.</p>`;
  }

  _rewardSheet() {
    const d = this._draft;
    const editing = !!this._sheet.id;
    return html`${this._title(editing ? 'Edit reward' : 'New reward', !editing ? () => { this._sheet = { type: 'reward-pick' }; } : null)}
      <div class="form">
        <label>Name<input .value=${d.name} maxlength="60" placeholder="e.g. Ice cream treat" @input=${e => this._set('name', e.target.value)}></label>
        <label>Emoji</label>${this._emojiPicker(d.emoji, v => this._set('emoji', v))}
        <label>Costs
          <span class="stepper">
            <button type="button" @click=${() => this._set('cost', Math.max(1, (Number(d.cost) || 0) - 5))}>−</button>
            <input type="number" min="1" .value=${String(d.cost)} @input=${e => this._set('cost', e.target.value)}>
            <button type="button" @click=${() => this._set('cost', (Number(d.cost) || 0) + 5)}>+</button>
            <span class="muted">★ points</span>
          </span></label>
        ${this._switchRow('Available to ask for', d.active, v => this._set('active', v))}
        <div class="actions">
          ${editing ? html`<button class="danger" @click=${() => this._deleteReward()}>Remove</button>` : nothing}
          <button class="primary grow" @click=${() => this._saveReward()}>Save reward</button>
        </div>
      </div>`;
  }

  _pocketSheet() {
    const d = this._draft;
    const p = this._sheet.person;
    return html`${this._title(`Pocket money for ${p.name}`)}
      <div class="form">
        ${this._switchRow('Pay pocket money', d.enabled, v => this._set('enabled', v))}
        <label>Paid every</label>
        <div class="seg">${[['week', 'Week'], ['month', 'Month']].map(([v, l]) => html`<button type="button" class="${d.period === v ? 'on' : ''}" @click=${() => this._set('period', v)}>${l}</button>`)}</div>
        <label>Points they need to earn each ${d.period}
          <span class="stepper">
            <button type="button" @click=${() => this._set('points', Math.max(1, (Number(d.points) || 0) - 5))}>−</button>
            <input type="number" min="1" .value=${String(d.points)} @input=${e => this._set('points', e.target.value)}>
            <button type="button" @click=${() => this._set('points', (Number(d.points) || 0) + 5)}>+</button>
            <span class="muted">★</span>
          </span></label>
        <label>Pocket money amount<input inputmode="decimal" .value=${d.amount} placeholder="5.00" @input=${e => this._set('amount', e.target.value)}></label>
        <label>Pay it into</label>
        <div class="seg">${[['cash', '💵 Cash'], ['bank', '🏦 Bank']].map(([v, l]) => html`<button type="button" class="${d.account === v ? 'on' : ''}" @click=${() => this._set('account', v)}>${l}</button>`)}</div>
        <small class="hint">It starts with the next full ${d.period}, so nothing is paid for the days already gone.
          Chores and routines count; bonuses do not.${this.modules?.finance ? '' : ' The Finance part is off, so it is paid once you switch it on.'}</small>
        <div class="actions"><button class="primary grow" @click=${() => this._savePocket()}>Save</button></div>
      </div>`;
  }

  _pickSheet() {
    const q = this._search.trim().toLowerCase();
    const groups = {};
    for (const t of CHORE_TEMPLATES) if (!q || t.name.toLowerCase().includes(q)) (groups[t.group] ||= []).push(t);
    return html`${this._title('Add a chore')}
      <button class="row" @click=${() => this._newChoreFrom(null)}>
        <span class="ico">✏️</span><span class="txt"><b>Create your own</b><small>Name it, pick an emoji and points</small></span><ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </button>
      <h3>Standard chores</h3>
      <input class="search" placeholder="Search chores" .value=${this._search} @input=${e => { this._search = e.target.value; }}>
      ${Object.entries(groups).map(([g, list]) => html`
        <h4>${g}</h4>
        <div class="tiles">${list.map(t => html`
          <button class="tile" @click=${() => this._newChoreFrom(t)}><span>${t.emoji}</span><b>${t.name}</b><small>${t.points} ★</small></button>`)}</div>`)}
      ${!Object.keys(groups).length ? html`<p class="muted">Nothing matches. Create your own instead.</p>` : nothing}`;
  }

  _chips(selected, onToggle, anyone) {
    return html`<div class="chips">
      <button class="chip ${!selected.length ? 'on' : ''}" @click=${anyone}>Anyone</button>
      ${this._people.map(p => html`<button class="chip ${selected.includes(p.id) ? 'on' : ''}" @click=${() => onToggle(p.id)}>${p.emoji} ${p.name}</button>`)}
    </div>`;
  }

  _emojiPicker(value, onPick) {
    return html`
      <div class="emoji-row">
        <input class="emoji-input" maxlength="8" .value=${value} @input=${e => onPick(e.target.value)} aria-label="Emoji">
        <div class="emoji-list">${EMOJIS.map(e => html`<button type="button" class="${e === value ? 'on' : ''}" @click=${() => onPick(e)}>${e}</button>`)}</div>
      </div>`;
  }

  _choreSheet() {
    const d = this._draft;
    const rec = d.recurrence;
    const editing = !!this._sheet.id;
    return html`${this._title(editing ? 'Edit chore' : 'New chore', !editing ? () => { this._sheet = { type: 'pick' }; } : null)}
      <div class="form">
        <label>Name<input .value=${d.name} maxlength="80" placeholder="e.g. Feed the dog" @input=${e => this._set('name', e.target.value)}></label>
        <label>Emoji</label>${this._emojiPicker(d.emoji, v => this._set('emoji', v))}
        <div class="two">
          <label>Points
            <span class="stepper">
              <button type="button" @click=${() => this._set('points', Math.max(0, (Number(d.points) || 0) - 1))}>−</button>
              <input type="number" min="0" max="1000" .value=${String(d.points)} @input=${e => this._set('points', e.target.value)}>
              <button type="button" @click=${() => this._set('points', (Number(d.points) || 0) + 1)}>+</button>
            </span>
          </label>
        </div>

        <label>Who does it</label>
        ${this._chips(d.assignees, id => this._toggleAssignee(id), () => this._set('assignees', []))}
        <small class="hint">${d.assignees.length ? 'Only these people can do it.' : 'Anyone in the family can do it.'}</small>

        <label>${rec.type === 'once' ? 'Date' : 'Starts on'}
          <input type="date" .value=${d.start || todayIso()} @input=${e => this._set('start', e.target.value)}></label>
        <small class="hint">${rec.type === 'once' ? 'It only happens on this day.'
          : (d.start || todayIso()) > todayIso() ? 'It does not show up, or count as late, before this day.' : 'The first day it is due.'}</small>

        <label>Repeats</label>
        <div class="seg">${[['daily', 'Daily'], ['weekly', 'Weekly'], ['custom', 'Custom'], ['once', 'Once']].map(([v, l]) => html`
          <button type="button" class="${rec.type === v ? 'on' : ''}" @click=${() => this._setRecType(v)}>${l}</button>`)}</div>
        ${rec.type === 'weekly' || (rec.type === 'custom' && rec.unit === 'week') ? html`
          <div class="chips">${DAY_NAMES.map((n, i) => html`<button type="button" class="chip ${(rec.days || []).includes(i) ? 'on' : ''}" @click=${() => this._toggleDay(i)}>${n}</button>`)}</div>` : nothing}
        ${rec.type === 'custom' ? html`
          <div class="every">Every
            <input type="number" min="1" max="365" .value=${String(rec.every || 1)} @input=${e => this._setRec({ every: Number(e.target.value) || 1 })}>
            <select @change=${e => this._setRec({ unit: e.target.value })}>
              ${[['day', 'days'], ['week', 'weeks'], ['month', 'months']].map(([v, l]) => html`<option value=${v} ?selected=${rec.unit === v}>${l}</option>`)}
            </select>
          </div>
          <small class="hint">Counting from ${d.start || 'today'}.</small>` : nothing}

        <label>Due time <small class="hint inl">(optional)</small></label>
        <div class="time">
          <input type="time" .value=${d.due_time} @input=${e => this._set('due_time', e.target.value)}>
          ${d.due_time ? html`<button type="button" class="link" @click=${() => this._set('due_time', '')}>Clear</button>` : nothing}
        </div>
        ${d.due_time ? this._switchRow('Remind at this time', d.remind, v => this._set('remind', v)) : nothing}
        ${this._switchRow('An adult approves it before points are paid', d.requires_approval, v => this._set('requires_approval', v))}

        <div class="actions">
          ${editing ? html`<button class="danger" @click=${() => this._deleteChore()}>Delete</button>` : nothing}
          <button class="primary grow" @click=${() => this._saveChore()}>Save chore</button>
        </div>
      </div>`;
  }

  _switchRow(label, on, set) {
    return html`<button type="button" class="switchrow" role="switch" aria-checked=${on ? 'true' : 'false'} @click=${() => set(!on)}>
      <span>${label}</span><span class="switch ${on ? 'on' : ''}"><i></i></span></button>`;
  }

  _routinePick() {
    return html`${this._title('Add a routine')}
      ${ROUTINE_TEMPLATES.map(t => html`
        <button class="row" @click=${() => this._newRoutineFrom(t)}>
          <span class="ico">${t.emoji}</span><span class="txt"><b>${t.name}</b><small>${t.steps.length} steps · ${t.steps.map(s => s.emoji).join(' ')}</small></span>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>`)}
      <button class="row" @click=${() => this._newRoutineFrom(null)}>
        <span class="ico">✏️</span><span class="txt"><b>Create your own</b><small>Your own steps</small></span><ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>`;
  }

  _routineSheet() {
    const d = this._draft;
    const editing = !!this._sheet.id;
    return html`${this._title(editing ? 'Edit routine' : 'New routine', !editing ? () => { this._sheet = { type: 'routine-pick' }; } : null)}
      <div class="form">
        <label>Name<input .value=${d.name} maxlength="60" @input=${e => this._set('name', e.target.value)}></label>
        <label>Emoji</label>${this._emojiPicker(d.emoji, v => this._set('emoji', v))}
        <label>Kind</label>
        <div class="seg">${[['morning', 'Morning'], ['evening', 'Evening'], ['custom', 'Other']].map(([v, l]) => html`
          <button type="button" class="${d.kind === v ? 'on' : ''}" @click=${() => this._set('kind', v)}>${l}</button>`)}</div>
        <label>Points when finished
          <span class="stepper">
            <button type="button" @click=${() => this._set('points', Math.max(0, (Number(d.points) || 0) - 1))}>−</button>
            <input type="number" min="0" .value=${String(d.points)} @input=${e => this._set('points', e.target.value)}>
            <button type="button" @click=${() => this._set('points', (Number(d.points) || 0) + 1)}>+</button>
          </span></label>
        <label>Who does it</label>
        ${this._chips(d.assignees, id => this._set('assignees', d.assignees.includes(id) ? d.assignees.filter(x => x !== id) : [...d.assignees, id]), () => this._set('assignees', []))}
        <label>Steps</label>
        <small class="hint">Each step can be for certain days, like packing the school bag on school days only.</small>
        ${d.steps.map((s, i) => html`
          <div class="stepwrap">
          <div class="step">
            <input class="se" maxlength="8" .value=${s.emoji || ''} placeholder="🙂" @input=${e => this._setStep(i, { emoji: e.target.value })} aria-label="Step emoji">
            <input class="st" maxlength="60" .value=${s.text} placeholder="Step ${i + 1}" @input=${e => this._setStep(i, { text: e.target.value })}>
            <button type="button" class="mini" @click=${() => this._moveStep(i, -1)} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button type="button" class="mini" @click=${() => this._moveStep(i, 1)} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button>
            <button type="button" class="mini" @click=${() => this._set('steps', d.steps.filter((_, n) => n !== i))} aria-label="Remove step"><ha-icon icon="mdi:close"></ha-icon></button>
          </div>
          ${this._stepDays(s, i)}
          </div>`)}
        <button type="button" class="link" @click=${() => this._set('steps', [...d.steps, { text: '', emoji: '', days: [] }])}><ha-icon icon="mdi:plus"></ha-icon>Add a step</button>
        <div class="actions">
          ${editing ? html`<button class="danger" @click=${() => this._deleteRoutine()}>Delete</button>` : nothing}
          <button class="primary grow" @click=${() => this._saveRoutine()}>Save routine</button>
        </div>
      </div>`;
  }

  _daysLabel(days = []) {
    if (!days.length) return 'Every day';
    if (sameDays(days, WEEKDAYS)) return 'Weekdays';
    if (sameDays(days, WEEKENDS)) return 'Weekends';
    return days.map(x => DAY_NAMES[x]).join(', ');
  }

  _stepDays(s, i) {
    const days = s.days || [];
    const open = this._openStep === i;
    const set = d => this._setStep(i, { days: d });
    return html`
      <div class="stepdays">
        <button type="button" class="daybtn ${days.length ? 'some' : ''}" @click=${() => { this._openStep = open ? null : i; this.requestUpdate(); }}
          aria-expanded=${open ? 'true' : 'false'}><ha-icon icon="mdi:calendar-week"></ha-icon>${this._daysLabel(days)}<ha-icon icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon></button>
        ${open ? html`
          <div class="chips">
            <button type="button" class="chip ${!days.length ? 'on' : ''}" @click=${() => set([])}>Every day</button>
            <button type="button" class="chip ${sameDays(days, WEEKDAYS) ? 'on' : ''}" @click=${() => set([...WEEKDAYS])}>Weekdays</button>
            <button type="button" class="chip ${sameDays(days, WEEKENDS) ? 'on' : ''}" @click=${() => set([...WEEKENDS])}>Weekends</button>
          </div>
          <div class="chips">${DAY_NAMES.map((n, d) => html`
            <button type="button" class="chip ${days.includes(d) ? 'on' : ''}"
              @click=${() => set(days.includes(d) ? days.filter(x => x !== d) : [...days, d].sort())}>${n}</button>`)}</div>` : nothing}
      </div>`;
  }

  _runSheet() {
    const r = this._state.routines.find(x => x.id === this._sheet.id);
    if (!r) return nothing;
    const run = this._run(r.id);
    const steps = this._stepsToday(r);
    const next = steps.find(st => !run.steps.includes(st.id));
    const done = steps.filter(st => run.steps.includes(st.id)).length;
    return html`${this._title(`${r.emoji} ${r.name}`)}
      <div class="bar"><i style="width:${steps.length ? (done / steps.length) * 100 : 0}%"></i></div>
      ${next ? html`
        <div class="focus">
          <div class="fe">${next.emoji || '👉'}</div>
          <div class="ft">${next.text}</div>
          <button class="primary huge" @click=${() => this._toggleStep(r, next.id, true)}><ha-icon icon="mdi:check"></ha-icon>Done</button>
        </div>` : html`<div class="focus"><div class="fe">🎉</div><div class="ft">All steps done!</div></div>`}
      <h4>Today's steps</h4>
      ${steps.map(st => html`
        <button class="step-row ${run.steps.includes(st.id) ? 'done' : ''}" @click=${() => this._toggleStep(r, st.id, !run.steps.includes(st.id))}>
          <ha-icon icon=${run.steps.includes(st.id) ? 'mdi:check-circle' : 'mdi:circle-outline'}></ha-icon>
          <span>${st.emoji} ${st.text}</span>
        </button>`)}`;
  }

  _celebrate() {
    const r = this._sheet.routine;
    return html`
      <div class="celebrate">
        <div class="fe">🎉</div>
        <h2>${r.name} done!</h2>
        <p class="score big">+${r.points} ★</p>
        <button class="primary" @click=${() => this._closeSheet()}>Great</button>
      </div>`;
  }

  _adjustSheet() {
    const p = this._sheet.person;
    return html`${this._title(`Points for ${p.name}`)}
      <div class="form">
        <p class="muted">Add points as a reward bonus, or take some away when they are spent. Use a minus sign to take points away.</p>
        <label>Points<input type="number" placeholder="e.g. 5 or -10" .value=${String(this._draft.points)} @input=${e => { this._draft = { ...this._draft, points: e.target.value }; }}></label>
        <label>Reason<input maxlength="60" placeholder="e.g. Ice cream" .value=${this._draft.reason} @input=${e => { this._draft = { ...this._draft, reason: e.target.value }; }}></label>
        <div class="actions"><button class="primary grow" @click=${() => this._adjust()}>Save</button></div>
      </div>`;
  }

  static styles = css`
    :host { display: block; position: relative; overflow: hidden; color: var(--hub-text); }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    button { cursor: pointer; }
    button[disabled] { cursor: default; opacity: .55; }
    .scroll { height: 100%; overflow-y: auto; }
    .page { max-width: 820px; margin: 0 auto; padding: 6px 16px 28px; }
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border); border-top-color: #3db6cc; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .muted { color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; margin: 6px 2px; }
    h2.big { margin: 20px 0 4px; }
    h3 { margin: 18px 4px 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); display: flex; align-items: center; gap: 8px; }
    h3.inline { margin: 0; }
    h4 { margin: 14px 4px 6px; font-size: 13px; color: var(--hub-muted); }
    .count { background: #3db6cc; color: #06222a; border-radius: 999px; padding: 1px 8px; font-size: 11px; }
    .date { margin: 6px 4px 2px; color: var(--hub-muted); font-size: 14px; }

    .who { display: flex; align-items: center; gap: 10px; margin: 6px 0 4px; }
    .chip-person { display: flex; align-items: center; gap: 10px; background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 999px; padding: 5px 16px 5px 6px; text-align: left; }
    .chip-person span:last-child { display: flex; flex-direction: column; line-height: 1.2; }
    .chip-person small, .txt small { color: var(--hub-muted); font-size: 12.5px; }
    .badge { margin-left: auto; background: #f59a4d; color: #2a1503; border-radius: 999px; padding: 4px 12px; font-size: 12.5px; font-weight: 800; }
    .avatar { width: 38px; height: 38px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center; font-size: 20px;
      background: color-mix(in srgb, var(--c) 28%, transparent); border: 2px solid var(--c); }
    .avatar.lg { width: 46px; height: 46px; font-size: 24px; }

    .chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 8px 0; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    .card { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; overflow: hidden; }
    .card.info { padding: 6px 16px; }
    .card.info p { margin: 10px 0; font-size: 14px; line-height: 1.45; }
    .item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--hub-border); width: 100%; background: none; border-left: none; border-right: none; border-top: none; text-align: left; }
    .item:last-child { border-bottom: none; }
    .item.small { padding: 9px 14px; }
    .item.btn:hover:not([disabled]) { background: var(--hub-surface-2); }
    .item.done .txt b, .item.approved .txt b { text-decoration: line-through; opacity: .65; }
    .emoji { font-size: 28px; width: 42px; height: 42px; display: inline-flex; align-items: center; justify-content: center; border-radius: 14px; background: var(--hub-surface-2); flex: none; }
    .emoji.big { width: 50px; height: 50px; font-size: 32px; }
    .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .txt b { font-size: 15.5px; font-weight: 700; }
    .late { color: #e8685a; }
    .pts, .score { font-weight: 800; color: #e2ac3f; white-space: nowrap; }
    .score.neg { color: #e8685a; }
    .score.big { font-size: 32px; margin: 4px 0 12px; }
    .check { width: 44px; height: 44px; border-radius: 50%; flex: none; border: 2px solid var(--hub-muted); background: transparent; color: var(--hub-muted); display: flex; align-items: center; justify-content: center; --mdc-icon-size: 24px; }
    .check:hover:not([disabled]) { background: #3db6cc; border-color: #3db6cc; color: #06222a; }
    .pill { border: 1px solid var(--hub-border); background: var(--hub-surface-2); color: var(--hub-muted); border-radius: 999px; padding: 6px 12px; font-size: 12.5px; font-weight: 800; white-space: nowrap; }
    .pill.wait { color: #f59a4d; border-color: rgba(245,154,77,.5); }
    .pill.okp { color: #4fd1a1; border-color: rgba(79,209,161,.5); }
    .mini { display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--hub-border); background: var(--hub-surface-2); border-radius: 999px; padding: 7px 12px; font-weight: 700; font-size: 13px; --mdc-icon-size: 18px; flex: none; }
    .mini.ok { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .chev { color: var(--hub-muted); --mdc-icon-size: 22px; flex: none; }
    .empty { text-align: center; padding: 26px 10px; color: var(--hub-muted); }
    .empty span { font-size: 44px; }
    .head { display: flex; align-items: center; justify-content: space-between; margin: 18px 0 8px; }
    .primary { border: none; background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 10px 18px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; justify-content: center; --mdc-icon-size: 20px; }
    .primary.huge { width: 100%; padding: 18px; font-size: 20px; border-radius: 22px; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 10px 18px; font-weight: 700; }
    .link { background: none; border: none; color: var(--hub-accent); font-weight: 700; display: inline-flex; align-items: center; gap: 4px; padding: 8px 4px; --mdc-icon-size: 18px; }

    .routine { margin-bottom: 12px; }
    .rhead { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px; background: none; border: none; text-align: left; }
    .bar { height: 6px; background: var(--hub-surface-2); border-radius: 3px; margin: 0 14px 10px; overflow: hidden; }
    .bar i { display: block; height: 100%; background: #3db6cc; transition: width .25s; }
    .routine.finished .bar i { background: #4fd1a1; }
    .routine .link { margin: 0 10px 8px; }

    .toast { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); background: var(--hub-sheet); color: var(--hub-text); border: 1px solid var(--hub-border);
      border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: 14px; box-shadow: var(--hub-shadow); z-index: 60; max-width: 92%; text-align: center; animation: pop .2s ease; }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, 10px); } }

    /* sheets */
    .scrim { position: absolute; inset: 0; background: rgba(4,12,20,.55); z-index: 40; animation: fade .18s ease; }
    .sheet { position: absolute; left: 0; right: 0; bottom: 0; z-index: 41; max-width: 600px; margin: 0 auto; max-height: 92%; overflow-y: auto; overscroll-behavior: contain;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px)); box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1); }
    @media (min-width: 700px) { .sheet { bottom: 12px; border-radius: 28px; } }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160,190,215,.55); margin: 2px auto 12px; }
    .head2 { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .head2 h2 { margin: 0; font-size: 18px; font-weight: 800; }
    .back { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-muted); display: flex; align-items: center; justify-content: center; }
    .row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 6px; background: none; border: none; border-radius: 16px; text-align: left; }
    .row:hover { background: var(--hub-surface-2); }
    .ico { width: 42px; height: 42px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; background: var(--hub-surface-2); font-size: 22px; flex: none; }
    .search, .form input:not([type=checkbox]), .form select, .every input, .every select {
      width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .search:focus, .form input:focus { border-color: var(--hub-accent); }
    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(108px, 1fr)); gap: 8px; }
    .tile { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 12px 6px; border: 1px solid var(--hub-border); background: var(--hub-surface); border-radius: 16px; text-align: center; }
    .tile:hover { border-color: var(--hub-accent); }
    .tile span { font-size: 30px; }
    .tile b { font-size: 13px; line-height: 1.2; }
    .tile small { color: #e2ac3f; font-weight: 700; }
    .form { display: grid; gap: 8px; }
    .form label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 6px; }
    .hint { color: var(--hub-muted); font-size: 12.5px; font-weight: 500; }
    .hint.inl { margin-left: 4px; }
    .two { display: grid; gap: 8px; }
    .stepper { display: flex; align-items: center; gap: 8px; }
    .stepper input { text-align: center; width: 90px !important; }
    .stepper button { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface-2); font-size: 20px; font-weight: 800; }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .every { display: flex; align-items: center; gap: 8px; font-weight: 700; }
    .every input { width: 80px; } .every select { width: auto; }
    .time { display: flex; align-items: center; gap: 10px; }
    .time input { width: auto !important; }
    .switchrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 4px; background: none; border: none; text-align: left; font-weight: 600; font-size: 14px; }
    .switch { width: 46px; height: 28px; border-radius: 999px; background: rgba(150,170,190,.35); display: flex; align-items: center; padding: 3px; flex: none; transition: background .15s; }
    .switch i { width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: transform .15s; }
    .switch.on { background: var(--hub-accent); } .switch.on i { transform: translateX(18px); }
    .actions { display: flex; gap: 10px; margin-top: 10px; } .grow { flex: 1; }
    .emoji-row { display: grid; gap: 8px; }
    .emoji-input { width: 80px !important; text-align: center; font-size: 22px !important; }
    .emoji-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .emoji-list button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); }
    .emoji-list button.on { border-color: var(--hub-accent); }
    .step { display: flex; gap: 6px; align-items: center; }
    .step .se { width: 52px !important; text-align: center; padding: 11px 4px !important; }
    .step .st { flex: 1; min-width: 0; }
    .cels { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; padding: 12px; }
    .cel { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 8px; border-radius: 16px; text-align: center;
      border: 2px solid var(--hub-border); background: var(--hub-surface-2); }
    .cel.sel { border-color: var(--hub-accent); }
    .cel .ce { font-size: 34px; line-height: 1.1; } .cel b { font-size: 14px; } .cel small { color: var(--hub-muted); font-size: 12px; line-height: 1.25; }
    .pad { padding: 12px 16px; }
    .rewards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
    .reward { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 10px 12px; text-align: center;
      background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 18px; }
    .reward .re { font-size: 34px; line-height: 1.1; } .reward b { font-size: 14px; line-height: 1.2; }
    .reward .cost { color: #e2ac3f; font-weight: 800; }
    .reward.locked { opacity: .8; }
    .redit { position: absolute; top: 6px; right: 6px; width: 30px; height: 30px; border-radius: 50%; border: none; background: transparent; color: var(--hub-muted); --mdc-icon-size: 18px; display: flex; align-items: center; justify-content: center; }
    .pk + .pk { border-top: 1px solid var(--hub-border); } .pk .item { border-bottom: none; } .pkbar { padding: 0 14px 12px; }
    .pkbar .bar, .card.pad .bar { margin: 0 0 6px; } .pocketnote { display: block; margin: 0; }
    .seg.tabs { margin: 10px 0 6px; } .seg.tabs button { padding: 10px 4px; }
    .lateh { color: #e8685a; } .count.late { background: #e8685a; color: #2a0a07; }
    .stepwrap { border: 1px solid var(--hub-border); border-radius: 16px; padding: 8px; display: grid; gap: 6px; background: var(--hub-surface-2); }
    .stepdays { padding: 0 2px; }
    .daybtn { display: inline-flex; align-items: center; gap: 6px; border: none; background: none; color: var(--hub-muted); font-weight: 700; font-size: 12.5px; padding: 4px 4px; --mdc-icon-size: 16px; }
    .daybtn.some { color: var(--hub-accent); }
    .pin { text-align: center; font-size: 28px !important; letter-spacing: .4em; }
    .focus { text-align: center; padding: 18px 0 8px; }
    .fe { font-size: 72px; line-height: 1.1; }
    .ft { font-size: 26px; font-weight: 800; margin: 8px 0 18px; }
    .step-row { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 6px; background: none; border: none; text-align: left; font-size: 15px; font-weight: 600; --mdc-icon-size: 24px; border-radius: 12px; }
    .step-row ha-icon { color: var(--hub-muted); }
    .step-row.done { opacity: .6; text-decoration: line-through; } .step-row.done ha-icon { color: #4fd1a1; }
    .celebrate { text-align: center; padding: 10px 0 6px; } .celebrate h2 { margin: 4px 0; }
  `;
}

customElements.define('ksh-chores-module', KshChoresModule);
