import { describe, it, expect } from 'vitest';
import { resolveDocLink } from '@/lib/docLinks';

describe('resolveDocLink', () => {
  it('resolves a sibling file against the current doc directory and strips .md', () => {
    expect(resolveDocLink('nuc-models-comparison.md', 'hardware/intel_nuc/nuc-overview')).toEqual({
      kind: 'doc',
      to: '/docs/hardware/intel_nuc/nuc-models-comparison'
    });
  });

  it('resolves parent-directory segments and keeps the fragment', () => {
    expect(resolveDocLink('../guides/x.md#a', 'hardware/intel_nuc/nuc-overview')).toEqual({
      kind: 'doc',
      to: '/docs/hardware/guides/x#a'
    });
  });

  it('resolves a link without a .md extension', () => {
    expect(resolveDocLink('rpi-overview', 'hardware/raspberry_pi_5/rpi-models-comparison')).toEqual({
      kind: 'doc',
      to: '/docs/hardware/raspberry_pi_5/rpi-overview'
    });
  });

  it('keeps a fragment on a same-directory link', () => {
    expect(resolveDocLink('zima-overview.md#setup', 'hardware/zimaboard/zima-models-comparison')).toEqual({
      kind: 'doc',
      to: '/docs/hardware/zimaboard/zima-overview#setup'
    });
  });

  it('resolves from a top-level doc with no directory', () => {
    expect(resolveDocLink('guides/x.md', 'about')).toEqual({ kind: 'doc', to: '/docs/guides/x' });
  });

  it('ignores ./ segments and never climbs above the docs root', () => {
    expect(resolveDocLink('./a.md', 'guides/b')).toEqual({ kind: 'doc', to: '/docs/guides/a' });
    expect(resolveDocLink('../../../a.md', 'guides/b')).toEqual({ kind: 'doc', to: '/docs/a' });
  });

  it('passes external URLs through unchanged', () => {
    expect(resolveDocLink('https://example.org/a.md', 'guides/b')).toEqual({
      kind: 'passthrough',
      href: 'https://example.org/a.md'
    });
    expect(resolveDocLink('mailto:team@example.org', 'guides/b')).toEqual({
      kind: 'passthrough',
      href: 'mailto:team@example.org'
    });
    expect(resolveDocLink('//cdn.example.org/x', 'guides/b')).toEqual({
      kind: 'passthrough',
      href: '//cdn.example.org/x'
    });
  });

  it('routes root-absolute app paths through the router', () => {
    expect(resolveDocLink('/questionnaire', 'guides/b')).toEqual({ kind: 'route', to: '/questionnaire' });
    expect(resolveDocLink('/docs/guides/x#a', 'guides/b')).toEqual({ kind: 'route', to: '/docs/guides/x#a' });
  });

  it('passes anchor-only links through unchanged', () => {
    expect(resolveDocLink('#section', 'guides/b')).toEqual({ kind: 'passthrough', href: '#section' });
  });

  it('returns null when there is no href', () => {
    expect(resolveDocLink(undefined, 'guides/b')).toBeNull();
    expect(resolveDocLink('', 'guides/b')).toBeNull();
  });
});
