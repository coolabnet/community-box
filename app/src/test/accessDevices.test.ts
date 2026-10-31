import { describe, it, expect, vi, afterEach } from 'vitest';
import { normalizeUserAnswers, calculateDeviceScores } from '@/utils/deviceScoring';
import { getRecommendations } from '@/utils/recommendations';
import {
  encodeStateToUrl,
  decodeStateFromUrl,
  saveStateToStorage,
  loadStateFromStorage,
} from '@/utils/statePersistence';
import type { UserAnswers } from '@/types/questionnaire';

const baseAnswers: UserAnswers = {
  electricity: 'sometimes',
  users: '3-5',
  growth: 'medium',
  reuse: 'yes',
  format: 'maybe',
  price: 'low',
  points: { easyToUse: 20, lowPower: 10, scalable: 30, lowCost: 40 },
  usage: { files: true, education: true },
  mainUse: 'education',
};

const withDevices: UserAnswers = {
  ...baseAnswers,
  accessDevices: { smartphones: true, shared: true },
};

const scoreFor = (answers: UserAnswers) => {
  const scores = calculateDeviceScores(answers, normalizeUserAnswers(answers));
  const recommendations = getRecommendations(
    answers.usage,
    answers.mainUse,
    answers.format,
    scores[0]?.device?.key
  );
  return { scores, recommendations };
};

describe('accessDevices does not affect scoring', () => {
  it('normalizes answers identically with and without accessDevices', () => {
    expect(normalizeUserAnswers(withDevices)).toEqual(normalizeUserAnswers(baseAnswers));
  });

  it('returns identical device scores and recommendations with and without accessDevices', () => {
    expect(scoreFor(withDevices)).toEqual(scoreFor(baseAnswers));
  });
});

describe('accessDevices state persistence', () => {
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    }
    if (originalLocalStorage === undefined) {
      delete (globalThis as { localStorage?: unknown }).localStorage;
    }
  });

  const stubLocation = (search: string) => {
    vi.stubGlobal('window', { location: { search, pathname: '/' } });
  };

  const stubLocalStorage = () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    });
  };

  it('round-trips accessDevices through the URL', () => {
    const encoded = encodeStateToUrl({ currentStep: 2, answers: withDevices });
    stubLocation(`?${encoded}`);

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(2);
    expect(decoded?.answers.accessDevices).toEqual({ smartphones: true, shared: true });
    expect(decoded?.answers.usage).toEqual(baseAnswers.usage);
  });

  it('still decodes old URLs that have no accessDevices', () => {
    const encoded = encodeStateToUrl({ currentStep: 3, answers: baseAnswers });
    stubLocation(`?${encoded}`);

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(3);
    expect(decoded?.answers).not.toHaveProperty('accessDevices');
    expect(decoded?.answers.usage).toEqual(baseAnswers.usage);
  });

  it('round-trips accessDevices through localStorage, with and without it', () => {
    stubLocalStorage();

    saveStateToStorage({ currentStep: 1, answers: withDevices });
    expect(loadStateFromStorage()?.answers.accessDevices).toEqual({ smartphones: true, shared: true });

    saveStateToStorage({ currentStep: 1, answers: baseAnswers });
    expect(loadStateFromStorage()?.answers).not.toHaveProperty('accessDevices');
  });
});
