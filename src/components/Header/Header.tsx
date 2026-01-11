interface HeaderProps {
  date: string;
  currentStreak: number;
  longestStreak: number;
}

export function Header({ date, currentStreak, longestStreak }: HeaderProps) {
  // Format date for display
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="py-4 px-4 border-b border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title and Date */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
            Habit Tracker
          </h1>
          <p className="text-xs text-emerald-400 font-medium mt-0.5">{formattedDate}</p>
        </div>

        {/* Right: Streaks */}
        <div className="flex gap-3">
          {/* Current Streak */}
          <div className="text-center">
            <div className="text-2xl mb-0.5" role="img" aria-label="fire">🔥</div>
            <div className="text-lg font-bold text-white tabular-nums leading-none">{currentStreak}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Day</div>
          </div>

          {/* Best Streak */}
          <div className="text-center">
            <div className="text-2xl mb-0.5" role="img" aria-label="trophy">🏆</div>
            <div className="text-lg font-bold text-white tabular-nums leading-none">{longestStreak}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Best</div>
          </div>
        </div>
      </div>
    </header>
  );
}
