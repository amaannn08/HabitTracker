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
      <div className="flex flex-col gap-1 animate-in fade-in duration-200">
        <button
          onClick={handleDelete}
          className="py-2 px-2 rounded-lg bg-red-600
                     text-white text-xs font-medium transition-all hover:bg-red-700
                     flex items-center justify-center gap-1 active:scale-[0.98]"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
        <button
          onClick={() => setShowActions(false)}
          className="py-1.5 px-2 rounded-lg bg-zinc-800
                     text-zinc-400 text-xs font-medium transition-all hover:bg-zinc-700
                     flex items-center justify-center active:scale-[0.98]"
        >
          Cancel
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
        flex items-center w-full py-2 px-2.5 rounded-lg cursor-pointer
        transition-all duration-150 ease-out select-none
        gap-2 text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        ${isCompleted 
          ? 'bg-emerald-600' 
          : 'bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98]'
        }
      `}
    >
      <span className="text-lg leading-none select-none">{habit.emoji}</span>
      <span className={`flex-1 font-medium text-xs truncate ${isCompleted ? 'text-white' : 'text-zinc-200'}`}>
        {habit.name}
      </span>
      {isCompleted && (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white/70 flex-shrink-0">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      )}
    </button>
  );
});
