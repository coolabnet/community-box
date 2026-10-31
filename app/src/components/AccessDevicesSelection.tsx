import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AccessDeviceKey, AccessDeviceValues } from '@/types/questionnaire';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import {
  Smartphone,
  Laptop,
  Monitor,
  Users,
  Check,
  ArrowLeft
} from 'lucide-react';

interface AccessDeviceOption {
  key: AccessDeviceKey;
  icon: ReactNode;
  selected: boolean;
}

interface AccessDevicesSelectionProps {
  onNext: (values: AccessDeviceValues) => void;
  onBack?: () => void;
}

const AccessDevicesSelection = ({ onNext, onBack }: AccessDevicesSelectionProps) => {
  const { t } = useTranslation();
  const { answers } = useQuestionnaire();

  // Initialize from saved answers if available
  const savedDevices = answers.accessDevices as AccessDeviceValues | undefined;

  const [deviceOptions, setDeviceOptions] = useState<AccessDeviceOption[]>([
    { key: 'smartphones', icon: <Smartphone className="h-8 w-8" />, selected: savedDevices?.smartphones ?? false },
    { key: 'laptops', icon: <Laptop className="h-8 w-8" />, selected: savedDevices?.laptops ?? false },
    { key: 'desktops', icon: <Monitor className="h-8 w-8" />, selected: savedDevices?.desktops ?? false },
    { key: 'shared', icon: <Users className="h-8 w-8" />, selected: savedDevices?.shared ?? false },
  ]);

  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  // True from Continue until the delayed advance fires or Back cancels it
  const isPending = showSuccessAnimation;

  // Pending delayed advance to the next step; cleared on Back and unmount
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, []);

  const handleBack = () => {
    if (advanceTimerRef.current !== null) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setShowSuccessAnimation(false);
    onBack?.();
  };

  // Toggle selection for an option
  const toggleOption = (index: number) => {
    // Ignore changes while advancing so the submitted values match what is shown
    if (advanceTimerRef.current !== null) {
      return;
    }
    setDeviceOptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return updated;
    });
  };

  // At least one option is required to continue
  const hasSelection = deviceOptions.some(option => option.selected);

  // Handle continue button click
  const handleContinue = () => {
    if (!hasSelection || advanceTimerRef.current !== null) {
      return;
    }

    // Show success animation
    setShowSuccessAnimation(true);

    // Prepare data for submission
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;

      const values = deviceOptions.reduce<AccessDeviceValues>((acc, option) => {
        if (option.selected) {
          acc[option.key] = true;
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
            {t('questionnaire.questions.accessDevices.question')}
          </h1>
          <p className="text-muted-foreground">
            {t('questionnaire.questions.accessDevices.description')}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('questionnaire.questions.accessDevices.help')}
          </p>
        </motion.div>

        {/* Options grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {deviceOptions.map((option, index) => (
            <motion.button
              type="button"
              key={option.key}
              disabled={isPending}
              aria-disabled={isPending}
              aria-pressed={option.selected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative w-full text-left p-6 rounded-xl border-2 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                option.selected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/30"
              )}
              onClick={() => toggleOption(index)}
            >
              <span className="flex items-start gap-4">
                <span className={cn(
                  "inline-flex p-3 rounded-lg transition-colors",
                  option.selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {option.icon}
                </span>

                <span className="flex-1">
                  <span className="block text-xl font-medium mb-1">
                    {t(`questionnaire.questions.accessDevices.options.${option.key}`)}
                  </span>
                </span>

                {/* Selection indicator */}
                <span className={cn(
                  "absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center transition-all",
                  option.selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {option.selected && <Check className="h-4 w-4" />}
                </span>
              </span>
            </motion.button>
          ))}
        </div>

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
              onClick={handleBack}
              className="py-6 text-lg flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('questionnaire.buttons.back')}
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={!hasSelection || showSuccessAnimation}
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
                  {t('questionnaire.questions.accessDevices.continue')}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AccessDevicesSelection;
