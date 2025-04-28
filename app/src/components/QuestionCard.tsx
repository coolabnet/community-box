
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface QuestionCardProps {
  question: string;
  options?: { label: string; value: string | number }[];
  onSelect?: (value: string | number) => void;
  selectedValue?: string | number;
  onNext: () => void;
  type?: 'options' | 'slider' | 'boolean';
  className?: string;
}

const QuestionCard = ({
  question,
  options,
  onSelect,
  selectedValue,
  onNext,
  type = 'options',
  className,
}: QuestionCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'max-w-2xl mx-auto px-4 py-8 rounded-xl',
        className
      )}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">{question}</h2>

      {type === 'options' && options && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect?.(option.value)}
              className={cn(
                'p-6 rounded-xl text-lg transition-all duration-200',
                'hover:shadow-lg hover:scale-105',
                selectedValue === option.value
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-secondary/80'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button
          onClick={onNext}
          disabled={selectedValue === undefined}
          className="px-8 py-6 text-lg"
        >
          {t('questionnaire.buttons.next')}
        </Button>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
