// The standard list of chores to pick from. Points are a suggestion; everything can be changed afterwards.
const D = { type: 'daily' };
const W = (...days) => ({ type: 'weekly', days });          // 0 = Monday ... 6 = Sunday
const WEEKEND = W(5);

export const CHORE_TEMPLATES = [
  { name: 'Make bed', emoji: '🛏️', points: 1, recurrence: D, group: 'Bedroom' },
  { name: 'Tidy bedroom', emoji: '🧸', points: 2, recurrence: D, group: 'Bedroom' },
  { name: 'Put away clothes', emoji: '👕', points: 1, recurrence: D, group: 'Bedroom' },
  { name: 'Change bedsheets', emoji: '🛏️', points: 3, recurrence: WEEKEND, group: 'Bedroom' },
  { name: 'Brush teeth', emoji: '🪥', points: 1, recurrence: D, group: 'Self care' },
  { name: 'Pack school bag', emoji: '🎒', points: 1, recurrence: W(0, 1, 2, 3, 4), group: 'Self care' },
  { name: 'Homework', emoji: '📚', points: 2, recurrence: W(0, 1, 2, 3), group: 'Self care' },
  { name: 'Practise instrument', emoji: '🎹', points: 2, recurrence: D, group: 'Self care' },
  { name: 'Set the table', emoji: '🍽️', points: 1, recurrence: D, group: 'Kitchen' },
  { name: 'Clear the table', emoji: '🥣', points: 1, recurrence: D, group: 'Kitchen' },
  { name: 'Load the dishwasher', emoji: '🫧', points: 2, recurrence: D, group: 'Kitchen' },
  { name: 'Unload the dishwasher', emoji: '🍴', points: 2, recurrence: D, group: 'Kitchen' },
  { name: 'Wash the dishes', emoji: '🧼', points: 2, recurrence: D, group: 'Kitchen' },
  { name: 'Wipe the benches', emoji: '🧽', points: 1, recurrence: D, group: 'Kitchen' },
  { name: 'Help cook dinner', emoji: '🍳', points: 3, recurrence: W(2, 4), group: 'Kitchen' },
  { name: 'Take out the rubbish', emoji: '🗑️', points: 2, recurrence: W(1, 4), group: 'Around the house' },
  { name: 'Put the bins out', emoji: '♻️', points: 2, recurrence: W(1), group: 'Around the house' },
  { name: 'Vacuum', emoji: '🧹', points: 3, recurrence: WEEKEND, group: 'Around the house' },
  { name: 'Mop the floors', emoji: '🪣', points: 3, recurrence: WEEKEND, group: 'Around the house' },
  { name: 'Tidy the living room', emoji: '🛋️', points: 2, recurrence: D, group: 'Around the house' },
  { name: 'Clean the bathroom', emoji: '🛁', points: 5, recurrence: WEEKEND, group: 'Around the house' },
  { name: 'Do the laundry', emoji: '🧺', points: 3, recurrence: W(0, 3), group: 'Laundry' },
  { name: 'Fold the laundry', emoji: '👚', points: 2, recurrence: W(0, 3), group: 'Laundry' },
  { name: 'Feed the pets', emoji: '🐶', points: 1, recurrence: D, group: 'Pets & garden' },
  { name: 'Walk the dog', emoji: '🦮', points: 3, recurrence: D, group: 'Pets & garden' },
  { name: 'Clean the litter tray', emoji: '🐱', points: 2, recurrence: D, group: 'Pets & garden' },
  { name: 'Water the plants', emoji: '🪴', points: 1, recurrence: W(1, 4), group: 'Pets & garden' },
  { name: 'Mow the lawn', emoji: '🌱', points: 5, recurrence: WEEKEND, group: 'Pets & garden' },
  { name: 'Weed the garden', emoji: '🌼', points: 3, recurrence: WEEKEND, group: 'Pets & garden' },
  { name: 'Wash the car', emoji: '🚗', points: 4, recurrence: WEEKEND, group: 'Pets & garden' },
];

// Standard routines (steps are a suggestion too)
export const ROUTINE_TEMPLATES = [
  {
    name: 'Morning routine', emoji: '☀️', kind: 'morning', points: 3,
    steps: [
      { text: 'Get dressed', emoji: '👕' }, { text: 'Eat breakfast', emoji: '🥣' }, { text: 'Brush teeth', emoji: '🪥' },
      { text: 'Pack school bag', emoji: '🎒' }, { text: 'Shoes on', emoji: '👟' },
    ],
  },
  {
    name: 'Evening routine', emoji: '🌙', kind: 'evening', points: 3,
    steps: [
      { text: 'Tidy toys away', emoji: '🧸' }, { text: 'Dishes to the bench', emoji: '🍽️' }, { text: 'Bath or shower', emoji: '🛁' },
      { text: 'Pyjamas on', emoji: '🩳' }, { text: 'Brush teeth', emoji: '🪥' }, { text: 'Read a book', emoji: '📖' },
    ],
  },
];

export const EMOJIS = ['✅', '🧹', '🧺', '🍽️', '🗑️', '🛏️', '🪥', '📚', '🐶', '🐱', '🌱', '🚗', '🧸', '🎒', '🍳', '🪴',
  '🛁', '👕', '🦖', '🦄', '🚀', '⭐', '🙂', '😎', '🦊', '🐼', '🐯', '🦋'];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
