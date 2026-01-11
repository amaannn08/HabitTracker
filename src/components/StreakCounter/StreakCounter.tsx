interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <section className="py-4 px-4">
      <div className="flex gap-3">
        {/* Current Streak */}
        <div className="flex-1 bg-gradient-to-br from-orange-500/20 to-red-500/20 
                        border border-orange-500/30 rounded-xl p-4 text-center">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Current Streak</div>
        </div>
        
        {/* Longest Streak */}
        <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                        border border-purple-500/30 rounded-xl p-4 text-center">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-purple-400">{longestStreak}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Best Streak</div>
        </div>
      </div>
    </section>
  );
}

