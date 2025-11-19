import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry } from '../types';

interface AnalyticsChartProps {
  entries: JournalEntry[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ entries }) => {
  // Prepare data: Sort by date ascending and format for chart
  const data = [...entries]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      fullDate: new Date(entry.timestamp).toLocaleString(),
      sentiment: entry.analysis?.sentimentScore || 0,
      summary: entry.analysis?.shortSummary || '',
    }));

  if (data.length < 2) {
    return (
       <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
         Add at least 2 entries to view trends.
       </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Mood Trends</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              domain={[0, 10]} 
              hide 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
              cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="sentiment" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSentiment)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};