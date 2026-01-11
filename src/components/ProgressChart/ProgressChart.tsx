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
  const [numMonths, setNumMonths] = useState(3);
  const [tooltip, setTooltip] = useState<{ data: ChartDataPoint; x: number; y: number } | null>(null);

  // Group data by month
  const monthlyData = useMemo(() => {
    const today = new Date();
    const months: { name: string; days: (ChartDataPoint | null)[] }[] = [];

    for (let i = numMonths - 1; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      
      const monthName = getMonthName(monthDate);
      const monthDays: (ChartDataPoint | null)[] = [];

      // Pad to start on the correct day of week
      const firstDay = new Date(year, month, 1).getDay();
      for (let j = 0; j < firstDay; j++) {
        monthDays.push(null);
      }

      // Get data for this month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month, daysInMonth);
      const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const historyData = getCompletionHistory(365); // Get full year
      
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

      months.push({ name: monthName, days: monthDays });
    }

    return months;
  }, [getCompletionHistory, numMonths]);

  const handleCellHover = (e: React.MouseEvent, d: ChartDataPoint) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ data: d, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <section className="py-6 px-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">
          Progress
        </h2>

        {/* Period Selector */}
        <div className="flex bg-slate-800 rounded-xl p-1 gap-1 border border-slate-700">
          {[3, 6, 12].map((months) => (
            <button
              key={months}
              onClick={() => setNumMonths(months)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
                ${numMonths === months
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {months}M
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {monthlyData.map((month, monthIndex) => (
          <div key={monthIndex} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4">{month.name}</h3>
            
            <div className="space-y-1">
              {/* Day labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-slate-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`aspect-square rounded-lg transition-all ${
                      day 
                        ? 'cursor-pointer hover:ring-2 hover:ring-slate-400 hover:scale-110' 
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
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400 font-medium">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1e293b' }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#854d0e' }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ca8a04' }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-sm shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 12 }}
        >
          <div className="font-semibold text-white mb-1">
            {new Date(tooltip.data.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="text-slate-300">
            {tooltip.data.completed}/{tooltip.data.total} habits • {tooltip.data.percentage}%
          </div>
        </div>
      )}
    </section>
  );
}
