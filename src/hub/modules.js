// Everything that can appear in the hub menu, in menu order.
//   module: backend module that must be enabled for the entry to show (omitted = always)
//   soon:   not built yet, opens a placeholder page
//   locked: shown with a padlock badge (future / premium areas)
export const ITEMS = [
  { id: 'home',       label: 'Home',       icon: 'mdi:home-outline',               color: '#7fe3c8', primary: true, home: true },
  { id: 'shopping',   label: 'Shopping',   icon: 'mdi:cart-outline',               color: '#2fb585', primary: true, module: 'shopping' },
  { id: 'meals',      label: 'Meals',      icon: 'mdi:silverware-fork-knife',      color: '#f0903f', primary: true, module: 'recipes' },
  { id: 'wishlist',   label: 'Wishlist',   icon: 'mdi:heart-outline',              color: '#e8639f', primary: true, soon: true },
  { id: 'chores',     label: 'Chores',     icon: 'mdi:check-circle-outline',       color: '#3db6cc', soon: true },
  { id: 'finances',   label: 'Finances',   icon: 'mdi:wallet-outline',             color: '#4a86f0', soon: true },
  { id: 'medicine',   label: 'Medicine',   icon: 'mdi:bottle-tonic-plus-outline',  color: '#33b98a', soon: true },
  { id: 'reminders',  label: 'Reminders',  icon: 'mdi:bell-outline',               color: '#6f80f2', soon: true },
  { id: 'birthdays',  label: 'Birthdays',  icon: 'mdi:cake-variant-outline',       color: '#cf6fb6', soon: true },
  { id: 'expiry',     label: 'Expiry',     icon: 'mdi:archive-outline',            color: '#e46d5e', soon: true },
  { id: 'cards',      label: 'Cards',      icon: 'mdi:credit-card-outline',        color: '#7069f2', soon: true },
  { id: 'routines',   label: 'Routines',   icon: 'mdi:weather-sunny-off',          color: '#e2ac3f', soon: true },
  { id: 'timetables', label: 'Timetables', icon: 'mdi:view-week-outline',          color: '#7388d8', soon: true, locked: true },
  { id: 'chat',       label: 'Chat',       icon: 'mdi:forum-outline',              color: '#6272dc', soon: true, locked: true },
  { id: 'location',   label: 'Location',   icon: 'mdi:map-marker-outline',         color: '#e5755f', soon: true, locked: true },
];

export const SUB_TABS = {
  shopping: [
    { view: 'shopping', label: 'Shopping', icon: 'mdi:cart-outline' },
    { view: 'lists',    label: 'Lists',    icon: 'mdi:format-list-bulleted' },
    { view: 'loyalty',  label: 'Cards',    icon: 'mdi:card-account-details-outline' },
    { view: 'settings', label: 'Settings', icon: 'mdi:cog-outline' },
  ],
  meals: [
    { view: 'grid',     label: 'Recipes',  icon: 'mdi:book-open-variant' },
    { view: 'planner',  label: 'Planner',  icon: 'mdi:calendar-week' },
    { view: 'timers',   label: 'Timers',   icon: 'mdi:timer-outline' },
    { view: 'settings', label: 'Settings', icon: 'mdi:cog-outline' },
  ],
};

/** Menu entries that are currently available, given which backend modules are on. */
export function visibleItems(modules) {
  return ITEMS.filter(i => !i.module || modules?.[i.module]);
}

export const itemById = id => ITEMS.find(i => i.id === id);
