/**
 * Utilities for persisting and restoring survey state
 */

// Constants
const STORAGE_KEY = 'community-box-survey-state';

/**
 * Version 2 inserted the accessDevices and techSupport questions before the
 * version 1 steps listed in LEGACY_INSERT_STEPS. State without a version was
 * saved by version 1, so each of its steps shifts by one per insert at or
 * before it.
 */
export const SURVEY_STATE_VERSION = 2;
export const ACCESS_DEVICES_STEP = 2;
// Version 1 indices: accessDevices before growth (2), techSupport before price (5)
const LEGACY_INSERT_STEPS = [ACCESS_DEVICES_STEP, 5];
const URL_VERSION_PARAM = 'v';

// Types
export interface SurveyState {
  currentStep: number;
  answers: Record<string, unknown>;
  version?: number;
}

/**
 * Map a step saved by an older state version to the current step index
 */
const migrateStep = (step: number, version: number | undefined): number =>
  version === undefined
    ? step + LEGACY_INSERT_STEPS.filter(insertStep => step >= insertStep).length
    : step;

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

    return { currentStep, answers, version: SURVEY_STATE_VERSION };
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
      answers: parsed.answers,
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
