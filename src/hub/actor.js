// "Who is using this device?" The person a request is made for. A Home Assistant user linked to a person is that
// person; a shared tablet (an administrator or an unlinked login) picks a person, remembered per device and login.
const key = hass => `ksh_hub_person_${hass?.user?.id || ''}`;

export function getActing(hass) {
  try { return localStorage.getItem(key(hass)) || null; } catch { return null; }
}

export function setActing(hass, id) {
  try { if (id) localStorage.setItem(key(hass), id); else localStorage.removeItem(key(hass)); } catch { /* ignore */ }
}
