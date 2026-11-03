
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import PointsAllocation from './PointsAllocation';
import { needsGoalsFirst } from '@/utils/questionnaireFlow';
import GoalSelection from './GoalSelection';
import ApplicationsReview from './ApplicationsReview';
import AccessDevicesSelection from './AccessDevicesSelection';
import RecommendationResults from './RecommendationResults';
import ErrorBoundary from './ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import type { AccessDeviceValues, AppSelectionValues, GoalSelectionValues, PriorityAllocation, UserAnswers } from '@/types/questionnaire';

const Questionnaire = () => {
  const { t } = useTranslation();
  const { currentStep, setCurrentStep, answers, setAnswer, goBack, resetSurvey, setTotalSteps } = useQuestionnaire();

  const helpLinkClass = 'font-medium underline underline-offset-4 hover:text-primary';

  // Keep SURVEY_STEP_COUNT (utils/statePersistence.ts) equal to this list's length.
  const questions = [
    {
      id: 'goals',
      question: t('questionnaire.questions.goals.question'),
      type: 'custom',
    },
    {
      id: 'electricity',
      question: t('questionnaire.questions.electricity.question'),
      help: (
        <Trans
          i18nKey="questionnaire.questions.electricity.help"
          components={{
            a: <a href="https://solar.coolab.org/" target="_blank" rel="noopener noreferrer" className={helpLinkClass} />,
          }}
        />
      ),
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
      id: 'accessDevices',
      question: t('questionnaire.questions.accessDevices.question'),
      type: 'custom',
    },
    {
      id: 'growth',
      question: t('questionnaire.questions.growth.question'),
      help: <Trans i18nKey="questionnaire.questions.growth.help" />,
      type: 'options',
      options: [
        { label: t('questionnaire.questions.growth.options.low'), value: 'low' },
        { label: t('questionnaire.questions.growth.options.medium'), value: 'medium' },
        { label: t('questionnaire.questions.growth.options.high'), value: 'high' },
        { label: t('questionnaire.questions.growth.options.notSure'), value: 'notSure' },
      ],
    },
    {
      id: 'reuse',
      question: t('questionnaire.questions.reuse.question'),
      help: (
        <Trans
          i18nKey="questionnaire.questions.reuse.help"
          components={{
            a: <Link to="/docs/guides/recycled-pc-requirements" target="_blank" rel="noopener noreferrer" className={helpLinkClass} />,
          }}
        />
      ),
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
      id: 'techSupport',
      question: t('questionnaire.questions.techSupport.question'),
      help: <Trans i18nKey="questionnaire.questions.techSupport.help" />,
      type: 'options',
      options: [
        { label: t('questionnaire.questions.techSupport.options.community'), value: 'community' },
        { label: t('questionnaire.questions.techSupport.options.external'), value: 'external' },
        { label: t('questionnaire.questions.techSupport.options.no'), value: 'no' },
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
      id: 'applications',
      question: t('questionnaire.questions.applications.question'),
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

  // Keep totalSteps in sync with the questions array
  useEffect(() => {
    setTotalSteps(questions.length);
  }, [questions.length, setTotalSteps]);

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

  const currentQuestion = questions[Math.min(Math.max(Math.floor(currentStep) || 0, 0), questions.length - 1)];

  // Handle points allocation
  const handlePointsAllocation = (values: PriorityAllocation) => {
    setAnswer('points', values);
    handleNext();
  };

  // Handle goals selection
  const handleGoalsSelection = (values: GoalSelectionValues) => {
    setAnswer('goals', values);
    // Goals asked late (applications step) stay on this step so the review shows next
    if (currentQuestion.id === 'goals') handleNext();
  };

  // Handle applications review
  const handleApplicationsSelection = (values: AppSelectionValues) => {
    setAnswer('apps', values);
    handleNext();
  };

  // Handle access device selection
  const handleAccessDevicesSelection = (values: AccessDeviceValues) => {
    setAnswer('accessDevices', values);
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
    } else if (currentQuestion.id === 'goals' || needsGoalsFirst(currentQuestion.id, answers as UserAnswers)) {
      return (
        <GoalSelection
          key="goal-selection"
          initialValues={(answers as UserAnswers).goals}
          onNext={handleGoalsSelection}
          onBack={currentQuestion.id === 'goals' ? undefined : handleBack}
        />
      );
    } else if (currentQuestion.id === 'applications') {
      return (
        <ApplicationsReview
          key="applications-review"
          goals={(answers as UserAnswers).goals ?? {}}
          initialValues={(answers as UserAnswers).apps}
          onNext={handleApplicationsSelection}
          onChange={values => setAnswer('apps', values)}
          onBack={handleBack}
        />
      );
    } else if (currentQuestion.id === 'accessDevices') {
      return (
        <AccessDevicesSelection
          key="access-devices-selection"
          onNext={handleAccessDevicesSelection}
          onBack={handleBack}
        />
      );
    } else if (currentQuestion.id === 'results') {
      return (
        <ErrorBoundary resetLabel={t('errors.tryAgain')} onReset={resetSurvey}>
          <RecommendationResults
            key="recommendation-results"
            answers={answers as UserAnswers}
            onStartOver={handleStartOver}
          />
        </ErrorBoundary>
      );
    } else {
      return (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion.question}
          help={currentQuestion.help}
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
