import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCga } from '@/context/CgaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Hospital, User, ChevronRight, ChevronLeft, Stethoscope } from 'lucide-react';

// Import all scale components
import BarthelScale from './BarthelScale';
import { JfrasScale, SarcFScale } from './FallAndMuscleScale';
import { VisionScale, VisionFunctionScale, HearingScale } from './SensoryScales';
import { IciqSfScale, BradenScale, WaterSwallowScale, PaduaScale, Nrs2002Scale } from './BodyFunctionScales';
import { MmseScale, CamScale } from './CognitiveScales';
import { Gds15Scale, SasScale, FrailScale, VasScale, AisScale } from './MentalHealthScales';
import { SsrsScale, CirsgScale } from './SocialAndComorbidityScales';
import CgaResultPage from './CgaResultPage';

const scaleComponents: Record<string, React.FC> = {
  barthel: BarthelScale,
  jfras: JfrasScale,
  sarcF: SarcFScale,
  vision: VisionScale,
  visionFunction: VisionFunctionScale,
  hearing: HearingScale,
  iciqSf: IciqSfScale,
  braden: BradenScale,
  waterSwallow: WaterSwallowScale,
  padua: PaduaScale,
  nrs2002: Nrs2002Scale,
  mmse: MmseScale,
  cam: CamScale,
  gds15: Gds15Scale,
  sas: SasScale,
  frail: FrailScale,
  vas: VasScale,
  ais: AisScale,
  ssrs: SsrsScale,
  cirsg: CirsgScale,
};

const scaleNavItems = [
  { id: 'barthel', name: 'Barthel日常生活', category: '躯体功能', icon: '👤' },
  { id: 'jfras', name: 'JFRAS跌倒风险', category: '躯体功能', icon: '🚶' },
  { id: 'sarcF', name: 'SARC-F肌少症', category: '躯体功能', icon: '💪' },
  { id: 'vision', name: '视力筛查', category: '感觉功能', icon: '👁' },
  { id: 'visionFunction', name: '视功能筛查', category: '感觉功能', icon: '👁' },
  { id: 'hearing', name: '听力筛查', category: '感觉功能', icon: '👂' },
  { id: 'iciqSf', name: 'ICI-Q-SF尿失禁', category: '泌尿功能', icon: '💧' },
  { id: 'braden', name: 'Braden压疮', category: '皮肤功能', icon: '🛡' },
  { id: 'waterSwallow', name: '洼田饮水试验', category: '吞咽功能', icon: '🥤' },
  { id: 'padua', name: 'Padua VTE', category: '血栓风险', icon: '🩸' },
  { id: 'nrs2002', name: 'NRS-2002营养', category: '营养状态', icon: '🍎' },
  { id: 'mmse', name: 'MMSE精神状态', category: '认知功能', icon: '🧠' },
  { id: 'cam', name: 'CAM谵妄评估', category: '认知功能', icon: '⚡' },
  { id: 'gds15', name: 'GDS-15抑郁', category: '心理状态', icon: '💭' },
  { id: 'sas', name: 'SAS焦虑', category: '心理状态', icon: '😰' },
  { id: 'frail', name: 'FRAIL衰弱', category: '衰弱评估', icon: '📉' },
  { id: 'vas', name: 'VAS疼痛', category: '疼痛评估', icon: '⚡' },
  { id: 'ais', name: 'AIS失眠', category: '睡眠评估', icon: '🌙' },
  { id: 'ssrs', name: 'SSRS社会支持', category: '社会支持', icon: '🤝' },
  { id: 'cirsg', name: 'CIRS-G共病', category: '共病评估', icon: '📋' },
];

