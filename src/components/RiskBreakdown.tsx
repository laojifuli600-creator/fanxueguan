import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskFactor {
  name: string;
  score: number;
  maxScore: number;
}

interface RiskBreakdownProps {
  riskFactors: RiskFactor[];
}

const RiskBreakdown: React.FC<RiskBreakdownProps> = ({ riskFactors }) => {
  // Sort by score descending and filter out 0 scores for cleaner chart
  const filteredFactors = riskFactors
    .filter(f => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8); // Top 8

  const getBarColor = (score: number, maxScore: number) => {
    const ratio = score / maxScore;
    if (ratio > 0.8) return '#ef4444';
    if (ratio > 0.5) return '#f97316';
    if (ratio > 0.3) return '#f59e0b';
    return '#3b82f6';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            风险分: <span className="font-bold text-red-500">{payload[0].value}</span> / {payload[0].payload.maxScore}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">风险因素分析</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        以下图表展示了各项危险因素对总体风险的贡献度
      </p>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredFactors} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" domain={[0, 'auto']} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {filteredFactors.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.score, entry.maxScore)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-gray-600">低风险贡献</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span className="text-gray-600">中等贡献</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600">高贡献</span>
        </div>
      </div>
    </div>
  );
};

export default RiskBreakdown;
