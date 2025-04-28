
import { useQuestionnaire } from '@/context/QuestionnaireContext';

const ProgressBar = () => {
  const { currentStep, totalSteps } = useQuestionnaire();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
