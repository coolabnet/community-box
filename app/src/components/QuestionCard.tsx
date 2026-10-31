
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  help?: ReactNode;
  options?: { label: string; value: string | number }[];
  onSelect?: (value: string | number) => void;
  selectedValue?: string | number;
  onNext: () => void;
  onBack?: () => void;
  type?: 'options' | 'slider' | 'boolean';
  className?: string;
}

const QuestionCard = ({
  question,
  help,
  options,
  onSelect,
  selectedValue,
  onNext,
  onBack,
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

      {help && (
        <Collapsible className="-mt-6 mb-8 max-w-xl mx-auto">
          <CollapsibleTrigger className="mx-auto flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-180">
            {t('questionnaire.moreInformation')}
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 rounded-lg bg-muted p-4 text-left text-sm text-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4">
            {help}
          </CollapsibleContent>
        </Collapsible>
      )}

      {type === 'options' && options && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              aria-pressed={selectedValue === option.value}
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

      <div className="flex justify-center gap-4 mt-8">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="px-8 py-6 text-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('questionnaire.buttons.back')}
          </Button>
        )}
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
