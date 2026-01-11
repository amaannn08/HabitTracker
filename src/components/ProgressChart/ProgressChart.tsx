import { useMemo } from 'react';
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
  data: ChartDataPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  // Format dates for display (e.g., "Mon", "Tue")
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      dayLabel: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      displayValue: `${d.completed}/${d.total}`,
    }));
  }, [data]);

  const getCellColor = (percentage: number) => {
    if (percentage === 100) return '#10b981'; // emerald-500
    if (percentage >= 50) return '#60a5fa';   // blue-400
    if (percentage > 0) return '#94a3b8';     // slate-400
    return '#334155';                          // slate-700
  };

  return (
    <section className="py-6 px-4 border-t border-slate-700">
      <h2 className="font-bitter text-lg font-semibold text-slate-400 mb-4 uppercase tracking-wider">
        Last 7 Days
      </h2>
      <div className="bg-slate-800 rounded-xl py-4 px-2 border border-slate-700">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="dayLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis hide domain={[0, data[0]?.total || 3]} />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCellColor(entry.percentage)} />
              ))}
              <LabelList
                dataKey="displayValue"
                position="top"
                fill="#94a3b8"
                fontSize={11}
                fontWeight={500}
              />
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
