// 泛血管疾病风险评估算法（科普简化版）
// 基于常见ASCVD危险因素及多血管床理念

export interface AssessmentData {
  // 基本信息
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  
  // 生活方式
  smoking: 'never' | 'former' | 'current';
  exercise: 'regular' | 'occasional' | 'none';
  diet: 'healthy' | 'average' | 'unhealthy';
  alcohol: 'none' | 'light' | 'heavy';
  
  // 既往病史
  hypertension: boolean;
  diabetes: boolean;
  dyslipidemia: boolean;
  coronaryDisease: boolean;
  strokeTIA: boolean;
  pad: boolean;
  ckd: boolean;
  atrialFibrillation: boolean;
  
  // 实验室指标
  systolicBP: number;
  totalCholesterol: number;
  ldlCholesterol: number;
  fastingGlucose: number;
  
  // 家族史
  familyHistory: boolean;
}

export interface RiskResult {
  totalScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'veryHigh';
  riskPercentage: number; // 模拟10年风险百分比
  vascularMap: {
    heart: 'green' | 'yellow' | 'red';
    brain: 'green' | 'yellow' | 'red';
    kidney: 'green' | 'yellow' | 'red';
    peripheral: 'green' | 'yellow' | 'red';
  };
  riskFactors: { name: string; score: number; maxScore: number }[];
  advice: string[];
}

