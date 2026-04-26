import type {
  BarthelData, JfrasData, SarcFData, SensoryData, IciqSfData,
  BradenData, WaterSwallowData, PaduaData, Nrs2002Data, MmseData,
  CamData, Gds15Data, SasData, FrailData, VasData, AisData,
  SsrsData, CirsgData, ScaleResult
} from './cgaTypes';

// ===== 1. Barthel指数 =====
export function calculateBarthel(data: BarthelData): ScaleResult {
  const score = Object.values(data).reduce((a, b) => a + b, 0);
  const maxScore = 100;
  let level: string;
  let interpretation: string;
  let interventions: string[];

  if (score >= 61) {
    level = '轻度功能障碍';
    interpretation = `得分${score}分，基本生活可自理，ADL能力轻度受损。`;
    interventions = ['维持现有功能', '鼓励继续独立完成日常活动', '定期复评'];
  } else if (score >= 41) {
    level = '中度功能障碍';
    interpretation = `得分${score}分，日常生活需要部分帮助。`;
    interventions = ['评估需要帮助的具体项目', '提供辅助器具', '安排家庭护理支持', '康复训练'];
  } else if (score >= 20) {
    level = '重度功能障碍';
    interpretation = `得分${score}分，日常生活大部分需要依赖他人。`;
    interventions = ['安排照护人员', '制定全面照护计划', '预防跌倒和压疮', '康复训练', '考虑长期照护机构'];
  } else {
    level = '完全依赖';
    interpretation = `得分${score}分，完全依赖他人照顾。`;
    interventions = ['全面照护', '预防并发症（压疮、肺炎、深静脉血栓）', '鼻饲或辅助进食', '定期翻身', '建议专业照护机构'];
  }

  return { scaleName: 'Barthel指数 (BADL)', score, maxScore, level, color: score >= 60 ? '#22c55e' : score >= 41 ? '#f59e0b' : '#ef4444', interpretation, interventions };
}

// ===== 2. JFRAS跌倒风险评估 =====
export function calculateJfras(data: JfrasData): ScaleResult {
  // 第一部分筛选
  if (data.completelyImmobile) {
    return { scaleName: 'JFRAS跌倒风险', score: 0, maxScore: 39, level: '低风险', color: '#22c55e', interpretation: '完全瘫痪/无行动能力，跌倒风险低（无法移动故不易跌倒）。', interventions: ['仍需定期评估皮肤完整性', '预防压疮'] };
  }
  if (data.fallHistory2x || data.inpatientFall || data.highRiskProtocol) {
    return { scaleName: 'JFRAS跌倒风险', score: 99, maxScore: 39, level: '高风险（第一部分筛选）', color: '#ef4444', interpretation: '符合第一部分高风险条件，直接判定为跌倒高风险。', interventions: ['立即启动跌倒预防措施', '床旁警示标识', '每班评估', '使用床栏', '防滑鞋', '夜间照明', '必要时专人陪护'] };
  }

  // 第二部分计算
  const mobilityScore = data.mobility.length * 2;
  const cognitionScore = data.cognition.reduce((a, b) => a + b, 0);
  const score = data.age + data.fallHistory1x + data.elimination + data.highRiskDrugs + data.medicalDevices + mobilityScore + cognitionScore;

  let level: string;
  let interventions: string[];

  if (score < 6) {
    level = '低风险';
    interventions = ['常规跌倒预防教育', '环境安全检查'];
  } else if (score <= 13) {
    level = '中风险';
    interventions = ['标准跌倒预防措施', '床旁警示标识', '定期评估', '使用辅助器具', '家属教育'];
  } else {
    level = '高风险';
    interventions = ['立即启动跌倒预防措施', '床旁警示标识', '每班评估', '使用床栏', '防滑鞋', '夜间照明', '专人陪护', '医生评估调整用药'];
  }

  return {
    scaleName: 'JFRAS跌倒风险', score, maxScore: 39, level,
    color: score < 6 ? '#22c55e' : score <= 13 ? '#f59e0b' : '#ef4444',
    interpretation: `得分${score}分，${level}。`, interventions
  };
}

