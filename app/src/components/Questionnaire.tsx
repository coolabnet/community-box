
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import PointsAllocation from './PointsAllocation';
import UsageSelection from './UsageSelection';
import RecommendationResults from './RecommendationResults';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { PriorityAllocation, UsageSelectionValues, UserAnswers } from '@/types/questionnaire';

const Questionnaire = () => {
  const { t } = useTranslation();
  const { currentStep, setCurrentStep, answers, setAnswer, goBack, resetSurvey } = useQuestionnaire();

  const questions = [
    {
      id: 'electricity',
      question: t('questionnaire.questions.electricity.question'),
      type: 'options',
      options: [
        { label: t('questionnaire.questions.electricity.options.yes'), value: 'yes' },
        { label: t('questionnaire.questions.electricity.options.sometimes'), value: 'sometimes' },
        { label: t('questionnaire.questions.electricity.options.no'), value: 'no' },
      ],
    },
    {
      id: 'users',
      question: t('questionnaire.questions.users.question'),
      type: 'options',
      options: [
        { label: t('questionnaire.questions.users.options.1-2'), value: '1-2' },
        { label: t('questionnaire.questions.users.options.3-5'), value: '3-5' },
        { label: t('questionnaire.questions.users.options.6+'), value: '6+' },
      ],
    },
    {
      id: 'growth',
      question: t('questionnaire.questions.growth.question'),
      type: 'options',
      options: [
        { label: t('questionnaire.questions.growth.options.low'), value: 'low' },
        { label: t('questionnaire.questions.growth.options.medium'), value: 'medium' },
        { label: t('questionnaire.questions.growth.options.high'), value: 'high' },
      ],
    },
    {
      id: 'reuse',
      question: t('questionnaire.questions.reuse.question'),
      type: 'options',
      options: [
        { label: t('questionnaire.questions.reuse.options.yes'), value: 'yes' },
        { label: t('questionnaire.questions.reuse.options.no'), value: 'no' },
      ],
    },
    {
      id: 'format',
      question: t('questionnaire.questions.format.question'),
      type: 'options',
      options: [
        { label: t('questionnaire.questions.format.options.yes'), value: 'yes' },
        { label: t('questionnaire.questions.format.options.maybe'), value: 'maybe' },
        { label: t('questionnaire.questions.format.options.no'), value: 'no' },
      ],
    },
    {
      id: 'price',
      question: t('questionnaire.questions.price.question'),
      type: 'options',
      options: [
        { label: t('questionnaire.questions.price.options.low'), value: 'low' },
        { label: t('questionnaire.questions.price.options.medium'), value: 'medium' },
        { label: t('questionnaire.questions.price.options.high'), value: 'high' },
      ],
    },
    {
      id: 'points',
      question: t('questionnaire.questions.points.question'),
      type: 'custom',
    },
    {
      id: 'usage',
      question: t('questionnaire.questions.usage.question'),
      type: 'custom',
    },
    {
      id: 'mainUse',
      question: t('questionnaire.questions.mainUse.question'),
      type: 'options',
      options: [
        { label: t('questionnaire.questions.mainUse.options.education'), value: 'education' },
        { label: t('questionnaire.questions.mainUse.options.business'), value: 'business' },
        { label: t('questionnaire.questions.mainUse.options.personal'), value: 'personal' },
      ],
    },
    {
      id: 'results',
      question: t('questionnaire.questions.results.title'),
      type: 'results',
    },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      goBack();
    }
  };

  const currentQuestion = questions[currentStep];

  // Handle points allocation
  const handlePointsAllocation = (values: PriorityAllocation) => {
    setAnswer('points', values);
    handleNext();
  };

  // Handle usage selection
  const handleUsageSelection = (values: UsageSelectionValues) => {
    setAnswer('usage', values);
    handleNext();
  };

  // Handle start over (reset questionnaire)
  const handleStartOver = () => {
    // Use the context's reset function
    resetSurvey();
  };

  // Determine which component to render based on the current question
  const renderCurrentStep = () => {
    if (currentQuestion.id === 'points') {
      return (
        <PointsAllocation
          key="points-allocation"
          onNext={handlePointsAllocation}
          onBack={handleBack}
        />
      );
    } else if (currentQuestion.id === 'usage') {
      return (
        <UsageSelection
          key="usage-selection"
          onNext={handleUsageSelection}
          onBack={handleBack}
        />
      );
    } else if (currentQuestion.id === 'results') {
      return (
        <RecommendationResults
          key="recommendation-results"
          answers={answers as UserAnswers}
          onStartOver={handleStartOver}
        />
      );
    } else {
      return (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion.question}
          options={currentQuestion.options}
          type={currentQuestion.type as 'options' | 'slider' | 'boolean'}
          selectedValue={answers[currentQuestion.id]}
          onSelect={(value) => setAnswer(currentQuestion.id, value)}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentQuestion.id !== 'results' && <ProgressBar />}
      <div className={`container mx-auto ${currentQuestion.id !== 'results' ? 'pt-16' : ''}`}>
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Questionnaire;
