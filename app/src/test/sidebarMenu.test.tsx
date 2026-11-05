import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { MemoryRouter } from 'react-router-dom';
import { createMenu, MenuItem } from '@/components/SidebarMenu';
import en from '@/i18n/locales/en.json';

const PDF_URL = 'https://example.org/pdf';

const menu = createMenu(PDF_URL, 'en');

const quickstart = menu.find((item) => item.titleKey === 'sidebar.quickstartGuides');
const downloads = menu.find((item) => item.titleKey === 'sidebar.downloads');
const essentialNetwork = quickstart?.children?.find(
  (item) => item.titleKey === 'sidebar.essentialServicesNetwork'
);

describe('sidebar menu structure', () => {
  it('orders the top-level menu with Community Box offerings first', () => {
    expect(menu.map((item) => item.titleKey)).toEqual([
      'sidebar.setupWizard',
      'sidebar.quickstartGuides',
      'sidebar.aiAssistant',
      'sidebar.downloads',
      'sidebar.solarCalculator',
      'sidebar.community',
      'sidebar.about'
    ]);
  });

  it('groups both download entries under the downloads group', () => {
    expect(downloads?.children?.map((item) => item.titleKey)).toEqual([
      'sidebar.downloadResearchPaper',
      'sidebar.downloadImages'
    ]);
    expect(downloads?.children?.[0].href).toBe(PDF_URL);
    expect(downloads?.children?.[1].to).toBe('guides/download-images');
  });

  it('has an icon on the downloads group', () => {
    expect(downloads?.icon).toBeTruthy();
  });

  it('merges essential services and network configuration into one subsection', () => {
    const subsectionKeys = quickstart?.children?.map((item) => item.titleKey) ?? [];
    expect(subsectionKeys).toContain('sidebar.essentialServicesNetwork');
    expect(subsectionKeys).not.toContain('sidebar.essentialServices');
    expect(subsectionKeys).not.toContain('sidebar.networkConfiguration');
  });

  it('keeps the seven merged entries in their previous order', () => {
    const children = essentialNetwork?.children ?? [];
    expect(children.slice(0, 6).map((item) => item.to)).toEqual([
      'guides/libremesh-overview',
      'guides/mesh-network-basics',
      'guides/dns-configuration',
      'guides/deployment-best-practices',
      'guides/router-selection-guide',
      'guides/libremesh-installation'
    ]);

    const imageFinder = children[6];
    expect(imageFinder.titleKey).toBe('sidebar.libreMeshImageFinder');
    expect(imageFinder.href).toBe('https://firmware-selector.libremesh.org/');
  });

  it('resolves titles for the merged entries in English', () => {
    const children = essentialNetwork?.children ?? [];
    for (const child of children.slice(0, 6)) {
      expect(child.title).toBeTruthy();
      expect(child.title).not.toBe(child.to);
    }
    // The merged subsection label itself exists in the English locale
    expect(en.sidebar.essentialServicesNetwork).toBe('🔧 Networks and Computers');
    expect(en.sidebar.downloads).toBe('Downloads');
  });
});

const i18n = i18next.createInstance();
void i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});

const renderItem = (item: Parameters<typeof MenuItem>[0]['item']) =>
  renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <MenuItem item={item} level={0} />
      </MemoryRouter>
    </I18nextProvider>
  );

describe('MenuItem rendering', () => {
  it('renders the downloads group as a keyboard-accessible toggle button', () => {
    const html = renderItem(downloads!);

    expect(html).toContain('<button type="button"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('Downloads');
  });

  it('renders a leaf link child as a docs anchor', () => {
    const downloadImages = downloads?.children?.find(
      (item) => item.titleKey === 'sidebar.downloadImages'
    );
    const html = renderItem(downloadImages!);

    expect(html).toContain('href="/docs/guides/download-images"');
  });
});
