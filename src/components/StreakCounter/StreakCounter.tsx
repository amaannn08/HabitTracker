interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <section className="py-4 px-4">
      <div className="flex gap-3">
        {/* Current Streak */}
        <div className="flex-1 bg-gradient-to-br from-orange-500/20 to-red-500/10 
                        border border-orange-500/30 rounded-xl p-4 text-center
                        transition-transform active:scale-[0.98]">
          <div className="text-3xl mb-1" role="img" aria-label="fire">🔥</div>
          <div className="text-3xl font-bold text-orange-400 tabular-nums">{currentStreak}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Day Streak</div>
        </div>
        
        {/* Longest Streak */}
        <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-pink-500/10 
                        border border-purple-500/30 rounded-xl p-4 text-center
                        transition-transform active:scale-[0.98]">
          <div className="text-3xl mb-1" role="img" aria-label="trophy">🏆</div>
          <div className="text-3xl font-bold text-purple-400 tabular-nums">{longestStreak}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Best Streak</div>
        </div>
      </div>
    </section>
  );
}
