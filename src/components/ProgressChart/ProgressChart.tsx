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

const PERIOD_OPTIONS = [
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
];

// Color scale based on completion percentage
function getColor(percentage: number): string {
  if (percentage === 0) return '#1e293b';      // slate-800 - empty
  if (percentage < 25) return '#422006';        // orange-950 - minimal
  if (percentage < 50) return '#a16207';        // yellow-700 - some progress
  if (percentage < 75) return '#65a30d';        // lime-600 - good
  if (percentage < 100) return '#16a34a';       // green-600 - great
  return '#22c55e';                              // green-500 - perfect!
}

export function ProgressChart({ getCompletionHistory }: ProgressChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(180);
  const [tooltip, setTooltip] = useState<{ data: ChartDataPoint; x: number; y: number } | null>(null);

  const data = useMemo(() => getCompletionHistory(selectedPeriod), [getCompletionHistory, selectedPeriod]);

  // Organize data into weeks (columns) and days (rows)
  const calendarData = useMemo(() => {
    const weeks: { date: string; data: ChartDataPoint }[][] = [];
    let currentWeek: { date: string; data: ChartDataPoint }[] = [];

    // Find the first Sunday to start the calendar
    const firstDate = new Date(data[0]?.date + 'T00:00:00');
    const startPadding = firstDate.getDay(); // 0 = Sunday

    // Add empty cells for padding at the start
    for (let i = 0; i < startPadding; i++) {
      currentWeek.push({ date: '', data: { date: '', completed: 0, total: 0, percentage: -1 } });
    }

    data.forEach((d) => {
      const date = new Date(d.date + 'T00:00:00');
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push({ date: d.date, data: d });
    });

    // Push the last week if it has any days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [data]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = '';

    calendarData.forEach((week, weekIndex) => {
      const validDay = week.find((d) => d.date);
      if (validDay?.date) {
        const date = new Date(validDay.date + 'T00:00:00');
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        if (month !== lastMonth) {
          labels.push({ month, weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [calendarData]);

  const handleCellHover = (e: React.MouseEvent, d: ChartDataPoint) => {
    if (d.percentage >= 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({ data: d, x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  const cellSize = selectedPeriod <= 90 ? 14 : selectedPeriod <= 180 ? 11 : 9;
  const gap = 3;

  return (
    <section className="py-6 px-4 border-t border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bitter text-lg font-semibold text-slate-400 uppercase tracking-wider">
          Progress
        </h2>

        {/* Period Selector */}
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.days}
              onClick={() => setSelectedPeriod(option.days)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${selectedPeriod === option.days
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-2 text-xs text-slate-500" style={{ marginLeft: 32 }}>
          {monthLabels.map((label, i) => (
            <span
              key={i}
              style={{
                position: 'relative',
                left: label.weekIndex * (cellSize + gap),
                marginRight: i < monthLabels.length - 1 
                  ? (monthLabels[i + 1].weekIndex - label.weekIndex) * (cellSize + gap) - 30
                  : 0,
              }}
            >
              {label.month}
            </span>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-around text-xs text-slate-500 pr-2" style={{ height: 7 * (cellSize + gap) - gap }}>
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[3px]">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-slate-400 hover:ring-offset-1 hover:ring-offset-slate-800 ${
                      day.data.percentage < 0 ? 'invisible' : ''
                    }`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: day.data.percentage >= 0 ? getColor(day.data.percentage) : 'transparent',
                    }}
                    onMouseEnter={(e) => handleCellHover(e, day.data)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1e293b' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#422006' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#a16207' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#65a30d' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#16a34a' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }} />
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <div className="font-medium text-slate-100">
            {new Date(tooltip.data.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="text-slate-400">
            {tooltip.data.completed}/{tooltip.data.total} habits ({tooltip.data.percentage}%)
          </div>
        </div>
      )}
    </section>
  );
}
