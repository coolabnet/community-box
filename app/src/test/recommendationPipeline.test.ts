import { describe, it, expect } from 'vitest';
import type { ApplicationEntry } from '@/data/applications/schema';
import { hardwareCapacity } from '@/data/hardwareCapacity';
import type { DeviceFitReason, DeviceScore, OSSuggestion, UserAnswers } from '@/types/questionnaire';
import {
  applyCapacity,
  checkCompatibility,
  computeCapacity,
  resolveSelectedApps,
  type Capacity,
} from '@/utils/applications';
import {
  buildRecommendation,
  partitionByCompatibility,
  visibleFitReasons,
} from '@/utils/recommendationPipeline';
import { getResultApplications } from '@/utils/resultApplications';
import { normalizeUserAnswers, calculateDeviceScores } from '@/utils/deviceScoring';
import { getRecommendations } from '@/utils/recommendations';

const app = (id: string, over: Partial<ApplicationEntry> = {}): ApplicationEntry => ({
  id,
  i18nKey: `k.${id}`,
  icon: 'x',
  categories: ['education'],
  legacyCategories: [],
  platforms: ['docker'],
  architectures: ['amd64', 'arm64'],
  resources: { confidence: 'documented', ramMb: 512 },
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

const goalsAnswers = (goals: UserAnswers['goals'], over: Partial<UserAnswers> = {}): UserAnswers => ({
  goals,
  apps: { selected: [], dismissed: [] },
  ...over,
});

describe('buildRecommendation — goals flow', () => {
  it('persona 1: media archive for a large community sizes RAM and device fits', () => {
    const answers = goalsAnswers({ mediaStorage: true }, { users: '6+' });
    const result = buildRecommendation(answers);
    expect(result.capacity).toBeDefined();
    // mediaStorage defaults are its top 3 by compareCandidates: filebrowser-quantum,
    // jellyfin, nextcloud. None documents ramMbPer25Users, so the users band adds
    // nothing: 1024 MB OS base + 512 (filebrowser-quantum) + 0 (jellyfin) + 512
    // (nextcloud) = 2048 MB -> minRamGb 2; recommended = roundUp(2 * 1.5) = 4.
    expect(result.capacity?.minRamGb).toBe(2);
    expect(result.capacity?.recommendedRamGb).toBe(4);

    const byKey = Object.fromEntries(result.deviceScores.map(s => [s.device.key, s]));
    // zimaBoard options 2/4/8: min option 2 < needed 4, max 8 >= 4 -> pick the 4 GB model
    expect(byKey.zimaBoard).toMatchObject({ fit: 'chooseVariant', suggestedRamGb: 4 });
    // intelNUC options start at 4 >= 4 -> fits as-is
    expect(byKey.intelNUC).toMatchObject({ fit: 'ok' });
    // Invariant, checked against the hardware table: every non-insufficient device
    // whose smallest option is below the needed GB must be chooseVariant with the
    // smallest option that meets it.
    for (const score of result.deviceScores) {
      const hw = hardwareCapacity[score.device.key];
      const needed =
        (result.capacity?.recommendedRamGb ?? 0) <= hw.maxRamGb
          ? result.capacity?.recommendedRamGb
          : result.capacity?.minRamGb;
      if (score.fit !== 'insufficient' && needed !== undefined && hw.ramGbOptions[0] < needed) {
        expect(score.fit).toBe('chooseVariant');
        expect(score.suggestedRamGb).toBe(
          [...hw.ramGbOptions].sort((a, b) => a - b).find(gb => gb >= needed)
        );
      }
    }
    // All defaults have known architectures and the OS entries carry no platforms
    // data yet, so nothing is flagged as unverified.
    expect(result.unverified).toEqual([]);
    // No merged OS entry lists its platforms yet.
    expect(result.osPlatformsIncomplete).toBe(true);
    // jellyfin documents no requirements, so confidence is unknown; the 2 GB-first
    // ZimaBoard card must still carry (hedged) variant guidance.
    expect(result.capacity?.confidence).toBe('unknown');
    expect(visibleFitReasons(byKey.zimaBoard, result.capacity)).toContain('chooseRamVariant');
  });

  it('persona 2: small school stays usable with unknown confidence', () => {
    const answers = goalsAnswers({ education: true }, { electricity: 'no', users: '1-2' });
    const result = buildRecommendation(answers);
    expect(result.capacity).toBeDefined();
    // No education app documents ramMb (kiwix, kolibri, moodle).
    expect(result.capacity?.confidence).toBe('unknown');
    expect(result.incompatible).toEqual([]);
    expect(result.deviceScores.every(s => s.fit !== 'insufficient')).toBe(true);
    // moodle has unknown architectures, so it stays compatible but unverified.
    expect(result.unverified.map(u => u.id)).toContain('moodle');
  });

  it('persona 3: network management counts pihole storage and excludes nothing', () => {
    const result = buildRecommendation(goalsAnswers({ networkManagement: true }));
    // pihole documents 2 GB of storage.
    expect(result.capacity?.minStorageGb).toBeGreaterThanOrEqual(2);
    // All networkManagement apps are amd64+arm64 or unknown-arch.
    expect(result.incompatible).toEqual([]);
  });

  it('feeds the first non-insufficient device to the OS suggestions', () => {
    const answers = goalsAnswers({ mediaStorage: true }, { users: '6+' });
    const result = buildRecommendation(answers);
    expect(result.operatingSystems).toEqual(
      getRecommendations(answers.usage, answers.mainUse, answers.format, result.topDeviceKey)
        .operatingSystems
    );
    const firstOk = result.deviceScores.find(s => s.fit !== 'insufficient');
    expect(result.topDeviceKey).toBe(firstOk?.device.key);
  });

  it('treats missing users as the 3-5 band (default)', () => {
    const goals = { networkManagement: true };
    const apps = { selected: [], dismissed: [] };
    const result = buildRecommendation({ goals, apps });
    expect(result.capacity).toEqual(computeCapacity(resolveSelectedApps(goals, apps), '3-5'));
  });
});

describe('buildRecommendation — legacy flow', () => {
  it('keeps the pre-v3 results behavior for answers without goals', () => {
    const answers: UserAnswers = { usage: { files: true }, mainUse: 'education', format: 'yes' };
    const result = buildRecommendation(answers);
    expect(result.deviceScores[0].fit).toBeUndefined();
    expect(result.capacity).toBeUndefined();
    expect(result.incompatible).toEqual([]);
    expect(result.unverified).toEqual([]);
    expect(result.osPlatformsIncomplete).toBe(false);
    expect(result.topDeviceKey).toBe(result.deviceScores[0].device.key);
    expect(result.applications.map(a => a.id)).toEqual(getResultApplications(answers).map(a => a.id));
    expect(result.operatingSystems).toEqual(
      getRecommendations(
        answers.usage,
        answers.mainUse,
        answers.format,
        result.deviceScores[0].device.key
      ).operatingSystems
    );
  });
});

describe('visibleFitReasons', () => {
  const scoreWith = (fitReasons: DeviceFitReason[]): DeviceScore => ({
    device: { key: 'intelNUC' } as DeviceScore['device'],
    score: 50,
    matchPercentage: 50,
    strengths: [],
    fitReasons,
  });
  const ramReasons: DeviceFitReason[] = ['chooseRamVariant', 'belowRecommendedRam'];
  const capacity = (confidence: Capacity['confidence']): Capacity => ({
    minRamGb: 2,
    recommendedRamGb: 4,
    minStorageGb: 0,
    architectures: [],
    confidence,
  });

  it('drops only belowRecommendedRam under unknown confidence; variant guidance stays', () => {
    expect(visibleFitReasons(scoreWith(ramReasons), capacity('unknown'))).toEqual(['chooseRamVariant']);
  });

  it('keeps RAM-derived reasons when requirements are known', () => {
    expect(visibleFitReasons(scoreWith(ramReasons), capacity('documented'))).toEqual(ramReasons);
    expect(visibleFitReasons(scoreWith(ramReasons), capacity('estimated'))).toEqual(ramReasons);
  });

  it('passes reasons through when no capacity exists (legacy)', () => {
    expect(visibleFitReasons(scoreWith(ramReasons))).toEqual(ramReasons);
  });

  it('keeps data-backed architecture reasons under unknown confidence', () => {
    expect(
      visibleFitReasons(scoreWith(['architectureMismatch']), capacity('unknown'))
    ).toEqual(['architectureMismatch']);
  });
});

describe('amd64-only app (acceptance case, pure layer)', () => {
  const amd64Only = app('amd64-only', { architectures: ['amd64'] });

  it('checkCompatibility excludes the Raspberry Pi on architecture alone', () => {
    expect(checkCompatibility(amd64Only, 'raspberryPi').reasons).toEqual(['architectureUnsupported']);
  });

  it('applyCapacity marks raspberryPi insufficient and sorts it after every other device', () => {
    const scores = calculateDeviceScores({}, normalizeUserAnswers({}));
    const annotated = applyCapacity(scores, computeCapacity([amd64Only]), [amd64Only]);
    const pi = annotated.find(s => s.device.key === 'raspberryPi');
    expect(pi).toMatchObject({ fit: 'insufficient' });
    expect(pi?.fitReasons).toContain('architectureMismatch');
    const piIndex = annotated.findIndex(s => s.device.key === 'raspberryPi');
    expect(piIndex).toBeGreaterThan(annotated.findIndex(s => s.fit !== 'insufficient'));
    expect(piIndex).toBe(annotated.length - 1);
  });
});

describe('partitionByCompatibility platform rule', () => {
  const bundledOnly = app('bundled-only', { platforms: ['bundled'] });

  it('excludes with platformUnsupported when every OS has known platforms and none can host the app', () => {
    const res = partitionByCompatibility([bundledOnly], 'intelNUC', [{ platforms: ['docker'] }]);
    expect(res.compatible).toEqual([]);
    expect(res.incompatible[0].reasons).toEqual(['platformUnsupported']);
    expect(res.incompatible[0].application.id).toBe('bundled-only');
  });

  it('keeps the app when one OS has unknown (empty) platforms', () => {
    const res = partitionByCompatibility(
      [bundledOnly],
      'intelNUC',
      [{ platforms: ['docker'] }, { platforms: [] }]
    );
    expect(res.incompatible).toEqual([]);
    expect(res.compatible.map(a => a.id)).toEqual(['bundled-only']);
  });

  it('keeps the app when no OS is suggested', () => {
    expect(partitionByCompatibility([bundledOnly], 'intelNUC', []).incompatible).toEqual([]);
  });

  it('excludes on architecture regardless of the OS list', () => {
    const amd64Only = app('amd64-only', { architectures: ['amd64'] });
    const osLists: readonly Pick<OSSuggestion, 'platforms'>[][] = [
      [],
      [{ platforms: [] }],
      [{ platforms: ['bundled'] }],
    ];
    for (const osList of osLists) {
      const res = partitionByCompatibility([amd64Only], 'raspberryPi', osList);
      expect(res.incompatible[0].reasons).toEqual(['architectureUnsupported']);
      expect(res.compatible).toEqual([]);
    }
  });
});
