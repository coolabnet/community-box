// Pure decision layer for the results page (M4, PR5). The component renders
// this module's output; no React and no i18n here so tests stay node-only.
import { getRecommendations } from '@/utils/recommendations';
import {
  toResultApplication,
  getResultApplications,
  type ResultApplication,
} from '@/utils/resultApplications';
import {
  applyCapacity,
  checkCompatibility,
  computeCapacity,
  resolveSelectedApps,
  type Capacity,
  type IncompatibilityReason,
} from '@/utils/applications';
import { normalizeUserAnswers, calculateDeviceScores } from '@/utils/deviceScoring';
import type { ApplicationEntry } from '@/data/applications/schema';
import type {
  DeviceFitReason,
  DeviceKey,
  DeviceScore,
  OSSuggestion,
  UserAnswers,
} from '@/types/questionnaire';

export interface IncompatibleApplication {
  application: ResultApplication;
  reasons: IncompatibilityReason[];
}

export interface RecommendationPipelineResult {
  // applyCapacity-annotated in the goals flow; raw otherwise
  deviceScores: DeviceScore[];
  // Goals flow only
  capacity?: Capacity;
  // First non-insufficient score, else scores[0]?.device.key
  topDeviceKey?: DeviceKey;
  // Compatible apps (goals flow) or the full legacy list
  applications: ResultApplication[];
  // Goals flow only
  incompatible: IncompatibleApplication[];
  // Compatible apps we could not fully check (unknown architecture or platforms).
  unverified: ResultApplication[];
  // Goals flow and any recommended OS lacks platforms data.
  osPlatformsIncomplete: boolean;
  operatingSystems: OSSuggestion[];
}

/**
 * Fit reasons safe to show. `belowRecommendedRam` claims the apps' documented
 * needs are met with room to spare, so under unknown confidence it is a guess;
 * `chooseRamVariant` stays (the copy is hedged instead) and the architecture
 * reasons are data-backed either way.
 */
export const visibleFitReasons = (
  score: DeviceScore,
  capacity?: Capacity
): DeviceFitReason[] => {
  const reasons = score.fitReasons ?? [];
  if (capacity?.confidence === 'unknown') {
    return reasons.filter(r => r !== 'belowRecommendedRam');
  }
  return reasons;
};

/**
 * Split the selected apps into compatible and incompatible for a device.
 * `architectureUnsupported` excludes immediately. `platformUnsupported`
 * excludes only when the OS list is non-empty and every OS in it has known,
 * non-empty platforms that all reject the app; a single OS with unknown or
 * empty platforms keeps the app (warn, never exclude).
 */
export const partitionByCompatibility = (
  apps: readonly ApplicationEntry[],
  deviceKey: DeviceKey,
  osList: readonly Pick<OSSuggestion, 'platforms'>[]
): { compatible: ApplicationEntry[]; incompatible: IncompatibleApplication[] } => {
  const compatible: ApplicationEntry[] = [];
  const incompatible: IncompatibleApplication[] = [];
  const allPlatformsKnown =
    osList.length > 0 && osList.every(os => (os.platforms ?? []).length > 0);

  for (const app of apps) {
    const reasons: IncompatibilityReason[] = [...checkCompatibility(app, deviceKey).reasons];
    if (reasons.length === 0 && allPlatformsKnown) {
      const noOsCanHost = osList.every(os =>
        checkCompatibility(app, deviceKey, os).reasons.includes('platformUnsupported')
      );
      if (noOsCanHost) reasons.push('platformUnsupported');
    }
    if (reasons.length > 0) incompatible.push({ application: toResultApplication(app), reasons });
    else compatible.push(app);
  }
  return { compatible, incompatible };
};

/**
 * One call for the results page. Goals flow (`answers.goals && answers.apps`,
 * the same gate as getResultApplications) annotates device scores with capacity
 * fit and splits applications by compatibility; legacy answers keep exactly the
 * pre-v3 behavior.
 */
export const buildRecommendation = (answers: UserAnswers): RecommendationPipelineResult => {
  const normalized = normalizeUserAnswers(answers);
  const scores = calculateDeviceScores(answers, normalized);

  if (!(answers.goals && answers.apps)) {
    const legacyTop = scores[0]?.device?.key;
    return {
      deviceScores: scores,
      topDeviceKey: legacyTop,
      applications: getResultApplications(answers, legacyTop),
      incompatible: [],
      unverified: [],
      osPlatformsIncomplete: false,
      operatingSystems: getRecommendations(
        answers.usage,
        answers.mainUse,
        answers.format,
        legacyTop
      ).operatingSystems,
    };
  }

  const resolved = resolveSelectedApps(answers.goals, answers.apps);
  // Missing `users` falls back to the helper's default band.
  const capacity = computeCapacity(resolved, answers.users);
  const annotated = applyCapacity(scores, capacity, resolved);
  const topFit = annotated.find(s => s.fit !== 'insufficient') ?? annotated[0];
  const topDeviceKey = topFit?.device.key;
  const operatingSystems = getRecommendations(
    answers.usage,
    answers.mainUse,
    answers.format,
    topDeviceKey
  ).operatingSystems;
  const { compatible, incompatible } = topDeviceKey
    ? partitionByCompatibility(resolved, topDeviceKey, operatingSystems)
    : { compatible: resolved, incompatible: [] };

  // Apps we could not fully check: unknown architecture, or unknown platforms
  // against an OS that does list its platforms (until the OS entries carry
  // platforms data, a platform check against them says nothing — that warning
  // would flag every app, so it does not count). needsInternet is a badge, not
  // uncertainty about compatibility.
  const unverified = topDeviceKey
    ? compatible
        .filter(app => {
          if (checkCompatibility(app, topDeviceKey).warnings.includes('architectureUnknown')) return true;
          return operatingSystems.some(
            os =>
              (os.platforms ?? []).length > 0 &&
              checkCompatibility(app, topDeviceKey, os).warnings.includes('platformUnknown')
          );
        })
        .map(toResultApplication)
    : [];

  return {
    deviceScores: annotated,
    capacity,
    topDeviceKey,
    applications: compatible.map(toResultApplication),
    incompatible,
    unverified,
    osPlatformsIncomplete: operatingSystems.some(os => (os.platforms ?? []).length === 0),
    operatingSystems,
  };
};
