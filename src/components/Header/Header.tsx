interface HeaderProps {
  date: string;
}

export function Header({ date }: HeaderProps) {
  // Format date for display
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="text-center py-6 px-4 border-b border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
        Habit Tracker
      </h1>
      <p className="text-sm text-emerald-400 font-medium">{formattedDate}</p>
    </header>
  );
}
