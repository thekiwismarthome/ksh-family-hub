// How a person looks everywhere in the hub: their own picture, the Home Assistant picture of their login, or an emoji.
import { html, css } from 'lit';

/** The picture to show for a person, or null for the emoji. */
export function picOf(hass, p) {
  if (!p?.photo) return null;
  if (p.photo.startsWith('data:')) return p.photo;
  if (p.photo === 'ha') return haPicture(hass, p);
  return null;
}

/** The Home Assistant picture of the login a person is linked to (from its person entity). */
export function haPicture(hass, p) {
  if (!p?.user_id) return null;
  const st = Object.values(hass?.states || {}).find(x => x.entity_id?.startsWith('person.') && x.attributes?.user_id === p.user_id);
  return st?.attributes?.entity_picture || null;
}

/** What goes inside a round face: the picture, or the emoji. */
export function faceContent(hass, p) {
  const pic = picOf(hass, p);
  return pic ? html`<img src=${pic} alt=${p?.name || ''} draggable="false">` : (p?.emoji || '🙂');
}

/** A round avatar in the person's colour. `size` is in pixels. */
export function avatar(hass, p, size = 28) {
  return html`<span class="av" style="--p:${p?.color || '#4fd1a1'};--sz:${size}px" title=${p?.name || ''}>${faceContent(hass, p)}</span>`;
}

/** A small avatar followed by the name, for chips and lists. */
export function avatarName(hass, p, size = 22) {
  return html`${avatar(hass, p, size)}<span class="pn">${p?.name || ''}</span>`;
}

export const avatarCss = css`
  .av { width: var(--sz, 28px); height: var(--sz, 28px); border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center;
    font-size: calc(var(--sz, 28px) * 0.55); line-height: 1; overflow: hidden; vertical-align: middle;
    background: color-mix(in srgb, var(--p) 28%, transparent); border: 2px solid var(--p); box-sizing: border-box; }
  .av img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .chip:has(.av) { display: inline-flex; align-items: center; gap: 7px; padding-left: 5px; }
`;

/** Shrink a chosen image to a small square (centre crop) and return it as a JPEG data URL, so it stays small to store. */
export async function shrinkImage(file, size = 160) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('That does not look like a picture'));
      el.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    canvas.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}
