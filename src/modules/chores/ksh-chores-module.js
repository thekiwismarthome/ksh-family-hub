import { LitElement, html, css, nothing } from 'lit';
import { enableSwipeClose } from '../../hub/swipe.js';
import { getActing, setActing } from '../../hub/actor.js';
import { CHORE_TEMPLATES, ROUTINE_TEMPLATES, EMOJIS, DAY_NAMES } from './templates.js';

const ACCENT = '#3db6cc';

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const blankChore = () => ({
  name: '', emoji: '✅', points: 1, assignees: [], recurrence: { type: 'daily' },
  due_time: '', remind: true, requires_approval: true, notes: '',
});

const blankRoutine = () => ({ name: '', emoji: '☀️', kind: 'custom', points: 3, assignees: [], steps: [{ text: '', emoji: '' }] });

/** Chores, routines and points. Used inside the hub shell only. */
class KshChoresModule extends LitElement {
  static properties = {
    hass: { type: Object },
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
    this._initDone = false;
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
    } catch (err) {
      this._loaded = true;
      this._say(err?.message || 'Could not load chores');
    }
  }

  _resolveActing() {
    const admin = !!this.hass.user?.is_admin;
    const stored = getActing(this.hass);
    const ok = id => id && this._people.some(p => p.id === id);
    if (!admin && this._me) this._acting = this._me;
    else if (ok(stored)) this._acting = stored;
    else this._acting = this._me || null;
  }

  get _actor() { return this._people.find(p => p.id === this._acting) || null; }
  get _role() { return this._actor?.role || (this.hass?.user?.is_admin ? 'adult' : null); }
  get _isAdult() { return this._role === 'adult'; }
  get _canSwitch() { return !!this.hass?.user?.is_admin || !this._me; }
  _person(id) { return this._people.find(p => p.id === id); }
  _chore(id) { return this._state?.chores.find(c => c.id === id); }

  async _call(type, extra = {}) {
    const msg = { type: `ksh_chores/${type}`, ...extra };
    if (this._acting) msg.as_person = this._acting;
    try {
      const res = await this.hass.callWS(msg);
      return res;
    } catch (err) {
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

  _overdue(chore, item) {
    if (!chore.due_time || this._state?.date !== todayIso() || !['open', 'rejected'].includes(item.status)) return false;
    const now = new Date();
    return chore.due_time < `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  // ---- actions ------------------------------------------------------------------------

  async _complete(item) {
    const chore = this._chore(item.chore_id);
    const res = await this._call('complete', { chore_id: item.chore_id, date: item.date });
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
    } : {}) };
    this._sheet = { type: 'chore' };
  }

  _editChore(chore) {
    this._draft = { ...blankChore(), ...JSON.parse(JSON.stringify(chore)), due_time: chore.due_time || '' };
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
    if (type === 'daily') this._draft = { ...this._draft, recurrence: { type } };
    else if (type === 'weekly') this._draft = { ...this._draft, recurrence: { type, ...keep } };
    else this._draft = { ...this._draft, recurrence: { type: 'custom', every: this._draft.recurrence.every || 2, unit: this._draft.recurrence.unit || 'day', start: this._draft.recurrence.start || todayIso(), ...keep } };
  }

  async _saveChore() {
    const d = this._draft;
    if (!d.name.trim()) { this._say('Give the chore a name'); return; }
    const rec = { ...d.recurrence };
    if (rec.type === 'weekly' && !(rec.days || []).length) rec.days = [((new Date().getDay() + 6) % 7)];
    if (rec.type === 'custom' && rec.unit === 'week' && !(rec.days || []).length) rec.days = [((new Date().getDay() + 6) % 7)];
    const fields = {
      name: d.name.trim(), emoji: d.emoji, points: Number(d.points) || 0, assignees: d.assignees, recurrence: rec,
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
    const steps = d.steps.filter(s => s.text.trim());
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
    if (res?.awarded) { this._sheet = { type: 'celebrate', routine }; }
  }

  // ---- people ----------------------------------------------------------------------

  async _switchTo(person) {
    if (person.has_pin) { this._sheet = { type: 'pin', person }; this._pin = ''; return; }
    this._applySwitch(person);
  }

  _applySwitch(person) {
    setActing(this.hass, person.id);
    this._acting = person.id;
    this._closeSheet();
    this._filter = 'all';
  }

  async _checkPin() {
    const person = this._sheet.person;
    try {
      const res = await this.hass.callWS({ type: 'ksh_family_hub/people/verify_pin', person_id: person.id, pin: this._pin });
      if (res.ok) this._applySwitch(person);
      else { this._pin = ''; this._say('Wrong PIN'); }
    } catch (err) { this._say(err?.message || 'Could not check the PIN'); }
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

  _today() {
    const s = this._state;
    const items = s.items.map(i => ({ ...i, chore: this._chore(i.chore_id) })).filter(i => i.chore && this._visible(i.chore));
    const todo = items.filter(i => ['open', 'rejected'].includes(i.status));
    const done = items.filter(i => ['done', 'approved'].includes(i.status));
    const waiting = this._isAdult ? s.pending.map(p => ({ ...p, chore: this._chore(p.chore_id) })).filter(p => p.chore) : [];
    const date = new Date().toLocaleDateString(this.hass.locale?.language || undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    return html`
      <p class="date">${date}</p>
      ${this._isAdult && this._people.length > 1 ? html`
        <div class="chips" role="radiogroup" aria-label="Show chores for">
          <button class="chip ${this._filter === 'all' ? 'on' : ''}" @click=${() => { this._filter = 'all'; }}>Everyone</button>
          ${this._people.map(p => html`<button class="chip ${this._filter === p.id ? 'on' : ''}" @click=${() => { this._filter = p.id; }}>${p.emoji} ${p.name}</button>`)}
        </div>` : nothing}

      ${waiting.length ? html`
        <h3>Waiting for approval</h3>
        <div class="card">${waiting.map(w => html`
          <div class="item">
            <span class="emoji">${w.chore.emoji}</span>
            <span class="txt"><b>${w.chore.name}</b><small>${this._person(w.done_by)?.name || 'Someone'} · ${w.date === s.today ? 'today' : w.date} · +${w.chore.points} ★</small></span>
            <button class="mini ok" @click=${() => this._approve(w)} aria-label="Approve"><ha-icon icon="mdi:check"></ha-icon>Approve</button>
            <button class="mini" @click=${() => this._reject(w)} aria-label="Send back"><ha-icon icon="mdi:undo"></ha-icon></button>
          </div>`)}</div>` : nothing}

      <h3>To do ${todo.length ? html`<span class="count">${todo.length}</span>` : nothing}</h3>
      ${todo.length ? html`<div class="card">${todo.map(i => this._item(i))}</div>`
        : html`<div class="empty"><span>🎉</span><p>${items.length ? 'All done for today!' : 'No chores today.'}</p></div>`}

      ${done.length ? html`<h3>Done</h3><div class="card">${done.map(i => this._item(i))}</div>` : nothing}`;
  }

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
            ${c.due_time ? html` · <span class=${overdue ? 'late' : ''}>${overdue ? 'Was due' : 'Due'} ${c.due_time}</span>` : nothing}
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

  _routines() {
    const all = this._state.routines;
    const mineOnly = r => this._isAdult || !(r.assignees || []).length ? (this._isAdult || this._role === 'child') : r.assignees.includes(this._acting);
    const list = all.filter(mineOnly);
    return html`
      <div class="head">
        <h3 class="inline">Routines</h3>
        ${this._isAdult ? html`<button class="primary" @click=${() => { this._sheet = { type: 'routine-pick' }; }}><ha-icon icon="mdi:plus"></ha-icon>Add routine</button>` : nothing}
      </div>
      ${list.length ? list.map(r => {
        const run = this._run(r.id);
        const done = run.steps.length;
        const can = this._isAdult || !(r.assignees || []).length ? true : r.assignees.includes(this._acting);
        const who = (r.assignees || []).map(id => this._person(id)).filter(Boolean);
        return html`
          <div class="card routine ${run.completed ? 'finished' : ''}">
            <button class="rhead" @click=${() => { this._sheet = { type: 'run', id: r.id }; }} ?disabled=${!can}>
              <span class="emoji big">${r.emoji}</span>
              <span class="txt"><b>${r.name}</b>
                <small>${r.steps.length} steps · +${r.points} ★ · ${who.length ? who.map(p => p.emoji + ' ' + p.name).join(', ') : 'Anyone'}</small></span>
              <span class="pill ${run.completed ? 'okp' : ''}">${run.completed ? '✓ Done' : done ? `${done}/${r.steps.length}` : 'Start'}</span>
            </button>
            <div class="bar"><i style="width:${(done / r.steps.length) * 100}%"></i></div>
            ${this._isAdult ? html`<button class="link" @click=${() => this._editRoutine(r)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit routine</button>` : nothing}
          </div>`; })
        : html`<div class="empty"><span>☀️</span><p>${this._isAdult ? 'No routines yet. Start from a morning or evening routine.' : 'No routines for you yet.'}</p></div>`}`;
  }

  // -- Points --

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
      <h3>Who is using this device</h3>
      <div class="card">
        ${a ? this._personRow(a, () => this._canSwitch && (this._sheet = { type: 'switch' }),
          this._canSwitch ? html`<span class="pill">Switch</span>` : nothing) : html`<div class="item"><span class="txt"><b>${this.hass.user?.name}</b><small>Administrator</small></span></div>`}
      </div>
      ${!this._canSwitch ? html`<p class="muted">You are signed in as yourself, so chores are always done as you.</p>` : html`
        <p class="muted">On a shared tablet, switch to whoever is using it. Adults can protect their profile with a PIN.</p>`}

      <h3>People</h3>
      <div class="card">
        ${this._people.map(p => html`<div class="item small">${this._avatar(p)}<span class="txt"><b>${p.name}</b><small>${{ adult: 'Adult', child: 'Child', guest: 'Guest' }[p.role]}${p.user_id ? '' : ' · no Home Assistant login'}</small></span></div>`)}
        ${this._isAdult ? html`<button class="item btn" @click=${() => this.dispatchEvent(new CustomEvent('hub-sheet', { detail: { sheet: 'people' }, bubbles: true, composed: true }))}>
          <span class="emoji"><ha-icon icon="mdi:account-multiple-plus-outline"></ha-icon></span>
          <span class="txt"><b>Manage people & guests</b><small>Add children and guests without a login, set roles</small></span>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>` : nothing}
      </div>

      <h3>How it works</h3>
      <div class="card info">
        <p><b>Children</b> mark a chore done and an adult approves it. Points are paid once, when it is approved.</p>
        <p><b>Adults</b> can do a chore themselves, and it counts straight away.</p>
        <p><b>Reminders</b> go out at a chore's own due time. Set a phone to notify under <i>Manage people</i>, otherwise the reminder shows in Home Assistant's notifications.</p>
        <p><b>Routines</b> are step by step and pay into the same points once the last step is done.</p>
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
        ${t === 'pick' ? this._pickSheet() : nothing}
        ${t === 'chore' ? this._choreSheet() : nothing}
        ${t === 'routine-pick' ? this._routinePick() : nothing}
        ${t === 'routine' ? this._routineSheet() : nothing}
        ${t === 'run' ? this._runSheet() : nothing}
        ${t === 'celebrate' ? this._celebrate() : nothing}
        ${t === 'adjust' ? this._adjustSheet() : nothing}
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
    return html`${this._title(`${p.name}'s PIN`, () => { this._sheet = { type: 'switch' }; })}
      <form class="form" @submit=${e => { e.preventDefault(); this._checkPin(); }}>
        <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
          .value=${this._pin} @input=${e => { this._pin = e.target.value.replace(/\D/g, ''); }}>
        <button class="primary" type="submit" ?disabled=${this._pin.length !== 4}>Continue</button>
      </form>`;
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

        <label>Repeats</label>
        <div class="seg">${[['daily', 'Daily'], ['weekly', 'Weekly'], ['custom', 'Custom']].map(([v, l]) => html`
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
          <small class="hint">Starting ${rec.start || 'today'}.</small>` : nothing}

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
        ${d.steps.map((s, i) => html`
          <div class="step">
            <input class="se" maxlength="8" .value=${s.emoji || ''} placeholder="🙂" @input=${e => this._setStep(i, { emoji: e.target.value })} aria-label="Step emoji">
            <input class="st" maxlength="60" .value=${s.text} placeholder="Step ${i + 1}" @input=${e => this._setStep(i, { text: e.target.value })}>
            <button type="button" class="mini" @click=${() => this._moveStep(i, -1)} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button type="button" class="mini" @click=${() => this._moveStep(i, 1)} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button>
            <button type="button" class="mini" @click=${() => this._set('steps', d.steps.filter((_, n) => n !== i))} aria-label="Remove step"><ha-icon icon="mdi:close"></ha-icon></button>
          </div>`)}
        <button type="button" class="link" @click=${() => this._set('steps', [...d.steps, { text: '', emoji: '' }])}><ha-icon icon="mdi:plus"></ha-icon>Add a step</button>
        <div class="actions">
          ${editing ? html`<button class="danger" @click=${() => this._deleteRoutine()}>Delete</button>` : nothing}
          <button class="primary grow" @click=${() => this._saveRoutine()}>Save routine</button>
        </div>
      </div>`;
  }

  _runSheet() {
    const r = this._state.routines.find(x => x.id === this._sheet.id);
    if (!r) return nothing;
    const run = this._run(r.id);
    const next = r.steps.find(s => !run.steps.includes(s.id));
    return html`${this._title(`${r.emoji} ${r.name}`)}
      <div class="bar"><i style="width:${(run.steps.length / r.steps.length) * 100}%"></i></div>
      ${next ? html`
        <div class="focus">
          <div class="fe">${next.emoji || '👉'}</div>
          <div class="ft">${next.text}</div>
          <button class="primary huge" @click=${() => this._toggleStep(r, next.id, true)}><ha-icon icon="mdi:check"></ha-icon>Done</button>
        </div>` : html`<div class="focus"><div class="fe">🎉</div><div class="ft">All steps done!</div></div>`}
      <h4>Steps</h4>
      ${r.steps.map(s => html`
        <button class="step-row ${run.steps.includes(s.id) ? 'done' : ''}" @click=${() => this._toggleStep(r, s.id, !run.steps.includes(s.id))}>
          <ha-icon icon=${run.steps.includes(s.id) ? 'mdi:check-circle' : 'mdi:circle-outline'}></ha-icon>
          <span>${s.emoji} ${s.text}</span>
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
