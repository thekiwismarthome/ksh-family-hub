// Everything the calendar shows for a stretch of days, from three places:
//  - the hub's own events (school, sport, appointments, reminders, birthdays)
//  - chores that fall on those days (when Chores is on and the calendar is set to show them)
//  - events of the Home Assistant calendars an adult picked in the calendar settings
import { CATEGORIES, categoryById, CHORE_COLOR, HA_COLOR } from './categories.js';

export const pad = n => String(n).padStart(2, '0');
export const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const mondayOf = d => addDays(d, -((d.getDay() + 6) % 7));

const sortKey = e => `${e.date}|${e.all_day ? '0' : '1'}|${e.start_time || ''}|${e.title.toLowerCase()}`;

/**
 * @param acting  {id, role, ...} of the person using the calendar (to show only the chores that are theirs)
 * @returns {events, settings}  events: [{key, kind: 'event'|'chore'|'ha', date, title, emoji, color, all_day, start_time, end_time, ...}]
 */
// The calendar settings from the last load. The chores and the Home Assistant calendars are asked for at the same moment as
// the family events (not after them), which saves a whole round trip on a slow connection. If the settings turn out to have
// changed, what is missing is fetched then.
let lastSettings = null;

export async function loadEvents(hass, startIso, endIso, { acting, modules, msg = {}, haPicked } = {}) {
  const out = [];
  let settings = { ha_calendars: [], show_chores: true };

  const wants = cfg => ({ chores: !!(modules?.chores && cfg.show_chores), ha: haPicked || cfg.ha_calendars || [] });
  const fetchFor = (w, skip = {}) => {
    const jobs = [];
    if (w.chores && !skip.chores) jobs.push(chores(hass, startIso, endIso, acting).then(r => ({ tag: 'chores', r })).catch(() => null));
    w.ha.forEach((entity, n) => {
      if (!skip.ha?.has(entity)) jobs.push(haEvents(hass, entity, n, startIso, endIso).then(r => ({ tag: `ha:${entity}`, r })).catch(() => null));
    });
    return Promise.all(jobs).then(list => list.filter(Boolean));
  };

  const early = lastSettings && !haPicked ? fetchFor(wants(lastSettings)) : null;
  if (modules?.calendar) {
    const res = await hass.callWS({ type: 'ksh_calendar/get_events', start: startIso, end: endIso, ...msg });
    settings = res.settings;
    for (const e of res.events) {
      const cat = categoryById(e.category);
      out.push({ ...e, key: `e:${e.event_id}:${e.occurs}`, kind: 'event', date: e.occurs, color: cat.color,
        span: e.end_date ? { start: e.date, end: e.end_date } : null });
    }
  }
  if (!haPicked) lastSettings = settings;

  const w = wants(settings);
  let got;
  if (early) {
    got = (await early).filter(g => (g.tag === 'chores' ? w.chores : w.ha.includes(g.tag.slice(3))));
    const skip = { chores: got.some(g => g.tag === 'chores'), ha: new Set(got.filter(g => g.tag !== 'chores').map(g => g.tag.slice(3))) };
    got = got.concat(await fetchFor(w, skip));
  } else {
    got = await fetchFor(w);
  }
  for (const g of got) out.push(...g.r);
  out.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  return { events: out, settings };
}

async function chores(hass, startIso, endIso, acting) {
  const res = await hass.callWS({ type: 'ksh_chores/get_range', start: startIso, end: endIso });
  const byId = Object.fromEntries(res.chores.map(c => [c.id, c]));
  const adult = !acting || acting.role === 'adult';
  return res.items.map(i => ({ i, c: byId[i.chore_id] })).filter(({ c }) => c).filter(({ c }) => {
    const who = c.assignees || [];
    return adult || (who.length ? who.includes(acting.id) : acting.role === 'child');
  }).map(({ i, c }) => ({
    key: `c:${i.chore_id}:${i.date}`, kind: 'chore', date: i.date, title: c.name, emoji: c.emoji, color: CHORE_COLOR,
    all_day: !c.due_time, start_time: c.due_time || null, end_time: null, status: i.status, people: c.assignees || [],
    points: c.points, location: '', notes: '',
  }));
}

async function haEvents(hass, entity, index, startIso, endIso) {
  const from = fromIso(startIso);
  const to = addDays(fromIso(endIso), 1);
  const list = await hass.callApi('GET', `calendars/${entity}?start=${encodeURIComponent(from.toISOString())}&end=${encodeURIComponent(to.toISOString())}`);
  const name = hass.states?.[entity]?.attributes?.friendly_name || entity;
  const out = [];
  for (const ev of list || []) {
    const allDay = !!ev.start?.date;
    const s = allDay ? fromIso(ev.start.date) : new Date(ev.start.dateTime || ev.start);
    const e = allDay ? addDays(fromIso(ev.end?.date || ev.start.date), -1) : new Date(ev.end?.dateTime || ev.end || s);   // an all day event ends the day before its end date
    const days = Math.max(0, Math.round((new Date(e.getFullYear(), e.getMonth(), e.getDate()) - new Date(s.getFullYear(), s.getMonth(), s.getDate())) / 864e5));
    for (let n = 0; n <= Math.min(days, 60); n++) {
      const day = addDays(new Date(s.getFullYear(), s.getMonth(), s.getDate()), n);
      if (iso(day) < startIso || iso(day) > endIso) continue;
      out.push({
        key: `h:${entity}:${ev.uid || ev.summary}:${iso(day)}`, kind: 'ha', date: iso(day), title: ev.summary || '(no title)', emoji: '🗓️',
        color: HA_COLOR, all_day: allDay || days > 0, start_time: allDay || days > 0 ? null : `${pad(s.getHours())}:${pad(s.getMinutes())}`,
        end_time: allDay || days > 0 ? null : `${pad(e.getHours())}:${pad(e.getMinutes())}`,
        location: ev.location || '', notes: ev.description || '', calendar: name, people: [],
      });
    }
  }
  return out;
}

export function timeLabel(e) {
  if (e.all_day) return 'All day';
  return e.end_time ? `${e.start_time} – ${e.end_time}` : e.start_time;
}

export { CATEGORIES };