// ===== 3. SARC-F肌少症筛查 =====
export function calculateSarcF(data: SarcFData): ScaleResult {
  const score = data.strength + data.walking + data.riseFromChair + data.climbing + data.falls;
  const level = score >= 4 ? '肌少症高风险' : '肌少症低风险';
  const interventions = score >= 4
    ? ['建议进行肌少症确诊检查（DXA或BIA测肌肉量）', '营养干预：增加蛋白质摄入（1.0-1.2g/kg/d）', '抗阻训练', '补充维生素D', '转诊老年科或康复科']
    : ['维持规律运动', '均衡营养', '定期复评'];

  return { scaleName: 'SARC-F肌少症筛查', score, maxScore: 10, level, color: score >= 4 ? '#ef4444' : '#22c55e', interpretation: `得分${score}分，${level}。`, interventions };
}

// ===== 4. 视力筛查 =====
export function calculateVision(sensory: SensoryData): ScaleResult {
  const score = sensory.visionReading;
  let level: string;
  let interventions: string[];

  if (score === 0) { level = '视力正常'; interventions = ['定期眼科检查', '保护视力']; }
  else if (score === 1) { level = '低视力'; interventions = ['眼科专科检查', '验光配镜', '改善照明', '使用大字读物']; }
  else if (score <= 3) { level = '盲'; interventions = ['立即眼科转诊', '低视力康复', '防跌倒措施', '日常生活辅助']; }
  else { level = '完全失明'; interventions = ['眼科紧急转诊', '失明康复训练', '全面生活照护', '定向和移动训练']; }

  return { scaleName: '视力快速筛查', score, maxScore: 4, level, color: score === 0 ? '#22c55e' : score === 1 ? '#f59e0b' : '#ef4444', interpretation: `得分${score}分，${level}。`, interventions };
}

// ===== 5. 视功能筛查 =====
export function calculateVisionFunction(sensory: SensoryData): ScaleResult {
  const score = sensory.visionFunction.reduce((a, b) => a + b, 0);
  let level: string;
  let interventions: string[];

  if (score === 3) { level = '视功能良好'; interventions = ['定期眼科检查']; }
  else if (score === 2) { level = '视功能较差'; interventions = ['眼科检查', '注意用眼卫生']; }
  else { level = '视功能差'; interventions = ['尽快眼科专科检查', '排除白内障、青光眼、黄斑变性', '防跌倒']; }

  return { scaleName: '视功能筛查', score, maxScore: 3, level, color: score >= 2 ? '#22c55e' : score === 1 ? '#f59e0b' : '#ef4444', interpretation: `得分${score}分（满分3分），${level}。`, interventions };
}

// ===== 6. 听力筛查 =====
export function calculateHearing(sensory: SensoryData): ScaleResult {
  const score = sensory.hearingLeft + sensory.hearingRight;
  let level: string;
  let interventions: string[];

  if (score === 2) { level = '听力正常'; interventions = ['定期听力检查']; }
  else if (score === 1) { level = '单侧听力下降'; interventions = ['耳鼻喉科检查', '避免噪音暴露']; }
  else { level = '双侧听力下降'; interventions = ['耳鼻喉科专科检查', '考虑助听器', '交流时面对患者、语速放慢']; }

  return { scaleName: '听力筛查（耳语试验）', score, maxScore: 2, level, color: score === 2 ? '#22c55e' : score === 1 ? '#f59e0b' : '#ef4444', interpretation: `得分${score}分（双耳各1分），${level}。`, interventions };
}

// ===== 7. ICI-Q-SF尿失禁 =====
export function calculateIciqSf(data: IciqSfData): ScaleResult {
  const score = data.frequency + data.amount + data.impact;
  let level: string;
  let interventions: string[];

  if (score === 0) { level = '无尿失禁'; interventions = ['保持排尿卫生', '定期评估']; }
  else if (score <= 7) { level = '轻度尿失禁'; interventions = ['盆底肌训练', '膀胱训练', '生活方式调整', '必要时泌尿外科就诊']; }
  else if (score <= 14) { level = '中度尿失禁'; interventions = ['泌尿外科/妇科转诊', '盆底肌训练', '评估用药', '考虑使用尿垫']; }
  else { level = '重度尿失禁'; interventions = ['立即专科转诊', '评估手术或药物方案', '全面管理计划', '皮肤护理预防湿疹']; }

  return { scaleName: 'ICI-Q-SF尿失禁', score, maxScore: 21, level, color: score === 0 ? '#22c55e' : score <= 7 ? '#f59e0b' : score <= 14 ? '#f97316' : '#ef4444', interpretation: `得分${score}分，${level}。`, interventions };
}

