import { LitElement, html, css, nothing } from 'lit';
import { avatar, avatarCss, faceContent } from '../../hub/avatar.js';
import '../../hub/emoji-picker.js';
import { loadPeople } from '../../hub/people-api.js';
import { enableSwipeClose } from '../../hub/swipe.js';
import { resolveActing, actingMsg, setToken } from '../../hub/actor.js';
import { CATEGORIES, categoryById, EVENT_EMOJIS, REMIND_OPTIONS } from './categories.js';
import { loadEvents, iso, fromIso, addDays, mondayOf, timeLabel, pad } from './data.js';
import { celebrate } from '../../hub/celebrate.js';

const WIDE_MIN = 700;
const POS_KEY = 'ksh_calendar_card_pos';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const POSITIONS = [['right', 'Right'], ['left', 'Left'], ['bottom', 'Bottom'], ['top', 'Top']];

const CHORE_VIEWS_KEY = 'ksh_calendar_chore_views';
const VIEW_LABELS = [['day', 'Day'], ['week', 'Week'], ['agenda', 'Agenda'], ['month', 'Month']];
const readChoreViews = () => {
  try { const v = JSON.parse(localStorage.getItem(CHORE_VIEWS_KEY) || 'null'); if (Array.isArray(v)) return v; } catch { /* default */ }
  return ['day', 'week', 'agenda', 'month'];       // so every day with something on it shows it
};
const FACE_KEY = 'ksh_calendar_face_side';
const readFaceSide = () => { try { return localStorage.getItem(FACE_KEY) === 'right' ? 'right' : 'left'; } catch { return 'left'; } };
const readPos = () => { try { return localStorage.getItem(POS_KEY) || 'right'; } catch { return 'right'; } };
import { todayIso } from '../../hub/clock.js';

const blankEvent = (date, over = {}) => ({
  title: '', emoji: '📌', category: 'other', people: [], date, end_date: '', all_day: true, start_time: '09:00', end_time: '',
  repeat: { type: 'none' }, location: '', notes: '', remind: null, ...over,
});

/** The family calendar: month, week, day and agenda views of events, chores and Home Assistant calendars. */
class KshCalendarModule extends LitElement {
  static properties = {
    hass: { type: Object },
    modules: { type: Object },
    hubMode: { type: Boolean, attribute: 'hub-mode' },
    _view: { state: true },
    _cursor: { state: true },       // ISO day the views are centred on
    _sel: { state: true },          // ISO day selected in the month view
    _events: { state: true },
    _settings: { state: true },
    _people: { state: true },
    _me: { state: true },
    _acting: { state: true },
    _who: { state: true },
    _wide: { state: true },
    _pos: { state: true },
    _choreViews: { state: true },
    _faceSide: { state: true },
    _sheet: { state: true },
    _draft: { state: true },
    _toast: { state: true },
    _loaded: { state: true },
    _pin: { state: true },
  };

  constructor() {
    super();
    this._view = 'month';
    this._cursor = todayIso();
    this._sel = todayIso();
    this._events = [];
    this._settings = { ha_calendars: [], show_chores: true };
    this._people = [];
    this._me = null;
    this._acting = null;
    this._who = 'all';
    this._wide = false;
    this._pos = readPos();
    this._choreViews = readChoreViews();
    this._faceSide = readFaceSide();
    this._sheet = null;
    this._draft = null;
    this._toast = null;
    this._loaded = false;
    this._pin = '';
    this._initDone = false;
    this._key = '';
  }

  // ---- hub hooks -------------------------------------------------------------

  setHubView(view) {
    this._view = view;
    this._sheet = null;
    this.dispatchEvent(new CustomEvent('module-view-changed', { detail: { view }, bubbles: true, composed: true }));
    if (view !== 'settings') this._loadRange();
  }

