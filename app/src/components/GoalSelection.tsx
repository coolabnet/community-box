import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { GoalSelectionValues } from '@/types/questionnaire';
import { CATEGORY_IDS, type GoalKey } from '@/data/applications/categories';
import {
  GraduationCap,
  FolderOpen,
  Users,
  Radio,
  MessageCircle,
  Network,
  Languages,
  Map as MapIcon,
  HeartPulse,
  Handshake,
  MoreHorizontal,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

type GoalOptionKey = GoalKey | 'other';

const GOAL_ICONS: Record<GoalOptionKey, ReactNode> = {
  education: <GraduationCap className="h-8 w-8" />,
  mediaStorage: <FolderOpen className="h-8 w-8" />,
  officeCollab: <Users className="h-8 w-8" />,
  localMedia: <Radio className="h-8 w-8" />,
  communication: <MessageCircle className="h-8 w-8" />,
  networkManagement: <Network className="h-8 w-8" />,
  languageCulture: <Languages className="h-8 w-8" />,
  territoryMapping: <MapIcon className="h-8 w-8" />,
  healthWellbeing: <HeartPulse className="h-8 w-8" />,
  localEconomy: <Handshake className="h-8 w-8" />,
  other: <MoreHorizontal className="h-8 w-8" />,
};

const OPTION_KEYS: GoalOptionKey[] = [...CATEGORY_IDS, 'other'];

interface GoalOption {
  key: GoalOptionKey;
  selected: boolean;
  otherText?: string;
}

interface GoalSelectionProps {
  initialValues?: GoalSelectionValues;
  onNext: (values: GoalSelectionValues) => void;
  onBack?: () => void;
}

const GoalSelection = ({ initialValues, onNext, onBack }: GoalSelectionProps) => {
  const { t } = useTranslation();

  const [goalOptions, setGoalOptions] = useState<GoalOption[]>(() =>
    OPTION_KEYS.map(key =>
      key === 'other'
        ? { key, selected: !!initialValues?.other, otherText: initialValues?.other ?? '' }
        : { key, selected: initialValues?.[key] === true }
    )
  );

  // Store the error key, not the translated text, so it follows language switches
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel a pending submission if the step unmounts (for example after Back)
  useEffect(() => () => {
    if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
  }, []);

  // Toggle selection for an option
  const toggleOption = (index: number) => {
    setGoalOptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return updated;
    });

    // Clear error if any option is selected
    if (errorKey) {
      setErrorKey(null);
    }
  };

  // Handle text input for "Other" option
  const handleOtherTextChange = (text: string) => {
    setGoalOptions(prev => {
      const updated = [...prev];
      const otherIndex = updated.findIndex(option => option.key === 'other');
      updated[otherIndex] = { ...updated[otherIndex], otherText: text };
      return updated;
    });
    if (errorKey) {
      setErrorKey(null);
    }
  };

  // Handle continue button click
  const handleContinue = () => {
    // Ignore repeated clicks while a submission is pending
    if (submitTimerRef.current) return;

    const values = goalOptions.reduce<GoalSelectionValues>((acc, option) => {
      if (!option.selected) return acc;
      if (option.key === 'other') {
        const text = (option.otherText ?? '').trim();
        if (text !== '') acc.other = text;
      } else {
        acc[option.key] = true;
      }
      return acc;
    }, {});

    // Check if at least one option is selected (an empty "other" does not count)
    if (Object.keys(values).length === 0) {
      setErrorKey('questionnaire.questions.goals.selectAtLeastOne');
      return;
    }

    // Show success animation
    setShowSuccessAnimation(true);

    submitTimerRef.current = setTimeout(() => {
      submitTimerRef.current = null;
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
      {/* Top padding clears the floating menu button and progress bar */}
      <div className="flex-1 flex flex-col px-6 pb-6 pt-20 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">
            {t('questionnaire.questions.goals.question')}
          </h1>
          <p className="text-muted-foreground">
            {t('questionnaire.questions.goals.description')}
          </p>
        </motion.div>

        {/* Options grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {goalOptions.map((option, index) => (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              className={cn(
                "relative rounded-xl border-2 transition-all",
                option.selected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <button
                type="button"
                aria-pressed={option.selected}
                onClick={() => toggleOption(index)}
                disabled={showSuccessAnimation}
                className="w-full p-6 pr-14 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-start gap-4">
                  <span className={cn(
                    "block p-3 rounded-lg transition-colors",
                    option.selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {GOAL_ICONS[option.key]}
                  </span>

                  <span className="block flex-1">
                    <span className="block text-xl font-medium mb-1">
                      {t(`questionnaire.questions.goals.${option.key}.name`)}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {t(`questionnaire.questions.goals.${option.key}.help`)}
                    </span>
                  </span>
                </span>
              </button>

              {/* Text input for "Other" option, outside the toggle button */}
              {option.key === 'other' && option.selected && (
                <div className="px-6 pb-6">
                  <Input
                    placeholder={t('questionnaire.questions.goals.other.placeholder')}
                    aria-label={t('questionnaire.questions.goals.other.name')}
                    value={option.otherText || ''}
                    onChange={(e) => handleOtherTextChange(e.target.value)}
                    disabled={showSuccessAnimation}
                    className="bg-background"
                  />
                </div>
              )}

              {/* Selection indicator */}
              <div className={cn(
                "pointer-events-none absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center transition-all",
                option.selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {option.selected && <Check className="h-4 w-4" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm">
        {errorKey && (
          <div
            id="goals-error"
            role="alert"
            aria-live="assertive"
            className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 mx-auto max-w-md"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{t(errorKey)}</span>
          </div>
        )}
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
              disabled={showSuccessAnimation}
              className="py-6 text-lg flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('questionnaire.buttons.back')}
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={showSuccessAnimation}
            aria-describedby={errorKey ? 'goals-error' : undefined}
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
                  {t('questionnaire.questions.goals.continue')}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GoalSelection;
