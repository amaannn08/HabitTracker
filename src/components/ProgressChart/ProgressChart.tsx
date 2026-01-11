import { useMemo, useState } from 'react';

interface ChartDataPoint {
  date: string;
  completed: number;
  total: number;
  percentage: number;
  isFuture?: boolean;
}

interface ProgressChartProps {
  getCompletionHistory: (days: number) => ChartDataPoint[];
}

// Color scale based on completion percentage
function getColor(percentage: number, isFuture?: boolean): string {
  if (isFuture) return '#0f172a';               // slate-900 - future (darker)
  if (percentage === 0) return '#1e293b';       // slate-800 - empty
  if (percentage < 25) return '#854d0e';        // yellow-900
  if (percentage < 50) return '#ca8a04';        // yellow-600
  if (percentage < 75) return '#84cc16';        // lime-500
  if (percentage < 100) return '#22c55e';       // green-500
  return '#10b981';                              // emerald-500 - perfect!
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' });
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
      const currentDate = new Date(dateStr + 'T00:00:00');
      const isFuture = currentDate > today;
      
      monthDays.push({
        date: dateStr,
        completed: dataPoint?.completed || 0,
        total: dataPoint?.total || 0,
        percentage: dataPoint?.percentage || 0,
        isFuture,
      });
    }

    return { name: monthName, days: monthDays };
  }, [getCompletionHistory]);

  const handleCellHover = (e: React.MouseEvent, d: ChartDataPoint) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ data: d, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <section className="py-3 px-4">
      <h2 className="text-sm font-bold text-white mb-2">
        {monthData.name} Progress
      </h2>

      <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[9px] font-medium text-slate-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {monthData.days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`aspect-square rounded-sm transition-all duration-150 ${
                day 
                  ? day.isFuture 
                    ? 'opacity-30' 
                    : 'cursor-pointer hover:ring-1 hover:ring-white/40 hover:scale-105'
                  : 'opacity-0'
              }`}
              style={{
                backgroundColor: day ? getColor(day.percentage, day.isFuture) : 'transparent',
              }}
              onMouseEnter={(e) => day && !day.isFuture && handleCellHover(e, day)}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-2 text-[9px] text-slate-500">
          <span>Less</span>
          <div className="flex gap-0.5">
            {['#1e293b', '#854d0e', '#ca8a04', '#84cc16', '#22c55e', '#10b981'].map((color) => (
              <div key={color} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          <span>More</span>
        </div>
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
