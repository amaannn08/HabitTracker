import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

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
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
];

export function ProgressChart({ getCompletionHistory }: ProgressChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  const data = useMemo(() => getCompletionHistory(selectedPeriod), [getCompletionHistory, selectedPeriod]);

  // Format dates for display
  const chartData = useMemo(() => {
    return data.map((d, index) => {
      // For 30 days, show fewer labels
      const showLabel = selectedPeriod <= 14 || index % 3 === 0 || index === data.length - 1;
      return {
        ...d,
        dayLabel: showLabel 
          ? new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { 
              weekday: selectedPeriod <= 7 ? 'short' : undefined,
              day: selectedPeriod > 7 ? 'numeric' : undefined,
              month: selectedPeriod > 14 ? 'short' : undefined,
            })
          : '',
        displayValue: selectedPeriod <= 14 ? `${d.completed}/${d.total}` : '',
      };
    });
  }, [data, selectedPeriod]);

  const getCellColor = (percentage: number) => {
    if (percentage === 100) return '#10b981'; // emerald-500
    if (percentage >= 50) return '#60a5fa';   // blue-400
    if (percentage > 0) return '#94a3b8';     // slate-400
    return '#334155';                          // slate-700
  };

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

      <div className="bg-slate-800 rounded-xl py-4 px-2 border border-slate-700">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="dayLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: selectedPeriod > 14 ? 10 : 12 }}
              interval={0}
            />
            <YAxis hide domain={[0, data[0]?.total || 3]} />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]} maxBarSize={selectedPeriod <= 7 ? 40 : 20}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCellColor(entry.percentage)} />
              ))}
              {selectedPeriod <= 14 && (
                <LabelList
                  dataKey="displayValue"
                  position="top"
                  fill="#94a3b8"
                  fontSize={10}
                  fontWeight={500}
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          100%
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-400" />
          50%+
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
          &lt;50%
        </span>
      </div>
    </section>
  );
}
