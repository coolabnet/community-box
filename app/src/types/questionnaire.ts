import type { ReactNode } from 'react';

export type PriorityKey = 'easyToUse' | 'lowPower' | 'language' | 'scalable' | 'lowCost';
export type UsageKey = 'news' | 'files' | 'education' | 'media' | 'other';
export type DeviceKey = 'raspberryPi' | 'zimaBoard' | 'intelNUC' | 'reusedPC';
export type AttributeKey = 'energy' | 'concurrency' | 'growth' | 'reusable' | 'formatEase' | 'cost';

export type PriorityAllocation = Partial<Record<PriorityKey, number>>;
export type UsageSelectionValues = Partial<Record<UsageKey, true | string>>;

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
}

export type ElectricityAnswer = 'yes' | 'sometimes' | 'no';
export type UsersAnswer = '1-2' | '3-5' | '6+';
export type GrowthAnswer = 'low' | 'medium' | 'high';
export type ReuseAnswer = 'yes' | 'no';
export type FormatAnswer = 'yes' | 'maybe' | 'no';
export type PriceAnswer = 'low' | 'medium' | 'high';
export type MainUseAnswer = 'education' | 'business' | 'personal';

export interface UserAnswers {
  electricity?: ElectricityAnswer;
  users?: UsersAnswer;
  growth?: GrowthAnswer;
  reuse?: ReuseAnswer;
  format?: FormatAnswer;
  price?: PriceAnswer;
  points?: PriorityAllocation;
  usage?: UsageSelectionValues;
  mainUse?: MainUseAnswer;
  [key: string]: unknown;
}
