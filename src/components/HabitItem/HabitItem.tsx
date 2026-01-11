import { memo } from 'react';
import type { Habit } from '../../types';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (habitId: string) => void;
}

export const HabitItem = memo(function HabitItem({ habit, isCompleted, onToggle }: HabitItemProps) {
  const handleClick = () => onToggle(habit.id);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isCompleted}
      className={`
        flex items-center w-full py-4 px-5 rounded-xl cursor-pointer
        transition-all duration-200 ease-out
        min-h-16 gap-3.5 text-left
        border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${isCompleted 
          ? 'bg-emerald-500/10 border-emerald-500' 
          : 'bg-slate-800 border-slate-700 hover:border-emerald-500 hover:-translate-y-0.5'
        }
        active:translate-y-0
      `}
    >
      <span className="text-2xl leading-none">{habit.emoji}</span>
      <span className={`flex-1 font-medium ${isCompleted ? 'text-emerald-500' : 'text-slate-100'}`}>
        {habit.name}
      </span>
      <span
        className={`
          w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${isCompleted 
            ? 'bg-emerald-500 border-emerald-500' 
            : 'bg-slate-900 border-slate-600'
          }
        `}
      >
        {isCompleted && (
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white">
            <path
              fill="currentColor"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
            />
          </svg>
        )}
      </span>
    </button>
  );
});
