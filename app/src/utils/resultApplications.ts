// Decides which applications the results page lists.
import { getRecommendations } from '@/utils/recommendations';
import { resolveSelectedApps } from '@/utils/applications';
import type { DeviceKey, Requirements, ResourceLink, UserAnswers } from '@/types/questionnaire';

export interface ResultApplication {
  id: string;
  // Locale key prefix; the card reads `<i18nKey>.name` and `<i18nKey>.description`.
  i18nKey: string;
  icon: string;
  links?: ResourceLink[];
  requirements?: Requirements;
}

const LEGACY_ITEM_KEY_PREFIX = 'questionnaire.questions.results.services.items';

/**
 * List the apps the user reviewed. Answers that never reached the review step
 * (no `apps`, for example links saved before v3) keep the legacy usage-based
 * suggestions, so old result links do not change without a review.
 */
export const getResultApplications = (
  answers: UserAnswers,
  topDeviceKey?: DeviceKey
): ResultApplication[] => {
  if (answers.goals && answers.apps) {
    return resolveSelectedApps(answers.goals, answers.apps).map(app => ({
      id: app.id,
      i18nKey: app.i18nKey,
      icon: app.icon,
      ...(app.links ? { links: app.links } : {}),
    }));
  }
  return getRecommendations(answers.usage, answers.mainUse, answers.format, topDeviceKey).services.map(
    service => ({
      id: service.key,
      i18nKey: `${LEGACY_ITEM_KEY_PREFIX}.${service.key}`,
      icon: service.icon,
      ...(service.links ? { links: service.links } : {}),
      ...(service.requirements ? { requirements: service.requirements } : {}),
    })
  );
};
