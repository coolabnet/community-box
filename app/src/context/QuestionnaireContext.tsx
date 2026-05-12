/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type SurveyState,
  decodeStateFromUrl,
  loadStateFromStorage,
  saveStateToStorage,
  updateUrlWithState,
  clearStoredState
} from '@/utils/statePersistence';

const getInitialSurveyState = (): SurveyState => {
  const urlState = decodeStateFromUrl();
  if (urlState) {
    return urlState;
  }

  const storedState = loadStateFromStorage();
  if (storedState) {
    return storedState;
  }

  return {
    currentStep: 0,
    answers: {},
  };
};

interface QuestionnaireContextType {
  currentStep: number;
  totalSteps: number;
  answers: Record<string, unknown>;
  setCurrentStep: (step: number) => void;
  setAnswer: (questionId: string, answer: unknown) => void;
  goBack: () => void;
  resetSurvey: () => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const initialState = useMemo(() => getInitialSurveyState(), []);
  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialState.answers);

  // NOTE: Must match the number of question steps defined in Questionnaire.tsx.
  // If you add or remove a step in the questionnaire, update this value.
  const totalSteps = 10;

  const skipUrlUpdateRef = useRef(false);

  // Save state to localStorage and update URL whenever state changes
  useEffect(() => {
    if (skipUrlUpdateRef.current) {
      skipUrlUpdateRef.current = false;
      return;
    }
    const state: SurveyState = {
      currentStep,
      answers
    };

    saveStateToStorage(state);
    updateUrlWithState(state);
  }, [currentStep, answers]);

  const setAnswer = (questionId: string, answer: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reset the survey state
  const resetSurvey = () => {
    skipUrlUpdateRef.current = true;

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
        goBack,
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
