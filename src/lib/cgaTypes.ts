// CGA 老年综合评估 - 类型定义

// ===== 1. Barthel指数 (BADL) =====
export interface BarthelData {
  feeding: number;      // 进食: 10/5/0
  bathing: number;      // 洗澡: 5/0
  grooming: number;     // 个人卫生: 5/0
  dressing: number;     // 穿衣: 10/5/0
  bowelControl: number; // 大便控制: 10/5/0
  bladderControl: number; // 小便控制: 10/5/0
  toileting: number;    // 用厕: 10/5/0
  bedTransfer: number;  // 床椅转移: 15/10/5/0
  walking: number;      // 平地行走: 15/10/5/0
  stairClimbing: number; // 上下楼梯: 10/5/0
}

// ===== 2. JFRAS跌倒风险评估 =====
export interface JfrasData {
  // 第一部分筛选
  completelyImmobile: boolean;  // 完全瘫痪
  fallHistory2x: boolean;       // 6个月内≥2次跌倒
  inpatientFall: boolean;       // 住院期间跌倒
  highRiskProtocol: boolean;    // 医嘱高风险
  // 第二部分评分
  age: number;                  // 0-3
  fallHistory1x: number;        // 0或5
  elimination: number;          // 0/2/4
  highRiskDrugs: number;        // 0/3/5/7
  medicalDevices: number;       // 0/1/2/3
  mobility: number[];           // 多选 每项2分
  cognition: number[];          // 多选 1/2/4
}

// ===== 3. SARC-F肌少症筛查 =====
export interface SarcFData {
  strength: number;     // 提重物: 0/1/2
  walking: number;      // 步行: 0/1/2
  riseFromChair: number; // 座椅起身: 0/1/2
  climbing: number;     // 爬楼梯: 0/1/2
  falls: number;        // 跌倒: 0/1/2
}

// ===== 4. 视力/听力筛查 =====
export interface SensoryData {
  visionReading: number;  // 视力读报: 0-4
  visionFunction: number[]; // 视功能筛查: 3项 0/1
  hearingLeft: number;    // 左耳听力: 0-1 (通过/不通过)
  hearingRight: number;   // 右耳听力: 0-1
}

// ===== 5. ICI-Q-SF尿失禁 =====
export interface IciqSfData {
  frequency: number;    // 溢尿频率: 0-5
  amount: number;       // 溢尿量: 0/2/4/6
  impact: number;       // 影响程度: 0-10
}

// ===== 6. Braden压疮风险评估 =====
export interface BradenData {
  sensory: number;      // 感知能力: 1-4
  moisture: number;     // 潮湿程度: 1-4
  activity: number;     // 活动能力: 1-4
  mobility: number;     // 移动能力: 1-4
  nutrition: number;    // 营养: 1-4
  friction: number;     // 摩擦力: 1-3
}

// ===== 7. 洼田饮水试验 =====
export interface WaterSwallowData {
  level: number; // 1-5级
}

// ===== 8. Padua VTE评估 =====
export interface PaduaData {
  activeCancer: boolean;        // 活动性恶性肿瘤
  priorVTE: boolean;            // 既往VTE
  immobilization: boolean;      // 制动≥3天
  thrombophilia: boolean;       // 血栓形成倾向
  recentTraumaSurgery: boolean; // 近期创伤/手术
  age70plus: boolean;           // ≥70岁
  heartRespFailure: boolean;    // 心肺衰竭
  amiStroke: boolean;           // AMI/缺血性脑卒中
  acuteInfection: boolean;      // 急性感染
  obesity: boolean;             // BMI≥30
  hormoneTherapy: boolean;      // 激素治疗
}

// ===== 9. NRS-2002营养风险 =====
export interface Nrs2002Data {
  diseaseSeverity: number; // 0-3
  nutritionalStatus: number; // 0-3
  age70plus: boolean;      // ≥70岁
}

// ===== 10. MMSE =====
export interface MmseData {
  orientation: number[];     // 10项 0/1
  memory: number[];          // 3项 0/1
  attention: number[];       // 5项 0/1
  recall: number[];          // 3项 0/1
  language: number[];        // 9项 0/1
}

// ===== 11. CAM谵妄评估 =====
export interface CamData {
  acuteOnset: boolean;        // 1a 急性发作
  fluctuation: boolean;       // 1b 波动
  inattention: boolean;       // 2 注意力不集中
  disorganizedThinking: boolean; // 3 思维混乱
  alteredConsciousness: boolean; // 4 意识改变
}

// ===== 12. GDS-15抑郁量表 =====
export interface Gds15Data {
  answers: number[]; // 15项 0或1
}

// ===== 13. SAS焦虑量表 =====
export interface SasData {
  answers: number[]; // 20项 1-4
}

// ===== 14. FRAIL衰弱量表 =====
export interface FrailData {
  fatigue: boolean;      // 疲乏
  resistance: boolean;   // 爬楼梯困难
  ambulation: boolean;   // 行走困难
  illness: boolean;      // ≥5种疾病
  weightLoss: boolean;   // 体重下降≥5%
}

// ===== 15. VAS疼痛 =====
export interface VasData {
  score: number; // 0-10
}

// ===== 16. AIS失眠量表 =====
export interface AisData {
  items: number[]; // 8项 0-3 (第9、10项不计分)
  napHabit: number;     // 第9项 不计分
  medication: number;   // 第10项 不计分
}

// ===== 17. SSRS社会支持 =====
export interface SsrsData {
  friends: number;        // 1-4
  living: number;         // 1-4
  neighbors: number;      // 1-4
  colleagues: number;     // 1-4
  familySupport: number[]; // 5项A-E 每项1-4
  economicSources: number; // 第6题 0-N
  emotionalSources: number; // 第7题 0-N
  confession: number;     // 第8题 1-4
  helpSeeking: number;    // 第9题 1-4
  groupActivity: number;  // 第10题 1-4
}

// ===== 18. CIRS-G共病评估 =====
export interface CirsgData {
  systems: number[]; // 14个系统 0-4
}

// ===== 综合评估数据 =====
export interface CgaAssessmentData {
  barthel: BarthelData;
  jfras: JfrasData;
  sarcF: SarcFData;
  gripStrength: { dominant: number; nonDominant: number }; // kg
  walkingSpeed: number; // m/s
  sensory: SensoryData;
  iciqSf: IciqSfData;
  braden: BradenData;
  waterSwallow: WaterSwallowData;
  padua: PaduaData;
  nrs2002: Nrs2002Data;
  mmse: MmseData;
  cam: CamData;
  gds15: Gds15Data;
  sas: SasData;
  frail: FrailData;
  vas: VasData;
  ais: AisData;
  ssrs: SsrsData;
  cirsg: CirsgData;
}

// ===== 评估结果 =====
export interface ScaleResult {
  scaleName: string;
  score: number;
  maxScore: number;
  level: string;
  color: string;
  interpretation: string;
  interventions: string[];
}

export interface CgaResult {
  scaleResults: ScaleResult[];
  overallSummary: string;
  priorityInterventions: string[];
}