  /** Quick add > Event, Reminders, Birthdays */
  openAdd(kind = 'event') {
    if (this._view === 'settings') this.setHubView('month');
    const date = this._view === 'month' ? this._sel : this._cursor;
    const preset = {
      event: {},
      reminders: { category: 'reminder', emoji: '🔔', all_day: false, start_time: `${pad(Math.min(new Date().getHours() + 1, 23))}:00`, remind: 0 },
      birthdays: { category: 'birthday', emoji: '🎂', all_day: true, repeat: { type: 'yearly' } },
    }[kind] || {};
    this._startEvent(blankEvent(date, preset));
  }

  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width ?? 0;
      if (w) this._wide = w >= WIDE_MIN;
    });
    this._ro.observe(this);
    this._vis = () => { if (!document.hidden && this._initDone) this._loadRange(true); };
    document.addEventListener('visibilitychange', this._vis);
    this._tick = setInterval(() => { if (this._today !== todayIso()) { this._today = todayIso(); this.requestUpdate(); } }, 60000);
    this._today = todayIso();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    clearInterval(this._tick);
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
    await this._loadPeople();
    await this._loadRange(true);
    this._loaded = true;
    try {
      this._unsub = await this.hass.connection.subscribeMessage(() => this._scheduleLoad(), { type: 'ksh_calendar/subscribe' });
    } catch { /* live updates are a bonus */ }
  }

  async _loadPeople() {
    try {
      const res = await loadPeople(this.hass);
      this._people = res.people;
      this._me = res.me;
      this._acting = resolveActing(this.hass, this._people, this._me);
    } catch { /* the calendar works without names */ }
  }

  _scheduleLoad() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this._loadRange(true), 250);
  }

  get _actor() { return this._people.find(p => p.id === this._acting) || null; }
  get _isAdult() { return this._actor ? this._actor.role === 'adult' : !!this.hass?.user?.is_admin; }
  _person(id) { return this._people.find(p => p.id === id); }

  /** The days the current view needs */
  _range() {
    const c = fromIso(this._cursor);
    if (this._view === 'week') { const m = mondayOf(c); return [iso(m), iso(addDays(m, 6))]; }
    if (this._view === 'day') return [this._cursor, this._cursor];
    if (this._view === 'agenda') return [todayIso(), iso(addDays(fromIso(todayIso()), 44))];
    const first = mondayOf(new Date(c.getFullYear(), c.getMonth(), 1));
    return [iso(first), iso(addDays(first, 41))];
  }

  async _loadRange(force = false) {
    if (this._view === 'settings' && !force) return;
    const [start, end] = this._range();
    const key = `${start}|${end}|${this._acting}`;
    if (!force && key === this._key) return;
    this._key = key;
    try {
      const res = await loadEvents(this.hass, start, end, { acting: this._actor, modules: this.modules, msg: actingMsg(this.hass, this._acting) });
      if (key !== this._key) return;                 // the view moved on while this was loading
      this._events = res.events;
      this._settings = res.settings;
    } catch (err) {
      this._say(err?.message || 'Could not load the calendar');
    }
    this._loaded = true;
  }

  async _call(type, extra = {}) {
    const msg = { type: `ksh_calendar/${type}`, ...extra, ...actingMsg(this.hass, this._acting) };
    try {
      return await this.hass.callWS(msg);
    } catch (err) {
      if (err?.code === 'pin_required' && this._actor?.has_pin) { this._sheet = { type: 'pin' }; this._pin = ''; }
      this._say(err?.message || 'That did not work');
      return null;
    } finally {
      this._loadRange(true);
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
      this._loadRange(true);
    } catch (err) { this._pin = ''; this._say(err?.message || 'Could not check the PIN'); }
  }

  // ---- navigation ---------------------------------------------------------------

  _go(dir) {
    const c = fromIso(this._cursor);
    let next;
    if (this._view === 'month') next = new Date(c.getFullYear(), c.getMonth() + dir, 1);
    else if (this._view === 'week') next = addDays(c, 7 * dir);
    else next = addDays(c, dir);
    this._cursor = iso(next);
    if (this._view === 'month') this._sel = iso(next);
    this._loadRange();
  }

  _goToday() {
    this._cursor = todayIso();
    this._sel = todayIso();
    this._loadRange();
  }

  _openDay(day) {
    this._cursor = day;
    this._sel = day;
    this.setHubView('day');
  }

  _period() {
    const loc = this.hass.locale?.language || undefined;
    const c = fromIso(this._cursor);
    if (this._view === 'month') return c.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
    if (this._view === 'week') {
      const m = mondayOf(c), e = addDays(m, 6);
      const a = m.toLocaleDateString(loc, { day: 'numeric', month: m.getMonth() === e.getMonth() ? undefined : 'short' });
      return `${a} – ${e.toLocaleDateString(loc, { day: 'numeric', month: 'short' })}`;
    }
    if (this._view === 'day') return c.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' });
    return 'Coming up';
  }

  _dayLabel(day, opts = { weekday: 'long', day: 'numeric', month: 'long' }) {
    return fromIso(day).toLocaleDateString(this.hass.locale?.language || undefined, opts);
  }

  // ---- filtering ----------------------------------------------------------------

  _shown() {
    const w = this._who;
    return this._events.filter(e => w === 'all' || e.kind === 'ha' || !(e.people || []).length || e.people.includes(w));
  }

  _onDay(day, list = this._shown()) { return list.filter(e => e.date === day); }

  /** Chores only appear in the views this device picked (Calendar settings); the day card always lists them. */
  _forView(list, view) { return this._choreViews.includes(view) ? list : list.filter(e => e.kind !== 'chore'); }

  _setFaceSide(side) {
    this._faceSide = side;
    try { localStorage.setItem(FACE_KEY, side); } catch { /* ignore */ }
  }

  _setChoreView(view, on) {
    this._choreViews = on ? [...new Set([...this._choreViews, view])] : this._choreViews.filter(v => v !== view);
    try { localStorage.setItem(CHORE_VIEWS_KEY, JSON.stringify(this._choreViews)); } catch { /* ignore */ }
  }

  _canDoChore(e) {
    if (e.status && e.status !== 'open' && e.status !== 'rejected') return false;
    const a = this._actor;
    if (!a) return !!this.hass?.user?.is_admin;
    if (a.role === 'adult') return true;
    return (e.people || []).length ? e.people.includes(a.id) : a.role === 'child';
  }

  async _tickChore(e) {
    const msg = { type: 'ksh_chores/complete', chore_id: e.key.split(':')[1], date: e.date, ...actingMsg(this.hass, this._acting) };
    try {
      const res = await this.hass.callWS(msg);
      celebrate(this, res?.celebration);
      this._say(res?.awarded ? `+${e.points} ★  ${e.title}` : 'Done. Waiting for an adult to approve.');
    } catch (err) {
      if (err?.code === 'pin_required' && this._actor?.has_pin) { this._sheet = { type: 'pin' }; this._pin = ''; }
      this._say(err?.message || 'That did not work');
    }
    this._loadRange(true);
  }

  // ---- event editor -------------------------------------------------------------

  _startEvent(draft, id = null) {
    if (!this._isAdult) { this._say('Only an adult can add or change events'); return; }
    this._draft = draft;
    this._sheet = { type: 'edit', id };
  }

  _editEvent(e) {
    const rep = e.repeat || { type: 'none' };
    this._startEvent(blankEvent(e.date, {
      title: e.title, emoji: e.emoji, category: e.category, people: [...(e.people || [])], date: e.date, end_date: e.end_date || '',
      all_day: !!e.all_day, start_time: e.start_time || '09:00', end_time: e.end_time || '', repeat: { ...rep },
      location: e.location || '', notes: e.notes || '', remind: e.remind ?? null,
    }), e.event_id);
  }

  _set(field, value) { this._draft = { ...this._draft, [field]: value }; }
  _setRep(patch) { this._draft = { ...this._draft, repeat: { ...this._draft.repeat, ...patch } }; }

  _pickCategory(c) {
    const cur = categoryById(this._draft.category);
    // keep a emoji the user picked themselves
    const keepEmoji = this._draft.emoji !== cur.emoji && this._draft.emoji !== '📌';
    this._draft = { ...this._draft, category: c.id, emoji: keepEmoji ? this._draft.emoji : c.emoji };
    if (c.id === 'birthday' && this._draft.repeat.type === 'none') this._setRep({ type: 'yearly' });
  }

  _repeatKind(rep) {
    if (rep.type === 'custom' && rep.unit === 'month' && rep.every === 1) return 'monthly';
    return rep.type || 'none';
  }

  _setRepeatKind(kind) {
    const until = this._draft.repeat.until;
    const days = this._draft.repeat.days;
    const rep = {
      none: { type: 'none' }, daily: { type: 'daily' }, yearly: { type: 'yearly' },
      weekly: { type: 'weekly', days: days || [(fromIso(this._draft.date).getDay() + 6) % 7] },
      monthly: { type: 'custom', every: 1, unit: 'month' },
      custom: { type: 'custom', every: 2, unit: 'week', days: days || [(fromIso(this._draft.date).getDay() + 6) % 7] },
    }[kind];
    this._draft = { ...this._draft, repeat: kind === 'none' ? rep : { ...rep, ...(until ? { until } : {}) } };
  }

  async _saveEvent() {
    const d = this._draft;
    if (!d.title.trim()) { this._say('Give it a title'); return; }
    if (!d.all_day && !d.start_time) { this._say('Pick a start time, or make it an all day event'); return; }
    const rep = { ...d.repeat };
    if (!rep.until) delete rep.until;
    if ((rep.type === 'weekly' || (rep.type === 'custom' && rep.unit === 'week')) && !(rep.days || []).length) rep.days = [(fromIso(d.date).getDay() + 6) % 7];
    const fields = {
      title: d.title.trim(), emoji: d.emoji, category: d.category, people: d.people, date: d.date,
      end_date: rep.type === 'none' && d.end_date && d.end_date > d.date ? d.end_date : null,
      all_day: d.all_day, start_time: d.all_day ? null : d.start_time, end_time: d.all_day ? null : (d.end_time || null),
      repeat: rep, location: d.location, notes: d.notes, remind: d.remind,
    };
    const id = this._sheet?.id;
    const res = await this._call(id ? 'events/update' : 'events/add', id ? { event_id: id, ...fields } : fields);
    if (res) { this._sel = d.date; this._cursor = d.date; this._closeSheet(); }
  }

  async _deleteEvent() {
    const rep = this._draft.repeat?.type !== 'none';
    if (!confirm(rep ? `Delete “${this._draft.title}”? Every repeat of it is removed.` : `Delete “${this._draft.title}”?`)) return;
    const res = await this._call('events/delete', { event_id: this._sheet.id });
    if (res) this._closeSheet();
  }

  _closeSheet() { this._sheet = null; this._draft = null; this._pin = ''; }

  _open(e) {
    if (e.kind === 'event' && this._isAdult) { this._editEvent(e); return; }
    this._sheet = { type: 'detail', event: e };
  }

  // ---- settings -----------------------------------------------------------------

  _setPos(pos) {
    this._pos = pos;
    try { localStorage.setItem(POS_KEY, pos); } catch { /* ignore */ }
  }

  get _haCalendars() {
    return Object.keys(this.hass?.states || {}).filter(id => id.startsWith('calendar.'))
      .map(id => ({ id, name: this.hass.states[id].attributes?.friendly_name || id }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async _toggleHa(id, on) {
    const cur = this._settings.ha_calendars || [];
    const next = on ? [...new Set([...cur, id])] : cur.filter(x => x !== id);
    this._settings = { ...this._settings, ha_calendars: next };
    await this._call('settings/set', { ha_calendars: next });
  }

  async _toggleChores(on) {
    this._settings = { ...this._settings, show_chores: on };
    await this._call('settings/set', { show_chores: on });
  }

  // ---- render -------------------------------------------------------------------

  render() {
    if (!this._loaded && !this._events.length) return html`<div class="center"><div class="spinner"></div></div>`;
    return html`
      <div class="scroll">
        <div class="page v-${this._view}">
          ${this._view === 'settings' ? this._settingsView() : html`
            ${this._toolbar()}
            ${this._view === 'month' ? this._month() : nothing}
            ${this._view === 'week' ? this._week() : nothing}
            ${this._view === 'day' ? this._dayView() : nothing}
            ${this._view === 'agenda' ? this._agenda() : nothing}`}
        </div>
      </div>
      ${this._sheet ? this._renderSheet() : nothing}
      ${this._toast ? html`<div class="toast" role="status">${this._toast}</div>` : nothing}`;
  }

  _toolbar() {
    const people = this._people.filter(p => p.role !== 'guest');
    return html`
      <h2 class="period" aria-live="polite">${this._period()}</h2>
      <div class="toolbar">
        ${this._view !== 'agenda' ? html`
          <button class="nav" aria-label="Previous" @click=${() => this._go(-1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
          <button class="nav" aria-label="Next" @click=${() => this._go(1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
          <button class="today" @click=${() => this._goToday()}>Today</button>` : nothing}
        <span class="grow"></span>
        ${this._isAdult ? html`<button class="add" @click=${() => this.openAdd('event')}><ha-icon icon="mdi:plus"></ha-icon><span>Add</span></button>` : nothing}
      </div>
      ${people.length > 1 ? html`
        <div class="chips" role="radiogroup" aria-label="Show events for">
          <button class="chip ${this._who === 'all' ? 'on' : ''}" @click=${() => { this._who = 'all'; }}>Everyone</button>
          ${people.map(p => html`<button class="chip ${this._who === p.id ? 'on' : ''}" @click=${() => { this._who = p.id; }}>${avatar(this.hass, p, 22)}${p.name}</button>`)}
        </div>` : nothing}`;
  }

  // -- shared pieces --

  _face(p) {
    return html`<span class="face" style="--p:${p.color}" title=${p.name}>${faceContent(this.hass, p)}</span>`;
  }

  /** Who it belongs to: their faces (picture or emoji) in their colour. Nobody listed means the whole family. */
  _avatars(e) {
    const people = (e.people || []).map(id => this._person(id)).filter(Boolean);
    if (people.length) return html`<span class="faces" aria-label=${people.map(p => p.name).join(', ')}>${people.map(p => this._face(p))}</span>`;
    return e.kind === 'ha' ? nothing : html`<span class="faces everyone" title="Everyone"><ha-icon icon="mdi:account-group-outline"></ha-icon></span>`;
  }

  /** The stripe at the left of a row is the person's colour (split between people), or the event type's colour for everyone */
  _stripe(e) {
    const cols = (e.people || []).map(id => this._person(id)?.color).filter(Boolean);
    if (!cols.length) return `--bar:${e.color};--who:${e.color}`;
    const step = 100 / cols.length;
    return `--bar:${cols.length === 1 ? cols[0] : `linear-gradient(to bottom, ${cols.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(', ')})`};--who:${cols[0]}`;
  }

  _eventRow(e, { tick = false, noTick = false } = {}) {
    const done = e.kind === 'chore' && ['done', 'approved'].includes(e.status);
    if (tick && e.kind === 'chore') {
      const can = this._canDoChore(e);
      return html`
        <div class="tickrow">
          ${this._eventRow(e, { noTick: true })}
          ${done ? html`<span class="check done" aria-label="Done"><ha-icon icon="mdi:check"></ha-icon></span>`
            : html`<button class="check" ?disabled=${!can} aria-label="Mark ${e.title} as done" title=${can ? 'Done' : 'Not for you'}
                @click=${() => this._tickChore(e)}><ha-icon icon="mdi:check"></ha-icon></button>`}
        </div>`;
    }
    return html`
      <button class="ev ${e.kind} ${done ? 'finished' : ''} face-${this._faceSide}" style="--c:${e.color};${this._stripe(e)}" @click=${() => this._open(e)}>
        <span class="bar"></span>
        ${this._faceSide === 'left' ? this._avatars(e) : nothing}
        <span class="em">${e.emoji}</span>
        <span class="txt"><b>${e.title}</b>
          <small>${timeLabel(e)}${e.kind === 'chore' ? ' · chore' : ''}${e.location ? ` · ${e.location}` : ''}${e.calendar ? ` · ${e.calendar}` : ''}</small></span>
        ${this._faceSide === 'right' ? this._avatars(e) : nothing}
        ${done && !noTick ? html`<ha-icon class="tick" icon="mdi:check-circle"></ha-icon>` : nothing}
      </button>`;
  }

  _dayList(day, list) {
    const items = this._onDay(day, list);
    return items.length ? html`<div class="evlist">${items.map(e => this._eventRow(e))}</div>`
      : html`<p class="none">Nothing planned.</p>`;
  }

  // -- Month --

  _month() {
    const c = fromIso(this._cursor);
    const first = mondayOf(new Date(c.getFullYear(), c.getMonth(), 1));
    const days = Array.from({ length: 42 }, (_, n) => addDays(first, n));
    const rows = days[35].getMonth() !== c.getMonth() && days[28].getMonth() !== c.getMonth() ? 5 : 6;
    const list = this._shown();
    const pos = this._wide ? this._pos : (this._pos === 'top' ? 'top' : 'bottom');
    const today = todayIso();
    const byDay = {};
    for (const e of list) (byDay[e.date] ||= []).push(e);
    return html`
      <div class="monthwrap pos-${pos}">
        <div class="grid" style="--rows:${rows}">
          ${DAY_NAMES.map(n => html`<div class="dow">${this._wide ? n : n[0]}</div>`)}
          ${days.slice(0, rows * 7).map(d => {
            const key = iso(d);
            const all = this._forView(byDay[key] || [], 'month');
            const evs = all.filter(e => e.kind !== 'chore');
            const chores = all.filter(e => e.kind === 'chore');
            const other = d.getMonth() !== c.getMonth();
            return html`
              <button class="cell ${other ? 'other' : ''} ${key === today ? 'today' : ''} ${key === this._sel ? 'sel' : ''}"
                aria-label=${this._dayLabel(key)} aria-pressed=${key === this._sel ? 'true' : 'false'}
                @click=${() => { this._sel = key; }} @dblclick=${() => this._openDay(key)}>
                <span class="num">${d.getDate()}</span>
                ${this._wide ? html`
                  <span class="chipcol">${evs.slice(0, 2).map(e => html`<span class="mini" style="--c:${e.color}">${e.emoji} ${e.title}</span>`)}
                    ${evs.length > 2 ? html`<span class="more">+${evs.length - 2} more</span>` : nothing}
                    ${chores.length ? html`<span class="mini chore" style="--c:#3db6cc" title="${chores.length} chore${chores.length === 1 ? '' : 's'}">✅ ${chores.length}</span>` : nothing}</span>`
                : html`<span class="emo">${evs.slice(0, 2).map(e => html`<span style="--c:${e.color}">${e.emoji}</span>`)}${chores.length ? html`<span class="cn" title="${chores.length} chore${chores.length === 1 ? '' : 's'}">✓${chores.length}</span>` : nothing}${evs.length > 2 ? html`<span class="cn">+${evs.length - 2}</span>` : nothing}</span>`}
              </button>`;
          })}
        </div>
        <aside class="daycard" aria-label="Selected day">
          <div class="dchead">
            <h3>${this._dayLabel(this._sel)}</h3>
            <span class="grow"></span>
            <button class="mini-btn" @click=${() => this._openDay(this._sel)}>Day</button>
            ${this._isAdult ? html`<button class="mini-btn on" aria-label="Add an event" @click=${() => this.openAdd('event')}><ha-icon icon="mdi:plus"></ha-icon></button>` : nothing}
          </div>
          ${this._dayList(this._sel, list)}
        </aside>
      </div>`;
  }

  // -- Week --

  _week() {
    const m = mondayOf(fromIso(this._cursor));
    const list = this._forView(this._shown(), 'week');
    const today = todayIso();
    return html`
      <div class="week">
        ${Array.from({ length: 7 }, (_, n) => {
          const d = addDays(m, n), key = iso(d);
          return html`
            <section class="wday ${key === today ? 'today' : ''}">
              <button class="wh" @click=${() => this._openDay(key)}>
                <span>${this._dayLabel(key, { weekday: 'short' })}</span><b>${d.getDate()}</b>
              </button>
              ${this._dayList(key, list)}
            </section>`;
        })}
      </div>`;
  }

  // -- Day --

  _dayView() {
    const list = this._forView(this._onDay(this._cursor, this._shown()), 'day');
    const allDay = list.filter(e => e.all_day && e.kind !== 'chore');
    const timed = list.filter(e => !e.all_day);
    const chores = list.filter(e => e.kind === 'chore' && e.all_day);
    const open = list.filter(e => e.kind === 'chore' && ['open', 'rejected'].includes(e.status)).length;
    return html`
      <div class="dayview">
        ${!list.length ? html`<div class="empty"><span>🗓️</span><p>Nothing planned for this day.</p>
          ${this._isAdult ? html`<button class="primary" @click=${() => this.openAdd('event')}>Add something</button>` : nothing}</div>` : nothing}
        ${allDay.length ? html`<h3>All day</h3><div class="evlist">${allDay.map(e => this._eventRow(e))}</div>` : nothing}
        ${timed.length ? html`<h3>Timetable</h3>
          <div class="timeline">${timed.map(e => html`
            <div class="trow"><span class="t">${e.start_time}</span>${this._eventRow(e, { tick: true })}</div>`)}</div>` : nothing}
        ${chores.length ? html`<h3>Chores${open ? html` <span class="count">${open} to do</span>` : nothing}</h3>
          <div class="evlist">${chores.map(e => this._eventRow(e, { tick: true }))}</div>` : nothing}
        ${!this._choreViews.includes('day') && this._settings.show_chores && this.modules?.chores
          ? html`<p class="muted">Chores are switched off for this view. Turn them on under Calendar settings.</p>` : nothing}
      </div>`;
  }

  // -- Agenda --

  _agenda() {
    const list = this._forView(this._shown(), 'agenda');
    const days = [...new Set(list.map(e => e.date))].sort();
    return html`
      <div class="dayview">
        ${days.length ? days.map(d => html`
          <h3>${d === todayIso() ? 'Today' : this._dayLabel(d, { weekday: 'long', day: 'numeric', month: 'short' })}</h3>
          <div class="evlist">${this._onDay(d, list).map(e => this._eventRow(e))}</div>`)
          : html`<div class="empty"><span>🗓️</span><p>Nothing coming up in the next six weeks.</p></div>`}
      </div>`;
  }

  // -- Settings --

  _settingsView() {
    const ha = this._haCalendars;
    const picked = this._settings.ha_calendars || [];
    return html`
      <div class="pair ${this._wide ? 'wide' : ''}">
      <div>
      <h3>Month view</h3>
      <div class="card pad">
        <label class="lbl">Where the day card goes (this device)</label>
        <div class="seg">${POSITIONS.map(([v, l]) => html`<button class="${this._pos === v ? 'on' : ''}" @click=${() => this._setPos(v)}>${l}</button>`)}</div>
        <p class="muted">The card next to the month lists the chores and events of the day you tap. On a narrow phone it sits below (or above) the month.</p>
      </div>
      </div>

      <div>
      <h3>Who it belongs to</h3>
      <div class="card pad">
        <label class="lbl">Side of each card for the faces (this device)</label>
        <div class="seg">${[['left', 'Left'], ['right', 'Right']].map(([v, l]) => html`<button class="${this._faceSide === v ? 'on' : ''}" @click=${() => this._setFaceSide(v)}>${l}</button>`)}</div>
        <p class="muted">Each event and chore shows the face (picture or emoji) of the people it is for, in their colour. The coloured stripe always stays on the left edge.</p>
      </div>
      </div>
      </div>

      <h3>Show in the calendar</h3>
      <div class="card">
        ${this.modules?.chores ? html`
          <button class="switchrow" role="switch" aria-checked=${this._settings.show_chores ? 'true' : 'false'} ?disabled=${!this._isAdult}
            @click=${() => this._toggleChores(!this._settings.show_chores)}>
            <span class="swtxt"><b>Chores</b><small>Chores on the days they are due. An adult turns this on or off for everyone.</small></span>
            <span class="switch ${this._settings.show_chores ? 'on' : ''}"><i></i></span></button>` : nothing}
        ${this.modules?.chores && this._settings.show_chores ? html`
          <div class="switchrow static col">
            <span class="swtxt"><b>Show chores in these views</b><small>Just on this device. The Day view is a quick look at today and lets you tick chores off.</small></span>
            <div class="chips">${VIEW_LABELS.map(([v, l]) => html`
              <button class="chip ${this._choreViews.includes(v) ? 'on' : ''}" aria-pressed=${this._choreViews.includes(v) ? 'true' : 'false'}
                @click=${() => this._setChoreView(v, !this._choreViews.includes(v))}>${l}</button>`)}</div>
          </div>` : nothing}
        <div class="switchrow static"><span class="swtxt"><b>Family events</b><small>School, sport, appointments, reminders and birthdays added here</small></span><span class="pill">Always</span></div>
      </div>

      <h3>Home Assistant calendars</h3>
      <div class="card">
        ${ha.length ? ha.map(c => {
          const on = picked.includes(c.id);
          return html`
            <button class="switchrow" role="switch" aria-checked=${on ? 'true' : 'false'} ?disabled=${!this._isAdult} @click=${() => this._toggleHa(c.id, !on)}>
              <span class="swtxt"><b>${c.name}</b><small>${c.id}</small></span><span class="switch ${on ? 'on' : ''}"><i></i></span></button>`;
        }) : html`<p class="muted pad">No calendars found in Home Assistant yet.</p>`}
      </div>
      <p class="muted">${this._isAdult ? 'Calendars you switch on appear next to the family events, read only.' : 'Only an adult can choose which calendars are shown.'}
        To add more (Google, a school calendar link, a local calendar) set them up in Home Assistant under
        <i>Settings → Devices & services → Add integration</i>; they show up in this list.</p>

      <h3>Event types</h3>
      <div class="card pad legend">${CATEGORIES.map(c => html`<span class="lg" style="--c:${c.color}"><i></i>${c.emoji} ${c.label}</span>`)}
        <span class="lg" style="--c:#3db6cc"><i></i>✅ Chore</span><span class="lg" style="--c:#7fa6c0"><i></i>🗓️ Home Assistant</span></div>`;
  }

  // ---- sheets -------------------------------------------------------------------

  _renderSheet() {
    const t = this._sheet.type;
    return html`
      <div class="scrim" @click=${() => this._closeSheet()}></div>
      <section class="sheet" role="dialog" aria-label=${t}>
        <div class="grabber"></div>
        ${t === 'edit' ? this._editSheet() : nothing}
        ${t === 'detail' ? this._detailSheet() : nothing}
        ${t === 'pin' ? this._pinSheet() : nothing}
      </section>`;
  }

  _title(text) { return html`<div class="head2"><h2>${text}</h2></div>`; }

  _pinSheet() {
    const p = this._actor;
    return html`${this._title(`${p?.name || 'Your'} PIN`)}
      <form class="form" @submit=${e => { e.preventDefault(); this._checkPin(); }}>
        <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
          .value=${this._pin} @input=${e => { this._pin = e.target.value.replace(/\D/g, ''); }}>
        <button class="primary" type="submit" ?disabled=${this._pin.length !== 4}>Continue</button>
      </form>`;
  }

  _detailSheet() {
    const e = this._sheet.event;
    const who = (e.people || []).map(id => this._person(id)).filter(Boolean);
    return html`
      <div class="detail" style="--c:${e.color}">
        <div class="dh"><span class="em big">${e.emoji}</span>
          <div><h2>${e.title}</h2><p class="muted">${this._dayLabel(e.date)}</p></div></div>
        <div class="facts">
          <div><ha-icon icon="mdi:clock-outline"></ha-icon>${timeLabel(e)}</div>
          ${e.location ? html`<div><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.location}</div>` : nothing}
          ${who.length ? html`<div><ha-icon icon="mdi:account-multiple-outline"></ha-icon>${who.map(p => p.name).join(', ')}</div>` : nothing}
          ${e.calendar ? html`<div><ha-icon icon="mdi:calendar-sync-outline"></ha-icon>${e.calendar}</div>` : nothing}
          ${e.kind === 'chore' ? html`<div><ha-icon icon="mdi:check-circle-outline"></ha-icon>Chore${e.points ? ` · +${e.points} ★` : ''}${e.status && e.status !== 'open' ? ` · ${e.status === 'approved' ? 'done' : e.status}` : ''}</div>` : nothing}
          ${e.notes ? html`<div class="notes"><ha-icon icon="mdi:text"></ha-icon>${e.notes}</div>` : nothing}
        </div>
        ${e.kind === 'chore' ? html`<button class="primary" @click=${() => { this._closeSheet(); this.dispatchEvent(new CustomEvent('hub-navigate', { detail: { id: 'chores' }, bubbles: true, composed: true })); }}>Open chores</button>` : nothing}
        ${e.kind === 'ha' ? html`<p class="muted">This comes from a Home Assistant calendar, so it is changed there.</p>` : nothing}
      </div>`;
  }

  _chips(selected, onToggle, everyone) {
    return html`<div class="chips">
      <button type="button" class="chip ${!selected.length ? 'on' : ''}" @click=${everyone}>Everyone</button>
      ${this._people.filter(p => p.role !== 'guest' || true).map(p => html`<button type="button" class="chip ${selected.includes(p.id) ? 'on' : ''}" @click=${() => onToggle(p.id)}>${avatar(this.hass, p, 22)}${p.name}</button>`)}
    </div>`;
  }

  _editSheet() {
    const d = this._draft;
    const editing = !!this._sheet.id;
    const kind = this._repeatKind(d.repeat);
    const rep = d.repeat;
    const weekDays = kind === 'weekly' || (kind === 'custom' && rep.unit === 'week');
    return html`${this._title(editing ? 'Edit event' : 'New event')}
      <div class="form">
        <label>Title<input .value=${d.title} maxlength="80" placeholder="e.g. Swimming lessons" @input=${e => this._set('title', e.target.value)}></label>

        <label>Type</label>
        <div class="chips">${CATEGORIES.map(c => html`
          <button type="button" class="chip ${d.category === c.id ? 'on' : ''}" @click=${() => this._pickCategory(c)}>${c.emoji} ${c.label}</button>`)}</div>

        <label>Picture</label>
        <ksh-emoji-picker .value=${d.emoji} .quick=${EVENT_EMOJIS} @emoji-pick=${e => this._set('emoji', e.detail.emoji)}></ksh-emoji-picker>

        <label>Who is it for</label>
        ${this._chips(d.people, id => this._set('people', d.people.includes(id) ? d.people.filter(x => x !== id) : [...d.people, id]), () => this._set('people', []))}

        <button type="button" class="switchrow" role="switch" aria-checked=${d.all_day ? 'true' : 'false'} @click=${() => this._set('all_day', !d.all_day)}>
          <span>All day</span><span class="switch ${d.all_day ? 'on' : ''}"><i></i></span></button>

        <label>${kind === 'none' && d.all_day ? 'Starts' : 'Date'}<input type="date" .value=${d.date} @input=${e => this._set('date', e.target.value)}></label>
        ${kind === 'none' && d.all_day ? html`
          <label>Ends <small class="hint inl">(optional, for a trip or camp)</small>
            <input type="date" .value=${d.end_date || ''} min=${d.date} @input=${e => this._set('end_date', e.target.value)}></label>` : nothing}
        ${!d.all_day ? html`
          <div class="two">
            <label>From<input type="time" .value=${d.start_time} @input=${e => this._set('start_time', e.target.value)}></label>
            <label>To <small class="hint inl">(optional)</small><input type="time" .value=${d.end_time} @input=${e => this._set('end_time', e.target.value)}></label>
          </div>` : nothing}

        <label>Repeats
          <select @change=${e => this._setRepeatKind(e.target.value)}>
            ${[['none', "Doesn't repeat"], ['daily', 'Every day'], ['weekly', 'Every week'], ['monthly', 'Every month'], ['yearly', 'Every year'], ['custom', 'Custom']].map(([v, l]) =>
              html`<option value=${v} ?selected=${kind === v}>${l}</option>`)}
          </select></label>
        ${kind === 'custom' ? html`
          <div class="every">Every
            <input type="number" min="1" max="365" .value=${String(rep.every || 1)} @input=${e => this._setRep({ every: Number(e.target.value) || 1 })}>
            <select @change=${e => this._setRep({ unit: e.target.value })}>
              ${[['day', 'days'], ['week', 'weeks'], ['month', 'months']].map(([v, l]) => html`<option value=${v} ?selected=${rep.unit === v}>${l}</option>`)}
            </select></div>` : nothing}
        ${weekDays ? html`
          <div class="chips">${DAY_NAMES.map((n, i) => html`
            <button type="button" class="chip ${(rep.days || []).includes(i) ? 'on' : ''}"
              @click=${() => this._setRep({ days: (rep.days || []).includes(i) ? rep.days.filter(x => x !== i) : [...(rep.days || []), i].sort() })}>${n}</button>`)}</div>` : nothing}
        ${kind !== 'none' ? html`
          <label>Repeats until <small class="hint inl">(optional, like the end of the term)</small>
            <input type="date" .value=${rep.until || ''} min=${d.date} @input=${e => this._setRep({ until: e.target.value })}></label>` : nothing}

        <label>Location <small class="hint inl">(optional)</small><input .value=${d.location} maxlength="100" @input=${e => this._set('location', e.target.value)}></label>
        <label>Notes <small class="hint inl">(optional)</small><input .value=${d.notes} maxlength="300" placeholder="What to bring" @input=${e => this._set('notes', e.target.value)}></label>

        <label>Remind
          <select @change=${e => this._set('remind', e.target.value === '' ? null : Number(e.target.value))}>
            ${REMIND_OPTIONS.map(o => html`<option value=${o.value ?? ''} ?selected=${d.remind === o.value}>${o.label}</option>`)}
          </select></label>
        ${d.remind !== null ? html`<small class="hint">${d.all_day ? 'An all day event reminds you at 8am.' : 'Goes to the phone set for each person, otherwise it shows in Home Assistant\'s notifications.'}</small>` : nothing}
        ${kind !== 'none' && editing ? html`<small class="hint">Changes apply to every repeat of this event.</small>` : nothing}

        <div class="actions">
          ${editing ? html`<button class="danger" @click=${() => this._deleteEvent()}>Delete</button>` : nothing}
          <button class="primary grow" @click=${() => this._saveEvent()}>Save event</button>
        </div>
      </div>`;
  }

  static styles = [avatarCss, css`
    :host { display: block; position: relative; overflow: hidden; color: var(--hub-text); --cal: var(--hub-accent); }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    button { cursor: pointer; }
    button[disabled] { cursor: default; opacity: .55; }
    .scroll { height: 100%; overflow-y: auto; }
    .page { max-width: 1100px; margin: 0 auto; padding: 4px 14px 28px; }
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border); border-top-color: var(--cal); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .muted { color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; margin: 8px 2px; }
    .pad { padding: 14px 16px; }
    h3 { margin: 16px 4px 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .grow { flex: 1; }

    .toolbar { display: flex; align-items: center; gap: 8px; margin: 6px 0 8px; }
    .period { margin: 8px 4px 0; font-size: 24px; font-weight: 800; letter-spacing: -.01em; }
    .nav { width: 38px; height: 38px; border-radius: 50%; flex: none; border: 1px solid var(--hub-border); background: var(--hub-surface); display: flex; align-items: center; justify-content: center; --mdc-icon-size: 22px; }
    .today { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 7px 14px; font-weight: 700; font-size: 13px; }
    .add, .primary { border: none; background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 9px 16px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; justify-content: center; --mdc-icon-size: 20px; }
    @media (max-width: 420px) { .add span { display: none; } .add { padding: 9px 11px; } .period { font-size: 22px; } }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 10px; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    /* month */
    .monthwrap { display: flex; gap: 12px; align-items: flex-start; }
    .monthwrap.pos-right { flex-direction: row; }
    .monthwrap.pos-left { flex-direction: row-reverse; }
    .monthwrap.pos-bottom { flex-direction: column; }
    .monthwrap.pos-top { flex-direction: column-reverse; }
    .monthwrap.pos-right .grid, .monthwrap.pos-left .grid { flex: 1; min-width: 0; }
    .monthwrap.pos-right .daycard, .monthwrap.pos-left .daycard { width: 320px; flex: none; position: sticky; top: 4px; }
    .monthwrap.pos-bottom .grid, .monthwrap.pos-top .grid, .monthwrap.pos-bottom .daycard, .monthwrap.pos-top .daycard { width: 100%; }
    .grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }
    .dow { text-align: center; font-size: 11.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--hub-muted); padding: 4px 0; }
    .cell { min-height: 54px; border-radius: 12px; border: 1px solid var(--hub-border); background: var(--hub-surface); padding: 5px 4px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: left; overflow: hidden; }
    .pos-right .cell, .pos-left .cell { min-height: 92px; align-items: stretch; padding: 6px; }
    .cell.other { opacity: .45; }
    .cell.today .num { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .cell.sel { border-color: var(--cal); box-shadow: 0 0 0 2px color-mix(in srgb, var(--cal) 45%, transparent); }
    .num { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex: none; }
    .emo { display: flex; gap: 1px 2px; flex-wrap: wrap; justify-content: center; font-size: 12px; line-height: 1.15; min-height: 14px; }
    .emo > span { border-bottom: 2px solid var(--c, transparent); }
    .emo .cn { font-size: 10px; font-weight: 800; color: var(--hub-muted); border: none; }
    .dots { display: flex; gap: 3px; flex-wrap: wrap; justify-content: center; min-height: 7px; }
    .dots i { width: 7px; height: 7px; border-radius: 50%; display: block; }
    .dots i.ch { background: transparent; border: 1.5px solid var(--hub-accent-2); }
    .mini.chore { background: transparent; border-left-style: dashed; color: var(--hub-muted); }
    .chipcol { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .mini { display: block; background: color-mix(in srgb, var(--c) 24%, transparent); border-left: 3px solid var(--c); border-radius: 5px; padding: 1px 5px; font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .more { font-size: 11px; color: var(--hub-muted); font-weight: 700; padding-left: 4px; }
    .daycard { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; padding: 12px; }
    .dchead { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
    .dchead h3 { margin: 0 4px; font-size: 15px; text-transform: none; letter-spacing: 0; color: var(--hub-text); font-weight: 800; }
    .mini-btn { border: 1px solid var(--hub-border); background: var(--hub-surface-2); border-radius: 999px; padding: 5px 12px; font-weight: 700; font-size: 12.5px; display: inline-flex; align-items: center; --mdc-icon-size: 18px; }
    .mini-btn.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .none { color: var(--hub-muted); font-size: 13.5px; margin: 8px 4px; }

    /* events */
    .evlist { display: grid; gap: 6px; }
    .ev { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; border: 1px solid var(--hub-border); border-radius: 14px; padding: 8px 10px 8px 0; background: var(--hub-surface-2); overflow: hidden; }
    .ev .bar { align-self: stretch; width: 6px; background: var(--bar, var(--c)); flex: none; border-radius: 0 3px 3px 0; }
    .ev .em { font-size: 21px; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; flex: none; border-radius: 11px; background: color-mix(in srgb, var(--c) 20%, transparent); }
    .ev .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ev b { font-size: 14.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; }
    .ev small { color: var(--hub-muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .faces { display: inline-flex; flex: none; padding-left: 8px; }
    .ev.face-left .faces { padding-left: 0; margin-left: 8px; margin-right: 4px; }
    .ev.face-left .faces.everyone { margin-left: 4px; }
    .face { width: 30px; height: 30px; border-radius: 50%; margin-left: -8px; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; overflow: hidden;
      background: color-mix(in srgb, var(--p) 30%, var(--hub-surface-2)); border: 2px solid var(--p); box-shadow: 0 0 0 2px var(--hub-surface-2); }
    .face img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .faces.everyone { color: var(--hub-muted); align-items: center; --mdc-icon-size: 22px; padding-left: 0; }
    .ev.finished b { text-decoration: line-through; opacity: .6; }
    .ev .tick { color: #4fd1a1; --mdc-icon-size: 20px; flex: none; }
    .ev.chore { background: transparent; border-style: dashed; }
    .tickrow { display: flex; align-items: center; gap: 8px; } .tickrow .ev { flex: 1; min-width: 0; }
    .check { width: 42px; height: 42px; border-radius: 50%; flex: none; border: 2px solid var(--hub-muted); background: transparent; color: var(--hub-muted); display: flex; align-items: center; justify-content: center; --mdc-icon-size: 22px; }
    .check:hover:not([disabled]) { background: var(--hub-accent-2); border-color: var(--hub-accent-2); color: var(--hub-accent-2-ink); }
    .check.done { background: #4fd1a1; border-color: #4fd1a1; color: #06222a; }
    .count { background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 1px 8px; font-size: 11px; text-transform: none; letter-spacing: 0; margin-left: 6px; }
    .switchrow.col { flex-direction: column; align-items: stretch; gap: 6px; }
    .switchrow.col .chips { margin: 2px 0 0; }

    /* week, day, agenda */
    .week { display: grid; grid-template-columns: 1fr; gap: 10px; }
    @media (min-width: 700px) { .week { grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; align-items: start; } }
    .wday { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 18px; padding: 8px; min-width: 0; }
    .wday.today { border-color: var(--cal); }
    .wh { display: flex; align-items: baseline; gap: 8px; background: none; border: none; padding: 2px 4px 8px; width: 100%; font-weight: 700; color: var(--hub-muted); }
    .wh b { font-size: 20px; color: var(--hub-text); }
    .wday.today .wh b { color: var(--cal); }
    @media (min-width: 700px) {
      .wday .ev { flex-wrap: wrap; gap: 2px 6px; padding: 6px 8px; border-left: 4px solid var(--who, var(--c)); align-items: center; }
      .wday .ev .bar { display: none; }
      .wday .ev .em { width: auto; font-size: 18px; }
      .wday .ev .txt { flex-basis: 100%; order: 3; }
      .wday .ev.face-right .faces, .wday .ev .tick { margin-left: auto; }
      .wday .ev b { white-space: normal; font-size: 13.5px; }
      .wday .ev small { white-space: normal; }
    }
    .dayview { max-width: 640px; margin: 0 auto; }
    .timeline { display: grid; gap: 8px; }
    .trow { display: grid; grid-template-columns: 52px 1fr; gap: 8px; align-items: center; }
    .trow .t { font-weight: 800; color: var(--hub-muted); font-size: 13.5px; text-align: right; }
    .empty { text-align: center; padding: 30px 10px; color: var(--hub-muted); } .empty span { font-size: 44px; }

    /* settings */
    .card { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; overflow: hidden; }
    .pair.wide { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; align-items: start; }
    .pair .seg button { padding: 8px 6px; }
    .lbl { display: block; font-weight: 700; font-size: 13.5px; margin-bottom: 8px; }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .switchrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 12px 16px; background: none; border: none; border-bottom: 1px solid var(--hub-border); text-align: left; font-weight: 600; font-size: 14px; }
    .card .switchrow:last-child { border-bottom: none; }
    .swtxt { display: flex; flex-direction: column; gap: 2px; min-width: 0; } .swtxt small { color: var(--hub-muted); font-weight: 500; font-size: 12.5px; }
    .form .switchrow { padding: 10px 4px; border: none; }
    .switch { width: 46px; height: 28px; border-radius: 999px; background: rgba(150,170,190,.35); display: flex; align-items: center; padding: 3px; flex: none; transition: background .15s; }
    .switch i { width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: transform .15s; }
    .switch.on { background: var(--hub-accent); } .switch.on i { transform: translateX(18px); }
    .pill { border: 1px solid var(--hub-border); background: var(--hub-surface-2); color: var(--hub-muted); border-radius: 999px; padding: 5px 12px; font-size: 12.5px; font-weight: 800; }
    .legend { display: flex; flex-wrap: wrap; gap: 8px 16px; }
    .lg { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 600; } .lg i { width: 10px; height: 10px; border-radius: 3px; background: var(--c); display: block; }

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
    .head2 { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; } .head2 h2 { margin: 0; font-size: 18px; font-weight: 800; }
    .form { display: grid; gap: 8px; }
    .form label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 6px; }
    .form input:not([type=checkbox]), .form select, .every input, .every select { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .form input:focus, .form select:focus { border-color: var(--hub-accent); }
    .hint { color: var(--hub-muted); font-size: 12.5px; font-weight: 500; } .hint.inl { margin-left: 4px; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .every { display: flex; align-items: center; gap: 8px; font-weight: 700; } .every input { width: 80px; } .every select { width: auto; }
    .emoji-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .emoji-list button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); }
    .emoji-list button.on { border-color: var(--hub-accent); }
    .actions { display: flex; gap: 10px; margin-top: 10px; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 10px 18px; font-weight: 700; }
    .pin { text-align: center; font-size: 28px !important; letter-spacing: .4em; }
    .detail .dh { display: flex; align-items: center; gap: 12px; } .detail h2 { margin: 0; font-size: 20px; }
    .em.big { font-size: 40px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; border-radius: 18px; background: color-mix(in srgb, var(--c) 22%, transparent); }
    .facts { display: grid; gap: 10px; margin: 14px 0; } .facts div { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; --mdc-icon-size: 20px; } .facts ha-icon { color: var(--hub-muted); flex: none; }
  `];
}

customElements.define('ksh-calendar-module', KshCalendarModule);
