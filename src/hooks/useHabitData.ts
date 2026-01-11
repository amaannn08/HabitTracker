import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { HabitData, DailyEntry, Habit } from '../types';
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
          updatedCompletedHabits = existingEntry.completedHabits.includes(habitId)
            ? existingEntry.completedHabits.filter((id) => id !== habitId)
            : [...existingEntry.completedHabits, habitId];
        } else {
          updatedCompletedHabits = [habitId];
        }

        const updatedEntry: DailyEntry = {
          date: today,
          completedHabits: updatedCompletedHabits,
        };

        const updatedEntries =
          existingEntryIndex >= 0
            ? prev.entries.map((e, i) => (i === existingEntryIndex ? updatedEntry : e))
            : [...prev.entries, updatedEntry];

        return { ...prev, entries: updatedEntries };
      });
    },
    [setData, today]
  );

  // Add a new habit
  const addHabit = useCallback(
    (name: string, emoji: string) => {
      const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const newHabit: Habit = { id, name, emoji };
      setData((prev) => ({
        ...prev,
        habits: [...prev.habits, newHabit],
      }));
    },
    [setData]
  );

  // Delete a habit
  const deleteHabit = useCallback(
    (habitId: string) => {
      setData((prev) => ({
        ...prev,
        habits: prev.habits.filter((h) => h.id !== habitId),
        // Also remove from all entries
        entries: prev.entries.map((e) => ({
          ...e,
          completedHabits: e.completedHabits.filter((id) => id !== habitId),
        })),
      }));
    },
    [setData]
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

  // Calculate current streak (consecutive days with ALL habits completed)
  const currentStreak = useMemo(() => {
    if (data.habits.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i <= 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry = data.entries.find((e) => e.date === dateStr);
      const completedCount = entry ? entry.completedHabits.filter(id => 
        data.habits.some(h => h.id === id)
      ).length : 0;
      
      // All habits must be completed for the day to count
      if (completedCount === data.habits.length) {
        streak++;
      } else {
        // If today is not complete yet, don't break the streak
        if (i === 0) continue;
        break;
      }
    }
    
    return streak;
  }, [data.entries, data.habits]);

  // Calculate longest streak
  const longestStreak = useMemo(() => {
    if (data.habits.length === 0 || data.entries.length === 0) return 0;

    const sortedEntries = [...data.entries].sort((a, b) => a.date.localeCompare(b.date));
    let longest = 0;
    let current = 0;
    let prevDate: Date | null = null;

    for (const entry of sortedEntries) {
      const completedCount = entry.completedHabits.filter(id => 
        data.habits.some(h => h.id === id)
      ).length;
      
      if (completedCount === data.habits.length) {
        const entryDate = new Date(entry.date + 'T00:00:00');
        
        if (prevDate) {
          const diffDays = Math.round((entryDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            current++;
          } else {
            current = 1;
          }
        } else {
          current = 1;
        }
        
        prevDate = entryDate;
        longest = Math.max(longest, current);
      } else {
        current = 0;
        prevDate = null;
      }
    }

    return longest;
  }, [data.entries, data.habits]);

  return {
    habits: data.habits,
    todayEntry,
    toggleHabit,
    addHabit,
    deleteHabit,
    isHabitCompleted,
    getCompletionHistory,
    currentStreak,
    longestStreak,
    today,
  };
}