// ===== 8. Braden压疮风险评估 =====
export function calculateBraden(data: BradenData): ScaleResult {
  const score = data.sensory + data.moisture + data.activity + data.mobility + data.nutrition + data.friction;
  let level: string;
  let interventions: string[];

  if (score > 18) { level = '无风险'; interventions = ['常规皮肤护理']; }
  else if (score >= 15) { level = '低风险'; interventions = ['定期翻身', '皮肤检查', '营养支持']; }
  else if (score >= 13) { level = '中风险'; interventions = ['每2小时翻身', '减压床垫', '皮肤护理', '营养评估']; }
  else if (score >= 10) { level = '高风险'; interventions = ['每1-2小时翻身', '专业减压床垫', '每日皮肤评估', '营养干预', '伤口专科会诊']; }
  else { level = '极度风险'; interventions = ['每小时翻身', '气垫床', '持续皮肤监测', '营养支持', '伤口专科立即会诊']; }

  return { scaleName: 'Braden压疮风险', score, maxScore: 23, level, color: score > 18 ? '#22c55e' : score >= 15 ? '#3b82f6' : score >= 13 ? '#f59e0b' : score >= 10 ? '#f97316' : '#ef4444', interpretation: `得分${score}分，${level}。`, interventions };
}

// ===== 9. 洼田饮水试验 =====
export function calculateWaterSwallow(data: WaterSwallowData): ScaleResult {
  const score = data.level;
  let level: string;
  let interventions: string[];

  if (score === 1) { level = '正常'; interventions = ['正常饮食']; }
  else if (score === 2) { level = '可疑'; interventions = ['密切观察', '考虑进一步吞咽功能检查', '调整食物性状']; }
  else {
    const severity = score === 3 ? '轻度异常' : score === 4 ? '中度异常' : '重度异常';
    level = `异常（${severity}）`;
    interventions = ['立即停止经口进食', '吞咽造影检查(VFSS)或FEES', '鼻饲或肠内营养', '言语治疗师会诊', '预防吸入性肺炎'];
  }

  return { scaleName: '洼田饮水试验', score, maxScore: 5, level, color: score === 1 ? '#22c55e' : score === 2 ? '#f59e0b' : '#ef4444', interpretation: `${score}级，${level}。`, interventions };
}

// ===== 10. Padua VTE风险评估 =====
export function calculatePadua(data: PaduaData): ScaleResult {
  const score = (data.activeCancer ? 3 : 0) + (data.priorVTE ? 3 : 0) + (data.immobilization ? 3 : 0) +
    (data.thrombophilia ? 3 : 0) + (data.recentTraumaSurgery ? 2 : 0) + (data.age70plus ? 1 : 0) +
    (data.heartRespFailure ? 1 : 0) + (data.amiStroke ? 1 : 0) + (data.acuteInfection ? 1 : 0) +
    (data.obesity ? 1 : 0) + (data.hormoneTherapy ? 1 : 0);

  const level = score >= 4 ? 'VTE高风险' : 'VTE低风险';
  const interventions = score >= 4
    ? ['药物预防（低分子肝素等）', '机械预防（弹力袜、间歇充气加压）', '早期活动', '出血风险评估', '定期复查D-二聚体']
    : ['早期活动', '基本预防措施', '定期评估'];

  return { scaleName: 'Padua VTE风险', score, maxScore: 20, level, color: score >= 4 ? '#ef4444' : '#22c55e', interpretation: `得分${score}分，${level}（≥4分为高风险）。`, interventions };
}

// ===== 11. NRS-2002 =====
export function calculateNrs2002(data: Nrs2002Data): ScaleResult {
  const ageScore = data.age70plus ? 1 : 0;
  const score = data.diseaseSeverity + data.nutritionalStatus + ageScore;
  const level = score >= 3 ? '有营养风险' : '无营养风险';
  const interventions = score >= 3
    ? ['营养支持治疗', '请营养科会诊', '监测体重和血清白蛋白', '调整饮食方案', '必要时肠内/肠外营养']
    : ['维持均衡饮食', '定期营养筛查'];

  return { scaleName: 'NRS-2002营养风险', score, maxScore: 7, level, color: score >= 3 ? '#ef4444' : '#22c55e', interpretation: `得分${score}分（疾病${data.diseaseSeverity}+营养${data.nutritionalStatus}+年龄${ageScore}），${level}。`, interventions };
}

