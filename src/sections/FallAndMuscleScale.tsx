import React from 'react';
import { motion } from 'framer-motion';
import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { calculateJfras, calculateSarcF, calculateSarcopeniaOverall } from '@/lib/cgaCalculators';

// ===== JFRAS跌倒风险 =====
const JfrasScale: React.FC = () => {
  const { jfras, setJfras, patientAge } = useCga();

  const setJfrasField = (field: string, val: any) => {
    setJfras(prev => ({ ...prev, [field]: val }));
  };

  const toggleMulti = (field: 'mobility' | 'cognition', val: number) => {
    setJfras(prev => {
      const arr = [...prev[field]];
      const idx = arr.indexOf(val);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
      return { ...prev, [field]: arr };
    });
  };

  const result = calculateJfras(jfras);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">约翰霍普金斯跌倒风险评估 (JFRAS)</h3>
        <p className="text-sm text-blue-700">第一部分筛选后进入第二部分评分。总分&lt;6低风险，6-13中风险，&gt;13高风险。</p>
      </div>

      {/* Part I */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-3">第一部分 - 高风险筛选（符合任一项即为高风险）</h4>
          <div className="space-y-2">
            {[
              { key: 'completelyImmobile', label: '完全瘫痪或失去行动能力' },
              { key: 'fallHistory2x', label: '住院前6个月有≥2次跌倒史' },
              { key: 'inpatientFall', label: '住院期间有跌倒史' },
              { key: 'highRiskProtocol', label: '医嘱规定为跌倒高风险' },
            ].map(item => (
              <div key={item.key} className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded border border-gray-100">
                <Checkbox
                  checked={(jfras as any)[item.key]}
                  onCheckedChange={(c) => setJfrasField(item.key, c)}
                />
                <Label className="cursor-pointer text-sm">{item.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Part II */}
      {!jfras.completelyImmobile && !jfras.fallHistory2x && !jfras.inpatientFall && !jfras.highRiskProtocol && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold text-gray-800 mb-3">第二部分 - 详细评分</h4>

              {/* Age */}
              <div className="mb-4">
                <Label className="text-sm font-medium">年龄 ({patientAge}岁)</Label>
                <div className="flex gap-2 mt-1">
                  {[{v: 0, l: '<60岁'}, {v: 1, l: '60-69岁'}, {v: 2, l: '70-79岁'}, {v: 3, l: '≥80岁'}].map(o => (
                    <button key={o.v} onClick={() => setJfrasField('age', o.v)}
                      className={`px-3 py-2 rounded text-sm border ${jfras.age === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                      {o.l} {o.v > 0 ? `(+${o.v})` : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fall history 1x */}
              <div className="mb-4">
                <Label className="text-sm font-medium">6个月内有1次跌倒史</Label>
                <div className="flex gap-2 mt-1">
                  {[{v: 0, l: '否'}, {v: 5, l: '是 (+5)'}].map(o => (
                    <button key={o.v} onClick={() => setJfrasField('fallHistory1x', o.v)}
                      className={`px-3 py-2 rounded text-sm border ${jfras.fallHistory1x === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elimination */}
              <div className="mb-4">
                <Label className="text-sm font-medium">大小便排泄</Label>
                <RadioGroup value={String(jfras.elimination)} onValueChange={(v) => setJfrasField('elimination', Number(v))} className="space-y-1 mt-1">
                  {[{v: 0, l: '正常'}, {v: 2, l: '失禁/紧急频繁 (+2)'}, {v: 4, l: '紧急频繁失禁 (+4)'}].map(o => (
                    <div key={o.v} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(o.v)} id={`elim-${o.v}`} />
                      <Label htmlFor={`elim-${o.v}`} className="text-sm">{o.l}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* High risk drugs */}
              <div className="mb-4">
                <Label className="text-sm font-medium">高危跌倒药物</Label>
                <RadioGroup value={String(jfras.highRiskDrugs)} onValueChange={(v) => setJfrasField('highRiskDrugs', Number(v))} className="space-y-1 mt-1">
                  {[{v: 0, l: '无'}, {v: 3, l: '1个高危药物 (+3)'}, {v: 5, l: '≥2个高危药物 (+5)'}, {v: 7, l: '24h内镇静药 (+7)'}].map(o => (
                    <div key={o.v} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(o.v)} id={`drug-${o.v}`} />
                      <Label htmlFor={`drug-${o.v}`} className="text-sm">{o.l}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-gray-500 mt-1">高危药：镇静药、阿片类、抗惊厥药、降压药、利尿剂、催眠药、泻药、精神类药物</p>
              </div>

              {/* Medical devices */}
              <div className="mb-4">
                <Label className="text-sm font-medium">限制行动的医疗设备数</Label>
                <div className="flex gap-2 mt-1">
                  {[{v: 0, l: '无'}, {v: 1, l: '1个 (+1)'}, {v: 2, l: '2个 (+2)'}, {v: 3, l: '≥3个 (+3)'}].map(o => (
                    <button key={o.v} onClick={() => setJfrasField('medicalDevices', o.v)}
                      className={`px-3 py-2 rounded text-sm border ${jfras.medicalDevices === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobility - multi */}
              <div className="mb-4">
                <Label className="text-sm font-medium">活动能力受损（多选，每项+2分）</Label>
                <div className="space-y-2 mt-1">
                  {[{v: 1, l: '移动/转运/行走需辅助或监管'}, {v: 2, l: '步态不稳'}, {v: 3, l: '视觉或听觉障碍影响活动'}].map(o => (
                    <div key={o.v} className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded border border-gray-100">
                      <Checkbox checked={jfras.mobility.includes(o.v)} onCheckedChange={() => toggleMulti('mobility', o.v)} />
                      <Label className="cursor-pointer text-sm">{o.l} (+2)</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cognition - multi */}
              <div className="mb-4">
                <Label className="text-sm font-medium">认知功能受损（多选）</Label>
                <div className="space-y-2 mt-1">
                  {[{v: 1, l: '定向力障碍 (+1)'}, {v: 2, l: '烦躁 (+2)'}, {v: 4, l: '认知限制或障碍 (+4)'}].map(o => (
                    <div key={o.v} className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded border border-gray-100">
                      <Checkbox checked={jfras.cognition.includes(o.v)} onCheckedChange={() => toggleMulti('cognition', o.v)} />
                      <Label className="cursor-pointer text-sm">{o.l}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Score */}
      <Card className={`border-2`} style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">JFRAS得分</p>
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score}</p>
          <p className="font-bold mt-1" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-2">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== SARC-F + 握力/步速 =====
const SarcFScale: React.FC = () => {
  const { sarcF, setSarcF, gripStrength, setGripStrength, walkingSpeed, setWalkingSpeed, patientGender } = useCga();
  const sarcFResult = calculateSarcF(sarcF);
  const overallResult = calculateSarcopeniaOverall(sarcF, gripStrength.dominant, gripStrength.nonDominant, walkingSpeed, patientGender);

  const questions = [
    { key: 'strength', label: 'S-肌肉力量', q: '提起或携带4.5kg的东西会感到困难吗？' },
    { key: 'walking', label: 'A-辅助步行', q: '步行走过房间会感到困难吗？' },
    { key: 'riseFromChair', label: 'R-座椅起身', q: '从座椅或床上起身会感到困难吗？' },
    { key: 'climbing', label: 'C-爬楼梯', q: '爬10级楼梯会感到困难吗？' },
    { key: 'falls', label: 'F-跌倒', q: '过去一年跌倒过多少次？' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  const options = [
    { v: 0, l: '没有困难 / 没有' },
    { v: 1, l: '有一些困难 / 1-3次' },
    { v: 2, l: '非常困难或无法做到 / ≥4次' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">SARC-F 肌少症筛查 + 功能测试</h3>
        <p className="text-sm text-blue-700">SARC-F≥4分提示肌少症风险。结合握力和步速综合评估。</p>
      </div>

      {questions.map((item) => (
        <Card key={item.key}>
          <CardContent className="p-4">
            <Label className="font-bold text-gray-800 block mb-1">{item.label}</Label>
            <p className="text-sm text-gray-600 mb-3">{item.q}</p>
            <RadioGroup value={String((sarcF as any)[item.key])} onValueChange={(v) => setSarcF(prev => ({ ...prev, [item.key]: Number(v) }))} className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded border border-gray-100 hover:border-blue-300 cursor-pointer">
                  <RadioGroupItem value={String(opt.v)} id={`${item.key}-${i}`} />
                  <Label htmlFor={`${item.key}-${i}`} className="cursor-pointer text-sm flex-1">{opt.l}</Label>
                  <span className="text-sm font-bold text-blue-600">{opt.v}分</span>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {/* Grip Strength */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-3">握力测试（kg）</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">优势手</Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={gripStrength.dominant} onChange={(e) => setGripStrength(p => ({ ...p, dominant: Number(e.target.value) }))} className="text-lg" />
                <span className="text-sm text-gray-500">kg</span>
              </div>
            </div>
            <div>
              <Label className="text-sm">非优势手</Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={gripStrength.nonDominant} onChange={(e) => setGripStrength(p => ({ ...p, nonDominant: Number(e.target.value) }))} className="text-lg" />
                <span className="text-sm text-gray-500">kg</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">参考：男性&lt;28kg，女性&lt;18kg为握力低下（AWGS 2019）</p>
        </CardContent>
      </Card>

      {/* Walking Speed */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-3">4米步速测试（m/s）</h4>
          <div className="flex items-center gap-4">
            <Slider value={[walkingSpeed]} onValueChange={(v) => setWalkingSpeed(v[0])} min={0} max={3} step={0.1} className="flex-1" />
            <span className="text-xl font-bold text-blue-600 min-w-[60px]">{walkingSpeed.toFixed(1)} m/s</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">参考：&lt;1.0 m/s 为步速低下（AWGS 2019）</p>
        </CardContent>
      </Card>

      {/* SARC-F Result */}
      <Card className="border-2" style={{ borderColor: sarcFResult.color, backgroundColor: sarcFResult.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">SARC-F得分</p>
          <p className="text-3xl font-bold" style={{ color: sarcFResult.color }}>{sarcFResult.score} <span className="text-base text-gray-500">/ 10</span></p>
          <p className="font-bold" style={{ color: sarcFResult.color }}>{sarcFResult.level}</p>
        </CardContent>
      </Card>

      {/* Overall Result */}
      <Card className="border-2" style={{ borderColor: overallResult.color, backgroundColor: overallResult.color + '10' }}>
        <CardContent className="p-4">
          <p className="text-center text-sm text-gray-600">肌少症综合评估</p>
          <p className="text-center text-xl font-bold" style={{ color: overallResult.color }}>{overallResult.level}</p>
          <p className="text-sm text-gray-600 mt-2">{overallResult.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export { JfrasScale, SarcFScale };
