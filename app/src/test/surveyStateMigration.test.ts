import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  encodeStateToUrl,
  decodeStateFromUrl,
  loadStateFromStorage,
  saveStateToStorage,
  SURVEY_STATE_VERSION,
} from '@/utils/statePersistence';

const STORAGE_KEY = 'community-box-survey-state';

const stubLocation = (search: string) => {
  vi.stubGlobal('window', { location: { search, pathname: '/' } });
};

const stubLocalStorage = (initial?: string) => {
  const store = new Map<string, string>();
  if (initial !== undefined) store.set(STORAGE_KEY, initial);
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

describe('survey state version migration (URL)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps a legacy results step to the new results index', () => {
    // Version 1 had results at index 9; version 2 has it at index 11
    stubLocation('?step=9&electricity=yes');

    expect(decodeStateFromUrl()?.currentStep).toBe(11);
  });

  it('maps legacy steps around the techSupport insert point', () => {
    // Version 1 format (4) stays before techSupport; price (5) moves after it
    stubLocation('?step=4&format=yes');
    expect(decodeStateFromUrl()?.currentStep).toBe(5);

    stubLocation('?step=5&format=yes');
    expect(decodeStateFromUrl()?.currentStep).toBe(7);
  });

  it('maps a legacy step at the insert point to the shifted index', () => {
    stubLocation('?step=2&users=1-2');

    expect(decodeStateFromUrl()?.currentStep).toBe(3);
  });

  it('keeps a legacy step before the insert point', () => {
    stubLocation('?step=1&users=1-2');

    expect(decodeStateFromUrl()?.currentStep).toBe(1);
  });

  it('keeps a versioned step unchanged', () => {
    stubLocation('?step=9&v=2&mainUse=education');

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(9);
    expect(decoded?.version).toBe(SURVEY_STATE_VERSION);
    expect(decoded?.answers).toEqual({ mainUse: 'education' });
  });

  it('writes the version marker and does not leak it into answers', () => {
    const encoded = encodeStateToUrl({ currentStep: 9, answers: { mainUse: 'education' } });
    const params = new URLSearchParams(encoded);

    expect(params.get('v')).toBe(String(SURVEY_STATE_VERSION));

    stubLocation(`?${encoded}`);
    expect(decodeStateFromUrl()?.answers).toEqual({ mainUse: 'education' });
  });
});

describe('survey state version migration (localStorage)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps a legacy stored results step to the new results index', () => {
    stubLocalStorage(JSON.stringify({ currentStep: 9, answers: { mainUse: 'business' } }));

    const loaded = loadStateFromStorage();

    expect(loaded?.currentStep).toBe(11);
    expect(loaded?.answers).toEqual({ mainUse: 'business' });
  });

  it('keeps a legacy stored step before the insert point', () => {
    stubLocalStorage(JSON.stringify({ currentStep: 1, answers: {} }));

    expect(loadStateFromStorage()?.currentStep).toBe(1);
  });

  it('keeps a versioned stored step unchanged', () => {
    stubLocalStorage(JSON.stringify({ currentStep: 9, answers: {}, version: SURVEY_STATE_VERSION }));

    expect(loadStateFromStorage()?.currentStep).toBe(9);
  });

  it('saves with the version field so the next load is not migrated again', () => {
    stubLocalStorage();

    saveStateToStorage({ currentStep: 9, answers: {} });
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);

    expect(raw.version).toBe(SURVEY_STATE_VERSION);
    expect(loadStateFromStorage()?.currentStep).toBe(9);
  });
});
