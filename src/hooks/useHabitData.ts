import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { HabitData, DailyEntry } from '../types';
import { DEFAULT_HABITS } from '../types';

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Get the last N days including today
export function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

const initialData: HabitData = {
  habits: DEFAULT_HABITS,
  entries: [],
};

export function useHabitData() {
  const [data, setData] = useLocalStorage<HabitData>(initialData);
  const today = getTodayDate();

  // Ensure today's entry exists, create if missing
  const todayEntry = useMemo(() => {
    return data.entries.find((e) => e.date === today) || { date: today, completedHabits: [] };
  }, [data.entries, today]);

  // Toggle a habit's completion status for today
  const toggleHabit = useCallback(
    (habitId: string) => {
      setData((prev) => {
        const existingEntryIndex = prev.entries.findIndex((e) => e.date === today);
        const existingEntry = existingEntryIndex >= 0 ? prev.entries[existingEntryIndex] : null;

        let updatedCompletedHabits: string[];

        if (existingEntry) {
          // Toggle the habit in existing entry
          updatedCompletedHabits = existingEntry.completedHabits.includes(habitId)
            ? existingEntry.completedHabits.filter((id) => id !== habitId)
            : [...existingEntry.completedHabits, habitId];
        } else {
          // Create new entry with this habit
          updatedCompletedHabits = [habitId];
        }

        const updatedEntry: DailyEntry = {
          date: today,
          completedHabits: updatedCompletedHabits,
        };

        // Update or append the entry
        const updatedEntries =
          existingEntryIndex >= 0
            ? prev.entries.map((e, i) => (i === existingEntryIndex ? updatedEntry : e))
            : [...prev.entries, updatedEntry];

        return { ...prev, entries: updatedEntries };
      });
    },
    [setData, today]
  );

  // Check if a habit is completed today
  const isHabitCompleted = useCallback(
    (habitId: string) => todayEntry.completedHabits.includes(habitId),
    [todayEntry]
  );

  // Get completion data for the last N days (for charts)
  const getCompletionHistory = useCallback(
    (days: number = 7) => {
      const dates = getLastNDays(days);
      const totalHabits = data.habits.length;

      return dates.map((date) => {
        const entry = data.entries.find((e) => e.date === date);
        const completed = entry ? entry.completedHabits.length : 0;
        
        return {
          date,
          completed,
          total: totalHabits,
          percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0,
        };
      });
    },
    [data.entries, data.habits.length]
  );

  return {
    habits: data.habits,
    todayEntry,
    toggleHabit,
    isHabitCompleted,
    getCompletionHistory,
    today,
  };
}

