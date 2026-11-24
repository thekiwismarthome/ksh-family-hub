// The emoji picker used wherever an emoji is chosen (chores, routine steps, rewards, calendar events, people, spending).
// A row of suggestions to start with, a search box ("swim" finds 🏊), and every emoji by group. The full list (about 1,800,
// with their keywords) loads the first time it is needed. Recently used emojis come first.
//
//   <ksh-emoji-picker .value=${e} .quick=${list} @emoji-pick=${ev => use(ev.detail.emoji)}></ksh-emoji-picker>
//   <ksh-emoji-picker compact ...>   a small button that opens the picker over the page (for rows of many emojis)
import { LitElement, html, css, nothing } from 'lit';

const RECENT_KEY = 'ksh_emoji_recent';
const readRecent = () => { try { const r = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); return Array.isArray(r) ? r : []; } catch { return []; } };
const saveRecent = list => { try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 18))); } catch { /* ignore */ } };
const MAX_RESULTS = 120;

let dataPromise = null;
const loadData = () => (dataPromise ||= import('./emoji-data.js'));

class KshEmojiPicker extends LitElement {
  static properties = {
    value: { type: String },
    quick: { type: Array },
    compact: { type: Boolean },
    _browse: { state: true },
    _open: { state: true },
    _q: { state: true },
    _group: { state: true },
    _data: { state: true },
    _recent: { state: true },
  };

  constructor() {
    super();
    this.value = '';
    this.quick = [];
    this.compact = false;
    this._browse = false;
    this._open = false;
    this._q = '';
    this._group = 0;
    this._data = null;
    this._recent = readRecent();
  }

  async _ensureData() {
    if (this._data) return;
    try { this._data = await loadData(); } catch { this._data = { GROUPS: [], EMOJI: [] }; }
  }

  _pick(emoji) {
    this._recent = [emoji, ...this._recent.filter(e => e !== emoji)].slice(0, 18);
    saveRecent(this._recent);
    this.dispatchEvent(new CustomEvent('emoji-pick', { detail: { emoji }, bubbles: true, composed: true }));
    this._browse = false;
    this._open = false;
    this._q = '';
  }

  _typed(e) {
    this.dispatchEvent(new CustomEvent('emoji-pick', { detail: { emoji: e.target.value }, bubbles: true, composed: true }));
  }

  async _search(e) {
    this._q = e.target.value;
    if (this._q) await this._ensureData();
  }

  async _openBrowse() {
    this._browse = true;
    await this._ensureData();
  }

  get _results() {
    const q = this._q.trim().toLowerCase();
    if (!q || !this._data) return null;
    const terms = q.split(/\s+/);
    const hits = this._data.EMOJI.filter(([, words]) => terms.every(t => words.includes(t)));
    // whole-word matches first ("swim" before "swimsuit")
    const whole = t => new RegExp(`(^| )${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`);
    hits.sort((a, b) => terms.filter(t => whole(t).test(b[1])).length - terms.filter(t => whole(t).test(a[1])).length);
    return hits.slice(0, MAX_RESULTS).map(h => h[0]);
  }

  _grid(list) {
    return html`<div class="grid">${list.map(e => html`
      <button type="button" class=${e === this.value ? 'on' : ''} @click=${() => this._pick(e)} aria-label=${`Choose ${e}`}>${e}</button>`)}</div>`;
  }

  _searchBox() {
    return html`<input class="q" type="search" placeholder="Search emoji, e.g. swim, dentist, bins" .value=${this._q} @input=${this._search} aria-label="Search emoji">`;
  }

  _panel({ withSearch = true } = {}) {
    const results = this._results;
    const d = this._data;
    const groupList = d ? d.EMOJI.filter(([, , g]) => g === this._group).map(h => h[0]) : [];
    return html`
      ${withSearch ? html`<div class="search">${this._searchBox()}</div>` : nothing}
      ${results ? (results.length ? this._grid(results) : html`<p class="none">No emoji found. Try another word.</p>`) : html`
        ${d ? html`
          <div class="tabs" role="tablist">${d.GROUPS.map(([icon, name], i) => html`
            <button type="button" role="tab" aria-selected=${this._group === i ? 'true' : 'false'} class=${this._group === i ? 'on' : ''} title=${name} @click=${() => { this._group = i; }}>${icon}</button>`)}</div>
          <div class="scroll">${this._grid(groupList)}</div>` : html`<p class="none">Loading…</p>`}`}`;
  }

