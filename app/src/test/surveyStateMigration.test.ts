import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  encodeStateToUrl,
  decodeStateFromUrl,
  loadStateFromStorage,
  saveStateToStorage,
  SURVEY_STATE_VERSION,
  sanitizeGoals,
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
    // Version 1 had results at index 9; version 3 has it at index 12
    stubLocation('?step=9&electricity=yes');

    expect(decodeStateFromUrl()?.currentStep).toBe(12);
  });

  it('maps legacy steps around the techSupport insert point', () => {
    // Version 1 format (4) stays before techSupport; price (5) moves after it
    stubLocation('?step=4&format=yes');
    expect(decodeStateFromUrl()?.currentStep).toBe(6);

    stubLocation('?step=5&format=yes');
    expect(decodeStateFromUrl()?.currentStep).toBe(8);
  });

  it('maps a legacy step at the insert point to the shifted index', () => {
    stubLocation('?step=2&users=1-2');

    expect(decodeStateFromUrl()?.currentStep).toBe(4);
  });

  it('shifts a legacy step before the insert point only by the goals step', () => {
    stubLocation('?step=1&users=1-2');

    expect(decodeStateFromUrl()?.currentStep).toBe(2);
  });

  it('keeps a current-version step unchanged', () => {
    stubLocation('?step=9&v=3&mainUse=education');

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(9);
    expect(decoded?.version).toBe(SURVEY_STATE_VERSION);
    expect(decoded?.answers).toEqual({ mainUse: 'education' });
  });

  it('shifts version 2 steps by one for the goals step', () => {
    stubLocation('?step=0&v=2');
    expect(decodeStateFromUrl()?.currentStep).toBe(1);

    stubLocation('?step=11&v=2');
    expect(decodeStateFromUrl()?.currentStep).toBe(12);
  });

  it('moves the version 2 usage step to applications and derives goals', () => {
    const usage = encodeURIComponent(JSON.stringify({ news: true, media: true, other: 'radio' }));
    stubLocation(`?step=9&v=2&usage=${usage}`);

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(10);
    expect(decoded?.answers.goals).toEqual({ localMedia: true, mediaStorage: true, other: 'radio' });
    expect(decoded?.answers.usage).toEqual({ news: true, media: true, other: 'radio' });
  });

  it('does not migrate answers of a current-version URL', () => {
    const usage = encodeURIComponent(JSON.stringify({ news: true }));
    stubLocation(`?step=0&v=3&usage=${usage}`);

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(0);
    expect(decoded?.answers.goals).toBeUndefined();
  });

  it('does not create goals for a version 2 state without usage', () => {
    stubLocation('?step=4&v=2&electricity=yes');

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(5);
    expect(decoded?.answers.goals).toBeUndefined();
  });

  it('floors a fractional stored step and rejects a non-numeric URL step', () => {
    stubLocalStorage(JSON.stringify({ currentStep: 1.5, answers: {}, version: 3 }));
    expect(loadStateFromStorage()?.currentStep).toBe(1);

    stubLocation('?step=abc&v=3');
    expect(decodeStateFromUrl()).toBeNull();
  });

  it('clamps out-of-range steps', () => {
    stubLocation('?step=99&v=3');
    expect(decodeStateFromUrl()?.currentStep).toBe(12);

    stubLocation('?step=-4&v=3');
    expect(decodeStateFromUrl()?.currentStep).toBe(0);
  });

  it('drops invalid goals and apps from a URL', () => {
    const goals = encodeURIComponent(JSON.stringify({ education: true, bogus: true, media: 'yes' }));
    const apps = encodeURIComponent(JSON.stringify({ selected: 'x', dismissed: [] }));
    stubLocation(`?step=1&v=3&goals=${goals}&apps=${apps}`);

    const decoded = decodeStateFromUrl();

    expect(decoded?.answers.goals).toEqual({ education: true });
    expect(decoded?.answers.apps).toBeUndefined();
  });

  it('sanitizeGoals maps aliases, drops unknown ids and returns undefined when empty', () => {
    const aliases = { oldEducation: 'education' } as const;

    expect(sanitizeGoals({ oldEducation: true, nope: true, other: ' radio ' }, aliases)).toEqual({
      education: true,
      other: 'radio',
    });
    expect(sanitizeGoals({ nope: true, education: 'yes', other: '  ' }, aliases)).toBeUndefined();
    expect(sanitizeGoals([], aliases)).toBeUndefined();
    expect(sanitizeGoals('education', aliases)).toBeUndefined();
  });

  it('round-trips goals and apps through the URL', () => {
    const answers = {
      goals: { education: true as const, other: 'radio' },
      apps: { selected: ['kolibri'], dismissed: ['moodle'] },
    };
    const encoded = encodeStateToUrl({ currentStep: 10, answers });
    stubLocation(`?${encoded}`);

    const decoded = decodeStateFromUrl();

    expect(decoded?.currentStep).toBe(10);
    expect(decoded?.answers).toEqual(answers);
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

    expect(loaded?.currentStep).toBe(12);
    expect(loaded?.answers).toEqual({ mainUse: 'business' });
  });

  it('shifts a legacy stored step before the insert point only by the goals step', () => {
    stubLocalStorage(JSON.stringify({ currentStep: 1, answers: {} }));

    expect(loadStateFromStorage()?.currentStep).toBe(2);
  });

  it('keeps a current-version stored step unchanged', () => {
    stubLocalStorage(JSON.stringify({ currentStep: 9, answers: {}, version: SURVEY_STATE_VERSION }));

    expect(loadStateFromStorage()?.currentStep).toBe(9);
  });

  it('migrates a version 2 stored state to version 3 (step and goals)', () => {
    stubLocalStorage(
      JSON.stringify({ currentStep: 9, answers: { usage: { files: true } }, version: 2 })
    );

    const loaded = loadStateFromStorage();

    expect(loaded?.currentStep).toBe(10);
    expect(loaded?.answers.goals).toEqual({ mediaStorage: true });
    expect(loaded?.version).toBe(3);
  });

  it('saves with the version field so the next load is not migrated again', () => {
    stubLocalStorage();

    saveStateToStorage({ currentStep: 9, answers: {} });
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);

    expect(raw.version).toBe(SURVEY_STATE_VERSION);
    expect(loadStateFromStorage()?.currentStep).toBe(9);
  });
});
