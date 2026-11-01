import { describe, it, expect } from 'vitest';
import { getOSSuggestions, operatingSystems } from '@/utils/recommendations';
import { safeHref, hasCatalogMeta } from '@/utils/catalogMeta';
import type { DeviceKey, FormatAnswer, MainUseAnswer } from '@/types/questionnaire';

const keys = (mainUse: MainUseAnswer, format: FormatAnswer | undefined, device?: DeviceKey) =>
  getOSSuggestions(mainUse, format, device).map(os => os.key);

describe('platform OS entries', () => {
  it.each(['butterbox', 'proxmox'] as const)('%s has links that pass safeHref', key => {
    for (const link of operatingSystems[key].links ?? []) {
      expect(safeHref(link.url), link.url).not.toBeNull();
    }
  });

  it('gives each new entry visible catalog metadata', () => {
    for (const key of ['butterbox', 'proxmox'] as const) {
      expect(hasCatalogMeta(operatingSystems[key])).toBe(true);
    }
  });
});

describe('getOSSuggestions with platform entries', () => {
  it('suggests ButterBox for a Raspberry Pi education or personal profile', () => {
    expect(keys('education', 'yes', 'raspberryPi')).toContain('butterbox');
    expect(keys('personal', 'yes', 'raspberryPi')).toContain('butterbox');
  });

  it('hides ButterBox for a business profile and for non-Pi hardware', () => {
    expect(keys('business', 'yes', 'raspberryPi')).not.toContain('butterbox');
    expect(keys('education', 'yes', 'intelNUC')).not.toContain('butterbox');
  });

  it('keeps Raspberry Pi education results unchanged apart from ButterBox', () => {
    expect(keys('education', 'yes', 'raspberryPi')).toEqual(['raspbian', 'openmediavault', 'butterbox']);
  });

  it('never suggests Proxmox for Raspberry Pi', () => {
    for (const format of ['yes', 'maybe', 'no'] as const) {
      expect(keys('business', format, 'raspberryPi')).not.toContain('proxmox');
    }
  });

  it('suggests Proxmox for x86 business profiles only to confident users', () => {
    for (const device of ['intelNUC', 'zimaBoard', 'reusedPC'] as const) {
      expect(keys('business', 'yes', device)).toContain('proxmox');
      expect(keys('business', 'maybe', device)).not.toContain('proxmox');
      expect(keys('business', 'no', device)).not.toContain('proxmox');
      expect(keys('business', undefined, device)).not.toContain('proxmox');
    }
  });

  it('lists Proxmox last for confident x86 business users', () => {
    for (const device of ['intelNUC', 'zimaBoard', 'reusedPC'] as const) {
      expect(keys('business', 'yes', device)).toEqual(['ubuntuServer', 'debian', 'truenas', 'proxmox']);
    }
  });

  it('does not suggest Proxmox outside business', () => {
    expect(keys('education', 'yes', 'intelNUC')).not.toContain('proxmox');
    expect(keys('personal', 'yes', 'reusedPC')).not.toContain('proxmox');
  });

  it('leaves x86 education and personal defaults unchanged', () => {
    expect(keys('personal', 'yes', 'intelNUC')).toEqual(['ubuntuServer', 'debian']);
    expect(keys('education', 'yes', 'reusedPC')).toEqual(['ubuntuServer', 'truenas', 'openmediavault']);
  });

  // Examples documented in research/software/os-recommendations.md.
  it('matches the documented examples', () => {
    for (const device of ['intelNUC', 'zimaBoard', 'reusedPC'] as const) {
      expect(keys('business', 'maybe', device)).toEqual(['ubuntuServer', 'debian', 'truenas', 'openmediavault']);
      expect(keys('business', 'no', device)).toEqual(['ubuntuServer', 'openmediavault']);
    }
    expect(keys('education', 'yes', 'raspberryPi')).toEqual(['raspbian', 'openmediavault', 'butterbox']);
    expect(keys('personal', 'no', 'raspberryPi')).toEqual(['raspbian', 'butterbox']);
  });

  it('never returns more than four OS entries', () => {
    for (const mainUse of ['education', 'business', 'personal'] as const) {
      for (const device of [undefined, 'raspberryPi', 'zimaBoard', 'intelNUC', 'reusedPC'] as const) {
        expect(getOSSuggestions(mainUse, 'yes', device).length).toBeLessThanOrEqual(4);
      }
    }
  });
});
