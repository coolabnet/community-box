import type { TFunction } from 'i18next';
import type { Requirements, ResourceLink } from '@/types/questionnaire';

const INTERNAL_DOCS_PREFIX = '/docs/';

/**
 * Resolve a catalog link URL to a safe href.
 * Accepts https:// URLs and app-internal /docs/ paths only; anything else is dropped.
 */
export function safeHref(url: string): { href: string; internal: boolean } | null {
  if (typeof url !== 'string') return null;

  if (url.startsWith('/')) {
    if (!url.startsWith(INTERNAL_DOCS_PREFIX)) return null;
    if (url.includes('..') || url.includes('\\')) return null;
    return { href: url, internal: true };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return null;
    return { href: parsed.href, internal: false };
  } catch {
    return null;
  }
}

/** True when at least one requirement renders as text. */
export function hasRequirements(req?: Requirements): boolean {
  if (!req) return false;
  return (
    req.minRamGb !== undefined ||
    req.minStorageGb !== undefined ||
    (req.architectures?.length ?? 0) > 0 ||
    req.needsInternet === true
  );
}

/** True when there is something to render: a requirement or a link that passes safeHref. */
export function hasCatalogMeta(entry: { links?: ResourceLink[]; requirements?: Requirements }): boolean {
  if (hasRequirements(entry.requirements)) return true;
  return (entry.links ?? []).some(link => safeHref(link.url) !== null);
}

/** Human-readable requirement fragments, e.g. ["2 GB RAM", "amd64 / arm64", "Needs internet"]. */
export function requirementParts(req: Requirements | undefined, t: TFunction): string[] {
  if (!req) return [];
  const parts: string[] = [];
  const base = 'questionnaire.questions.results.catalog';

  if (req.minRamGb !== undefined) {
    parts.push(t(`${base}.ram`, { value: req.minRamGb }));
  }
  if (req.minStorageGb !== undefined) {
    parts.push(t(`${base}.storage`, { value: req.minStorageGb }));
  }
  if (req.architectures && req.architectures.length > 0) {
    parts.push(req.architectures.join(' / '));
  }
  if (req.needsInternet === true) {
    parts.push(t(`${base}.needsInternet`));
  }
  return parts;
}