// ===== 12. MMSE =====
export function calculateMmse(data: MmseData): ScaleResult {
  const orientationScore = data.orientation.reduce((a, b) => a + b, 0);
  const memoryScore = data.memory.reduce((a, b) => a + b, 0);
  const attentionScore = data.attention.reduce((a, b) => a + b, 0);
  const recallScore = data.recall.reduce((a, b) => a + b, 0);
  const languageScore = data.language.reduce((a, b) => a + b, 0);
  const score = orientationScore + memoryScore + attentionScore + recallScore + languageScore;

  let level: string;
  let interventions: string[];

  // 按教育程度调整 cut-off（简化版，可用标准分界）
  if (score >= 27) { level = '认知功能正常'; interventions = ['定期随访', '认知训练']; }
  else if (score >= 21) { level = '轻度认知障碍'; interventions = ['神经科/老年科评估', '认知训练', '控制血管危险因素', '家属教育']; }
  else if (score >= 10) { level = '中度认知障碍'; interventions = ['专科转诊', '药物治疗评估', '日常生活辅助', '防走失', '家属照护培训']; }
  else { level = '重度认知障碍'; interventions = ['全面评估病因', '专业照护', '安全监护', '药物对症治疗', '长期照护计划']; }

  return { scaleName: 'MMSE简易精神状态检查', score, maxScore: 30, level, color: score >= 27 ? '#22c55e' : score >= 21 ? '#f59e0b' : '#ef4444', interpretation: `得分${score}分（定向${orientationScore}+记忆${memoryScore}+注意${attentionScore}+回忆${recallScore}+语言${languageScore}），${level}。`, interventions };
}

// ===== 13. CAM谵妄评估 =====
export function calculateCam(data: CamData): ScaleResult {
  const feature1 = data.acuteOnset && data.fluctuation; // 急性发作+波动
  const feature2 = data.inattention; // 注意力不集中
  const feature3or4 = data.disorganizedThinking || data.alteredConsciousness; // 思维混乱或意识改变
  const positive = feature1 && feature2 && feature3or4;

  const score = (data.acuteOnset ? 1 : 0) + (data.fluctuation ? 1 : 0) + (data.inattention ? 1 : 0) +
    (data.disorganizedThinking ? 1 : 0) + (data.alteredConsciousness ? 1 : 0);

  const level = positive ? '谵妄阳性' : '谵妄阴性';
  const interventions = positive
    ? ['立即查找并处理诱因（感染、药物、代谢紊乱等）', '非药物治疗（定向、睡眠优化、早期活动）', '环境管理（减少刺激、家属陪伴）', '必要时药物干预', '严密监测']
    : ['继续监测精神状态', '预防谵妄发生'];

  return { scaleName: 'CAM谵妄评估', score, maxScore: 5, level, color: positive ? '#ef4444' : '#22c55e', interpretation: positive
    ? `CAM阳性（特征1+2+3/4），患者存在谵妄，需紧急处理。`
    : `CAM阴性，患者目前不存在谵妄。`, interventions };
}

// ===== 14. GDS-15 =====
export function calculateGds15(data: Gds15Data): ScaleResult {
  const score = data.answers.reduce((a, b) => a + b, 0);
  const level = score > 5 ? '抑郁阳性' : '正常';
  const interventions = score > 5
    ? ['心理科/精神科会诊', '评估自杀风险', '心理治疗', '必要时抗抑郁药物治疗', '增加社交活动', '家属支持']
    : ['保持积极心态', '社交活动', '定期复评'];

  return { scaleName: 'GDS-15老年抑郁量表', score, maxScore: 15, level, color: score > 5 ? '#ef4444' : '#22c55e', interpretation: `得分${score}分，${level}（>5分为阳性）。`, interventions };
}

