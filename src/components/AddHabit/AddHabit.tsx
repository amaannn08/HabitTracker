import { useState, useRef, useEffect } from 'react';

interface AddHabitProps {
  onAdd: (name: string, emoji: string) => void;
}

const EMOJI_OPTIONS = ['📚', '🏃', '💪', '🧘', '💧', '🍎', '😴', '✍️', '🎯', '🧹', '💰', '📱', '🎨', '🎵', '🌱', '☀️'];

export function AddHabit({ onAdd }: AddHabitProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), emoji);
      setName('');
      setEmoji('📚');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setEmoji('📚');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-5 rounded-xl border-2 border-dashed border-slate-600 
                   text-slate-400 hover:border-emerald-500 hover:text-emerald-500
                   active:scale-[0.98] transition-all duration-200
                   flex items-center justify-center gap-2
                   min-h-16 font-medium"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New Habit
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-slate-800 rounded-xl border-2 border-emerald-500 p-4 animate-in slide-in-from-top-2 duration-200"
    >
      <div className="mb-4">
        <label htmlFor="habit-name" className="block text-sm text-slate-400 mb-2 font-medium">
          Habit Name
        </label>
        <input
          ref={inputRef}
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Read for 30 minutes"
          maxLength={50}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg
                     text-slate-100 placeholder-slate-500 text-base
                     focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                     transition-all"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2 font-medium">Choose an Emoji</label>
        <div className="grid grid-cols-8 gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`aspect-square rounded-lg text-xl flex items-center justify-center
                         transition-all duration-150 active:scale-90
                         ${emoji === e 
                           ? 'bg-emerald-500/20 ring-2 ring-emerald-500 scale-110' 
                           : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-3 px-4 rounded-lg bg-slate-700 text-slate-300
                     hover:bg-slate-600 active:scale-[0.98] transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 py-3 px-4 rounded-lg bg-emerald-500 text-white
                     hover:bg-emerald-600 active:scale-[0.98] transition-all font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          Add Habit
        </button>
      </div>
    </form>
  );
}
