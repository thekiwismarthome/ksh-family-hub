// "Today" for the family is today at home, not today wherever the phone is. A phone abroad (or with a wrong clock zone)
// would otherwise show tomorrow's chores, or call something late that is not. Home Assistant's time zone is used
// (hass.config.time_zone); until it is known, the device's own.
let zone;

export function setTimeZone(tz) { zone = tz || undefined; }

function parts(d = new Date()) {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short',
  });
  const p = Object.fromEntries(f.formatToParts(d).map(x => [x.type, x.value]));
  return { y: p.year, m: p.month, d: p.day, h: p.hour === '24' ? '00' : p.hour, min: p.minute, wd: p.weekday };
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function todayIso(d) { const p = parts(d); return `${p.y}-${p.m}-${p.d}`; }
export function todayWeekday(d) { return WEEKDAYS.indexOf(parts(d).wd); }          // Monday = 0, like the backend
export function nowHHMM(d) { const p = parts(d); return `${p.h}:${p.min}`; }
