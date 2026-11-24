// Home Assistant hands every card a new `hass` object each time ANY entity changes (several times a second in a busy home).
// Re-rendering the whole hub for each of those wastes the phone's battery and, away from home, makes it feel slow.
// The hub only needs `hass` for its connection, who is signed in, language, theme, the currency and the pictures of the
// people (person.* entities), so it re-renders only when one of those changes.
const SIGNATURE_EVERY_MS = 5000;

function signature(hass) {
  const states = hass?.states || {};
  let sig = '';
  for (const id in states) {
    if (id.startsWith('person.')) sig += `${id}=${states[id].attributes?.entity_picture || ''};`;
    else if (id.startsWith('calendar.')) sig += `${id};`;
  }
  return sig;
}

/**
 * Does this change of `hass` matter? `memo` is a small object the caller keeps ({}), used to look at the entities
 * (O(number of entities)) at most every few seconds.
 */
export function hassMatters(oldHass, newHass, memo) {
  if (!oldHass || !newHass) return true;
  if (oldHass.connection !== newHass.connection || oldHass.language !== newHass.language || oldHass.selectedLanguage !== newHass.selectedLanguage) return true;
  if (oldHass.locale?.language !== newHass.locale?.language || oldHass.themes?.darkMode !== newHass.themes?.darkMode || oldHass.selectedTheme !== newHass.selectedTheme) return true;
  if (oldHass.config?.currency !== newHass.config?.currency || oldHass.config?.unit_system !== newHass.config?.unit_system) return true;
  const a = oldHass.user, b = newHass.user;
  if (a !== b && (a?.id !== b?.id || a?.is_admin !== b?.is_admin || a?.name !== b?.name)) return true;
  const now = Date.now();
  if (now - (memo.at || 0) < SIGNATURE_EVERY_MS) return false;
  memo.at = now;
  const sig = signature(newHass);
  if (sig !== memo.sig) { memo.sig = sig; return true; }
  return false;
}
