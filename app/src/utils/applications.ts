// Pure compatibility and capacity logic for the applications layer (M4, PR2).
// No React and no zod: the catalog JSON is cast to `ApplicationEntry[]` as in recommendations.ts.
import applicationsData from '@/data/applications/applications.json';
import type { ApplicationEntry } from '@/data/applications/schema';
import { GOALS, type GoalKey } from '@/data/applications/categories';
import { hardwareCapacity } from '@/data/hardwareCapacity';
import type { DeviceFit, DeviceKey, DeviceScore, OSSuggestion, UsersAnswer } from '@/types/questionnaire';

export type Architecture = ApplicationEntry['architectures'][number];
export type Confidence = ApplicationEntry['resources']['confidence'];

export const catalog = applicationsData as ApplicationEntry[];

// Estimates pending owner sign-off (H4 in research/plans/m4-applications-layer.md).
export const MAX_CANDIDATES_PER_GOAL = 3;
export const OS_BASE_RAM_MB = 1024;
export const RECOMMENDED_RAM_FACTOR = 1.5;
export const RAM_STEPS_GB = [2, 4, 8, 16, 32, 64] as const;
// Number of "per 25 users" blocks for each users band. The keys predate the
// community-size bands: '1-2' = up to 25, '3-5' = 25–100, '6+' = more than 100
// (assumed about 200).
export const USERS_BAND_MULTIPLIER: Record<UsersAnswer, number> = {
  '1-2': 1,
  '3-5': 4,
  '6+': 8,
};
const DEFAULT_USERS_BAND: UsersAnswer = '3-5';

// ---------- candidates ----------

export interface CandidateApp {
  app: ApplicationEntry;
  matchedGoals: GoalKey[];
}

const STATUS_RANK: Record<ApplicationEntry['status'], number> = { recommended: 0, candidate: 1 };
const MAINTENANCE_RANK: Record<ApplicationEntry['maintenance'], number> = {
  low: 0,
  medium: 1,
  high: 2,
  unknown: 3,
};

const compareCandidates = (a: CandidateApp, b: CandidateApp): number =>
  STATUS_RANK[a.app.status] - STATUS_RANK[b.app.status] ||
  b.matchedGoals.length - a.matchedGoals.length ||
  MAINTENANCE_RANK[a.app.maintenance] - MAINTENANCE_RANK[b.app.maintenance] ||
  a.app.id.localeCompare(b.app.id);

export const getCandidateApps = (
  goals: readonly GoalKey[],
  apps: readonly ApplicationEntry[] = catalog
): CandidateApp[] => {
  const uniqueGoals = [...new Set(goals)].filter(g => Object.prototype.hasOwnProperty.call(GOALS, g));
  if (uniqueGoals.length === 0) return [];

  const all: CandidateApp[] = apps
    .map(app => ({
      app,
      matchedGoals: uniqueGoals.filter(g => GOALS[g].some(c => (app.categories as string[]).includes(c))),
    }))
    .filter(c => c.matchedGoals.length > 0);

  const kept = new Set<string>();
  for (const goal of uniqueGoals) {
    all
      .filter(c => c.matchedGoals.includes(goal))
      .sort(compareCandidates)
      .slice(0, MAX_CANDIDATES_PER_GOAL)
      .forEach(c => kept.add(c.app.id));
  }
  return all.filter(c => kept.has(c.app.id)).sort(compareCandidates);
};

// ---------- compatibility ----------

export type IncompatibilityReason = 'architectureUnsupported' | 'platformUnsupported';
export type CompatibilityWarning = 'architectureUnknown' | 'platformUnknown' | 'needsInternet';

export interface CompatibilityResult {
  ok: boolean;
  reasons: IncompatibilityReason[];
  warnings: CompatibilityWarning[];
}

export const checkCompatibility = (
  app: ApplicationEntry,
  device: DeviceKey,
  os?: Pick<OSSuggestion, 'platforms'>
): CompatibilityResult => {
  const reasons: IncompatibilityReason[] = [];
  const warnings: CompatibilityWarning[] = [];

  if (app.architectures.length === 0) {
    warnings.push('architectureUnknown');
  } else if (!app.architectures.includes(hardwareCapacity[device].architecture)) {
    reasons.push('architectureUnsupported');
  }

  if (os) {
    const osPlatforms = os.platforms ?? [];
    if (app.platforms.length === 0 || osPlatforms.length === 0) {
      warnings.push('platformUnknown');
    } else if (!app.platforms.some(p => osPlatforms.includes(p))) {
      reasons.push('platformUnsupported');
    }
  }

  if (app.network === 'needsInternet') warnings.push('needsInternet');

  return { ok: reasons.length === 0, reasons, warnings };
};

