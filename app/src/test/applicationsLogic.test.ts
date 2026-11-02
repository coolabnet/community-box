import { describe, it, expect } from 'vitest';
import type { ApplicationEntry } from '@/data/applications/schema';
import type { DeviceKey, DeviceScore } from '@/types/questionnaire';
import {
  MAX_CANDIDATES_PER_GOAL,
  applyCapacity,
  catalog,
  checkCompatibility,
  computeCapacity,
  getCandidateApps,
  roundUpRamGb,
} from '@/utils/applications';

const app = (id: string, over: Partial<ApplicationEntry> = {}): ApplicationEntry => ({
  id,
  i18nKey: `k.${id}`,
  icon: 'x',
  categories: ['education'],
  legacyCategories: [],
  platforms: ['docker'],
  architectures: ['amd64', 'arm64'],
  resources: { confidence: 'documented', ramMb: 512, storageGb: 2 },
  offline: 'full',
  network: 'lan',
  uiLanguages: [],
  maintenance: 'low',
  license: 'MIT',
  source: 'https://example.org',
  evidence: [],
  status: 'recommended',
  ...over,
});

const score = (key: DeviceKey, matchPercentage = 50): DeviceScore => ({
  device: { key } as DeviceScore['device'],
  score: matchPercentage,
  matchPercentage,
  strengths: [],
});

const ids = (c: { app: ApplicationEntry }[]) => c.map(x => x.app.id);

describe('getCandidateApps', () => {
  it('returns nothing for empty or unknown goals', () => {
    expect(getCandidateApps([], [app('a')])).toEqual([]);
    expect(getCandidateApps(['nope' as never], [app('a')])).toEqual([]);
  });

  it('unions category matches and records matched goals', () => {
    const apps = [
      app('both', { categories: ['education', 'mediaStorage'] }),
      app('edu', { categories: ['education'] }),
      app('other', { categories: ['localMedia'] }),
    ];
    const res = getCandidateApps(['education', 'mediaStorage'], apps);
    expect(ids(res)).toEqual(['both', 'edu']);
    expect(res[0].matchedGoals).toEqual(['education', 'mediaStorage']);
  });

  it('ranks recommended before candidate, more goals first, then maintenance with unknown last', () => {
    const apps = [
      app('cand', { status: 'candidate', categories: ['education', 'mediaStorage'] }),
      app('unk', { maintenance: 'unknown' }),
      app('high', { maintenance: 'high' }),
      app('low', { maintenance: 'low' }),
      app('two', { categories: ['education', 'mediaStorage'], maintenance: 'high' }),
    ];
    // education keeps its top 3 (two, low, high); mediaStorage keeps two, cand.
    expect(ids(getCandidateApps(['education', 'mediaStorage'], apps))).toEqual(['two', 'low', 'high', 'cand']);
    expect(ids(getCandidateApps(['education'], apps.filter(a => a.id !== 'two')))).toEqual(['low', 'high', 'unk']);
  });

  it('caps each goal at MAX_CANDIDATES_PER_GOAL and is deterministic', () => {
    expect(MAX_CANDIDATES_PER_GOAL).toBe(3);
    const apps = ['e', 'd', 'c', 'b', 'a'].map(id => app(id));
    const first = ids(getCandidateApps(['education'], apps));
    expect(first).toEqual(['a', 'b', 'c']);
    expect(ids(getCandidateApps(['education'], [...apps].reverse()))).toEqual(first);
  });

  it('ignores duplicate goals', () => {
    expect(ids(getCandidateApps(['education', 'education'], [app('a')]))).toEqual(['a']);
  });

  it('works against the real catalog', () => {
    const res = getCandidateApps(['education']);
    expect(res.length).toBeGreaterThan(0);
    expect(res.length).toBeLessThanOrEqual(MAX_CANDIDATES_PER_GOAL);
    expect(catalog.length).toBeGreaterThan(0);
  });
});

