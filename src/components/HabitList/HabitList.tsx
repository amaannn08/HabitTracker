import type { Habit } from '../../types';
import { HabitItem } from '../HabitItem/HabitItem';

interface HabitListProps {
  habits: Habit[];
  isHabitCompleted: (habitId: string) => boolean;
  onToggle: (habitId: string) => void;
}

export function HabitList({ habits, isHabitCompleted, onToggle }: HabitListProps) {
  return (
    <section className="py-6 px-4">
      <h2 className="font-bitter text-lg font-semibold text-slate-400 mb-4 uppercase tracking-wider">
        Today's Habits
      </h2>
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {habits.map((habit) => (
          <li key={habit.id}>
            <HabitItem
              habit={habit}
              isCompleted={isHabitCompleted(habit.id)}
              onToggle={onToggle}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
