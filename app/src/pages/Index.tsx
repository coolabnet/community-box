
import { QuestionnaireProvider } from '@/context/QuestionnaireContext';
import Questionnaire from '@/components/Questionnaire';

const Index = () => {
  return (
    <QuestionnaireProvider>
      <Questionnaire />
    </QuestionnaireProvider>
  );
};

export default Index;
