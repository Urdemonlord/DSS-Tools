import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { MethodResult } from '../../types';

interface ResultsChartProps {
  results: MethodResult[];
  alternativeNames: Record<string, string>;
}

const ResultsChart: React.FC<ResultsChartProps> = ({ results, alternativeNames }) => {
  const chartData = useMemo(() => {
    return results
      .sort((a, b) => a.rank - b.rank)
      .map(result => ({
        name: alternativeNames[result.alternativeId] || result.alternativeId,
        score: parseFloat(result.score.toFixed(4)),
        rank: result.rank
      }));
  }, [results, alternativeNames]);

  const colors = [
    '#3F83F8', // Primary blue
    '#0D9488', // Teal
    '#7C3AED', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#6366F1', // Indigo
    '#F97316', // Orange
  ];

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">Results Visualization</h3>
      
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [value.toFixed(4), 'Score']}
              labelFormatter={(name) => `Alternative: ${name}`}
            />
            <Legend />
            <Bar 
              dataKey="score" 
              name="Score" 
              isAnimationActive={true} 
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  fillOpacity={entry.rank === 1 ? 1 : 0.75}
                  stroke={entry.rank === 1 ? '#2563EB' : undefined}
                  strokeWidth={entry.rank === 1 ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsChart;