// Decides which applications the results page lists.
import { getRecommendations } from '@/utils/recommendations';
import { resolveSelectedApps } from '@/utils/applications';
import type { ApplicationEntry } from '@/data/applications/schema';
import type { DeviceKey, Requirements, ResourceLink, UserAnswers } from '@/types/questionnaire';

export interface ResultApplication {
  id: string;
  // Locale key prefix; the card reads `<i18nKey>.name` and `<i18nKey>.description`.
  i18nKey: string;
  icon: string;
  links?: ResourceLink[];
  requirements?: Requirements;
  // Badge fields for the results cards (goals flow only; legacy leaves them undefined).
  offline?: ApplicationEntry['offline'];
  network?: ApplicationEntry['network'];
  status?: ApplicationEntry['status'];
}

const LEGACY_ITEM_KEY_PREFIX = 'questionnaire.questions.results.services.items';

// Shared projection for goals-flow apps (the results card and the pipeline use it).
export const toResultApplication = (app: ApplicationEntry): ResultApplication => ({
  id: app.id,
  i18nKey: app.i18nKey,
  icon: app.icon,
  ...(app.links ? { links: app.links } : {}),
  offline: app.offline,
  network: app.network,
  status: app.status,
});

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
    return resolveSelectedApps(answers.goals, answers.apps).map(toResultApplication);
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