// ---------- capacity ----------

export interface Capacity {
  minRamGb: number;
  recommendedRamGb: number;
  minStorageGb: number;
  // Architectures every app with known architectures supports; empty = no constraint known.
  architectures: Architecture[];
  confidence: Confidence;
}

const CONFIDENCE_RANK: Record<Confidence, number> = { unknown: 0, estimated: 1, documented: 2 };

export const roundUpRamGb = (gb: number): number =>
  RAM_STEPS_GB.find(step => step >= gb) ?? Math.ceil(gb);

export const computeCapacity = (
  apps: readonly ApplicationEntry[],
  usersBand: UsersAnswer = DEFAULT_USERS_BAND
): Capacity => {
  const multiplier = USERS_BAND_MULTIPLIER[usersBand] ?? USERS_BAND_MULTIPLIER[DEFAULT_USERS_BAND];

  let ramMb = OS_BASE_RAM_MB;
  let storageGb = 0;
  // No apps = nothing documented: only the OS base estimate is known.
  let confidence: Confidence = apps.length === 0 ? 'unknown' : 'documented';

  for (const app of apps) {
    const { ramMb: appRam, ramMbPer25Users, storageGb: appStorage } = app.resources;
    if (appRam === undefined) confidence = 'unknown';
    ramMb += (appRam ?? 0) + (ramMbPer25Users ?? 0) * multiplier;
    storageGb += appStorage ?? 0;
    if (CONFIDENCE_RANK[app.resources.confidence] < CONFIDENCE_RANK[confidence]) {
      confidence = app.resources.confidence;
    }
  }

  const knownArchs = apps.filter(a => a.architectures.length > 0);
  const architectures = knownArchs.length === 0
    ? []
    : knownArchs
        .map(a => a.architectures)
        .reduce((acc, archs) => acc.filter(x => archs.includes(x)));

  const minRamGb = Math.round((ramMb / 1024) * 100) / 100;
  return {
    minRamGb,
    recommendedRamGb: roundUpRamGb(minRamGb * RECOMMENDED_RAM_FACTOR),
    minStorageGb: storageGb,
    architectures,
    confidence,
  };
};

// `apps` is required: architecture fit needs each selected app, because an
// empty Capacity.architectures can mean "unknown" or "no common architecture".
export const applyCapacity = (
  scores: readonly DeviceScore[],
  capacity: Capacity,
  apps: readonly ApplicationEntry[]
): DeviceScore[] => {
  const annotated = scores.map((score): DeviceScore => {
    const hw = hardwareCapacity[score.device.key];
    const reasons: NonNullable<DeviceScore['fitReasons']> = [];

    if (hw.maxRamGb < capacity.minRamGb) reasons.push('insufficientRam');
    if (apps.some(a => a.architectures.length > 0 && !a.architectures.includes(hw.architecture))) {
      reasons.push('architectureMismatch');
    }
    if (reasons.length > 0) return { ...score, fit: 'insufficient', fitReasons: reasons };

    // Aim for the recommended RAM; when no variant reaches it, the minimum.
    const belowRecommended = capacity.recommendedRamGb > hw.maxRamGb;
    const neededGb = belowRecommended ? capacity.minRamGb : capacity.recommendedRamGb;
    const fitReasons: NonNullable<DeviceScore['fitReasons']> = [];
    let fit: DeviceFit = 'ok';
    let suggestedRamGb: number | undefined;
    if (Math.min(...hw.ramGbOptions) < neededGb) {
      fit = 'chooseVariant';
      fitReasons.push('chooseRamVariant');
      suggestedRamGb = [...hw.ramGbOptions].sort((a, b) => a - b).find(gb => gb >= neededGb) ?? hw.maxRamGb;
    }
    if (belowRecommended) fitReasons.push('belowRecommendedRam');
    return { ...score, fit, fitReasons, ...(suggestedRamGb !== undefined ? { suggestedRamGb } : {}) };
  });

  if (annotated.every(s => s.fit === 'insufficient')) return annotated;
  return [
    ...annotated.filter(s => s.fit !== 'insufficient'),
    ...annotated.filter(s => s.fit === 'insufficient'),
  ];
};