describe('checkCompatibility', () => {
  it('passes when the device architecture is supported', () => {
    expect(checkCompatibility(app('a'), 'raspberryPi')).toEqual({ ok: true, reasons: [], warnings: [] });
  });

  it('excludes raspberryPi for an amd64-only app but not intelNUC', () => {
    const a = app('a', { architectures: ['amd64'] });
    expect(checkCompatibility(a, 'raspberryPi')).toMatchObject({ ok: false, reasons: ['architectureUnsupported'] });
    expect(checkCompatibility(a, 'intelNUC').ok).toBe(true);
  });

  it('warns, never excludes, when architectures are unknown', () => {
    const res = checkCompatibility(app('a', { architectures: [] }), 'raspberryPi');
    expect(res.ok).toBe(true);
    expect(res.warnings).toContain('architectureUnknown');
  });

  it('checks platform only when an OS is given', () => {
    const a = app('a', { platforms: ['bundled'] });
    expect(checkCompatibility(a, 'intelNUC').warnings).toEqual([]);
    expect(checkCompatibility(a, 'intelNUC', { platforms: ['docker'] })).toMatchObject({
      ok: false,
      reasons: ['platformUnsupported'],
    });
    expect(checkCompatibility(a, 'intelNUC', { platforms: ['docker', 'bundled'] }).ok).toBe(true);
  });

  it('warns when app platforms or OS platforms are unknown', () => {
    const none = checkCompatibility(app('a', { platforms: [] }), 'intelNUC', { platforms: ['docker'] });
    expect(none.ok).toBe(true);
    expect(none.warnings).toContain('platformUnknown');
    const noOs = checkCompatibility(app('a'), 'intelNUC', {});
    expect(noOs.ok).toBe(true);
    expect(noOs.warnings).toContain('platformUnknown');
  });

  it('warns on needsInternet without excluding', () => {
    const res = checkCompatibility(app('a', { network: 'needsInternet' }), 'intelNUC');
    expect(res).toEqual({ ok: true, reasons: [], warnings: ['needsInternet'] });
  });
});

describe('computeCapacity', () => {
  it('adds the 1 GB OS base to app RAM and sums storage', () => {
    const cap = computeCapacity([app('a', { resources: { confidence: 'documented', ramMb: 512, storageGb: 2 } }), app('b', { resources: { confidence: 'documented', ramMb: 1024, storageGb: 3 } })], '1-2');
    expect(cap.minRamGb).toBe(2.5);
    expect(cap.minStorageGb).toBe(5);
    expect(cap.recommendedRamGb).toBe(4);
    expect(cap.confidence).toBe('documented');
  });

  it('scales ramMbPer25Users by users band', () => {
    // 1 GB base + 1 GB app + 256 MB per 25 users x 1/4/8 blocks
    const a = app('a', { resources: { confidence: 'estimated', ramMb: 1024, ramMbPer25Users: 256 } });
    expect(computeCapacity([a], '1-2').minRamGb).toBe(2.25);
    expect(computeCapacity([a], '3-5').minRamGb).toBe(3);
    expect(computeCapacity([a], '6+').minRamGb).toBe(4);
  });

  it('rounds recommended RAM up to the next step', () => {
    expect(roundUpRamGb(1.5)).toBe(2);
    expect(roundUpRamGb(2)).toBe(2);
    expect(roundUpRamGb(2.01)).toBe(4);
    expect(roundUpRamGb(9)).toBe(16);
    // Above the largest step, round up to a whole GB so recommended never drops below min.
    expect(roundUpRamGb(100)).toBe(100);
    // 2 GB min * 1.5 = 3 -> 4; 1 GB base only * 1.5 = 1.5 -> 2
    const a = app('a', { resources: { confidence: 'documented', ramMb: 1024 } });
    expect(computeCapacity([a], '1-2').recommendedRamGb).toBe(4);
    expect(computeCapacity([], '1-2').recommendedRamGb).toBe(2);
  });

  it('uses the weakest confidence among apps', () => {
    const d = app('d');
    const e = app('e', { resources: { confidence: 'estimated', ramMb: 100 } });
    expect(computeCapacity([d, e]).confidence).toBe('estimated');
    expect(computeCapacity([d]).confidence).toBe('documented');
    expect(computeCapacity([d, app('u', { resources: { confidence: 'unknown', ramMb: 100 } })]).confidence).toBe('unknown');
  });

  it('counts an app without ramMb as 0 and forces unknown confidence', () => {
    const noRam = app('n', { resources: { confidence: 'documented' } });
    const cap = computeCapacity([noRam, app('d')], '1-2');
    expect(cap.minRamGb).toBe(1.5);
    expect(cap.confidence).toBe('unknown');
  });

  it('reports no confidence for an empty app list', () => {
    expect(computeCapacity([]).confidence).toBe('unknown');
    expect(computeCapacity([]).minRamGb).toBe(1);
  });

  it('intersects known architectures and ignores unknown ones', () => {
    const both = app('both');
    const amd = app('amd', { architectures: ['amd64'] });
    const unk = app('unk', { architectures: [] });
    expect(computeCapacity([both, amd, unk]).architectures).toEqual(['amd64']);
    expect(computeCapacity([both]).architectures).toEqual(['amd64', 'arm64']);
    expect(computeCapacity([unk]).architectures).toEqual([]);
  });
});

