import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Criteria } from '../../types';

interface CriteriaWeightsChartProps {
  criteria: Criteria[];
}

const CriteriaWeightsChart: React.FC<CriteriaWeightsChartProps> = ({ criteria }) => {
  // Return null if no criteria
  if (!criteria.length) return null;

  // Prepare data for the pie chart
  const data = criteria.map(criterion => ({
    name: criterion.name,
    value: criterion.weight,
    type: criterion.type
  }));

  // Calculate the sum of all weights
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  // Colors for different criteria
  const COLORS = [
    '#3F83F8', // Blue
    '#7C3AED', // Purple
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EC4899', // Pink
    '#0D9488', // Teal
    '#6366F1', // Indigo
    '#F97316', // Orange
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, cy, midAngle, innerRadius, outerRadius, percent, index 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Only show percentage if it's significant enough
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">Criteria Weights</h3>
      
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                `${value.toFixed(2)} (${((value / totalWeight) * 100).toFixed(1)}%)`, 
                'Weight'
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {criteria.map((criterion, index) => (
            <div key={criterion.id} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <div className="text-sm">
                <span className="font-medium">{criterion.name}</span>
                <span className="ml-1 text-gray-500">
                  ({criterion.type === 'benefit' ? 'benefit' : 'cost'})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CriteriaWeightsChart;