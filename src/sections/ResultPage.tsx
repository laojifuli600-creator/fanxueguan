import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import RiskGauge from '@/components/RiskGauge';
import VascularMap from '@/components/VascularMap';
import RiskBreakdown from '@/components/RiskBreakdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRiskLevelText, getRiskLevelBgColor, getRiskLevelColor } from '@/lib/riskCalculator';
import { RotateCcw, FileText, HeartPulse, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Hospital } from 'lucide-react';

const ResultPage: React.FC = () => {
  const { result, reset } = useAssessment();
  const [showAllAdvice, setShowAllAdvice] = useState(false);

  if (!result) return null;

  const riskColor = getRiskLevelColor(result.riskLevel);
  const riskBgClass = getRiskLevelBgColor(result.riskLevel);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-red-500" />
            <h1 className="text-lg font-bold text-gray-800">评估结果</h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Hospital className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">上海市第六人民医院老年医学科</span>
            <span className="sm:hidden">市六医院老年医学科</span>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1 w-4 h-4" />
            重新评估
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Risk Summary Card */}
          <motion.div variants={itemVariants}>
            <Card className={`mb-6 border-2 ${riskBgClass}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Gauge */}
                  <div className="flex-shrink-0">
                    <RiskGauge 
                      percentage={result.riskPercentage} 
                      level={result.riskLevel}
                      score={result.totalScore}
                    />
                  </div>

                  {/* Summary Text */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      您的泛血管疾病风险评估结果为：
                      <span style={{ color: riskColor }} className="ml-2">
                        {getRiskLevelText(result.riskLevel)}
                      </span>
                    </h2>
                    
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${riskBgClass}`}>
                      {result.riskLevel === 'low' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {result.riskLevel === 'moderate' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {(result.riskLevel === 'high' || result.riskLevel === 'veryHigh') && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      <span className="font-medium">
                        {result.riskLevel === 'low' && '继续保持，定期体检'}
                        {result.riskLevel === 'moderate' && '需要关注，改善生活方式'}
                        {result.riskLevel === 'high' && '建议就医，积极干预'}
                        {result.riskLevel === 'veryHigh' && '强烈建议尽快就医'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      本评估基于您提供的年龄、性别、生活方式、既往病史和实验室指标，
                      综合计算得出泛血管疾病（包括心、脑、肾、外周血管）的总体风险。
                      风险指数仅供参考，具体诊断和治疗方案请咨询专业医生。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Analysis Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="map" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="map" className="text-sm">
                  <HeartPulse className="w-4 h-4 mr-1" />
                  泛血管地图
                </TabsTrigger>
                <TabsTrigger value="factors" className="text-sm">
                  <FileText className="w-4 h-4 mr-1" />
                  风险因素
                </TabsTrigger>
                <TabsTrigger value="advice" className="text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  健康建议
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <VascularMap vascularMap={result.vascularMap} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="factors" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <RiskBreakdown riskFactors={result.riskFactors} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advice" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">个性化健康建议</h3>
                    <div className="space-y-3">
                      {result.advice.slice(0, showAllAdvice ? undefined : 5).map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                    {result.advice.length > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-4 text-blue-600"
                        onClick={() => setShowAllAdvice(!showAllAdvice)}
                      >
                        {showAllAdvice ? (
                          <>收起 <ChevronUp className="ml-1 w-4 h-4" /></>
                        ) : (
                          <>展开全部建议 <ChevronDown className="ml-1 w-4 h-4" /></>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Hospital Info */}
          <motion.div variants={itemVariants} className="text-center mb-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Hospital className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-800">上海市第六人民医院老年医学科</span>
              </div>
              <p className="text-sm text-blue-700">
                关注我们的公众号，获取更多老年健康科普资讯
              </p>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>免责声明：</strong>本评估工具仅用于健康科普教育，不能替代专业医疗诊断、治疗建议或临床决策。
                评估结果基于您自行输入的数据和简化算法，可能存在局限性。
                如有任何不适症状，或对自身健康状况有疑问，请及时咨询专业医生或到医院就诊。
                特别是被评为高风险或极高风险的人群，建议尽快到医院心血管内科或泛血管疾病专科进行详细检查。
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center mt-8 mb-12">
            <Button
              onClick={reset}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-5 text-base rounded-full shadow-lg"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              重新评估
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ResultPage;
