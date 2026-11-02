import { describe, it, expect } from 'vitest';
import baseline from './fixtures/recommendations-baseline.json';
import { getRecommendations, getServiceSuggestions, services } from '@/utils/recommendations';
import type { UsageSelectionValues, MainUseAnswer, FormatAnswer, DeviceKey } from '@/types/questionnaire';

// Baseline captured from the hard-coded `services` table before it became a
// projection of data/applications/applications.json (M4 PR1). Service output must not drift.
const usages: Record<string, UsageSelectionValues | undefined> = {
  none: undefined,
  empty: {},
  news: { news: true },
  files: { files: true },
  education: { education: true },
  media: { media: true },
  other: { other: 'radio' },
  all: { news: true, files: true, education: true, media: true, other: 'x' },
  filesMedia: { files: true, media: true },
};
const mainUses: (MainUseAnswer | undefined)[] = [undefined, 'education', 'business', 'personal'];
const formats: (FormatAnswer | undefined)[] = [undefined, 'yes', 'no'];
const devs: (DeviceKey | undefined)[] = [undefined, 'raspberryPi', 'zimaBoard', 'intelNUC', 'reusedPC'];

describe('recommendations regression (catalog projection)', () => {
  it('keeps the services table deep-equal', () => {
    expect(JSON.parse(JSON.stringify(services))).toEqual(baseline.services);
    expect(Object.keys(services)).toEqual(Object.keys(baseline.services));
  });

  it('keeps getServiceSuggestions output deep-equal', () => {
    for (const [name, usage] of Object.entries(usages)) {
      if (!usage) continue;
      expect(getServiceSuggestions(usage).map(s => s.key).join(','), name).toBe(
        (baseline.suggestions as Record<string, string>)[name]
      );
    }
  });

  // Services depend only on usage and OS only on mainUse/format/device (asserted when the
  // baseline was captured), so the 540 combinations are stored as two compact maps.
  it('keeps getRecommendations service and OS keys for all 540 combinations', () => {
    const servicesByUsage = baseline.servicesByUsage as Record<string, string>;
    const osByKey = baseline.osByMainUseFormatDevice as Record<string, string>;
    let count = 0;
    for (const [name, usage] of Object.entries(usages)) {
      for (const mainUse of mainUses) {
        for (const format of formats) {
          for (const device of devs) {
            const r = getRecommendations(usage, mainUse, format, device);
            const key = [mainUse ?? '', format ?? '', device ?? ''].join('|');
            expect(
              {
                services: r.services.map(s => s.key).join(','),
                operatingSystems: r.operatingSystems.map(o => o.key).join(','),
              },
              `${name}|${key}`
            ).toEqual({ services: servicesByUsage[name], operatingSystems: osByKey[key] });
            count += 1;
          }
        }
      }
    }
    expect(count).toBe(540);
  });

  it('falls back to the default services for non-usage input', () => {
    expect(getRecommendations('bogus', undefined, undefined).services.map(s => s.key).join(',')).toBe(
      baseline.invalidUsage
    );
  });
});
