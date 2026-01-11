// Core type definitions for the habit tracker

export interface Habit {
  id: string;
  name: string;
  emoji: string;
}

export interface DailyEntry {
  date: string; // ISO date string YYYY-MM-DD
  completedHabits: string[]; // Array of habit IDs that were completed
}

export interface HabitData {
  habits: Habit[];
  entries: DailyEntry[];
}

// Default habits as specified
export const DEFAULT_HABITS: Habit[] = [
  { id: 'development', name: 'Development', emoji: '💻' },
  { id: 'dsa-practice', name: 'DSA Practice', emoji: '🧮' },
  { id: 'walking', name: 'Walking', emoji: '🚶' },
];

