import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  BarthelData, JfrasData, SarcFData, SensoryData, IciqSfData,
  BradenData, WaterSwallowData, PaduaData, Nrs2002Data, MmseData,
  CamData, Gds15Data, SasData, FrailData, VasData, AisData,
  SsrsData, CirsgData, CgaResult
} from '@/lib/cgaTypes';
import {
  calculateBarthel, calculateJfras, calculateSarcF, calculateVision,
  calculateVisionFunction, calculateHearing, calculateIciqSf,
  calculateBraden, calculateWaterSwallow, calculatePadua,
  calculateNrs2002, calculateMmse, calculateCam, calculateGds15,
  calculateSas, calculateFrail, calculateVas, calculateAis,
  calculateSsrs, calculateCirsg, calculateSarcopeniaOverall
} from '@/lib/cgaCalculators';

// 默认数据
const defaultBarthel: BarthelData = { feeding: 10, bathing: 5, grooming: 5, dressing: 10, bowelControl: 10, bladderControl: 10, toileting: 10, bedTransfer: 15, walking: 15, stairClimbing: 10 };
const defaultJfras: JfrasData = { completelyImmobile: false, fallHistory2x: false, inpatientFall: false, highRiskProtocol: false, age: 0, fallHistory1x: 0, elimination: 0, highRiskDrugs: 0, medicalDevices: 0, mobility: [], cognition: [] };
const defaultSarcF: SarcFData = { strength: 0, walking: 0, riseFromChair: 0, climbing: 0, falls: 0 };
const defaultSensory: SensoryData = { visionReading: 0, visionFunction: [1, 1, 1], hearingLeft: 1, hearingRight: 1 };
const defaultIciqSf: IciqSfData = { frequency: 0, amount: 0, impact: 0 };
const defaultBraden: BradenData = { sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3 };
const defaultWaterSwallow: WaterSwallowData = { level: 1 };
const defaultPadua: PaduaData = { activeCancer: false, priorVTE: false, immobilization: false, thrombophilia: false, recentTraumaSurgery: false, age70plus: false, heartRespFailure: false, amiStroke: false, acuteInfection: false, obesity: false, hormoneTherapy: false };
const defaultNrs2002: Nrs2002Data = { diseaseSeverity: 0, nutritionalStatus: 0, age70plus: false };
const defaultMmse: MmseData = { orientation: Array(10).fill(1), memory: Array(3).fill(1), attention: Array(5).fill(1), recall: Array(3).fill(1), language: Array(9).fill(1) };
const defaultCam: CamData = { acuteOnset: false, fluctuation: false, inattention: false, disorganizedThinking: false, alteredConsciousness: false };
const defaultGds15: Gds15Data = { answers: Array(15).fill(0) };
const defaultSas: SasData = { answers: Array(20).fill(1) };
const defaultFrail: FrailData = { fatigue: false, resistance: false, ambulation: false, illness: false, weightLoss: false };
const defaultVas: VasData = { score: 0 };
const defaultAis: AisData = { items: Array(8).fill(0), napHabit: 0, medication: 0 };
const defaultSsrs: SsrsData = { friends: 4, living: 4, neighbors: 4, colleagues: 4, familySupport: [4, 4, 4, 4, 4], economicSources: 2, emotionalSources: 2, confession: 4, helpSeeking: 4, groupActivity: 4 };
const defaultCirsg: CirsgData = { systems: Array(14).fill(0) };

export const scalesList = [
  { id: 'barthel', name: 'Barthel日常生活能力', category: '躯体功能' },
  { id: 'jfras', name: 'JFRAS跌倒风险', category: '躯体功能' },
  { id: 'sarcF', name: 'SARC-F肌少症筛查', category: '躯体功能' },
  { id: 'sensory', name: '视力/听力筛查', category: '感觉功能' },
  { id: 'iciqSf', name: 'ICI-Q-SF尿失禁', category: '泌尿功能' },
  { id: 'braden', name: 'Braden压疮风险', category: '皮肤功能' },
  { id: 'waterSwallow', name: '洼田饮水试验', category: '吞咽功能' },
  { id: 'padua', name: 'Padua VTE风险', category: '血栓风险' },
  { id: 'nrs2002', name: 'NRS-2002营养风险', category: '营养状态' },
  { id: 'mmse', name: 'MMSE精神状态', category: '认知功能' },
  { id: 'cam', name: 'CAM谵妄评估', category: '认知功能' },
  { id: 'gds15', name: 'GDS-15抑郁筛查', category: '心理状态' },
  { id: 'sas', name: 'SAS焦虑评估', category: '心理状态' },
  { id: 'frail', name: 'FRAIL衰弱筛查', category: '衰弱评估' },
  { id: 'vas', name: 'VAS疼痛评估', category: '疼痛评估' },
  { id: 'ais', name: 'AIS失眠评估', category: '睡眠评估' },
  { id: 'ssrs', name: 'SSRS社会支持', category: '社会支持' },
  { id: 'cirsg', name: 'CIRS-G共病评估', category: '共病评估' },
];

