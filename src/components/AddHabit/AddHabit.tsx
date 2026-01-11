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
        className="w-full py-2 px-3 rounded-lg border border-dashed border-zinc-700 
                   text-zinc-500 hover:border-emerald-500 hover:text-emerald-500
                   active:scale-[0.98] transition-all duration-150
                   flex items-center justify-center gap-1.5 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add Habit
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 animate-in slide-in-from-top-2 duration-200"
    >
      <div className="mb-3">
        <label htmlFor="habit-name" className="block text-xs text-zinc-400 mb-1.5 font-medium">
          Habit Name
        </label>
        <input
          ref={inputRef}
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Read 30 min"
          maxLength={50}
          className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg
                     text-zinc-100 placeholder-zinc-600 text-sm
                     focus:outline-none focus:border-emerald-500
                     transition-all"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Emoji</label>
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`aspect-square rounded-lg text-base flex items-center justify-center
                         transition-all duration-100 active:scale-90
                         ${emoji === e 
                           ? 'bg-emerald-600 ring-2 ring-emerald-500' 
                           : 'bg-zinc-800 hover:bg-zinc-700'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-2 px-3 rounded-lg bg-zinc-800 text-zinc-300 text-sm
                     hover:bg-zinc-700 active:scale-[0.98] transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white text-sm
                     hover:bg-emerald-700 active:scale-[0.98] transition-all font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </form>
  );
}
