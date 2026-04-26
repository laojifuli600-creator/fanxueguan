import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ChevronRight, User, Heart, FlaskConical, Stethoscope, Hospital } from 'lucide-react';

const AssessmentForm: React.FC = () => {
  const { data, setField, currentStep, prevStep, calculateResult, totalSteps } = useAssessment();
  const [subStep, setSubStep] = useState(0);

  // subSteps: 0=basic, 1=lifestyle, 2=history, 3=lab
  const subStepTitles = ['基本信息', '生活方式', '既往病史', '实验室指标'];
  const subStepIcons = [User, Heart, Stethoscope, FlaskConical];

  const handleNext = () => {
    if (subStep < 3) {
      setSubStep(subStep + 1);
    } else {
      calculateResult();
    }
  };

  const handleBack = () => {
    if (subStep > 0) {
      setSubStep(subStep - 1);
    } else {
      prevStep();
    }
  };

  const progress = ((currentStep - 1) * 4 + subStep + 1) / ((totalSteps - 2) * 4) * 100;

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-1" />
              返回
            </button>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Hospital className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">上海市第六人民医院老年医学科</span>
              <span className="sm:hidden">市六医院老年医学科</span>
            </div>
            <span className="text-sm font-medium text-gray-600">
              步骤 {subStep + 1} / 4
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {subStepTitles.map((title, idx) => {
              const Icon = subStepIcons[idx];
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-1 text-xs ${idx <= subStep ? 'text-red-500 font-medium' : 'text-gray-400'}`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={subStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Basic Info */}
              {subStep === 0 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">基本信息</h3>
                    
                    {/* Age */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-2 block">年龄：{data.age} 岁</Label>
                      <Slider
                        value={[data.age]}
                        onValueChange={(v) => setField('age', v[0])}
                        min={18}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>18岁</span>
                        <span>100岁</span>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">性别</Label>
                      <RadioGroup
                        value={data.gender}
                        onValueChange={(v) => setField('gender', v as 'male' | 'female')}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex-1 cursor-pointer hover:border-red-300 transition-colors">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">男性</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex-1 cursor-pointer hover:border-red-300 transition-colors">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">女性</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Height & Weight */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-base font-medium mb-2 block">身高（cm）</Label>
                        <Input
                          type="number"
                          value={data.height}
                          onChange={(e) => setField('height', Number(e.target.value))}
                          min={100}
                          max={250}
                          className="text-lg"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">体重（kg）</Label>
                        <Input
                          type="number"
                          value={data.weight}
                          onChange={(e) => setField('weight', Number(e.target.value))}
                          min={30}
                          max={200}
                          className="text-lg"
                        />
                      </div>
                    </div>
                    
                    {data.height > 0 && data.weight > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                        BMI: {(data.weight / ((data.height / 100) ** 2)).toFixed(1)} 
                        {' '}
                        {(() => {
                          const bmi = data.weight / ((data.height / 100) ** 2);
                          if (bmi < 18.5) return '(偏瘦)';
                          if (bmi < 24) return '(正常)';
                          if (bmi < 28) return '(超重)';
                          return '(肥胖)';
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 1: Lifestyle */}
              {subStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">生活方式</h3>
                    
                    {/* Smoking */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">吸烟状况</Label>
                      <RadioGroup
                        value={data.smoking}
                        onValueChange={(v) => setField('smoking', v as 'never' | 'former' | 'current')}
                        className="space-y-2"
                      >
                        {[
                          { value: 'never', label: '从不吸烟', desc: '从未吸烟或吸烟少于100支' },
                          { value: 'former', label: '已戒烟', desc: '曾经吸烟但已停止' },
                          { value: 'current', label: '目前吸烟', desc: '现在正在吸烟' },
                        ].map((option) => (
                          <div key={option.value} className="flex items-start space-x-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                            <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                            <div className="cursor-pointer">
                              <Label htmlFor={option.value} className="font-medium cursor-pointer">{option.label}</Label>
                              <p className="text-xs text-gray-500">{option.desc}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Exercise */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">运动习惯</Label>
                      <RadioGroup
                        value={data.exercise}
                        onValueChange={(v) => setField('exercise', v as 'regular' | 'occasional' | 'none')}
                        className="space-y-2"
                      >
                        {[
                          { value: 'regular', label: '规律运动', desc: '每周≥150分钟中等强度运动' },
                          { value: 'occasional', label: '偶尔运动', desc: '每周<150分钟' },
                          { value: 'none', label: '几乎不运动', desc: '很少或从不运动' },
                        ].map((option) => (
                          <div key={option.value} className="flex items-start space-x-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                            <RadioGroupItem value={option.value} id={`ex-${option.value}`} className="mt-1" />
                            <div className="cursor-pointer">
                              <Label htmlFor={`ex-${option.value}`} className="font-medium cursor-pointer">{option.label}</Label>
                              <p className="text-xs text-gray-500">{option.desc}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Diet */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">饮食习惯</Label>
                      <RadioGroup
                        value={data.diet}
                        onValueChange={(v) => setField('diet', v as 'healthy' | 'average' | 'unhealthy')}
                        className="space-y-2"
                      >
                        {[
                          { value: 'healthy', label: '健康饮食', desc: '多吃蔬果、粗粮，少盐少油' },
                          { value: 'average', label: '一般饮食', desc: '饮食较为均衡但偶有不良习惯' },
                          { value: 'unhealthy', label: '不健康饮食', desc: '高盐、高脂、高糖，蔬果摄入少' },
                        ].map((option) => (
                          <div key={option.value} className="flex items-start space-x-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                            <RadioGroupItem value={option.value} id={`diet-${option.value}`} className="mt-1" />
                            <div className="cursor-pointer">
                              <Label htmlFor={`diet-${option.value}`} className="font-medium cursor-pointer">{option.label}</Label>
                              <p className="text-xs text-gray-500">{option.desc}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Alcohol */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">饮酒状况</Label>
                      <RadioGroup
                        value={data.alcohol}
                        onValueChange={(v) => setField('alcohol', v as 'none' | 'light' | 'heavy')}
                        className="space-y-2"
                      >
                        {[
                          { value: 'none', label: '不饮酒', desc: '从不饮酒' },
                          { value: 'light', label: '适量饮酒', desc: '男性<25g/天，女性<15g/天' },
                          { value: 'heavy', label: '过量饮酒', desc: '超过上述标准' },
                        ].map((option) => (
                          <div key={option.value} className="flex items-start space-x-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                            <RadioGroupItem value={option.value} id={`alc-${option.value}`} className="mt-1" />
                            <div className="cursor-pointer">
                              <Label htmlFor={`alc-${option.value}`} className="font-medium cursor-pointer">{option.label}</Label>
                              <p className="text-xs text-gray-500">{option.desc}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Medical History */}
              {subStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">既往病史</h3>
                    <p className="text-sm text-gray-600 mb-6">请选择您已确诊的疾病（可多选）</p>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'hypertension' as const, label: '高血压', desc: '血压持续≥140/90 mmHg或正在服药' },
                        { key: 'diabetes' as const, label: '糖尿病', desc: '已确诊1型或2型糖尿病' },
                        { key: 'dyslipidemia' as const, label: '血脂异常', desc: '高胆固醇或高甘油三酯，或正在服药' },
                        { key: 'coronaryDisease' as const, label: '冠心病', desc: '心绞痛、心肌梗死或曾做冠脉手术' },
                        { key: 'strokeTIA' as const, label: '脑卒中/TIA', desc: '缺血性或出血性脑卒中、短暂性脑缺血' },
                        { key: 'pad' as const, label: '外周动脉疾病', desc: '下肢动脉狭窄或闭塞' },
                        { key: 'ckd' as const, label: '慢性肾病', desc: '肾功能持续下降，eGFR<60' },
                        { key: 'atrialFibrillation' as const, label: '心房颤动', desc: '已确诊的心律失常' },
                      ].map((disease) => (
                        <motion.div
                          key={disease.key}
                          className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            data[disease.key] 
                              ? 'border-red-400 bg-red-50' 
                              : 'border-gray-200 bg-gray-50 hover:border-red-200'
                          }`}
                          onClick={() => setField(disease.key, !data[disease.key])}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Checkbox
                            checked={data[disease.key] as boolean}
                            onCheckedChange={(checked) => setField(disease.key, checked as boolean)}
                            className="mt-1"
                          />
                          <div>
                            <Label className="font-medium text-base cursor-pointer">{disease.label}</Label>
                            <p className="text-xs text-gray-500 mt-1">{disease.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Lab Indicators */}
              {subStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">实验室指标</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      请输入您最近体检的数据（如不清楚可留默认值）
                    </p>
                    
                    <div className="space-y-6">
                      {/* Systolic BP */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-base font-medium">收缩压（高压）</Label>
                          <span className="text-red-500 font-bold">{data.systolicBP} mmHg</span>
                        </div>
                        <Slider
                          value={[data.systolicBP]}
                          onValueChange={(v) => setField('systolicBP', v[0])}
                          min={90}
                          max={220}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>90</span>
                          <span className="text-green-600">正常&lt;120</span>
                          <span className="text-amber-600">偏高120-139</span>
                          <span className="text-red-600">≥140</span>
                          <span>220</span>
                        </div>
                      </div>

                      {/* Total Cholesterol */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-base font-medium">总胆固醇（TC）</Label>
                          <span className="text-red-500 font-bold">{data.totalCholesterol} mmol/L</span>
                        </div>
                        <Slider
                          value={[data.totalCholesterol]}
                          onValueChange={(v) => setField('totalCholesterol', v[0])}
                          min={2.0}
                          max={10.0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>2.0</span>
                          <span className="text-green-600">正常&lt;5.2</span>
                          <span className="text-red-600">≥5.2</span>
                          <span>10.0</span>
                        </div>
                      </div>

                      {/* LDL Cholesterol */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-base font-medium">低密度脂蛋白（LDL-C）</Label>
                          <span className="text-red-500 font-bold">{data.ldlCholesterol} mmol/L</span>
                        </div>
                        <Slider
                          value={[data.ldlCholesterol]}
                          onValueChange={(v) => setField('ldlCholesterol', v[0])}
                          min={1.0}
                          max={8.0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>1.0</span>
                          <span className="text-green-600">理想&lt;2.6</span>
                          <span className="text-amber-600">2.6-3.4</span>
                          <span className="text-red-600">≥3.4</span>
                          <span>8.0</span>
                        </div>
                      </div>

                      {/* Fasting Glucose */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-base font-medium">空腹血糖</Label>
                          <span className="text-red-500 font-bold">{data.fastingGlucose} mmol/L</span>
                        </div>
                        <Slider
                          value={[data.fastingGlucose]}
                          onValueChange={(v) => setField('fastingGlucose', v[0])}
                          min={3.0}
                          max={20.0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>3.0</span>
                          <span className="text-green-600">正常&lt;6.1</span>
                          <span className="text-amber-600">空腹受损6.1-6.9</span>
                          <span className="text-red-600">≥7.0糖尿病</span>
                          <span>20.0</span>
                        </div>
                      </div>

                      {/* Family History */}
                      <div className="pt-4 border-t border-gray-100">
                        <Label className="text-base font-medium mb-3 block">早发心血管疾病家族史</Label>
                        <p className="text-xs text-gray-500 mb-3">
                          一级亲属（父母、兄弟姐妹）中是否有男性&lt;55岁或女性&lt;65岁发生冠心病、脑卒中？
                        </p>
                        <RadioGroup
                          value={data.familyHistory ? 'yes' : 'no'}
                          onValueChange={(v) => setField('familyHistory', v === 'yes')}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex-1 cursor-pointer hover:border-red-300 transition-colors">
                            <RadioGroupItem value="yes" id="fh-yes" />
                            <Label htmlFor="fh-yes" className="cursor-pointer">是</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex-1 cursor-pointer hover:border-red-300 transition-colors">
                            <RadioGroupItem value="no" id="fh-no" />
                            <Label htmlFor="fh-no" className="cursor-pointer">否</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 py-5 text-base"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              上一步
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 py-5 text-base bg-red-500 hover:bg-red-600 text-white"
            >
              {subStep === 3 ? '查看结果' : '下一步'}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentForm;
