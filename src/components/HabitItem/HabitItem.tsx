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
      <div className="flex gap-3 animate-in fade-in duration-200">
        <button
          onClick={() => setShowActions(false)}
          className="flex-1 py-4 px-5 rounded-2xl bg-slate-800 border border-slate-700
                     text-slate-300 font-semibold transition-all hover:bg-slate-700
                     min-h-16 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-4 px-5 rounded-2xl bg-red-500 border border-red-400
                     text-white font-semibold transition-all hover:bg-red-600
                     min-h-16 flex items-center justify-center gap-2 active:scale-[0.98]
                     shadow-lg shadow-red-500/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        flex items-center w-full py-4 px-5 rounded-2xl cursor-pointer
        transition-all duration-200 ease-out select-none
        min-h-16 gap-4 text-left shadow-lg
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${isCompleted 
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-500/30' 
          : 'bg-slate-800 shadow-slate-900/50 hover:bg-slate-750 active:scale-[0.98]'
        }
      `}
    >
      <span className="text-3xl leading-none select-none">{habit.emoji}</span>
      <span className={`flex-1 font-semibold text-base ${isCompleted ? 'text-white' : 'text-slate-100'}`}>
        {habit.name}
      </span>
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${isCompleted 
            ? 'bg-white/20 backdrop-blur-sm' 
            : 'bg-slate-700 border-2 border-slate-600'
          }
        `}
      >
        {isCompleted && (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
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
