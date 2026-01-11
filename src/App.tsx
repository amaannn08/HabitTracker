import { useMemo } from 'react';
import { Header } from './components/Header/Header';
import { HabitList } from './components/HabitList/HabitList';
import { ProgressChart } from './components/ProgressChart/ProgressChart';
import { useHabitData } from './hooks/useHabitData';
import './App.css';

function App() {
  const { habits, today, toggleHabit, isHabitCompleted, getCompletionHistory } = useHabitData();

  // Memoize chart data to avoid recalculation on every render
  const chartData = useMemo(() => getCompletionHistory(7), [getCompletionHistory]);

  return (
    <div className="min-h-screen min-h-dvh bg-slate-900 max-w-md mx-auto">
      <Header date={today} />
      <main className="pb-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <HabitList
          habits={habits}
          isHabitCompleted={isHabitCompleted}
          onToggle={toggleHabit}
        />
        <ProgressChart data={chartData} />
      </main>
    </div>
  );
}

export default App;
