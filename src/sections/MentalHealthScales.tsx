import React from 'react';
import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { calculateGds15, calculateSas, calculateFrail, calculateVas, calculateAis } from '@/lib/cgaCalculators';

// ===== GDS-15 =====
export const Gds15Scale: React.FC = () => {
  const { gds15, setGds15 } = useCga();
  const result = calculateGds15(gds15);

  // GDS-15 questions (index: 0-14)
  // Scoring: items where "yes" = 1 point (depressive): 2,3,4,6,8,9,10,12,13,14,15
  // Items where "no" = 1 point (positive items reversed): 1,5,7,11
  const questions = [
    { q: '你对你的生活基本满意吗？', yesScore: 0, noScore: 1 },
    { q: '你是否已经放弃了很多活动和兴趣爱好？', yesScore: 1, noScore: 0 },
    { q: '你是否感到生活空虚？', yesScore: 1, noScore: 0 },
    { q: '你是否经常感到厌倦？', yesScore: 1, noScore: 0 },
    { q: '你是否大部分时间感觉精神好？', yesScore: 0, noScore: 1 },
    { q: '你是否害怕有不幸的事落到你头上？', yesScore: 1, noScore: 0 },
    { q: '大部分时间你觉得快乐吗？', yesScore: 0, noScore: 1 },
    { q: '你是否经常感到无助？', yesScore: 1, noScore: 0 },
    { q: '你是否宁愿呆在家里而不愿去干新鲜事？', yesScore: 1, noScore: 0 },
    { q: '你是否觉得记忆力较大多数人差？', yesScore: 1, noScore: 0 },
    { q: '你是否觉得现在活的很惬意？', yesScore: 0, noScore: 1 },
    { q: '你是否觉得像现在这样生活毫无意义？', yesScore: 1, noScore: 0 },
    { q: '你是否觉得你的处境毫无希望？', yesScore: 1, noScore: 0 },
    { q: '你是否觉得大部分人处境比你好？', yesScore: 1, noScore: 0 },
    { q: '你对集中注意力有困难吗？', yesScore: 1, noScore: 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">GDS-15 老年抑郁量表</h3>
        <p className="text-sm text-blue-700">根据最近一周实际感受选择。&gt;5分为阳性，提示抑郁可能。</p>
      </div>

      {questions.map((item, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <Label className="text-sm font-medium block mb-2">{idx+1}. {item.q}</Label>
            <div className="flex gap-2">
              <button onClick={() => setGds15(p => { const a = [...p.answers]; a[idx] = item.yesScore; return { answers: a }; })}
                className={`px-3 py-2 rounded text-sm border flex-1 ${gds15.answers[idx] === item.yesScore ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                是
              </button>
              <button onClick={() => setGds15(p => { const a = [...p.answers]; a[idx] = item.noScore; return { answers: a }; })}
                className={`px-3 py-2 rounded text-sm border flex-1 ${gds15.answers[idx] === item.noScore ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                否
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 15</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== SAS 焦虑 =====
export const SasScale: React.FC = () => {
  const { sas, setSas } = useCga();
  const result = calculateSas(sas);

  const questions = [
    '我觉得比平时容易紧张或着急',
    '我无缘无故地感到害怕',
    '我容易心里烦乱或感到惊恐',
    '我觉得我可能将要发疯',
    '我觉得一切都很好，也不会发生什么不幸 *',
    '我手脚发抖打颤',
    '我因为头疼、颈痛和背痛而苦恼',
    '我觉得容易衰弱和疲乏',
    '我觉得心平气和，并且容易安静坐着 *',
    '我觉得心跳得很快',
    '我因为一阵阵头晕而苦恼',
    '我有晕倒发作，或觉得要晕倒似的',
    '我吸气呼气都感到很容易 *',
    '我的手脚麻木和刺痛',
    '我因为胃痛和消化不良而苦恼',
    '我常常要小便',
    '我的手脚常常是干燥温暖的 *',
    '我脸红发热',
    '我容易入睡并且一夜睡得很好 *',
    '我做噩梦',
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">SAS 焦虑自评量表</h3>
        <p className="text-sm text-blue-700">根据最近一周实际感受。标*题为反向计分。标准分&lt;50正常，50-59轻度，60-69中度，≥70重度。</p>
      </div>

      {questions.map((q, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <Label className="text-sm font-medium block mb-2">{idx+1}. {q}</Label>
            <div className="flex gap-1">
              {[{v:1,l:'没有/偶尔'},{v:2,l:'有时'},{v:3,l:'经常'},{v:4,l:'总是'}].map(o => (
                <button key={o.v} onClick={() => setSas(p => { const a = [...p.answers]; a[idx] = o.v; return { answers: a }; })}
                  className={`px-2 py-2 rounded text-xs border flex-1 ${sas.answers[idx] === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">标准分 = 粗分 × 1.25</p>
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 100</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== FRAIL 衰弱 =====
export const FrailScale: React.FC = () => {
  const { frail, setFrail } = useCga();
  const result = calculateFrail(frail);

  const items = [
    { key: 'fatigue', label: 'F - 疲乏', q: '过去4周内大部分时间或所有时间感到疲乏？' },
    { key: 'resistance', label: 'R - 阻力增加/耐力减退', q: '不用辅助工具及不用他人帮助，中途不休息爬10级台阶有困难？' },
    { key: 'ambulation', label: 'A - 自由活动下降', q: '不用辅助工具及不用他人帮助，走完1个街区（100m）较困难？' },
    { key: 'illness', label: 'I - 疾病情况', q: '医生曾告诉你存在5种以上以下疾病（高血压、糖尿病、心梗、恶性肿瘤、心衰、哮喘、关节炎、慢阻肺、肾病、心绞痛等）？' },
    { key: 'weightLoss', label: 'L - 体重下降', q: '1年或更短时间内体重下降≥5%？' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">FRAIL 衰弱筛查量表</h3>
        <p className="text-sm text-blue-700">0分=健壮，1-2分=衰弱前期，≥3分=衰弱。</p>
      </div>

      {items.map(item => (
        <Card key={item.key}>
          <CardContent className="p-4">
            <Label className="font-bold block mb-1">{item.label}</Label>
            <p className="text-sm text-gray-600 mb-2">{item.q}</p>
            <div className="flex gap-2">
              {[{v: false, l: '否 (0分)'}, {v: true, l: '是 (1分)'}].map(o => (
                <button key={String(o.v)} onClick={() => setFrail(p => ({ ...p, [item.key]: o.v }))}
                  className={`px-3 py-2 rounded text-sm border flex-1 ${(frail as any)[item.key] === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

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

// ===== VAS 疼痛 =====
export const VasScale: React.FC = () => {
  const { vas, setVas } = useCga();
  const result = calculateVas(vas);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">VAS 视觉模拟疼痛量表</h3>
        <p className="text-sm text-blue-700">0=无痛，1-3轻度，4-6中度，7-10重度。</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Label className="font-bold block mb-4 text-center">请评估当前疼痛强度（0-10）</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">无痛</span>
            <Slider value={[vas.score]} onValueChange={(v) => setVas({ score: v[0] })} min={0} max={10} step={1} className="flex-1" />
            <span className="text-sm text-gray-600">最痛</span>
          </div>
          <p className="text-center text-4xl font-bold mt-4" style={{ color: result.color }}>{vas.score}</p>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== AIS 失眠 =====
export const AisScale: React.FC = () => {
  const { ais, setAis } = useCga();
  const result = calculateAis(ais);

  const items = [
    '入睡时间（关灯后到睡着的时间）',
    '夜间苏醒',
    '比期望的时间早醒',
    '总睡眠时间',
    '总睡眠质量（无论睡多长）',
    '白天情绪',
    '白天功能（体力或精神：如记忆、注意）',
    '白天思睡',
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">AIS 阿森斯失眠量表</h3>
        <p className="text-sm text-blue-700">过去1个月内每周至少发生3次。1-8项计分：&lt;4无睡眠障碍，4-6可疑，&gt;6失眠。9-10项不计分。</p>
      </div>

      {items.map((item, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <Label className="text-sm font-medium block mb-2">{idx+1}. {item}</Label>
            <div className="flex gap-1">
              {[{v:0,l:'没问题'},{v:1,l:'轻微'},{v:2,l:'显著'},{v:3,l:'严重/没有睡觉'}].map(o => (
                <button key={o.v} onClick={() => setAis(p => { const a = [...p.items]; a[idx] = o.v; return { ...p, items: a }; })}
                  className={`px-2 py-2 rounded text-xs border flex-1 ${ais.items[idx] === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Extra items not scored */}
      <Card className="border-dashed border-gray-300">
        <CardContent className="p-4">
          <p className="text-xs text-gray-500 mb-2">以下两项不计入总分，仅供参考</p>
          <Label className="text-sm font-medium block mb-2">9. 午睡习惯</Label>
          <div className="flex gap-1 mb-3">
            {[{v:0,l:'没问题'},{v:1,l:'轻微'},{v:2,l:'显著'},{v:3,l:'严重'}].map(o => (
              <button key={o.v} onClick={() => setAis(p => ({ ...p, napHabit: o.v }))}
                className={`px-2 py-2 rounded text-xs border flex-1 ${ais.napHabit === o.v ? 'bg-gray-400 text-white border-gray-400' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
          <Label className="text-sm font-medium block mb-2">10. 药物催眠情况</Label>
          <div className="flex gap-1">
            {[{v:0,l:'无'},{v:1,l:'1种,1-3次/周'},{v:2,l:'1种,4-7次/周'},{v:3,l:'≥2种'}].map(o => (
              <button key={o.v} onClick={() => setAis(p => ({ ...p, medication: o.v }))}
                className={`px-2 py-2 rounded text-xs border flex-1 ${ais.medication === o.v ? 'bg-gray-400 text-white border-gray-400' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">1-8项总分（9-10项不计分）</p>
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 24</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};
