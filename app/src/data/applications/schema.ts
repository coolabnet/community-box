// Zod schema for applications.json. Imported by tests only: runtime code casts the
// JSON to `ApplicationEntry[]` so zod stays out of the bundle.
import { z } from 'zod';
import { CATEGORY_IDS } from './categories';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const applicationEntrySchema = z.strictObject({
  id: z.string().min(1),
  // Results-card key: RecommendationResults renders `<i18nKey>.name` and `.description`.
  // The projected `services.<id>.*` strings in recommendations.ts are legacy and not in the locales.
  i18nKey: z.string().min(1),
  icon: z.string().min(1),
  // DRAFT category ids from categories.ts.
  categories: z.array(z.enum(CATEGORY_IDS as [string, ...string[]])),
  // Free-string categories the current usage matcher relies on (news/files/education/media).
  legacyCategories: z.array(z.string()),
  platforms: z.array(z.enum(['docker', 'yunohost', 'casaos', 'caprover', 'native', 'bundled'])),
  // Empty means unknown (no cited source yet).
  architectures: z.array(z.enum(['amd64', 'arm64'])),
  resources: z.strictObject({
    ramMb: z.number().positive().optional(),
    ramMbPer25Users: z.number().positive().optional(),
    storageGb: z.number().positive().optional(),
    cpu: z.enum(['low', 'medium', 'high']).optional(),
    confidence: z.enum(['documented', 'estimated', 'unknown']),
  }),
  offline: z.enum(['full', 'partial', 'none', 'unknown']),
  network: z.enum(['lan', 'syncsInternet', 'needsInternet', 'unknown']),
  uiLanguages: z.array(z.string()),
  maintenance: z.enum(['low', 'medium', 'high', 'unknown']),
  license: z.string().min(1),
  source: z.string().min(1),
  links: z
    .array(
      z.strictObject({
        kind: z.enum(['website', 'docs', 'guide', 'source', 'download']),
        url: z.string(),
      })
    )
    .optional(),
  evidence: z.array(
    z.strictObject({
      url: z.string(),
      kind: z.enum(['officialDocs', 'repoResearch', 'fieldReport', 'catalog', 'sourceRepo']),
      checked: isoDate,
    })
  ),
  status: z.enum(['recommended', 'candidate']),
});

export type ApplicationEntry = z.infer<typeof applicationEntrySchema>;
