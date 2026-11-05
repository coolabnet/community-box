/**
 * Utilities for persisting and restoring survey state
 */

import {
  GOALS,
  GOAL_ID_ALIASES,
  LEGACY_USAGE_TO_GOALS,
  type GoalKey,
} from '@/data/applications/categories';
import type { GoalSelectionValues, AppSelectionValues } from '@/types/questionnaire';

// Constants
const STORAGE_KEY = 'community-box-survey-state';

/**
 * State versions:
 * - 1 (no version saved): original flow.
 * - 2: inserted accessDevices (before v1 step 2) and techSupport (before v1 step 5).
 * - 3: inserted goals as step 0 and replaced usage with applications.
 */
export const SURVEY_STATE_VERSION = 3;
// Must match the length of `questions` in Questionnaire.tsx.
export const SURVEY_STEP_COUNT = 13;
const URL_VERSION_PARAM = 'v';

/**
 * Step indices (as numbered by that version) before which the NEXT version
 * inserted a step. A saved step shifts by one per insert at or before it.
 */
const INSERTS_BY_VERSION: Record<number, number[]> = {
  // v1 indices: accessDevices before growth (2), techSupport before price (5)
  1: [2, 5],
  // v2 index: goals inserted at the start
  2: [0],
};
const LAST_MIGRATED_VERSION = 2;