  _suggestions() {
    const recent = this._recent.filter(e => !this.quick.includes(e)).slice(0, 8);
    const list = [...recent, ...this.quick];
    return html`
      ${this._grid(list)}
      <button type="button" class="more" @click=${this._openBrowse}>Browse all emojis</button>`;
  }

  render() {
    if (this.compact) {
      return html`
        <button type="button" class="pickbtn" @click=${async () => { this._open = true; this._browse = true; await this._ensureData(); }} aria-label="Choose an emoji">${this.value || '🙂'}</button>
        ${this._open ? html`
          <div class="overlay" @click=${e => { if (e.target === e.currentTarget) this._open = false; }}>
            <div class="box" role="dialog" aria-label="Choose an emoji">
              <button type="button" class="x" aria-label="Close" @click=${() => { this._open = false; }}>✕</button>
              ${this._panel()}
            </div>
          </div>` : nothing}`;
    }
    const showPanel = this._browse || this._q;
    return html`
      <div class="row">
        <input class="cur" maxlength="8" .value=${this.value || ''} @input=${this._typed} aria-label="Emoji">
        ${this._searchBox()}
      </div>
      ${showPanel ? html`
        <div class="panel">${this._panel({ withSearch: false })}
          <button type="button" class="more" @click=${() => { this._browse = false; this._q = ''; }}>Close</button></div>` : this._suggestions()}`;
  }

  static styles = css`
    :host { display: block; color: var(--hub-text); }
    * { box-sizing: border-box; }
    .row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .cur { width: 76px; text-align: center; font-size: 24px; padding: 6px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; }
    .cur:focus { border-color: var(--hub-accent); }
    .q, .search input { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); font-size: 15px; outline: none; }
    .q:focus, .search input:focus { border-color: var(--hub-accent); }
    .row .q { flex: 1; min-width: 0; }
    .grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .grid button, .tabs button { width: 40px; height: 40px; font-size: 22px; line-height: 1; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); cursor: pointer; padding: 0; }
    .grid button:hover, .tabs button:hover { background: var(--hub-surface-2); }
    .grid button.on, .tabs button.on { border-color: var(--hub-accent); }
    .tabs { display: flex; gap: 4px; margin: 10px 0 8px; overflow-x: auto; scrollbar-width: none; }
    .tabs button { flex: none; }
    .tabs button.on { background: var(--hub-surface-2); }
    .scroll { max-height: 236px; overflow-y: auto; overscroll-behavior: contain; }
    .panel { display: grid; gap: 6px; }
    .panel > .grid { max-height: 280px; overflow-y: auto; margin-top: 8px; align-content: flex-start; }
    .more { margin-top: 8px; border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 7px 14px; font-weight: 700; font-size: 13px; cursor: pointer; }
    .row .more { margin: 0; }
    .more:hover { color: var(--hub-text); }
    .none { margin: 12px 4px; color: var(--hub-muted); font-size: 14px; }
    .pickbtn { width: 44px; height: 44px; font-size: 24px; line-height: 1; border-radius: 12px; border: 1px solid var(--hub-border); background: var(--hub-surface); cursor: pointer; padding: 0; color: inherit; }
    .overlay { position: fixed; inset: 0; z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0, 0, 0, .5); }
    .box { position: relative; width: min(440px, 100%); max-height: 86vh; overflow: auto; padding: 16px 14px 14px; border-radius: 22px; background: var(--hub-sheet); border: 1px solid var(--hub-border); box-shadow: var(--hub-shadow); }
    .box .search { padding-right: 40px; }
    .x { position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 50%; border: none; background: var(--hub-surface-2); color: var(--hub-text); cursor: pointer; }
  `;
}

if (!customElements.get('ksh-emoji-picker')) customElements.define('ksh-emoji-picker', KshEmojiPicker);
