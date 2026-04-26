import React from 'react';
import { motion } from 'framer-motion';
import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { calculateBarthel } from '@/lib/cgaCalculators';

const items = [
  { key: 'feeding', label: '⑴ 进食', scores: [{v: 10, l: '独立进食'}, {v: 5, l: '需部分帮助'}, {v: 0, l: '需极大帮助/依赖'}] },
  { key: 'bathing', label: '⑵ 洗澡', scores: [{v: 5, l: '独立洗澡'}, {v: 0, l: '需要帮助'}] },
  { key: 'grooming', label: '⑶ 个人卫生', scores: [{v: 5, l: '独立洗脸梳头刷牙'}, {v: 0, l: '需要帮助'}] },
  { key: 'dressing', label: '⑷ 穿衣', scores: [{v: 10, l: '独立穿衣'}, {v: 5, l: '需部分帮助'}, {v: 0, l: '完全依赖'}] },
  { key: 'bowelControl', label: '⑸ 控制大便', scores: [{v: 10, l: '能控制'}, {v: 5, l: '偶尔失禁'}, {v: 0, l: '失禁/昏迷'}] },
  { key: 'bladderControl', label: '⑹ 控制小便', scores: [{v: 10, l: '能控制'}, {v: 5, l: '偶尔失禁'}, {v: 0, l: '失禁/昏迷'}] },
  { key: 'toileting', label: '⑺ 用厕', scores: [{v: 10, l: '独立用厕'}, {v: 5, l: '需部分帮助'}, {v: 0, l: '完全依赖'}] },
  { key: 'bedTransfer', label: '⑻ 床椅转移', scores: [{v: 15, l: '独立完成'}, {v: 10, l: '需1人帮助'}, {v: 5, l: '需2人帮助/能坐'}, {v: 0, l: '完全依赖'}] },
  { key: 'walking', label: '⑼ 平地行走45m', scores: [{v: 15, l: '独立行走'}, {v: 10, l: '需1人帮助'}, {v: 5, l: '需极大帮助'}, {v: 0, l: '完全依赖'}] },
  { key: 'stairClimbing', label: '⑽ 上下楼梯', scores: [{v: 10, l: '独立上下'}, {v: 5, l: '需帮助'}, {v: 0, l: '不能'}] },
];

const BarthelScale: React.FC = () => {
  const { barthel, setBarthel } = useCga();
  const result = calculateBarthel(barthel);

  const update = (key: string, val: number) => {
    setBarthel(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">Barthel指数（BADL）</h3>
        <p className="text-sm text-blue-700">评估基本日常生活活动能力。共10项，满分100分。</p>
      </div>

      {items.map((item, idx) => (
        <motion.div key={item.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <Label className="font-bold text-gray-800 block mb-3">{item.label}</Label>
              <RadioGroup
                value={String((barthel as any)[item.key])}
                onValueChange={(v) => update(item.key, Number(v))}
                className="space-y-2"
              >
                {item.scores.map((s) => (
                  <div key={s.v} className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded border border-gray-100 hover:border-blue-300 cursor-pointer transition-colors">
                    <RadioGroupItem value={String(s.v)} id={`${item.key}-${s.v}`} />
                    <Label htmlFor={`${item.key}-${s.v}`} className="cursor-pointer flex-1 text-sm">{s.l}</Label>
                    <span className="text-sm font-bold text-blue-600">{s.v}分</span>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Score Display */}
      <Card className={`border-2 ${result.score >= 60 ? 'border-green-400 bg-green-50' : result.score >= 41 ? 'border-amber-400 bg-amber-50' : 'border-red-400 bg-red-50'}`}>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">当前得分</p>
            <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ {result.maxScore}</span></p>
            <p className="font-bold mt-1" style={{ color: result.color }}>{result.level}</p>
            <p className="text-sm text-gray-600 mt-2">{result.interpretation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarthelScale;