export function calculateRisk(data: AssessmentData): RiskResult {
  let score = 0;
  const riskFactors: { name: string; score: number; maxScore: number }[] = [];

  // 1. 年龄
  let ageScore = 0;
  if (data.age < 40) ageScore = 0;
  else if (data.age < 50) ageScore = 15;
  else if (data.age < 60) ageScore = 30;
  else if (data.age < 70) ageScore = 45;
  else ageScore = 60;
  score += ageScore;
  riskFactors.push({ name: '年龄', score: ageScore, maxScore: 60 });

  // 2. 性别
  const genderScore = data.gender === 'male' ? 5 : 0;
  score += genderScore;
  riskFactors.push({ name: '性别', score: genderScore, maxScore: 5 });

  // 3. BMI
  const bmi = data.weight / ((data.height / 100) ** 2);
  let bmiScore = 0;
  if (bmi >= 28) bmiScore = 10;
  else if (bmi >= 24) bmiScore = 5;
  score += bmiScore;
  riskFactors.push({ name: '肥胖', score: bmiScore, maxScore: 10 });

  // 4. 吸烟
  let smokingScore = 0;
  if (data.smoking === 'current') smokingScore = 15;
  else if (data.smoking === 'former') smokingScore = 5;
  score += smokingScore;
  riskFactors.push({ name: '吸烟', score: smokingScore, maxScore: 15 });

  // 5. 运动
  let exerciseScore = 0;
  if (data.exercise === 'none') exerciseScore = 5;
  else if (data.exercise === 'occasional') exerciseScore = 2;
  score += exerciseScore;
  riskFactors.push({ name: '缺乏运动', score: exerciseScore, maxScore: 5 });

  // 6. 饮食
  let dietScore = 0;
  if (data.diet === 'unhealthy') dietScore = 5;
  else if (data.diet === 'average') dietScore = 2;
  score += dietScore;
  riskFactors.push({ name: '不健康饮食', score: dietScore, maxScore: 5 });

  // 7. 饮酒
  let alcoholScore = 0;
  if (data.alcohol === 'heavy') alcoholScore = 5;
  score += alcoholScore;
  riskFactors.push({ name: '过量饮酒', score: alcoholScore, maxScore: 5 });

  // 8. 高血压
  let bpScore = 0;
  if (data.hypertension || data.systolicBP >= 140) bpScore = 20;
  else if (data.systolicBP >= 130) bpScore = 10;
  score += bpScore;
  riskFactors.push({ name: '血压', score: bpScore, maxScore: 20 });

  // 9. 糖尿病
  let diabetesScore = 0;
  if (data.diabetes || data.fastingGlucose >= 7.0) diabetesScore = 25;
  else if (data.fastingGlucose >= 6.1) diabetesScore = 10;
  score += diabetesScore;
  riskFactors.push({ name: '糖尿病', score: diabetesScore, maxScore: 25 });

  // 10. 血脂异常
  let lipidScore = 0;
  if (data.dyslipidemia || data.ldlCholesterol >= 3.4 || data.totalCholesterol >= 5.2) lipidScore = 15;
  else if (data.ldlCholesterol >= 2.6 || data.totalCholesterol >= 4.5) lipidScore = 5;
  score += lipidScore;
  riskFactors.push({ name: '血脂异常', score: lipidScore, maxScore: 15 });

  // 11. 家族史
  const familyScore = data.familyHistory ? 10 : 0;
  score += familyScore;
  riskFactors.push({ name: '家族史', score: familyScore, maxScore: 10 });

  // 12. 已确诊疾病（泛血管范畴）- 这些额外加分
  let diseaseScore = 0;
  if (data.coronaryDisease) diseaseScore += 40;
  if (data.strokeTIA) diseaseScore += 40;
  if (data.pad) diseaseScore += 30;
  if (data.ckd) diseaseScore += 20;
  if (data.atrialFibrillation) diseaseScore += 15;
  score += diseaseScore;
  if (diseaseScore > 0) {
    riskFactors.push({ name: '已确诊血管疾病', score: diseaseScore, maxScore: 100 });
  }

  // 风险分层
  let riskLevel: 'low' | 'moderate' | 'high' | 'veryHigh' = 'low';
  let riskPercentage = 0;

  if (score < 30) {
    riskLevel = 'low';
    riskPercentage = Math.min(5, score * 0.15);
  } else if (score < 60) {
    riskLevel = 'moderate';
    riskPercentage = 5 + (score - 30) * 0.5;
  } else if (score < 100) {
    riskLevel = 'high';
    riskPercentage = 20 + (score - 60) * 0.5;
  } else {
    riskLevel = 'veryHigh';
    riskPercentage = Math.min(60, 40 + (score - 100) * 0.3);
  }

  // 如果已确诊冠心病、脑卒中或PAD，直接归为极高危
  if (data.coronaryDisease || data.strokeTIA || data.pad) {
    riskLevel = 'veryHigh';
    riskPercentage = Math.max(riskPercentage, 30);
  }

  // 泛血管地图逻辑
  const vascularMap: {
    heart: 'green' | 'yellow' | 'red';
    brain: 'green' | 'yellow' | 'red';
    kidney: 'green' | 'yellow' | 'red';
    peripheral: 'green' | 'yellow' | 'red';
  } = {
    heart: 'green',
    brain: 'green',
    kidney: 'green',
    peripheral: 'green',
  };

  // 心脏血管
  if (data.coronaryDisease) {
    vascularMap.heart = 'red';
  } else if (data.diabetes && (data.hypertension || data.smoking === 'current' || data.dyslipidemia)) {
    vascularMap.heart = 'yellow';
  } else if (data.hypertension || data.smoking === 'current' || ageScore >= 45) {
    vascularMap.heart = 'yellow';
  }

  // 脑血管
  if (data.strokeTIA || data.atrialFibrillation) {
    vascularMap.brain = 'red';
  } else if ((data.hypertension && data.diabetes) || data.atrialFibrillation || ageScore >= 60) {
    vascularMap.brain = 'yellow';
  } else if (data.hypertension || data.smoking === 'current') {
    vascularMap.brain = 'yellow';
  }

  // 肾血管
  if (data.ckd || (data.diabetes && data.hypertension)) {
    vascularMap.kidney = 'red';
  } else if (data.diabetes || data.hypertension || data.ckd) {
    vascularMap.kidney = 'yellow';
  }

  // 外周血管
  if (data.pad) {
    vascularMap.peripheral = 'red';
  } else if ((data.smoking === 'current' && data.diabetes) || data.hypertension) {
    vascularMap.peripheral = 'yellow';
  } else if (data.smoking === 'current' || data.diabetes) {
    vascularMap.peripheral = 'yellow';
  }

  // 建议生成
  const advice: string[] = [];
  
  if (riskLevel === 'veryHigh') {
    advice.push('您的泛血管疾病风险极高，强烈建议尽快就医，接受专业评估和规范治疗。');
    advice.push('请严格遵医嘱服用降压、降糖、降脂及抗血小板药物。');
  } else if (riskLevel === 'high') {
    advice.push('您的泛血管疾病风险较高，建议尽快到医院进行详细检查。');
    advice.push('在医生指导下，积极控制血压、血糖和血脂水平。');
  } else if (riskLevel === 'moderate') {
    advice.push('您的泛血管疾病风险为中等，建议改善生活方式并定期体检。');
    advice.push('关注血压、血脂、血糖指标，必要时咨询医生。');
  } else {
    advice.push('您的泛血管疾病风险较低，请继续保持健康的生活方式。');
    advice.push('建议每年进行一次全面体检，监测心血管健康指标。');
  }

  if (data.smoking === 'current') {
    advice.push('戒烟是降低血管疾病风险最有效的措施之一，建议尽早戒烟。');
  }
  if (bmi >= 24) {
    advice.push('控制体重至正常范围（BMI<24）可显著降低血管疾病风险。');
  }
  if (data.exercise === 'none' || data.exercise === 'occasional') {
    advice.push('建议每周进行至少150分钟的中等强度有氧运动，如快走、游泳等。');
  }
  if (data.diet === 'unhealthy' || data.diet === 'average') {
    advice.push('采用地中海饮食或DASH饮食，多吃蔬菜、水果、全谷物，减少盐和饱和脂肪摄入。');
  }
  if (data.hypertension || data.systolicBP >= 130) {
    advice.push('严格控制血压，目标一般<130/80 mmHg，需长期监测。');
  }
  if (data.diabetes || data.fastingGlucose >= 6.1) {
    advice.push('血糖管理至关重要，空腹血糖目标一般<6.1 mmol/L，糖化血红蛋白<7%。');
  }
  if (data.dyslipidemia || data.ldlCholesterol >= 2.6) {
    advice.push('管理血脂水平，LDL-C（坏胆固醇）是重要指标，具体目标需遵医嘱。');
  }

  advice.push('记住：血管健康是全身性的，从头到脚、从心脏到肾脏都需要关注！');

  return {
    totalScore: score,
    riskLevel,
    riskPercentage,
    vascularMap,
    riskFactors,
    advice,
  };
}

export function getRiskLevelText(level: string): string {
  switch (level) {
    case 'low': return '低风险';
    case 'moderate': return '中风险';
    case 'high': return '高风险';
    case 'veryHigh': return '极高风险';
    default: return '未知';
  }
}

export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'low': return '#22c55e';
    case 'moderate': return '#f59e0b';
    case 'high': return '#f97316';
    case 'veryHigh': return '#ef4444';
    default: return '#6b7280';
  }
}

export function getRiskLevelBgColor(level: string): string {
  switch (level) {
    case 'low': return 'bg-green-50 border-green-200';
    case 'moderate': return 'bg-amber-50 border-amber-200';
    case 'high': return 'bg-orange-50 border-orange-200';
    case 'veryHigh': return 'bg-red-50 border-red-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}
