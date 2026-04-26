import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateSsrs, calculateCirsg } from '@/lib/cgaCalculators';

// ===== SSRS 社会支持 =====
export const SsrsScale: React.FC = () => {
  const { ssrs, setSsrs } = useCga();
  const result = calculateSsrs(ssrs);

  const setField = (field: string, val: number) => {
    setSsrs(p => ({ ...p, [field]: val }));
  };

  const setFamilySupport = (idx: number, val: number) => {
    setSsrs(p => {
      const arr = [...p.familySupport];
      arr[idx] = val;
      return { ...p, familySupport: arr };
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">SSRS 社会支持评定量表</h3>
        <p className="text-sm text-blue-700">总分&lt;20社会支持较少，20-30一般，30-40满意。</p>
      </div>

      {/* Q1-4: single choice 1-4 */}
      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">1. 您有多少关系密切可得到支持的朋友？</Label>
          <div className="flex gap-1">
            {[{v:1,l:'没有'},{v:2,l:'1-2个'},{v:3,l:'3-5个'},{v:4,l:'≥6个'}].map(o => (
              <button key={o.v} onClick={() => setField('friends', o.v)}
                className={`px-2 py-2 rounded text-xs border flex-1 ${ssrs.friends === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">2. 近一年来您的居住情况</Label>
          <div className="flex flex-wrap gap-1">
            {[{v:1,l:'远离家人独居'},{v:2,l:'住处常变动和陌生人住'},{v:3,l:'和同学/同事/朋友住'},{v:4,l:'和家人住'}].map(o => (
              <button key={o.v} onClick={() => setField('living', o.v)}
                className={`px-2 py-2 rounded text-xs border ${ssrs.living === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">3. 您和邻居</Label>
          <div className="flex flex-wrap gap-1">
            {[{v:1,l:'从不关心'},{v:2,l:'遇到困难可能关心'},{v:3,l:'有些邻居关心您'},{v:4,l:'大多数邻居关心您'}].map(o => (
              <button key={o.v} onClick={() => setField('neighbors', o.v)}
                className={`px-2 py-2 rounded text-xs border ${ssrs.neighbors === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">4. 您和同事</Label>
          <div className="flex flex-wrap gap-1">
            {[{v:1,l:'极少交流'},{v:2,l:'偶尔交流'},{v:3,l:'经常交流'},{v:4,l:'密切合作'}].map(o => (
              <button key={o.v} onClick={() => setField('colleagues', o.v)}
                className={`px-2 py-2 rounded text-xs border ${ssrs.colleagues === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Q5: family support A-E */}
      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">5. 从家庭成员得到的支持和照顾（每项1-4分）</Label>
          {['A-夫妻/恋人', 'B-父母', 'C-儿女', 'D-兄弟姐妹', 'E-其他成员'].map((label, idx) => (
            <div key={idx} className="mb-2">
              <span className="text-sm">{label}</span>
              <div className="flex gap-1 mt-1">
                {[{v:1,l:'无'},{v:2,l:'极少'},{v:3,l:'一般'},{v:4,l:'全力'}].map(o => (
                  <button key={o.v} onClick={() => setFamilySupport(idx, o.v)}
                    className={`px-2 py-1 rounded text-xs border flex-1 ${ssrs.familySupport[idx] === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Q6-7: sources */}
      <Card>
        <CardContent className="p-4">
          <Label className="font-bold block mb-2">6. 遇到急难时经济支持和实际帮助的来源数</Label>
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={8} step={1} value={ssrs.economicSources}
              onChange={(e) => setField('economicSources', Number(e.target.value))}
              className="flex-1" />
            <span className="text-lg font-bold text-blue-600 w-8">{ssrs.economicSources}</span>
          </div>
          <p className="text-xs text-gray-500">0=无任何来源，1-8=来源个数</p>

          <Label className="font-bold block mb-2 mt-4">7. 遇到急难时安慰和关心的来源数</Label>
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={8} step={1} value={ssrs.emotionalSources}
              onChange={(e) => setField('emotionalSources', Number(e.target.value))}
              className="flex-1" />
            <span className="text-lg font-bold text-blue-600 w-8">{ssrs.emotionalSources}</span>
          </div>
        </CardContent>
      </Card>

      {/* Q8-10 */}
      {[
        { key: 'confession', label: '8. 遇到烦恼时的倾诉方式', opts: ['从不向任何人','只向1-2人','朋友询问才说','主动诉说'], num: 8 },
        { key: 'helpSeeking', label: '9. 遇到烦恼时的求助方式', opts: ['只靠自己','很少请求','有时请求','经常求援'], num: 9 },
        { key: 'groupActivity', label: '10. 参加团体活动情况', opts: ['从不参加','偶尔参加','经常参加','主动积极参加'], num: 10 },
      ].map(item => (
        <Card key={item.key}>
          <CardContent className="p-4">
            <Label className="font-bold block mb-2">{item.label}</Label>
            <div className="flex gap-1">
              {item.opts.map((opt, i) => (
                <button key={i} onClick={() => setField(item.key, i+1)}
                  className={`px-2 py-2 rounded text-xs border flex-1 ${(ssrs as any)[item.key] === i+1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score}</p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== CIRS-G 共病评估 =====
export const CirsgScale: React.FC = () => {
  const { cirsg, setCirsg } = useCga();
  const result = calculateCirsg(cirsg);

  const systems = [
    '1. 心脏', '2. 血管', '3. 高血压', '4. 呼吸系统', '5. 神经系统',
    '6. 造血系统', '7. 上消化道', '8. 下消化道', '9. 肝脏', '10. 肾脏',
    '11. 泌尿生殖器', '12. 肌肉骨骼', '13. 眼耳鼻喉咽', '14. 其他',
  ];

  const levels = [
    { v: 0, l: '0-无', desc: '没有问题' },
    { v: 1, l: '1-轻', desc: '轻度，不干扰活动，无需治疗' },
    { v: 2, l: '2-中', desc: '中度功能不良，干扰活动，需治疗' },
    { v: 3, l: '3-重', desc: '严重/持续，可能致残，需立即治疗' },
    { v: 4, l: '4-极重', desc: '终末期/严重功能损害，需紧急治疗' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">CIRS-G 老年累积疾病评估表</h3>
        <p className="text-sm text-blue-700">14个系统分别评估0-4级。总分评估共病负担。</p>
      </div>

      {systems.map((sys, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <Label className="font-bold block mb-2">{sys}</Label>
            <div className="flex flex-wrap gap-1">
              {levels.map(l => (
                <button key={l.v} onClick={() => setCirsg(p => { const arr = [...p.systems]; arr[idx] = l.v; return { systems: arr }; })}
                  className={`px-2 py-2 rounded text-xs border ${cirsg.systems[idx] === l.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                  title={l.desc}>
                  {l.l}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 56</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
          <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
        </CardContent>
      </Card>
    </div>
  );
};
