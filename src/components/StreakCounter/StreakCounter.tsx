interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <section className="py-6 px-4">
      <div className="flex gap-4">
        {/* Current Streak */}
        <div className="flex-1 bg-gradient-to-br from-orange-500 to-red-500 
                        rounded-2xl p-5 text-center shadow-lg shadow-orange-500/20
                        transition-transform active:scale-[0.98]">
          <div className="text-4xl mb-2" role="img" aria-label="fire">🔥</div>
          <div className="text-4xl font-bold text-white tabular-nums">{currentStreak}</div>
          <div className="text-xs text-orange-100 uppercase tracking-wider mt-2 font-semibold">Current</div>
        </div>
        
        {/* Longest Streak */}
        <div className="flex-1 bg-gradient-to-br from-purple-500 to-pink-500 
                        rounded-2xl p-5 text-center shadow-lg shadow-purple-500/20
                        transition-transform active:scale-[0.98]">
          <div className="text-4xl mb-2" role="img" aria-label="trophy">🏆</div>
          <div className="text-4xl font-bold text-white tabular-nums">{longestStreak}</div>
          <div className="text-xs text-purple-100 uppercase tracking-wider mt-2 font-semibold">Record</div>
        </div>
      </div>
    </section>
  );
}