// ===== 15. SAS焦虑 =====
export function calculateSas(data: SasData): ScaleResult {
  // 正向题: 1,2,3,4,6,7,8,10,11,12,14,15,16,18,20
  // 反向题: 5,9,13,17,19
  const forwardIdx = [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18];
  const reverseIdx = [4, 8, 12, 16, 19];

  let rawScore = 0;
  forwardIdx.forEach(i => rawScore += data.answers[i]);
  reverseIdx.forEach(i => rawScore += (5 - data.answers[i])); // 反向计分: 4,3,2,1

  const standardScore = Math.round(rawScore * 1.25);
  let level: string;
  let interventions: string[];

  if (standardScore < 50) { level = '正常'; interventions = ['放松训练', '规律作息']; }
  else if (standardScore < 60) { level = '轻度焦虑'; interventions = ['心理疏导', '放松训练', '运动', '定期评估']; }
  else if (standardScore < 70) { level = '中度焦虑'; interventions = ['心理科会诊', '认知行为治疗', '必要时药物治疗', '家属支持']; }
  else { level = '重度焦虑'; interventions = ['立即精神科/心理科转诊', '药物治疗', '密切观察', '防自杀评估', '家属陪伴']; }

  return { scaleName: 'SAS焦虑自评量表', score: standardScore, maxScore: 100, level, color: standardScore < 50 ? '#22c55e' : standardScore < 60 ? '#f59e0b' : '#ef4444', interpretation: `标准分${standardScore}分（粗分${rawScore}×1.25），${level}。`, interventions };
}

// ===== 16. FRAIL衰弱 =====
export function calculateFrail(data: FrailData): ScaleResult {
  const score = (data.fatigue ? 1 : 0) + (data.resistance ? 1 : 0) + (data.ambulation ? 1 : 0) +
    (data.illness ? 1 : 0) + (data.weightLoss ? 1 : 0);

  let level: string;
  let interventions: string[];

  if (score === 0) { level = '健壮'; interventions = ['保持健康生活方式', '预防衰弱']; }
  else if (score === 1 || score === 2) { level = '衰弱前期'; interventions = ['营养干预', '运动训练（抗阻+有氧）', '蛋白质补充', '维生素D', '定期随访']; }
  else { level = '衰弱'; interventions = ['多学科团队管理', '个体化运动处方', '营养支持（蛋白质1.2g/kg/d）', '治疗共病', '评估用药', '预防跌倒和失能', '定期复评']; }

  return { scaleName: 'FRAIL衰弱筛查', score, maxScore: 5, level, color: score === 0 ? '#22c55e' : score <= 2 ? '#f59e0b' : '#ef4444', interpretation: `得分${score}分，${level}（≥3分为衰弱）。`, interventions };
}

// ===== 17. VAS疼痛 =====
export function calculateVas(data: VasData): ScaleResult {
  const score = data.score;
  let level: string;
  let interventions: string[];

  if (score === 0) { level = '无痛'; interventions = ['无需处理']; }
  else if (score <= 3) { level = '轻度疼痛'; interventions = ['非药物治疗（热敷、按摩、放松）', '必要时非处方止痛药', '评估疼痛原因']; }
  else if (score <= 6) { level = '中度疼痛'; interventions = ['处方镇痛药物', '物理治疗', '疼痛专科会诊', '评估疼痛来源']; }
  else { level = '重度疼痛'; interventions = ['强效镇痛治疗', '紧急疼痛专科评估', '多模式镇痛', '病因治疗']; }

  return { scaleName: 'VAS疼痛评估', score, maxScore: 10, level, color: score === 0 ? '#22c55e' : score <= 3 ? '#f59e0b' : score <= 6 ? '#f97316' : '#ef4444', interpretation: `得分${score}分，${level}。`, interventions };
}

// ===== 18. AIS失眠 =====
export function calculateAis(data: AisData): ScaleResult {
  const score = data.items.reduce((a, b) => a + b, 0);
  let level: string;
  let interventions: string[];

  if (score < 4) { level = '无睡眠障碍'; interventions = ['保持睡眠卫生']; }
  else if (score <= 6) { level = '可疑失眠'; interventions = ['睡眠卫生教育', 'CBT-I（认知行为治疗）', '规律作息', '避免午睡过长']; }
  else { level = '失眠'; interventions = ['睡眠专科会诊', 'CBT-I', '评估情绪障碍（焦虑/抑郁）', '短期药物治疗', '睡眠环境优化']; }

  return { scaleName: 'AIS阿森斯失眠量表', score, maxScore: 24, level, color: score < 4 ? '#22c55e' : score <= 6 ? '#f59e0b' : '#ef4444', interpretation: `得分${score}分，${level}。`, interventions };
}

