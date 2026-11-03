import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AppSelectionValues, GoalSelectionValues } from '@/types/questionnaire';
import { getAppOptionsByGoal, toggleAppSelection } from '@/utils/applications';
import { ArrowLeft, Check } from 'lucide-react';

interface ApplicationsReviewProps {
  goals: GoalSelectionValues;
  initialValues?: AppSelectionValues;
  onNext: (values: AppSelectionValues) => void;
  onChange?: (values: AppSelectionValues) => void;
  onBack?: () => void;
}

const ApplicationsReview = ({ goals, initialValues, onNext, onChange, onBack }: ApplicationsReviewProps) => {
  const { t } = useTranslation();

  const sections = useMemo(() => getAppOptionsByGoal(goals), [goals]);
  const defaultIds = useMemo(
    () => [...new Set(sections.flatMap(s => s.options.filter(o => o.isDefault).map(o => o.app.id)))],
    [sections]
  );

  // Deviations from the defaults; saved choices survive Back and reload
  const [selection, setSelection] = useState<AppSelectionValues>({
    selected: initialValues?.selected ?? [],
    dismissed: initialValues?.dismissed ?? [],
  });

  const isEnabled = (id: string): boolean =>
    selection.selected.includes(id) ||
    (defaultIds.includes(id) && !selection.dismissed.includes(id));

  const hasOtherOnly = sections.length === 0;

  // Emit only ids that still belong to an offered app, as deviations from the defaults
  const toDeviations = (values: AppSelectionValues): AppSelectionValues => {
    const offered = new Set(sections.flatMap(s => s.options.map(o => o.app.id)));
    return {
      selected: values.selected.filter(id => offered.has(id) && !defaultIds.includes(id)),
      dismissed: values.dismissed.filter(id => defaultIds.includes(id)),
    };
  };

  const handleToggle = (appId: string) => {
    const next = toggleAppSelection(selection, appId, defaultIds);
    setSelection(next);
    onChange?.(toDeviations(next));
  };

  const handleContinue = () => onNext(toDeviations(selection));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col bg-background"
    >
      {/* Top padding clears the floating menu button and progress bar */}
      <div className="flex-1 flex flex-col px-6 pb-6 pt-20 overflow-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {t('questionnaire.questions.applications.question')}
          </h1>
          <p className="text-muted-foreground">
            {t('questionnaire.questions.applications.description')}
          </p>
        </div>

        {hasOtherOnly && (
          <p className="text-center text-muted-foreground mb-8">
            {t('questionnaire.questions.applications.otherOnly')}
          </p>
        )}

        <div className="space-y-8 mb-8 max-w-4xl w-full mx-auto">
          {sections.map(section => (
            <section key={section.goal} aria-labelledby={`goal-${section.goal}`}>
              <h2 id={`goal-${section.goal}`} className="text-xl font-semibold mb-3">
                {t(`questionnaire.questions.goals.${section.goal}.name`)}
              </h2>
              {section.options.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('questionnaire.questions.applications.empty')}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.options.map(({ app }) => {
                    const enabled = isEnabled(app.id);
                    return (
                      <button
                        key={app.id}
                        type="button"
                        aria-pressed={enabled}
                        onClick={() => handleToggle(app.id)}
                        className={cn(
                          "relative w-full p-4 pr-12 rounded-xl border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          enabled
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border bg-card hover:border-primary/30"
                        )}
                      >
                        <span className="block font-medium">{t(`${app.i18nKey}.name`)}</span>
                        <span className="block text-sm text-muted-foreground mb-2">
                          {t(`${app.i18nKey}.description`)}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {app.status === 'candidate' && (
                            <Badge variant="outline">{t('questionnaire.questions.applications.badges.lessEvidence')}</Badge>
                          )}
                          {app.offline === 'full' && (
                            <Badge variant="secondary">{t('questionnaire.questions.applications.badges.worksOffline')}</Badge>
                          )}
                          {app.network === 'needsInternet' && (
                            <Badge variant="outline">{t('questionnaire.questions.applications.badges.needsInternet')}</Badge>
                          )}
                        </div>
                        <span
                          className={cn(
                            "absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center",
                            enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {enabled && <Check className="h-4 w-4" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto flex gap-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="py-6 text-lg flex-1" size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('questionnaire.buttons.back')}
            </Button>
          )}
          <Button onClick={handleContinue} className="py-6 text-lg flex-1" size="lg">
            {t('questionnaire.questions.applications.continue')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationsReview;
