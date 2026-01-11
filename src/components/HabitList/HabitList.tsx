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
    <section className="py-3 px-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-white">
          Today
        </h2>
        {totalCount > 0 && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            completedCount === totalCount 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-700 text-slate-300'
          }`}>
            {completedCount}/{totalCount}
          </span>
        )}
      </div>
      
      {habits.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <div className="text-3xl mb-2">📝</div>
          <p className="text-sm">Add your first habit!</p>
        </div>
      ) : null}
      
      <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
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
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Long press to delete
        </p>
      )}
    </section>
  );
}
