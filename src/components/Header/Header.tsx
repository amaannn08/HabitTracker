interface HeaderProps {
  date: string;
  currentStreak: number;
  longestStreak: number;
}

export function Header({ date, currentStreak, longestStreak }: HeaderProps) {
  // Format date for display
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="py-2.5 px-4 border-b border-zinc-800 bg-black/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left: Title and Date */}
        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-none">
            Habits
          </h1>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{formattedDate}</p>
        </div>

        {/* Right: Streaks - inline pills */}
        <div className="flex gap-1.5">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-full">
            <span className="text-xs">🔥</span>
            <span className="text-xs font-bold text-white tabular-nums">{currentStreak}</span>
          </div>
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-full">
            <span className="text-xs">🏆</span>
            <span className="text-xs font-bold text-white tabular-nums">{longestStreak}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
