export const WEEKLY_SCHEDULE: Record<number, string> = {
  1: 'Push + Core',    // Monday
  2: 'Easy Run 4-5km', // Tuesday
  3: 'Pull',           // Wednesday
  4: 'Tempo/Intervals',// Thursday
  5: 'Legs (light)',   // Friday
  6: 'Rest',           // Saturday
  0: 'Long Run',       // Sunday
};

export const DAILY_TARGETS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 60,
};

export const GOALS = {
  half_marathon: { target: 21, unit: 'km', label: 'Half Marathon', targetDate: '2026-07-14' },
  body_weight: { target: 67.5, unit: 'kg', label: 'Target Weight', startWeight: 72.5 },
  body_fat: { target: 11.5, unit: '%', label: 'Body Fat', startBf: 15.5 },
};