describe('applyCapacity', () => {
  const small = computeCapacity([app('a')], '1-2'); // min 1.5, recommended 2
  const scores = [score('raspberryPi', 90), score('zimaBoard', 80), score('intelNUC', 70), score('reusedPC', 60)];

  it('leaves calculateDeviceScores fields untouched and adds fit', () => {
    const res = applyCapacity(scores, small, []);
    expect(res.map(r => r.matchPercentage)).toEqual([90, 80, 70, 60]);
    expect(res.every(r => r.fit && r.fitReasons)).toBe(true);
  });

  it('marks devices insufficient when maxRamGb is below minRamGb, sorted last and stable', () => {
    const big = computeCapacity([app('a', { resources: { confidence: 'documented', ramMb: 12 * 1024 } })], '1-2');
    expect(big.minRamGb).toBe(13);
    const res = applyCapacity(scores, big, []);
    // raspberryPi max 16 ok; zima and reusedPC max 8 insufficient; NUC ok
    expect(res.map(r => r.device.key)).toEqual(['raspberryPi', 'intelNUC', 'zimaBoard', 'reusedPC']);
    expect(res.find(r => r.device.key === 'zimaBoard')).toMatchObject({ fit: 'insufficient', fitReasons: ['insufficientRam'] });
  });

  it('marks raspberryPi insufficient for an amd64-only app', () => {
    const apps = [app('a', { architectures: ['amd64'] })];
    const res = applyCapacity(scores, computeCapacity(apps), apps);
    expect(res.find(r => r.device.key === 'raspberryPi')).toMatchObject({ fit: 'insufficient', fitReasons: ['architectureMismatch'] });
    expect(res[res.length - 1].device.key).toBe('raspberryPi');
  });

  it('does not exclude on unknown architectures', () => {
    const apps = [app('a', { architectures: [] })];
    expect(applyCapacity(scores, computeCapacity(apps), apps).every(r => r.fit !== 'insufficient')).toBe(true);
  });

  it('keeps original order when every device is insufficient', () => {
    const huge = computeCapacity([app('a', { resources: { confidence: 'documented', ramMb: 100 * 1024 } })], '1-2');
    const res = applyCapacity(scores, huge, []);
    expect(res.every(r => r.fit === 'insufficient')).toBe(true);
    expect(res.map(r => r.device.key)).toEqual(['raspberryPi', 'zimaBoard', 'intelNUC', 'reusedPC']);
  });

  it('returns chooseVariant for zimaBoard when recommended exceeds its smallest option', () => {
    // min 3.5 GB -> recommended 8; zima options 2/4/8 (smallest 2 < 8 <= 8)
    const cap = computeCapacity([app('a', { resources: { confidence: 'documented', ramMb: 2.5 * 1024 } })], '1-2');
    expect(cap.recommendedRamGb).toBe(8);
    const res = applyCapacity([score('zimaBoard')], cap, []);
    expect(res[0]).toMatchObject({ fit: 'chooseVariant', fitReasons: ['chooseRamVariant'], suggestedRamGb: 8 });
  });

  it('returns ok when the smallest option already meets the recommendation', () => {
    const res = applyCapacity([score('intelNUC')], small, []); // smallest 4 >= 2
    expect(res[0]).toMatchObject({ fit: 'ok', fitReasons: [] });
  });

  it('falls back to the minimum when no variant reaches the recommendation', () => {
    // min 6 GB -> recommended 16 > reusedPC max 8; the 4 GB option is below min, so pick 8
    const cap = computeCapacity([app('a', { resources: { confidence: 'documented', ramMb: 5 * 1024 } })], '1-2');
    expect(cap.recommendedRamGb).toBe(16);
    expect(applyCapacity([score('reusedPC')], cap, [])[0]).toMatchObject({
      fit: 'chooseVariant',
      fitReasons: ['chooseRamVariant', 'belowRecommendedRam'],
      suggestedRamGb: 8,
    });
  });

  it('flags belowRecommendedRam without a variant when every option meets the minimum', () => {
    // recommended 16 > reusedPC max 8; its smallest option (4) already meets the 3 GB min
    const cap = { minRamGb: 3, recommendedRamGb: 16, minStorageGb: 0, architectures: [], confidence: 'estimated' as const };
    const res = applyCapacity([score('reusedPC')], cap, [])[0];
    expect(res).toMatchObject({ fit: 'ok', fitReasons: ['belowRecommendedRam'] });
    expect(res.suggestedRamGb).toBeUndefined();
  });

  it('ignores prototype keys in goals', () => {
    expect(getCandidateApps(['constructor', 'toString'] as never[])).toEqual([]);
  });

  it('handles an empty scores list', () => {
    expect(applyCapacity([], small, [])).toEqual([]);
  });
});
