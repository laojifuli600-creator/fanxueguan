import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCga } from '@/context/CgaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, RotateCcw, AlertTriangle, CheckCircle, Stethoscope, Printer } from 'lucide-react';

interface Props {
  onBack: () => void;
  onRestart: () => void;
}

const CgaResultPage: React.FC<Props> = ({ onBack, onRestart }) => {
  const { patientName, patientAge, patientGender, assessDate, calculateResults, resetAll } = useCga();
  const [showInterventions, setShowInterventions] = useState<Record<string, boolean>>({});

  const result = useMemo(() => calculateResults(), []);

  const toggleIntervention = (scaleName: string) => {
    setShowInterventions(prev => ({ ...prev, [scaleName]: !prev[scaleName] }));
  };

  const highRisks = result.scaleResults.filter(r => r.color === '#ef4444');
  const moderateRisks = result.scaleResults.filter(r => r.color === '#f59e0b');
  const lowRisks = result.scaleResults.filter(r => r.color === '#22c55e');

  const handlePrint = () => {
    window.print();
  };

  const handleRestart = () => {
    resetAll();
    onRestart();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                  CGA 评估报告
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>姓名：{patientName || '未填写'}</span>
                  <span>年龄：{patientAge}岁</span>
                  <span>性别：{patientGender === 'male' ? '男' : '女'}</span>
                  <span>日期：{assessDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-1 w-4 h-4" /> 打印
                </Button>
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ChevronLeft className="mr-1 w-4 h-4" /> 返回
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overall Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className={`mb-6 border-2 ${highRisks.length > 0 ? 'border-red-300 bg-red-50' : moderateRisks.length > 0 ? 'border-amber-300 bg-amber-50' : 'border-green-300 bg-green-50'}`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              {highRisks.length > 0 ? <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" /> :
               moderateRisks.length > 0 ? <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" /> :
               <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />}
              <div>
                <h3 className="font-bold text-lg mb-1">总体评估结论</h3>
                <p className="text-gray-700">{result.overallSummary}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-red-600 font-medium">{highRisks.length}项高风险</span>
                  <span className="text-amber-600 font-medium">{moderateRisks.length}项中风险</span>
                  <span className="text-green-600 font-medium">{lowRisks.length}项低风险</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">全部量表</TabsTrigger>
            <TabsTrigger value="high" className="text-red-600">高风险 ({highRisks.length})</TabsTrigger>
            <TabsTrigger value="moderate" className="text-amber-600">中风险 ({moderateRisks.length})</TabsTrigger>
            <TabsTrigger value="interventions">干预建议</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-3">
            {result.scaleResults.map((scale, idx) => (
              <ScaleResultCard key={idx} scale={scale} idx={idx}
                showIntervention={showInterventions[scale.scaleName] || false}
                onToggle={() => toggleIntervention(scale.scaleName)} />
            ))}
          </TabsContent>

          <TabsContent value="high" className="mt-4 space-y-3">
            {highRisks.length === 0 && <p className="text-center text-gray-500 py-8">暂无高风险项目</p>}
            {highRisks.map((scale, idx) => (
              <ScaleResultCard key={idx} scale={scale} idx={idx}
                showIntervention={showInterventions[scale.scaleName] || false}
                onToggle={() => toggleIntervention(scale.scaleName)} />
            ))}
          </TabsContent>

          <TabsContent value="moderate" className="mt-4 space-y-3">
            {moderateRisks.length === 0 && <p className="text-center text-gray-500 py-8">暂无中风险项目</p>}
            {moderateRisks.map((scale, idx) => (
              <ScaleResultCard key={idx} scale={scale} idx={idx}
                showIntervention={showInterventions[scale.scaleName] || false}
                onToggle={() => toggleIntervention(scale.scaleName)} />
            ))}
          </TabsContent>

          <TabsContent value="interventions" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">优先干预措施</h3>
                <div className="space-y-3">
                  {result.priorityInterventions.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>说明：</strong>本评估工具由上海市第六人民医院老年医学科出品，仅供临床辅助参考。
          评估结果需结合临床判断，不能替代专业医疗诊断。
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8 mb-12">
        <Button variant="outline" onClick={onBack} className="flex-1 py-5">
          <ChevronLeft className="mr-2 w-4 h-4" /> 返回修改
        </Button>
        <Button onClick={handleRestart} variant="outline" className="flex-1 py-5">
          <RotateCcw className="mr-2 w-4 h-4" /> 新建评估
        </Button>
        <Button onClick={handlePrint} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white">
          <Printer className="mr-2 w-4 h-4" /> 打印报告
        </Button>
      </div>
    </div>
  );
};

// Individual Scale Result Card
const ScaleResultCard: React.FC<{
  scale: { scaleName: string; score: number; maxScore: number; level: string; color: string; interpretation: string; interventions: string[] };
  idx: number;
  showIntervention: boolean;
  onToggle: () => void;
}> = ({ scale, idx, showIntervention, onToggle }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
      <Card className="border-l-4" style={{ borderLeftColor: scale.color }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{scale.scaleName}</h4>
              <p className="text-sm text-gray-600 mt-1">{scale.interpretation}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-2xl font-bold" style={{ color: scale.color }}>{scale.score}</p>
              <p className="text-xs font-medium" style={{ color: scale.color }}>{scale.level}</p>
            </div>
          </div>

          <button onClick={onToggle} className="text-sm text-blue-600 mt-2 hover:underline">
            {showIntervention ? '隐藏干预建议' : '查看干预建议'}
          </button>

          {showIntervention && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-1">
              {scale.interventions.map((intervention, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{intervention}</span>
                </div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CgaResultPage;
