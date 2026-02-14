import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { UsageKey, UsageSelectionValues } from '@/types/questionnaire';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import {
  Newspaper,
  FileText,
  GraduationCap,
  Radio,
  MoreHorizontal,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface UsageOption {
  key: UsageKey;
  icon: ReactNode;
  selected: boolean;
  otherText?: string;
}

interface UsageSelectionProps {
  onNext: (values: UsageSelectionValues) => void;
  onBack?: () => void;
}

const UsageSelection = ({ onNext, onBack }: UsageSelectionProps) => {
  const { t } = useTranslation();
  const { answers } = useQuestionnaire();

  // Initialize from saved answers if available
  const savedUsage = answers.usage as UsageSelectionValues | undefined;

  const [usageOptions, setUsageOptions] = useState<UsageOption[]>([
    { key: 'news', icon: <Newspaper className="h-8 w-8" />, selected: savedUsage?.news ?? false },
    { key: 'files', icon: <FileText className="h-8 w-8" />, selected: savedUsage?.files ?? false },
    { key: 'education', icon: <GraduationCap className="h-8 w-8" />, selected: savedUsage?.education ?? false },
    { key: 'media', icon: <Radio className="h-8 w-8" />, selected: savedUsage?.media ?? false },
    { key: 'other', icon: <MoreHorizontal className="h-8 w-8" />, selected: !!savedUsage?.other, otherText: typeof savedUsage?.other === 'string' ? savedUsage.other : '' },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Toggle selection for an option
  const toggleOption = (index: number) => {
    setUsageOptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return updated;
    });

    // Clear error if any option is selected
    if (error) {
      setError(null);
    }
  };

  // Handle text input for "Other" option
  const handleOtherTextChange = (text: string) => {
    setUsageOptions(prev => {
      const updated = [...prev];
      const otherIndex = updated.findIndex(option => option.key === 'other');
      updated[otherIndex] = {
        ...updated[otherIndex],
        otherText: text,
        // Auto-select the "Other" option when text is entered
        selected: text.trim() !== '' ? true : updated[otherIndex].selected
      };
      return updated;
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    // Check if at least one option is selected
    const hasSelection = usageOptions.some(option => option.selected);

    if (!hasSelection) {
      setError(t('questionnaire.questions.usage.selectAtLeastOne'));
      return;
    }

    // Show success animation
    setShowSuccessAnimation(true);

    // Prepare data for submission
    setTimeout(() => {
      const values = usageOptions.reduce<UsageSelectionValues>((acc, option) => {
        if (option.selected) {
          acc[option.key] = option.key === 'other' ? option.otherText ?? '' : true;
        }
        return acc;
      }, {});

      onNext(values);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col bg-background"
    >
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">
            {t('questionnaire.questions.usage.question')}
          </h1>
          <p className="text-muted-foreground">
            {t('questionnaire.questions.usage.description')}
          </p>
        </motion.div>

        {/* Options grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {usageOptions.map((option, index) => (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative p-6 rounded-xl border-2 cursor-pointer transition-all",
                option.selected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/30"
              )}
              onClick={() => toggleOption(index)}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-lg transition-colors",
                  option.selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {option.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-1">
                    {t(`questionnaire.questions.usage.options.${option.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`questionnaire.questions.usage.options.${option.key}.description`)}
                  </p>

                  {/* Text input for "Other" option */}
                  {option.key === 'other' && option.selected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <Input
                        placeholder={t('questionnaire.questions.usage.options.other.placeholder')}
                        value={option.otherText || ''}
                        onChange={(e) => handleOtherTextChange(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Selection indicator */}
                <div className={cn(
                  "absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center transition-all",
                  option.selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {option.selected && <Check className="h-4 w-4" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 mx-auto max-w-md"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue button */}
      <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <motion.div
          className="max-w-md mx-auto flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="py-6 text-lg flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('questionnaire.buttons.back')}
            </Button>
          )}
          <Button
            onClick={handleContinue}
            className="py-6 text-lg relative overflow-hidden flex-1"
            size="lg"
          >
            <AnimatePresence mode="wait">
              {showSuccessAnimation ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 bg-green-500 flex items-center justify-center"
                >
                  <Check className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <motion.span
                  key="continue"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t('questionnaire.questions.usage.continue')}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UsageSelection;