interface CgaContextType {
  // 患者基本信息
  patientName: string; setPatientName: (v: string) => void;
  patientAge: number; setPatientAge: (v: number) => void;
  patientGender: 'male' | 'female'; setPatientGender: (v: 'male' | 'female') => void;
  assessDate: string; setAssessDate: (v: string) => void;

  // 各量表数据
  barthel: BarthelData; setBarthel: React.Dispatch<React.SetStateAction<BarthelData>>;
  jfras: JfrasData; setJfras: React.Dispatch<React.SetStateAction<JfrasData>>;
  sarcF: SarcFData; setSarcF: React.Dispatch<React.SetStateAction<SarcFData>>;
  gripStrength: { dominant: number; nonDominant: number }; setGripStrength: React.Dispatch<React.SetStateAction<{ dominant: number; nonDominant: number }>>;
  walkingSpeed: number; setWalkingSpeed: (v: number) => void;
  sensory: SensoryData; setSensory: React.Dispatch<React.SetStateAction<SensoryData>>;
  iciqSf: IciqSfData; setIciqSf: React.Dispatch<React.SetStateAction<IciqSfData>>;
  braden: BradenData; setBraden: React.Dispatch<React.SetStateAction<BradenData>>;
  waterSwallow: WaterSwallowData; setWaterSwallow: React.Dispatch<React.SetStateAction<WaterSwallowData>>;
  padua: PaduaData; setPadua: React.Dispatch<React.SetStateAction<PaduaData>>;
  nrs2002: Nrs2002Data; setNrs2002: React.Dispatch<React.SetStateAction<Nrs2002Data>>;
  mmse: MmseData; setMmse: React.Dispatch<React.SetStateAction<MmseData>>;
  cam: CamData; setCam: React.Dispatch<React.SetStateAction<CamData>>;
  gds15: Gds15Data; setGds15: React.Dispatch<React.SetStateAction<Gds15Data>>;
  sas: SasData; setSas: React.Dispatch<React.SetStateAction<SasData>>;
  frail: FrailData; setFrail: React.Dispatch<React.SetStateAction<FrailData>>;
  vas: VasData; setVas: React.Dispatch<React.SetStateAction<VasData>>;
  ais: AisData; setAis: React.Dispatch<React.SetStateAction<AisData>>;
  ssrs: SsrsData; setSsrs: React.Dispatch<React.SetStateAction<SsrsData>>;
  cirsg: CirsgData; setCirsg: React.Dispatch<React.SetStateAction<CirsgData>>;

  // 计算结果
  calculateResults: () => CgaResult;
  // 重置
  resetAll: () => void;
}

const CgaContext = createContext<CgaContextType | undefined>(undefined);