// ===== 19. SSRS社会支持 =====
export function calculateSsrs(data: SsrsData): ScaleResult {
  const objectiveSupport = data.friends + data.living + data.neighbors + data.colleagues;
  const subjectiveSupport = data.familySupport.reduce((a, b) => a + b, 0) + data.confession + data.helpSeeking + data.groupActivity;
  const utilization = data.economicSources + data.emotionalSources;
  const score = objectiveSupport + subjectiveSupport + utilization;

  let level: string;
  let interventions: string[];

  if (score < 20) { level = '社会支持较少'; interventions = ['评估社会隔离', '社区资源链接', '支持小组', '志愿者服务', '家庭关系调解']; }
  else if (score <= 30) { level = '一般社会支持'; interventions = ['加强社会网络', '鼓励参加活动', '社区资源介绍']; }
  else { level = '满意的社会支持'; interventions = ['维持社会网络', '定期评估']; }

  return { scaleName: 'SSRS社会支持评定', score, maxScore: 66, level, color: score < 20 ? '#ef4444' : score <= 30 ? '#f59e0b' : '#22c55e', interpretation: `得分${score}分（客观${objectiveSupport}+主观${subjectiveSupport}+利用${utilization}），${level}。`, interventions };
}

// ===== 20. CIRS-G共病评估 =====
export function calculateCirsg(data: CirsgData): ScaleResult {
  const totalScore = data.systems.reduce((a, b) => a + b, 0);
  const severeCount = data.systems.filter(s => s >= 3).length;
  const maxScore = Math.max(...data.systems);
  const score = totalScore;

  let level: string;
  let interventions: string[];

  if (score <= 5) { level = '轻度共病负担'; interventions = ['定期随访', '优化慢病管理']; }
  else if (score <= 10) { level = '中度共病负担'; interventions = ['多学科管理', '用药精简', '定期评估各系统功能']; }
  else { level = '重度共病负担'; interventions = ['老年综合评估（CGA）', '多学科团队', '用药全面审查', '优先处理严重系统', '预后讨论', ' advance care planning']; }

  return { scaleName: 'CIRS-G共病评估', score, maxScore: 56, level, color: score <= 5 ? '#22c55e' : score <= 10 ? '#f59e0b' : '#ef4444', interpretation: `总分${score}，严重系统数${severeCount}，最高等级${maxScore}，${level}。`, interventions };
}

// ===== 肌少症综合判断（握力+步速+SARC-F） =====
export function calculateSarcopeniaOverall(sarcF: SarcFData, gripDominant: number, gripNonDominant: number, speed: number, gender: 'male' | 'female'): ScaleResult {
  const sarcFScore = sarcF.strength + sarcF.walking + sarcF.riseFromChair + sarcF.climbing + sarcF.falls;

  // AWGS 2019 标准
  const gripLow = gender === 'male'
    ? (gripDominant < 28 || gripNonDominant < 28)
    : (gripDominant < 18 || gripNonDominant < 18);
  const speedLow = speed < 1.0;
  const sarcFPositive = sarcFScore >= 4;

  let level: string;
  let interventions: string[];

  if ((gripLow || speedLow) && sarcFPositive) {
    level = '很可能肌少症';
    interventions = ['DXA或BIA测四肢骨骼肌量指数', '如ASMI男性<7.0 kg/m²或女性<5.4 kg/m²可确诊', '营养干预（蛋白质1.2g/kg/d）', '抗阻训练', '维生素D补充', '转诊老年科/康复科'];
  } else if (gripLow || speedLow || sarcFPositive) {
    level = '肌少症可疑';
    interventions = ['进一步检查肌肉量', '增加蛋白质摄入', '开始抗阻训练', '定期复评'];
  } else {
    level = '肌少症风险低';
    interventions = ['维持运动习惯', '均衡营养', '每年筛查'];
  }

  return { scaleName: '肌少症综合评估', score: sarcFScore, maxScore: 10, level, color: level.includes('确诊') || level.includes('很可能') ? '#ef4444' : level.includes('可疑') ? '#f59e0b' : '#22c55e', interpretation: `SARC-F=${sarcFScore}分，握力(优${gripDominant}/非优${gripNonDominant}kg)，步速${speed}m/s。${level}。`, interventions };
}
