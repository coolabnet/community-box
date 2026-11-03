import type { ReactNode } from 'react';
import type { GoalKey } from '@/data/applications/categories';

export type PriorityKey = 'easyToUse' | 'lowPower' | 'language' | 'scalable' | 'lowCost';
export type UsageKey = 'news' | 'files' | 'education' | 'media' | 'other';
export type AccessDeviceKey = 'smartphones' | 'laptops' | 'desktops' | 'shared';
export type DeviceKey = 'raspberryPi' | 'zimaBoard' | 'intelNUC' | 'reusedPC';
export type AttributeKey = 'energy' | 'concurrency' | 'growth' | 'reusable' | 'formatEase' | 'cost';

export type PriorityAllocation = Partial<Record<PriorityKey, number>>;
export type UsageSelectionValues = Partial<Record<UsageKey, true | string>>;
export type GoalSelectionValues = Partial<Record<GoalKey, true>> & { other?: string };
export type AppSelectionValues = { selected: string[]; dismissed: string[] };
export type AccessDeviceValues = Partial<Record<AccessDeviceKey, true>>;

export interface DeviceAttributes {
  key: DeviceKey;
  name: string;
  energy: number;
  concurrency: number;
  growth: number;
  reusable: number;
  formatEase: number;
  cost: number;
  icon: ReactNode;
}

export interface DeviceScore {
  device: DeviceAttributes;
  score: number;
  matchPercentage: number;
  strengths: AttributeKey[];
  // Set by applyCapacity (utils/applications.ts); absent until capacity is applied.
  fit?: DeviceFit;
  fitReasons?: DeviceFitReason[];
  // RAM size to pick when fit is 'chooseVariant'.
  suggestedRamGb?: number;
}

export type DeviceFit = 'ok' | 'chooseVariant' | 'insufficient';
export type DeviceFitReason = 'insufficientRam' | 'architectureMismatch' | 'chooseRamVariant' | 'belowRecommendedRam';

export type ElectricityAnswer = 'yes' | 'sometimes' | 'no';
export type UsersAnswer = '1-2' | '3-5' | '6+';
export type GrowthAnswer = 'low' | 'medium' | 'high' | 'notSure';
export type ReuseAnswer = 'yes' | 'no';
export type FormatAnswer = 'yes' | 'maybe' | 'no';
export type TechSupportAnswer = 'community' | 'external' | 'no';
export type PriceAnswer = 'low' | 'medium' | 'high';
export type MainUseAnswer = 'education' | 'business' | 'personal';

export type ServiceKey = 'nextcloud' | 'jellyfin' | 'moodle' | 'wordpress' | 'kiwix' | 'ubuntumm';
export type OSKey =
  | 'ubuntuServer'
  | 'debian'
  | 'raspbian'
  | 'truenas'
  | 'openmediavault'
  | 'butterbox'
  | 'proxmox';

export type ResourceLinkKind = 'website' | 'docs' | 'guide' | 'source' | 'download';

export interface ResourceLink {
  kind: ResourceLinkKind;
  url: string;
}

export type Architecture = 'amd64' | 'arm64' | 'armhf';

export interface Requirements {
  minRamGb?: number;
  minStorageGb?: number;
  architectures?: Architecture[];
  needsInternet?: boolean;
}

export interface ServiceSuggestion {
  key: ServiceKey;
  name: string;
  description: string;
  category: string[];
  icon: string;
  links?: ResourceLink[];
  requirements?: Requirements;
}

export interface OSSuggestion {
  key: OSKey;
  name: string;
  description: string;
  recommendedFor: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  supportedHardware?: DeviceKey[];
  // Application platforms this OS can host. Omitted = unknown (compatibility warns, never excludes).
  platforms?: AppPlatform[];
  links?: ResourceLink[];
  requirements?: Requirements;
}

export type AppPlatform = 'docker' | 'yunohost' | 'casaos' | 'caprover' | 'native' | 'bundled';

export interface Recommendations {
  deviceScores: DeviceScore[];
  services: ServiceSuggestion[];
  operatingSystems: OSSuggestion[];
}

export interface UserAnswers {
  electricity?: ElectricityAnswer;
  users?: UsersAnswer;
  growth?: GrowthAnswer;
  reuse?: ReuseAnswer;
  format?: FormatAnswer;
  techSupport?: TechSupportAnswer;
  price?: PriceAnswer;
  points?: PriorityAllocation;
  usage?: UsageSelectionValues;
  goals?: GoalSelectionValues;
  apps?: AppSelectionValues;
  accessDevices?: AccessDeviceValues;
  mainUse?: MainUseAnswer;
  [key: string]: unknown;
}