export function CgaProvider({ children }: { children: React.ReactNode }) {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(75);
  const [patientGender, setPatientGender] = useState<'male' | 'female'>('male');
  const [assessDate, setAssessDate] = useState(new Date().toISOString().split('T')[0]);

  const [barthel, setBarthel] = useState(defaultBarthel);
  const [jfras, setJfras] = useState(defaultJfras);
  const [sarcF, setSarcF] = useState(defaultSarcF);
  const [gripStrength, setGripStrength] = useState({ dominant: 30, nonDominant: 28 });
  const [walkingSpeed, setWalkingSpeed] = useState(1.2);
  const [sensory, setSensory] = useState(defaultSensory);
  const [iciqSf, setIciqSf] = useState(defaultIciqSf);
  const [braden, setBraden] = useState(defaultBraden);
  const [waterSwallow, setWaterSwallow] = useState(defaultWaterSwallow);
  const [padua, setPadua] = useState(defaultPadua);
  const [nrs2002, setNrs2002] = useState(defaultNrs2002);
  const [mmse, setMmse] = useState(defaultMmse);
  const [cam, setCam] = useState(defaultCam);
  const [gds15, setGds15] = useState(defaultGds15);
  const [sas, setSas] = useState(defaultSas);
  const [frail, setFrail] = useState(defaultFrail);
  const [vas, setVas] = useState(defaultVas);
  const [ais, setAis] = useState(defaultAis);
  const [ssrs, setSsrs] = useState(defaultSsrs);
  const [cirsg, setCirsg] = useState(defaultCirsg);

  const calculateResults = useCallback((): CgaResult => {
    const scaleResults = [
      calculateBarthel(barthel),
      calculateJfras(jfras),
      calculateSarcF(sarcF),
      calculateVision(sensory),
      calculateVisionFunction(sensory),
      calculateHearing(sensory),
      calculateIciqSf(iciqSf),
      calculateBraden(braden),
      calculateWaterSwallow(waterSwallow),
      calculatePadua(padua),
      calculateNrs2002(nrs2002),
      calculateMmse(mmse),
      calculateCam(cam),
      calculateGds15(gds15),
      calculateSas(sas),
      calculateFrail(frail),
      calculateVas(vas),
      calculateAis(ais),
      calculateSsrs(ssrs),
      calculateCirsg(cirsg),
      calculateSarcopeniaOverall(sarcF, gripStrength.dominant, gripStrength.nonDominant, walkingSpeed, patientGender),
    ];

    // 找出高风险项目
    const highRisks = scaleResults.filter(r => r.color === '#ef4444');
    const moderateRisks = scaleResults.filter(r => r.color === '#f59e0b');

    let overallSummary = '';
    if (highRisks.length === 0) {
      overallSummary = `本次CGA评估总体情况良好，未发现高危项目。有${moderateRisks.length}项为中风险，建议关注。`;
    } else {
      overallSummary = `本次CGA评估发现${highRisks.length}项高危项目（${highRisks.map(r => r.scaleName).join('、')}），需要重点关注和干预。`;
    }

    // 汇总所有干预措施
    const allInterventions = scaleResults.flatMap(r => r.interventions);
    const uniqueInterventions = [...new Set(allInterventions)];

    // 优先干预（高风险项目的干预优先）
    const priorityInterventions = highRisks.length > 0
      ? highRisks.flatMap(r => [`【${r.scaleName}】${r.level}`, ...r.interventions])
      : moderateRisks.length > 0
        ? moderateRisks.flatMap(r => [`【${r.scaleName}】${r.level}`, ...r.interventions])
        : uniqueInterventions.slice(0, 5);

    return { scaleResults, overallSummary, priorityInterventions };
  }, [barthel, jfras, sarcF, gripStrength, walkingSpeed, sensory, iciqSf, braden, waterSwallow, padua, nrs2002, mmse, cam, gds15, sas, frail, vas, ais, ssrs, cirsg, patientGender]);

  const resetAll = useCallback(() => {
    setPatientName('');
    setPatientAge(75);
    setPatientGender('male');
    setAssessDate(new Date().toISOString().split('T')[0]);
    setBarthel(defaultBarthel);
    setJfras(defaultJfras);
    setSarcF(defaultSarcF);
    setGripStrength({ dominant: 30, nonDominant: 28 });
    setWalkingSpeed(1.2);
    setSensory(defaultSensory);
    setIciqSf(defaultIciqSf);
    setBraden(defaultBraden);
    setWaterSwallow(defaultWaterSwallow);
    setPadua(defaultPadua);
    setNrs2002(defaultNrs2002);
    setMmse(defaultMmse);
    setCam(defaultCam);
    setGds15(defaultGds15);
    setSas(defaultSas);
    setFrail(defaultFrail);
    setVas(defaultVas);
    setAis(defaultAis);
    setSsrs(defaultSsrs);
    setCirsg(defaultCirsg);
  }, []);

  return (
    <CgaContext.Provider value={{
      patientName, setPatientName, patientAge, setPatientAge, patientGender, setPatientGender, assessDate, setAssessDate,
      barthel, setBarthel, jfras, setJfras, sarcF, setSarcF, gripStrength, setGripStrength, walkingSpeed, setWalkingSpeed,
      sensory, setSensory, iciqSf, setIciqSf, braden, setBraden, waterSwallow, setWaterSwallow,
      padua, setPadua, nrs2002, setNrs2002, mmse, setMmse, cam, setCam, gds15, setGds15,
      sas, setSas, frail, setFrail, vas, setVas, ais, setAis, ssrs, setSsrs, cirsg, setCirsg,
      calculateResults, resetAll,
    }}>
      {children}
    </CgaContext.Provider>
  );
}

export function useCga() {
  const context = useContext(CgaContext);
  if (!context) throw new Error('useCga must be used within CgaProvider');
  return context;
}
