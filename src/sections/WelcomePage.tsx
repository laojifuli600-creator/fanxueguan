import React from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import { Activity, Shield, Stethoscope, ArrowRight, HeartPulse, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomePage: React.FC = () => {
  const { nextStep } = useAssessment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-7 h-7 text-red-500" />
            <h1 className="text-xl font-bold text-gray-800">泛血管疾病风险评估</h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Hospital className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">上海市第六人民医院老年医学科</span>
            <span className="sm:hidden">市六医院老年医学科</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hospital Badge */}
          <motion.div
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Hospital className="w-4 h-4" />
            上海市第六人民医院老年医学科 出品
          </motion.div>

          {/* Hero Icon */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-12 h-12 text-red-500" />
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            您的血管健康，<br className="md:hidden" />一个整体
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            泛血管疾病是指全身多部位血管（心脏、大脑、肾脏、四肢等）的动脉粥样硬化性疾病。
            本工具将帮助您了解自身泛血管疾病风险，并提供个性化预防建议。
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Stethoscope className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">综合评估</h3>
              <p className="text-sm text-gray-600">基于年龄、血压、血糖、血脂等多维度指标</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Activity className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">动态可视化</h3>
              <p className="text-sm text-gray-600">直观展示心、脑、肾、四肢血管风险</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Shield className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">个性化建议</h3>
              <p className="text-sm text-gray-600">根据评估结果提供针对性预防策略</p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={nextStep}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              开始评估
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <p className="mt-6 text-xs text-gray-500">
            本工具仅供参考，不能替代专业医疗诊断。如有不适，请及时就医。
          </p>
          <p className="mt-1 text-xs text-gray-400">
            上海市第六人民医院老年医学科
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default WelcomePage;
