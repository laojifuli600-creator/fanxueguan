import React, { useState } from 'react';
import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateMmse, calculateCam } from '@/lib/cgaCalculators';

// ===== MMSE =====
export const MmseScale: React.FC = () => {
  const { mmse, setMmse } = useCga();
  const [tab, setTab] = useState<'orientation' | 'memory' | 'attention' | 'recall' | 'language'>('orientation');
  const result = calculateMmse(mmse);

  const tabs = [
    { key: 'orientation', label: `定向力 (${mmse.orientation.reduce((a,b)=>a+b,0)}/10)` },
    { key: 'memory', label: `记忆力 (${mmse.memory.reduce((a,b)=>a+b,0)}/3)` },
    { key: 'attention', label: `注意力/计算 (${mmse.attention.reduce((a,b)=>a+b,0)}/5)` },
    { key: 'recall', label: `回忆 (${mmse.recall.reduce((a,b)=>a+b,0)}/3)` },
    { key: 'language', label: `语言 (${mmse.language.reduce((a,b)=>a+b,0)}/9)` },
  ];

  const toggle = (field: keyof typeof mmse, idx: number) => {
    setMmse(prev => {
      const arr = [...(prev[field] as number[])];
      arr[idx] = arr[idx] === 1 ? 0 : 1;
      return { ...prev, [field]: arr };
    });
  };

  const orientationItems = ['今年哪一年', '什么季节', '几月份', '几号', '星期几', '哪个省', '哪个县/区', '哪个乡/街道', '哪个医院', '几楼'];
  const memoryItems = ['皮球', '国旗', '树木'];
  const attentionItems = ['100-7=93', '-7=86', '-7=79', '-7=72', '-7=65'];
  const recallItems = ['皮球', '国旗', '树木'];
  const languageItems = ['命名手表', '命名钢笔', '复述"四十四只石狮子"', '阅读并执行"闭上眼睛"', '三步命令-右手拿纸', '三步命令-对折', '三步命令-放左腿', '书写完整句子', '画五边形'];

  const getItems = () => {
    switch(tab) {
      case 'orientation': return { items: orientationItems, field: 'orientation' as const };
      case 'memory': return { items: memoryItems, field: 'memory' as const };
      case 'attention': return { items: attentionItems, field: 'attention' as const };
      case 'recall': return { items: recallItems, field: 'recall' as const };
      case 'language': return { items: languageItems, field: 'language' as const };
    }
  };

  const current = getItems();

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">MMSE 简易精神状态检查</h3>
        <p className="text-sm text-blue-700">满分30分。≥27正常，21-26轻度，10-20中度，&lt;10重度。</p>
      </div>

      <div className="flex flex-wrap gap-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`px-3 py-1.5 rounded text-xs border ${tab === t.key ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          {current.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm">{idx+1}. {item}</span>
              <div className="flex items-center gap-2">
                <Checkbox checked={(mmse[current.field] as number[])[idx] === 1} onCheckedChange={() => toggle(current.field, idx)} />
                <span className={`text-sm font-bold ${(mmse[current.field] as number[])[idx] === 1 ? 'text-green-600' : 'text-red-400'}`}>
                  {(mmse[current.field] as number[])[idx] === 1 ? '1分' : '0分'}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 30</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== CAM 谵妄评估 =====
export const CamScale: React.FC = () => {
  const { cam, setCam } = useCga();
  const result = calculateCam(cam);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">CAM 意识模糊评估法</h3>
        <p className="text-sm text-blue-700">特征1a+1b+2皆为"是"，且3或4任何一项为"是"→谵妄阳性。</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-1">特征1：急性发作且病程波动</h4>

          <div className="py-3 border-b border-gray-100">
            <p className="text-sm text-gray-600 mb-2">1a. 与平常相比，是否有证据显示病人精神状态产生急性变化？</p>
            <div className="flex gap-2">
              {[{v: false, l: '否 (0分)'}, {v: true, l: '是 (1分)'}].map(o => (
                <button key={String(o.v)} onClick={() => setCam(p => ({ ...p, acuteOnset: o.v }))}
                  className={`px-3 py-2 rounded text-sm border flex-1 ${cam.acuteOnset === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          <div className="py-3">
            <p className="text-sm text-gray-600 mb-2">1b. 这些不正常行为是否在一天中呈现波动状态？</p>
            <div className="flex gap-2">
              {[{v: false, l: '否 (0分)'}, {v: true, l: '是 (1分)'}].map(o => (
                <button key={String(o.v)} onClick={() => setCam(p => ({ ...p, fluctuation: o.v }))}
                  className={`px-3 py-2 rounded text-sm border flex-1 ${cam.fluctuation === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-1">特征2：注意力不集中</h4>
          <p className="text-sm text-gray-600 mb-2">病人是否集中注意力有困难？如容易分心或无法接续刚才的话。</p>
          <div className="flex gap-2">
            {[{v: false, l: '否 (0分)'}, {v: true, l: '是 (1分)'}].map(o => (
              <button key={String(o.v)} onClick={() => setCam(p => ({ ...p, inattention: o.v }))}
                className={`px-3 py-2 rounded text-sm border flex-1 ${cam.inattention === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-1">特征3：思考缺乏组织</h4>
          <p className="text-sm text-gray-600 mb-2">病人是否思考缺乏组织或不连贯？</p>
          <div className="flex gap-2">
            {[{v: false, l: '否 (0分)'}, {v: true, l: '是 (1分)'}].map(o => (
              <button key={String(o.v)} onClick={() => setCam(p => ({ ...p, disorganizedThinking: o.v }))}
                className={`px-3 py-2 rounded text-sm border flex-1 ${cam.disorganizedThinking === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-1">特征4：意识状态改变</h4>
          <p className="text-sm text-gray-600 mb-2">整体而言，病人的意识状态是否为过度警觉、嗜睡、木僵或昏迷？</p>
          <div className="flex gap-2">
            {[{v: false, l: '否 (0分)'}, {v: true, l: '是 (1分)'}].map(o => (
              <button key={String(o.v)} onClick={() => setCam(p => ({ ...p, alteredConsciousness: o.v }))}
                className={`px-3 py-2 rounded text-sm border flex-1 ${cam.alteredConsciousness === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 5</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};
