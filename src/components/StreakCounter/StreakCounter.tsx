interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <section className="py-4 px-4">
      <div className="flex gap-3">
        {/* Current Streak */}
        <div className="flex-1 bg-gradient-to-br from-orange-500 to-red-500 
                        rounded-xl p-3 text-center shadow-md shadow-orange-500/20">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl" role="img" aria-label="fire">🔥</span>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums leading-none">{currentStreak}</div>
              <div className="text-xs text-orange-100 font-medium mt-0.5">Day Streak</div>
            </div>
          </div>
        </div>
        
        {/* Longest Streak */}
        <div className="flex-1 bg-gradient-to-br from-purple-500 to-pink-500 
                        rounded-xl p-3 text-center shadow-md shadow-purple-500/20">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl" role="img" aria-label="trophy">🏆</span>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums leading-none">{longestStreak}</div>
              <div className="text-xs text-purple-100 font-medium mt-0.5">Best Streak</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
