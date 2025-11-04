/**
 * Utilities for persisting and restoring survey state
 */

// Constants
const STORAGE_KEY = 'community-box-survey-state';

// Types
export interface SurveyState {
  currentStep: number;
  answers: Record<string, unknown>;
}

/**
 * Encode survey state to URL query parameters
 */
export const encodeStateToUrl = (state: SurveyState): string => {
  const { currentStep, answers } = state;

  // Create a new URLSearchParams object
  const params = new URLSearchParams();

  // Add current step
  params.append('step', currentStep.toString());

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

    const currentStep = parseInt(stepParam, 10);
    if (isNaN(currentStep)) return null;

    // Get answers
    const answers: Record<string, unknown> = {};

    // Iterate through all params except 'step'
    params.forEach((value, key) => {
      if (key === 'step') return;

      // Try to parse as JSON for object values
      try {
        answers[key] = JSON.parse(value);
      } catch (error) {
        // If not valid JSON, use as string
        answers[key] = value;
      }
    });

    return { currentStep, answers };
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

    return JSON.parse(storedState) as SurveyState;
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
