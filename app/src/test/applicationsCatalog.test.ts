import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import applications from '@/data/applications/applications.json';
import { applicationEntrySchema } from '@/data/applications/schema';
import {
  CATEGORY_IDS,
  GOALS,
  EMPTY_CATEGORIES_PENDING_RESEARCH,
} from '@/data/applications/categories';
import { hardwareCapacity } from '@/data/hardwareCapacity';
import { safeHref } from '@/utils/catalogMeta';
import yunohost from '@research/fetched-data/yunohost-apps.json';
import en from '@/i18n/locales/en.json';
import pt from '@/i18n/locales/pt.json';
import es from '@/i18n/locales/es.json';

const entries = applications.flatMap(a => {
  const parsed = applicationEntrySchema.safeParse(a);
  return parsed.success ? [parsed.data] : [];
});

const lookup = (tree: unknown, keyPath: string): unknown =>
  keyPath.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], tree);

const ynhApps = new Map(
  (yunohost as { data: { id: string; archived: boolean }[] }).data.map(a => [a.id, a])
);

describe('applications catalog', () => {
  it('parses every entry with the schema', () => {
    for (const app of applications) {
      expect(applicationEntrySchema.safeParse(app).success, (app as { id: string }).id).toBe(true);
    }
  });

  it('has unique ids', () => {
    const ids = entries.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses known category ids', () => {
    for (const e of entries) {
      for (const c of e.categories) expect(CATEGORY_IDS, `${e.id}:${c}`).toContain(c);
    }
    for (const cats of Object.values(GOALS)) {
      for (const c of cats) expect(CATEGORY_IDS).toContain(c);
    }
  });

  it('has evidence with a past ISO date and a safe URL', () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const e of entries) {
      expect(e.evidence.length, e.id).toBeGreaterThanOrEqual(1);
      for (const ev of e.evidence) {
        expect(Number.isNaN(Date.parse(ev.checked)), `${e.id} ${ev.checked}`).toBe(false);
        expect(ev.checked <= today, `${e.id} ${ev.checked} is in the future`).toBe(true);
        expect(safeHref(ev.url), `${e.id} ${ev.url}`).not.toBeNull();
      }
    }
  });

  it('has safe link URLs', () => {
    for (const e of entries) {
      for (const link of e.links ?? []) expect(safeHref(link.url), `${e.id} ${link.url}`).not.toBeNull();
    }
  });

  it('backs yunohost availability with a non-archived repo in the fetched data', () => {
    for (const e of entries) {
      if (!e.platforms.includes('yunohost')) continue;
      const repo = ynhApps.get(`${e.id}_ynh`);
      expect(repo, `${e.id}_ynh`).toBeDefined();
      expect(repo?.archived, `${e.id}_ynh archived`).toBe(false);
    }
  });

  it('has name and description in en, pt and es', () => {
    for (const [lang, tree] of Object.entries({ en, pt, es })) {
      for (const e of entries) {
        for (const field of ['name', 'description']) {
          const value = lookup(tree, `${e.i18nKey}.${field}`);
          expect(typeof value === 'string' && value.length > 0, `${lang} ${e.i18nKey}.${field}`).toBe(true);
        }
      }
    }
  });

  it('gives every category an entry or lists it as pending research', () => {
    const used = new Set(entries.flatMap(e => e.categories));
    for (const id of CATEGORY_IDS) {
      const covered = used.has(id) || EMPTY_CATEGORIES_PENDING_RESEARCH.includes(id);
      expect(covered, `category ${id}`).toBe(true);
    }
    // The allowlist must not hide categories that already have entries.
    for (const id of EMPTY_CATEGORIES_PENDING_RESEARCH) expect(used.has(id), id).toBe(false);
  });
});

describe('hardware capacity', () => {
  it('keeps maxRamGb in line with ramGbOptions and points at a research README', () => {
    for (const [key, cap] of Object.entries(hardwareCapacity)) {
      expect(Math.max(...cap.ramGbOptions), key).toBe(cap.maxRamGb);
      expect(cap.evidence).toMatch(/^research\/hardware\/[a-z_0-9]+\/README\.md$/);
      expect(existsSync(path.resolve(__dirname, '../../..', cap.evidence)), cap.evidence).toBe(true);
    }
  });
});
