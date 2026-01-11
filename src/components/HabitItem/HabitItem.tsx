import { memo, useState } from 'react';
import type { Habit } from '../../types';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export const HabitItem = memo(function HabitItem({ habit, isCompleted, onToggle, onDelete }: HabitItemProps) {
  const [showDelete, setShowDelete] = useState(false);

  const handleClick = () => onToggle(habit.id);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${habit.name}"? This will remove all history for this habit.`)) {
      onDelete(habit.id);
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
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
      
      {/* Delete button */}
      {showDelete && (
        <button
          onClick={handleDelete}
          className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-red-500 text-white
                     flex items-center justify-center hover:bg-red-600 transition-colors
                     shadow-lg"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});
