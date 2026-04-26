import React from 'react';
import { motion } from 'framer-motion';
import { getRiskLevelText, getRiskLevelColor } from '@/lib/riskCalculator';

interface RiskGaugeProps {
  percentage: number;
  level: string;
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ percentage, level, score }) => {
  const color = getRiskLevelColor(level);
  const radius = 120;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 75% of circle

  // Calculate rotation for the arc (start from bottom-left, go 270 degrees)
  const rotation = 135;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          height={radius * 2.5}
          width={radius * 2.5}
          className="transform"
        >
          {/* Background arc */}
          <circle
            stroke="#e5e7eb"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${radius * 1.25} ${radius * 1.25})`}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.circle
            stroke={color}
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            transform={`rotate(${rotation} ${radius * 1.25} ${radius * 1.25})`}
            strokeLinecap="round"
          />
          {/* Center text */}
          <text
            x={radius * 1.25}
            y={radius * 1.25 - 10}
            textAnchor="middle"
            fill="#374151"
            fontSize="42"
            fontWeight="bold"
          >
            {Math.round(percentage)}%
          </text>
          <text
            x={radius * 1.25}
            y={radius * 1.25 + 25}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="16"
          >
            风险指数
          </text>
        </svg>
        
        {/* Risk level badge */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-white font-bold text-lg shadow-lg"
          style={{ backgroundColor: color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          {getRiskLevelText(level)}
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <p className="text-gray-600 text-sm">综合评分</p>
        <p className="text-3xl font-bold text-gray-800">{score} <span className="text-sm font-normal text-gray-500">分</span></p>
      </motion.div>
    </div>
  );
};

export default RiskGauge;