const CgaMainPage: React.FC = () => {
  const { patientName, setPatientName, patientAge, setPatientAge, patientGender, setPatientGender, assessDate, setAssessDate } = useCga();
  const [phase, setPhase] = useState<'info' | 'scales' | 'result'>('info');
  const [activeScale, setActiveScale] = useState('barthel');
  const [completedScales, setCompletedScales] = useState<Set<string>>(new Set());

  const markCompleted = (id: string) => {
    setCompletedScales(prev => new Set(prev).add(id));
  };

  const currentScaleIndex = scaleNavItems.findIndex(s => s.id === activeScale);
  const progress = ((completedScales.size) / scaleNavItems.length) * 100;

  const goNext = () => {
    markCompleted(activeScale);
    if (currentScaleIndex < scaleNavItems.length - 1) {
      setActiveScale(scaleNavItems[currentScaleIndex + 1].id);
    } else {
      setPhase('result');
    }
  };

  const goPrev = () => {
    if (currentScaleIndex > 0) {
      setActiveScale(scaleNavItems[currentScaleIndex - 1].id);
    }
  };

  const ActiveComponent = scaleComponents[activeScale];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full py-3 px-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">老年综合评估 (CGA)</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hospital className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">上海市第六人民医院老年医学科</span>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* ===== PHASE 1: Patient Info ===== */}
        {phase === 'info' && (
          <motion.main key="info" className="max-w-2xl mx-auto px-4 py-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  患者基本信息
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">姓名</Label>
                    <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="患者姓名" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">年龄</Label>
                    <Input type="number" value={patientAge} onChange={(e) => setPatientAge(Number(e.target.value))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">性别</Label>
                    <div className="flex gap-2 mt-1">
                      {[{v:'male',l:'男'},{v:'female',l:'女'}].map(o => (
                        <button key={o.v} onClick={() => setPatientGender(o.v as 'male'|'female')}
                          className={`px-4 py-2 rounded border flex-1 ${patientGender === o.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">评估日期</Label>
                    <Input type="date" value={assessDate} onChange={(e) => setAssessDate(e.target.value)} />
                  </div>
                </div>

                <Button onClick={() => setPhase('scales')} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-5">
                  开始评估
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.main>
        )}

        {/* ===== PHASE 2: Scales ===== */}
        {phase === 'scales' && (
          <motion.div key="scales" className="max-w-5xl mx-auto px-4 py-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-4">
              {/* Sidebar Navigation */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <Card className="sticky top-20">
                  <CardContent className="p-3">
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>完成进度</span>
                        <span>{completedScales.size}/{scaleNavItems.length}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="space-y-0.5 max-h-[70vh] overflow-y-auto">
                      {scaleNavItems.map(item => (
                        <button key={item.id} onClick={() => setActiveScale(item.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                            activeScale === item.id ? 'bg-blue-100 text-blue-800 font-medium' :
                            completedScales.has(item.id) ? 'text-green-700 bg-green-50' : 'text-gray-600 hover:bg-gray-100'
                          }`}>
                          <span>{completedScales.has(item.id) ? '✓' : item.icon}</span>
                          <span className="truncate">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {/* Mobile nav */}
                <div className="lg:hidden mb-4">
                  <select value={activeScale} onChange={(e) => setActiveScale(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm">
                    {scaleNavItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {completedScales.has(item.id) ? '✓ ' : ''}{item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scale Title */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{scaleNavItems.find(s => s.id === activeScale)?.name}</h2>
                    <p className="text-sm text-gray-500">{scaleNavItems.find(s => s.id === activeScale)?.category}</p>
                  </div>
                  <span className="text-sm text-gray-400">{currentScaleIndex + 1} / {scaleNavItems.length}</span>
                </div>

                {/* Scale Component */}
                <motion.div key={activeScale} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                  {ActiveComponent && <ActiveComponent />}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 mb-12">
                  <Button variant="outline" onClick={goPrev} disabled={currentScaleIndex === 0} className="flex-1 py-5">
                    <ChevronLeft className="mr-2 w-4 h-4" /> 上一个
                  </Button>
                  <Button onClick={goNext} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white">
                    {currentScaleIndex === scaleNavItems.length - 1 ? '查看结果' : '下一个'}
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </main>
            </div>
          </motion.div>
        )}

        {/* ===== PHASE 3: Result ===== */}
        {phase === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CgaResultPage onBack={() => setPhase('scales')} onRestart={() => { setPhase('info'); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CgaMainPage;
