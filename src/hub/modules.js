// Everything that can appear in the hub menu, in the default menu order (each login can reorder it).
//   module: backend module that must be enabled for the entry to show (omitted = always)
//   soon:   not built yet, opens a placeholder page
export const ITEMS = [
  { id: 'home',       label: 'Home',       icon: 'mdi:home-outline',               color: '#7fe3c8', home: true },
  { id: 'shopping',   label: 'Shopping',   icon: 'mdi:cart-outline',               color: '#2fb585', module: 'shopping' },
  { id: 'meals',      label: 'Meals',      icon: 'mdi:silverware-fork-knife',      color: '#f0903f', module: 'recipes' },
  { id: 'chores',     label: 'Chores',     icon: 'mdi:check-circle-outline',       color: '#3db6cc', module: 'chores' },
  { id: 'calendar',   label: 'Calendar',   icon: 'mdi:calendar-month-outline',     color: '#8f7cf0', module: 'calendar' },
  { id: 'finance',    label: 'Finance',    icon: 'mdi:piggy-bank-outline',         color: '#4a86f0', module: 'finance' },
  { id: 'wishlist',   label: 'Wishlist',   icon: 'mdi:heart-outline',              color: '#e8639f', soon: true },
  { id: 'medicine',   label: 'Medicine',   icon: 'mdi:bottle-tonic-plus-outline',  color: '#33b98a', soon: true },
  { id: 'reminders',  label: 'Reminders',  icon: 'mdi:bell-outline',               color: '#6f80f2', soon: true },
  { id: 'birthdays',  label: 'Birthdays',  icon: 'mdi:cake-variant-outline',       color: '#cf6fb6', soon: true },
  { id: 'expiry',     label: 'Expiry',     icon: 'mdi:archive-outline',            color: '#e46d5e', soon: true },
  { id: 'cards',      label: 'Cards',      icon: 'mdi:credit-card-outline',        color: '#7069f2', module: 'shopping' },
  { id: 'timetables', label: 'Timetables', icon: 'mdi:view-week-outline',          color: '#7388d8', soon: true },
  { id: 'chat',       label: 'Chat',       icon: 'mdi:forum-outline',              color: '#6272dc', soon: true },
  { id: 'location',   label: 'Location',   icon: 'mdi:map-marker-outline',         color: '#e5755f', soon: true },
];

export const SUB_TABS = {
  finance: [
    { view: 'overview', label: 'Overview', icon: 'mdi:piggy-bank-outline' },
    { view: 'history',  label: 'History',  icon: 'mdi:history' },
  ],
  calendar: [
    { view: 'month',    label: 'Month',    icon: 'mdi:calendar-month' },
    { view: 'week',     label: 'Week',     icon: 'mdi:calendar-week' },
    { view: 'day',      label: 'Day',      icon: 'mdi:calendar-today' },
    { view: 'agenda',   label: 'Agenda',   icon: 'mdi:format-list-bulleted' },
    { view: 'settings', label: 'Settings', icon: 'mdi:cog-outline' },
  ],
  chores: [
    { view: 'today',    label: 'Today',    icon: 'mdi:calendar-check-outline' },
    { view: 'chores',   label: 'Chores',   icon: 'mdi:format-list-checks' },
    { view: 'routines', label: 'Routines', icon: 'mdi:weather-sunny' },
    { view: 'points',   label: 'Points',   icon: 'mdi:star-outline' },
    { view: 'settings', label: 'Settings', icon: 'mdi:cog-outline' },
  ],
  shopping: [
    { view: 'shopping', label: 'Shopping', icon: 'mdi:cart-outline' },
    { view: 'lists',    label: 'Lists',    icon: 'mdi:format-list-bulleted' },
    { view: 'settings', label: 'Settings', icon: 'mdi:cog-outline' },
  ],
  meals: [
    { view: 'grid',     label: 'Recipes',  icon: 'mdi:book-open-variant' },
    { view: 'planner',  label: 'Planner',  icon: 'mdi:calendar-week' },
    { view: 'timers',   label: 'Timers',   icon: 'mdi:timer-outline' },
    { view: 'settings', label: 'Settings', icon: 'mdi:cog-outline' },
  ],
};

/** Menu entries that are currently available: backend part on, and not switched off by an admin. */
export function visibleItems(modules, hidden = []) {
  return ITEMS.filter(i => i.home || ((!i.module || modules?.[i.module]) && !hidden.includes(i.id)));
}

/**
 * Put the menu in the order a person chose. Entries they have not placed yet (new ones) follow in the default order.
 * Home always comes first.
 */
export function orderItems(items, order = []) {
  const rank = id => { const i = order.indexOf(id); return i < 0 ? Infinity : i; };
  const home = items.filter(i => i.home);
  const rest = items.filter(i => !i.home).map((i, n) => ({ i, n })).sort((a, b) => rank(a.i.id) - rank(b.i.id) || a.n - b.n);
  return [...home, ...rest.map(x => x.i)];
}

export const BAR_SLOTS = 3;     // entries in the phone's bottom bar after Home; the rest are in More

export const itemById = id => ITEMS.find(i => i.id === id);
