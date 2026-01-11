interface HeaderProps {
  date: string;
}

export function Header({ date }: HeaderProps) {
  // Format date for display: "Sunday, January 11, 2026"
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="text-center py-6 px-4 border-b border-slate-700">
      <h1 className="font-bitter text-3xl font-bold text-slate-100 mb-2 tracking-tight">
        Habit Tracker
      </h1>
      <p className="text-base text-slate-400 font-medium">{formattedDate}</p>
    </header>
  );
}
