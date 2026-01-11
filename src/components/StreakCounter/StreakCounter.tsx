interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <section className="py-3 px-4">
      <div className="grid grid-cols-2 gap-2">
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <div className="min-w-0">
              <div className="text-xl font-bold text-white tabular-nums leading-none">{currentStreak}</div>
              <div className="text-[10px] text-orange-100/80 font-medium">Current</div>
            </div>
          </div>
        </div>
        
        {/* Longest Streak */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <div className="min-w-0">
              <div className="text-xl font-bold text-white tabular-nums leading-none">{longestStreak}</div>
              <div className="text-[10px] text-purple-100/80 font-medium">Best</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
