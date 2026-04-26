import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Activity, Footprints } from 'lucide-react';

interface VascularMapProps {
  vascularMap: {
    heart: 'green' | 'yellow' | 'red';
    brain: 'green' | 'yellow' | 'red';
    kidney: 'green' | 'yellow' | 'red';
    peripheral: 'green' | 'yellow' | 'red';
  };
}

const colorMap = {
  green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', icon: 'text-green-600', label: '低风险' },
  yellow: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-700', icon: 'text-amber-600', label: '中风险' },
  red: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', icon: 'text-red-600', label: '高风险' },
};

const VascularMap: React.FC<VascularMapProps> = ({ vascularMap }) => {
  const organs = [
    { key: 'heart' as const, name: '心脏血管', icon: Heart, description: '冠状动脉' },
    { key: 'brain' as const, name: '脑血管', icon: Brain, description: '颈动脉/脑动脉' },
    { key: 'kidney' as const, name: '肾血管', icon: Activity, description: '肾动脉' },
    { key: 'peripheral' as const, name: '外周血管', icon: Footprints, description: '下肢动脉' },
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">泛血管健康地图</h3>
      <p className="text-sm text-gray-600 mb-6 text-center">
        泛血管疾病强调全身血管是一个整体，以下是各血管床的风险评估
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {organs.map((organ, index) => {
          const status = vascularMap[organ.key];
          const colors = colorMap[status];
          const Icon = organ.icon;
          
          return (
            <motion.div
              key={organ.key}
              className={`${colors.bg} border-2 ${colors.border} rounded-xl p-4 flex flex-col items-center`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className={`w-10 h-10 ${colors.icon} mb-2`} />
              <h4 className={`font-bold ${colors.text}`}>{organ.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{organ.description}</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                {colors.label}
              </span>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          <strong>泛血管理念：</strong>人体所有血管（心、脑、肾、四肢）相互关联，
          一处血管出现问题，往往提示其他部位也存在风险，需要综合评估和管理。
        </p>
      </div>
    </div>
  );
};

export default VascularMap;
