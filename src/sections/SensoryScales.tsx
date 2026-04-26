import React from 'react';
import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { calculateVision, calculateVisionFunction, calculateHearing } from '@/lib/cgaCalculators';

// 视力快速筛查
export const VisionScale: React.FC = () => {
  const { sensory, setSensory } = useCga();
  const result = calculateVision(sensory);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">视力快速筛查（读报检查法）</h3>
        <p className="text-sm text-blue-700">佩戴眼镜情况下评估。</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <RadioGroup value={String(sensory.visionReading)} onValueChange={(v) => setSensory(p => ({ ...p, visionReading: Number(v) }))} className="space-y-2">
            {[
              {v: 0, l: '能看清书报上的标准字体'}, {v: 1, l: '能看大字体，看不清标准字体'},
              {v: 2, l: '看不清大标题，但能辨认物体'}, {v: 3, l: '辨认物体困难，只能看到光/颜色/形状'}, {v: 4, l: '没有视力，眼睛不能跟随物体'},
            ].map(o => (
              <div key={o.v} className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded border hover:border-blue-300">
                <RadioGroupItem value={String(o.v)} id={`vr-${o.v}`} />
                <Label htmlFor={`vr-${o.v}`} className="cursor-pointer text-sm flex-1">{o.l}</Label>
                <span className="text-sm font-bold text-blue-600">{o.v}分</span>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 4</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// 视功能筛查
export const VisionFunctionScale: React.FC = () => {
  const { sensory, setSensory } = useCga();
  const result = calculateVisionFunction(sensory);

  const items = [
    { label: '阅读、行走和看电视时觉得吃力', idx: 0 },
    { label: '看东西时觉得有遮挡或视物缺损', idx: 1 },
    { label: '看东西时实物变形、扭曲', idx: 2 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">视功能快速筛查</h3>
        <p className="text-sm text-blue-700">回答"否"得1分，"是"得0分。≤1分：视功能差；2分：较差；3分：良好。</p>
      </div>

      {items.map(item => (
        <Card key={item.idx}>
          <CardContent className="p-4">
            <Label className="text-sm font-medium block mb-2">{item.label}</Label>
            <div className="flex gap-2">
              {[{v: 0, l: '是 (0分)'}, {v: 1, l: '否 (1分)'}].map(o => (
                <button key={o.v} onClick={() => setSensory(p => {
                  const arr = [...p.visionFunction];
                  arr[item.idx] = o.v;
                  return { ...p, visionFunction: arr };
                })}
                  className={`px-3 py-2 rounded text-sm border flex-1 ${sensory.visionFunction[item.idx] === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 3</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// 听力筛查
export const HearingScale: React.FC = () => {
  const { sensory, setSensory } = useCga();
  const result = calculateHearing(sensory);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900">听力筛查（轻声耳语试验）</h3>
        <p className="text-sm text-blue-700">在老人无法注视的耳侧15-30cm处轻声说出3-6个数字让其辨别。不能回答半数以上为不通过。</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold text-gray-800 block mb-3">左耳听力</Label>
          <div className="flex gap-2">
            {[{v: 1, l: '通过'}, {v: 0, l: '不通过'}].map(o => (
              <button key={o.v} onClick={() => setSensory(p => ({ ...p, hearingLeft: o.v }))}
                className={`px-3 py-2 rounded text-sm border flex-1 ${sensory.hearingLeft === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Label className="font-bold text-gray-800 block mb-3">右耳听力</Label>
          <div className="flex gap-2">
            {[{v: 1, l: '通过'}, {v: 0, l: '不通过'}].map(o => (
              <button key={o.v} onClick={() => setSensory(p => ({ ...p, hearingRight: o.v }))}
                className={`px-3 py-2 rounded text-sm border flex-1 ${sensory.hearingRight === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: result.color, backgroundColor: result.color + '10' }}>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: result.color }}>{result.score} <span className="text-base text-gray-500">/ 2</span></p>
          <p className="font-bold" style={{ color: result.color }}>{result.level}</p>
        </CardContent>
      </Card>
    </div>
  );
};
