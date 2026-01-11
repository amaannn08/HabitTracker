import type { Habit } from '../../types';
import { HabitItem } from '../HabitItem/HabitItem';
import { AddHabit } from '../AddHabit/AddHabit';

interface HabitListProps {
  habits: Habit[];
  isHabitCompleted: (habitId: string) => boolean;
  onToggle: (habitId: string) => void;
  onAdd: (name: string, emoji: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitList({ habits, isHabitCompleted, onToggle, onAdd, onDelete }: HabitListProps) {
  const completedCount = habits.filter((h) => isHabitCompleted(h.id)).length;
  const totalCount = habits.length;

  return (
    <section className="py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bitter text-lg font-semibold text-slate-400 uppercase tracking-wider">
          Today's Habits
        </h2>
        {totalCount > 0 && (
          <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
            completedCount === totalCount 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-slate-700 text-slate-400'
          }`}>
            {completedCount}/{totalCount}
          </span>
        )}
      </div>
      
      {habits.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <div className="text-4xl mb-3">📝</div>
          <p className="mb-4">No habits yet. Add your first habit to get started!</p>
        </div>
      ) : null}
      
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {habits.map((habit) => (
          <li key={habit.id}>
            <HabitItem
              habit={habit}
              isCompleted={isHabitCompleted(habit.id)}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          </li>
        ))}
        <li>
          <AddHabit onAdd={onAdd} />
        </li>
      </ul>
      
      {/* Hint for delete */}
      {habits.length > 0 && (
        <p className="text-xs text-slate-600 text-center mt-4">
          Long press or right-click a habit to delete it
        </p>
      )}
    </section>
  );
}
