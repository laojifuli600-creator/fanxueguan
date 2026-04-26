import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AssessmentData, RiskResult } from '@/lib/riskCalculator';
import { calculateRisk } from '@/lib/riskCalculator';

interface AssessmentContextType {
  data: AssessmentData;
  result: RiskResult | null;
  currentStep: number;
  totalSteps: number;
  setField: <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  calculateResult: () => void;
  reset: () => void;
}

const defaultData: AssessmentData = {
  age: 45,
  gender: 'male',
  height: 170,
  weight: 70,
  smoking: 'never',
  exercise: 'occasional',
  diet: 'average',
  alcohol: 'none',
  hypertension: false,
  diabetes: false,
  dyslipidemia: false,
  coronaryDisease: false,
  strokeTIA: false,
  pad: false,
  ckd: false,
  atrialFibrillation: false,
  systolicBP: 120,
  totalCholesterol: 4.5,
  ldlCholesterol: 2.6,
  fastingGlucose: 5.6,
  familyHistory: false,
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AssessmentData>(defaultData);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6; // 0: welcome, 1-4: questions, 5: result

  const setField = useCallback(<K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, []);

  const calculateResult = useCallback(() => {
    const riskResult = calculateRisk(data);
    setResult(riskResult);
    setCurrentStep(5); // Go to result page
  }, [data]);

  const reset = useCallback(() => {
    setData(defaultData);
    setResult(null);
    setCurrentStep(0);
  }, []);

  return (
    <AssessmentContext.Provider value={{
      data,
      result,
      currentStep,
      totalSteps,
      setField,
      nextStep,
      prevStep,
      goToStep,
      calculateResult,
      reset,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