// Types
export interface SurveyState {
  currentStep: number;
  answers: Record<string, unknown>;
  version?: number;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Map a step saved by an older state version to the current step index
 */
const migrateStep = (step: number, version: number | undefined): number => {
  if (!Number.isFinite(step)) return 0;
  let migrated = step;
  for (let v = Math.max(version ?? 1, 1); v <= LAST_MIGRATED_VERSION; v++) {
    const before = migrated;
    migrated += (INSERTS_BY_VERSION[v] ?? []).filter(i => before >= i).length;
  }
  return Math.min(Math.max(Math.floor(migrated), 0), SURVEY_STEP_COUNT - 1);
};

/**
 * Derive goals from a legacy `usage` answer. Strict: only exact `true` values
 * and non-empty `other` text count. Leaves `usage` untouched.
 */
export const migrateAnswers = (
  answers: Record<string, unknown>,
  fromVersion: number | undefined
): Record<string, unknown> => {
  if ((fromVersion ?? 1) >= 3 || answers.goals !== undefined) return answers;
  const usage = answers.usage;
  if (!isPlainObject(usage)) return answers;

  const goals: GoalSelectionValues = {};
  let counted = false;
  for (const key of ['news', 'files', 'education', 'media'] as const) {
    if (usage[key] === true) {
      for (const goal of LEGACY_USAGE_TO_GOALS[key]) {
        goals[goal] = true;
        counted = true;
      }
    }
  }
  if (typeof usage.other === 'string' && usage.other.trim() !== '') {
    goals.other = usage.other.trim();
    counted = true;
  }
  return counted ? { ...answers, goals } : answers;
};

/**
 * Keep only valid goal selections. Returns undefined when nothing valid remains.
 */
export const sanitizeGoals = (
  value: unknown,
  aliases: Record<string, GoalKey> = GOAL_ID_ALIASES
): GoalSelectionValues | undefined => {
  if (!isPlainObject(value)) return undefined;
  const result: GoalSelectionValues = {};
  for (const [rawId, entry] of Object.entries(value)) {
    if (rawId === 'other') {
      if (typeof entry === 'string' && entry.trim() !== '') result.other = entry.trim();
      continue;
    }
    const id = Object.prototype.hasOwnProperty.call(aliases, rawId) ? aliases[rawId] : rawId;
    if (Object.prototype.hasOwnProperty.call(GOALS, id) && entry === true) {
      result[id as GoalKey] = true;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
};

const sanitizeApps = (value: unknown): AppSelectionValues | undefined => {
  if (!isPlainObject(value) || !Array.isArray(value.selected) || !Array.isArray(value.dismissed)) {
    return undefined;
  }
  const clean = (list: unknown[]): string[] => [
    ...new Set(list.filter((x): x is string => typeof x === 'string')),
  ];
  const selected = clean(value.selected);
  // An id in both lists is ambiguous: keep the explicit selection
  const dismissed = clean(value.dismissed).filter(id => !selected.includes(id));
  return { selected, dismissed };
};

const normalizeAnswers = (
  rawAnswers: Record<string, unknown>,
  version: number | undefined
): Record<string, unknown> => {
  const answers = { ...migrateAnswers(rawAnswers, version) };
  if ('goals' in answers) {
    const goals = sanitizeGoals(answers.goals);
    if (goals) answers.goals = goals;
    else delete answers.goals;
  }
  if ('apps' in answers) {
    const apps = sanitizeApps(answers.apps);
    if (apps) answers.apps = apps;
    else delete answers.apps;
  }
  return answers;
};

/**
 * Encode survey state to URL query parameters
 */
export const encodeStateToUrl = (state: SurveyState): string => {
  const { currentStep, answers } = state;

  // Create a new URLSearchParams object
  const params = new URLSearchParams();

  // Add current step and state version
  params.append('step', currentStep.toString());
  params.append(URL_VERSION_PARAM, SURVEY_STATE_VERSION.toString());

  // Add answers
  Object.entries(answers).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (typeof value === 'object' && value !== null) {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

/**
 * Decode survey state from URL query parameters
 */
export const decodeStateFromUrl = (): SurveyState | null => {
  try {
    // Get URL search params
    const params = new URLSearchParams(window.location.search);

    // Get current step
    const stepParam = params.get('step');
    if (!stepParam) return null;

    const rawStep = parseInt(stepParam, 10);
    if (isNaN(rawStep)) return null;

    // URLs saved before versioning have no 'v' parameter
    const versionParam = params.get(URL_VERSION_PARAM);
    const parsedVersion = versionParam === null ? NaN : parseInt(versionParam, 10);
    const version = isNaN(parsedVersion) ? undefined : parsedVersion;
    const currentStep = migrateStep(rawStep, version);

    // Get answers
    const answers: Record<string, unknown> = {};

    // Iterate through all params except 'step' and the version marker
    params.forEach((value, key) => {
      if (key === 'step' || key === URL_VERSION_PARAM) return;

      // Try to parse as JSON for object values
      try {
        answers[key] = JSON.parse(value);
      } catch (error) {
        // If not valid JSON, use as string
        answers[key] = value;
      }
    });

    return {
      currentStep,
      answers: normalizeAnswers(answers, version),
      version: SURVEY_STATE_VERSION,
    };
  } catch (error) {
    console.error('Error decoding state from URL:', error);
    return null;
  }
};

/**
 * Save survey state to localStorage
 */
export const saveStateToStorage = (state: SurveyState): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, version: SURVEY_STATE_VERSION })
    );
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

/**
 * Load survey state from localStorage
 */
export const loadStateFromStorage = (): SurveyState | null => {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (!storedState) return null;

    const parsed = JSON.parse(storedState) as SurveyState;
    const version = typeof parsed.version === 'number' ? parsed.version : undefined;

    return {
      currentStep: migrateStep(parsed.currentStep, version),
      answers: isPlainObject(parsed.answers) ? normalizeAnswers(parsed.answers, version) : parsed.answers,
      version: SURVEY_STATE_VERSION,
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return null;
  }
};

/**
 * Clear survey state from localStorage
 */
export const clearStoredState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing state from localStorage:', error);
  }
};

/**
 * Update URL with current state without reloading the page
 */
export const updateUrlWithState = (state: SurveyState): void => {
  const url = `${window.location.pathname}?${encodeStateToUrl(state)}`;
  window.history.replaceState({}, '', url);
};

/**
 * Copy current URL to clipboard
 */
export const copyUrlToClipboard = async (): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch (error) {
    console.error('Error copying URL to clipboard:', error);
    return false;
  }
};

/**
 * Share URL using Web Share API
 */
export const shareUrl = async (title: string, text: string): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url: window.location.href,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sharing URL:', error);
    return false;
  }
};
