
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SurveyState,
  decodeStateFromUrl,
  loadStateFromStorage,
  saveStateToStorage,
  updateUrlWithState,
  clearStoredState
} from '@/utils/statePersistence';

interface QuestionnaireContextType {
  currentStep: number;
  totalSteps: number;
  answers: Record<string, any>;
  setCurrentStep: (step: number) => void;
  setAnswer: (questionId: string, answer: any) => void;
  resetSurvey: () => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const totalSteps = 10; // 6 questions + points + usage + main use + results

  // Initialize state from URL params or localStorage
  useEffect(() => {
    // First try to get state from URL
    const urlState = decodeStateFromUrl();

    if (urlState) {
      // If URL has state, use it
      setCurrentStep(urlState.currentStep);
      setAnswers(urlState.answers);
    } else {
      // Otherwise try localStorage
      const storedState = loadStateFromStorage();

      if (storedState) {
        setCurrentStep(storedState.currentStep);
        setAnswers(storedState.answers);
      }
    }

    setIsInitialized(true);
  }, []);

  // Save state to localStorage and update URL whenever state changes
  useEffect(() => {
    if (!isInitialized) return;

    const state: SurveyState = {
      currentStep,
      answers
    };

    // Save to localStorage
    saveStateToStorage(state);

    // Update URL
    updateUrlWithState(state);
  }, [currentStep, answers, isInitialized]);

  const setAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Reset the survey state
  const resetSurvey = () => {
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);

    // Reset to first step
    setCurrentStep(0);

    // Clear answers
    setAnswers({});

    // Clear localStorage
    clearStoredState();
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        currentStep,
        totalSteps,
        answers,
        setCurrentStep,
        setAnswer,
        resetSurvey,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export const useQuestionnaire = () => {
  const { t } = useTranslation();
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error(t('errors.contextError'));
  }
  return context;
};
