import { useMemo, useState } from 'react';

interface ChartDataPoint {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}

interface ProgressChartProps {
  getCompletionHistory: (days: number) => ChartDataPoint[];
}

// Color scale based on completion percentage
function getColor(percentage: number): string {
  if (percentage === 0) return '#1e293b';      // slate-800 - empty
  if (percentage < 25) return '#854d0e';        // yellow-900
  if (percentage < 50) return '#ca8a04';        // yellow-600
  if (percentage < 75) return '#84cc16';        // lime-500
  if (percentage < 100) return '#22c55e';       // green-500
  return '#10b981';                              // emerald-500 - perfect!
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function ProgressChart({ getCompletionHistory }: ProgressChartProps) {
  const [tooltip, setTooltip] = useState<{ data: ChartDataPoint; x: number; y: number } | null>(null);

  // Get current month data
  const monthData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const monthName = getMonthName(today);
    const monthDays: (ChartDataPoint | null)[] = [];

    // Pad to start on the correct day of week
    const firstDay = new Date(year, month, 1).getDay();
    for (let j = 0; j < firstDay; j++) {
      monthDays.push(null);
    }

    // Get data for this month
    const historyData = getCompletionHistory(365);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dataPoint = historyData.find(d => d.date === dateStr);
      
      // Only show if the date is not in the future
      const currentDate = new Date(dateStr + 'T00:00:00');
      if (currentDate <= today) {
        monthDays.push(dataPoint || { date: dateStr, completed: 0, total: 0, percentage: 0 });
      } else {
        monthDays.push(null);
      }
    }

    return { name: monthName, days: monthDays };
  }, [getCompletionHistory]);

  const handleCellHover = (e: React.MouseEvent, d: ChartDataPoint) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ data: d, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <section className="py-6 px-4">
      <h2 className="text-base font-bold text-white mb-4">
        Progress — {monthData.name}
      </h2>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-md">
        <div className="space-y-1.5">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {monthData.days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`aspect-square rounded-md transition-all ${
                  day 
                    ? 'cursor-pointer hover:ring-2 hover:ring-slate-400 hover:scale-105' 
                    : 'invisible'
                }`}
                style={{
                  backgroundColor: day ? getColor(day.percentage) : 'transparent',
                }}
                onMouseEnter={(e) => day && handleCellHover(e, day)}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400 font-medium">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1e293b' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#854d0e' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ca8a04' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#84cc16' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981' }} />
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          <div className="font-semibold text-white">
            {new Date(tooltip.data.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="text-slate-300 mt-0.5">
            {tooltip.data.completed}/{tooltip.data.total} • {tooltip.data.percentage}%
          </div>
        </div>
      )}
    </section>
  );
}
