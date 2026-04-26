import React from 'react';
import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateIciqSf, calculateBraden, calculateWaterSwallow, calculatePadua, calculateNrs2002 } from '@/lib/cgaCalculators';

// ===== ICI-Q-SF 尿失禁 =====
export const IciqSfScale: React.FC = () => {
  const { iciqSf, setIciqSf } = useCga();
  const result = calculateIciqSf(iciqSf);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">ICI-Q-SF 尿失禁问卷</h3>
        <p className="text-sm text-blue-700">结合近4周症状评估。1-3题计分之和，0分正常，1-7轻度，8-14中度，15-21重度。</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">1. 您溢尿的次数？</Label>
          <RadioGroup value={String(iciqSf.frequency)} onValueChange={(v) => setIciqSf(p => ({ ...p, frequency: Number(v) }))} className="space-y-1">
            {[{v:0,l:'从来不溢尿'},{v:1,l:'每周≤1次'},{v:2,l:'每周2-3次'},{v:3,l:'每天约1次'},{v:4,l:'1天数次'},{v:5,l:'始终溢尿'}].map(o => (
              <div key={o.v} className="flex items-center space-x-2">
                <RadioGroupItem value={String(o.v)} id={`icq1-${o.v}`} />
                <Label htmlFor={`icq1-${o.v}`} className="text-sm">{o.l} <span className="text-blue-600 font-bold">{o.v}分</span></Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">2. 通常情况下，溢尿量是多少？</Label>
          <RadioGroup value={String(iciqSf.amount)} onValueChange={(v) => setIciqSf(p => ({ ...p, amount: Number(v) }))} className="space-y-1">
            {[{v:0,l:'不溢尿'},{v:2,l:'少量（会阴部湿/尿垫1块/天）'},{v:4,l:'中等量（内裤常湿/尿垫2块/天）'},{v:6,l:'大量（外裤常湿/尿垫≥3块/天）'}].map(o => (
              <div key={o.v} className="flex items-center space-x-2">
                <RadioGroupItem value={String(o.v)} id={`icq2-${o.v}`} />
                <Label htmlFor={`icq2-${o.v}`} className="text-sm">{o.l} <span className="text-blue-600 font-bold">{o.v}分</span></Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">3. 溢尿对日常生活影响程度？（0-无影响 到 10-很大影响）</Label>
          <div className="flex items-center gap-4">
            <Slider value={[iciqSf.impact]} onValueChange={(v) => setIciqSf(p => ({ ...p, impact: v[0] }))} min={0} max={10} step={1} className="flex-1" />
            <span className="text-xl font-bold text-blue-600 min-w-[40px]">{iciqSf.impact}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>无影响</span><span>很大影响</span></div>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 21</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== Braden 压疮 =====
export const BradenScale: React.FC = () => {
  const { braden, setBraden } = useCga();
  const result = calculateBraden(braden);

  const sections = [
    { key: 'sensory', label: '感知能力', opts: [{v:1,l:'完全受限'},{v:2,l:'大部分受限'},{v:3,l:'轻度受限'},{v:4,l:'正常'}] },
    { key: 'moisture', label: '潮湿程度', opts: [{v:1,l:'持续潮湿'},{v:2,l:'非常潮湿'},{v:3,l:'偶尔潮湿'},{v:4,l:'罕见潮湿'}] },
    { key: 'activity', label: '活动能力', opts: [{v:1,l:'卧床'},{v:2,l:'坐椅子'},{v:3,l:'偶尔步行'},{v:4,l:'经常步行'}] },
    { key: 'mobility', label: '移动能力', opts: [{v:1,l:'完全受限'},{v:2,l:'非常受限'},{v:3,l:'轻微受限'},{v:4,l:'不受限'}] },
    { key: 'nutrition', label: '营养摄取', opts: [{v:1,l:'非常差'},{v:2,l:'可能不足'},{v:3,l:'充足'},{v:4,l:'丰富'}] },
    { key: 'friction', label: '摩擦力/剪切力', opts: [{v:1,l:'存在问题'},{v:2,l:'潜在问题'},{v:3,l:'不存在问题'}] },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">Braden 压疮风险评估</h3>
        <p className="text-sm text-blue-700">&gt;18分无风险，15-18低风险，13-14中风险，10-12高风险，&lt;9极度风险。</p>
      </div>

      {sections.map(s => (
        <Card key={s.key}>
          <CardContent className="p-4">
            <Label className="font-bold block mb-2">{s.label}</Label>
            <div className="flex flex-wrap gap-2">
              {s.opts.map(o => (
                <button key={o.v} onClick={() => setBraden(p => ({ ...p, [s.key]: o.v }))}
                  className={`px-3 py-2 rounded text-sm border ${(braden as any)[s.key] === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {o.l} ({o.v}分)
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 23</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== 洼田饮水试验 =====
export const WaterSwallowScale: React.FC = () => {
  const { waterSwallow, setWaterSwallow } = useCga();
  const result = calculateWaterSwallow(waterSwallow);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">洼田饮水试验</h3>
        <p className="text-sm text-blue-700">患者端坐，喝下30ml温开水，观察所需时间和呛咳情况。</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <RadioGroup value={String(waterSwallow.level)} onValueChange={(v) => setWaterSwallow({ level: Number(v) })} className="space-y-2">
            {[
              {v:1,l:'1级（优）- 能顺利1次咽下'},
              {v:2,l:'2级（良）- 分2次以上，能不呛咳咽下'},
              {v:3,l:'3级（中）- 能1次咽下，但有呛咳'},
              {v:4,l:'4级（可）- 分2次以上咽下，但有呛咳'},
              {v:5,l:'5级（差）- 频发呛咳，不能全部咽下'},
            ].map(o => (
              <div key={o.v} className={`flex items-center space-x-3 px-3 py-2 rounded border ${waterSwallow.level === o.v ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                <RadioGroupItem value={String(o.v)} id={`wt-${o.v}`} />
                <Label htmlFor={`wt-${o.v}`} className="cursor-pointer text-sm">{o.l}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} 级</p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== Padua VTE =====
export const PaduaScale: React.FC = () => {
  const { padua, setPadua } = useCga();
  const result = calculatePadua(padua);

  const items = [
    { key: 'activeCancer', label: '活动性恶性肿瘤（6个月内化疗/放疗或转移）', score: 3 },
    { key: 'priorVTE', label: '既往静脉血栓栓塞症', score: 3 },
    { key: 'immobilization', label: '制动/卧床≥3天', score: 3 },
    { key: 'thrombophilia', label: '血栓形成倾向（抗凝血酶缺陷、蛋白C/S缺乏等）', score: 3 },
    { key: 'recentTraumaSurgery', label: '近期（≤1个月）创伤或外科手术', score: 2 },
    { key: 'age70plus', label: '年龄≥70岁', score: 1 },
    { key: 'heartRespFailure', label: '心脏和/或呼吸衰竭', score: 1 },
    { key: 'amiStroke', label: '急性心肌梗死和/或缺血性脑卒中', score: 1 },
    { key: 'acuteInfection', label: '急性感染和/或风湿性疾病', score: 1 },
    { key: 'obesity', label: '肥胖（BMI≥30 kg/m²）', score: 1 },
    { key: 'hormoneTherapy', label: '正在进行激素治疗', score: 1 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">Padua VTE风险评估</h3>
        <p className="text-sm text-blue-700">≥4分为VTE高风险，建议药物预防。</p>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <Card key={item.key}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox checked={(padua as any)[item.key]} onCheckedChange={(c) => setPadua(p => ({ ...p, [item.key]: c as boolean }))} />
                  <Label className="cursor-pointer text-sm">{item.label}</Label>
                </div>
                <span className="text-sm font-bold text-blue-600">+{item.score}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 20</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== NRS-2002 =====
export const Nrs2002Scale: React.FC = () => {
  const { nrs2002, setNrs2002 } = useCga();
  const result = calculateNrs2002(nrs2002);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">NRS-2002 营养风险筛查</h3>
        <p className="text-sm text-blue-700">总分≥3分为有营养风险。</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">疾病严重程度</Label>
          <RadioGroup value={String(nrs2002.diseaseSeverity)} onValueChange={(v) => setNrs2002(p => ({ ...p, diseaseSeverity: Number(v) }))} className="space-y-1">
            {[{v:0,l:'0分 - 正常饮食，无特殊疾病'},{v:1,l:'1分 - 骨盆骨折、COPD、长期血透、肝硬化、一般恶性肿瘤、糖尿病'},{v:2,l:'2分 - 腹部大手术、脑卒中、重症肺炎、血液恶性肿瘤'},{v:3,l:'3分 - 颅脑损伤、骨髓抑制、ICU患者（APACHE II >10）'}].map(o => (
              <div key={o.v} className={`flex items-center space-x-2 px-2 py-1 rounded ${nrs2002.diseaseSeverity === o.v ? 'bg-blue-50 border border-blue-200' : ''}`}>
                <RadioGroupItem value={String(o.v)} id={`nrs-d-${o.v}`} />
                <Label htmlFor={`nrs-d-${o.v}`} className="text-sm">{o.l}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">营养状态</Label>
          <RadioGroup value={String(nrs2002.nutritionalStatus)} onValueChange={(v) => setNrs2002(p => ({ ...p, nutritionalStatus: Number(v) }))} className="space-y-1">
            {[{v:0,l:'0分 - 正常营养状态'},{v:1,l:'1分 - 3个月内体重下降>5%或近1周进食减少25-50%'},{v:2,l:'2分 - 2个月内体重下降>5%或BMI 18.5-20.5或近1周进食减少50-75%'},{v:3,l:'3分 - 1个月内体重下降>5%或BMI<18.5或白蛋白<35g/L或近1周进食减少75-100%'}].map(o => (
              <div key={o.v} className={`flex items-center space-x-2 px-2 py-1 rounded ${nrs2002.nutritionalStatus === o.v ? 'bg-blue-50 border border-blue-200' : ''}`}>
                <RadioGroupItem value={String(o.v)} id={`nrs-n-${o.v}`} />
                <Label htmlFor={`nrs-n-${o.v}`} className="text-sm">{o.l}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">年龄</Label>
          <div className="flex gap-2">
            {[{v: false, l: '<70岁 (0分)'}, {v: true, l: '≥70岁 (+1分)'}].map(o => (
              <button key={String(o.v)} onClick={() => setNrs2002(p => ({ ...p, age70plus: o.v }))}
                className={`px-3 py-2 rounded text-sm border flex-1 ${nrs2002.age70plus === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 7</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};
