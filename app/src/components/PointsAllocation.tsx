import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PriorityAllocation, PriorityKey } from '@/types/questionnaire';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import {
  MousePointerClick,
  Zap,
  Globe,
  ArrowUpRight,
  DollarSign,
  Plus,
  Minus,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface Priority {
  key: PriorityKey;
  icon: ReactNode;
  points: number;
}

const MAX_POINTS = 5;

// Define priority colors
const priorityColors = {
  easyToUse: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', fill: 'bg-blue-500' },
  lowPower: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', fill: 'bg-green-500' },
  language: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', fill: 'bg-purple-500' },
  scalable: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', fill: 'bg-orange-500' },
  lowCost: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', fill: 'bg-rose-500' },
};

interface PointsAllocationProps {
  onNext: (values: PriorityAllocation) => void;
  onBack?: () => void;
}

const PointsAllocation = ({ onNext, onBack }: PointsAllocationProps) => {
  const { t } = useTranslation();
  const { answers } = useQuestionnaire();

  // Initialize priorities from saved answers if available
  const savedPoints = answers.points as PriorityAllocation | undefined;

  const [priorities, setPriorities] = useState<Priority[]>([
    { key: 'easyToUse', icon: <MousePointerClick className="h-5 w-5" />, points: savedPoints?.easyToUse ?? 0 },
    { key: 'lowPower', icon: <Zap className="h-5 w-5" />, points: savedPoints?.lowPower ?? 0 },
    { key: 'language', icon: <Globe className="h-5 w-5" />, points: savedPoints?.language ?? 0 },
    { key: 'scalable', icon: <ArrowUpRight className="h-5 w-5" />, points: savedPoints?.scalable ?? 0 },
    { key: 'lowCost', icon: <DollarSign className="h-5 w-5" />, points: savedPoints?.lowCost ?? 0 },
  ]);

  const [showMaxPointsMessage, setShowMaxPointsMessage] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const remainingPoints = useMemo(() => {
    const usedPoints = priorities.reduce((sum, priority) => sum + priority.points, 0);
    return MAX_POINTS - usedPoints;
  }, [priorities]);

  // Handle adding a point to a priority
  const handleAddPoint = (index: number) => {
    if (remainingPoints <= 0) {
      // Show max points message and hide it after 2 seconds
      setShowMaxPointsMessage(true);
      setTimeout(() => setShowMaxPointsMessage(false), 2000);
      return;
    }

    // Set active card for animation
    setActiveCard(index);

    setPriorities(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], points: updated[index].points + 1 };
      return updated;
    });

    // Clear active card after animation
    setTimeout(() => setActiveCard(null), 500);
  };

  // Handle removing a point from a priority
  const handleRemovePoint = (index: number) => {
    if (priorities[index].points <= 0) return;

    // Set active card for animation
    setActiveCard(index);

    setPriorities(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], points: updated[index].points - 1 };
      return updated;
    });

    // Clear active card after animation
    setTimeout(() => setActiveCard(null), 500);
  };

  // Handle continue button click
  const handleContinue = () => {
    const values = priorities.reduce<PriorityAllocation>((acc, priority) => {
      acc[priority.key] = priority.points;
      return acc;
    }, {});

    onNext(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <motion.h2
        className="text-3xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {t('questionnaire.questions.points.question')}
      </motion.h2>
      <motion.p
        className="text-center text-muted-foreground mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('questionnaire.questions.points.description')}
      </motion.p>

      {/* Points remaining indicator */}
      <div className="mb-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={remainingPoints}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium shadow-md",
              showMaxPointsMessage
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                : remainingPoints === 0
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300"
            )}
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{
              opacity: 1,
              scale: showMaxPointsMessage ? [1, 1.1, 1] : 1,
              y: 0
            }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.3 }}
          >
            {showMaxPointsMessage ? (
              <>
                <Sparkles className="h-4 w-4" />
                {t('questionnaire.questions.points.maxPointsReached')}
              </>
            ) : (
              t('questionnaire.questions.points.pointsRemaining', { count: remainingPoints })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Priority items */}
      <div className="space-y-5 mb-10">
        {priorities.map((priority, index) => {
          const colors = priorityColors[priority.key];
          return (
            <motion.div
              key={priority.key}
              className={cn(
                "rounded-xl p-5 shadow-sm border transition-all duration-300",
                activeCard === index ? "shadow-md scale-[1.02]" : "",
                colors.bg,
                "border-transparent"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={cn(
                      "p-2.5 rounded-full",
                      colors.bg,
                      colors.text,
                      "shadow-sm"
                    )}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    {priority.icon}
                  </motion.div>
                  <div>
                    <h3 className={cn("font-medium text-lg", colors.text)}>
                      {t(`questionnaire.questions.points.priorities.${priority.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`questionnaire.questions.points.priorities.${priority.key}.description`)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-full border-2",
                        priority.points === 0 ? "opacity-50" : colors.text,
                        "border-current"
                      )}
                      onClick={() => handleRemovePoint(index)}
                      disabled={priority.points === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={priority.points}
                      className={cn(
                        "w-9 h-9 flex items-center justify-center rounded-full font-bold text-lg",
                        priority.points > 0 ? colors.fill : "bg-secondary",
                        priority.points > 0 ? "text-white" : "text-muted-foreground"
                      )}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {priority.points}
                    </motion.div>
                  </AnimatePresence>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-full border-2",
                        remainingPoints === 0 ? "opacity-50" : colors.text,
                        "border-current"
                      )}
                      onClick={() => handleAddPoint(index)}
                      disabled={remainingPoints === 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-white/50 dark:bg-black/10 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className={cn("h-full", colors.fill)}
                  initial={{ width: 0 }}
                  animate={{ width: `${(priority.points / MAX_POINTS) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              {/* Point indicators */}
              <div className="flex justify-between mt-2 px-1">
                {[...Array(MAX_POINTS)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      i < priority.points ? colors.fill : "bg-white/50 dark:bg-black/10"
                    )}
                    animate={{
                      scale: i < priority.points ? [1, 1.5, 1] : 1,
                      opacity: i < priority.points ? 1 : 0.5
                    }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05
                    }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Continue button */}
      <motion.div
        className="flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {onBack && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={onBack}
              className="px-8 py-6 text-lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('questionnaire.buttons.back')}
            </Button>
          </motion.div>
        )}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleContinue}
            className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {t('questionnaire.questions.points.continue')}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PointsAllocation;
