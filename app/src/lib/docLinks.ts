// Resolve relative in-doc markdown links against the current document's directory.
// External URLs, absolute paths and bare anchors pass through untouched.

export type ResolvedDocLink =
  | { kind: 'passthrough'; href: string } // external or anchor-only: render as-is
  | { kind: 'route'; to: string } // root-absolute app path: router Link (applies basename)
  | { kind: 'doc'; to: string }; // internal doc: router path under /docs/

// Links with a URI scheme (http:, mailto:, tel:...) or protocol-relative // URLs
const EXTERNAL_HREF = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

// Resolve a markdown link href relative to the doc served at currentDocPath
// (the route splat, e.g. 'hardware/intel_nuc/nuc-overview'). Returns null when
// there is no href to resolve.
export function resolveDocLink(href: string | undefined, currentDocPath: string): ResolvedDocLink | null {
  if (!href) {
    return null;
  }
  if (EXTERNAL_HREF.test(href) || href.startsWith('#')) {
    return { kind: 'passthrough', href };
  }
  if (href.startsWith('/')) {
    return { kind: 'route', to: href };
  }

  // Split off the fragment before resolving, then keep it verbatim
  const hashIndex = href.indexOf('#');
  const fragment = hashIndex >= 0 ? href.slice(hashIndex) : '';
  const target = (hashIndex >= 0 ? href.slice(0, hashIndex) : href).replace(/\.md$/i, '');

  // Resolve against the current document's directory, consuming . and ..
  const docPath = currentDocPath || '';
  const dir = docPath.includes('/') ? docPath.slice(0, docPath.lastIndexOf('/')) : '';
  const stack: string[] = [];
  for (const segment of `${dir}/${target}`.split('/')) {
    if (!segment || segment === '.') {
      continue;
    }
    if (segment === '..') {
      stack.pop();
    } else {
      stack.push(segment);
    }
  }

  return { kind: 'doc', to: `/docs/${stack.join('/')}${fragment}` };
}
