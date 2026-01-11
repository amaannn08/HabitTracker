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
    if (confirm(`Delete "${habit.name}"?`)) {
      onDelete(habit.id);
    }
    setShowActions(false);
  };

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
          className="flex-1 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800
                     text-zinc-300 text-sm font-medium transition-all hover:bg-zinc-800
                     flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-2 px-3 rounded-lg bg-red-600 border border-red-500
                     text-white text-sm font-medium transition-all hover:bg-red-700
                     flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
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
        flex items-center w-full py-2.5 px-3 rounded-xl cursor-pointer
        transition-all duration-150 ease-out select-none
        gap-3 text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        ${isCompleted 
          ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
          : 'bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98]'
        }
      `}
    >
      <span className="text-xl leading-none select-none">{habit.emoji}</span>
      <span className={`flex-1 font-medium text-sm ${isCompleted ? 'text-white' : 'text-zinc-100'}`}>
        {habit.name}
      </span>
      <div
        className={`
          w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
          transition-all duration-150
          ${isCompleted 
            ? 'bg-white/25' 
            : 'border-2 border-zinc-700'
          }
        `}
      >
        {isCompleted && (
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-white">
            <path
              fill="currentColor"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
            />
          </svg>
        )}
      </div>
    </button>
  );
});
