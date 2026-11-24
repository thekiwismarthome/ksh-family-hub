// "Who is using this device?" The person a request is made for. A Home Assistant user linked to a person is that
// person; a shared tablet (an administrator or an unlinked login) picks a person, remembered per device and login.
// A person with a PIN also leaves a token on the device after the PIN was entered: the integration asks for it
// whenever a shared login acts for that person.
const key = hass => `ksh_hub_person_${hass?.user?.id || ''}`;
const tokenKey = hass => `ksh_hub_pin_token_${hass?.user?.id || ''}`;
export const ACTING_EVENT = 'ksh-acting-changed';

const read = k => { try { return localStorage.getItem(k) || null; } catch { return null; } };

export function getActing(hass) { return read(key(hass)); }

export function getToken(hass) {
  try { const t = JSON.parse(read(tokenKey(hass)) || 'null'); return t && t.person === getActing(hass) ? t.token : null; } catch { return null; }
}

export function setActing(hass, id, token = null) {
  try {
    if (id) localStorage.setItem(key(hass), id); else localStorage.removeItem(key(hass));
    if (id && token) localStorage.setItem(tokenKey(hass), JSON.stringify({ person: id, token }));
    else localStorage.removeItem(tokenKey(hass));
  } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(ACTING_EVENT));
}

/** Keep a fresh token for the person who is already acting (after a PIN was set or checked). */
export function setToken(hass, token) {
  const id = getActing(hass);
  try { if (id && token) localStorage.setItem(tokenKey(hass), JSON.stringify({ person: id, token })); } catch { /* ignore */ }
}

/**
 * Who is acting right now: an administrator or an unlinked login uses the remembered choice, a linked login is
 * always that person. `people` and `me` come from ksh_family_hub/people/list.
 */
export function resolveActing(hass, people, me) {
  const admin = !!hass?.user?.is_admin;
  const stored = getActing(hass);
  const ok = id => id && people.some(p => p.id === id);
  if (!admin && me) return me;
  if (ok(stored)) return stored;
  return me || null;
}

/** The fields every acting request carries. */
export function actingMsg(hass, acting) {
  const msg = {};
  if (acting) {
    msg.as_person = acting;
    const token = getToken(hass);
    if (token) msg.pin_token = token;
  }
  return msg;
}
