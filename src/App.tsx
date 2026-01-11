import { Header } from './components/Header/Header';
import { HabitList } from './components/HabitList/HabitList';
import { ProgressChart } from './components/ProgressChart/ProgressChart';
import { useHabitData } from './hooks/useHabitData';
import './App.css';

function App() {
  const { 
    habits, 
    today, 
    toggleHabit, 
    addHabit,
    deleteHabit,
    isHabitCompleted, 
    getCompletionHistory,
    currentStreak,
    longestStreak,
  } = useHabitData();

  return (
    <div className="min-h-screen min-h-dvh bg-slate-900 max-w-md mx-auto">
      <Header date={today} currentStreak={currentStreak} longestStreak={longestStreak} />
      <main className="pb-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <HabitList
          habits={habits}
          isHabitCompleted={isHabitCompleted}
          onToggle={toggleHabit}
          onAdd={addHabit}
          onDelete={deleteHabit}
        />
        <ProgressChart getCompletionHistory={getCompletionHistory} />
      </main>
    </div>
  );
}

export default App;
