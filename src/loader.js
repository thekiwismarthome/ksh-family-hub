// What Home Assistant loads on every page: a few hundred bytes. The dashboard cards <ksh-family-hub-card> and
// <ksh-family-hub-kids-card> are thin shells that fetch the real app (ksh-family-hub-app.js, cached by the browser)
// the first time one of them is actually put on a page. The sidebar panel loads the app directly.
import { CARD_VERSION } from 'virtual:card-version';

const appUrl = new URL(`./ksh-family-hub-app.js?v=${CARD_VERSION}`, import.meta.url).href;
let appPromise = null;
const loadApp = () => (appPromise ||= import(/* @vite-ignore */ appUrl));

function shell(core, size) {
  return class extends HTMLElement {
    static getStubConfig() { return core === 'ksh-family-hub-kids-core' ? { person: '' } : {}; }

    constructor() {
      super();
      this._config = {};
      this._hass = null;
      this._inner = null;
    }

    setConfig(config) {
      this._config = config || {};
      this._inner?.setConfig?.(this._config);
    }

    set hass(h) {
      this._hass = h;
      if (this._inner) this._inner.hass = h;
    }

    get hass() { return this._hass; }
    getCardSize() { return this._inner?.getCardSize?.() ?? size; }

    connectedCallback() {
      this.style.display = 'block';
      if (this._inner) return;
      if (!this.firstChild) {
        const hint = document.createElement('div');
        hint.style.cssText = 'padding:20px;opacity:.6;font:14px system-ui,sans-serif';
        hint.textContent = 'Loading…';
        this.appendChild(hint);
      }
      loadApp().then(() => {
        if (this._inner) return;
        const el = document.createElement(core);
        this.replaceChildren(el);
        this._inner = el;
        // the card's own size rules (height, kiosk sizing) belong to the real element
        try { el.setConfig(this._config); } catch (err) { console.warn(err); }
        if (this._hass) el.hass = this._hass;
      }).catch(err => {
        this.textContent = 'KSH Family Hub could not load. Reload the page.';
        console.warn('KSH Family Hub: could not load the app', err);
      });
    }
  };
}

if (!customElements.get('ksh-family-hub-card')) customElements.define('ksh-family-hub-card', shell('ksh-family-hub-core', 10));
if (!customElements.get('ksh-family-hub-kids-card')) customElements.define('ksh-family-hub-kids-card', shell('ksh-family-hub-kids-core', 8));

window.customCards = window.customCards || [];
for (const card of [
  { type: 'ksh-family-hub-card', name: 'KSH Family Hub', description: 'Shopping, meals, chores, calendar and pocket money for the family in one app.' },
  { type: 'ksh-family-hub-kids-card', name: 'KSH Family Hub: Kids view', description: 'A big, colourful chores, routines and points screen for one child, made for a bedside display.' },
]) {
  if (!window.customCards.some(c => c.type === card.type)) {
    window.customCards.push({ ...card, preview: false, documentationURL: 'https://github.com/thekiwismarthome/ksh-family-hub' });
  }
}
