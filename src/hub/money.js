// Money is kept in whole cents. These turn that into text for the screen and back again.
export function currencyOf(hass) { return hass?.config?.currency || 'NZD'; }

export function money(hass, cents, { sign = false } = {}) {
  const n = (Number(cents) || 0) / 100;
  let text;
  try {
    text = new Intl.NumberFormat(hass?.locale?.language || undefined, { style: 'currency', currency: currencyOf(hass) }).format(Math.abs(n));
  } catch { text = `${Math.abs(n).toFixed(2)}`; }
  if (n < 0) return `−${text}`;
  return sign && n > 0 ? `+${text}` : text;
}

/** "12.50", "12,5" or "$12" -> 1250. NaN when it is not a number. */
export function parseMoney(text) {
  const t = String(text ?? '').replace(/[^\d.,-]/g, '').replace(',', '.');
  if (!t) return 0;
  const n = Number(t);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

/** The text a money field should show for a number of cents */
export const moneyInput = cents => (cents ? (cents / 100).toFixed(2).replace(/\.00$/, '') : '');
