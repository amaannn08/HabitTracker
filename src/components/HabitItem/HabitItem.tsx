import { memo, useState } from 'react';
import type { Habit } from '../../types';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export const HabitItem = memo(function HabitItem({ habit, isCompleted, onToggle, onDelete }: HabitItemProps) {
  const [showActions, setShowActions] = useState(false);

  const handleClick = () => {
    if (!showActions) {
      onToggle(habit.id);
    }
  };

  const handleLongPress = () => {
    setShowActions(true);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${habit.name}"? This will remove all history for this habit.`)) {
      onDelete(habit.id);
    }
    setShowActions(false);
  };

  // Long press detection for mobile
  let pressTimer: ReturnType<typeof setTimeout>;

  const handleTouchStart = () => {
    pressTimer = setTimeout(handleLongPress, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  if (showActions) {
    return (
      <div className="flex gap-2 animate-in fade-in duration-200">
        <button
          onClick={() => setShowActions(false)}
          className="flex-1 py-4 px-5 rounded-xl bg-slate-800 border-2 border-slate-600
                     text-slate-300 font-medium transition-colors hover:bg-slate-700
                     min-h-16 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-4 px-5 rounded-xl bg-red-500/20 border-2 border-red-500
                     text-red-400 font-medium transition-colors hover:bg-red-500/30
                     min-h-16 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      aria-pressed={isCompleted}
      className={`
        flex items-center w-full py-4 px-5 rounded-xl cursor-pointer
        transition-all duration-200 ease-out select-none
        min-h-16 gap-3.5 text-left
        border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${isCompleted 
          ? 'bg-emerald-500/10 border-emerald-500' 
          : 'bg-slate-800 border-slate-700 hover:border-emerald-500 active:scale-[0.98]'
        }
      `}
    >
      <span className="text-2xl leading-none select-none">{habit.emoji}</span>
      <span className={`flex-1 font-medium ${isCompleted ? 'text-emerald-400' : 'text-slate-100'}`}>
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
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
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
