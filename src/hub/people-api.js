// The people of the family, as every screen needs them. A person's own photo is not sent with every list: the list says
// "h:<hash>", and the photo is fetched once, kept in memory and in the browser, and put back into the person here. So a
// list that is reloaded after every tick of a chore stays tiny.
const PREFIX = 'ksh_photo_';
const memory = new Map();

const read = hash => {
  if (memory.has(hash)) return memory.get(hash);
  try { const v = localStorage.getItem(PREFIX + hash); if (v) { memory.set(hash, v); return v; } } catch { /* ignore */ }
  return null;
};
const keep = (hash, photo) => {
  memory.set(hash, photo);
  try { localStorage.setItem(PREFIX + hash, photo); } catch { /* storage full or blocked: memory is enough */ }
};

/** ksh_family_hub/people/list, with each person's own photo filled in. Returns { people, me }. */
export async function loadPeople(hass) {
  const res = await hass.callWS({ type: 'ksh_family_hub/people/list' });
  const missing = [...new Set(res.people.map(p => p.photo).filter(ph => ph?.startsWith('h:') && !read(ph)))];
  if (missing.length) {
    try {
      const { photos } = await hass.callWS({ type: 'ksh_family_hub/people/photos', hashes: missing });
      for (const [hash, photo] of Object.entries(photos || {})) keep(hash, photo);
    } catch { /* the emoji shows instead */ }
  }
  return { ...res, people: res.people.map(p => (p.photo?.startsWith('h:') ? { ...p, photo: read(p.photo) } : p)) };
}
