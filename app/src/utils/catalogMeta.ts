import type { TFunction } from 'i18next';
import type { Requirements, ResourceLink } from '@/types/questionnaire';

// Internal paths: /docs/<segment>(/<segment>)* with an optional #anchor.
// Only [A-Za-z0-9_-] is allowed in segments, so `%`, `.`, `\` and empty segments
// (`//`, trailing `/`) never match and encoded traversal cannot survive.
const INTERNAL_DOCS_PATH = /^\/docs\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/;
const INTERNAL_ANCHOR = /^[A-Za-z0-9_-]+$/;

/**
 * Resolve a catalog link URL to a safe href.
 * Accepts https:// URLs and strict app-internal /docs/ paths only; anything else is dropped.
 */
export function safeHref(url: string): { href: string; internal: boolean } | null {
  if (typeof url !== 'string') return null;

  if (url.startsWith('/')) {
    const hashAt = url.indexOf('#');
    const path = hashAt === -1 ? url : url.slice(0, hashAt);
    const anchor = hashAt === -1 ? null : url.slice(hashAt + 1);
    if (!INTERNAL_DOCS_PATH.test(path)) return null;
    if (anchor !== null && !INTERNAL_ANCHOR.test(anchor)) return null;
    // Canonical form must match the input exactly (no normalisation surprises).
    if (new URL(path, 'https://x.invalid').pathname !== path) return null;
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
