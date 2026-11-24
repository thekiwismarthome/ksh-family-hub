// What kind of event it is: a default emoji and colour, so a week of school, sport and appointments reads at a glance.
export const CATEGORIES = [
  { id: 'school',   label: 'School',      emoji: '🎒', color: '#4a86f0' },
  { id: 'sport',    label: 'Sport',       emoji: '⚽', color: '#f0903f' },
  { id: 'medical',  label: 'Appointment', emoji: '🦷', color: '#e46d5e' },
  { id: 'reminder', label: 'Reminder',    emoji: '🔔', color: '#6f80f2' },
  { id: 'birthday', label: 'Birthday',    emoji: '🎂', color: '#cf6fb6' },
  { id: 'family',   label: 'Family',      emoji: '👨‍👩‍👧', color: '#4fd1a1' },
  { id: 'other',    label: 'Other',       emoji: '📌', color: '#8f7cf0' },
];
export const CHORE_COLOR = '#3db6cc';
export const HA_COLOR = '#7fa6c0';
export const categoryById = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const EVENT_EMOJIS = ['🎒', '📚', '⚽', '🏉', '🏊', '🎾', '🎹', '🎨', '🩰', '🦷', '🩺', '💉', '🔔', '🎂', '🎁', '🎉', '✈️', '🏖️', '🚗', '🛒', '👨‍👩‍👧', '🐶', '📌', '📞'];

export const REMIND_OPTIONS = [
  { value: null, label: 'No reminder' },
  { value: 0, label: 'At the time' },
  { value: 10, label: '10 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
];
