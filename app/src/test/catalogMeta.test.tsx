import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next, { type TFunction } from 'i18next';
import en from '@/i18n/locales/en.json';
import { CatalogMeta } from '@/components/CatalogMeta';
import { hasCatalogMeta, requirementParts, safeHref } from '@/utils/catalogMeta';
import { services, operatingSystems } from '@/utils/recommendations';
import type { Requirements, ResourceLink } from '@/types/questionnaire';

const i18n = i18next.createInstance();
void i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});
const t = i18n.getFixedT('en') as unknown as TFunction;

const serviceFixture = {
  links: [
    { kind: 'docs', url: '/docs/guides/x' },
    { kind: 'website', url: 'https://example.org/' },
    { kind: 'source', url: 'javascript:alert(1)' },
  ] satisfies ResourceLink[],
  requirements: {
    minRamGb: 2,
    minStorageGb: 10,
    architectures: ['amd64', 'arm64'],
    needsInternet: true,
  } satisfies Requirements,
};

const osFixture = {
  links: [{ kind: 'download', url: 'https://example.org/dl' }] satisfies ResourceLink[],
  requirements: { architectures: ['armhf'] } satisfies Requirements,
};

const render = (props: { links?: ResourceLink[]; requirements?: Requirements }) =>
  renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <CatalogMeta {...props} />
      </MemoryRouter>
    </I18nextProvider>
  );

describe('safeHref', () => {
  it('accepts https URLs', () => {
    expect(safeHref('https://example.org/a')).toEqual({ href: 'https://example.org/a', internal: false });
  });

  it('accepts app-internal /docs/ paths as internal', () => {
    expect(safeHref('/docs/guides/x')).toEqual({ href: '/docs/guides/x', internal: true });
  });

  it.each([
    'http://example.org',
    'javascript:alert(1)',
    'data:text/html,hi',
    'mailto:someone@example.org',
    '//evil.com',
    '/docs/../x',
    '/docs/\\..\\x',
    '/other/page',
    'relative',
    '',
  ])('rejects %s', url => {
    expect(safeHref(url)).toBeNull();
  });
});

describe('requirementParts', () => {
  it('formats every set requirement in order', () => {
    expect(requirementParts(serviceFixture.requirements, t)).toEqual([
      '2 GB RAM',
      '10 GB storage',
      'amd64 / arm64',
      'Needs internet',
    ]);
  });

  it('omits unset fields and needsInternet=false', () => {
    expect(requirementParts({ minRamGb: 1, needsInternet: false }, t)).toEqual(['1 GB RAM']);
  });

  it('returns an empty array when nothing is set', () => {
    expect(requirementParts(undefined, t)).toEqual([]);
    expect(requirementParts({}, t)).toEqual([]);
  });
});

describe('hasCatalogMeta', () => {
  it('is false with no data or only invalid links', () => {
    expect(hasCatalogMeta({})).toBe(false);
    expect(hasCatalogMeta({ links: [{ kind: 'website', url: 'http://x.org' }] })).toBe(false);
  });

  it('is true for a requirement or a valid link', () => {
    expect(hasCatalogMeta({ requirements: { minRamGb: 1 } })).toBe(true);
    expect(hasCatalogMeta({ links: [{ kind: 'guide', url: '/docs/a' }] })).toBe(true);
  });
});

describe('CatalogMeta', () => {
  it('renders nothing without props', () => {
    expect(render({})).toBe('');
  });

  it('renders nothing when all links are invalid and there are no requirements', () => {
    expect(render({ links: [{ kind: 'website', url: 'javascript:alert(1)' }] })).toBe('');
  });

  it('renders requirements and internal and external links for a service-like entry', () => {
    const html = render(serviceFixture);
    expect(html).toContain('Requirements: 2 GB RAM · 10 GB storage · amd64 / arm64 · Needs internet');
    expect(html).toContain('href="/docs/guides/x"');
    expect(html).toContain('>Documentation<');
    expect(html).toContain('href="https://example.org/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('>Website<');
    expect(html).not.toContain('javascript:');
  });

  it('renders an external link for an OS-like entry', () => {
    const html = render(osFixture);
    expect(html).toContain('Requirements: armhf');
    expect(html).toContain('href="https://example.org/dl"');
    expect(html).toContain('>Download<');
  });
});

describe('real catalogs', () => {
  it.each([
    ['services', services],
    ['operatingSystems', operatingSystems],
  ])('every %s entry has only links that pass safeHref', (_name, catalog) => {
    for (const entry of Object.values(catalog)) {
      for (const link of entry.links ?? []) {
        expect(safeHref(link.url), `${entry.key}: ${link.url}`).not.toBeNull();
      }
    }
  });
});
